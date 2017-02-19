/***************************************************************************
*     Author: Rishabh Sharma                                               *
*    Company: Newgen Software Technologies Ltd.                            * 
*       Date: 19 Feb 2017 12:12                                            *
****************************************************************************/

(function () {
    'use strict';

    var _historyHelper;

    _historyHelper = (function () {

        //Available Sets of Colors
        var userAbbrColors = ["#00FF2A", "#0055FF", "#FFAA55", "#FFAAAA", "#AAFF55", "#FF00AA", "#00D4FF", "#5B60F9",
                              "#D4EF65", "#D7F928", "#47E1C8", "#9B900E", "#26ED5E", "#E68C2C", "#5369BF", "#EC2626"];

        //Track of already assigned colors
        var changeHistoryUniqueColor = {};

        return new function () {
            this.getUniqueAbbrColor = function (userId) {
                //nothing extraordinary going on here
                //just used character literal 'x' as prefix to userId to make up a key
                if (!changeHistoryUniqueColor['x' + userId]) {
                    changeHistoryUniqueColor['x' + userId] = userAbbrColors[parseInt(Math.random() * userAbbrColors.length)];
                }

                return changeHistoryUniqueColor['x' + userId];
            }
        }
    })();

    var _u = {
        i: {
            SIMPLE: '@',
            EXPRESSION: '$'
        },
        a: function (obj) {
            if (!obj)
                return obj;
            else
                return angular.element(obj);
        },
        safeApply: function (scope, fn) {
            if (scope.$$phase) {
                if (fn instanceof Function)
                    fn();
            } else {
                scope.$apply(fn);
            }
        },
        getExpr: function (val) {
            var splits = val.split(/[\s,{{,}}]+/);
            var expr = null;
            for (var i = 0, max = splits.length ; i < max ; i++) {
                if (splits[i] && splits[i] != '' && !angular.isUndefined(splits[i])) {
                    expr = splits[i];
                    break;
                }
            }
            return expr;
        },
        evalNavigation: function (obj, navs) {
            var data = obj;
            var navs = navs.split('.');
            for (var i = 0, max = navs.length ; i < max ; i++)
                data = data[navs[i]];
            return data;
        },        
        ripExpression: function(expr, fChar){
           var firstChar = fChar || (expr ? expr.charAt(0) : null);
           if((firstChar == _u.i.SIMPLE) || (firstChar == _u.i.EXPRESSION))
                return expr.substring(1, expr.length);          
            else 
                return expr;
        },
        evalExpression: function (scope, expr) {
           var firstChar = (expr ? expr.charAt(0) : null);
           if(firstChar == _u.i.SIMPLE)
                return expr.substring(1, expr.length);
           else if(firstChar == _u.i.EXPRESSION)
                return scope.$eval(expr.substring(1, expr.length));  
            else 
                return expr;       
        },
		splitAtFirstStop: function(str){
			return str.substring(str.indexOf('.')+1, str.length);
		},
        ChangeHistory: function(config){
            var obj = {};
            return angular.extend(obj, config || {});
        }
    };

    var changeHistory = angular.module("change.history", [])

    .directive("changeHistory", ['$timeout', '$filter', '$stateParams', function ($timeout, $filter, $stateParams) {
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: 'app/partials/directive-templates/projectChangeHistory.tpl.html',
            link: function (scope, elem, attr) {
                var _elem = angular.element(elem);
                var _projectId = $stateParams.id;

                if (!_projectId) {
                    console.error("ProjectChangeHistory: No ProjectId found");
                    return;
                }

                scope.$changeHistories = null;

                //get ChangeHistories
                // datacontext.changehistory.getAllByEntityId(_projectId).then(function (data) {
                //     var unformattedChangeHistories = data;

                //     if (unformattedChangeHistories.length > 0) {
                //         //group change history in terms of userName and createdDate
                //         scope.$changeHistories = $filter('groupByProperties')(unformattedChangeHistories, 'personId, createdDate');

                //         registerEvents();
                //     }
                // });

                scope.$getUniqueColor = function (personId) {
                    return _historyHelper.getUniqueAbbrColor(personId);
                }

                function registerEvents() {
                    //wait for atleast 100 ms for html to get rendered and then register events
                    $timeout(function () {
                        var changeHistoryBriefLine = _elem.find('.change-histories .change-history-elem .change-history-brief');
                        var fieldsEntryPoint = _elem.find('.change-histories .change-history-elem .change-history-detail div:nth-child(1)');

                        //when Brief description is clicked open up 'Fields'
                        _aelem(changeHistoryBriefLine).on('click', function (event) {
                            addOrRemoveClass(event);
                        });

                        //when 'Fields' is clicked -> show table 
                        _aelem(fieldsEntryPoint).on('click', function (event) {
                            addOrRemoveClass(event);
                        });

                        //on mouseover color some of the spans blue
                        _aelem(changeHistoryBriefLine).on('mouseover', highlightChangeHistoryBrief);
                        _aelem(fieldsEntryPoint).on('mouseover', highlightChangeHistoryFieldsLabel);

                        //revert back the colors once mouse is out
                        _aelem(changeHistoryBriefLine).on('mouseout', unHighlightChangeHistoryBrief);
                        _aelem(fieldsEntryPoint).on('mouseout', unHighlightChangeHistoryFieldsLabel);
                    }, 200);
                }

                //return angular element
                function _aelem(elem) {
                    return angular.element(elem);
                }

                function highlightChangeHistoryBrief(event) {
                    _aelem(_aelem(event.currentTarget).find('span')[2]).css('color', '#007ACC');
                    _aelem(_aelem(event.currentTarget).find('span')[3]).css('color', '#007ACC');
                    _aelem(_aelem(event.currentTarget.children[0])).css('color', '#007ACC');
                }

                function unHighlightChangeHistoryBrief(event) {
                    _aelem(_aelem(event.currentTarget).find('span')[2]).css('color', '#2C2C2C');
                    _aelem(_aelem(event.currentTarget).find('span')[3]).css('color', '#6D6D6D');
                    _aelem(_aelem(event.currentTarget.children[0])).css('color', 'black');
                }

                function highlightChangeHistoryFieldsLabel(event) {
                    _aelem(event.currentTarget.children[0]).css('color', '#007ACC');
                }

                function unHighlightChangeHistoryFieldsLabel(event) {
                    _aelem(event.currentTarget.children[0]).css('color', 'black');
                }

                //add when not already present and remove if already present (class: change-history-elem-visible)
                function addOrRemoveClass(event) {
                    var nextElementSibling = _aelem(event.currentTarget.nextElementSibling);
                    if (event.currentTarget.nextElementSibling && event.currentTarget.nextElementSibling.classList.contains('change-history-elem-visible')) {
                        nextElementSibling.removeClass('change-history-elem-visible');
                        _aelem(event.currentTarget.children[0]).css({ 'transform': 'rotate(0deg)', 'color': 'black' });
                    } else {
                        nextElementSibling.addClass('change-history-elem-visible');
                        _aelem(event.currentTarget.children[0]).css({ 'transform': 'rotate(45deg)', 'color': '#007ACC !important' });
                    }
                }
            }
        }
    }])

    .factory('chService', ['datacontext', function (datacontext) {
        var sectionCount = 0, // number of sections registered to create history
            submittedSection = 0; // number of sections submitted their history

        // @params defObj is deferred object passed in from datacontext's function save(hideToast)
        function submitHistories(defObj, hideToast) {
            submittedSection++;
            // when all sections have submitted their respective histories then call save
            if (submittedSection >= sectionCount) {
                datacontext.createHistoryFn(false);
                datacontext.save(hideToast).then(function () {
                    submittedSection = 0; //reset 
                    defObj.resolve(); //let function go through
                    datacontext.createHistoryFn(true);
                });                
            }
        }

        // register new section
        function registerSection() {
            sectionCount++;
            datacontext.setHistorySection(true);
        }

        // unregister a section
        function deregisterSection() {
            sectionCount -= 1;
            if(sectionCount <= 0)
                datacontext.setHistorySection(false);
        }

        var obj = {
            submitHistories: submitHistories,
            registerSection: registerSection,
            deregisterSection: deregisterSection,
            isSectionSet: false
        };

        return obj;
    }])

    //parent directive
	.directive('changeHistorySection', ['chService', function (chService) {
	    return {
	        restrict: 'E',
	        require: 'changeHistorySection',
	        replace: true,
	        transclude: true,
	        controller: 'changeHistorySectionCtrl',
	        controllerAs: '$hSec',
	        link: function (scope, elem, attr, $hSec, transclude) {
	            // pass the scope
	            transclude(scope, function (clone) {
	                elem.append(clone);
	            });
	        }
	    }
	}])

	.controller('changeHistorySectionCtrl', ['$scope', '$element', '$attrs', '$timeout', 'chService', function ($scope, $element, $attrs, $timeout, chService) {
	    var $hSec = this,	//controller's allias								        
			defObj = null, // deferred object passed in from datacontext's function save(hideToast)	
	        entityWatchCount = 0;             

	    chService.registerSection(); //register a section

	    $hSec.$defaults = $scope.$eval($attrs['sDefaults']); //default configuration of this section
	    $hSec.$name = _u.evalExpression($scope, $attrs['sName']);
	    $hSec.$entity = _u.evalExpression($scope, $attrs['sEntity']);
	    $hSec.$regNewField = registerNewField;
	    $hSec.$revokeAndRegisterAgain = registerAllFields;
        $hSec.chArr = []; // list of all the children of sections 
        $hSec.getRepeatId = getRepeatId;

        var $watcher = $scope.$watch(_u.ripExpression($attrs['sEntity']), function (newValue, oldValue) {
	        if (newValue && newValue != '') {
	            $hSec.$entity = newValue;
	            entityWatchCount++;
	            if (entityWatchCount >= 1) {
	                registerAllFields();
                    $watcher(); //unwatch
                }
	        }
	    });

        function getRepeatId(ctx, level){
            var id = 'ch-'+ctx.$index, finCtx = ctx, i = 0;
            for(; i < (level-1); i ++){
                finCtx = finCtx.$parent;
                id += finCtx.$index+'-';
            }
            if((level - 1) != 0 && i == (level - 1))
                id = id.substring(0, id.length - 1);
            return id;
        }

	    function registerAllFields() {
	        //$hSec.chArr = [];
	        (function (elem) {
	            $timeout(function () {
	                var elements = elem.querySelectorAll('[ch]');
	                for (var i = 0, max = elements.length ; i < max ; i++)
	                    registerField(elements[i]);
	            });
	        })($element[0]);
	    }

	    function registerField(field) {
	        var aElem = _u.a(field),
                obj = {};

	        obj.$config = _u.evalExpression($scope, aElem.attr('ch-config'));	        
	        obj.ngModel = obj.$config && obj.$config.ngModel ? obj.$config.ngModel : aElem.attr('ng-model');
			obj.dataContext = obj.$config && obj.$config.dataContext ? obj.$config.dataContext : null;
            obj.entity = obj.$config && obj.$config.entity ? obj.$config.entity : $hSec.$entity;
            obj.isAdded = false;
			obj.oldValue = !obj.dataContext ? $scope.$eval(obj.ngModel) : obj.dataContext[obj.ngModel];
	        obj.newValue = null;

	        pushInChArr(obj);
	    }

	    function registerNewField(config) {
	        var obj = {};
	        obj.$config = config;
	        obj.ngModel = obj.$config && obj.$config.ngModel ? obj.$config.ngModel : null;
			obj.dataContext = obj.$config && obj.$config.dataContext ? obj.$config.dataContext : null;
	        obj.oldValue = !obj.dataContext ? $scope.$eval(obj.ngModel) : obj.dataContext[obj.ngModel];
	        obj.newValue = null;
            obj.entity = obj.$config && obj.$config.entity ? obj.$config.entity : $hSec.$entity;

	        pushInChArr(obj);
	    }

        function pushInChArr(obj){
            var prevObj = _.find($hSec.chArr, function(item){
                return item.ngModel == obj.ngModel && (item.$config && item.$config.fieldName == obj.$config.fieldName && item.$config.elmId == obj.$config.elmId);
            });
            if(!prevObj){
                console.log('An obj pushed into section: '+$hSec.$name);
                $hSec.chArr.push(obj);
            }
        }

	    console.log('Registering History: ' + $hSec.$name);
	    $scope.$on('prepareHistory', function (event, data) {
	        console.log('Preparing History: ' + $hSec.$name);
	        defObj = data.deferred;
            var chArr = $hSec.chArr;
	        for (var i = 0, max = chArr.length ; i < max ; i++) {
	            chArr[i].newValue = !chArr[i].dataContext ? $scope.$eval(chArr[i].ngModel) : chArr[i].dataContext[chArr[i].ngModel];	          
                //isAdded = entity.entityAspect ? entity.entityAspect.entityState.name === 'Added' : false;
	            if (chArr[i].isAdded || (chArr[i].oldValue != chArr[i].newValue)) {	                
                    // prepare new history
	                var changeHistory = _u.ChangeHistory();
	                changeHistory = angular.extend(changeHistory, $hSec.$defaults, chArr[i].$config);
	                changeHistory.createdDate = data.currentDate;
	                changeHistory.modifiedDate = data.currentDate;
	                changeHistory.oldValue = chArr.isAdded ? null : (chArr[i].oldValue === '' ? null : chArr[i].oldValue);
	                changeHistory.newValue = chArr[i].newValue === '' ? null : chArr[i].newValue;
	                changeHistory.sectionName = $hSec.$name;     
                    delete changeHistory['dataContext'];

                    chArr[i].oldValue = chArr[i].newValue;
                    console.log('ChangeHistory: '+JSON.stringify(changeHistory));                    
                    //console.log('Create 1 ChangeHistory. From '+changeHistory.oldValue+' To '+changeHistory.newValue);                    
	            }
	        }            
	        chService.submitHistories(defObj, data.hideToast);
            //registerAllFields(); //Re-register fields	         
	    });

	    $scope.$on('$destroy', function () {
	        chService.deregisterSection();
	    });

	    //registerAllFields();
	}]);
})();

