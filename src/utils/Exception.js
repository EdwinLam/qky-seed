import {SYSTEM_INNER_ERROR} from './Constants'
export default class Exception {
  constructor ({code = SYSTEM_INNER_ERROR, msg}) {
    this.code = code
    this.msg = msg
  }
  print () {
    console.error(`[${this.code}]${this.msg}`)
  }
}
