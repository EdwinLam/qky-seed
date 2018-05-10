<template>
  <div class="dropdown">
    <a class="btn btn-default dropdown-toggle auto" data-toggle="dropdown">
      <span class="value">{{activeName}}</span>
      <span class="caret"></span>
    </a>
    <ul class="dropdown-menu" role="menu" v-show="realItems.length">
      <li role="presentation" v-for="el in realItems" :key="el.name" :title="el.name" @click="itemClick(el)"><a href="javascript:void(0)">{{el.name}}</a></li>
    </ul>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'qky-select',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    value: [String, Number]
  },
  data () {
    return {
      currentValue: '',
      realItems: []
    }
  },
  computed: {
    activeName () {
      var ctx = this
      let activeName = ''
      if (ctx.realItems.length) {
        ctx.realItems.forEach((el) => {
          if (el.isActive) {
            activeName = el.name
          }
        })
        return activeName === '' ? '请选择' : activeName
      } else {
        return '暂无数据'
      }
    }
  },
  methods: {
    initActiveItem () {
      const ctx = this
      this.realItems.forEach((el) => {
        el.isActive = el.value === ctx.currentValue
      })
    },
    itemClick (item) {
      const ctx = this
      this.realItems.forEach((el) => {
        if (el.value === item.value) {
          el.isActive = true
          ctx.currentValue = el.value
        } else {
          el.isActive = false
        }
      })
      this.$emit('on-select-change', item)
    },
    initItems () {
      this.realItems = this.items.map(el => _.merge({}, el, {isActive: false}))
    }
  },
  created () {
    this.initItems()
    this.initActiveItem()
  },
  watch: {
    items () {
      this.initItems()
    },
    value (val) {
      this.currentValue = val
      this.initActiveItem()
    },
    currentValue (newVal) {
      this.$emit('input', newVal)
    }
  }
}
</script>
