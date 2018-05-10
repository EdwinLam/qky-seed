import '../assets/libs/layer/layer.js'
import '../assets/libs/layer/skin/layer.css'

export default class UI {
  static loadingIndex = 0
  static loadingCount = 0
  static openLoading () {
    this.loadingCount++
    this.loadingIndex = window.layer.load(1, {
      shade: [0.3, '#000'],
      area: '64px'
    })
  }
  static closeLoading () {
    this.loadingCount--
    if (this.loadingCount <= 0) {
      this.loadingCount = 0
      window.layer.close(this.loadingIndex)
    }
  }
  /* 确定函数(yes)需要手动调用closeLayer(index)关闭弹出窗口 */
  static confirm ({msg, btn, yes, no}) {
    window.layer.confirm(msg, {btn}, yes, no)
  }
  static closeLayer (index) {
    window.layer.close(index)
  }
  static msg ({msg = '', time = 1000, icon = 1}) {
    window.layer.msg(msg, {time, icon})
  }
  static successMsg ({msg = '', time = 1000}) {
    this.msg({msg, time, icon: 1})
  }
  static errorMsg ({msg = '', time = 1000}) {
    this.msg({msg, time, icon: 2})
  }
  static warnMsg ({msg = '', time = 1000}) {
    this.msg({msg, time, icon: 7})
  }
  static alert ({msg = '', icon}) {
    window.layer.alert(msg, {icon})
  }
  static successAlert (msg) {
    this.alert({msg, icon: 1})
  }
  static errorAlert (msg) {
    this.alert({msg, icon: 2})
  }
  static warnAlert (msg) {
    this.alert({msg, icon: 7})
  }
}
