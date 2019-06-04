const { UserInputError } = require('apollo-server-express')
const { tweetService } = require('../../services/TwitterService')
const { client, getAsync, setAsync } = require('../../config/redis')

module.exports = {
  Query: {
    getAllTasks: async (_, args, { Flare }, info) => {
      // Fetch all tasks on database (admin porpouse)
      const fetchAllTasks = await Flare.find()
        .sort({ createdAt: 'desc' })
        .populate({
          path: 'createdBy',
          model: 'User',
        })
        .populate({
          path: 'inRoutines',
          model: 'Routine',
        })

      // Cache query for 60 seconds (1 minute)
      info.cacheControl.setCacheHint({ maxAge: 60 })

      return fetchAllTasks
    },
    getUserFavorites: async (parent, { user }, { Flare }, info) => {
      let favorites = await getAsync(`${user}-favorites`)

      if (!favorites) {
        favorites = await tweetService.getFavorites()
        await setAsync(`${user}-favorites`, JSON.stringify(favorites), 'EX', 30)
        return favorites
      }

      // Cache query for 60 seconds (1 minute)
      info.cacheControl.setCacheHint({ maxAge: 30 })
      return JSON.parse(favorites)
    },
  },

  Mutation: {
    newTask: async (_, { input }, { Flare, session }) => {
      // Verify required fields
      const { title, totalTime } = input
      if (!title || !totalTime) {
        throw new UserInputError('Missing required fields')
      }

      // Assing task to current user
      const { currentUser } = session
      input.createdBy = currentUser.userID

      // Create new task
      const newTask = await new Task(input).save()
      return newTask
    },
    updateTask: async (_, { taskId, input }, { Task }) => {
      // Verify required fields
      const updateTask = Flare.findOneAndUpdate({ _id: taskId }, input, {
        new: true,
      })

      return updateTask
    },

    deleteTask: async (_, { taskId }, { Flare }) => {
      // Delete user profile from database
      await Flare.findOneAndRemove({ _id: taskId })

      return {
        message: 'Task deleted',
        status: 200,
      }
    },
  },
}
