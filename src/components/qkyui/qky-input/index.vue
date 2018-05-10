<template>
  <div>
    <input type="text" class="form-control" :placeholder="placeholder" v-model="currentValue"  v-show="!isView" @keypress="inputSth" @keyup="keyUpSth" @paste="pasteSth">
    <span v-show="isView">{{currentValue}}</span>
  </div>
</template>
<script>
import {INPUT_TYPE_MONEY, INPUT_TYPE_NUMBER} from './Constants'
import {Common} from '../../../utils'
import DataDeal from './DataDeal'
export default {
  name: 'qky-input',
  props: {
    value: [String, Number],
    placeholder: [String],
    type: String,
    regExp: String,
    isView: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 10000
    }
  },
  data () {
    return {
      currentValue: '',
      oldValue: ''
    }
  },
  computed: {
  },
  methods: {
    getRealRegExp () {
      let regExp = this.regExp
      switch (this.type) {
        case INPUT_TYPE_MONEY: {
          regExp = /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/
          break
        }
        case INPUT_TYPE_NUMBER: {
          regExp = /^[1-9]\d*$/
          break
        }
      }
      return regExp
    },
    /* 输入内容规则校验 */
    checkRule (value) {
      let isSuc = true
      if (Common.isNull(value)) return isSuc
      let realRegExp = this.getRealRegExp()
      if (!Common.isNull(this.maxLength) && value.length >= this.maxLength) {
        isSuc = false
      } else if (realRegExp && !realRegExp.test(value)) {
        isSuc = false
      }
      return isSuc
    },
    getNewValueInfo (event, insertValue) {
      const {start, end} = Common.getSelectionPosition(event.target)
      let oldValue = event.target.value
      let newValue = oldValue.substr(0, start) + insertValue + oldValue.substr(end)
      let realValue = newValue
      switch (this.type) {
        case INPUT_TYPE_MONEY: {
          realValue = DataDeal.moneyDataDeal(newValue)
          break
        }
      }
      realValue = realValue || ''
      newValue = newValue || ''
      return {realValue, newValue}
    },
    keyUpSth: function (event) {
      const {realValue, newValue} = this.getNewValueInfo(event, '')
      if (!this.checkRule(realValue)) {
        event.target.value = this.oldVal
      } else {
        if (realValue !== newValue) {
          this.currentValue = realValue
        }
        this.oldVal = realValue
      }
    },
    validate: function (event, insertValue) {
      const {newValue, realValue} = this.getNewValueInfo(event, insertValue)
      if (!this.checkRule(realValue)) {
        event.preventDefault()
      } else {
        if (newValue !== realValue) {
          this.currentValue = realValue
          event.preventDefault()
        }
      }
    },
    inputSth: function (event) {
      this.oldVal = event.target.value
      this.validate(event, String.fromCharCode(event.charCode))
    },
    pasteSth: function (event) {
      this.oldVal = event.target.value
      this.validate(event, event.clipboardData.getData('text'))
    }
  },
  created () {
    this.currentValue = this.value
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>
