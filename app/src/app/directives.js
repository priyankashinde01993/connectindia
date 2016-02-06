/**
 * Created by kalpesh on 16/10/15.
 */
/**
 * Custom navigation in settings page
 */
APP.directive('affix', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //$(element).affix(attrs);
        }
    }
});

APP.directive('basicStepy', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // Basic wizard setup
            $(".stepy-basic").stepy();

            // Apply "Back" and "Next" button styling
            $('.stepy-step').find('.button-next').addClass('btn btn-primary');
            $('.stepy-step').find('.button-back').addClass('btn btn-default');

            //stepy form-validation hack

            $('.stepy-step').find('.button-next').click(function(){
                if($(".stepy-last-step").is(":visible")) {
                    $timeout(function(){
                        $(".stepy-last-step > div").hide();
                        $(".stepy-last-step > div.stepy-last").show();
                    },6000);
                }
            });
        }
    }
});

APP.directive('select2', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if(attrs.hideSearch) {
                // For hiding the search bar
                $(element).select2({
                    minimumResultsForSearch: Infinity,
                    formatNoMatches: function() {
                        return 'New item will be created';
                    }
                });
            } else {
                $(element).select2({
                    formatNoMatches: function() {
                        return 'New item will be created';
                    }
                });
            }
        }
    }
});

APP.directive('select2Multiple', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $('.select').select2();
        }
    }
});

APP.directive('radioStyledMultiple', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // Styled checkboxes and radios
            $('.styled').uniform({
                radioClass: 'choice'
            });
        }
    }
});

APP.directive('uiSliderLabel', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if(jQuery().slider) {
                $(element).slider({
                    min: parseInt(attrs.minVal),
                    max: parseInt(attrs.maxVal),
                    value: parseInt(attrs.val),
                });

                $(element).slider("pips" , {
                    suffix : attrs.label ? "&nbsp;" + attrs.label : "",
                    rest: false
                });

                $(element).slider("float");
            } else {
                console.log("No Slider Plugin");
            }
        }
    }
});


APP.directive('fileImport', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $('.file-import').fileinput({
                browseLabel: '',
                browseClass: 'btn btn-default btn-ladda',
                removeLabel: '',
                uploadLabel: '',
                uploadClass: 'btn btn-default btn-ladda',
                browseIcon: '<i class="icon-download4"></i> ',
                uploadIcon: '<i class="icon-file-upload"></i> ',
                removeClass: 'btn btn-danger btn-icon',
                removeIcon: '<i class="icon-cancel-square"></i> ',
                layoutTemplates: {
                    caption: '<div tabindex="-1" class="form-control file-caption {class}">\n' + '<span class="icon-download4 kv-caption-icon"></span><div class="file-caption-name"></div>\n' + '</div>'
                },
                initialCaption: "No file selected to import"
            });
        }
    }
});

APP.directive('fileStyled', function ($window, $timeout) {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            // Styled file input
            $('.file-styled').uniform({
                wrapperClass: 'bg-warning',
                fileButtonHtml: '<i class="icon-googleplus5"></i>'
            });
        }
    }
});

APP.directive('collapsible',function(){
    return {
        restrict : 'A',
        link : function(scope,element,attrs) {
            $(".category-collapsed").children(".category-content").hide();
            $(".category-collapsed").find("[data-action=collapse]").addClass("rotate-180");
            $(".category-title [data-action=collapse]").click(function (a) {
                a.preventDefault();
                var i = $(this).parent().parent().parent().nextAll();
                $(this).parents(".category-title").toggleClass("category-collapsed"), $(this).toggleClass("rotate-180"), i.slideToggle(150)
            });
            $(".panel-collapsed").children(".panel-heading").nextAll().hide();
            $(".panel-collapsed").find("[data-action=collapse]").children("i").addClass("rotate-180");
            $(".panel [data-action=collapse]").click(function (a) {
                a.preventDefault();
                var i = $(this).parent().parent().parent().parent().nextAll();
                $(this).parents(".panel").toggleClass("panel-collapsed"), $(this).toggleClass("rotate-180"), i.slideToggle(150)
            })
        }
    }
});

