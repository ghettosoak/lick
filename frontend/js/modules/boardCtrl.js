module.exports = function(
	$rootScope, 
	$scope, 
	Board,
	newBoard,
	killBoard,
	Notes,
	newNote,
	killNote,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location,
	$interval
) {
	Board($routeParams.id).$bindTo($scope, 'board');

	Notes($routeParams.id).$bindTo($scope, 'notes');

	$scope.newNote = function(boardID){
		newNote(boardID);
	};

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
	};

	$scope.killNote = function(id_note, id_board){
		killNote(id_note, id_board);
	};

	var isEmpty = true;

	isBoardEmpty = function(){
		if ($('.board_body ul li').length > 0)
			isEmpty = false;
		else
			isEmpty = true;

		$scope.boardIsEmpty = isEmpty;
	};

	$scope.killBoard = function(id){
		$scope.boardIsEmpty && killBoard(id);
	}

	$interval(isBoardEmpty, 1000);

	$scope.boardGridOpts = {
	    columns: 4,
	    floating: false,
	    mobileModeEnabled: false,
	    minColumns: 4,
	    minRows: 4,
	    maxRows: 10,
	    defaultSizeX: 1,
	    defaultSizeY: 1,
	    resizable: {
	       enabled: false,
	    },
	};
}