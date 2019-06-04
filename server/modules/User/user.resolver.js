const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server-express')

module.exports = {
  Query: {
    verifyUsername: async (_, { username }, { User }) => {
      // Search database for provided username
      const findUsername = await User.findOne({ username })
      if (findUsername) {
        return {
          message: 'Username already exists',
          status: 401,
        }
      }
      return {
        message: 'Username available',
        status: 200,
      }
    },
  },

  Mutation: {
    login: async (_, { username, password }, { User }) => {
      /*
       * twitter.setAuth(tokens)
       */

      const user = await User.findOne({ username })
      const userID = user._id

      // Check if a user was found
      if (!user) {
        throw new Error('User not found')
      }

      // Validate provided password
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        throw new Error('Invalid Password')
      }

      // Generate User token
      const token = jwt.sign({ username, userID }, process.env.SECRET, {
        expiresIn: '1h',
      })

      // Add token info to database
      const now = new Date()
      user.token = token
      user.tokenExpiresIn = now.setHours(now.getHours() + 1)

      await user.save()

      return user
    },
  },
}
