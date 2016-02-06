/**
 * Created by kalpesh on 20/11/15.
 */

angular.module('app.auth').controller('UserController', ['$scope', '$rootScope', '$state', '$stateParams', 'AuthFactory', 'NotifyFactory', 'VALID_IMAGE_FILE_TYPES', 'Upload', 'config', 'ipCookie',
    function ($scope, $rootScope, $state, $stateParams, AuthFactory, NotifyFactory, VALID_IMAGE_FILE_TYPES, Upload, config, ipCookie) {

        // Activate the current route in tab
        $scope.currentRoute = $state.current.name;

        /**
         * This function will call when home page loads
         */
        $scope.init = function () {
            var session = AuthFactory.getSession();

            $rootScope.isPrivateView = 0;
            $rootScope.isPublicView = 0;
            if($stateParams.id) {
                if(session.handler == $stateParams.id) {
                    // Logged in user is viewing his own public profile

                } else if(session.privateHash == $stateParams.id) {
                    // Logged in user is viewing his own public profile
                } else {
                    $rootScope.isPrivateView = ($scope.currentRoute.indexOf('private') == 0);
                    $rootScope.isPublicView = ($scope.currentRoute.indexOf('public') == 0);
                }
            }

            $scope.tabRoutes = {
                'profile' : $rootScope.isPublicView ? 'publicHome({id: "'+ $stateParams.id +'"})' : $rootScope.isPrivateView ? 'privateHome({id: "'+ $stateParams.id +'"})' : 'home',
                'idea' : $rootScope.isPrivateView ? 'privateIdea({id: "'+ $stateParams.id +'"})' : 'idea',
                'verification' : $rootScope.isPrivateView ? 'privateVerifications({id: "'+ $stateParams.id +'"})' : 'verifications',
                'connection' : $rootScope.isPublicView ? 'publicConnections({id: "'+ $stateParams.id +'"})' : $rootScope.isPrivateView ? 'privateConnections({id: "'+ $stateParams.id +'"})' : 'connections',
                'password': 'changePassword'
            };

        };

        /**
         * Fetch the meta data of universities, streams, graduation years
         */
        $scope.getMetaData = function () {
            $scope.profileBusy = AuthFactory.getSignUpMetaData();
            $scope.profileBusy.success(function(data,status, headers, configRes){
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

        /**
         * Fetch user data based on the url whether logged in user's or other users.
         * This will use to fetch the basic info which shows on the top of the tabs.
         */
        $scope.getUserData = function () {
            if($rootScope.isPrivateView || $rootScope.isPublicView) {
                $scope.user = {};
                var data = {
                    'type': $rootScope.isPrivateView ? 'private' : $rootScope.isPublicView ? 'public' : null,
                    'id': $stateParams.id,
                    'field': 'profile'
                };
                $scope.profileBusy = AuthFactory.getProfile(data);
                $scope.profileBusy.success(function(data,status, headers, configRes){
                    if(data.success) {
                        $scope.user = data.data;
                        $scope.user.public_url = config.siteUrl + '' + $rootScope.publicProfileRoute;
                        $scope.user.private_url = config.siteUrl + ''+ $rootScope.privateProfileRoute;
                    } else {
                        NotifyFactory.showError(data.message.description,2000);
                    }
                });
                $scope.profileBusy.error(function(data,status, headers, configRes) {
                    NotifyFactory.showError(data.message.description,2000);
                });
            } else {
                $scope.user = AuthFactory.getSession();

                console.log($scope.user);
                console.log(ipCookie('session'));
                console.log($rootScope.session);
                $scope.user.public_url = config.siteUrl +  $rootScope.publicProfileRoute;
                $scope.user.private_url = config.siteUrl +  $rootScope.privateProfileRoute;
            }
        };

        /**
         * Fetch the other user's specific data like profile, idea, connections, verifiers
         * @param infoType
         */
        $scope.getOtherUserInfo = function (infoType) {
            infoType = infoType || 'profile';

            var data = {
                'type': $rootScope.isPrivateView ? 'private' : $rootScope.isPublicView ? 'public' : null,
                'id': $stateParams.id,
                'field': infoType
            };
            $scope.profileBusy = AuthFactory.getProfile(data);
            $scope.profileBusy.success(function(data,status, headers, configRes){
                if(data.success) {
                    if(infoType == 'profile') {
                        $scope.user = data.data;

                        $scope.user.public_url = config.siteUrl +  $rootScope.publicProfileRoute;
                        $scope.user.private_url = config.siteUrl +  $rootScope.privateProfileRoute;
                    } else if(infoType == 'idea') {
                        var tempIdea = data.data.idea;
                        var ideas = [];
                        angular.forEach(tempIdea, function (idea) {
                            ideas[idea.idea_field_id] = idea;
                        });

                        $scope.userIdea = ideas;
                        $scope.ideaFields = data.data.idea_fields;
                    } else if(infoType == 'verifiers') {
                        $scope.verifiers = data.data;
                    }

                } else {
                    NotifyFactory.showError(data.message.description,2000);
                }
            });
            $scope.profileBusy.error(function(data,status, headers, configRes) {
                NotifyFactory.showError(data.message.description,2000);
            });
        };

        /**
         * Initializing the basic objects
         * @type {{}}
         */
        $scope.profileTabRoute = {};
        $scope.userIdea = {};
        $scope.verifiers = {
            classmate: [],
            professor: []
        };

        /**
         * Enable the specific tab based on the route.
         * Fetch that particular tab's data
         */
        switch ($state.current.name) {
        /**
         * Logged in users routes
         */
            case 'home':
                $scope.profileTabRoute.profile = true;

                break;

            case 'idea':
                $scope.profileTabRoute.idea = true;


                $scope.ideaFields = [];
                var data = {};
                $scope.profileBusy = AuthFactory.getIdea(data);
                $scope.profileBusy.success(function(data,status, headers, configRes){
                    if(data.success) {
                        var tempIdea = data.data.idea;
                        var ideas = [];
                        angular.forEach(tempIdea, function (idea) {
                            ideas[idea.idea_field_id] = idea;
                        });

                        $scope.userIdea = ideas;
                        $scope.ideaFields = data.data.idea_fields;
                    } else {
                        NotifyFactory.showError(data.message.description,2000);
                    }
                });
                $scope.profileBusy.error(function(data,status, headers, configRes) {
                    NotifyFactory.showError(data.message.description,2000);
                });

                break;

            case 'verifications':
                $scope.profileTabRoute.verifications = true;

                var data = {};
                $scope.profileBusy = AuthFactory.getVerifiers(data);
                $scope.profileBusy.success(function(data,status, headers, configRes){
                    if(data.success) {
                        $scope.verifiers = data.data;
                    } else {
                        NotifyFactory.showError(data.message.description,2000);
                    }
                });
                $scope.profileBusy.error(function(data,status, headers, configRes) {
                    NotifyFactory.showError(data.message.description,2000);
                });

                break;

            case 'connections':
                $scope.profileTabRoute.connections = true;
                break;

        /**
         * Logged in user viewing other user profile using public URL
         */
            case 'publicHome':
                $scope.profileTabRoute.profile = true;

                if($rootScope.isPrivateView || $rootScope.isPublicView) {
                    //$scope.getOtherUserInfo('profile');
                }

                break;

            case 'publicConnections':
                $scope.profileTabRoute.connections = true;
                break;

        /**
         * Logged in user viewing other user profile using private URL
         */
            case 'privateHome':
                $scope.profileTabRoute.profile = true;

                if($rootScope.isPrivateView || $rootScope.isPublicView) {
                    //$scope.getOtherUserInfo('profile');
                }

                break;

            case 'privateIdea':
                $scope.profileTabRoute.idea = true;

                if($rootScope.isPrivateView) {
                    $scope.getOtherUserInfo('idea');
                } else {

                }

                break;

            case 'privateVerifications':
                $scope.profileTabRoute.verifications = true;

                if($rootScope.isPrivateView) {
                    $scope.getOtherUserInfo('verifiers');
                } else {

                }

                break;

            case 'privateConnections':
                $scope.profileTabRoute.connections = true;
                break;

        /**
         * Change password feature for logged in user
         */
            case 'changePassword':
                $scope.profileTabRoute.password = true;
                $scope.passwordFormData = {};

                break;

            default :
                $scope.profileTabRoute.profile = true;
                break;
        }

        /**
         * Inline edit feature statrts here
         * @type {{}}
         */

        $scope.editMode = {};
        $scope.editData = {};
        $scope.metaData = {};

        /**
         * Enabling the specific input by clicking on it
         * @param field
         * @param val
         */
        $scope.enableEdit = function (field, val) {
            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                $scope.editMode[field] = true;
                $scope.editData[field] = val;
            }
        };

        /**
         * Hiding the specific input
         * @param field
         */
        $scope.closeEdit = function (field) {
            delete $scope.editData[field];
            $scope.editMode[field] = false;
        };


        /**
         * Check the user action in the specific input to track the enter, esc key press.
         * If User pressed the enter then update that specific value.
         * If user pressed the esc then cancel that edit functionality
         * @param e
         * @param fieldKey
         */
        $scope.checkInputAction = function (e, fieldKey) {
            if(e.which == 13) {

                if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                    // Call API for update the data
                    var data = {};
                    data[fieldKey] = $scope.editData[fieldKey];
                    $scope.profileBusy = AuthFactory.editProfile(data);
                    $scope.profileBusy.success(function (data, status, headers, configRes) {
                        if (data.message.id == 2050) {
                            $scope.user[fieldKey] = data.data[fieldKey];

                            // Update in local storage also
                            AuthFactory.setSession(data.data[fieldKey], fieldKey);

                            $scope.editMode[fieldKey] = false;
                            delete $scope.editData[fieldKey];
                            NotifyFactory.showSuccess(data.message.description, 2000);
                        } else {
                            NotifyFactory.showError(data.message.description, 2000);
                        }
                    });
                    $scope.profileBusy.error(function (data, status, headers, configRes) {
                        //reset form on invalid

                    });
                }

            } else if(e.which == 27) {

                // Replace old info with new
                $scope.editMode[fieldKey] = false;

            }
        };

        /**
         * Save the updated value of the select box change
         * @param fieldKey
         * @param isDirectKey
         */
        $scope.onSelectChange = function (fieldKey, isDirectKey) {
            var data = {};
            if(!isDirectKey) {
                var fieldKeyId = fieldKey + '_id';
                var fieldKeyName = fieldKey + '_name';
                data[fieldKeyId] = $scope.editData[fieldKeyId];
            } else {
                data[fieldKey] = $scope.editData[fieldKey];
            }

            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                $scope.profileBusy = AuthFactory.editProfile(data);
                $scope.profileBusy.success(function (data, status, headers, configRes) {
                    if (data.message.id == 2050) {
                        if (!isDirectKey) {
                            $scope.user[fieldKeyId] = data.data[fieldKeyId];
                            $scope.user[fieldKeyName] = data.data[fieldKeyName];

                            // Update in local storage also
                            AuthFactory.setSession(data.data[fieldKeyId], fieldKeyId);
                            AuthFactory.setSession(data.data[fieldKeyName], fieldKeyName);

                        } else {
                            $scope.user[fieldKey] = data.data[fieldKey];

                            // Update in local storage also
                            AuthFactory.setSession(data.data[fieldKey], fieldKey);
                        }

                        $scope.editMode[fieldKeyId] = false;
                        delete $scope.editData[fieldKeyId];
                        NotifyFactory.showSuccess(data.message.description, 2000);
                    } else {
                        NotifyFactory.showError(data.message.description, 2000);
                    }
                });
                $scope.profileBusy.error(function (data, status, headers, configRes) {
                    //reset form on invalid

                });
            }
        };

        /**
         * Inline edit feature ends here
         */


        /**
         * Regenerate the private profile url
         */
        $scope.getPrivateUrl = function () {
            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                $scope.profileBusy = AuthFactory.getPrivateUrl();
                $scope.profileBusy.success(function (data, status, headers, configRes) {
                    if (data.message.id == 2050) {
                        $scope.user.privateHash = data.data.privateHash;


                        // Update in local storage also
                        AuthFactory.setSession(data.data['privateHash'], 'privateHash');

                        NotifyFactory.showSuccess(data.message.description, 2000);
                    } else {
                        NotifyFactory.showError(data.message.description, 2000);
                    }
                });
                $scope.profileBusy.error(function (data, status, headers, configRes) {
                    //reset form on invalid

                });
            }
        };

        /**
         * Enable the input box for the user to change public profile url.
         * User can enter his custom user id
         */
        $scope.editPublicUrl = function () {
            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                $scope.editMode['public_url'] = true;
                $scope.editData['public_url'] = null;
                $scope.uNameAvailability = {};
            }
        };

        /**
         * Cancel the edit feature for public url
         */
        $scope.cancelEditPublicUrl = function () {
            $scope.editMode['public_url'] = false;
            $scope.editData['public_url'] = null;
            $scope.uNameAvailability = {};
        };

        $scope.uNameAvailability = {};

        /**
         * Continuous call to chack for user id/name is available or not
         * @param e
         */
        $scope.checkUnameAvailability = function (e) {
            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                $scope.uNameAvailability.available = false;
                $scope.uNameAvailability.notAvailable = false;
                if (!$scope.uNameAvailability.searching) {
                    clearTimeout($scope.uNameAvailability.timer);
                    $scope.uNameAvailability.timer = setTimeout(function () {
                        $scope.uNameAvailability.searching = true;

                        var data = {
                            'handler': $scope.editData['handler']
                        };
                        $scope.profileBusy = AuthFactory.checkHandler(data);
                        $scope.profileBusy.success(function (data, status, headers, configRes) {
                            if (data.message.id == 1100) {
                                $scope.uNameAvailability.available = true;
                                NotifyFactory.showSuccess(data.message.description, 2000);
                            } else if (data.message.id == 1000) {
                                NotifyFactory.showError(data.message.description, 2000);
                            } else {
                                $scope.uNameAvailability.notAvailable = true;
                                NotifyFactory.showError(data.message.description, 2000);
                            }
                            $scope.uNameAvailability.searching = false;
                        });
                        $scope.profileBusy.error(function (data, status, headers, configRes) {
                            //reset form on invalid
                            $scope.uNameAvailability.searching = false;
                        });
                    }, 800);
                }
            }
        };

        /**
         * Save the user's custom public url
         */
        $scope.savePublicUrl = function () {
            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                $scope.profileBusy = AuthFactory.editProfile({'handler': $scope.editData['handler']});
                $scope.profileBusy.success(function (data, status, headers, configRes) {
                    if (data.message.id == 2050) {
                        $scope.user['handler'] = data.data['handler'];

                        // Update in local storage also
                        AuthFactory.setSession(data.data['handler'], 'handler');

                        $scope.editMode['public_url'] = false;
                        $scope.editData['public_url'] = null;
                        $scope.uNameAvailability = {};

                        NotifyFactory.showSuccess(data.message.description, 2000);
                    } else {
                        NotifyFactory.showError(data.message.description, 2000);
                    }
                });
                $scope.profileBusy.error(function (data, status, headers, configRes) {
                    //reset form on invalid
                    $scope.editMode['public_url'] = false;
                    $scope.editData['public_url'] = null;
                    $scope.uNameAvailability = {};
                });
            }
        };

        /**
         * Upload file
         */
        $scope.uploadProfileFile = function($files) {
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

                            $scope.profileBusy = AuthFactory.editProfile({'profile_pic_url': res.data.url});
                            $scope.profileBusy.success(function(data,status, headers, configRes) {
                                if(data.message.id == 2050) {
                                    $scope.user['profile_pic_url'] = data.data['profile_pic_url'];

                                    // Update in local storage also
                                    AuthFactory.setSession(data.data['profile_pic_url'], 'profile_pic_url');

                                    NotifyFactory.showSuccess(data.message.description,2000);
                                } else {
                                    NotifyFactory.showError(data.message.description,2000);
                                }
                            });
                            $scope.profileBusy.error(function(data,status, headers, configRes) {
                                //reset form on invalid

                            });


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
         * Enable the textareas to edit the data in idea section
         * @param fieldKey
         * @param val
         */
        $scope.editIdea = function (row) {
            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                row.editMode = true;
            }
        };

        /**
         * Cancel the edit in idea section
         * @param fieldKey
         */
        $scope.cancelEditIdea = function (row) {
            row.editMode = false;
        };

        /**
         * Update the data of idea section like idea, why me, why now
         * @param fieldKey
         */
        $scope.saveIdea = function (row) {
            if(!($rootScope.isPublicView || $rootScope.isPrivateView)) {
                var ideas = [];
                angular.forEach($scope.userIdea, function (idea, key) {
                    ideas.push({
                        "idea_field_id": key,
                        "content": idea.content
                    });
                });

                $scope.profileBusy = AuthFactory.saveIdea({'idea': ideas});
                $scope.profileBusy.success(function (data, status, headers, configRes) {
                    if (data.success) {
                        row.editMode = false;
                        NotifyFactory.showSuccess(data.message.description, 2000);
                    } else {
                        NotifyFactory.showError(data.message.description, 2000);
                    }
                });
                $scope.profileBusy.error(function (data, status, headers, configRes) {
                    NotifyFactory.showError(data.message.description, 2000);
                });
            }
        };

        /**
         * Add new verifier row
         */
        $scope.addVerifierRow = function(type) {
            type = type || 'classmate';
            var row = {
                email: null,
                designation: type
            };
            $scope.verifiers[type] = $scope.verifiers[type] || [];
            $scope.verifiers[type].push(row);
        };

        /**
         * Remove verifier row
         */
        $scope.removeVerifierRow = function(type, index) {
            type = type || 'classmate';
            $scope.verifiers[type] = $scope.verifiers[type] || [];
            $scope.verifiers[type].splice(index,1);
        };

        /**
         * Call API to add verifiers
         * @param form
         */
        $scope.addVerifiers = function (form) {
            if(form.$valid) {
                var verifiersCopy = angular.copy($scope.verifiers);
                var verifiers = [];

                if(verifiersCopy.classmate && verifiersCopy.classmate.length) {
                    angular.forEach(verifiersCopy.classmate, function (s) {
                        if(!s.id) {
                            verifiers.push(s);
                        }
                    });
                }

                if(verifiersCopy.professor && verifiersCopy.professor.length) {
                    angular.forEach(verifiersCopy.professor, function (p) {
                        if(!p.id) {
                            verifiers.push(p);
                        }
                    });
                }

                var data = {
                    'verifiers': verifiers
                };
                $scope.profileBusy = AuthFactory.addVerifiers(data);
                $scope.profileBusy.success(function(data,status, headers, configRes){
                    if(data.success) {
                        //$scope.verifiers = data.data;
                        form.$setPristine();
                        form.$setUntouched();

                        NotifyFactory.showSuccess(data.message.description,2000);

                        $scope.profileBusy = AuthFactory.getVerifiers({});
                        $scope.profileBusy.success(function(data,status, headers, configRes){
                            if(data.success) {
                                $scope.verifiers = data.data;
                            }
                        });
                        $scope.profileBusy.error(function(data,status, headers, configRes) {
                            NotifyFactory.showError(data.message.description,2000);
                        });
                    } else {
                        NotifyFactory.showError(data.message.description,2000);
                    }
                });
                $scope.profileBusy.error(function(data,status, headers, configRes) {
                    NotifyFactory.showError(data.message.description,2000);
                    form.$setPristine();
                    form.$setUntouched();
                });
            }
        };

        /**
         * Change logged in user's password
         * @param form
         */
        $scope.changePassword = function (form) {
            if(form.$valid) {
                var data = $scope.passwordFormData;
                $scope.profileBusy = AuthFactory.changePassword(data);
                $scope.profileBusy.success(function(data,status, headers, configRes){
                    if(data.success) {
                        $scope.passwordFormData = {};
                        form.$setPristine();
                        form.$setUntouched();
                        NotifyFactory.showSuccess(data.message.description,2000);
                    } else {
                        NotifyFactory.showError(data.message.description,2000);
                    }
                });
                $scope.profileBusy.error(function(data,status, headers, configRes) {
                    NotifyFactory.showError(data.message.description,2000);
                    form.$setPristine();
                    form.$setUntouched();
                });
            }
        };


        $scope.$on('sessionUpdated', function(){
            console.log('in event');
        });
}]);