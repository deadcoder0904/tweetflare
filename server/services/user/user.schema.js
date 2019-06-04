const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    twitterProfile: {
      type: Object,
      required: true,
    },
    credentials: {
      accessToken: {
        type: String,
        required: true,
      },
      secret: {
        type: String,
        required: true,
      },
    },
    flares: {
      type: [Schema.Types.ObjectId],
      ref: 'Flare',
    },
  },
  {
    timestamps: true,
  },
)

userSchema.index({
  username: 1,
  name: 'text',
})

module.exports = mongoose.model('User', userSchema)
