/*
 * authController 0.2
 * Copyright (c) 2016 tengen http://my.oschina.net/tengen
 * Date: 2017-02-06
 * 权限控制器，根据当前用户的权限数据对那些需要权限控制的可操作元素进行额外的渲染控制，如控制其可见性或可用性
 * 依赖库：jquery-1.10.2.js, store.js
 */
;define(function(require,exports,moudles){
    require('store');
    return function(jQuery){

(function ($, window, document, undefined) {

    var pluginName = "authController";

    // 构造函数
    function Plugin(element, options) {
        this.element = element;
        // 将默认属性对象和传递的参数对象合并到第一个空对象中
        this.settings = $.extend({}, $.fn.authController.defaults, options);
        this._defaults = $.fn.authController.defaults;
        this._name = pluginName;
        this.init();
    }

    // 为了避免和原型对象Plugin.prototype的冲突，这地方采用继承原型对象的方法
    $.extend(Plugin.prototype, {
        init: function () {
            // 初始化，由于继承自Plugin原型，
            // 你可以在这里直接使用this.element或者this.settings
            //优先采用元素单独配置选项
            var ac_options = $(this.element).attr("ac-options");
            if (typeof(ac_options) == "undefined") {
                ac_options = this.settings;
            } else {
                ac_options = $.extend({}, this.settings, eval('('+ac_options+')'));
            }
            //$(this).data("ac-options",ac_options);
            var checkResult = this.check();
            //如果检查结果为忽略控制，则继续检查下一个元素
            if (checkResult == -1) return true;
            var hasPermission = checkResult == 1;
            //渲染前处理
            if (ac_options.beforeRender && $.isFunction(ac_options.beforeRender)) {
                ac_options.beforeRender($(this.element), hasPermission);
            }
            //渲染控制受控元素
            if (ac_options.render && $.isFunction(ac_options.render)) {
                ac_options.render($(this.element), hasPermission);
            }else{
                this._defaultRender($(this.element), hasPermission);
            }
            //渲染后处理
            if (ac_options.afterRender && $.isFunction(ac_options.afterRender)) {
                ac_options.afterRender($(this.element), hasPermission);
            }
        },
        _getCache: function (key) {
            return store.get(key);
        },
        _setCache: function (key, value) {
            store.set(key, value);
        },
        _removeCache: function (key) {
            store.remove(key);
        },
        //从服务器加载权限数据
        _loadPermissions: function (serviceUrl) {
            if (this.settings.loadPermissions && $.isFunction(this.settings.loadPermissions)) {
                return this.settings.loadPermissions(serviceUrl);
            }
            var permissions = [];
            var jsonStr = $.ajax({
                url: serviceUrl,
                async: false
            }).responseText;
            permissions = eval("(" + jsonStr + ")");
            return permissions.bizData || permissions;
        },
        //获取权限数据，如果用户设置使用缓存，则尝试从浏览器缓存中获取，否则从服务器加载
        getPermissions: function () {
            var result = [];
            //如果使用了缓存，则从缓存中取权限数据
            if (this.settings.useCache) {
                var permissions = this._getCache('authController.permissions');
                if (typeof(permissions) != "undefined") {
                    $.merge(result, permissions);
                } else {
                    result = this._loadPermissions(this.settings.serviceUrl);
                    this._setCache('authController.permissions', result);
                }
            } else {
                result = this._loadPermissions(this.settings.serviceUrl);
            }
            return result;
        },
        //清理权限数据
        clearPermissions: function () {
            this._removeCache('authController.permissions');
        },
        //检查是否可操作目标元素 -1-忽略控制，0-不可操作，1-可操作
        check: function (authCode) {
            authCode = authCode || $(this.element).attr('ac-authCode');
            //不存在authCode属性的，则忽略控制
            if (typeof(authCode) == "undefined") {
                return -1;
            }
            var moduleUrl = $(this.element).attr('ac-moduleUrl');
            if (typeof(moduleUrl) == "undefined") {
                moduleUrl = this.settings.moduleUrl;
            }
            //确保moduleUrl以‘/’结尾
            if (moduleUrl.lastIndexOf('/') != moduleUrl.length - 1) {
                moduleUrl += '/';
            }

            var permissions = this.getPermissions();
            var authUrls = authCode.split(','); //authCode支持以逗号分隔，只要任何一个权限则通行
            var canDo = false;
            for (var i = 0; i < authUrls.length; i++) {
                var authUrl = $.trim(authUrls[i]);
                var isNot = authUrl.indexOf('not:') == 0;
                isNot&&(authUrl=authUrl.substr(4));
                //如果authCode不是完整的权限url，则需要加上moduleUrl前缀组成完整的authUrl
                authUrl.indexOf('/') == -1&&(authUrl = moduleUrl + authUrl);
                if((isNot && $.inArray(authUrl, permissions) ==-1) || (!isNot && $.inArray(authUrl, permissions)>-1)){
                    canDo = true;break;
                }
            }

            return canDo ? 1 : 0;
        },
        //默认渲染函数，根据是否有权限对可操作元素进行渲染
        _defaultRender: function ($obj,hasPermission) {
            $obj = $obj || $(this.element);
            if (this.settings.ctrlMode == 'visible') {
                $obj.toggle(hasPermission);
            } else if (this.settings.ctrlMode == 'available') {
                $obj.attr('disabled', !hasPermission);
            } else {
                $.error('"' + this.settings.ctrlMode + '" is invalid ctrlMode!');
            }
        }
    });

    // 对构造函数的一个轻量级封装，
    // 防止产生多个实例
    $.fn[pluginName] = function (options) {
        // 把第一个参数（插件方法）以后的参数放到数组里，以便后面调用插件方法可传递这些参数.
        var args = Array.prototype.slice.call(arguments, 1);
        var results; //用于保存调用插件方法的返回值

        this.each(function () {
            var element = this, $item = $(element), pluginKey = 'plugin_' + pluginName, instance = $.data(element, pluginKey);
            if (!instance) {
                instance = $.data(element, pluginKey, new Plugin(this, options));
            }

            // 如果插件已实例化，且当第一个参数(options)为有效的字符串（方法名称）时，则尝试调用该插件实例的同名方法。
            if (instance && typeof options === 'string' && options[0] !== '_' && options !== 'init') {

                var methodName = (options == 'destroy' ? '_destroy' : options);
                if (typeof instance[methodName] === 'function')
                    results = instance[methodName].apply(instance, args);

                // 允许通过destroy方法销毁实例
                if (options === 'destroy')
                    $.data(element, pluginKey, null);
            }

        });

        // 如果调用的是插件方法且有返回值，就返回这个值；否则返回当前对象实例以便可以实现链式调用
        return results !== undefined ? results : this;
    };

    $.fn[pluginName].defaults = {
        ctrlMode: 'visible', //控制模式（可见性visible或可用性available）。
        useCache: true, //是否使用缓存，默认为true。
        serviceUrl: '',//服务路径，用于请求返回指定页面的权限集合
        moduleUrl: window.location.pathname, //需要验证的模块地址，默认为当前页面地址，该属性受控元素可以独立指定覆盖
        loadPermissions: null, //从服务器加载权限数据函数
        beforeRender: null, //渲染之前的处理函数
        render: null, //自定义的渲染函数，如果未定义，系统则根据ctrlMode采用选择默认的控制实现
        afterRender: null //渲染之后的处理函数
    };
})(jQuery, window, document);

    };
});

