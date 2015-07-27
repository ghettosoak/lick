module.exports = function(
	$firebaseArray,
	$rootScope, 
	$scope, 
	Notes,
	Boards,
	newNote,
	newBoard,
	// NoteIndex,
	// BoardIndex,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location
) {

	// $scope.list = List();

	Notes().$bindTo($scope, 'notes');
	Boards().$bindTo($scope, 'boards');

	// NoteIndex().$bindTo($scope, 'noteIndex');

	// BoardIndex().$bindTo($scope, 'boardIndex');

	// $scope.getName_note = function(id){
	// 	return $scope.noteIndex[id];
	// }

	// $scope.getName_board = function(id){
	// 	return $scope.boardIndex[id];
	// }

	$scope.newNote = function(){
		$location.path('/note/' + newNote());
	};

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
	};	

	$scope.sortableOptions_list = {
		stop: function(e, ui){
			console.log(e)
		}
	}
}