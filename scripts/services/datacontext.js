(function(){
    'use strict';
    var app = angular.module('angular');
    app.factory('datacontext', ['$q', '$timeout',  '$rootScope', function($q, $timeout, $rootScope){
        var historySectionSet = false;//checks whether any section is registered
        var createHistory = true; //always ready to create history; it is used to prevent broadcast when not needed from save(hideToast)

        function save(hideToast) {
            if (historySectionSet && createHistory) {
                var deferred = $q.defer();
                $timeout(function () {
                    $rootScope.$broadcast('prepareHistory', { deferred: deferred, currentDate: new Date(), hideToast: hideToast });
                }, 5);
                return deferred.promise;
            }
            else {
                return performSave(hideToast);
            }
        }

        function performSave(hideToast){
            return $q.when(null);
        }

        function setHistorySection(sectionRegistered) {
            historySectionSet = sectionRegistered;
        }

        //createHistory is just to prevent broadcast when not needed
        function createHistoryFn(boolP) {
            createHistory = boolP;
        }

        return {
            save: save,
            setHistorySection: setHistorySection,
            createHistoryFn: createHistoryFn
        };
    }]);
})();