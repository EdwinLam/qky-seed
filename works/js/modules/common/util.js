/****
 纯工具类方法脚本，与业务无关
 ****/

define(function (require) {
    var layer = require('layer_mobile');
    var $ = require('jquery');
    require('store');

    var loadIndex;

    /**
     * 创建验证提示
     * @param selector 显示提示的选择器
     * @param msg   提示信息
     */
    var createValidateTip = (function () {
        var tipConfig = {
            overwrite: true, content: {text: ""},
            show: {event: false, ready: true},
            style: {classes: 'qtip-cream qtip-shadow qtip-rounded'},
            position: {my: 'top left', at: 'bottom right'}
        };
        return function (selector, msg) {
            tipConfig.content.text = msg;
            $(selector).qtip(tipConfig);
        }
    })();

    var util = {
        //打开loading层
        openLoading: function () {
            return layer.open({type: 2});
        },
        //关闭loading层
        closeLoading: function (loadIndex) {
            loadIndex != undefined ? layer.close(loadIndex) : layer.closeAll();
        },
        //设置本地存储
        setLocalValue: function (itemName, itemValue) {
            store.set(itemName, itemValue);
        },
        //获得本地存储
        getLocalValue: function (itemName, key) {
            return key ? store.get(itemName)[key] : store.get(itemName);
        },
        //清除本地存储项
        removeLocalItem: function (itemName) {
            store.remove(itemName);
        },
        //清除所有本地存储项
        clearAllItems: function (excludeItems) {
            var excludeItemList=[];
            if(excludeItems&&excludeItems!=''){
                //获取不需要清除的缓存项
                $.each(excludeItems.split(","),function (index,name) {
                    var excludeItem={name:name,value:util.getLocalValue(name)};
                    excludeItemList.push(excludeItem);
                })
            }
            store.clear();
            //设置不清除的缓存
            if(excludeItemList.length>0){
                $.each(excludeItemList,function (index,item) {
                    util.setLocalValue(item.name,item.value);
                })
            }
        },

        getQueryString: function (name) {
            if (util.isNull(name)) {
                return window.location.search;
            }
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        },

        //让屏幕滑动到指定元素附近
        scrollTo: function (selector) {
            $('html, body').animate({
                scrollTop: $(selector).offset().top - 150
            }, 100);
        },

        createValidateTip: createValidateTip,

        isNull: function (obj) {
            if (typeof(obj) == "undefined" || obj == "undefined") {
                return true;
            } else {
                return obj == null ? true : false;
            }
        },
        //layer弹出层读取参数
        getParam: function (name) {
            return JSON.parse($(".layui-layer-content #param").val())[name];
        },
        //弹窗公共方法
        layerOpen: function (url, title, data, width, height, afterSave, afterCancel, afterOpen) {
            var area = [width, height];
            if (height == 'auto') {
                area = width;
            }
            var str = JSON.stringify(data);
            var hidden = "<input id='param' type='hidden' value='" + str + "' />";
            $.get(url, function (html) {
                var layerIndex = layer.open({
                    type: 1,
                    zIndex: 888,
                    title: title,
                    shift: 2,
                    moveEnd: function () {
                        util.closeAllTip();
                    },
                    cancel: function () {
                        afterCancel && afterCancel();
                        //取消时重置回调，避免刷新
                        afterSave = function () {
                        };
                    },
                    end: function () {
                        util.closeAllTip();
                        //为了保存后刷新
                        afterSave && afterSave();
                    },
                    shadeClose: false,
                    content: html + hidden,
                    area: area
                });
                afterOpen && afterOpen(layerIndex);
            });
        },
        //关闭所有提示
        closeAllTip: function () {
            $('.qtip').each(function () {
                $(this).data('qtip').destroy();
            })
        },
        stringToTimestamp: function (dateStr) {
            var date = new Date(dateStr.replace(/-/g, '/'));
            return date.getTime();
        }
    };

    // js中Array指定位置插入元素
    // Array.prototype.insert = function (index, item) {
    //     this.splice(index, 0, item);
    // };

    Date.prototype.format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    // js中String添加replaceAll 方法
    String.prototype.replaceAll = function (a, b) {
        var reg = new RegExp(a, "g");
        return this.replace(reg, b);
    };
    // js中String添加startWith方法
    String.prototype.startWith = function (str) {
        var reg = new RegExp("^" + str);
        return reg.test(this);
    };
    // js中String添加endWith方法
    String.prototype.endWith = function (str) {
        var reg = new RegExp(str + "$");
        return reg.test(this);
    };

    return util;
});