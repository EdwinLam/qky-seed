<template>
  <div :id="navId" ref="test">
    <div class="navbar navbar-default navbar-fixed-top headernav qkyhead white_blue" role="navigation">
      <!--项目信息-->
      <div class="qkyhead_logo fl"><img :src="navConfig.logo"></div>
      <div class="qkyhead_line"></div>
      <div class="qkyhead_pjname fl">{{navConfig.productName}}</div>
      <!--个人信息-->
      <div class="qkyhead_other fr clear">
        <div class="qkyhead_info fl">
          <div class="qkyhead_select">
            <a class="qkyhead_select_btn clear dropdown-toggle" data-toggle="dropdown">
              <div class="qkyhead_infophoto fl dist"><i class="qkyicon_mian">
                <img id="headImg" :src="navConfig.avatar" alt=""></i></div>
              <div class="qkyhead_schoolname fl" style="margin-right: 8px; display: none;"></div>
              <div class="qkyhead_infoname fl">{{navConfig.userName}}</div>
              <div class="qkyhead_sj fl"></div>
            </a>
            <ul class="qkyhead_select_menu dropdown-menu" style="">
              <li><a :href="navConfig.returnUrl">退出</a></li>
            </ul>
          </div>
        </div>
      </div>
      <!--导航条-->
      <ul class="qkyhead_nav">
        <li v-for="el in items" :key="el.name" :class="{ active: el.isActive}"><a
          href="javascript:void(0)" @click="itemClick(el)">{{el.name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import _ from 'lodash'
import { router } from '../../../router'
import { Common } from '../../../utils'
import Vue from 'vue'
export default {
  name: 'qky-nav',
  props: {
    navConfig: {
      type: Object,
      default () {
        return {
          navUrl: '',
          token: '',
          productName: '',
          theme: 'white_blue',
          showApps: true,
          showInfo: true,
          showMessages: true,
          proportion: 0.5,
          userName: '',
          avatar: '',
          logo: '',
          returnUrl: '',
          menus: []
        }
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.navId = uuidv1()
    this.initMenus()
    this.initActiveItem()
  },
  mounted () {
    // jwt存在则使用新方式
    if (!Common.isNull(this.navConfig.token) && !Common.isNull(this.navConfig.navUrl)) {
      this.initCommonNav()
    }
  },
  computed: {},
  methods: {
    itemClick (item) {
      this.items.forEach((el) => {
        el.isActive = el.name === item.name
      })
      this.$emit('on-select-change', item)
      if (item.routerName) {
        router.push({name: item.routerName})
      }
    },
    initActiveItem () {
      const ctx = this
      this.items[ctx.activeIndex].isActive = true
      if (this.items[ctx.activeIndex].routerName) {
        router.push({name: ctx.items[ctx.activeIndex].routerName})
      }
    },
    initMenus () {
      this.items = this.navConfig.menus.map(el => _.merge({}, el, {isActive: false}))
    },
    initCommonNav () {
      const ctx = this
      const {navUrl, token, productName, theme, showApps, showInfo, showMessages, proportion} = ctx.navConfig
      $.getScript(navUrl, () => {
        $(`#${ctx.navId}`).qkyNav({
          token,
          productName,
          theme,
          showApps,
          showInfo,
          showMessages,
          proportion,
          menus: [{name: 'sth', attrCont: "href='#'", isActive: true}],
          qkyNavAfter: function () {
            ctx.manualMountMenu()
          }
        })
      })
    },
    /* 手动重新挂载导航条(新版导航条) */
    manualMountMenu: function () {
      const ctx = this
      let MyComponent = Vue.extend({
        template: `<ul class="qkyhead_nav"><li v-for="el in items" :key="el.name" :class="{ active: el.isActive}"><a
          href="javascript:void(0)" @click="itemClick(el)">{{el.name}}</a>
        </li></ul>`,
        methods: {
          itemClick: ctx.itemClick
        },
        data: function () {
          return {
            items: ctx.items
          }
        }
      })
      new MyComponent().$mount($(`#${this.navId} .qkyhead_nav`)[0])
    }
  },
  data () {
    return {
      navId: '',
      navMenuId: '',
      items: [],
      value: ''
    }
  },
  watch: {
    navConfig: {
      menus () {
        this.initMenus()
      }
    },
    activeItem () {
      this.initActiveItem()
    }
  }
}
</script>

<style>
  @import './style/qkyhead.css';
</style>
