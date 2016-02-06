/**
 * Created by kalpesh on 19/11/15.
 */


APP.controller('AppCtrl',['$scope','$rootScope', '$state','$stateParams','AuthFactory', function($scope,$rootScope,$state,$stateParams,AuthFactory) {



    //when state change starts
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        var session = AuthFactory.getSession();
        //Reset grid data
        if(toState.name != '/' && typeof toState.data != "undefined" && typeof toState.data.access != "undefined") {
            if(toState.data.access.indexOf('GUEST') != -1) {
                if(session) {
                    event.preventDefault();
                    $state.go('home');
                }
            }
            if(toState.data.access.indexOf('USER') != -1) {
                if(!session) {
                    event.preventDefault();
                    $state.go('/');
                }
            }
        }

        $scope.currentRoute = $state.current.name;

        console.log($scope.currentRoute);
        console.log($scope.currentRoute.indexOf('private'));
        console.log($scope.currentRoute.indexOf('public'));
        console.log($stateParams);

        if($stateParams.id) {
            if(session.handler == $stateParams.id) {
                // Logged in user is viewing his own public profile
            } else if(session.privateHash == $stateParams.id) {
                // Logged in user is viewing his own public profile
            } else {
                $rootScope.isPrivateView = ($scope.currentRoute.indexOf('private') == 0);
                $rootScope.isPublicView = ($scope.currentRoute.indexOf('public') == 0);
            }
        } else {

        }
    });

    //when state change success
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        if (angular.isDefined( toState.data ) && angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = 'DreamFu'+' | '+ toState.data.pageTitle;
        }

    });

}]);
