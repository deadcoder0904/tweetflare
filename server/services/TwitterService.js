/*
 * [ TWITTER SERVICE ]
 * HERE'S ALL THE CONNECTION WITH
 * THE TWITTER OFFICIAL API
 *
 * RESPONSABILITIES OF THIS SERVICE
 * - Retrieve data from TwitterAPI
 * - Process data and format to Flare Model
 * - Save to Database so GraphQL can access it
 */

module.exports = {
  tweetService: require('./tweet/tweet.service'),
  userService: require('./user/user.service'),
}
