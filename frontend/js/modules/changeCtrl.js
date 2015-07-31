module.exports = function(
	$rootScope, 
	$scope,
	Boards,
	newBoard,
	Note,
	$routeParams, 
	$route,
	hotkeys,
	$timeout,
	$location,
	$window,
	Logout
) {
	Boards().$bindTo($scope, 'boards');
	Note($routeParams.id).$bindTo($scope, 'note');

	hotkeys.bindTo($scope)
		.add({
			combo: 'esc',
			description: 'ah, forget it',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				$scope.goBack();
			}
		});

	$scope.goBack = function(){		
		$window.history.back();
	}

	$scope.changeBoard = function(board){
		$scope.note.parent = board;
		$location.path('/note/' + $routeParams.id);
	};

	$scope.newBoard = function(){
		var newBoardID = newBoard()
		$scope.note.parent = newBoardID;
		$location.path('/board/' + newBoardID);
	}

	$scope.noBoard = function(){
		$scope.note.parent = null;
		$scope.goBack();
	}

	$scope.logout = function(){
		Logout();
	}
};