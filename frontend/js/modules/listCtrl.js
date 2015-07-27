module.exports = function(
	$firebaseArray,
	$rootScope, 
	$scope, 
	Notes,
	newNote,
	Boards,
	newBoard,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location
) {
	Notes().$bindTo($scope, 'notes');
	Boards().$bindTo($scope, 'boards');

	$scope.newNote = function(){
		$location.path('/note/' + newNote());
	};

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
	};	

	$scope.sortableOptions_list = {
		stop: function(e, ui){
			angular.forEach($scope.notes, function(note){
				console.log(typeof(note))

				// note
			})
		}
	}
}