APP.directive('scrollOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, $elm, attrs) {
            var idToScroll = attrs.href;
            $elm.on('click', function(e) {
                e.preventDefault();
                var $target;
                if (idToScroll) {
                    $target = $(idToScroll);
                } else {
                    $target = $elm;
                }
                $("body").animate({scrollTop: $target.offset().top}, "slow");
            });
        }
    }
});

APP.directive('goBack',['$window', function($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);

// coming soon 
APP.directive('comingSoon', [function () {
    return {
        restrict: 'A', link: function (scope, element, attrs, parent) {
            element.addClass('coming-soon-container');
            element.append('<div class="coming-soon-wrapper"><div class="coming-soon-text-wrapper"><span class="coming-soon-text"></span></div></div>');
        }
    };
}]);

'use strict';
APP.directive('slick', [ '$timeout', function ($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                initOnload: '@',
                data: '=',
                currentIndex: '=',
                accessibility: '@',
                adaptiveHeight: '@',
                arrows: '@',
                asNavFor: '@',
                appendArrows: '@',
                appendDots: '@',
                autoplay: '@',
                autoplaySpeed: '@',
                centerMode: '@',
                centerPadding: '@',
                cssEase: '@',
                customPaging: '&',
                dots: '@',
                draggable: '@',
                easing: '@',
                fade: '@',
                focusOnSelect: '@',
                infinite: '@',
                initialSlide: '@',
                lazyLoad: '@',
                onBeforeChange: '&',
                onAfterChange: '&',
                onInit: '&',
                onReInit: '&',
                onSetPosition: '&',
                pauseOnHover: '@',
                pauseOnDotsHover: '@',
                responsive: '=',
                rtl: '@',
                slide: '@',
                slidesToShow: '@',
                slidesToScroll: '@',
                speed: '@',
                swipe: '@',
                swipeToSlide: '@',
                touchMove: '@',
                touchThreshold: '@',
                useCSS: '@',
                variableWidth: '@',
                vertical: '@',
                prevArrow: '@',
                nextArrow: '@'
            },
            link: function (scope, element, attrs) {
                $(element).css("opacity","0");
                var destroySlick, initializeSlick, isInitialized;
                destroySlick = function () {
                    return $timeout(function () {
                        var slider;
                        slider = $(element);
                        slider.slick('unslick');
                        slider.find('.slick-list').remove();
                        return slider;
                    });
                };
                initializeSlick = function () {
                    return $timeout(function () {
                        var currentIndex, customPaging, slider;
                        slider = $(element);
                        if (scope.currentIndex != null) {
                            currentIndex = scope.currentIndex;
                        }
                        customPaging = function (slick, index) {
                            return scope.customPaging({
                                slick: slick,
                                index: index
                            });
                        };
                        slider.slick({
                            accessibility: scope.accessibility !== 'false',
                            adaptiveHeight: scope.adaptiveHeight === 'true',
                            arrows: scope.arrows !== 'false',
                            asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
                            appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
                            appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
                            autoplay: scope.autoplay === 'true',
                            autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
                            centerMode: scope.centerMode === 'true',
                            centerPadding: scope.centerPadding || '50px',
                            cssEase: scope.cssEase || 'ease',
                            customPaging: attrs.customPaging ? customPaging : void 0,
                            dots: scope.dots === 'true',
                            draggable: scope.draggable !== 'false',
                            easing: scope.easing || 'linear',
                            fade: scope.fade === 'true',
                            focusOnSelect: scope.focusOnSelect === 'true',
                            infinite: scope.infinite !== 'false',
                            initialSlide: scope.initialSlide || 0,
                            lazyLoad: scope.lazyLoad || 'ondemand',
                            beforeChange: attrs.onBeforeChange ? scope.onBeforeChange : void 0,
                            onReInit: attrs.onReInit ? scope.onReInit : void 0,
                            onSetPosition: attrs.onSetPosition ? scope.onSetPosition : void 0,
                            pauseOnHover: scope.pauseOnHover !== 'false',
                            responsive: scope.responsive || void 0,
                            rtl: scope.rtl === 'true',
                            slide: scope.slide || 'div',
                            slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
                            slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
                            speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
                            swipe: scope.swipe !== 'false',
                            swipeToSlide: scope.swipeToSlide === 'true',
                            touchMove: scope.touchMove !== 'false',
                            touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
                            useCSS: scope.useCSS !== 'false',
                            variableWidth: scope.variableWidth === 'true',
                            vertical: scope.vertical === 'true',
                            prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
                            nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0
                        });
                        $(element).css("opacity","1");
                        slider.on('init', function (sl) {
                            if (attrs.onInit) {
                                scope.onInit();
                            }
                            if (currentIndex != null) {
                                return sl.slideHandler(currentIndex);
                            }
                        });
                        slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                            if (scope.onAfterChange) {
                                scope.onAfterChange();
                            }
                            if (currentIndex != null) {
                                return scope.$apply(function () {
                                    currentIndex = currentSlide;
                                    return scope.currentIndex = currentSlide;
                                });
                            }
                        });
                        return scope.$watch('currentIndex', function (newVal, oldVal) {
                            if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                                return slider.slick('slickGoTo', newVal);
                            }
                        });
                    });
                };
                if (scope.initOnload) {
                    isInitialized = false;
                    return scope.$watch('data', function (newVal, oldVal) {
                        if (newVal != null) {
                            if (isInitialized) {
                                destroySlick();
                            }
                            initializeSlick();
                            return isInitialized = true;
                        }
                    });
                } else {
                    return initializeSlick();
                }
            }
        };
    }
]);

