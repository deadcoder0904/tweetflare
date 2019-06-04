const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tweetSchema = new Schema(
  {
    created_at: {
      type: Date,
      required: true,
      default: new Date(),
    },
    tweetId: {
      type: String,
      required: true,
    },
    full_text: {
      type: String,
    },
    entities: {
      type: Object,
    },
    extended_entities: {
      type: Object,
    },
    source: {
      type: String,
    },
    replyMeta: {
      type: Object,
    },
    user: {
      type: Object,
      required: true,
    },
    is_quote_status: {
      type: Boolean,
      default: false,
    },
    quoteMeta: {
      quoted_status_id_str: {
        type: String,
      },
      quoted_status_permalink: {
        type: Object,
      },
      quoted_status: {
        type: Object,
      },
    },
    retweet_count: {
      type: Number,
      required: true,
      default: 0,
    },
    favorite_count: {
      type: Number,
      required: true,
      default: 0,
    },
    lang: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

tweetSchema.index({
  username: 1,
  name: 'text',
})

module.exports = mongoose.model('Tweet', tweetSchema)
