define(function (require) {
    var jQuery = require('jquery'), $ = jQuery;
    var cookie = require('cookie');
    var avalon = require('avalon');
    var util = require('util');
    var INIT = require('init');

    var common = {
        _init: function () {
            //初始化导航及工具条
            jQuery(function () {
                //初始化全课云公用顶部工具条
                INIT.qkyTopBar();
                //初始化全课云公用底部工具条
                INIT.qkyBottomBar();
                //解决由于由于某些浏览器问题无法重新扫描，则需要手动扫描的bug 2017-07-13
                if ($('.ms-controller, .ms-important, [ms-controller], [ms-important]').size() > 0) {
                    avalon.scan();
                }
            });

            //初始化权限控件
            INIT.authController();
            //初始化jquery.mqtt
            INIT.mqtt();
        },

        ajaxFun: function (options) {
            // 设置默认参数
            var settings = $.extend({
                url: '',
                loading: true,
                isPlain: true,      //content-type是否为空text/plain
                isXhr: false,    //检查跨域头（主平台）
                async: true,
                cache: false,
                data: {},
                type: 'get',
                dataType: 'json',
                onSuccess: function (data) {
                },
                onError: function (data) {
                }
            }, options);
            //请求统一打开loading层
            // if (settings.loading) {
            //     var loadIndex = util.openLoading();
            // }
            //普通方式
            return $.ajax({
                url: settings.url,
                type: settings.type,
                data: settings.data,
                async: settings.async,
                cache: settings.cache,
                dataType: settings.dataType,
                contentType: settings.contentType,
                xhrFields: {
                    withCredentials: settings.isXhr
                },
                complete: function () {
                    // if (settings.loading) {
                    //     //关闭loading层
                    //     util.closeLoading(loadIndex);
                    // }
                },
                success: function (data) {
                    if (common.isSuccess(data)) {
                        settings.onSuccess.call(this, data);
                    } else {
                        console.log("请求出错");
                    }
                },
                error: function (data) {
                    console.log("ajax error", data);
                    settings.onError.call(this, data);
                }
            });
        },
        isSuccess: function (result, sourceURL) {
            if (typeof(sourceURL) == "undefined") {
                sourceURL = window.location.pathname;
            }
            var rtnCode = result.rtnCode || result;
            if (result.uri && rtnCode == "0000001") {//登录无效
                window.location.href = result.uri;
                return false;
            }
            //参数错误异常
            if (rtnCode == '0100001')
                return false;
            if (rtnCode == '0000000')
                return true;
        },

        //判断三种环境
        getEnvironment: function () {
            if (window.document.location.host.indexOf("dev") >= 0 || window.document.location.host.indexOf("127.0.0.1") >= 0 || window.document.location.host.indexOf("localhost") >= 0) {
                return 'dev';
            } else if (window.document.location.host.indexOf("test") >= 0) {
                return 'test';
            } else {
                return 'pro';
            }
        },

        //获取用户信息
        getUserInfo: function (callback) {
            common.ajaxFun({
                url: "/sys/user/getUserInfo",
                loading: false,
                async: false,
                onSuccess: function (data) {
                    var account = data.bizData.account;
                    util.setLocalValue("account", account);
                    util.setLocalValue("projectInfo", data.bizData.projectInfo);
                    util.setLocalValue("accessToken", data.bizData.accessToken);

                    //学生身份，缓存家长身份信息
                    if (account.userType == 4) {
                        util.setLocalValue("guardianship", data.bizData.guardianship);
                    }
                    //data.bizData.jwt && util.setLocalValue("_jwt_", data.bizData.jwt);
                    //data.bizData.payload && util.setLocalValue("payload", data.bizData.payload);
                    if(data.bizData.loginSource){
                        util.setLocalValue("loginSource", data.bizData.loginSource);
                    }else{
                        util.removeLocalItem("loginSource");
                    }
                    callback && callback(data.bizData);
                }
            });
        },

        //获取当前登录用户
        getCurrUser: function (key) {
            return util.getLocalValue('account', key) || {};
        },

        //获取当前登录用户的身份代码；1 => 教师；2 => 家长； 4 => 学生； 8 => 机构；'' => 未知
        getCurrUserType: function () {
            return util.getLocalValue('account', 'userType') || '';
        },

        //获取项目信息
        getProjectInfo: function (key) {
            return util.getLocalValue('projectInfo', key) || {};
        },


        errorPlacement: function (error, element) {
            if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
                var eid = element.attr('name'); //获取元素的name属性
                element = $("input[name='" + eid + "']").last().parent(); //将错误信息添加当前元素的父结点后面
            }
            if (!error.is(':empty')) {

                $(element).not('.valid').qtip({
                    overwrite: false,
                    content: error,
                    hide: false,
                    show: {
                        event: false,
                        ready: true
                    },
                    style: {
                        classes: 'qtip-cream qtip-shadow qtip-rounded'
                    },
                    position: {
                        my: 'top left',
                        at: 'bottom right'
                    }
                }).qtip('option', 'content.text', error);
            }
            else {
                element.qtip('destroy');
            }
        },
        closeAllTip: function () {
            $('.qtip').each(function () {
                $(this).data('qtip').destroy();
            });
        }
    };

    //avalon自定义过滤器
    if (typeof(avalon) != "undefined") {
        avalon.filters.booleanFilter = function (str) {
            if (str) {
                return '是';
            }
            else {
                return '否';
            }
        };
        var sex = ['', '男', '女'];
        avalon.filters.sexFilter = function (str) {
            return sex[str];
        };
        //用户类型过滤器
        avalon.filters.userType = function (type) {
            if (type == 1) {
                return "教师"
            } else if (type == 2) {
                return "家长"
            } else if (type == 4) {
                return "学生"
            }
        };
    }

    //判断是否需要公共初始化部分
    if ($('body').attr('needCommonInit') != 'false') {
        common._init();
    }
    return common;
});

