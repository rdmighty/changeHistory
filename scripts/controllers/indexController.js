app.controller('indexController', ['$scope','$timeout','$rootScope','datacontext', function($scope, $timeout, $rootScope, datacontext){
	var vm = this;
	vm.loggedInUser = {
		personId: 10433,
		tenantId: 'FF9RD2-FFFFDD-VCDE3234-DFDFD'
	}
	vm.request = undefined;
	$timeout(function(){
vm.request = {
		id: 5,
		primaryTask: {
			name: 'Test Project Request',
			status: 'High'
		}
	}
	}, 3);
	
	vm.districts = [
		{name: 'Jaunpur', schools: [
			{name: 'St. John\'s School', noOfStudents: 1200, students: [
				{name: 'Rishabh Sharma'},
				{name: 'Divya Sharma'},
				{name: 'Dipali Sharma'}
			]},
			{name: 'St. Patrick\'s School', noOfStudents: 1000, students: [
				{name: 'Rajesh Sharma'},
				{name: 'Dubey Sharma'},
				{name: 'Dipshikha Sharma'}
			]}
		]},
		{name: 'Mirzapur', schools: [
			{name: 'Saraswati Bal Vidya Mandir', noOfStudents: 1200, students: [
				{name: 'Raju Sharma'},
				{name: 'Dabu Sharma'},
				{name: 'Dipu Sharma'}
			]},
			{name: 'Nehru Public School', noOfStudents: 1000, students: [
				{name: 'Rakesh Sharma'},
				{name: 'Divyanshu Sharma'},
				{name: 'Dipanshu Sharma'}
			]}
		]},
		{name: 'Ghazipur', schools: [
			{name: 'CSK School', noOfStudents: 1200, students: [
				{name: 'Rupesh Sharma'},
				{name: 'Dinesh Sharma'},
				{name: 'Dilvindar Sharma'}
			]},
			{name: 'Darjeeling of India', noOfStudents: 1000, students: [
				{name: 'Rajnees Sharma'},
				{name: 'Divyanka Sharma'},
				{name: 'Diplahs Sharma'}
			]}
		]},		
	]
	vm.submit = function(){
		datacontext.save();
	}
	vm.changePhase = function(){
		$rootScope.$broadcast('changePhase');
	}
}]);