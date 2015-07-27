module.exports = function(
	$rootScope, 
	$scope, 
	Board,
	Notes,
	newNote,
	newBoard,
	NoteIndex, 
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location
) {
	Board($routeParams.id).$bindTo($scope, 'board');

	Notes($routeParams.id).$bindTo($scope, 'notes');

	NoteIndex($routeParams.id).$bindTo($scope, 'noteIndex');

	$scope.newNote_board = function(boardID){
		newNote(boardID);
	}

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
	};

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

	var _isInput = function(){
		console.log('WHAT THE FUCK')
		return document.activeElement.type === 'text';
	},

	_noteID = function(){
		return $(document.activeElement).parent('.board_note').attr('data-id');
	};

}