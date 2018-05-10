<template>
  <div class="row">
    <div>
      <qky-select :items="testItems" v-model="name"></qky-select>
      <qky-input v-model="inputVal" type="number" placeholder="请输入正整数"></qky-input>
      <qky-page></qky-page>
    </div>
  </div>
</template>

<script>
import {QkySelect, QkyInput, QkyPage} from '../qkyui'
export default {
  components: {QkySelect, QkyInput, QkyPage},
  data () {
    return {
      name: 'abc',
      inputVal: '',
      testItems: [{name: '测试1', value: 'abc'}, {name: '测试2', value: 'dfg'}, {name: '测试3', value: 'hij'}]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
