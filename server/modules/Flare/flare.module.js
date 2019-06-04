const { GraphQLModule } = require('@graphql-modules/core')
// const { authenticated } = require('../../utils/guards')

// Dependency modules
const globalModule = require('../Global/global.module')
const userModule = require('../User/user.module')

/*
 * Import typeDefs, resolvers and schema
 */
const typeDefs = require('./flare.type')
const resolvers = require('./flare.resolver')
const schema = require('./flare.schema')

/*
 * Export new module
 */

module.exports = new GraphQLModule({
  typeDefs: [typeDefs],
  resolvers,
  imports: [globalModule, userModule],
  context: async session => {
    /*
     * Pass Mongo Schemas as Context
     */
    return {
      session,
      Flare: schema,
    }
  },

  // /*
  //  * Gralphql Module "midleware-like" guard
  //  */
  // resolversComposition: {
  //   'Query.getAllTasks': [authenticated],
  //   'Query.getUserTasks': [authenticated],
  //   'Mutation.newTask': [authenticated],
  //   'Mutation.updateTask': [authenticated],
  // },
})