APP.directive('crop',['$timeout',function($timeout){
    return {
        restrict: 'AC',
        link: function(scope,element,attrs) {
            $timeout(function() {
                $(element).imgAreaSelect({
                    aspectRatio: '1:1',
                    minWidth: 100,
                    minHeight:100,
                    handles: true,
                    handle: true,
                    parent : '.photo-crop-wrap',
                    onInit: function(img,selection) {
                        if(scope.setSelection) {
                            scope.setSelection(img,selection);
                        }
                    },
                    onSelectChange: function(img,selection) {
                        if(scope.setSelection) {
                            scope.setSelection(img,selection);
                        }
                    }
                });
            });
            scope.$on('$destroy', function() {
                $(element).imgAreaSelect({
                    remove: true,
                    disable: true
                })
            });
        }
    }
}]);

/**
 * Structured filter directive
 */
APP.directive('structuredFilter',['$timeout',function($timeout){
    return {
        restrict: 'AC',
        scope: {
            ngModel:'=',
            filterData: '='
        },
        link: function (scope, element, attrs,ngMdel) {
            var initialize,filter;
            initialize = function() {
                $timeout(function () {
                    $(element).structFilter({
                        fields: filter
                    });
                    $(element).on("change.search", function (event) {
                        scope.$apply(function(){
                            scope.ngModel = $(element).structFilter("val");
                        });
                    });
                });
            };
            scope.$watch('filterData', function(newValue, oldValue) {
                if (newValue) {
                    try {
                        filter = newValue;
                        initialize();
                    } catch(e) {
                       console.log(e);
                    }
                }
            });
        }
    }
}]);

/**
 * Handle empty or # anchor tags
 */
APP.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
    };
});

