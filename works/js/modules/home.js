/**
 * Created by tengen on 2017/3/14 0014.
 */
define(function (require) {
    var $ = require('jquery');
    var avalon = require('avalon');
    var util = require('util');
    var common = require('common');
    var homeVM;
    homeVM=avalon.define({
        $id: 'home',

        // 获取缓存中用户数据
        init:function () {

        }
    });

    avalon.ready(function () {
        homeVM.init();
    });
    window.homeVm=homeVM;
});