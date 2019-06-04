/*
 *  Apollo Server
 */
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const { RedisCache } = require('apollo-server-cache-redis')

/*
 *  Mongoose import and setup
 */
const mongoose = require('mongoose')

/*
 *  Token
 */
const jwt = require('jsonwebtoken')
require('dotenv').config()

/*
 *  Define App and Port
 */
const app = express()
const port = process.env.APP_PORT || 8080
const router = require('./routes')
app.use(cors())
app.use(bodyParser.json())
app.use(router)

// SET HEADERS
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*') // TODO: change to app domain
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

//   next()
// })

/*
 * Routes and Error Handling
 */

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ error: message, data: data })
})

/*
 *  Apollo setup
 */
const modules = require('./modules')

const server = new ApolloServer({
  modules: [modules],
  cache: new RedisCache({
    host: 'redis',
  }),
  context: async ({ req }) => {
    const token = req.headers.authorization || ''
    return { currentUser: await getUser(token) }
  },
})
server.applyMiddleware({ app })

// Verify JWT token passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch (error) {
      throw new AuthenticationError(
        'Your session has ended. Please login again',
      )
    }
  }
}

/*
 *  Connect to Mongo then start the app
 */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('\n\n')
    console.log(`✅  [MONGO] CONNECTED\n`)
    app.listen(port, () => {
      console.log(`🚀  [SERVER] listening on http://localhost:${port}\n`)
      console.log(
        `🖥  [GRAPHQL] on http://localhost:${port}${server.graphqlPath}\n`,
      )
    })
  })
  .catch(err => console.log(err))
