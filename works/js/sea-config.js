seajs.config({
    base: '/js/modules',
    //开发环境设置
    debug: false,
    paths: {
        'lib': '/js/libs'
    },
    // 别名配置
    alias: {
        "jquery": "lib/jquery/1.11.1/jquery-cmd.min.js",
        "avalon": "lib/avalon/2.2.4/avalon2.modern-cmd.js",
        'layer':'lib/layer/layer-cmd',
        'datePicker':'lib/datePicker/WdatePicker',
        'store':'lib/store.min',
        'cookie':'lib/jquery.cookie',
        "security": "lib/security.js",
        'bs': 'lib/bootstrap/3.3.0/js/bootstrap-cmd',//引用bootstrap前端框架
        'qkynav': 'lib/comjs/nav_add1.2',
        'echarts':'lib/echarts/3.5/echarts-cmd',
        "common": "common/common-cmd.js",
        'util':'common/util',
        'init':'common/init',
        'mqtt':'common/jquery.mqtt-cmd',
        'authCtrl':'common/jquery.authController-cmd'
    },
    //映射规则
    map: [
        //加载的js统一加上版本号
        ['.js','.js?v=1.0.0_20180504']
    ],
    // 变量配置
    vars: {
        'locale': 'zh-cn'
    }
});