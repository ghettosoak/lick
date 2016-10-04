(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Vendor files
// var $ = window.jQuery = window.$ = require('./vendor/jquery-1.11.1.min');

var $$_ = window.$$_ = require('./shared/core'); 

var homeCtrl = require('./modules/homeCtrl'),
	noteCtrl = require('./modules/noteCtrl'),
	changeCtrl = require('./modules/changeCtrl'),
	boardCtrl = require('./modules/boardCtrl'),
	listCtrl = require('./modules/listCtrl');
	colophonCtrl = require('./modules/colophonCtrl');

// expose your functions to the global scope for testing
var $body = $('#ng-app')

window._Firebase = new Firebase( 'https://lick.firebaseio.com' );
window.listLookingAt = 'notes';
window.directions = ['north', 'east', 'south', 'west'];
window.loggedIn = false;
window.loggingIn = false;
window.emailEscaper = function(email){
	return email.replace(/[ .]/g, "_");
}
window.historical = [];

if (navigator.userAgent.indexOf('iPad') > -1){
	$('html').addClass('iPad')
}

// define our app and dependencies (remember to include firebase!)
var app = angular.module(
	'lick', 
	[
		'firebase', 
		'ngRoute',
		'ui.sortable',
		'cfp.hotkeys',
		'ngSanitize',
		'ngCookies',
		'gridster',
		'ngAnimate',
		'ngTouch',
		'angularFileUpload'
	]
);

app.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		if (error === "AUTH_REQUIRED") {
			$location.path("/home");
		}
	});
}]);

app.config( function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'assets/inc/home.html',
            controller  : 'homeCtrl',
        })

        // route for notes
        .when('/note/:id', {
            templateUrl : 'assets/inc/note.html',
            controller  : 'noteCtrl'
        })

        // route for sharednotes
        .when('/sharednote/:id', {
            templateUrl : 'assets/inc/note.html',
            controller  : 'noteCtrl'
        })

        // route for changing boards
        .when('/change/:id', {
            templateUrl : 'assets/inc/change.html',
            controller  : 'changeCtrl'
        })

        // route for boards
        .when('/board/:id', { 
            templateUrl : 'assets/inc/board.html',
            controller  : 'boardCtrl'
        })

        // route for list
        .when('/list', { 
			templateUrl : 'assets/inc/list.html',
			controller  : 'listCtrl'
        })

        // route for list
        .when('/colophon', { 
			templateUrl : 'assets/inc/colophon.html',
			controller  : 'colophonCtrl'
        });
})
.run( function($rootScope, $location, $cookies, Login, $route, $timeout, $animate) {
	$rootScope.$on( '$routeChangeStart', function(event, next, current) {

		window.historical.push($location.path())

		if ((typeof(current) !== 'undefined') && (typeof(current.templateUrl) !== 'undefined'))
			$body.attr( 'data-leaving', current.templateUrl.split('/')[2].split('.')[0] );
		if ((typeof(next) !== 'undefined') && (typeof(next.templateUrl) !== 'undefined'))
			$body.attr( 'data-entering', next.templateUrl.split('/')[2].split('.')[0] );
		else{
			$timeout(function () {
				$body.addClass('ready');
			});
		}

		if (window.loggedIn){
			console.log('already logged in!')
			window.scrollTo(0, 0);
			return true;
		}
		else{
			if ( (!$cookies.email && !$cookies.pass) && next.templateUrl !== 'assets/inc/colophon.html'){	
				console.log('no stored login, goto start')
				$location.path('/')
				$timeout(function () {
					$body.addClass('ready');
				});
			}
			else if ( ($cookies.email && $cookies.pass) ){
				console.log('stored login found, logging in')
				Login($cookies.email, $cookies.pass, function(){
					if (next.templateUrl === 'assets/inc/home.html'){
						$body.addClass('ready')
						$location.path('/list');
					}
					else {
						$animate.enabled(false);
						$route.reload();
						$timeout(function () {
							$animate.enabled(true);
							$body.addClass('ready')
						});
					}

					console.log('OKAY')
				});
			}
		}
	});

	$body.attr('data-direction', function(){
		if ($cookies.direction){
			return window.directions[$cookies.direction % 4];
		}
		else{
			$cookies.direction = 0;
			return window.directions[$cookies.direction];
		}
	})
});


app.factory("Login", ['$rootScope', "$firebaseAuth", "$cookies", '$timeout', 'Auth', '$location',
	function($rootScope, $firebaseAuth, $cookies, $timeout, Auth, $location) {
		return function(theEmail, thePass, callback, errorCallback){

			console.log(window.loggingIn, theEmail, thePass/*, callback, errorCallback*/)

			if (!window.loggingIn){
				window.loggingIn = true;

				Auth.$authWithPassword({
					email: theEmail,
					password: thePass
				}).then(function(authData) {

					console.log('logged in with ' + theEmail + ', ' + authData.uid)
					window.loggingIn = false;
					$cookies.email = theEmail;
					$cookies.email_escaped = window.emailEscaper(theEmail);
					$cookies.pass = thePass;
					window.uid = authData.uid;
					window.loggedIn = true;

					if (typeof(callback) === 'function'){
						$timeout(function () {
							callback();
						});
					}

				}).catch(function(error) {
					if (typeof(errorCallback) === 'function'){
						errorCallback();
					}

					window.loggingIn = false;
					$location.path('/');
					$body.addClass('ready');
					console.error("Authentication failed:", error);
					$cookies.email = '';
					$cookies.pass = '';
					alert('Oh no! Your login didn\'t work. Try again? :)');
				});
			}
		}
	}
]);


app.factory("Logout", ["$firebaseAuth", "$cookies", 'Auth', '$location',
	function($firebaseAuth, $cookies, Auth, $location) {
		return function(){

			Auth.$unauth();
			$cookies.email = '';
			$cookies.pass = '';
			window.uid = '';
			window.loggedIn = false;

			$location.path('/');
		}
	}
]);

app.factory('Auth', ["$firebaseAuth",
	function($firebaseAuth) {
		return $firebaseAuth(window._Firebase);
	}
]);

app.factory('Notes', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child(window.uid + '/notes');
			return $firebaseObject(ref);
		};
	}
]);

app.factory('SharedNotes', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('_shared');
			return $firebaseObject(ref);
		};
	}
]);

app.factory('Boards', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child(window.uid + '/boards');
			return $firebaseObject(ref);
		};
	}
]);

app.factory('Note', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child(window.uid + '/notes/' + id);
			return $firebaseObject(ref);
		};
	}
]);

app.factory('sharedNote', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('_shared/' + id);
			return $firebaseObject(ref);
		};
	}
]);

app.factory('Board', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child(window.uid + '/boards/' + id);
			return $firebaseObject(ref);
		};
	}
]);

app.factory('newBit', 
	function() {
		return function(tab, content, link) {
			return {
				display: true,
				type:"plainText",
				tabCount: tab,
				content: typeof(content) !== 'undefined' ? content : '',
				contentCaret: typeof(content) !== 'undefined' ? content : '<span class="hiddenCaret"></span>',
				bitID: $$_.randomize(),
				mark: false,
				selected: false,
				created: new Date(),
				destroyed: "",
				marked: "",
				menu_open: false,
				isLink: typeof(link) !== 'undefined' ? true : false,
				address: typeof(link) !== 'undefined' ? link : ''
			};
		};
	}
);

app.factory('firstNote', ['newBit',
	function(newBit) {
		return function(parent, id) {
			var noteID;

			if (id){
				noteID = id;
			}else{
				noteID = $$_.randomize();
			}

			var noteRef = window._Firebase.child(window.uid + '/notes/' + noteID );
			noteRef.set({
				title: 'Welcome to Lick! :) Click here to get started!',
				parent: typeof(parent) === 'undefined' ? null : parent,
				id: noteID,
				body: [
					newBit(0, 'Hi there! Welcome to Lick, the smartest way for your tongue to take notes. Your hands can help too, if they\'d like. :)'),
					newBit(0, 'Lick harnesses the power of your favorite text editor to help you organize your life.'),
					newBit(1, 'If you don\'t know what one of those is, that\'s okay – Lick is still just your speed!'),
					newBit(0, 'Notes can either be stand-alone, or can be organized into boards. Go ahead and close this and make a new board, they\'re pretty handy!'),
					newBit(0, 'Lick seems pretty simple, but it\'s got a lot of cool things built right in. It might surprise you!'),
					newBit(0, 'A list of Lick\'s keyboard shortcuts is never far from reach: press command + ? to see it!'),
					newBit(0, 'On a mobile device? There are lots of swipable things – give it a shot!'), 
					newBit(0, 'Lick is a work in progress, and if something goes wrong, let me know at e@ject.ch.', 'mailto:e@ject.ch'),
					newBit(0, 'Happy Licking! :)')
				],
				category: 0,
				display: true,
				list: true
			});

			return noteID;
		};
	}
]);

app.factory('newNote', ['newBit',
	function(newBit) {
		return function(parent, id) {
			var noteID;

			if (id){
				noteID = id;
			}else{
				noteID = $$_.randomize();
			}

			var noteRef = window._Firebase.child(window.uid + '/notes/' + noteID );
			noteRef.set({
				title: '',
				parent: typeof(parent) === 'undefined' ? null : parent,
				id: noteID,
				body: [newBit(0)],
				category: 0,
				display: true,
				list: true
			});

			return noteID;
		};
	}
]);

app.factory('shareNote', ['$firebaseObject', 'Note', '$cookies', '$location',
	function($firebaseObject, Note, $cookies, $location) {
		return function(id, target) {

			if ($location.path().indexOf('shared') > 0){

				var ref = window._Firebase.child('_shared/' + id + '/participants/' + emailEscaper(target));

				ref.set({
					parent: false
				})

			}else{
				Note(id).$loaded().then(function(privateNote) {
					var sharing = {};
					if (privateNote.parent){
						sharing[$cookies.email_escaped] = {
							parent: privateNote.parent,
							x: privateNote.x,
							y: privateNote.y
						}
					}else{
						sharing[$cookies.email_escaped] = { parent: false }
					}

					sharing[emailEscaper(target)] = { parent: false }

					var sharedRef = window._Firebase.child('_shared/' + id);
					sharedRef.set({
						title: privateNote.title,
						id: privateNote.id,
						body: privateNote.body,
						category: privateNote.category,
						display: privateNote.display,
						list: privateNote.list,
						participants: sharing
					});

					privateNote.$remove();

					$location.path('/sharednote/' + id);
				});
			}
		};
	}
]);


app.factory('killNote', ['Note', 'sharedNote', '$location',
	function(Note, sharedNote, $location) {
		return function(id, parent) {

			if (parent){
				$location.path('/board/' + parent);
			}
			else{
				$location.path('/list');
			}

			note = Note(id);
			note.$remove();

			sharedNote = sharedNote(id);
			sharedNote.$remove();
		};
	}
]);

app.factory('newBoard',
	function() {
		return function() {
			boardID = $$_.randomize();

			//BOARDS
			var boardRef = window._Firebase.child(window.uid + '/boards/' + boardID );
			boardRef.set({
				title: '',
				id: boardID,
				notes:[]
			});

			return boardID;
		};
	}
);

app.factory('killBoard', ['Board', '$location',
	function(Board, $location) {
		return function(id, parent) {
			$location.path('/list');
			board = Board(id);
			board.$remove();
		};
	}
]);

app.factory('concentricity', ['$cookies',
	function($cookies) {
		return function(id, parent) {
			$body.addClass('concentric').attr('data-direction', 
				function(){
					return window.directions[++$cookies.direction % 4];
				}
			)

			setTimeout(function(){
				$body.removeClass('concentric')
			}, 1000)
		};
	}
]);


app.controller('homeCtrl', 
	[
		'$rootScope', 
		'$scope',
		'Note',
		'newNote', 
		'killNote',
		'newBit',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$cookies',
		'Auth',
		'Login',
		'firstNote',
		homeCtrl
	]
);

app.controller('noteCtrl', 
	[
		'$controller',
		'$rootScope', 
		'$scope',
		'Note',
		'sharedNote',
		'newNote', 
		'killNote',
		'shareNote',
		'newBit',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$cookies',
		'Logout',
		'concentricity',
		'FileUploader',
		noteCtrl
	]
);

app.controller('changeCtrl', 
	[
		'$rootScope', 
		'$scope',
		'Boards',
		'newBoard',
		'Note',
		'sharedNote',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$window',
		'$cookies',
		changeCtrl
	]
);

app.controller('boardCtrl', 
	[
		'$rootScope', 
		'$scope', 
		'Board',
		'newBoard',
		'killBoard',
		'Notes',
		'SharedNotes',
		'newNote',
		'killNote',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$interval',
		'$cookies',
		'Logout',
		'concentricity',
		boardCtrl
	]
);

app.controller('listCtrl', 
	[
		'$firebaseArray',
		'$rootScope', 
		'$scope', 
		'Notes',
		'SharedNotes',
		'newNote',
		'killNote',
		'Boards',
		'newBoard',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$cookies',
		'Logout',
		'concentricity',
		listCtrl
	]
);

