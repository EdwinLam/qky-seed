<template>
  <div class="qkypage row mt15 mb5">
    <div class="col-md-2 col-sm-3 pageinfo">{{startPage}}-{{endPage}} of {{total}} 项目</div>
    <div class="col-md-8 col-sm-7 col-md-offset-2 col-sm-offset-2 col-xs-8 col-xs-offset-4">
      <ul class="nav nav-pills">
        <li :class="prevClasses"><a href="javascript:void(0)" @click="prev">上一页</a></li>
        <li v-for="el in pageItems" :key="el" :class="{ellipsis:el==='ellipsis',active:currentPage==el}">
          <a href="javascript:void(0)"  v-if="el!=='ellipsis'" @click="changePage(el)">{{el}}</a>
          <a v-if="el==='ellipsis'">...</a>
        </li>
        <li :class="nextClasses"><a href="javascript:void(0)" @click="next">下一页</a></li>
        <li class="form-group mb0 page_input">
          <qky-input  placeholder="输入页数" type="number" v-model="inputNumber"></qky-input>
        </li>
        <li class="page_input"><a class="btn btn-default" @click="gotoPage">GO</a></li>
      </ul>
    </div>
  </div>
</template>
<script>
import QkyInput from '../qky-input/index'
import {Common} from '../../../utils'

export default {
  name: 'qky-page',
  components: {QkyInput},
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showNum: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      currentPage: 1,
      currentPageSize: 10,
      pageItems: [],
      inputNumber: ''
    }
  },
  computed: {
    startPage () {
      return (this.currentPage - 1) * this.currentPageSize + 1
    },
    endPage () {
      return this.currentPage * this.currentPageSize > this.total ? this.total : this.currentPage * this.currentPageSize
    },
    allPages () {
      const allPage = Math.ceil(this.total / this.currentPageSize)
      return (allPage === 0) ? 1 : allPage
    },
    prevClasses () {
      return [
        'page_prv',
        {
          'disabled': this.currentPage === 1
        }
      ]
    },
    nextClasses () {
      return [
        'page_next',
        {
          'disabled': this.currentPage === this.allPages
        }
      ]
    }
  },
  methods: {
    initPageItems () {
      let pages = []
      var s = this.showNum
      var total = this.allPages
      if (total === 0) {
        this.pageItems = []
        return
      }
      var half = Math.floor(s / 2)
      var start = this.currentPage - half + 1 - s % 2
      var end = this.currentPage + half
      // handle boundary case
      if (start <= 0) {
        start = 1
        end = s
      }
      if (end > total) {
        start = total - s + 1
        end = total
      }
      start = start <= 0 ? 1 : start
      pages.push(1)
      if (start > 2) {
        pages.push('ellipsis')
      }
      for (let itPage = start; itPage <= end; itPage++) {
        if (itPage === 1 || itPage === total) {
          continue
        }
        pages.push(itPage)
      }
      if (end < total - 1) {
        pages.push('ellipsis')
      }
      pages.push(total)
      this.pageItems = pages
    },
    gotoPage () {
      if (Common.isNull(this.inputNumber)) return
      let page = this.currentPage
      try {
        page = parseInt(this.inputNumber)
      } catch (e) {
        return
      }
      page = page > this.allPages ? this.allPages : page
      page = page < 1 ? 1 : page
      this.changePage(page)
      this.inputNumber = ''
    },
    changePage (page) {
      if (this.currentPage !== page) {
        this.currentPage = page
        this.$emit('on-change', page)
      }
    },
    prev () {
      const current = this.currentPage
      if (current <= 1) {
        return false
      }
      this.changePage(current - 1)
    },
    next () {
      const current = this.currentPage
      if (current >= this.allPages) {
        return false
      }
      this.changePage(current + 1)
    }
  },
  mounted () {
    this.initPageItems()
    this.currentPage = this.current
    this.currentPageSize = this.pageSize
  },
  watch: {
    total (val) {
      let maxPage = Math.ceil(val / this.currentPageSize)
      if (maxPage < this.currentPage && maxPage > 0) {
        this.currentPage = maxPage
      }
    },
    current (val) {
      this.currentPage = val
    },
    currentPage () {
      this.initPageItems()
    },
    currentPageSize () {
      this.initPageItems()
    },
    pageSize (val) {
      this.currentPageSize = val
      this.initPageItems()
    }
  }
}
</script>
<style lang="scss" scoped>
  .qkypage {
    .nav{
      .ellipsis{
        user-select:none;
        a:hover{
          background: none;
        }
      }
    }
  }
</style>
