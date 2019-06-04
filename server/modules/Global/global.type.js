const { gql } = require('apollo-server-express')

module.exports = gql`
  type ReturnMessage {
    message: String
    status: String
  }

  input ReturnMessageInput {
    message: String
    status: String
  }
`