app.controller('colophonCtrl', 
	[
		'$rootScope', 
		'$scope', 
		'hotkeys',
		colophonCtrl
	]
);















},{"./modules/boardCtrl":2,"./modules/changeCtrl":3,"./modules/colophonCtrl":4,"./modules/homeCtrl":5,"./modules/listCtrl":6,"./modules/noteCtrl":7,"./shared/core":8}],2:[function(require,module,exports){
module.exports = function(
	$rootScope, 
	$scope, 
	Board,
	newBoard,
	killBoard,
	Notes,
	SharedNotes,
	newNote,
	killNote,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location,
	$interval,
	$cookies,
	Logout,
	concentricity
) {
	Board($routeParams.id).$bindTo($scope, 'board');

	Notes($routeParams.id).$bindTo($scope, 'notes');

	SharedNotes($routeParams.id).$bindTo($scope, 'sharednotes')
		.then(function() {

			$scope.sharedFilter = function(e){
				var shared = {};
				angular.forEach(e, function(e, k){
					if (typeof(e) === 'object' && !!e){
						angular.forEach(e.participants, function(f, l){
							if (
								(l == window.uid || l == $cookies.email_escaped) 
								&& (e.participants[$cookies.email_escaped].parent === $routeParams.id)
							){
								shared[k] = e;
							}
						})
					}
				})

				return shared;
			}

		});

    $scope.pageClass = 'board';

    $scope.concentric = function(){
    	concentricity();
    };

	hotkeys.bindTo($scope)
		.add({
			combo: 'esc',
			description: 'Go back to List',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				$location.path('/list');
			}
		})

	$scope.newNote = function(boardID){
		newNote(boardID);
		$scope.closeMenu();
	};

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
		$scope.closeMenu();
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

	$scope.killWarn = false;

	$scope.killBoard = function(id){
		if ($scope.boardIsEmpty){
			killBoard(id);
		}else{
			$scope.killWarn = true;

			$timeout(function(){
				$scope.killWarn = false;
			}, 3000);
		}
	}

	emptyWatcher = $interval(isBoardEmpty, 1000);

	$scope.$on('$routeChangeStart', function(next, current) { 
		$interval.cancel(emptyWatcher)
	});

	$scope.boardItemOpts_private = {
	    sizeX: '1',
	    sizeY: window.innerWidth < 768 ? 2 : 1,
	    row: 'note.y',
	    col: 'note.x'
	};

	$scope.boardItemOpts_shared = {
	    sizeX: '1',
	    sizeY: window.innerWidth < 768 ? 2 : 1,
	    row: 'note.participants["' + $cookies.email_escaped + '"].y',
	    col: 'note.participants["' + $cookies.email_escaped + '"].x'
	};

	$scope.boardGridOpts = {
	    columns: 4,
	    floating: false,
	    mobileModeEnabled: false,
	    minColumns: 4,
	    minRows: 4,
	    maxRows: 10,
	    defaultSizeX: 1,
	    defaultSizeY: window.innerWidth < 768 ? 2 : 1,
	    resizable: {
	       enabled: false,
	    },
		draggable: {
			handle: window.innerWidth < 768 ? '.grabber' : null
		}
	};

	$scope.logout = function(){
		Logout();
	}

	$scope.openMenu = function(){
		$('#main').toggleClass('mobileMenuOpen');	
	};

	$scope.closeMenu = function(){
		$('#main').removeClass('mobileMenuOpen');	
	};
}
},{}],3:[function(require,module,exports){
module.exports = function(
	$rootScope, 
	$scope,
	Boards,
	newBoard,
	Note,
	sharedNote,
	$routeParams, 
	$route,
	hotkeys,
	$timeout,
	$location,
	$window,
	$cookies
) {
	Boards().$bindTo($scope, 'boards');

	console.log(window.historical[window.historical.length])
	console.log(window.historical[window.historical.length - 1])
	console.log(window.historical[window.historical.length - 2])

	if (window.historical[window.historical.length - 2].indexOf('shared') > 0){
		console.log('SHARED')
		sharedNote($routeParams.id).$bindTo($scope, 'note')
		.then(function(payload){
			console.log($scope.note)
		})
	}else{
		console.log('PRIVATE')
		Note($routeParams.id).$bindTo($scope, 'note')
		.then(function(payload){
			console.log($scope.note)
		})
	}

    $scope.pageClass = 'change';

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
		if ($scope.note.participants)
			$location.path('/sharednote/' + $routeParams.id);
		else
			$location.path('/note/' + $routeParams.id);
	}

	$scope.changeBoard = function(board){
		if ($scope.note.participants)
			$scope.note.participants[$cookies.email_escaped].parent = board;
		else
			$scope.note.parent = board;

		$scope.goBack();
	};

	$scope.newBoard = function(){
		var newBoardID = newBoard()

		if ($scope.note.participants)
			$scope.note.participants[$cookies.email_escaped].parent = newBoardID;
		else
			$scope.note.parent = newBoardID;

		$location.path('/board/' + newBoardID);
	}

	$scope.noBoard = function(){
		if ($scope.note.participants)
			$scope.note.participants[$cookies.email_escaped].parent = false;
		else
			$scope.note.parent = null;

		$scope.goBack();
	}
};










},{}],4:[function(require,module,exports){
module.exports = function(
	$rootScope, 
	$scope, 
	hotkeys
) {

	$scope.pageClass = 'colophon';

	hotkeys.bindTo($scope)
		.add({
			combo: 'esc',
			description: 'Go back to List',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				window.history.back();
			}
		})

	$scope.goBack = function(){
		window.history.back();
	}
}
},{}],5:[function(require,module,exports){
module.exports = function(
	$rootScope, 
	$scope, 
	Note,
	newNote,
	killNote,
	newBit,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location,
	$cookies,
	Auth,
	Login,
	firstNote
) {
    $scope.auth = Auth;

    $scope.pageClass = 'home';
    $scope.viewing = 'signIn';
    $scope.loading = false;

    if (window.loggedIn)
	    $location.path('/list');

    $scope.sign_up = function(){
    	if (!$scope.signIn.$pristine)
	    	$scope.loading = true;

		$scope.auth.$createUser({
			email    : $scope.signUp_input.email,
			password : $scope.signUp_input.password
		}).then(function(userData) {

			$scope.loading = false;

			console.log('new user "' + userData.uid + '" created!');

			window.uid = userData.uid;

			$timeout(function(){
				Login($scope.signUp_input.email, $scope.signUp_input.password, function(){
					firstNote();
					$location.path('/list/');
				})
			})

		}).catch(function(error) {
			console.log(error);
		});
    }

    $scope.sign_in = function(){
    	if (!$scope.signIn.$pristine)
	    	$scope.loading = true;
    	Login($scope.signIn_input.email, $scope.signIn_input.password, 
    		function(){
	    		$scope.loading = false;
	    		if (!window.resettingPassword)
		    		$location.path('/list/');
		    	else{
		    		$scope.viewing = 'pwchange';
		    	}
	    	},
	    	function(){
	    		$scope.loading = false;
	    		$scope.signIn_input.email = '';
	    		$scope.signIn_input.password = '';
	    	}
    	);
    }

    $scope.newPW = function(){
    	if (!$scope.signIn.$pristine)
	    	$scope.loading = true;

		$scope.auth.$changePassword({
			email: $scope.signIn_input.email,
			oldPassword: $scope.signIn_input.password,
			newPassword: $scope.reset_input.password
		}).then(function() {
			$scope.loading = false;
			window.resettingPassword = false;
			$location.path('/list/');
			alert('Alright, your password has been reset!\n\nDon\'t worry, it happens to everyone! :)')
		}).catch(function(error) {
			console.error("Error: ", error);
		});
    }

    $scope.pwReset = function(){
    	if (!$scope.signIn.$pristine)
	    	$scope.loading = true;

    	if (!$scope.signIn.$pristine && $scope.signIn.$valid){
			$scope.auth.$resetPassword({
				email: $scope.signIn_input.email
			}).then(function() {
				$scope.loading = false;
				window.resettingPassword = true;
				alert('Awesome!\n\nGo check your email, we just sent you a temporary password. \n\nGo get it there, login with that, and we\'ll change your password when you get back!');
				console.log('Password reset email sent successfully!');
			}).catch(function(error) {
				console.error("Error: ", error);
			});
    	}else{
    		alert('Ah man, I hate it when that happens.\n\nHere, put your email in, and click the \'Forgot your password?\' button again.')
    	}
    }

    $scope.enterWatch = function(event){
    	if (event.keyCode === 13){
    		if ($scope.viewing === 'signUp') $scope.sign_up();
    		else if ($scope.viewing === 'signIn') $scope.sign_in();
    		else if ($scope.viewing === 'pwchange') $scope.newPW();
    	}
    };
}






},{}],6:[function(require,module,exports){
module.exports = function(
	$firebaseArray,
	$rootScope, 
	$scope, 
	Notes,
	SharedNotes,
	newNote,
	killNote,
	Boards,
	newBoard,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location,
	$cookies,
	Logout,
	concentricity
) {
	Notes().$bindTo($scope, 'notes');
	Boards().$bindTo($scope, 'boards');
	SharedNotes().$bindTo($scope, 'sharednotes')
		.then(function() {

			$scope.sharedFilter = function(e){
				var shared = {};
				angular.forEach(e, function(e, k){
					if (typeof(e) === 'object' && !!e){
						angular.forEach(e.participants, function(f, l){
							if (
								(l == window.uid || l == $cookies.email_escaped) 
								&& (!e.participants[$cookies.email_escaped].parent)
							){
								shared[k] = e;
							}
						})
					}
				})

				return shared;
			}

		});

    $scope.pageClass = 'list';

    $scope.concentric = function(){
    	concentricity();
    };

	$scope.lookingAt = window.listLookingAt;

	$scope.$watch('lookingAt', function(){
		window.listLookingAt = $scope.lookingAt;
	})


	$scope.newNote = function(){
		$location.path('/note/' + newNote());
		$scope.closeMenu();
	};

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
		$scope.closeMenu();
	};

	$scope.killNote = function(id){
		killNote(id);
		$scope.closeMenu();
	}

	$scope.logout = function(){
		Logout();
		$scope.closeMenu();
	}

	$scope.openMenu = function(){
		$('#main').toggleClass('mobileMenuOpen');	
	};

	$scope.closeMenu = function(){
		$('#main').removeClass('mobileMenuOpen');	
	};
}
},{}],7:[function(require,module,exports){
module.exports = function(
	$controller,
	$rootScope, 
	$scope, 
	Note,
	sharedNote,
	newNote,
	killNote,
	shareNote,
	newBit,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location,
	$cookies,
	Logout,
	concentricity,
	FileUploader
) {

	var showingCheatsheet = false;
	
	$scope.commandIsPressed = false;
	$scope.altIsPressed = false;
	$scope.selectedBits = false;
	$scope.clipboarded = false;
    $scope.pageClass = 'note';

    $scope.concentric = function(){
    	concentricity();
    };

    if ($location.path().indexOf('shared') > 0){

    	sharedNote($routeParams.id).$bindTo($scope, 'note')
    	.then(function() {
    		$scope.closeBitMenus();
    		$scope.unselector();
    		$scope.note.kill = false;
    	});

    }else{
		Note($routeParams.id).$bindTo($scope, 'note')
		.then(function() {
			if (typeof($scope.note.body) === 'undefined'){
				newNote('', $routeParams.id);
			}
			$scope.closeBitMenus();
			$scope.unselector();
			$scope.note.kill = false;
		});
    }

    $scope.shareActive = function(){
    	if ($location.path().indexOf('shared') > 0)
    		return true
    	else return false;
    }

	$scope.uploader = new FileUploader();

	// console.log($scope.uploader)

	// 	                                                                                         
	// 	88        88   ,ad8888ba, 888888888888 88      a8P  88888888888 8b        d8 ad88888ba   
	// 	88        88  d8"'    `"8b     88      88    ,88'   88           Y8,    ,8P d8"     "8b  
	// 	88        88 d8'        `8b    88      88  ,88"     88            Y8,  ,8P  Y8,          
	// 	88aaaaaaaa88 88          88    88      88,d88'      88aaaaa        "8aa8"   `Y8aaaaa,    
	// 	88""""""""88 88          88    88      8888"88,     88"""""         `88'      `"""""8b,  
	// 	88        88 Y8,        ,8P    88      88P   Y8b    88               88             `8b  
	// 	88        88  Y8a.    .a8P     88      88     "88,  88               88     Y8a     a8P  
	// 	88        88   `"Y8888Y"'      88      88       Y8b 88888888888      88      "Y88888P"   
	// 	                                                                                         
	// 	                                                                                         

	hotkeys.bindTo($scope)
		.add({
			combo: '?',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {}
		})
		.add({
			combo: 'alt',
			description: 'Hold down to edit pasted links',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				console.log('ALT_DOWN')
				$scope.altIsPressed = true;
			}
		})
		.add({
			combo: 'alt',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keyup',
			callback: function(event, hotkey) {
				console.log('ALT_UP')
				$scope.altIsPressed = false;
			}
		})
		.add({
			combo: 'command',
			description: 'Hold down to select bits',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				$scope.commandIsPressed = true;
			}
		})
		.add({
			combo: 'command',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keyup',
			callback: function(event, hotkey) {
				$scope.commandIsPressed = false;
			}
		})
		.add({
			combo: ['enter', 'shift+enter'],
			description: 'add new bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea()){
					if (_isBit()){
						if ($scope.note.body[_bitIndex()].content !== '')
							$scope.addBit( _bitIndex() );
						else if (_bitIndex() !== 0){
							$scope.note.body[_bitIndex()].gap = true;
							$scope.note.body[_bitIndex()].tabCount = 0;
						}
					}
					else
						_focusMe(0);
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['command+enter', 'ctrl+enter'],
			description: 'add a little space above the currently selected bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() && _isBit()){
					$scope.note.body[_bitIndex()].gap = !$scope.note.body[_bitIndex()].gap;
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'backspace',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( 
					_isTextarea() && 
					($scope.note.body[_bitIndex()].content === '')
				){
					if ($scope.note.body[_bitIndex()].tabCount > 0)
						$scope.note.body[_bitIndex()].tabCount--;
					else if ($scope.note.body[_bitIndex()].gap)
						$scope.note.body[_bitIndex()].gap = false;
					else
						$scope.killBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['command+backspace', 'ctrl+backspace'],
			description: '(while focused) Delete this bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() ){
					$scope.killBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['command+shift+backspace', 'ctrl+shift+backspace'],
			description: 'Delete this note',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				$scope.note.kill && $scope.killNote(); 
				$scope.note.kill = !$scope.note.kill;
			}
		})
		.add({
			combo: 'tab',
			description: '(while focused) Indent',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea() && _isBit() ){
					if ($scope.selectedBits){
						angular.forEach($scope.note.body, function(e, k){
							if (e.selected)
								$scope.tabIn(k);
						})
					}else
						$scope.tabIn(_bitIndex());						
					event.preventDefault();
				}else if ( _isTextarea() )
					_focusMe(0);
			}
		})
		.add({
			combo: 'shift+tab',
			description: '(while focused) Outdent',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea() && _isBit() ){
					if ($scope.selectedBits){
						angular.forEach($scope.note.body, function(e, k){
							if (e.selected)
								$scope.tabOut(k);
						})
					}else
						$scope.tabOut(_bitIndex());
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['up', 'down'],
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea()){
					$scope.jumpAround(_bitIndex(), event.keyIdentifier, false);
				}
			}
		})		
		.add({
			combo: 'shift+up',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				$scope.note.body[_bitIndex()].selected = true;
				$scope.note.body[_bitIndex() - 1].selected = true;
				_focusMe(_bitIndex() - 1);
				event.preventDefault();
			}
		})
		.add({
			combo: 'shift+down',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				$scope.note.body[_bitIndex()].selected = true;
				$scope.note.body[_bitIndex() + 1].selected = true;
				_focusMe(_bitIndex() + 1);
				event.preventDefault();
			}
		})
		.add({
			combo: ['ctrl+up', 'ctrl+down'],
			description: 'Quickly jump between bits',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea()){
					$scope.jumpAround(_bitIndex(), event.keyIdentifier, true);
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'ctrl+command+up',
			description: '(while focused) Swap bit up',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				$scope.moveUp(_bitIndex());
				event.preventDefault();
			}
		})
		.add({
			combo: 'ctrl+command+down',
			description: '(while focused) Swap bit down',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				$scope.moveDown(_bitIndex());
				event.preventDefault();
			}
		})
		.add({
			combo: ['command+x', 'ctrl+x'],
			description: 'Cut selected bits',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				$scope.cut();
			}
		})
		.add({
			combo: ['command+v', 'ctrl+v'],
			description: 'Paste cut bits (or just paste the contents of your clipboard)',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ($scope.clipboarded){
					$scope.paste();
					event.preventDefault();
				}
				else
					$scope.parsePasted(_bitIndex());
			}
		})
		.add({
			combo: 'shift shift',
			description: '(while focused) Toggle this bit as marked',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				if ( _isTextarea()){
					$scope.note.body[_bitIndex()].mark = !$scope.note.body[_bitIndex()].mark;
				}
			}
		})
		.add({
			combo: ['ctrl+shift ctrl+shift', 'command+shift command+shift'],
			description: 'Toggle this note as marked',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				$scope.note.mark = !$scope.note.mark;
			}
		})
		.add({
			combo: 'esc',
			description: 'Close note',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				if (showingCheatsheet){
					showingCheatsheet = false;
					hotkeys.toggleCheatSheet();
				}else if ($scope.sharePrompt){
					$scope.sharePrompt = false;					
				}else{
					if ($scope.note.parent)
						$location.path('/board/' + $scope.note.parent)
					else if ($scope.note.participants){
						if ($scope.note.participants[$cookies.email_escaped].parent)
							$location.path('/board/' + $scope.note.participants[$cookies.email_escaped].parent)
						else
							$location.path('/list');
					}
					else
						$location.path('/list');
				}
			}
		})
		.add({
			combo: 'alt+shift+/',
			description: 'Show this handy guide :)',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				event.preventDefault();
				showingCheatsheet = !showingCheatsheet;
				hotkeys.toggleCheatSheet();
			}
		});

	// 	                                                                                                
	// 	88888888888 88        88 888b      88   ,ad8888ba, 888888888888 88   ,ad8888ba,   888b      88  
	// 	88          88        88 8888b     88  d8"'    `"8b     88      88  d8"'    `"8b  8888b     88  
	// 	88          88        88 88 `8b    88 d8'               88      88 d8'        `8b 88 `8b    88  
	// 	88aaaaa     88        88 88  `8b   88 88                88      88 88          88 88  `8b   88  
	// 	88"""""     88        88 88   `8b  88 88                88      88 88          88 88   `8b  88  
	// 	88          88        88 88    `8b 88 Y8,               88      88 Y8,        ,8P 88    `8b 88  
	// 	88          Y8a.    .a8P 88     `8888  Y8a.    .a8P     88      88  Y8a.    .a8P  88     `8888  
	// 	88           `"Y8888Y"'  88      `888   `"Y8888Y"'      88      88   `"Y8888Y"'   88      `888  
	// 	                                                                                                
	// 	                                                                                                

	$scope.addBit = function(index, content){
		var incomingContent;

		if (typeof(content) === 'undefined')
			incomingContent = '';
		else
			incomingContent = content;

		$timeout(function(){
			$scope.note.body.splice(index + 1, 0, newBit(
				$scope.note.body[index].tabCount,
				incomingContent
			));

			$scope.parseLink(index);

			_focusMe(index + 1);
		}, 50);
	};

	$scope.parsePasted = function(index){
		$timeout(function(){
			// split at line breaks
			// console.log($scope.note.body[index].content)
			var theContent = $scope.note.body[index].content.split('\n'),
				toRemove = [];

			// remove empty lines
			for (var l = 0; l < theContent.length; l++){
				if (!theContent[l])
					toRemove.push(l)
			}

			for (var r = toRemove.length - 1; r >= 0 ; r--){
				theContent.splice(toRemove[r], 1)
			}

			// set block to empty before replacing w/ 1st line
			$scope.note.body[index].content = '';
			$scope.note.body[index].content = theContent[0];

			$scope.note.body[index].contentCaret = '';
			$scope.note.body[index].contentCaret = theContent[0];

			$scope.parseLink(index);

			for (var l = 1; l < theContent.length; l++){
				$scope.addBit(index + (l - 1), theContent[l]);
			}
		}, 50); 
	}

	$scope.parseLink = function(index){
		var content = $scope.note.body[index].content;

		if (
			content.indexOf("http://") === 0 ||
			content.indexOf("https://") === 0 
		){			
			console.log('OH NOES A LINK')

			$.ajax({
				type: "GET",
				dataType:'JSONP',
				data:{
					URL: content
				},
				url: "http://re.ject.ch/tra/php/title.php"
			}).done( function(theTitle){
				var escapedTitle = _.unescape(theTitle.title);
				console.log(escapedTitle)

				$scope.note.body[index].content = escapedTitle;
				$scope.note.body[index].contentCaret = escapedTitle;
				$scope.note.body[index].address = content;
				$scope.note.body[index].isLink = true;

				$scope.$apply();
			})
		}
	}

	$scope.openLink = function(bit){
		if (bit.isLink && !$scope.altIsPressed){
			document.activeElement.blur();
			var win = window.open(bit.address, '_blank');
			win.focus();
		}
	}

	$scope.killBit = function(index){
		$scope.note.body.splice(index, 1);

		if ($scope.note.body.length > 0){
			_focusMe(index - 1)
		}else{
			addBit(0);
		}
	};

	$scope.moveUp = function(index){
		if ($scope.selectedBits){

			angular.forEach($scope.note.body, function(e, k){
				if (e.selected){
					$timeout(function(){
						var thisBit = $scope.note.body.splice(k, 1)[0];
						$scope.note.body.splice(k - 1, 0, thisBit);
					})
				}
			});
		}else{
			var thisBit = $scope.note.body.splice(_bitIndex(), 1)[0];
			$scope.note.body.splice(index - 1, 0, thisBit);
			_focusMe(index - 1);
		}
	};

	$scope.moveDown = function(index){
		if ($scope.selectedBits){
			var bodyCopy = angular.copy($scope.note.body);

			angular.forEach(bodyCopy.reverse(), function(e, k){
				if (e.selected){

					$timeout(function(){
						var reverseTarget = Math.abs(bodyCopy.length - k) - 1;
						var thisBit = $scope.note.body.splice(reverseTarget, 1)[0];
						$scope.note.body.splice(reverseTarget + 1, 0, thisBit);
					})
				}
			});
		}else{
			var thisBit = $scope.note.body.splice(_bitIndex(), 1)[0];
			$scope.note.body.splice(index + 1, 0, thisBit);
			_focusMe(index + 1);
		}
	};

	$scope.tabOut = function(index){
		if ($scope.note.body[index].tabCount > 0){
			$scope.note.body[index].tabCount--;
		}else{
			_focusMe(_bitIndex() - 1);
		}
	}

	$scope.tabIn = function(index){
		if ($scope.note.body[index].tabCount < 3){
			$scope.note.body[index].tabCount++;
		}else{
			_focusMe(_bitIndex() + 1);
		}
	}

	$scope.caretTracker = function(index, key){
		setTimeout(function(){
			var theBit = document.activeElement,
				currentCaret = theBit.selectionStart,
				theValue = theBit.value;

			$scope.note.body[index].contentCaret = 
				theValue.substring(0, currentCaret) + 
				'<span class="hiddenCaret"></span>' + 
				theValue.substring(currentCaret, theValue.length)

			$scope.$apply();
		}, 10)
	}


	$scope.jumpAround = function(index, key, justgo){
		// console.log(index, key, justgo)
		var $theBit = $(document.activeElement),
			$theCaret = $theBit.siblings('.textarea-autosize').find('.hiddenCaret'),
			theCaretPos = $theCaret.position().top,
			theCaretHeight = 18;

		if ( 
			(
				(key === 'Up') && 
				(theCaretPos < theCaretHeight - 1) 
			)||(
				(key === 'Up') && 
				justgo
			)
		){
			$theBit.parents('.note_bit')
				.prev('.note_bit').find('textarea')
				.focus()
		}

		if (
			(
				(key === 'Down') && 
				(theCaretPos > ($theCaret.parent().height() - (theCaretHeight))) 
			)||(
				(key === 'Down') && 
				justgo
			)
		){
			$theBit.parents('.note_bit')
				.next('.note_bit').find('textarea')
				.focus()
		}
	};

	$scope.mark = function(index, optional){
		// console.log(index, $scope.note.body[index].mark, $scope.note.body[index].menu_open, optional)

		if ((optional && window.innerWidth < 768) || !optional){
			$timeout(function(){
				$scope.note.body[index].mark = !$scope.note.body[index].mark;
				$scope.note.body[index].menu_open = false;
				$scope.$apply();
				console.log(index, $scope.note.body[index].mark, $scope.note.body[index].menu_open)
			})
		}
	};

	$scope.search = function(content){
		var win = window.open('https://www.google.com/search?q=' + content, '_blank');
	    win.focus(); 
	};

	$scope.closeBitMenus = function(except){
		angular.forEach($scope.note.body, function(e, k){
			if (typeof(e.menu_open) !== 'undefined' && e.bitID !== except)
				e.menu_open = false;
		});
	};


	$scope.toggleBitMenu = function(index, event){
		if (!$scope.commandIsPressed){
			event.stopPropagation();
		}else{
			return true;
		}

		$scope.closeBitMenus($scope.note.body[index].bitID);

		$scope.note.body[index].menu_open = !$scope.note.body[index].menu_open;

		if ($scope.note.body[index].menu_open){
			$scope.menuing = true;
		}else{
			$timeout(function(){
				$scope.menuing = false;			
			}, 300)
		}
	}


	var insertIndex;

	$scope.selector = function(index, event){
		event.stopPropagation();
		if ($scope.commandIsPressed){
			$scope.note.body[index].selected = !$scope.note.body[index].selected;
			$scope.selectedBits = true;
		}
		else
			insertIndex = _bitIndex();
	}

	$scope.unselector = function(except){
		angular.forEach($scope.note.body, function(e, k){
			e.selected = false;
		});
		$scope.selectedBits = false;
	};


	$scope.cut = function(){
		window.clipboard = [];

		angular.forEach($scope.note.body, function(e, k){
			if (e.selected){
				window.clipboard.push(e);
			}
		});

		var tempBody = [];
		angular.copy($scope.note.body, tempBody);

		angular.forEach(tempBody.reverse(), function(e, k){
			if (e.selected){
				var reverseTarget = Math.abs(tempBody.length - k) - 1;

				$timeout(function(){
					$scope.killBit(reverseTarget);
					$scope.$apply();
				});
			}
		});

		$scope.clipboarded = true;
	};

	$scope.paste = function(){
		angular.forEach(window.clipboard, function(e, k){
			$scope.note.body.splice((insertIndex + k) + 1, 0, e)
		});

		$scope.unselector();
		window.clipboard = [];
		$scope.clipboarded = false;
	};



	$scope.shareConfirm = function($event){
		console.log($scope.shareTarget);
		shareNote($scope.note.id, $scope.shareTarget);
	};

	$scope.enterWatch = function(event){
		if (event.keyCode === 13){
			$scope.shareConfirm();
		}
	};


	// 	                                                         
	// 	88b           d88 88888888888 888b      88 88        88  
	// 	888b         d888 88          8888b     88 88        88  
	// 	88`8b       d8'88 88          88 `8b    88 88        88  
	// 	88 `8b     d8' 88 88aaaaa     88  `8b   88 88        88  
	// 	88  `8b   d8'  88 88"""""     88   `8b  88 88        88  
	// 	88   `8b d8'   88 88          88    `8b 88 88        88  
	// 	88    `888'    88 88          88     `8888 Y8a.    .a8P  
	// 	88     `8'     88 88888888888 88      `888  `"Y8888Y"'   
	// 	                                                         
	// 	   

	$scope.newNote = function(){
		var newID = newNote($scope.note.parent);
		$location.path('/note/' + newID);
		$scope.closeMenu();
	};

	$scope.killNote = function(){
		killNote($scope.note.id, $scope.note.parent);
		$scope.closeMenu();
	};

	$scope.showCheatSheet = function(){
		hotkeys.toggleCheatSheet()
	};

	$scope.openMenu = function(){
		$('#main').toggleClass('mobileMenuOpen');	
	};

	$scope.closeMenu = function(){
		$('#main').removeClass('mobileMenuOpen');	
	};

	// 	                                                                                      
	// 	88        88 88888888888 88          88888888ba  88888888888 88888888ba   ad88888ba   
	// 	88        88 88          88          88      "8b 88          88      "8b d8"     "8b  
	// 	88        88 88          88          88      ,8P 88          88      ,8P Y8,          
	// 	88aaaaaaaa88 88aaaaa     88          88aaaaaa8P' 88aaaaa     88aaaaaa8P' `Y8aaaaa,    
	// 	88""""""""88 88"""""     88          88""""""'   88"""""     88""""88'     `"""""8b,  
	// 	88        88 88          88          88          88          88    `8b           `8b  
	// 	88        88 88          88          88          88          88     `8b  Y8a     a8P  
	// 	88        88 88888888888 88888888888 88          88888888888 88      `8b  "Y88888P"   
	// 	                                                                                      
	// 	                                                                                      

	var _isTextarea = function(){
		return document.activeElement.type === 'textarea';
	},                                                                                    

	_isBit = function(){
		return document.activeElement.className.indexOf('mousetrap') > -1;
	},

	_bitIndex = function(){
		return $(document.activeElement).parents('.note_bit').index();
	},

	_focusMe = function(index){
		setTimeout(function(){
			$('.note_body')
				.find('.note_bit:eq(' + (index) + ') textarea')
				.focus();
		});
	};

	$scope.sortableOptions_note = {
		handle: '> .bit_anchor',
		axis: 'y',
		scroll: true,
		helper: 'clone',
		// start: function (event, ui) {
		//    $(this).attr('startingScrollTop', window.pageYOffset);
		// },
		// drag: function(event,ui){
		//    var st = parseInt($(this).attr('startingScrollTop'));
		//    ui.position.top -= st;
		// },
		'ui-floating': true
	};

	$scope.logout = function(){
		Logout();
	}
}
},{}],8:[function(require,module,exports){
$(function() {

	// FEATURE TESTS

	var _propertyCache = {};	

	exports.supportsSvg = function() {
		if (!_propertyCache.supportsSvg){
			var result = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
			_propertyCache.supportsSvg = result;
			return result
		}
		else return _propertyCache.supportsSvg;
	}; 

	exports.mediaQueriesSupported = function(){
		if (!_propertyCache.mediaQueriesSupported){

			var getTester = document.getElementById("mediatest"),
				bool;

			if (!getTester){
				var d = document.createElement('div');
				d.id = "mediatest";
				document.body.appendChild(d);
				bool = false;
			}
			else var d = getTester;

			if ( window.getComputedStyle && window.getComputedStyle(d).position == "absolute" )
				bool = true;

			_propertyCache.mediaQueriesSupported = bool;

			return bool;
		}
		else return _propertyCache.mediaQueriesSupported;
	}; 

	exports.coverBackgroundSupported = function(){
		if (!_propertyCache.coverBackgroundSupported){
			var result = ('backgroundSize' in document.documentElement.style);
			_propertyCache.coverBackgroundSupported = result;
			return result;
		}
		else return _propertyCache.coverBackgroundSupported;
	};
	

	// UTILITIES

	exports.map_range = function(value, low1, high1, low2, high2) {
	    return (low2 + (high2 - low2) * (value - low1) / (high1 - low1)).toFixed(2);
	}

	exports.randomInt = function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1) + min);
	}

	exports.scrollToHere = function(where, extra){
		if (!extra) extra = 0;
		
		var target = $(where).offset().top;

		// define how large your sticky header is here!
		if (window.mediaQuery.getQuery() === 'mobile') target -= 55;

		$('html,body').animate({
			scrollTop: target + extra
		}, 500);
	}; 

	exports.pageSetup = (function() {
		var subscribers = [],
			isSetUp = false;

		function okaygo(){
			for (var method in subscribers) {
				subscribers[method]();
			}
			isSetUp = true;
		}

		function subscribe(method) {
			subscribers.push(method);

			isSetUp && okaygo();
		}

		// Returnal  
		//////////////////////////////////////////////////

		return {
			okaygo: okaygo,
			subscribe: subscribe
		};
	})(); 

	exports.debounce = function(func, wait, immediate) {
		var timeout, args, context, timestamp, result;

		var later = function() {
			var last = new Date().getTime() - timestamp;

			if (last < wait && last > 0) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) {
					result = func.apply(context, args);
					if (!timeout) context = args = null;
				}
			}
		};

		return function() {
			context = this;
			args = arguments;
			timestamp = new Date().getTime();
			var callNow = immediate && !timeout;
			if (!timeout) timeout = setTimeout(later, wait);
			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};
	}; 

	exports.mediaQuery = (function() {
		var subscribers = [],
			mediaCurrent,
			mediaPrev,
			$window = $(window),
			$html = $('html');

		function calculate(){
			var innerWidth = $window.innerWidth(),
				innerHeight = $window.innerHeight();

			if ( innerWidth < 768 ) 
				mediaCurrent = 'mobile'
			else if ( ( innerWidth >= 768) && ( innerWidth < 992 ) ) 
				mediaCurrent = 'tablet'
			else if ( ( innerWidth >= 992 ) && ( innerWidth < 1200 ) ) 
				mediaCurrent = 'desktop'
			else if ( innerWidth >= 1200 ) 
				mediaCurrent = 'large_desktop'

			if ( innerHeight < 740 )
				mediaCurrent += ' short'

			if ( mediaCurrent !== mediaPrev ){
				for (var method in subscribers) {
					subscribers[method](mediaCurrent);
				}

				if (!exports.mediaQueriesSupported())
					$html.removeClass(mediaPrev).addClass(mediaCurrent);
			}

			mediaPrev = mediaCurrent; 
		}

		function subscribe(method) {
			subscribers.push(method);
		};

		function getQuery(){
			return mediaCurrent;
		};

		function is(query){
			return mediaCurrent.indexOf(query) >= 0;
		};

		var calculateDebounce = exports.debounce(calculate, 200); 

		$window.resize(calculateDebounce);

		// calculate();
		
		// $window.load(calculate);

		// exports.pageSetup.subscribe(calculate);

		// Returnal
		//////////////////////////////////////////////////

		return {
			subscribe: subscribe,
			getQuery: getQuery,
			is: is
		};
	})(); 

	exports.gMapLoader = (function() {

		// Variables
		//////////////////////////////////////////////////
		var subscribers = [];

		// Load Google Maps
		//////////////////////////////////////////////////
		gMapSetup = function() {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=$$_.gMapLoader.ready';
			document.body.appendChild(script)
		};

		function ready() {
			for (var method in subscribers) {
				subscribers[method]();
			}
		};

		function subscribe(method) {
			subscribers.push(method);
		};

		// $(window).load(gMapSetup)

		// Returnal
		//////////////////////////////////////////////////

		return {
			ready: ready,
			subscribe: subscribe
		};
	})();

	exports.randomize = function(){
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = ( d + Math.random() * 16 ) % 16 | 0;
			d = Math.floor( d / 16 );
			return (c == 'x' ? r : ( r & 0x7 | 0x8 ) ).toString(16);
		});
		return uuid;
	};


});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9tYWluLmpzIiwiLi4vanMvbW9kdWxlcy9ib2FyZEN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NoYW5nZUN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NvbG9waG9uQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaG9tZUN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2xpc3RDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9ub3RlQ3RybC5qcyIsIi4uL2pzL3NoYXJlZC9jb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2d0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gVmVuZG9yIGZpbGVzXG4vLyB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9IHJlcXVpcmUoJy4vdmVuZG9yL2pxdWVyeS0xLjExLjEubWluJyk7XG5cbnZhciAkJF8gPSB3aW5kb3cuJCRfID0gcmVxdWlyZSgnLi9zaGFyZWQvY29yZScpOyBcblxudmFyIGhvbWVDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2hvbWVDdHJsJyksXG5cdG5vdGVDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL25vdGVDdHJsJyksXG5cdGNoYW5nZUN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvY2hhbmdlQ3RybCcpLFxuXHRib2FyZEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvYm9hcmRDdHJsJyksXG5cdGxpc3RDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2xpc3RDdHJsJyk7XG5cdGNvbG9waG9uQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9jb2xvcGhvbkN0cmwnKTtcblxuLy8gZXhwb3NlIHlvdXIgZnVuY3Rpb25zIHRvIHRoZSBnbG9iYWwgc2NvcGUgZm9yIHRlc3RpbmdcbnZhciAkYm9keSA9ICQoJyNuZy1hcHAnKVxuXG53aW5kb3cuX0ZpcmViYXNlID0gbmV3IEZpcmViYXNlKCAnaHR0cHM6Ly9saWNrLmZpcmViYXNlaW8uY29tJyApO1xud2luZG93Lmxpc3RMb29raW5nQXQgPSAnbm90ZXMnO1xud2luZG93LmRpcmVjdGlvbnMgPSBbJ25vcnRoJywgJ2Vhc3QnLCAnc291dGgnLCAnd2VzdCddO1xud2luZG93LmxvZ2dlZEluID0gZmFsc2U7XG53aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG53aW5kb3cuZW1haWxFc2NhcGVyID0gZnVuY3Rpb24oZW1haWwpe1xuXHRyZXR1cm4gZW1haWwucmVwbGFjZSgvWyAuXS9nLCBcIl9cIik7XG59XG53aW5kb3cuaGlzdG9yaWNhbCA9IFtdO1xuXG5pZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdpUGFkJykgPiAtMSl7XG5cdCQoJ2h0bWwnKS5hZGRDbGFzcygnaVBhZCcpXG59XG5cbi8vIGRlZmluZSBvdXIgYXBwIGFuZCBkZXBlbmRlbmNpZXMgKHJlbWVtYmVyIHRvIGluY2x1ZGUgZmlyZWJhc2UhKVxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKFxuXHQnbGljaycsIFxuXHRbXG5cdFx0J2ZpcmViYXNlJywgXG5cdFx0J25nUm91dGUnLFxuXHRcdCd1aS5zb3J0YWJsZScsXG5cdFx0J2NmcC5ob3RrZXlzJyxcblx0XHQnbmdTYW5pdGl6ZScsXG5cdFx0J25nQ29va2llcycsXG5cdFx0J2dyaWRzdGVyJyxcblx0XHQnbmdBbmltYXRlJyxcblx0XHQnbmdUb3VjaCcsXG5cdFx0J2FuZ3VsYXJGaWxlVXBsb2FkJ1xuXHRdXG4pO1xuXG5hcHAucnVuKFtcIiRyb290U2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uKSB7XG5cdCRyb290U2NvcGUuJG9uKFwiJHJvdXRlQ2hhbmdlRXJyb3JcIiwgZnVuY3Rpb24oZXZlbnQsIG5leHQsIHByZXZpb3VzLCBlcnJvcikge1xuXHRcdGlmIChlcnJvciA9PT0gXCJBVVRIX1JFUVVJUkVEXCIpIHtcblx0XHRcdCRsb2NhdGlvbi5wYXRoKFwiL2hvbWVcIik7XG5cdFx0fVxuXHR9KTtcbn1dKTtcblxuYXBwLmNvbmZpZyggZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuXG4gICAgICAgIC8vIHJvdXRlIGZvciB0aGUgaG9tZSBwYWdlXG4gICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnaG9tZUN0cmwnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBub3Rlc1xuICAgICAgICAud2hlbignL25vdGUvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ub3RlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnbm90ZUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHNoYXJlZG5vdGVzXG4gICAgICAgIC53aGVuKCcvc2hhcmVkbm90ZS86aWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL25vdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdub3RlQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgY2hhbmdpbmcgYm9hcmRzXG4gICAgICAgIC53aGVuKCcvY2hhbmdlLzppZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvY2hhbmdlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnY2hhbmdlQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgYm9hcmRzXG4gICAgICAgIC53aGVuKCcvYm9hcmQvOmlkJywgeyBcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdib2FyZEN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGxpc3RcbiAgICAgICAgLndoZW4oJy9saXN0JywgeyBcblx0XHRcdHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvbGlzdC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgIDogJ2xpc3RDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBsaXN0XG4gICAgICAgIC53aGVuKCcvY29sb3Bob24nLCB7IFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9jb2xvcGhvbi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgIDogJ2NvbG9waG9uQ3RybCdcbiAgICAgICAgfSk7XG59KVxuLnJ1biggZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkY29va2llcywgTG9naW4sICRyb3V0ZSwgJHRpbWVvdXQsICRhbmltYXRlKSB7XG5cdCRyb290U2NvcGUuJG9uKCAnJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgbmV4dCwgY3VycmVudCkge1xuXG5cdFx0d2luZG93Lmhpc3RvcmljYWwucHVzaCgkbG9jYXRpb24ucGF0aCgpKVxuXG5cdFx0aWYgKCh0eXBlb2YoY3VycmVudCkgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mKGN1cnJlbnQudGVtcGxhdGVVcmwpICE9PSAndW5kZWZpbmVkJykpXG5cdFx0XHQkYm9keS5hdHRyKCAnZGF0YS1sZWF2aW5nJywgY3VycmVudC50ZW1wbGF0ZVVybC5zcGxpdCgnLycpWzJdLnNwbGl0KCcuJylbMF0gKTtcblx0XHRpZiAoKHR5cGVvZihuZXh0KSAhPT0gJ3VuZGVmaW5lZCcpICYmICh0eXBlb2YobmV4dC50ZW1wbGF0ZVVybCkgIT09ICd1bmRlZmluZWQnKSlcblx0XHRcdCRib2R5LmF0dHIoICdkYXRhLWVudGVyaW5nJywgbmV4dC50ZW1wbGF0ZVVybC5zcGxpdCgnLycpWzJdLnNwbGl0KCcuJylbMF0gKTtcblx0XHRlbHNle1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICh3aW5kb3cubG9nZ2VkSW4pe1xuXHRcdFx0Y29uc29sZS5sb2coJ2FscmVhZHkgbG9nZ2VkIGluIScpXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdGlmICggKCEkY29va2llcy5lbWFpbCAmJiAhJGNvb2tpZXMucGFzcykgJiYgbmV4dC50ZW1wbGF0ZVVybCAhPT0gJ2Fzc2V0cy9pbmMvY29sb3Bob24uaHRtbCcpe1x0XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdubyBzdG9yZWQgbG9naW4sIGdvdG8gc3RhcnQnKVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnLycpXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggKCRjb29raWVzLmVtYWlsICYmICRjb29raWVzLnBhc3MpICl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdzdG9yZWQgbG9naW4gZm91bmQsIGxvZ2dpbmcgaW4nKVxuXHRcdFx0XHRMb2dpbigkY29va2llcy5lbWFpbCwgJGNvb2tpZXMucGFzcywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZiAobmV4dC50ZW1wbGF0ZVVybCA9PT0gJ2Fzc2V0cy9pbmMvaG9tZS5odG1sJyl7XG5cdFx0XHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKVxuXHRcdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0JGFuaW1hdGUuZW5hYmxlZChmYWxzZSk7XG5cdFx0XHRcdFx0XHQkcm91dGUucmVsb2FkKCk7XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdCRhbmltYXRlLmVuYWJsZWQodHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdCRib2R5LmFkZENsYXNzKCdyZWFkeScpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zb2xlLmxvZygnT0tBWScpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0JGJvZHkuYXR0cignZGF0YS1kaXJlY3Rpb24nLCBmdW5jdGlvbigpe1xuXHRcdGlmICgkY29va2llcy5kaXJlY3Rpb24pe1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5kaXJlY3Rpb25zWyRjb29raWVzLmRpcmVjdGlvbiAlIDRdO1xuXHRcdH1cblx0XHRlbHNle1xuXHRcdFx0JGNvb2tpZXMuZGlyZWN0aW9uID0gMDtcblx0XHRcdHJldHVybiB3aW5kb3cuZGlyZWN0aW9uc1skY29va2llcy5kaXJlY3Rpb25dO1xuXHRcdH1cblx0fSlcbn0pO1xuXG5cbmFwcC5mYWN0b3J5KFwiTG9naW5cIiwgWyckcm9vdFNjb3BlJywgXCIkZmlyZWJhc2VBdXRoXCIsIFwiJGNvb2tpZXNcIiwgJyR0aW1lb3V0JywgJ0F1dGgnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oJHJvb3RTY29wZSwgJGZpcmViYXNlQXV0aCwgJGNvb2tpZXMsICR0aW1lb3V0LCBBdXRoLCAkbG9jYXRpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24odGhlRW1haWwsIHRoZVBhc3MsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKXtcblxuXHRcdFx0Y29uc29sZS5sb2cod2luZG93LmxvZ2dpbmdJbiwgdGhlRW1haWwsIHRoZVBhc3MvKiwgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2sqLylcblxuXHRcdFx0aWYgKCF3aW5kb3cubG9nZ2luZ0luKXtcblx0XHRcdFx0d2luZG93LmxvZ2dpbmdJbiA9IHRydWU7XG5cblx0XHRcdFx0QXV0aC4kYXV0aFdpdGhQYXNzd29yZCh7XG5cdFx0XHRcdFx0ZW1haWw6IHRoZUVtYWlsLFxuXHRcdFx0XHRcdHBhc3N3b3JkOiB0aGVQYXNzXG5cdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24oYXV0aERhdGEpIHtcblxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdsb2dnZWQgaW4gd2l0aCAnICsgdGhlRW1haWwgKyAnLCAnICsgYXV0aERhdGEudWlkKVxuXHRcdFx0XHRcdHdpbmRvdy5sb2dnaW5nSW4gPSBmYWxzZTtcblx0XHRcdFx0XHQkY29va2llcy5lbWFpbCA9IHRoZUVtYWlsO1xuXHRcdFx0XHRcdCRjb29raWVzLmVtYWlsX2VzY2FwZWQgPSB3aW5kb3cuZW1haWxFc2NhcGVyKHRoZUVtYWlsKTtcblx0XHRcdFx0XHQkY29va2llcy5wYXNzID0gdGhlUGFzcztcblx0XHRcdFx0XHR3aW5kb3cudWlkID0gYXV0aERhdGEudWlkO1xuXHRcdFx0XHRcdHdpbmRvdy5sb2dnZWRJbiA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mKGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGVycm9yQ2FsbGJhY2spID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy8nKTtcblx0XHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKTtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFwiQXV0aGVudGljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XG5cdFx0XHRcdFx0JGNvb2tpZXMuZW1haWwgPSAnJztcblx0XHRcdFx0XHQkY29va2llcy5wYXNzID0gJyc7XG5cdFx0XHRcdFx0YWxlcnQoJ09oIG5vISBZb3VyIGxvZ2luIGRpZG5cXCd0IHdvcmsuIFRyeSBhZ2Fpbj8gOiknKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5dKTtcblxuXG5hcHAuZmFjdG9yeShcIkxvZ291dFwiLCBbXCIkZmlyZWJhc2VBdXRoXCIsIFwiJGNvb2tpZXNcIiwgJ0F1dGgnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlQXV0aCwgJGNvb2tpZXMsIEF1dGgsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbigpe1xuXG5cdFx0XHRBdXRoLiR1bmF1dGgoKTtcblx0XHRcdCRjb29raWVzLmVtYWlsID0gJyc7XG5cdFx0XHQkY29va2llcy5wYXNzID0gJyc7XG5cdFx0XHR3aW5kb3cudWlkID0gJyc7XG5cdFx0XHR3aW5kb3cubG9nZ2VkSW4gPSBmYWxzZTtcblxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy8nKTtcblx0XHR9XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnQXV0aCcsIFtcIiRmaXJlYmFzZUF1dGhcIixcblx0ZnVuY3Rpb24oJGZpcmViYXNlQXV0aCkge1xuXHRcdHJldHVybiAkZmlyZWJhc2VBdXRoKHdpbmRvdy5fRmlyZWJhc2UpO1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ05vdGVzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdTaGFyZWROb3RlcycsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnX3NoYXJlZCcpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnQm9hcmRzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcycpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ub3Rlcy8nICsgaWQpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnc2hhcmVkTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnX3NoYXJlZC8nICsgaWQpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnQm9hcmQnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvYm9hcmRzLycgKyBpZCk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCduZXdCaXQnLCBcblx0ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHRhYiwgY29udGVudCwgbGluaykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0dHlwZTpcInBsYWluVGV4dFwiLFxuXHRcdFx0XHR0YWJDb3VudDogdGFiLFxuXHRcdFx0XHRjb250ZW50OiB0eXBlb2YoY29udGVudCkgIT09ICd1bmRlZmluZWQnID8gY29udGVudCA6ICcnLFxuXHRcdFx0XHRjb250ZW50Q2FyZXQ6IHR5cGVvZihjb250ZW50KSAhPT0gJ3VuZGVmaW5lZCcgPyBjb250ZW50IDogJzxzcGFuIGNsYXNzPVwiaGlkZGVuQ2FyZXRcIj48L3NwYW4+Jyxcblx0XHRcdFx0Yml0SUQ6ICQkXy5yYW5kb21pemUoKSxcblx0XHRcdFx0bWFyazogZmFsc2UsXG5cdFx0XHRcdHNlbGVjdGVkOiBmYWxzZSxcblx0XHRcdFx0Y3JlYXRlZDogbmV3IERhdGUoKSxcblx0XHRcdFx0ZGVzdHJveWVkOiBcIlwiLFxuXHRcdFx0XHRtYXJrZWQ6IFwiXCIsXG5cdFx0XHRcdG1lbnVfb3BlbjogZmFsc2UsXG5cdFx0XHRcdGlzTGluazogdHlwZW9mKGxpbmspICE9PSAndW5kZWZpbmVkJyA/IHRydWUgOiBmYWxzZSxcblx0XHRcdFx0YWRkcmVzczogdHlwZW9mKGxpbmspICE9PSAndW5kZWZpbmVkJyA/IGxpbmsgOiAnJ1xuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG4pO1xuXG5hcHAuZmFjdG9yeSgnZmlyc3ROb3RlJywgWyduZXdCaXQnLFxuXHRmdW5jdGlvbihuZXdCaXQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24ocGFyZW50LCBpZCkge1xuXHRcdFx0dmFyIG5vdGVJRDtcblxuXHRcdFx0aWYgKGlkKXtcblx0XHRcdFx0bm90ZUlEID0gaWQ7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bm90ZUlEID0gJCRfLnJhbmRvbWl6ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbm90ZVJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbm90ZXMvJyArIG5vdGVJRCApO1xuXHRcdFx0bm90ZVJlZi5zZXQoe1xuXHRcdFx0XHR0aXRsZTogJ1dlbGNvbWUgdG8gTGljayEgOikgQ2xpY2sgaGVyZSB0byBnZXQgc3RhcnRlZCEnLFxuXHRcdFx0XHRwYXJlbnQ6IHR5cGVvZihwYXJlbnQpID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBwYXJlbnQsXG5cdFx0XHRcdGlkOiBub3RlSUQsXG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0hpIHRoZXJlISBXZWxjb21lIHRvIExpY2ssIHRoZSBzbWFydGVzdCB3YXkgZm9yIHlvdXIgdG9uZ3VlIHRvIHRha2Ugbm90ZXMuIFlvdXIgaGFuZHMgY2FuIGhlbHAgdG9vLCBpZiB0aGV5XFwnZCBsaWtlLiA6KScpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnTGljayBoYXJuZXNzZXMgdGhlIHBvd2VyIG9mIHlvdXIgZmF2b3JpdGUgdGV4dCBlZGl0b3IgdG8gaGVscCB5b3Ugb3JnYW5pemUgeW91ciBsaWZlLicpLFxuXHRcdFx0XHRcdG5ld0JpdCgxLCAnSWYgeW91IGRvblxcJ3Qga25vdyB3aGF0IG9uZSBvZiB0aG9zZSBpcywgdGhhdFxcJ3Mgb2theSDigJMgTGljayBpcyBzdGlsbCBqdXN0IHlvdXIgc3BlZWQhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdOb3RlcyBjYW4gZWl0aGVyIGJlIHN0YW5kLWFsb25lLCBvciBjYW4gYmUgb3JnYW5pemVkIGludG8gYm9hcmRzLiBHbyBhaGVhZCBhbmQgY2xvc2UgdGhpcyBhbmQgbWFrZSBhIG5ldyBib2FyZCwgdGhleVxcJ3JlIHByZXR0eSBoYW5keSEnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0xpY2sgc2VlbXMgcHJldHR5IHNpbXBsZSwgYnV0IGl0XFwncyBnb3QgYSBsb3Qgb2YgY29vbCB0aGluZ3MgYnVpbHQgcmlnaHQgaW4uIEl0IG1pZ2h0IHN1cnByaXNlIHlvdSEnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0EgbGlzdCBvZiBMaWNrXFwncyBrZXlib2FyZCBzaG9ydGN1dHMgaXMgbmV2ZXIgZmFyIGZyb20gcmVhY2g6IHByZXNzIGNvbW1hbmQgKyA/IHRvIHNlZSBpdCEnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ09uIGEgbW9iaWxlIGRldmljZT8gVGhlcmUgYXJlIGxvdHMgb2Ygc3dpcGFibGUgdGhpbmdzIOKAkyBnaXZlIGl0IGEgc2hvdCEnKSwgXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdMaWNrIGlzIGEgd29yayBpbiBwcm9ncmVzcywgYW5kIGlmIHNvbWV0aGluZyBnb2VzIHdyb25nLCBsZXQgbWUga25vdyBhdCBlQGplY3QuY2guJywgJ21haWx0bzplQGplY3QuY2gnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0hhcHB5IExpY2tpbmchIDopJylcblx0XHRcdFx0XSxcblx0XHRcdFx0Y2F0ZWdvcnk6IDAsXG5cdFx0XHRcdGRpc3BsYXk6IHRydWUsXG5cdFx0XHRcdGxpc3Q6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbm90ZUlEO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnbmV3Tm90ZScsIFsnbmV3Qml0Jyxcblx0ZnVuY3Rpb24obmV3Qml0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHBhcmVudCwgaWQpIHtcblx0XHRcdHZhciBub3RlSUQ7XG5cblx0XHRcdGlmIChpZCl7XG5cdFx0XHRcdG5vdGVJRCA9IGlkO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5vdGVJRCA9ICQkXy5yYW5kb21pemUoKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG5vdGVSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzLycgKyBub3RlSUQgKTtcblx0XHRcdG5vdGVSZWYuc2V0KHtcblx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRwYXJlbnQ6IHR5cGVvZihwYXJlbnQpID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBwYXJlbnQsXG5cdFx0XHRcdGlkOiBub3RlSUQsXG5cdFx0XHRcdGJvZHk6IFtuZXdCaXQoMCldLFxuXHRcdFx0XHRjYXRlZ29yeTogMCxcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0bGlzdDogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBub3RlSUQ7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdzaGFyZU5vdGUnLCBbJyRmaXJlYmFzZU9iamVjdCcsICdOb3RlJywgJyRjb29raWVzJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCwgTm90ZSwgJGNvb2tpZXMsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgdGFyZ2V0KSB7XG5cblx0XHRcdGlmICgkbG9jYXRpb24ucGF0aCgpLmluZGV4T2YoJ3NoYXJlZCcpID4gMCl7XG5cblx0XHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArIGlkICsgJy9wYXJ0aWNpcGFudHMvJyArIGVtYWlsRXNjYXBlcih0YXJnZXQpKTtcblxuXHRcdFx0XHRyZWYuc2V0KHtcblx0XHRcdFx0XHRwYXJlbnQ6IGZhbHNlXG5cdFx0XHRcdH0pXG5cblx0XHRcdH1lbHNle1xuXHRcdFx0XHROb3RlKGlkKS4kbG9hZGVkKCkudGhlbihmdW5jdGlvbihwcml2YXRlTm90ZSkge1xuXHRcdFx0XHRcdHZhciBzaGFyaW5nID0ge307XG5cdFx0XHRcdFx0aWYgKHByaXZhdGVOb3RlLnBhcmVudCl7XG5cdFx0XHRcdFx0XHRzaGFyaW5nWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdID0ge1xuXHRcdFx0XHRcdFx0XHRwYXJlbnQ6IHByaXZhdGVOb3RlLnBhcmVudCxcblx0XHRcdFx0XHRcdFx0eDogcHJpdmF0ZU5vdGUueCxcblx0XHRcdFx0XHRcdFx0eTogcHJpdmF0ZU5vdGUueVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0c2hhcmluZ1skY29va2llcy5lbWFpbF9lc2NhcGVkXSA9IHsgcGFyZW50OiBmYWxzZSB9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c2hhcmluZ1tlbWFpbEVzY2FwZXIodGFyZ2V0KV0gPSB7IHBhcmVudDogZmFsc2UgfVxuXG5cdFx0XHRcdFx0dmFyIHNoYXJlZFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArIGlkKTtcblx0XHRcdFx0XHRzaGFyZWRSZWYuc2V0KHtcblx0XHRcdFx0XHRcdHRpdGxlOiBwcml2YXRlTm90ZS50aXRsZSxcblx0XHRcdFx0XHRcdGlkOiBwcml2YXRlTm90ZS5pZCxcblx0XHRcdFx0XHRcdGJvZHk6IHByaXZhdGVOb3RlLmJvZHksXG5cdFx0XHRcdFx0XHRjYXRlZ29yeTogcHJpdmF0ZU5vdGUuY2F0ZWdvcnksXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBwcml2YXRlTm90ZS5kaXNwbGF5LFxuXHRcdFx0XHRcdFx0bGlzdDogcHJpdmF0ZU5vdGUubGlzdCxcblx0XHRcdFx0XHRcdHBhcnRpY2lwYW50czogc2hhcmluZ1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0cHJpdmF0ZU5vdGUuJHJlbW92ZSgpO1xuXG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9zaGFyZWRub3RlLycgKyBpZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbl0pO1xuXG5cbmFwcC5mYWN0b3J5KCdraWxsTm90ZScsIFsnTm90ZScsICdzaGFyZWROb3RlJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKE5vdGUsIHNoYXJlZE5vdGUsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgcGFyZW50KSB7XG5cblx0XHRcdGlmIChwYXJlbnQpe1xuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyBwYXJlbnQpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG5vdGUgPSBOb3RlKGlkKTtcblx0XHRcdG5vdGUuJHJlbW92ZSgpO1xuXG5cdFx0XHRzaGFyZWROb3RlID0gc2hhcmVkTm90ZShpZCk7XG5cdFx0XHRzaGFyZWROb3RlLiRyZW1vdmUoKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ25ld0JvYXJkJyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ym9hcmRJRCA9ICQkXy5yYW5kb21pemUoKTtcblxuXHRcdFx0Ly9CT0FSRFNcblx0XHRcdHZhciBib2FyZFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvYm9hcmRzLycgKyBib2FyZElEICk7XG5cdFx0XHRib2FyZFJlZi5zZXQoe1xuXHRcdFx0XHR0aXRsZTogJycsXG5cdFx0XHRcdGlkOiBib2FyZElELFxuXHRcdFx0XHRub3RlczpbXVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBib2FyZElEO1xuXHRcdH07XG5cdH1cbik7XG5cbmFwcC5mYWN0b3J5KCdraWxsQm9hcmQnLCBbJ0JvYXJkJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKEJvYXJkLCAkbG9jYXRpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHBhcmVudCkge1xuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHRib2FyZCA9IEJvYXJkKGlkKTtcblx0XHRcdGJvYXJkLiRyZW1vdmUoKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ2NvbmNlbnRyaWNpdHknLCBbJyRjb29raWVzJyxcblx0ZnVuY3Rpb24oJGNvb2tpZXMpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHBhcmVudCkge1xuXHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ2NvbmNlbnRyaWMnKS5hdHRyKCdkYXRhLWRpcmVjdGlvbicsIFxuXHRcdFx0XHRmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHJldHVybiB3aW5kb3cuZGlyZWN0aW9uc1srKyRjb29raWVzLmRpcmVjdGlvbiAlIDRdO1xuXHRcdFx0XHR9XG5cdFx0XHQpXG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JGJvZHkucmVtb3ZlQ2xhc3MoJ2NvbmNlbnRyaWMnKVxuXHRcdFx0fSwgMTAwMClcblx0XHR9O1xuXHR9XG5dKTtcblxuXG5hcHAuY29udHJvbGxlcignaG9tZUN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J05vdGUnLFxuXHRcdCduZXdOb3RlJywgXG5cdFx0J2tpbGxOb3RlJyxcblx0XHQnbmV3Qml0Jyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyRjb29raWVzJyxcblx0XHQnQXV0aCcsXG5cdFx0J0xvZ2luJyxcblx0XHQnZmlyc3ROb3RlJyxcblx0XHRob21lQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignbm90ZUN0cmwnLCBcblx0W1xuXHRcdCckY29udHJvbGxlcicsXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCduZXdOb3RlJywgXG5cdFx0J2tpbGxOb3RlJyxcblx0XHQnc2hhcmVOb3RlJyxcblx0XHQnbmV3Qml0Jyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyRjb29raWVzJyxcblx0XHQnTG9nb3V0Jyxcblx0XHQnY29uY2VudHJpY2l0eScsXG5cdFx0J0ZpbGVVcGxvYWRlcicsXG5cdFx0bm90ZUN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NoYW5nZUN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J0JvYXJkcycsXG5cdFx0J25ld0JvYXJkJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJHdpbmRvdycsXG5cdFx0JyRjb29raWVzJyxcblx0XHRjaGFuZ2VDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdib2FyZEN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsIFxuXHRcdCdCb2FyZCcsXG5cdFx0J25ld0JvYXJkJyxcblx0XHQna2lsbEJvYXJkJyxcblx0XHQnTm90ZXMnLFxuXHRcdCdTaGFyZWROb3RlcycsXG5cdFx0J25ld05vdGUnLFxuXHRcdCdraWxsTm90ZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckaW50ZXJ2YWwnLFxuXHRcdCckY29va2llcycsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdGJvYXJkQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignbGlzdEN0cmwnLCBcblx0W1xuXHRcdCckZmlyZWJhc2VBcnJheScsXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJywgXG5cdFx0J05vdGVzJyxcblx0XHQnU2hhcmVkTm90ZXMnLFxuXHRcdCduZXdOb3RlJyxcblx0XHQna2lsbE5vdGUnLFxuXHRcdCdCb2FyZHMnLFxuXHRcdCduZXdCb2FyZCcsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckY29va2llcycsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdGxpc3RDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdjb2xvcGhvbkN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsIFxuXHRcdCdob3RrZXlzJyxcblx0XHRjb2xvcGhvbkN0cmxcblx0XVxuKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0Qm9hcmQsXG5cdG5ld0JvYXJkLFxuXHRraWxsQm9hcmQsXG5cdE5vdGVzLFxuXHRTaGFyZWROb3Rlcyxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRpbnRlcnZhbCxcblx0JGNvb2tpZXMsXG5cdExvZ291dCxcblx0Y29uY2VudHJpY2l0eVxuKSB7XG5cdEJvYXJkKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdib2FyZCcpO1xuXG5cdE5vdGVzKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlcycpO1xuXG5cdFNoYXJlZE5vdGVzKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdzaGFyZWRub3RlcycpXG5cdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cblx0XHRcdCRzY29wZS5zaGFyZWRGaWx0ZXIgPSBmdW5jdGlvbihlKXtcblx0XHRcdFx0dmFyIHNoYXJlZCA9IHt9O1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gJ29iamVjdCcgJiYgISFlKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24oZiwgbCl7XG5cdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHQobCA9PSB3aW5kb3cudWlkIHx8IGwgPT0gJGNvb2tpZXMuZW1haWxfZXNjYXBlZCkgXG5cdFx0XHRcdFx0XHRcdFx0JiYgKGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9PT0gJHJvdXRlUGFyYW1zLmlkKVxuXHRcdFx0XHRcdFx0XHQpe1xuXHRcdFx0XHRcdFx0XHRcdHNoYXJlZFtrXSA9IGU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdHJldHVybiBzaGFyZWQ7XG5cdFx0XHR9XG5cblx0XHR9KTtcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnYm9hcmQnO1xuXG4gICAgJHNjb3BlLmNvbmNlbnRyaWMgPSBmdW5jdGlvbigpe1xuICAgIFx0Y29uY2VudHJpY2l0eSgpO1xuICAgIH07XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdHbyBiYWNrIHRvIExpc3QnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXHQkc2NvcGUubmV3Tm90ZSA9IGZ1bmN0aW9uKGJvYXJkSUQpe1xuXHRcdG5ld05vdGUoYm9hcmRJRCk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5uZXdCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgbmV3Qm9hcmQoKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5raWxsTm90ZSA9IGZ1bmN0aW9uKGlkX25vdGUsIGlkX2JvYXJkKXtcblx0XHRraWxsTm90ZShpZF9ub3RlLCBpZF9ib2FyZCk7XG5cdH07XG5cblx0dmFyIGlzRW1wdHkgPSB0cnVlO1xuXG5cdGlzQm9hcmRFbXB0eSA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCQoJy5ib2FyZF9ib2R5IHVsIGxpJykubGVuZ3RoID4gMClcblx0XHRcdGlzRW1wdHkgPSBmYWxzZTtcblx0XHRlbHNlXG5cdFx0XHRpc0VtcHR5ID0gdHJ1ZTtcblxuXHRcdCRzY29wZS5ib2FyZElzRW1wdHkgPSBpc0VtcHR5O1xuXHR9O1xuXG5cdCRzY29wZS5raWxsV2FybiA9IGZhbHNlO1xuXG5cdCRzY29wZS5raWxsQm9hcmQgPSBmdW5jdGlvbihpZCl7XG5cdFx0aWYgKCRzY29wZS5ib2FyZElzRW1wdHkpe1xuXHRcdFx0a2lsbEJvYXJkKGlkKTtcblx0XHR9ZWxzZXtcblx0XHRcdCRzY29wZS5raWxsV2FybiA9IHRydWU7XG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5raWxsV2FybiA9IGZhbHNlO1xuXHRcdFx0fSwgMzAwMCk7XG5cdFx0fVxuXHR9XG5cblx0ZW1wdHlXYXRjaGVyID0gJGludGVydmFsKGlzQm9hcmRFbXB0eSwgMTAwMCk7XG5cblx0JHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihuZXh0LCBjdXJyZW50KSB7IFxuXHRcdCRpbnRlcnZhbC5jYW5jZWwoZW1wdHlXYXRjaGVyKVxuXHR9KTtcblxuXHQkc2NvcGUuYm9hcmRJdGVtT3B0c19wcml2YXRlID0ge1xuXHQgICAgc2l6ZVg6ICcxJyxcblx0ICAgIHNpemVZOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IDIgOiAxLFxuXHQgICAgcm93OiAnbm90ZS55Jyxcblx0ICAgIGNvbDogJ25vdGUueCdcblx0fTtcblxuXHQkc2NvcGUuYm9hcmRJdGVtT3B0c19zaGFyZWQgPSB7XG5cdCAgICBzaXplWDogJzEnLFxuXHQgICAgc2l6ZVk6IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gMiA6IDEsXG5cdCAgICByb3c6ICdub3RlLnBhcnRpY2lwYW50c1tcIicgKyAkY29va2llcy5lbWFpbF9lc2NhcGVkICsgJ1wiXS55Jyxcblx0ICAgIGNvbDogJ25vdGUucGFydGljaXBhbnRzW1wiJyArICRjb29raWVzLmVtYWlsX2VzY2FwZWQgKyAnXCJdLngnXG5cdH07XG5cblx0JHNjb3BlLmJvYXJkR3JpZE9wdHMgPSB7XG5cdCAgICBjb2x1bW5zOiA0LFxuXHQgICAgZmxvYXRpbmc6IGZhbHNlLFxuXHQgICAgbW9iaWxlTW9kZUVuYWJsZWQ6IGZhbHNlLFxuXHQgICAgbWluQ29sdW1uczogNCxcblx0ICAgIG1pblJvd3M6IDQsXG5cdCAgICBtYXhSb3dzOiAxMCxcblx0ICAgIGRlZmF1bHRTaXplWDogMSxcblx0ICAgIGRlZmF1bHRTaXplWTogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAyIDogMSxcblx0ICAgIHJlc2l6YWJsZToge1xuXHQgICAgICAgZW5hYmxlZDogZmFsc2UsXG5cdCAgICB9LFxuXHRcdGRyYWdnYWJsZToge1xuXHRcdFx0aGFuZGxlOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/ICcuZ3JhYmJlcicgOiBudWxsXG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdExvZ291dCgpO1xuXHR9XG5cblx0JHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnRvZ2dsZUNsYXNzKCdtb2JpbGVNZW51T3BlbicpO1x0XG5cdH07XG5cblx0JHNjb3BlLmNsb3NlTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS5yZW1vdmVDbGFzcygnbW9iaWxlTWVudU9wZW4nKTtcdFxuXHR9O1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsXG5cdEJvYXJkcyxcblx0bmV3Qm9hcmQsXG5cdE5vdGUsXG5cdHNoYXJlZE5vdGUsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSxcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JHdpbmRvdyxcblx0JGNvb2tpZXNcbikge1xuXHRCb2FyZHMoKS4kYmluZFRvKCRzY29wZSwgJ2JvYXJkcycpO1xuXG5cdGNvbnNvbGUubG9nKHdpbmRvdy5oaXN0b3JpY2FsW3dpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aF0pXG5cdGNvbnNvbGUubG9nKHdpbmRvdy5oaXN0b3JpY2FsW3dpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aCAtIDFdKVxuXHRjb25zb2xlLmxvZyh3aW5kb3cuaGlzdG9yaWNhbFt3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggLSAyXSlcblxuXHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblx0XHRjb25zb2xlLmxvZygnU0hBUkVEJylcblx0XHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHQudGhlbihmdW5jdGlvbihwYXlsb2FkKXtcblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5ub3RlKVxuXHRcdH0pXG5cdH1lbHNle1xuXHRcdGNvbnNvbGUubG9nKCdQUklWQVRFJylcblx0XHROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHQudGhlbihmdW5jdGlvbihwYXlsb2FkKXtcblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5ub3RlKVxuXHRcdH0pXG5cdH1cblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnY2hhbmdlJztcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FoLCBmb3JnZXQgaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmdvQmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1x0XHRcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9zaGFyZWRub3RlLycgKyAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdGVsc2Vcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0fVxuXG5cdCRzY29wZS5jaGFuZ2VCb2FyZCA9IGZ1bmN0aW9uKGJvYXJkKXtcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9IGJvYXJkO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IGJvYXJkO1xuXG5cdFx0JHNjb3BlLmdvQmFjaygpO1xuXHR9O1xuXG5cdCRzY29wZS5uZXdCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG5ld0JvYXJkSUQgPSBuZXdCb2FyZCgpXG5cblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9IG5ld0JvYXJkSUQ7XG5cdFx0ZWxzZVxuXHRcdFx0JHNjb3BlLm5vdGUucGFyZW50ID0gbmV3Qm9hcmRJRDtcblxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkSUQpO1xuXHR9XG5cblx0JHNjb3BlLm5vQm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdGlmICgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHMpXG5cdFx0XHQkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50ID0gZmFsc2U7XG5cdFx0ZWxzZVxuXHRcdFx0JHNjb3BlLm5vdGUucGFyZW50ID0gbnVsbDtcblxuXHRcdCRzY29wZS5nb0JhY2soKTtcblx0fVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHRob3RrZXlzXG4pIHtcblxuXHQkc2NvcGUucGFnZUNsYXNzID0gJ2NvbG9waG9uJztcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0dvIGJhY2sgdG8gTGlzdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0Tm90ZSxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdG5ld0JpdCxcblx0JHJvdXRlUGFyYW1zLCBcblx0JHJvdXRlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JGNvb2tpZXMsXG5cdEF1dGgsXG5cdExvZ2luLFxuXHRmaXJzdE5vdGVcbikge1xuICAgICRzY29wZS5hdXRoID0gQXV0aDtcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnaG9tZSc7XG4gICAgJHNjb3BlLnZpZXdpbmcgPSAnc2lnbkluJztcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgaWYgKHdpbmRvdy5sb2dnZWRJbilcblx0ICAgICRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXG4gICAgJHNjb3BlLnNpZ25fdXAgPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCEkc2NvcGUuc2lnbkluLiRwcmlzdGluZSlcblx0ICAgIFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0JHNjb3BlLmF1dGguJGNyZWF0ZVVzZXIoe1xuXHRcdFx0ZW1haWwgICAgOiAkc2NvcGUuc2lnblVwX2lucHV0LmVtYWlsLFxuXHRcdFx0cGFzc3dvcmQgOiAkc2NvcGUuc2lnblVwX2lucHV0LnBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih1c2VyRGF0YSkge1xuXG5cdFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0XHRjb25zb2xlLmxvZygnbmV3IHVzZXIgXCInICsgdXNlckRhdGEudWlkICsgJ1wiIGNyZWF0ZWQhJyk7XG5cblx0XHRcdHdpbmRvdy51aWQgPSB1c2VyRGF0YS51aWQ7XG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdExvZ2luKCRzY29wZS5zaWduVXBfaW5wdXQuZW1haWwsICRzY29wZS5zaWduVXBfaW5wdXQucGFzc3dvcmQsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0Zmlyc3ROb3RlKCk7XG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0LycpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0fSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNpZ25faW4gPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCEkc2NvcGUuc2lnbkluLiRwcmlzdGluZSlcblx0ICAgIFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgIFx0TG9naW4oJHNjb3BlLnNpZ25Jbl9pbnB1dC5lbWFpbCwgJHNjb3BlLnNpZ25Jbl9pbnB1dC5wYXNzd29yZCwgXG4gICAgXHRcdGZ1bmN0aW9uKCl7XG5cdCAgICBcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0ICAgIFx0XHRpZiAoIXdpbmRvdy5yZXNldHRpbmdQYXNzd29yZClcblx0XHQgICAgXHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdC8nKTtcblx0XHQgICAgXHRlbHNle1xuXHRcdCAgICBcdFx0JHNjb3BlLnZpZXdpbmcgPSAncHdjaGFuZ2UnO1xuXHRcdCAgICBcdH1cblx0ICAgIFx0fSxcblx0ICAgIFx0ZnVuY3Rpb24oKXtcblx0ICAgIFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXHQgICAgXHRcdCRzY29wZS5zaWduSW5faW5wdXQuZW1haWwgPSAnJztcblx0ICAgIFx0XHQkc2NvcGUuc2lnbkluX2lucHV0LnBhc3N3b3JkID0gJyc7XG5cdCAgICBcdH1cbiAgICBcdCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLm5ld1BXID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdCRzY29wZS5hdXRoLiRjaGFuZ2VQYXNzd29yZCh7XG5cdFx0XHRlbWFpbDogJHNjb3BlLnNpZ25Jbl9pbnB1dC5lbWFpbCxcblx0XHRcdG9sZFBhc3N3b3JkOiAkc2NvcGUuc2lnbkluX2lucHV0LnBhc3N3b3JkLFxuXHRcdFx0bmV3UGFzc3dvcmQ6ICRzY29wZS5yZXNldF9pbnB1dC5wYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0d2luZG93LnJlc2V0dGluZ1Bhc3N3b3JkID0gZmFsc2U7XG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QvJyk7XG5cdFx0XHRhbGVydCgnQWxyaWdodCwgeW91ciBwYXNzd29yZCBoYXMgYmVlbiByZXNldCFcXG5cXG5Eb25cXCd0IHdvcnJ5LCBpdCBoYXBwZW5zIHRvIGV2ZXJ5b25lISA6KScpXG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIsIGVycm9yKTtcblx0XHR9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUucHdSZXNldCA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lKVxuXHQgICAgXHQkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUgJiYgJHNjb3BlLnNpZ25Jbi4kdmFsaWQpe1xuXHRcdFx0JHNjb3BlLmF1dGguJHJlc2V0UGFzc3dvcmQoe1xuXHRcdFx0XHRlbWFpbDogJHNjb3BlLnNpZ25Jbl9pbnB1dC5lbWFpbFxuXHRcdFx0fSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0d2luZG93LnJlc2V0dGluZ1Bhc3N3b3JkID0gdHJ1ZTtcblx0XHRcdFx0YWxlcnQoJ0F3ZXNvbWUhXFxuXFxuR28gY2hlY2sgeW91ciBlbWFpbCwgd2UganVzdCBzZW50IHlvdSBhIHRlbXBvcmFyeSBwYXNzd29yZC4gXFxuXFxuR28gZ2V0IGl0IHRoZXJlLCBsb2dpbiB3aXRoIHRoYXQsIGFuZCB3ZVxcJ2xsIGNoYW5nZSB5b3VyIHBhc3N3b3JkIHdoZW4geW91IGdldCBiYWNrIScpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUGFzc3dvcmQgcmVzZXQgZW1haWwgc2VudCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiLCBlcnJvcik7XG5cdFx0XHR9KTtcbiAgICBcdH1lbHNle1xuICAgIFx0XHRhbGVydCgnQWggbWFuLCBJIGhhdGUgaXQgd2hlbiB0aGF0IGhhcHBlbnMuXFxuXFxuSGVyZSwgcHV0IHlvdXIgZW1haWwgaW4sIGFuZCBjbGljayB0aGUgXFwnRm9yZ290IHlvdXIgcGFzc3dvcmQ/XFwnIGJ1dHRvbiBhZ2Fpbi4nKVxuICAgIFx0fVxuICAgIH1cblxuICAgICRzY29wZS5lbnRlcldhdGNoID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICBcdFx0aWYgKCRzY29wZS52aWV3aW5nID09PSAnc2lnblVwJykgJHNjb3BlLnNpZ25fdXAoKTtcbiAgICBcdFx0ZWxzZSBpZiAoJHNjb3BlLnZpZXdpbmcgPT09ICdzaWduSW4nKSAkc2NvcGUuc2lnbl9pbigpO1xuICAgIFx0XHRlbHNlIGlmICgkc2NvcGUudmlld2luZyA9PT0gJ3B3Y2hhbmdlJykgJHNjb3BlLm5ld1BXKCk7XG4gICAgXHR9XG4gICAgfTtcbn1cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkZmlyZWJhc2VBcnJheSxcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdE5vdGVzLFxuXHRTaGFyZWROb3Rlcyxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdEJvYXJkcyxcblx0bmV3Qm9hcmQsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRjb29raWVzLFxuXHRMb2dvdXQsXG5cdGNvbmNlbnRyaWNpdHlcbikge1xuXHROb3RlcygpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZXMnKTtcblx0Qm9hcmRzKCkuJGJpbmRUbygkc2NvcGUsICdib2FyZHMnKTtcblx0U2hhcmVkTm90ZXMoKS4kYmluZFRvKCRzY29wZSwgJ3NoYXJlZG5vdGVzJylcblx0XHQudGhlbihmdW5jdGlvbigpIHtcblxuXHRcdFx0JHNjb3BlLnNoYXJlZEZpbHRlciA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHR2YXIgc2hhcmVkID0ge307XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChlLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGUucGFydGljaXBhbnRzLCBmdW5jdGlvbihmLCBsKXtcblx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdChsID09IHdpbmRvdy51aWQgfHwgbCA9PSAkY29va2llcy5lbWFpbF9lc2NhcGVkKSBcblx0XHRcdFx0XHRcdFx0XHQmJiAoIWUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudClcblx0XHRcdFx0XHRcdFx0KXtcblx0XHRcdFx0XHRcdFx0XHRzaGFyZWRba10gPSBlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHRyZXR1cm4gc2hhcmVkO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2xpc3QnO1xuXG4gICAgJHNjb3BlLmNvbmNlbnRyaWMgPSBmdW5jdGlvbigpe1xuICAgIFx0Y29uY2VudHJpY2l0eSgpO1xuICAgIH07XG5cblx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0O1xuXG5cdCRzY29wZS4kd2F0Y2goJ2xvb2tpbmdBdCcsIGZ1bmN0aW9uKCl7XG5cdFx0d2luZG93Lmxpc3RMb29raW5nQXQgPSAkc2NvcGUubG9va2luZ0F0O1xuXHR9KVxuXG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3Tm90ZSgpKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH07XG5cblx0JHNjb3BlLm5ld0JvYXJkID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyBuZXdCb2FyZCgpKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH07XG5cblx0JHNjb3BlLmtpbGxOb3RlID0gZnVuY3Rpb24oaWQpe1xuXHRcdGtpbGxOb3RlKGlkKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH1cblxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHRMb2dvdXQoKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH1cblxuXHQkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykudG9nZ2xlQ2xhc3MoJ21vYmlsZU1lbnVPcGVuJyk7XHRcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VNZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnJlbW92ZUNsYXNzKCdtb2JpbGVNZW51T3BlbicpO1x0XG5cdH07XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JGNvbnRyb2xsZXIsXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHRuZXdOb3RlLFxuXHRraWxsTm90ZSxcblx0c2hhcmVOb3RlLFxuXHRuZXdCaXQsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRjb29raWVzLFxuXHRMb2dvdXQsXG5cdGNvbmNlbnRyaWNpdHksXG5cdEZpbGVVcGxvYWRlclxuKSB7XG5cblx0dmFyIHNob3dpbmdDaGVhdHNoZWV0ID0gZmFsc2U7XG5cdFxuXHQkc2NvcGUuY29tbWFuZElzUHJlc3NlZCA9IGZhbHNlO1xuXHQkc2NvcGUuYWx0SXNQcmVzc2VkID0gZmFsc2U7XG5cdCRzY29wZS5zZWxlY3RlZEJpdHMgPSBmYWxzZTtcblx0JHNjb3BlLmNsaXBib2FyZGVkID0gZmFsc2U7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdub3RlJztcblxuICAgICRzY29wZS5jb25jZW50cmljID0gZnVuY3Rpb24oKXtcbiAgICBcdGNvbmNlbnRyaWNpdHkoKTtcbiAgICB9O1xuXG4gICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblxuICAgIFx0c2hhcmVkTm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG4gICAgXHQudGhlbihmdW5jdGlvbigpIHtcbiAgICBcdFx0JHNjb3BlLmNsb3NlQml0TWVudXMoKTtcbiAgICBcdFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcbiAgICBcdFx0JHNjb3BlLm5vdGUua2lsbCA9IGZhbHNlO1xuICAgIFx0fSk7XG5cbiAgICB9ZWxzZXtcblx0XHROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHQudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0eXBlb2YoJHNjb3BlLm5vdGUuYm9keSkgPT09ICd1bmRlZmluZWQnKXtcblx0XHRcdFx0bmV3Tm90ZSgnJywgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHRcdH1cblx0XHRcdCRzY29wZS5jbG9zZUJpdE1lbnVzKCk7XG5cdFx0XHQkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdFx0JHNjb3BlLm5vdGUua2lsbCA9IGZhbHNlO1xuXHRcdH0pO1xuICAgIH1cblxuICAgICRzY29wZS5zaGFyZUFjdGl2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoJGxvY2F0aW9uLnBhdGgoKS5pbmRleE9mKCdzaGFyZWQnKSA+IDApXG4gICAgXHRcdHJldHVybiB0cnVlXG4gICAgXHRlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblx0JHNjb3BlLnVwbG9hZGVyID0gbmV3IEZpbGVVcGxvYWRlcigpO1xuXG5cdC8vIGNvbnNvbGUubG9nKCRzY29wZS51cGxvYWRlcilcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ODggICAgICAgIDg4ICAgLGFkODg4OGJhLCA4ODg4ODg4ODg4ODggODggICAgICBhOFAgIDg4ODg4ODg4ODg4IDhiICAgICAgICBkOCBhZDg4ODg4YmEgICBcblx0Ly8gXHQ4OCAgICAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICAgICw4OCcgICA4OCAgICAgICAgICAgWTgsICAgICw4UCBkOFwiICAgICBcIjhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggZDgnICAgICAgICBgOGIgICAgODggICAgICA4OCAgLDg4XCIgICAgIDg4ICAgICAgICAgICAgWTgsICAsOFAgIFk4LCAgICAgICAgICBcblx0Ly8gXHQ4OGFhYWFhYWFhODggODggICAgICAgICAgODggICAgODggICAgICA4OCxkODgnICAgICAgODhhYWFhYSAgICAgICAgXCI4YWE4XCIgICBgWThhYWFhYSwgICAgXG5cdC8vIFx0ODhcIlwiXCJcIlwiXCJcIlwiODggODggICAgICAgICAgODggICAgODggICAgICA4ODg4XCI4OCwgICAgIDg4XCJcIlwiXCJcIiAgICAgICAgIGA4OCcgICAgICBgXCJcIlwiXCJcIjhiLCAgXG5cdC8vIFx0ODggICAgICAgIDg4IFk4LCAgICAgICAgLDhQICAgIDg4ICAgICAgODhQICAgWThiICAgIDg4ICAgICAgICAgICAgICAgODggICAgICAgICAgICAgYDhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgICAgXCI4OCwgIDg4ICAgICAgICAgICAgICAgODggICAgIFk4YSAgICAgYThQICBcblx0Ly8gXHQ4OCAgICAgICAgODggICBgXCJZODg4OFlcIicgICAgICA4OCAgICAgIDg4ICAgICAgIFk4YiA4ODg4ODg4ODg4OCAgICAgIDg4ICAgICAgXCJZODg4ODhQXCIgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICc/Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge31cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdhbHQnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdIb2xkIGRvd24gdG8gZWRpdCBwYXN0ZWQgbGlua3MnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0FMVF9ET1dOJylcblx0XHRcdFx0JHNjb3BlLmFsdElzUHJlc3NlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnYWx0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXl1cCcsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnQUxUX1VQJylcblx0XHRcdFx0JHNjb3BlLmFsdElzUHJlc3NlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2NvbW1hbmQnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdIb2xkIGRvd24gdG8gc2VsZWN0IGJpdHMnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2NvbW1hbmQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleXVwJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5jb21tYW5kSXNQcmVzc2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2VudGVyJywgJ3NoaWZ0K2VudGVyJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FkZCBuZXcgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXHRcdFx0XHRcdGlmIChfaXNCaXQoKSl7XG5cdFx0XHRcdFx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uY29udGVudCAhPT0gJycpXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5hZGRCaXQoIF9iaXRJbmRleCgpICk7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChfYml0SW5kZXgoKSAhPT0gMCl7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0X2ZvY3VzTWUoMCk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2VudGVyJywgJ2N0cmwrZW50ZXInXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnYWRkIGEgbGl0dGxlIHNwYWNlIGFib3ZlIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgX2lzQml0KCkpe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcCA9ICEkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXA7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2JhY2tzcGFjZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBcblx0XHRcdFx0XHRfaXNUZXh0YXJlYSgpICYmIFxuXHRcdFx0XHRcdCgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5jb250ZW50ID09PSAnJylcblx0XHRcdFx0KXtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQgPiAwKVxuXHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQtLTtcblx0XHRcdFx0XHRlbHNlIGlmICgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXApXG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXAgPSBmYWxzZTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQkc2NvcGUua2lsbEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrYmFja3NwYWNlJywgJ2N0cmwrYmFja3NwYWNlJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBEZWxldGUgdGhpcyBiaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSApe1xuXHRcdFx0XHRcdCRzY29wZS5raWxsQml0KCBfYml0SW5kZXgoKSApO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtzaGlmdCtiYWNrc3BhY2UnLCAnY3RybCtzaGlmdCtiYWNrc3BhY2UnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVsZXRlIHRoaXMgbm90ZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUua2lsbCAmJiAkc2NvcGUua2lsbE5vdGUoKTsgXG5cdFx0XHRcdCRzY29wZS5ub3RlLmtpbGwgPSAhJHNjb3BlLm5vdGUua2lsbDtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICd0YWInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgSW5kZW50Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpICYmIF9pc0JpdCgpICl7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdFx0XHRpZiAoZS5zZWxlY3RlZClcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudGFiSW4oayk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1lbHNlXG5cdFx0XHRcdFx0XHQkc2NvcGUudGFiSW4oX2JpdEluZGV4KCkpO1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1lbHNlIGlmICggX2lzVGV4dGFyZWEoKSApXG5cdFx0XHRcdFx0X2ZvY3VzTWUoMCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQrdGFiJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIE91dGRlbnQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgX2lzQml0KCkgKXtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0XHRcdGlmIChlLnNlbGVjdGVkKVxuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS50YWJPdXQoayk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1lbHNlXG5cdFx0XHRcdFx0XHQkc2NvcGUudGFiT3V0KF9iaXRJbmRleCgpKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ3VwJywgJ2Rvd24nXSxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHQkc2NvcGUuanVtcEFyb3VuZChfYml0SW5kZXgoKSwgZXZlbnQua2V5SWRlbnRpZmllciwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcdFx0XG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ3NoaWZ0K3VwJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCkgLSAxXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdF9mb2N1c01lKF9iaXRJbmRleCgpIC0gMSk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQrZG93bicsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpICsgMV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRfZm9jdXNNZShfYml0SW5kZXgoKSArIDEpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjdHJsK3VwJywgJ2N0cmwrZG93biddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdRdWlja2x5IGp1bXAgYmV0d2VlbiBiaXRzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHQkc2NvcGUuanVtcEFyb3VuZChfYml0SW5kZXgoKSwgZXZlbnQua2V5SWRlbnRpZmllciwgdHJ1ZSk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2N0cmwrY29tbWFuZCt1cCcsXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBTd2FwIGJpdCB1cCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdCRzY29wZS5tb3ZlVXAoX2JpdEluZGV4KCkpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2N0cmwrY29tbWFuZCtkb3duJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIFN3YXAgYml0IGRvd24nLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHQkc2NvcGUubW92ZURvd24oX2JpdEluZGV4KCkpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK3gnLCAnY3RybCt4J10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0N1dCBzZWxlY3RlZCBiaXRzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuY3V0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrdicsICdjdHJsK3YnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnUGFzdGUgY3V0IGJpdHMgKG9yIGp1c3QgcGFzdGUgdGhlIGNvbnRlbnRzIG9mIHlvdXIgY2xpcGJvYXJkKScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5jbGlwYm9hcmRlZCl7XG5cdFx0XHRcdFx0JHNjb3BlLnBhc3RlKCk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JHNjb3BlLnBhcnNlUGFzdGVkKF9iaXRJbmRleCgpKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdzaGlmdCBzaGlmdCcsXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBUb2dnbGUgdGhpcyBiaXQgYXMgbWFya2VkJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0ubWFyayA9ICEkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5tYXJrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2N0cmwrc2hpZnQgY3RybCtzaGlmdCcsICdjb21tYW5kK3NoaWZ0IGNvbW1hbmQrc2hpZnQnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnVG9nZ2xlIHRoaXMgbm90ZSBhcyBtYXJrZWQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUubWFyayA9ICEkc2NvcGUubm90ZS5tYXJrO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0Nsb3NlIG5vdGUnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHNob3dpbmdDaGVhdHNoZWV0KXtcblx0XHRcdFx0XHRzaG93aW5nQ2hlYXRzaGVldCA9IGZhbHNlO1xuXHRcdFx0XHRcdGhvdGtleXMudG9nZ2xlQ2hlYXRTaGVldCgpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoJHNjb3BlLnNoYXJlUHJvbXB0KXtcblx0XHRcdFx0XHQkc2NvcGUuc2hhcmVQcm9tcHQgPSBmYWxzZTtcdFx0XHRcdFx0XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGlmICgkc2NvcGUubm90ZS5wYXJlbnQpXG5cdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyAkc2NvcGUubm90ZS5wYXJlbnQpXG5cdFx0XHRcdFx0ZWxzZSBpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKXtcblx0XHRcdFx0XHRcdGlmICgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50KVxuXHRcdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyAkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50KVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdhbHQrc2hpZnQrLycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1Nob3cgdGhpcyBoYW5keSBndWlkZSA6KScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHNob3dpbmdDaGVhdHNoZWV0ID0gIXNob3dpbmdDaGVhdHNoZWV0O1xuXHRcdFx0XHRob3RrZXlzLnRvZ2dsZUNoZWF0U2hlZXQoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ODg4ODg4ODg4IDg4ICAgICAgICA4OCA4ODhiICAgICAgODggICAsYWQ4ODg4YmEsIDg4ODg4ODg4ODg4OCA4OCAgICxhZDg4ODhiYSwgICA4ODhiICAgICAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4ODg4YiAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgODg4OGIgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICA4OCAgICAgICAgODggODggYDhiICAgIDg4IGQ4JyAgICAgICAgICAgICAgIDg4ICAgICAgODggZDgnICAgICAgICBgOGIgODggYDhiICAgIDg4ICBcblx0Ly8gXHQ4OGFhYWFhICAgICA4OCAgICAgICAgODggODggIGA4YiAgIDg4IDg4ICAgICAgICAgICAgICAgIDg4ICAgICAgODggODggICAgICAgICAgODggODggIGA4YiAgIDg4ICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICA4OCA4OCAgIGA4YiAgODggODggICAgICAgICAgICAgICAgODggICAgICA4OCA4OCAgICAgICAgICA4OCA4OCAgIGA4YiAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4OCAgICBgOGIgODggWTgsICAgICAgICAgICAgICAgODggICAgICA4OCBZOCwgICAgICAgICw4UCA4OCAgICBgOGIgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIFk4YS4gICAgLmE4UCA4OCAgICAgYDg4ODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgWThhLiAgICAuYThQICA4OCAgICAgYDg4ODggIFxuXHQvLyBcdDg4ICAgICAgICAgICBgXCJZODg4OFlcIicgIDg4ICAgICAgYDg4OCAgIGBcIlk4ODg4WVwiJyAgICAgIDg4ICAgICAgODggICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4ODggIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdCRzY29wZS5hZGRCaXQgPSBmdW5jdGlvbihpbmRleCwgY29udGVudCl7XG5cdFx0dmFyIGluY29taW5nQ29udGVudDtcblxuXHRcdGlmICh0eXBlb2YoY29udGVudCkgPT09ICd1bmRlZmluZWQnKVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gJyc7XG5cdFx0ZWxzZVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gY29udGVudDtcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCArIDEsIDAsIG5ld0JpdChcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQsXG5cdFx0XHRcdGluY29taW5nQ29udGVudFxuXHRcdFx0KSk7XG5cblx0XHRcdCRzY29wZS5wYXJzZUxpbmsoaW5kZXgpO1xuXG5cdFx0XHRfZm9jdXNNZShpbmRleCArIDEpO1xuXHRcdH0sIDUwKTtcblx0fTtcblxuXHQkc2NvcGUucGFyc2VQYXN0ZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdC8vIHNwbGl0IGF0IGxpbmUgYnJlYWtzXG5cdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50KVxuXHRcdFx0dmFyIHRoZUNvbnRlbnQgPSAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50LnNwbGl0KCdcXG4nKSxcblx0XHRcdFx0dG9SZW1vdmUgPSBbXTtcblxuXHRcdFx0Ly8gcmVtb3ZlIGVtcHR5IGxpbmVzXG5cdFx0XHRmb3IgKHZhciBsID0gMDsgbCA8IHRoZUNvbnRlbnQubGVuZ3RoOyBsKyspe1xuXHRcdFx0XHRpZiAoIXRoZUNvbnRlbnRbbF0pXG5cdFx0XHRcdFx0dG9SZW1vdmUucHVzaChsKVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciByID0gdG9SZW1vdmUubGVuZ3RoIC0gMTsgciA+PSAwIDsgci0tKXtcblx0XHRcdFx0dGhlQ29udGVudC5zcGxpY2UodG9SZW1vdmVbcl0sIDEpXG5cdFx0XHR9XG5cblx0XHRcdC8vIHNldCBibG9jayB0byBlbXB0eSBiZWZvcmUgcmVwbGFjaW5nIHcvIDFzdCBsaW5lXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gdGhlQ29udGVudFswXTtcblxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSB0aGVDb250ZW50WzBdO1xuXG5cdFx0XHQkc2NvcGUucGFyc2VMaW5rKGluZGV4KTtcblxuXHRcdFx0Zm9yICh2YXIgbCA9IDE7IGwgPCB0aGVDb250ZW50Lmxlbmd0aDsgbCsrKXtcblx0XHRcdFx0JHNjb3BlLmFkZEJpdChpbmRleCArIChsIC0gMSksIHRoZUNvbnRlbnRbbF0pO1xuXHRcdFx0fVxuXHRcdH0sIDUwKTsgXG5cdH1cblxuXHQkc2NvcGUucGFyc2VMaW5rID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHZhciBjb250ZW50ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudDtcblxuXHRcdGlmIChcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHA6Ly9cIikgPT09IDAgfHxcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHBzOi8vXCIpID09PSAwIFxuXHRcdCl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZygnT0ggTk9FUyBBIExJTksnKVxuXG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0XHRkYXRhVHlwZTonSlNPTlAnLFxuXHRcdFx0XHRkYXRhOntcblx0XHRcdFx0XHRVUkw6IGNvbnRlbnRcblx0XHRcdFx0fSxcblx0XHRcdFx0dXJsOiBcImh0dHA6Ly9yZS5qZWN0LmNoL3RyYS9waHAvdGl0bGUucGhwXCJcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKHRoZVRpdGxlKXtcblx0XHRcdFx0dmFyIGVzY2FwZWRUaXRsZSA9IF8udW5lc2NhcGUodGhlVGl0bGUudGl0bGUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlc2NhcGVkVGl0bGUpXG5cblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudCA9IGVzY2FwZWRUaXRsZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gZXNjYXBlZFRpdGxlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5hZGRyZXNzID0gY29udGVudDtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uaXNMaW5rID0gdHJ1ZTtcblxuXHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5vcGVuTGluayA9IGZ1bmN0aW9uKGJpdCl7XG5cdFx0aWYgKGJpdC5pc0xpbmsgJiYgISRzY29wZS5hbHRJc1ByZXNzZWQpe1xuXHRcdFx0ZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cdFx0XHR2YXIgd2luID0gd2luZG93Lm9wZW4oYml0LmFkZHJlc3MsICdfYmxhbmsnKTtcblx0XHRcdHdpbi5mb2N1cygpO1xuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5raWxsQml0ID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4LCAxKTtcblxuXHRcdGlmICgkc2NvcGUubm90ZS5ib2R5Lmxlbmd0aCA+IDApe1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggLSAxKVxuXHRcdH1lbHNle1xuXHRcdFx0YWRkQml0KDApO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubW92ZVVwID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaywgMSlbMF07XG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShrIC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKF9iaXRJbmRleCgpLCAxKVswXTtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4IC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRfZm9jdXNNZShpbmRleCAtIDEpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubW92ZURvd24gPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0dmFyIGJvZHlDb3B5ID0gYW5ndWxhci5jb3B5KCRzY29wZS5ub3RlLmJvZHkpO1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goYm9keUNvcHkucmV2ZXJzZSgpLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciByZXZlcnNlVGFyZ2V0ID0gTWF0aC5hYnMoYm9keUNvcHkubGVuZ3RoIC0gaykgLSAxO1xuXHRcdFx0XHRcdFx0dmFyIHRoaXNCaXQgPSAkc2NvcGUubm90ZS5ib2R5LnNwbGljZShyZXZlcnNlVGFyZ2V0LCAxKVswXTtcblx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKHJldmVyc2VUYXJnZXQgKyAxLCAwLCB0aGlzQml0KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoX2JpdEluZGV4KCksIDEpWzBdO1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXggKyAxLCAwLCB0aGlzQml0KTtcblx0XHRcdF9mb2N1c01lKGluZGV4ICsgMSk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS50YWJPdXQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50ID4gMCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudC0tO1xuXHRcdH1lbHNle1xuXHRcdFx0X2ZvY3VzTWUoX2JpdEluZGV4KCkgLSAxKTtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUudGFiSW4gPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50IDwgMyl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudCsrO1xuXHRcdH1lbHNle1xuXHRcdFx0X2ZvY3VzTWUoX2JpdEluZGV4KCkgKyAxKTtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUuY2FyZXRUcmFja2VyID0gZnVuY3Rpb24oaW5kZXgsIGtleSl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHRoZUJpdCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdGN1cnJlbnRDYXJldCA9IHRoZUJpdC5zZWxlY3Rpb25TdGFydCxcblx0XHRcdFx0dGhlVmFsdWUgPSB0aGVCaXQudmFsdWU7XG5cblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IFxuXHRcdFx0XHR0aGVWYWx1ZS5zdWJzdHJpbmcoMCwgY3VycmVudENhcmV0KSArIFxuXHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJoaWRkZW5DYXJldFwiPjwvc3Bhbj4nICsgXG5cdFx0XHRcdHRoZVZhbHVlLnN1YnN0cmluZyhjdXJyZW50Q2FyZXQsIHRoZVZhbHVlLmxlbmd0aClcblxuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0sIDEwKVxuXHR9XG5cblxuXHQkc2NvcGUuanVtcEFyb3VuZCA9IGZ1bmN0aW9uKGluZGV4LCBrZXksIGp1c3Rnbyl7XG5cdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsIGtleSwganVzdGdvKVxuXHRcdHZhciAkdGhlQml0ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSxcblx0XHRcdCR0aGVDYXJldCA9ICR0aGVCaXQuc2libGluZ3MoJy50ZXh0YXJlYS1hdXRvc2l6ZScpLmZpbmQoJy5oaWRkZW5DYXJldCcpLFxuXHRcdFx0dGhlQ2FyZXRQb3MgPSAkdGhlQ2FyZXQucG9zaXRpb24oKS50b3AsXG5cdFx0XHR0aGVDYXJldEhlaWdodCA9IDE4O1xuXG5cdFx0aWYgKCBcblx0XHRcdChcblx0XHRcdFx0KGtleSA9PT0gJ1VwJykgJiYgXG5cdFx0XHRcdCh0aGVDYXJldFBvcyA8IHRoZUNhcmV0SGVpZ2h0IC0gMSkgXG5cdFx0XHQpfHwoXG5cdFx0XHRcdChrZXkgPT09ICdVcCcpICYmIFxuXHRcdFx0XHRqdXN0Z29cblx0XHRcdClcblx0XHQpe1xuXHRcdFx0JHRoZUJpdC5wYXJlbnRzKCcubm90ZV9iaXQnKVxuXHRcdFx0XHQucHJldignLm5vdGVfYml0JykuZmluZCgndGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKVxuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0KGtleSA9PT0gJ0Rvd24nKSAmJiBcblx0XHRcdFx0KHRoZUNhcmV0UG9zID4gKCR0aGVDYXJldC5wYXJlbnQoKS5oZWlnaHQoKSAtICh0aGVDYXJldEhlaWdodCkpKSBcblx0XHRcdCl8fChcblx0XHRcdFx0KGtleSA9PT0gJ0Rvd24nKSAmJiBcblx0XHRcdFx0anVzdGdvXG5cdFx0XHQpXG5cdFx0KXtcblx0XHRcdCR0aGVCaXQucGFyZW50cygnLm5vdGVfYml0Jylcblx0XHRcdFx0Lm5leHQoJy5ub3RlX2JpdCcpLmZpbmQoJ3RleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKClcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLm1hcmsgPSBmdW5jdGlvbihpbmRleCwgb3B0aW9uYWwpe1xuXHRcdC8vIGNvbnNvbGUubG9nKGluZGV4LCAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tYXJrLCAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4sIG9wdGlvbmFsKVxuXG5cdFx0aWYgKChvcHRpb25hbCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCkgfHwgIW9wdGlvbmFsKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcmsgPSAhJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWFyaztcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuID0gZmFsc2U7XG5cdFx0XHRcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdFx0Y29uc29sZS5sb2coaW5kZXgsICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcmssICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3Blbilcblx0XHRcdH0pXG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbihjb250ZW50KXtcblx0XHR2YXIgd2luID0gd2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9JyArIGNvbnRlbnQsICdfYmxhbmsnKTtcblx0ICAgIHdpbi5mb2N1cygpOyBcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VCaXRNZW51cyA9IGZ1bmN0aW9uKGV4Y2VwdCl7XG5cdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0aWYgKHR5cGVvZihlLm1lbnVfb3BlbikgIT09ICd1bmRlZmluZWQnICYmIGUuYml0SUQgIT09IGV4Y2VwdClcblx0XHRcdFx0ZS5tZW51X29wZW4gPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXG5cdCRzY29wZS50b2dnbGVCaXRNZW51ID0gZnVuY3Rpb24oaW5kZXgsIGV2ZW50KXtcblx0XHRpZiAoISRzY29wZS5jb21tYW5kSXNQcmVzc2VkKXtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0JHNjb3BlLmNsb3NlQml0TWVudXMoJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uYml0SUQpO1xuXG5cdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuID0gISRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbjtcblxuXHRcdGlmICgkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4pe1xuXHRcdFx0JHNjb3BlLm1lbnVpbmcgPSB0cnVlO1xuXHRcdH1lbHNle1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLm1lbnVpbmcgPSBmYWxzZTtcdFx0XHRcblx0XHRcdH0sIDMwMClcblx0XHR9XG5cdH1cblxuXG5cdHZhciBpbnNlcnRJbmRleDtcblxuXHQkc2NvcGUuc2VsZWN0b3IgPSBmdW5jdGlvbihpbmRleCwgZXZlbnQpe1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGlmICgkc2NvcGUuY29tbWFuZElzUHJlc3NlZCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5zZWxlY3RlZCA9ICEkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5zZWxlY3RlZDtcblx0XHRcdCRzY29wZS5zZWxlY3RlZEJpdHMgPSB0cnVlO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0XHRpbnNlcnRJbmRleCA9IF9iaXRJbmRleCgpO1xuXHR9XG5cblx0JHNjb3BlLnVuc2VsZWN0b3IgPSBmdW5jdGlvbihleGNlcHQpe1xuXHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gZmFsc2U7XG5cdH07XG5cblxuXHQkc2NvcGUuY3V0ID0gZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuY2xpcGJvYXJkID0gW107XG5cblx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdHdpbmRvdy5jbGlwYm9hcmQucHVzaChlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHZhciB0ZW1wQm9keSA9IFtdO1xuXHRcdGFuZ3VsYXIuY29weSgkc2NvcGUubm90ZS5ib2R5LCB0ZW1wQm9keSk7XG5cblx0XHRhbmd1bGFyLmZvckVhY2godGVtcEJvZHkucmV2ZXJzZSgpLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0dmFyIHJldmVyc2VUYXJnZXQgPSBNYXRoLmFicyh0ZW1wQm9keS5sZW5ndGggLSBrKSAtIDE7XG5cblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc2NvcGUua2lsbEJpdChyZXZlcnNlVGFyZ2V0KTtcblx0XHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0JHNjb3BlLmNsaXBib2FyZGVkID0gdHJ1ZTtcblx0fTtcblxuXHQkc2NvcGUucGFzdGUgPSBmdW5jdGlvbigpe1xuXHRcdGFuZ3VsYXIuZm9yRWFjaCh3aW5kb3cuY2xpcGJvYXJkLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKChpbnNlcnRJbmRleCArIGspICsgMSwgMCwgZSlcblx0XHR9KTtcblxuXHRcdCRzY29wZS51bnNlbGVjdG9yKCk7XG5cdFx0d2luZG93LmNsaXBib2FyZCA9IFtdO1xuXHRcdCRzY29wZS5jbGlwYm9hcmRlZCA9IGZhbHNlO1xuXHR9O1xuXG5cblxuXHQkc2NvcGUuc2hhcmVDb25maXJtID0gZnVuY3Rpb24oJGV2ZW50KXtcblx0XHRjb25zb2xlLmxvZygkc2NvcGUuc2hhcmVUYXJnZXQpO1xuXHRcdHNoYXJlTm90ZSgkc2NvcGUubm90ZS5pZCwgJHNjb3BlLnNoYXJlVGFyZ2V0KTtcblx0fTtcblxuXHQkc2NvcGUuZW50ZXJXYXRjaCA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpe1xuXHRcdFx0JHNjb3BlLnNoYXJlQ29uZmlybSgpO1xuXHRcdH1cblx0fTtcblxuXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ODhiICAgICAgICAgICBkODggODg4ODg4ODg4ODggODg4YiAgICAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODg4YiAgICAgICAgIGQ4ODggODggICAgICAgICAgODg4OGIgICAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODhgOGIgICAgICAgZDgnODggODggICAgICAgICAgODggYDhiICAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggYDhiICAgICBkOCcgODggODhhYWFhYSAgICAgODggIGA4YiAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggIGA4YiAgIGQ4JyAgODggODhcIlwiXCJcIlwiICAgICA4OCAgIGA4YiAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgIGA4YiBkOCcgICA4OCA4OCAgICAgICAgICA4OCAgICBgOGIgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICBgODg4JyAgICA4OCA4OCAgICAgICAgICA4OCAgICAgYDg4ODggWThhLiAgICAuYThQICBcblx0Ly8gXHQ4OCAgICAgYDgnICAgICA4OCA4ODg4ODg4ODg4OCA4OCAgICAgIGA4ODggIGBcIlk4ODg4WVwiJyAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgIFxuXG5cdCRzY29wZS5uZXdOb3RlID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgbmV3SUQgPSBuZXdOb3RlKCRzY29wZS5ub3RlLnBhcmVudCk7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ub3RlLycgKyBuZXdJRCk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5raWxsTm90ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0a2lsbE5vdGUoJHNjb3BlLm5vdGUuaWQsICRzY29wZS5ub3RlLnBhcmVudCk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5zaG93Q2hlYXRTaGVldCA9IGZ1bmN0aW9uKCl7XG5cdFx0aG90a2V5cy50b2dnbGVDaGVhdFNoZWV0KClcblx0fTtcblxuXHQkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykudG9nZ2xlQ2xhc3MoJ21vYmlsZU1lbnVPcGVuJyk7XHRcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VNZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnJlbW92ZUNsYXNzKCdtb2JpbGVNZW51T3BlbicpO1x0XG5cdH07XG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4ODg4ODg4ODg4OCA4OCAgICAgICAgICA4ODg4ODg4OGJhICA4ODg4ODg4ODg4OCA4ODg4ODg4OGJhICAgYWQ4ODg4OGJhICAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgXCI4YiA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgZDhcIiAgICAgXCI4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgLDhQIDg4ICAgICAgICAgIDg4ICAgICAgLDhQIFk4LCAgICAgICAgICBcblx0Ly8gXHQ4OGFhYWFhYWFhODggODhhYWFhYSAgICAgODggICAgICAgICAgODhhYWFhYWE4UCcgODhhYWFhYSAgICAgODhhYWFhYWE4UCcgYFk4YWFhYWEsICAgIFxuXHQvLyBcdDg4XCJcIlwiXCJcIlwiXCJcIjg4IDg4XCJcIlwiXCJcIiAgICAgODggICAgICAgICAgODhcIlwiXCJcIlwiXCInICAgODhcIlwiXCJcIlwiICAgICA4OFwiXCJcIlwiODgnICAgICBgXCJcIlwiXCJcIjhiLCAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgIGA4YiAgICAgICAgICAgYDhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgIGA4YiAgWThhICAgICBhOFAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4OCAgICAgICAgICA4ODg4ODg4ODg4OCA4OCAgICAgIGA4YiAgXCJZODg4ODhQXCIgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0dmFyIF9pc1RleHRhcmVhID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50eXBlID09PSAndGV4dGFyZWEnO1xuXHR9LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdF9pc0JpdCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ21vdXNldHJhcCcpID4gLTE7XG5cdH0sXG5cblx0X2JpdEluZGV4ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5wYXJlbnRzKCcubm90ZV9iaXQnKS5pbmRleCgpO1xuXHR9LFxuXG5cdF9mb2N1c01lID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCQoJy5ub3RlX2JvZHknKVxuXHRcdFx0XHQuZmluZCgnLm5vdGVfYml0OmVxKCcgKyAoaW5kZXgpICsgJykgdGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKTtcblx0XHR9KTtcblx0fTtcblxuXHQkc2NvcGUuc29ydGFibGVPcHRpb25zX25vdGUgPSB7XG5cdFx0aGFuZGxlOiAnPiAuYml0X2FuY2hvcicsXG5cdFx0YXhpczogJ3knLFxuXHRcdHNjcm9sbDogdHJ1ZSxcblx0XHRoZWxwZXI6ICdjbG9uZScsXG5cdFx0Ly8gc3RhcnQ6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcblx0XHQvLyAgICAkKHRoaXMpLmF0dHIoJ3N0YXJ0aW5nU2Nyb2xsVG9wJywgd2luZG93LnBhZ2VZT2Zmc2V0KTtcblx0XHQvLyB9LFxuXHRcdC8vIGRyYWc6IGZ1bmN0aW9uKGV2ZW50LHVpKXtcblx0XHQvLyAgICB2YXIgc3QgPSBwYXJzZUludCgkKHRoaXMpLmF0dHIoJ3N0YXJ0aW5nU2Nyb2xsVG9wJykpO1xuXHRcdC8vICAgIHVpLnBvc2l0aW9uLnRvcCAtPSBzdDtcblx0XHQvLyB9LFxuXHRcdCd1aS1mbG9hdGluZyc6IHRydWVcblx0fTtcblxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHRMb2dvdXQoKTtcblx0fVxufSIsIiQoZnVuY3Rpb24oKSB7XG5cblx0Ly8gRkVBVFVSRSBURVNUU1xuXG5cdHZhciBfcHJvcGVydHlDYWNoZSA9IHt9O1x0XG5cblx0ZXhwb3J0cy5zdXBwb3J0c1N2ZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghX3Byb3BlcnR5Q2FjaGUuc3VwcG9ydHNTdmcpe1xuXHRcdFx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoXCJodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0ltYWdlXCIsIFwiMS4xXCIpO1xuXHRcdFx0X3Byb3BlcnR5Q2FjaGUuc3VwcG9ydHNTdmcgPSByZXN1bHQ7XG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIF9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnO1xuXHR9OyBcblxuXHRleHBvcnRzLm1lZGlhUXVlcmllc1N1cHBvcnRlZCA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCFfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQpe1xuXG5cdFx0XHR2YXIgZ2V0VGVzdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZWRpYXRlc3RcIiksXG5cdFx0XHRcdGJvb2w7XG5cblx0XHRcdGlmICghZ2V0VGVzdGVyKXtcblx0XHRcdFx0dmFyIGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0ZC5pZCA9IFwibWVkaWF0ZXN0XCI7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7XG5cdFx0XHRcdGJvb2wgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgdmFyIGQgPSBnZXRUZXN0ZXI7XG5cblx0XHRcdGlmICggd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZCkucG9zaXRpb24gPT0gXCJhYnNvbHV0ZVwiIClcblx0XHRcdFx0Ym9vbCA9IHRydWU7XG5cblx0XHRcdF9wcm9wZXJ0eUNhY2hlLm1lZGlhUXVlcmllc1N1cHBvcnRlZCA9IGJvb2w7XG5cblx0XHRcdHJldHVybiBib29sO1xuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQ7XG5cdH07IFxuXG5cdGV4cG9ydHMuY292ZXJCYWNrZ3JvdW5kU3VwcG9ydGVkID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoIV9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCl7XG5cdFx0XHR2YXIgcmVzdWx0ID0gKCdiYWNrZ3JvdW5kU2l6ZScgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKTtcblx0XHRcdF9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCA9IHJlc3VsdDtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIF9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZDtcblx0fTtcblx0XG5cblx0Ly8gVVRJTElUSUVTXG5cblx0ZXhwb3J0cy5tYXBfcmFuZ2UgPSBmdW5jdGlvbih2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSB7XG5cdCAgICByZXR1cm4gKGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSkpLnRvRml4ZWQoMik7XG5cdH1cblxuXHRleHBvcnRzLnJhbmRvbUludCA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG5cdCAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcblx0fVxuXG5cdGV4cG9ydHMuc2Nyb2xsVG9IZXJlID0gZnVuY3Rpb24od2hlcmUsIGV4dHJhKXtcblx0XHRpZiAoIWV4dHJhKSBleHRyYSA9IDA7XG5cdFx0XG5cdFx0dmFyIHRhcmdldCA9ICQod2hlcmUpLm9mZnNldCgpLnRvcDtcblxuXHRcdC8vIGRlZmluZSBob3cgbGFyZ2UgeW91ciBzdGlja3kgaGVhZGVyIGlzIGhlcmUhXG5cdFx0aWYgKHdpbmRvdy5tZWRpYVF1ZXJ5LmdldFF1ZXJ5KCkgPT09ICdtb2JpbGUnKSB0YXJnZXQgLT0gNTU7XG5cblx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0ICsgZXh0cmFcblx0XHR9LCA1MDApO1xuXHR9OyBcblxuXHRleHBvcnRzLnBhZ2VTZXR1cCA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgc3Vic2NyaWJlcnMgPSBbXSxcblx0XHRcdGlzU2V0VXAgPSBmYWxzZTtcblxuXHRcdGZ1bmN0aW9uIG9rYXlnbygpe1xuXHRcdFx0Zm9yICh2YXIgbWV0aG9kIGluIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdHN1YnNjcmliZXJzW21ldGhvZF0oKTtcblx0XHRcdH1cblx0XHRcdGlzU2V0VXAgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN1YnNjcmliZShtZXRob2QpIHtcblx0XHRcdHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcblxuXHRcdFx0aXNTZXRVcCAmJiBva2F5Z28oKTtcblx0XHR9XG5cblx0XHQvLyBSZXR1cm5hbCAgXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHJldHVybiB7XG5cdFx0XHRva2F5Z286IG9rYXlnbyxcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlXG5cdFx0fTtcblx0fSkoKTsgXG5cblx0ZXhwb3J0cy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHRcdHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRpbWVzdGFtcDtcblxuXHRcdFx0aWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0aWYgKCFpbW1lZGlhdGUpIHtcblx0XHRcdFx0XHRyZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0XHRcdGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnRleHQgPSB0aGlzO1xuXHRcdFx0YXJncyA9IGFyZ3VtZW50cztcblx0XHRcdHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0dmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG5cdFx0XHRpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblx0XHRcdGlmIChjYWxsTm93KSB7XG5cdFx0XHRcdHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHRcdGNvbnRleHQgPSBhcmdzID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHR9OyBcblxuXHRleHBvcnRzLm1lZGlhUXVlcnkgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN1YnNjcmliZXJzID0gW10sXG5cdFx0XHRtZWRpYUN1cnJlbnQsXG5cdFx0XHRtZWRpYVByZXYsXG5cdFx0XHQkd2luZG93ID0gJCh3aW5kb3cpLFxuXHRcdFx0JGh0bWwgPSAkKCdodG1sJyk7XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGUoKXtcblx0XHRcdHZhciBpbm5lcldpZHRoID0gJHdpbmRvdy5pbm5lcldpZHRoKCksXG5cdFx0XHRcdGlubmVySGVpZ2h0ID0gJHdpbmRvdy5pbm5lckhlaWdodCgpO1xuXG5cdFx0XHRpZiAoIGlubmVyV2lkdGggPCA3NjggKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ21vYmlsZSdcblx0XHRcdGVsc2UgaWYgKCAoIGlubmVyV2lkdGggPj0gNzY4KSAmJiAoIGlubmVyV2lkdGggPCA5OTIgKSApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAndGFibGV0J1xuXHRcdFx0ZWxzZSBpZiAoICggaW5uZXJXaWR0aCA+PSA5OTIgKSAmJiAoIGlubmVyV2lkdGggPCAxMjAwICkgKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ2Rlc2t0b3AnXG5cdFx0XHRlbHNlIGlmICggaW5uZXJXaWR0aCA+PSAxMjAwICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdsYXJnZV9kZXNrdG9wJ1xuXG5cdFx0XHRpZiAoIGlubmVySGVpZ2h0IDwgNzQwIClcblx0XHRcdFx0bWVkaWFDdXJyZW50ICs9ICcgc2hvcnQnXG5cblx0XHRcdGlmICggbWVkaWFDdXJyZW50ICE9PSBtZWRpYVByZXYgKXtcblx0XHRcdFx0Zm9yICh2YXIgbWV0aG9kIGluIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdFx0c3Vic2NyaWJlcnNbbWV0aG9kXShtZWRpYUN1cnJlbnQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFleHBvcnRzLm1lZGlhUXVlcmllc1N1cHBvcnRlZCgpKVxuXHRcdFx0XHRcdCRodG1sLnJlbW92ZUNsYXNzKG1lZGlhUHJldikuYWRkQ2xhc3MobWVkaWFDdXJyZW50KTtcblx0XHRcdH1cblxuXHRcdFx0bWVkaWFQcmV2ID0gbWVkaWFDdXJyZW50OyBcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFF1ZXJ5KCl7XG5cdFx0XHRyZXR1cm4gbWVkaWFDdXJyZW50O1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBpcyhxdWVyeSl7XG5cdFx0XHRyZXR1cm4gbWVkaWFDdXJyZW50LmluZGV4T2YocXVlcnkpID49IDA7XG5cdFx0fTtcblxuXHRcdHZhciBjYWxjdWxhdGVEZWJvdW5jZSA9IGV4cG9ydHMuZGVib3VuY2UoY2FsY3VsYXRlLCAyMDApOyBcblxuXHRcdCR3aW5kb3cucmVzaXplKGNhbGN1bGF0ZURlYm91bmNlKTtcblxuXHRcdC8vIGNhbGN1bGF0ZSgpO1xuXHRcdFxuXHRcdC8vICR3aW5kb3cubG9hZChjYWxjdWxhdGUpO1xuXG5cdFx0Ly8gZXhwb3J0cy5wYWdlU2V0dXAuc3Vic2NyaWJlKGNhbGN1bGF0ZSk7XG5cblx0XHQvLyBSZXR1cm5hbFxuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3Vic2NyaWJlOiBzdWJzY3JpYmUsXG5cdFx0XHRnZXRRdWVyeTogZ2V0UXVlcnksXG5cdFx0XHRpczogaXNcblx0XHR9O1xuXHR9KSgpOyBcblxuXHRleHBvcnRzLmdNYXBMb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBWYXJpYWJsZXNcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXG5cdFx0Ly8gTG9hZCBHb29nbGUgTWFwc1xuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0Z01hcFNldHVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdFx0c2NyaXB0LnNyYyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanM/dj0zLmV4cCYnICsgJ2NhbGxiYWNrPSQkXy5nTWFwTG9hZGVyLnJlYWR5Jztcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiByZWFkeSgpIHtcblx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRzdWJzY3JpYmVyc1ttZXRob2RdKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YnNjcmliZShtZXRob2QpIHtcblx0XHRcdHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcblx0XHR9O1xuXG5cdFx0Ly8gJCh3aW5kb3cpLmxvYWQoZ01hcFNldHVwKVxuXG5cdFx0Ly8gUmV0dXJuYWxcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlYWR5OiByZWFkeSxcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlXG5cdFx0fTtcblx0fSkoKTtcblxuXHRleHBvcnRzLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHR2YXIgdXVpZCA9ICd4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG5cdFx0XHR2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuXHRcdFx0ZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuXHRcdFx0cmV0dXJuIChjID09ICd4JyA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKDE2KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdXVpZDtcblx0fTtcblxuXG59KTsiXX0=