//ng-min directive
APP.directive('ngMin', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function(){
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === "" || value === null;
            }
            var minValidator = function(value) {
                var min = scope.$eval(attr.ngMin) || 0;
                if (!isEmpty(value) && value < min) {
                    ctrl.$setValidity('ngMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMin', true);
                    return value;
                }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

//ng-max directive
APP.directive('ngMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function(){
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var isEmpty = function (value) {
                return angular.isUndefined(value) || value === "" || value === null;
            }
            var maxValidator = function(value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});

APP.directive('ngclipboard', function() {
    return {
        restrict: 'A',
        scope: {
            ngclipboardSuccess: '&',
            ngclipboardError: '&'
        },
        link: function(scope, element) {

            var _id = element.attr('id');
            if (!_id) {
                element.attr('id', 'ngclipboard' + Date.now());
                _id = element.attr('id');
            }

            var clipboard = new Clipboard('#' + _id);

            clipboard.on('success', function(e) {

                scope.ngclipboardSuccess({
                    e: e
                });
            });

            clipboard.on('error', function(e) {
                scope.ngclipboardError({
                    e: e
                });
            });

        }
    };
});

/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 * https://github.com/vitalets/checklist-model
 * License: MIT http://opensource.org/licenses/MIT
 */

APP.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
        // contains
        function contains(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item, comparator) {
            arr = angular.isArray(arr) ? arr : [];
            if(!contains(arr, item, comparator)) {
                arr.push(item);
            }
            return arr;
        }

        // remove
        function remove(arr, item, comparator) {
            if (angular.isArray(arr)) {
                for (var i = arr.length; i--;) {
                    if (comparator(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // exclude recursion, but still keep the model
            var checklistModel = attrs.checklistModel;
            attrs.$set("checklistModel", null);
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);
            attrs.$set("checklistModel", checklistModel);

            // getter for original model
            var checklistModelGetter = $parse(checklistModel);
            var checklistChange = $parse(attrs.checklistChange);
            var checklistBeforeChange = $parse(attrs.checklistBeforeChange);
            var ngModelGetter = $parse(attrs.ngModel);

            // value added to list
            var value = attrs.checklistValue ? $parse(attrs.checklistValue)(scope.$parent) : attrs.value;


            var comparator = angular.equals;

            if (attrs.hasOwnProperty('checklistComparator')){
                if (attrs.checklistComparator[0] == '.') {
                    var comparatorExpression = attrs.checklistComparator.substring(1);
                    comparator = function (a, b) {
                        return a[comparatorExpression] === b[comparatorExpression];
                    };

                } else {
                    comparator = $parse(attrs.checklistComparator)(scope.$parent);
                }
            }

            // watch UI checked change
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    ngModelGetter.assign(scope, contains(checklistModelGetter(scope.$parent), value, comparator));
                    return;
                }

                setValueInChecklistModel(value, newValue);

                if (checklistChange) {
                    checklistChange(scope);
                }
            });

            function setValueInChecklistModel(value, checked) {
                var current = checklistModelGetter(scope.$parent);
                if (angular.isFunction(checklistModelGetter.assign)) {
                    if (checked === true) {
                        checklistModelGetter.assign(scope.$parent, add(current, value, comparator));
                    } else {
                        checklistModelGetter.assign(scope.$parent, remove(current, value, comparator));
                    }
                }

            }

            // declare one function to be used for both $watch functions
            function setChecked(newArr, oldArr) {
                if (checklistBeforeChange && (checklistBeforeChange(scope) === false)) {
                    setValueInChecklistModel(value, ngModelGetter(scope));
                    return;
                }
                ngModelGetter.assign(scope, contains(newArr, value, comparator));
            }

            // watch original model change
            // use the faster $watchCollection method if it's available
            if (angular.isFunction(scope.$parent.$watchCollection)) {
                scope.$parent.$watchCollection(checklistModel, setChecked);
            } else {
                scope.$parent.$watch(checklistModel, setChecked, true);
            }
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function(tElement, tAttrs) {
                if ((tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') && (tElement[0].tagName !== 'MD-CHECKBOX') && (!tAttrs.btnCheckbox)) {
                    throw 'checklist-model should be applied to `input[type="checkbox"]` or `md-checkbox`.';
                }

                if (!tAttrs.checklistValue && !tAttrs.value) {
                    throw 'You should provide `value` or `checklist-value`.';
                }

                // by default ngModel is 'checked', so we set it if not specified
                if (!tAttrs.ngModel) {
                    // local scope var storing individual checkbox model
                    tAttrs.$set("ngModel", "checked");
                }

                return postLinkFn;
            }
        };
    }]);

APP.directive('match',function($parse){
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
            if(!ctrl) {
                return;
            }

            var matchGetter = $parse(attrs.match);
            var caselessGetter = $parse(attrs.matchCaseless);
            var noMatchGetter = $parse(attrs.notMatch);

            scope.$watch(getMatchValue, function(){
                ctrl.$$parseAndValidate();
            });

            ctrl.$validators.match = function(){
                var match = getMatchValue();
                var notMatch = noMatchGetter(scope);
                var value;

                if(caselessGetter(scope)){
                    value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
                }else{
                    value = ctrl.$viewValue === match;
                }
                /*jslint bitwise: true */
                value ^= notMatch;
                /*jslint bitwise: false */
                return !!value;
            };

            function getMatchValue(){
                var match = matchGetter(scope);
                if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
                    match = match.$viewValue;
                }
                return match;
            }
        }
    };
});