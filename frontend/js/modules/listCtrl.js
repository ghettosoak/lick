module.exports = function(
	$firebaseArray,
	$rootScope, 
	$scope, 
	Notes,
	newNote,
	killNote,
	Boards,
	newBoard,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location,
	Logout
) {
	Notes().$bindTo($scope, 'notes');
	Boards().$bindTo($scope, 'boards');

	$scope.lookingAt = 'notes';

	$scope.newNote = function(){
		$location.path('/note/' + newNote());
	};

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
	};

	$scope.killNote = function(id){
		killNote(id);
	}

	$scope.logout = function(){
		Logout();
	}
}