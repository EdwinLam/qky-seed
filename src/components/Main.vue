<template>
  <div>
    <qky-nav :navConfig="navConfig"></qky-nav>
    <div class="container po_r mt15">
      <router-view></router-view>
    </div>
    <qky-footer>全通教育集团（广东）股份有限公司  版权所有  ©2007-2015</qky-footer>
  </div>
</template>

<script>
import {QkyNav, QkyFooter} from './qkyui'
import { UI } from '../utils'
export default {
  name: 'Main',
  components: {
    QkyNav, QkyFooter
  },
  async mounted () {
    // CommonUtil.openLoading()
    // CommonUtil.confirm({msg: 'hello',
    //   yes: (index) => {
    //     CommonUtil.closeLayer(index)
    //     alert('ok')
    //   }})
    UI.successAlert('hi')
    // setTimeout(() => {
    //   CommonUtil.closeLoading()
    // }, 2000)
  },
  data () {
    return {
      navConfig: {
        navUrl: 'http://open.dev.qky100.com/qkynav/2.0/js/qkynav.js',
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZWI2MDU3NjYxZGQxMWU1ODYzNWZhMTYzZTBlOTBkMyIsInBob25lIjoiMTU4MTMxNzc5MDMiLCJzZXJ2aWNlTW9kZSI6MCwiYWdlbmN5Q29kZSI6IjEyNDUwMTAxIiwiaXNzIjoiaHR0cDovL2FwaS5kZXYucWt5MTAwLmNvbSIsInNjaG9vbENvZGUiOiI4ODAwMzAwLTEiLCJ1c2VyVHlwZSI6MSwiZXhwIjoxNDk4NzA1Mzg5LCJsb2dpblNvdXJjZSI6Imh0dHA6Ly9kZXYucWt5MTAwLmNvbSIsImhlYWRJbWFnZSI6Imh0dHA6Ly9zaHAucXBpYy5jbi9iaXptcC9ZZHhCQ3ZrT0lyQWFETEJDN1cxRk9senVNalB4ZHB1NFJpYkVpYzZVcVFRVk95ZXFFYmliSmljTWtBLyIsIm5hbWUiOiLpu4TlpKnmlL8iLCJhdWQiOiJRS1lfR1JPV19QQyIsInByb2plY3RJY29uIjoiaHR0cDovL2tzMy5xa3kxMDAuY29tLzIwMTcwNjE5MDk0MTU2LkRlalkyQk1USnoucG5nIn0.psQpIDmlE2K4uL6BAFjx_dLXDQ-6dnvlWT1sFaKhYfKYt_-y8yjaxVGE7MYdCNzGZTmgyWnvZ35pb9VqUJqfYD0VGdtpd6IRqy8F4YFtbBK-5CFlIiBNihKrJ5Z0p_Koo4Gjn9pnAiCYoQOL_F5MbPwtamzqAg3pDlBYf13dDHw',
        productName: '测试系统',
        userName: 'Edwin',
        avatar: 'http://ks3.qky100.com/20170915181059.Mzm9xbmfQU.jpg',
        logo: 'http://ks3.qky100.com/20170914174239.EjltPHWW8F.png',
        returnUrl: '',
        menus: [{name: '测试1', routerName: 'Test1'}, {name: '测试2', routerName: 'Test2'}, {name: '测试3', routerName: 'Test3'}]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
