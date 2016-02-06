/**
 * Created by kalpesh on 16/10/15.
 */

//angular.bootstrap('#app', ['app']);

var _src_path = 'src/';

var APP = angular.module('app', ['ui.router', 'ui.bootstrap', 'app.auth','ipCookie','cgBusy','ngFileUpload','ngSanitize', 'dialogs.main','ngAnimate']);

APP.config(['$stateProvider', '$urlRouterProvider','config', function ($stateProvider, $urlRouterProvider, config) {

    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state('/',{
        url: "/",
        views : {
            '': {
                templateUrl:  _src_path + "app/layout/guest/container.html"
            },
            'content@/': {
                "templateUrl": _src_path + "app/home.html"
            }
        },
        data : {
            access : ['GUEST', 'USER']
        }
    })


}]);

APP.run(['$rootScope','$state','$stateParams', '$window', 'config','ipCookie','AuthFactory','AppHelpers','$log','REGEX', 'PUBLIC_PROFILE_ROUTE', 'PRIVATE_PROFILE_ROUTE',
    function($rootScope,$state,$stateParams, $window, config,ipCookie,AuthFactory,AppHelpers,$log,REGEX,PUBLIC_PROFILE_ROUTE,PRIVATE_PROFILE_ROUTE) {

    //declare global variable
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.helpers = AppHelpers;
    $rootScope.$log = $log;

    $rootScope.regEx = REGEX;
    $rootScope.publicProfileRoute = PUBLIC_PROFILE_ROUTE;
    $rootScope.privateProfileRoute = PRIVATE_PROFILE_ROUTE;

    //declare plugins
    $rootScope.plugins = {};
    $rootScope.plugins.tz = jstz.determine();

    var userSession = ipCookie('session');
    if(userSession && userSession.token) {
        //Verifies the token and perform required routing
        AuthFactory.verifyToken(userSession.token);
    }

}]);

