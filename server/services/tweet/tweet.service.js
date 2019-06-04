const twitter = require('../../config/twitter')
const Tweet = require('./tweet.schema')
const Flare = require('../../modules/Flare/flare.schema')

/*
 * Twitter API
 */

// Get 50 favorites from Twitter API
exports.getFavorites = async args => {
  args = args || {}
  let twitterAPIArgs = { ...args, tweet_mode: 'extended', count: 30 }

  // Request user favorites
  const favorites = await twitter.get('favorites/list', twitterAPIArgs)

  // Iterate from Favorites array and save each tweet to database
  const parsedFavorites = await findOrSaveTweets(favorites.data)

  // Return tweet
  return parsedFavorites
}

exports.getTweetByIdExtended = async tweetId => {
  const fetchTweet = await twitter.get('statuses/show', {
    id: tweetId,
    tweet_mode: 'extended',
  })
  return saveTweet(fetchTweet.data)
}

exports.getTweetById = async tweetId => {
  const fetchTweet = await twitter.get('statuses/show', {
    id: tweetId,
  })
  return saveTweet(fetchTweet.data)
}

exports.getTweetFromLabs = async tweetId => {
  const fetchTweet = await twitter.get('/labs/1/tweets', {
    id: tweetId,
  })
  return fetchTweet.data
}

exports.getTweetByIdFromArray = async tweetArray => {
  const tweetIdsAsString = tweetArray.join()
  const fetchTweets = await twitter.get('statuses/lookup', {
    id: tweetIdsAsString,
  })

  let parsedTweets = []

  for (let tweet of fetchTweets.data) {
    const saveTweetsToDatabase = await saveTweet(tweet)
    parsedTweets.push(saveTweetsToDatabase)
  }

  return parsedTweets
}

exports.getFirstTweetOfThread = async tweetId => {
  const fetchTweet = await this.getTweetById(tweetId)

  if (isReply(fetchTweet)) {
    return this.getFirstTweetOfThread(
      fetchTweet.replyMeta.in_reply_to_status_id_str,
    )
  } else {
    return fetchTweet
  }
}

exports.searchTweet = async params => {
  const findReplies = await twitter.get('search/tweets', params)

  return findReplies.data
}

exports.getTweetReplies = async (tweetId, user) => {
  const findReplies = await twitter.get('search/tweets', {
    to: user,
    since_id: tweetId,
    tweet_mode: 'extended',
    count: 100,
  })

  let repliesArray = findReplies.data.statuses
  return await Promise.all(
    repliesArray
      .filter(tweet => {
        return tweet.in_reply_to_status_id_str == tweetId
      })
      .map(async tweet => {
        // search database for each tweet
        const findTweet = await findSingleTweetOnDatabase(tweet.id_str)

        // if not found, save it
        if (!findTweet) {
          return await saveTweet(tweet)
        }

        return findTweet
      }),
  )
}

/*
 * Tweets Parser
 */

const findOrSaveTweets = async array => {
  return await Promise.all(
    array.map(async tweet => {
      // search database for each tweet
      const findTweet = await findSingleTweetOnDatabase(tweet.id_str)

      // if not found, save it
      if (!findTweet) {
        return await saveTweet(tweet)
      }

      return findTweet
    }),
  )
}

const findSingleTweetOnDatabase = async tweetId => {
  return await Tweet.findOne({ tweetId: tweetId })
}

const saveTweet = async tweet => {
  // Custom fields on database
  tweet.tweetId = tweet.id_str
  tweet.replyMeta = {
    in_reply_to_status_id: tweet.in_reply_to_status_id,
    in_reply_to_status_id_str: tweet.in_reply_to_status_id_str,
    in_reply_to_user_id: tweet.in_reply_to_user_id,
    in_reply_to_user_id_str: tweet.in_reply_to_user_id_str,
    in_reply_to_screen_name: tweet.in_reply_to_screen_name,
  }

  tweet.quoteMeta = {
    quoted_status_id_str: tweet.quoted_status_id_str,
    quoted_status_permalink: tweet.quoted_status_permalink,
    quoted_status: tweet.quoted_status,
  }

  if (!tweet.full_text) {
    tweet.full_text = tweet.text
  }

  const newTweet = await new Tweet(tweet).save()
  return newTweet
}

const turnTweetIntoFlare = async (user, tweet) => {
  const newFlare = await new Flare({
    userId: user._id,
    tweetId: tweet.id_str,
    tweetText: tweet.full_text,
    tweetEntities: tweet.extended_entities,
  })
}

const isReply = tweet => {
  return (
    tweet.replyMeta.in_reply_to_status_id_str !== undefined &&
    tweet.replyMeta.in_reply_to_status_id_str !== null
  )
}
