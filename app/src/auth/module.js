/**
 * Created by kalpesh on 16/10/15.
 */

var _src_path = 'src/';

angular.module('app.auth',['ui.router','ngMessages','ipCookie']);

angular.module('app.auth').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

    //declare routes
    $stateProvider
        .state('login', {
            url: "/login",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/guest/container.html"
                },
                'content@login': {
                    "templateUrl": _src_path + "auth/auth/login.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['GUEST']
            }
        })
        .state('forgotPassword', {
            url: "/forgot-password",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/guest/container.html"
                },
                'content@forgotPassword': {
                    "templateUrl": _src_path + "auth/auth/forgotPassword.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['GUEST']
            }
        })
        .state('register', {
            url: "/register",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/guest/container.html"
                },
                'content@register': {
                    "templateUrl": _src_path + "auth/auth/register.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['GUEST']
            }
        })

        .state('approval', {
            url: "/approval/:id/:response",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/guest/container.html"
                },
                'content@approval': {
                    "templateUrl": _src_path + "auth/auth/approval.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['GUEST']
            }
        })
        .state('profile', {
            url: "/profile",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/guest/container.html"
                },
                'content@profile': {
                    "templateUrl": _src_path + "auth/user/profile.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('home', {
            url: "/home",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@home': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('idea', {
            url: "/idea",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@idea': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('verifications', {
            url: "/verifications",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@verifications': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('connections', {
            url: "/connections",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@connections': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('changePassword', {
            url: "/changePassword",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@changePassword': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('publicHome', {
            url: "/user/view/:id",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@publicHome': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('publicConnections', {
            url: "/user/connections/:id",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@publicConnections': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('privateHome', {
            url: "/profile/view/:id",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@privateHome': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('privateIdea', {
            url: "/profile/idea/:id",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@privateIdea': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('privateVerifications', {
            url: "/profile/verifications/:id",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@privateVerifications': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })
        .state('privateConnections', {
            url: "/profile/connections/:id",
            views : {
                '': {
                    templateUrl:  _src_path + "app/layout/user/container.html"
                },
                'content@privateConnections': {
                    "templateUrl": _src_path + "auth/user/home.html",
                    "controller" : "AuthController"
                }
            },
            data : {
                access : ['USER']
            }
        })


}]);