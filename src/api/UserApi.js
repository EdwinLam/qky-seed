import fetch from './fetch'
export default class UserApi {
  static getUserInfo () {
    const params = {}
    return fetch.get('/sys/user/getUserInfo', {params})
  }
  static login ({username, password}) {
    const params = {username, password}
    return fetch.get('/sys/user/login', {params})
  }
}
