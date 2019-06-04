/*
 * [ ROUTES ]
 * Here goes routes to communicate
 * the TwitterService and GraphQL
 * databases
 */
const express = require('express')
const router = express.Router()
const twitterRoutes = require('./twitter.routes')

/*
 * Twitter API Routes
 */
router.use('/flare', twitterRoutes)

module.exports = router
