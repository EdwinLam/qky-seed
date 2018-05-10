import store from '../store'
import {appRouter} from '../router/router'
import { UserApi } from '../api'
import Common from './Common'
import Exception from './Exception'
import {BUSINESS_ERROR} from './Constants'
import UI from './UI'
export default class Auth {
   static specialRouter = ['Main', '404', '403', 'Test1']
   static async initData () {
     if (!store.state.app.isInitFinish) { await store.dispatch('initApp') }
   }
   static findMyWay ({to, from}) {
     let next = {}
     /* 特殊页面不处理 */
     if (this.isSpecialRouter(to.name)) {
       return next
     }
     if (!this.checkRouter(to.name)) {
       next = {
         replace: true,
         name: '404'
       }
     } else if (!this.checkPurview(to.name)) {
       next = {
         replace: true,
         name: '403'
       }
     }
     return next
   }
   static async login ({username, password}) {
     UI.openLoading()
     const res = await UserApi.login({username, password})
     const {isSuccess, msg} = res.bizData
     if (isSuccess) {
       UI.closeLoading()
       const url = res.bizData.jumpToUrl
       let accessToken = Common.getQueryString(url, 'access_token')
       let returnUrl = document.location.protocol + '//' + window.location.host + '/sys/user/ssoLogin'
       window.location.href = `${url.substr(0, url.indexOf('?'))}?access_token=${accessToken}&returnUrl=${returnUrl}`
     } else {
       UI.closeLoading()
       UI.errorMsg({msg})
       throw new Exception({msg, code: BUSINESS_ERROR})
     }
     return res.bizData.isSuccess
   }
   static isSpecialRouter (moduleName) {
     return this.specialRouter.indexOf(moduleName) !== -1
   }
   static checkPurview (moduleName) {
     return store.state.app.moduleItems.some(el => el.url === moduleName)
   }
   static checkRouter (moduleName) {
     return appRouter[0].children.some(el => el.name === moduleName)
   }
}
