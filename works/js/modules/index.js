define(function (require) {
    var $ = require('jquery');
    var avalon = require('avalon');
    var util = require('util');
    var common = require('common');
    common.getUserInfo(function () {
        //教师身份
        var account = util.getLocalValue("account");
        if (account.userType == 1) {
            window.location.href = "/html/home.html";
        }
    });

});