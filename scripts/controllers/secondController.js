app.controller('secondController', ['$scope','$timeout','$rootScope','datacontext', function($scope, $timeout, $rootScope, datacontext){
    var vm = this;
    vm.loggedInUser = {
		personId: 10433,
		tenantId: 'FF9RD2-FFFFDD-VCDE3234-DFDFD'
	}
    vm.request = {
        primaryTask: {
            phase: "Management"
        }
    }

    $scope.$on('changePhase', function(){
        vm.request.primaryTask.phase = 'Closeout';
    });
}]);