const { gql } = require('apollo-server-express')

module.exports = gql`
  type User {
    _id: ID!
    username: String
    screen_name: String
    name: String!
    twitterProfile: TwitterProfile
    credentials: TwitterCredentials
    createdAt: String
    updatedAt: String
  }

  type TwitterProfile {
    name: String!
    location: String
    created_at: String!
    description: String
    entities: TwitterEntities
    favorites_count: Int
    followers_count: Int
    friends_count: Int
    twitter_id: Int!
    profile: TwitterProfileMeta
    screen_name: String!
    url: String
    verified: Boolean
  }

  type TwitterEntities {
    url: String
    description: String
  }

  type TwitterProfileMeta {
    profile_background_color: String
    profile_background_image_url: String
    profile_background_image_url_https: String
    profile_background_tile: Boolean
    profile_image_url: String
    profile_image_url_https: String
    profile_link_color: String
    profile_sidebar_border_color: String
    profile_sidebar_fill_color: String
    profile_text_color: String
    profile_use_background_image: Boolean
  }

  type TwitterCredentials {
    accessToken: String!
    secret: String!
  }

  input UserInput {
    username: String
    name: String
    twitterProfile: ProfileInput
    credentials: CredentialsInput
  }

  input ProfileInput {
    name: String!
    location: String
    created_at: String!
    description: String
    entities: EntitiesInput
    favorites_count: Int
    followers_count: Int
    friends_count: Int
    twitter_id: Int!
    profile: ProfileMetaInput
    screen_name: String!
    url: String
    verified: Boolean
  }

  input EntitiesInput {
    url: String
    description: String
  }

  input ProfileMetaInput {
    profile_background_color: String
    profile_background_image_url: String
    profile_background_image_url_https: String
    profile_background_tile: Boolean
    profile_image_url: String
    profile_image_url_https: String
    profile_link_color: String
    profile_sidebar_border_color: String
    profile_sidebar_fill_color: String
    profile_text_color: String
    profile_use_background_image: Boolean
  }

  input CredentialsInput {
    accessToken: String!
    secret: String!
  }

  type Query {
    verifyUsername(username: String!): ReturnMessage
  }

  type Mutation {
    login(input: UserInput!): User!
  }
`
