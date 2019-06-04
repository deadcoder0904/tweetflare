const mongoose = require('mongoose')
const Schema = mongoose.Schema

const flareSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tweetId: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
    tweetText: {
      type: String,
    },
    tweetEntities: {
      type: [Map],
    },
    tweetReplies: {
      type: [Map],
    },
    tweetAuthor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: [String],
    },
    comments: {
      type: [String],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

flareSchema.index({
  tweetId: 1,
  tweetText: 'text',
  tweetAuthor: 'text',
})

module.exports = mongoose.model('Flare', flareSchema)
