import Vue from 'vue'
import VueRouter from 'vue-router'
import {routers} from './router'
import { Auth, Common } from '../utils'
Vue.use(VueRouter)
// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers,
  saveScrollPosition: true
}

export const router = new VueRouter(RouterConfig)

router.beforeEach(async (to, from, next) => {
  try {
    // 特殊模式判断处理
    await Common.CMD({to})
    // 初始化数据
    await Auth.initData()
    // 获取真实跳转地址并跳转
    next(Auth.findMyWay({to, from}))
  } catch (e) {
    if (e.print) { e.print() } else {
      console.error((e))
    }
  }
})

router.afterEach((to) => {})
