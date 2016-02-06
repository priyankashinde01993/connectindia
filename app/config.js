angular.element(document).ready(function () {
    var configArray = {
        siteUrl: 'https://app.connectindia.com/',
        apiUrl: 'https://api.connectindia.com/'
    };

    angular.module('app').constant("config", configArray);
    angular.bootstrap('#app', ['app']);
});