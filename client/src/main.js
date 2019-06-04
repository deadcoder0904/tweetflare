import Vue from 'vue'
import VueWait from 'vue-wait'
import VueApollo from 'vue-apollo'

import './plugins/vuetify'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import apolloClient from '@/plugins/apollo'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.config.productionTip = false

const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

firebase.initializeApp(config)

Vue.use(VueApollo)

const apolloProvider = new VueApollo({ apolloClient })

new Vue({
  apolloProvider,
  router,
  i18n,
  wait: new VueWait(),
  render: h => h(App),
}).$mount('#app')
