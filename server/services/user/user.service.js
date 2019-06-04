const twitter = require('../../config/twitter')
const User = require('./user.schema')

exports.getUser = async screen_name => {
  const findUser = await User.findOne({ screen_name })

  if (!findUser) {
    const fetchUser = await twitter.get('users/show', { screen_name })
    console.log(fetchUser.data)
    return fetchUser.data
  }

  return findUser
}
