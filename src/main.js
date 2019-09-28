import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import Vuerouter from 'vue-router'
import Home from './components/Home'
import Login from './components/Login'
import Account from './components/Account'
import Operation from './components/Operation'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(Vuerouter)

const routes = [
  { path: '/Operation', component: Operation, meta: { requiresAuth: true } },
  { path: '/Account', component: Account, meta: { requiresAuth: true } },
  { path: '/Home', component: Home, meta: { requiresAuth: true } },
  { path: '/', component: Login, meta: { requiresAuth: false } },
  { path: '/Login', component: Login, meta: { requiresAuth: false }, name: 'login' }]

const router = new Vuerouter({
  routes,
  mode: 'history'
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
