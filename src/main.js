// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import { sync } from 'vuex-router-sync'
import store from './store'
import axios from './api/fetch'
import $ from 'jquery'
// bootstrap.
import './assets/libs/bootstrap/3.3.0/css/bootstrap.min.css'
import './assets/libs/bootstrap/3.3.0/js/bootstrap.min'
import './css/main.sass'
window.jQuery = $
Vue.prototype.$http = axios
Vue.config.productionTip = false
sync(store, router)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  mounted () {

  }
})
