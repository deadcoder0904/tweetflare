const redis = require('redis')
const { promisify } = require('util')
const client = redis.createClient({
  host: 'redis',
})
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

module.exports = {
  client,
  getAsync,
  setAsync,
}
