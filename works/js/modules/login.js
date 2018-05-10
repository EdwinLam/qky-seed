define(function (require) {

    var $ = require('jquery');
    var avalon = require('avalon');
    var layer = require('layer');
    var common = require('common');
    var userApi = require('api/userApi');
    require('security');

    var vm = avalon.define({
        $id: "vmLogin",
        username: "",        //用户名
        password: "",        //密码
        rememberMe:false,
        pKey: "",             //公钥
        loginVerify: '',  //登录验证码
        showLoginVerify: false, //是否开启登录验证
        loginVerifyImg: '', //登录验证图片
        //刷新验证码
        changeLoginImg: function () {
            vm.loginVerifyImg = '/sys/user/getVerifyImgByLogin?' + new Date();
        },
        //获取公钥
        getPublicKey: function () {
            userApi.getPublicKey().success(function(res){
                if(res.rtnCode == '0000000'){
                    vm.pKey = RSAUtils.getKeyPair(res.bizData.exponent, '', res.bizData.modules);
                }
            });
        },
        //获取登录失败次数
        getErrorCount: function () {
            userApi.getErrorCount().success(function(res){
                if (res.rtnCode == '0000000' && res.bizData >= 3) {
                    vm.showLoginVerify = true;
                    vm.changeLoginImg();
                }
            });
        },
        //回车登录
        enter: function (event) {
            if (event.keyCode == 13) {
                vm.login();
            }
        },
        //登录
        login: function () {
            if (vm.username == "") {
                layer.alert('请输入用户名');
                return;
            }
            if (vm.password == "") {
                layer.alert('请输入密码');
                return;
            }
            if (vm.showLoginVerify && vm.loginVerify == "") {
                layer.alert('请输入验证码');
                return;
            }
            var psw = RSAUtils.encryptedString(vm.pKey, vm.password);
            userApi.login( vm.username,psw,vm.loginVerify).success(function(res){
                avalon.log('登录返回成功=', res);
                if (res.bizData.isSuccess) {
                    window.location = res.bizData.jumpToUrl;
                } else {
                    vm.getErrorCount();
                    vm.changeLoginImg();
                    layer.alert(res.bizData.msg);
                }
            });
        },
        init: function () {
            vm.getErrorCount();
            vm.getPublicKey();
        }
    });

    //初始化完成
    avalon.ready(function () {
        vm.init();
    });
});