const { GraphQLModule } = require('@graphql-modules/core')

/*
 * Import typeDefs, resolvers and schema
 */
const typeDefs = require('./global.type')

/*
 * Export new module
 */

module.exports = new GraphQLModule({
  typeDefs,
})
