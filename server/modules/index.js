/*
 * [ GRAPHQL API ]
 * GraphQL MUST only access database, it should
 * NEVER request data to Twitter API
 */

const { gql } = require('apollo-server-express')
const { GraphQLModule } = require('@graphql-modules/core')

/*
 * Import all subfolder modules
 */

const globalModule = require('./Global/global.module')
const userModule = require('./User/user.module')
const flareModule = require('./Flare/flare.module')

/*
 * Import typeDefs, resolvers and schema
 */
const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

/*
 * Export new module
 */

module.exports = new GraphQLModule({
  typeDefs,
  imports: [globalModule, userModule, flareModule],
  context: async session => {
    /*
     * Pass Mongo Schemas as Context
     */
    return {
      session,
    }
  },
})
