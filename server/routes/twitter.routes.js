const express = require('express')
const puppeteer = require('puppeteer')
const router = express.Router()
const { getAsync, setAsync } = require('../config/redis')
const { tweetService } = require('../services/TwitterService')

router.get('/:user/favs', async (req, res, next) => {
  const user = req.params.user
  let parsed = false

  if (!user) {
    let error = new Error('Missing username')
    error.statusCode = 401
    throw error
  }

  // Try to fetch from Redis cache
  let favorites = await getAsync(`${user}-favorites`)

  if (!favorites) {
    // Fetch from Twitter API
    favorites = await tweetService.getFavorites()
    parsed = true

    // Create Redis cache
    await setAsync(`${user}-favorites`, JSON.stringify(favorites), 'EX', 30)
  }

  res.status(200).send({
    favorites: parsed ? favorites : JSON.parse(favorites),
  })
})

// router.get('/:user/:tweetId', async (req, res, next) => {
//   const getTweet = await tweetService.getFirstTweetOfThread(req.params.tweetId)

//   if (getTweet) {
//     const replies = await tweetService.getTweetReplies(
//       getTweet.tweetId,
//       getTweet.user.screen_name,
//     )

//     return res.status(200).send({
//       thread: replies,
//     })
//   }

//   return res.status(404).send({
//     message: 'not found',
//   })
// })
// router.get('/:user/:tweetId', async (req, res, next) => {
//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox', '--disable-dev-shm-usage'],
//     executablePath: '/usr/bin/chromium-browser',
//   })
//   const page = await browser.newPage()
//   await page.goto(
//     `https://twitter.com/${req.params.user}/status/${req.params.tweetId}`,
//   )
//   let tweets = await page.evaluate(() => {
//     let data = []
//     let elements = document.getElementsByClassName('tweet')
//     for (var element of elements) {
//       const name = element.querySelector('.fullname').textContent
//       const username = element.querySelector('.username ').textContent
//       const date = element
//         .querySelector('._timestamp ')
//         .getAttribute('data-time')
//       const tweetId = element.getAttribute('data-tweet-id')
//       const tweet = element.querySelector('.tweet-text').textContent
//       const avatar = element.querySelector('.avatar').getAttribute('src')
//       data.push({
//         name,
//         username,
//         date,
//         tweetId,
//         tweet,
//         avatar,
//       })
//     }
//     return data
//   })

//   res.status(200).send(tweets)

//   await browser.close()
// })

router.get('/:user/:tweetId', async (req, res, next) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: '/usr/bin/chromium-browser',
  })
  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: 800,
      height: 1200,
    })

    await page.setRequestInterception(true)
    page.on('request', request => {
      if (request.url().endsWith('.json')) {
        console.log(request)
      }
      request.continue()
    })

    // page.on('response', async response => {
    //   if (
    //     response.request().resourceType() === 'xhr' &&
    //     response.url().includes(`conversation/${req.params.tweetId}`)
    //   ) {
    //     let parsedRes = await response.json()
    //     console.log(parsedRes)
    //   }
    // })

    await page.goto(
      `https://mobile.twitter.com/${req.params.user}/status/${
        req.params.tweetId
      }`,
    )

    // await autoScroll(page)
    let tweets = await page.evaluate(extractData)

    await browser.close()

    // const fetchEachTweet = await tweetService.getTweetByIdFromArray(tweets)
    return res.status(200).send({
      totalTweets: tweets.length,
      thread: tweets,
    })
  } catch (error) {
    return res.status(401).send(error)
  }
})

const extractData = async () => {
  let data = []
  try {
    let elements = document.querySelectorAll('article')
    for (var element of elements) {
      const pageTweetId = element.querySelector('span').textContent
      data.push(pageTweetId)
    }
  } catch (error) {
    console.log(error)
  }
  return data
}

const autoScroll = async page => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0
      let distance = 100
      let timer = setInterval(() => {
        let scrollHeight = document.getElementById('permalink-overlay')
          .scrollHeight
        document.getElementById('permalink-overlay').scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  })
}

module.exports = router
