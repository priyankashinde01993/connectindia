/**
 * Created by kalpesh on 23/11/15.
 */

angular.module('app.auth').factory('AuthFactory',['$rootScope','config','$http','ipCookie','$state',function($rootScope,config,$http,ipCookie,$state) {
    var factory = {};

    /**
     * Get signup meta data
     */
    factory.getSignUpMetaData = function(input) {
      return $http({
          url: config.apiUrl + 'registration/formData',
          method: "GET",
          params: input
      });
    };
    /**
     *
     * @param input
     * @returns {HttpPromise}
     */
    factory.signUp = function (input) {
        return $http({
            url: config.apiUrl + 'auth/signUp',
            method: "POST",
            data: input
        });
    };

    factory.verificationApprove = function (input) {
        return $http({
            url: config.apiUrl + 'verification/approve',
            method: "POST",
            data: input
        });
    };

    /**
     *
     * @param input
     * @returns {HttpPromise}
     */
    factory.signIn = function (input) {
        return $http({
            url: config.apiUrl + 'auth/signIn',
            method: "POST",
            data: input
        });
    };

    /**
     *
     * @param input
     * @returns {HttpPromise}
     */
    factory.editProfile = function (input) {
        return $http({
            url: config.apiUrl + 'user/updateProfile',
            method: "POST",
            data: input
        });
    };

    /**
     *
     * @param input
     * @returns {HttpPromise}
     */
    factory.forgotPassword = function (input) {
        return $http({
            url: config.apiUrl + 'auth/forgotPassword',
            method: "POST",
            data: input
        });
    };


    /**
     *
     * @param input
     * @returns {HttpPromise}
     */
    factory.resetPassword = function (input) {
        return $http({
            url: config.apiUrl + 'auth/resetPassword',
            method: "POST",
            data: input
        });
    };

    /**
     *
     * @param input
     * @returns {HttpPromise}
     */
    factory.logout = function (input) {
        return $http({
            url: config.apiUrl + 'auth/signOut',
            method: "POST",
            data: input
        });
    };

    /**
     * Post process login function
     * @param loginUserData
     */
    factory.postProcessLogin = function(session) {
        try {
            ipCookie('session',session,{expires: 21});
            $rootScope.session = session;
            return true;
        } catch (ex) {
            return false;
        }
    };


    /**
     * Post process logout
     */
    factory.postProcessLogout = function() {
        try {
            delete $rootScope.session;
            ipCookie.remove('session');
            return true;
        } catch (ex) {
            return false;
        }
    };

    /**
     * Verify token
     * @param token
     */
    factory.verifyToken = function(token) {
        if(token) {
            var response = $http({
                url: config.apiUrl + 'auth/verifyToken',
                method: "POST",
                data: {
                    data : token
                }
            });
            response.success(function(data,status,headers,config) {
                //2010 Normal login
                if(data.message.id == 6010) {
                    var loginProcessed = factory.postProcessLogin(data.data);
                    if(loginProcessed) {
                        return;
                        //$state.go('org.projects.list');
                    }
                } else {
                    factory.postProcessLogout();
                    $state.go('/');
                }
            });
            response.error(function(data,status,headers,config) {
                factory.postProcessLogout();
                $state.go('/');
            });
        } else {
            factory.postProcessLogout();
            $state.go('/');
        }
    };

    /*
     Get the data from cookie if session gives undefined
     */
    factory.getSession = function(key) {
        var session =  typeof $rootScope.session == "undefined" ? ipCookie('session') : $rootScope.session;
        if(key) {
            if(session[key])
                return session[key];
            else
                return null;
        } else {
            return session;
        }
    };

    /**
     * Set session
     * @param session
     */
    factory.setSession = function(session,key) {
        var currentSession = factory.getSession();
        if(key && currentSession[key]) {
            if(_.isArray(currentSession[key])) {
                currentSession[key].push(session);
            } else {
                angular.extend(currentSession[key],session);
            }
        } else {
            currentSession = angular.extend(currentSession,session);
        }
        ipCookie('session',currentSession,{expires: 21});
        $rootScope.session = currentSession;

        $rootScope.$broadcast('sessionUpdated');

        return currentSession;
    };

    factory.getPrivateUrl = function (input) {
        return $http({
            url: config.apiUrl + 'user/getPrivateUrl',
            method: "POST",
            data: input
        });
    };

    factory.checkHandler = function (input) {
        return $http({
            url: config.apiUrl + 'user/checkHandler',
            method: "POST",
            data: input
        });
    };

    factory.getIdea = function (input) {
        return $http({
            url: config.apiUrl + 'idea/get',
            method: "GET",
            params: input
        });
    };

    factory.saveIdea = function (input) {
        return $http({
            url: config.apiUrl + 'idea/save',
            method: "POST",
            data: input
        });
    };

    factory.getVerifiers = function (input) {
        return $http({
            url: config.apiUrl + 'user/getVerifiers',
            method: "POST",
            data: input
        });
    };

    factory.addVerifiers = function (input) {
        return $http({
            url: config.apiUrl + 'verification/addVerifiers',
            method: "POST",
            data: input
        });
    };

    factory.changePassword = function (input) {
        return $http({
            url: config.apiUrl + 'user/changePassword',
            method: "POST",
            data: input
        });
    };

    factory.getProfile = function (input) {
        return $http({
            url: config.apiUrl + 'profile/get',
            method: "POST",
            data: input
        });
    };

    return factory;
}]);
