module.exports = function(
	$rootScope, 
	$scope, 
	Board,
	newNote,
	NoteIndex, 
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location
) {
	Board($routeParams.id).$bindTo($scope, 'board');

	NoteIndex($routeParams.id).$bindTo($scope, 'noteIndex');

	hotkeys.bindTo($scope)
		.add({
			combo: 'enter',
			description: 'confirm new name',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				console.log(_isInput())
				if ( _isInput() ){
					console.log(_noteID())
					// $scope.titleSave(_noteID(), document.activeElement);

					$timeout(function(){
						document.activeElement.blur();
					});

					event.preventDefault();
				}
			}
		});

	$scope.noteTitleLookup = function(id, e){
		var theTitle = $scope.noteIndex[id];

		if (e){
			e.target.value = theTitle;
			$scope.noteTitleLookup(id);
		}

		return theTitle;
	}

	$scope.newNote_board = function(boardID){
		var newID = newNote(boardID);
		$scope.board.notes.push({
			id: newID
		});
	}

	$scope.titleSave = function(id, e){
		var newName = e.value
		$scope.noteIndex[id] = newName;
		var noteRef = new Firebase( window.firebaseURL + '/notes/' + id );
		noteRef.child('title').set(newName);

		$scope.noteTitleLookup(id);
	}

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
	}

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