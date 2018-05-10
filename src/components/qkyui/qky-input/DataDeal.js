
export default class DataDeal {
  static moneyDataDeal (data) {
    let result = data
    if (result.startsWith('.')) {
      result = '0' + result
    } else if (result.endsWith('.')) {
      result = result + '00'
    }
    return result
  }
}
