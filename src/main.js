import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vuerouter from 'vue-router'
import Home from './components/Home'
import Login from './components/Login'

Vue.config.productionTip = false
Vue.use(Vuerouter)

const routes = [
  { path: '/Home', component: Home },
  { path: '/', component: Login },
  { path: '/Login', component: Login }]
const router = new Vuerouter({
  routes,
  mode: 'history'
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
