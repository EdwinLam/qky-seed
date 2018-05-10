import { UserApi } from '../../api'

const app = {
  state: {
    projectInfo: {},
    account: {},
    isInitFinish: false,
    moduleItems: []
  },
  actions: {
    /* 初始化用户数据 */
    async initApp ({commit}) {
      // 获取用户信息
      const res = await UserApi.getUserInfo()
      const { projectInfo, account } = res.bizData
      const moduleItems = res.bizData.authInfo.authModuleItems.map(el => {
        return {
          name: el.name, url: el.url
        }
      })
      commit('updateApp', {projectInfo, account, moduleItems})
    }
  },
  mutations: {
    updateApp (state, {projectInfo, account, moduleItems}) {
      state.projectInfo = projectInfo
      state.account = account
      state.moduleItems = moduleItems
      state.isInitFinish = true
    }
  }
}

export default app
