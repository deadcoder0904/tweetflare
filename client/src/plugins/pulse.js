import Vue from 'vue'
import Pulse from 'pulse-framework'
import apolloClient from './apollo'
import { gql } from 'apollo-boost'

const pulse = new Pulse.Library({
  collections: {
    tasks: {
      groups: ['home', 'group'],
      routes: {
        getAllTasks: async () => {
          const tasks = await apolloClient
            .query({
              query: gql`
                query {
                  getAllTasks {
                    _id
                    title
                    priority
                  }
                }
              `,
            })
            .then(({ data }) => {
              return data
            })
          return tasks
        },
      },
      actions: {
        async getAllTasks({ routes, collect }) {
          const fetchAllTasks = await routes.getAllTasks()
          collect(fetchAllTasks.getAllTasks, ['home'])
        },
      },
    },
  },
})

Vue.use(pulse)

export default pulse
