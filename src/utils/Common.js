import '../assets/libs/layer/layer.js'
import '../assets/libs/layer/skin/layer.css'
import {CMD_LOGIN} from './Constants'
import Auth from './Auth'
export default class Common {
  static async CMD ({to}) {
    let cmd = to.query.cmd
    switch (cmd) {
      case CMD_LOGIN: {
        await Auth.login({username: to.query.username, password: to.query.password})
        break
      }
    }
  }
  static getQueryString (url, name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    url = url.substr(url.indexOf('?'))
    var r = url.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2]); return null
  }
  /* 获取鼠标选择位置信息 */
  static getSelectionPosition (e) {
    // Mozilla and DOM 3.0
    if ('selectionStart' in e) {
      var l = e.selectionEnd - e.selectionStart
      return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) }
    } else if (document.selection) { // IE
      e.focus()
      var r = document.selection.createRange()
      var tr = e.createTextRange()
      var tr2 = tr.duplicate()
      tr2.moveToBookmark(r.getBookmark())
      tr.setEndPoint('EndToStart', tr2)
      if (r == null || tr == null) return { start: e.value.length, end: e.value.length, length: 0, text: '' }
      var textPart = r.text.replace(/[\r\n]/g, '.') // for some reason IE doesn't always count the \n and \r in the length
      var textWhole = e.value.replace(/[\r\n]/g, '.')
      var theStart = textWhole.indexOf(textPart, tr.text.length)
      return { start: theStart, end: theStart + textPart.length, length: textPart.length, text: r.text }
    } else return { start: e.value.length, end: e.value.length, length: 0, text: '' }
  }
  static isNull (str) {
    return !str || !str.length
  }
}
