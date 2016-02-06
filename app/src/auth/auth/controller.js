angular.module('app.auth').controller('AuthController', ['$scope', '$rootScope', '$state', '$stateParams','AuthFactory','NotifyFactory','Upload','VALID_IMAGE_FILE_TYPES','config', function ($scope, $rootScope, $state, $stateParams,AuthFactory,NotifyFactory,Upload,VALID_IMAGE_FILE_TYPES,config) {

    //init API
    $scope.init = function() {
        $scope.user  = $scope.user || {};
        $scope.metaData = {
            universities: [],
            streams: [],
            year_of_graduation: []
        };
    };

    //get register meta data
    $scope.getRegisterMetaData = function() {
        $scope.signUpBusy = AuthFactory.getSignUpMetaData();
        $scope.signUpBusy.success(function(data,status, headers, config){
            if(data.success && data.message.id == 2040) {
                $scope.metaData.streams = data.data.streams ? data.data.streams : [];
                $scope.metaData.universities = data.data.universities ? data.data.universities : [];
                $scope.metaData.year_of_graduation = data.data.year_of_graduation ? data.data.year_of_graduation : [];

                //reformat year of graduation
                $scope.metaData.year_of_graduation = $scope.metaData.year_of_graduation.map(function(val){
                                                            return val.toString();
                                                        });
            }
        });
    };

    //register user
    $scope.register = function(form) {
        if(form.$valid) {
            var user = $scope.user;
            user.role = 'student'; //hard setting role for now
            $scope.signUpBusy = AuthFactory.signUp(user);
            $scope.signUpBusy.success(function(data,status, headers, config) {
                //2010 Normal login
                if(data.message.id == 2010) {
                    var loginProcessed = AuthFactory.postProcessLogin(data.data);
                    if(loginProcessed) {
                        NotifyFactory.showSuccess("Registration Successful");
                        $state.go('profile');
                    }
                } else {
                    NotifyFactory.showError(data.message.description,2000);
                }
            });
            $scope.signUpBusy.error(function(data,status, headers, config) {
                //reset form on invalid
                $scope.user = {};
                form.$setPristine();
                form.$setUntouched();
            });
        }
    };

    //login user
    $scope.login = function(form) {
        if(form.$valid) {
            var user = $scope.user;
            $scope.loginBusy = AuthFactory.signIn(user);
            $scope.loginBusy.success(function(data,status, headers, config) {
                //2010 Normal login
                if(data.message.id == 2010) {
                    var loginProcessed = AuthFactory.postProcessLogin(data.data);
                    if(loginProcessed) {
                        $state.go('home');
                    }
                } else if(data.message.id == 1141) {
                    $scope.isUserBanned = true;
                    $scope.userMessage = data.message.description;

                    $scope.user = {};
                    form.$setPristine();
                    form.$setUntouched();
                } else {
                    NotifyFactory.showError(data.message.description,2000);
                }
            });
            $scope.loginBusy.error(function(data,status, headers, config) {
                //reset form on invalid
                $scope.user = {};
                form.$setPristine();
                form.$setUntouched();
            });
        }
    };

    //Logout user
    $scope.logout = function() {
        var response = AuthFactory.logout();
        response.success(function(data,status,headers,config) {
            if(data.message.id == 2020) {
                var logoutProcessed = AuthFactory.postProcessLogout();
                if(logoutProcessed) {
                    $state.go('/');
                }
            } else {
                NotifyFactory.showError(data.message.description);
            }
        });
    };

    /**
     * Upload file
     */
    $scope.uploadFile = function($files) {
        var file = $files[0];
        $scope.flash =  {};
        if(typeof file != "undefined") {
            //check if valid file is uploaded
            if(VALID_IMAGE_FILE_TYPES.indexOf(file.type) > -1) {
                var data = {
                    "file": file
                };
                $scope.signUpBusy = Upload.upload({
                    url : config.apiUrl + "user/uploadImage",
                    method: 'POST',
                    file: file
                });
                $scope.signUpBusy.success(function(res,status,headers,config){
                    if(res.message.id == 2080) {
                        //save photo url
                        $scope.user.profile_pic_url = res.data.url;
                    } else {
                        NotifyFactory.showError(res.message.description);
                    }
                });
            } else {
                NotifyFactory.showError(lang.upload_valid_image_files.message);
            }
        }
    };


    /**
     * Get user from profile
     */
    $scope.getUser = function() {
        $rootScope.session = AuthFactory.getSession();
        //console.log($scope.user);
    };

    $scope.doApprovalAction = function () {
        console.log($stateParams);
        if($stateParams.response == 'accepted' || $stateParams.response == 'rejected') {
            var data = {
                'approval_id' : $stateParams.id,
                'response': $stateParams.response
            };
            $scope.signUpBusy = AuthFactory.verificationApprove(data);
            $scope.signUpBusy.success(function(data,status, headers, config) {
                //2010 Normal login
                if(data.message.id == 2050) {
                    NotifyFactory.showSuccess(data.message.description,2000);
                    $state.go('/');
                } else {
                    NotifyFactory.showError(data.message.description,2000);
                }
            });
            $scope.signUpBusy.error(function(data,status, headers, config) {
                NotifyFactory.showError(data.message.description,2000);
            });
        } else {
            $state.go('/');
        }
    };

    $scope.forgotPassword = function (form) {
        if(form.$valid) {
            var data = {
                'email' : $scope.user.email
            };
            $scope.forgotBusy = AuthFactory.forgotPassword(data);
            $scope.forgotBusy.success(function(data,status, headers, config) {
                //2010 Normal login
                if(data.message.id == 2240) {
                    NotifyFactory.showSuccess(data.message.description,2000);
                    $scope.user = {};
                    form.$setPristine();
                    form.$setUntouched();
                } else {
                    NotifyFactory.showError(data.message.description,2000);
                }
            });
            $scope.forgotBusy.error(function(data,status, headers, config) {
                NotifyFactory.showError(data.message.description,2000);
                $scope.user = {};
                form.$setPristine();
                form.$setUntouched();
            });
        }
    };

    $scope.$on('sessionUpdated', function(){
        console.log('in event auth');
    });

}]);