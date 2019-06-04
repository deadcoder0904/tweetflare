const { gql } = require('apollo-server-express')

module.exports = gql`
  type Tweet {
    _id: ID!
    created_at: String!
    tweetId: String
    text: String
    full_text: String
    truncated: Boolean
    entities: TweetEntity
    source: String
    replyMeta: TweetReplyMeta
    user: User!
    geo: String
    retweet_count: Int!
    favorite_count: Int!
    lang: String
  }

  type TweetEntity {
    hashtags: [String]
    symbols: [String]
    user_mentions: [String]
    urls: [String]
    media: [String]
  }

  type TweetReplyMeta {
    in_reply_to_status_id: String
    in_reply_to_status_id_str: String
    in_reply_to_user_id: String
    in_reply_to_user_id_str: String
    in_reply_to_screen_name: String
  }

  input TweetInput {
    created_at: String!
    id: String
    text: String
    full_text: String
    truncated: Boolean
    entities: TweetEntityInput
    source: String
    replyMeta: ReplyMetaInput
    user: UserInput!
    geo: String
    retweet_count: Int!
    favorite_count: Int!
    lang: String
  }

  input TweetEntityInput {
    hashtags: [String]
    symbols: [String]
    user_mentions: [String]
    urls: [String]
  }

  input ReplyMetaInput {
    in_reply_to_status_id: String
    in_reply_to_status_id_str: String
    in_reply_to_user_id: String
    in_reply_to_user_id_str: String
    in_reply_to_screen_name: String
  }

  type Query {
    getAllTasks: [Tweet]!
    getUserFavorites(user: String!): [Tweet]
  }

  type Mutation {
    newTask(input: TweetInput): Tweet!
    updateTask(taskId: ID!, input: TweetInput): Tweet!
    deleteTask(taskId: ID!): ReturnMessage
  }
`
