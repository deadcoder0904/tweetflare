const { GraphQLModule } = require('@graphql-modules/core')
const { authenticated, mustBeSelf } = require('../../utils/guards')

// Dependency modules
const globalModule = require('../Global/global.module')

/*
 * Import typeDefs, resolvers and schema
 */
const typeDefs = require('./user.type')
const resolvers = require('./user.resolver')
const schema = require('../../services/user/user.schema')

/*
 * Export new module
 */

module.exports = new GraphQLModule({
  typeDefs,
  resolvers,
  imports: [globalModule],
  context: async session => {
    /*
     * Pass Mongo Schemas as Context
     */
    return {
      session,
      User: schema,
    }
  },

  // /*
  //  * Gralphql Module "midleware-like" guard
  //  */
  // resolversComposition: {
  //   'Query.getCurrentUser': [authenticated],
  //   'Mutation.editUser': [authenticated, mustBeSelf],
  //   'Mutation.deleteAccount': [authenticated, mustBeSelf],
  // },
})
