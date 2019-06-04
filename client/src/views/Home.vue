<script>
import pulse from '@/plugins/pulse'
import firebase from 'firebase/app'

export default {
  data() {
    return {
      ...this.mapData({
        tasks: 'tasks/home',
      }),
    }
  },
  methods: {
    getAllTasks() {
      pulse.tasks.getAllTasks()
    },
    twitterLogin() {
      const provider = new firebase.auth.TwitterAuthProvider()

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          console.log(result)
        })
        .catch(error => {
          console.log(error)
        })
    },
  },
}
</script>

<template>
  <div class="home">
    <h1>Hello there</h1>
    <button @click="getAllTasks">Fetch</button>
    <button @click="twitterLogin">Firebase</button>

    <div v-if="tasks.length > 0">
      <ul>
        <li v-for="task in tasks" :key="task._id">
          {{ task.title }} - {{ task.priority }}
        </li>
      </ul>
    </div>
  </div>
</template>
