const authenticated = next => (root, args, context, info) => {
  if (!context.session.currentUser) {
    throw new Error('Unauthenticated')
  }

  return next(root, args, context, info)
}

const mustBeSelf = next => (root, args, context, info) => {
  // Check if target user is the same logged in
  if (args.userId !== context.session.currentUser.userID) {
    throw new Error('Must be the same user to use this')
  }

  return next(root, args, context, info)
}

module.exports = {
  authenticated,
  mustBeSelf,
}
