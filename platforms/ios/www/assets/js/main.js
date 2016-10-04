(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Vendor files
// var $ = window.jQuery = window.$ = require('./vendor/jquery-1.11.1.min');

var $$_ = window.$$_ = require('./shared/core'); 

var helloCtrl = require('./modules/helloCtrl'),
	portalCtrl = require('./modules/portalCtrl'),
	infoCtrl = require('./modules/infoCtrl'),
	noteCtrl = require('./modules/noteCtrl'),
	textCtrl = require('./modules/textCtrl'),
	changeCtrl = require('./modules/changeCtrl'),
	historyCtrl = require('./modules/historyCtrl'),
	boardCtrl = require('./modules/boardCtrl'), 
	listCtrl = require('./modules/listCtrl'),
	shareCtrl = require('./modules/shareCtrl'),
	colophonCtrl = require('./modules/colophonCtrl');

var $body = $('#ng-app')

window._Firebase = new Firebase( 'https://lick.firebaseio.com' );
window.listLookingAt = 'notes';
window.directions = ['north', 'east', 'south', 'west'];
window.loggedIn = false;
window.loggingIn = false;
window.isMobileApp = false;
window.historical = [];
window.unbinding = [];

window.emailEscaper = function(email){
	return email.replace(/[ .]/g, "_");
};

window.emailUnescaper = function(email){
	return email.replace(/[_]/g, ".");
};

window.getObjectSize = function(obj) {
    var size = 0, 
    key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

window.getObjectDeepSize = function(obj) {
    var size = 0, 
    	key;
    for (key in obj) {
        if (
        	typeof(obj[key]) === 'object' 
        	&& key.indexOf('$') < 0
    	) size++;
    }
    return size;
};

window.is_touch_device = function() {
	return 'ontouchstart' in window || 'onmsgesturechange' in window;
};

window.unbindAll = function(){
	for (var method in window.unbinding){
		window.unbinding[method]();
	}
};

if (window.is_touch_device()) $body.addClass('touchy')

if (navigator.userAgent.indexOf('iPad') > -1){
	$('html').addClass('iPad')
}else if (navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPod') > -1){
	$('html').addClass('iPhone')
}


document.addEventListener('deviceReady', deviceReady, false);

if (	
	(document.URL.indexOf( 'http://' ) === -1) &&
	(document.URL.indexOf( 'https://' ) === -1)
){
	window.isMobileApp = true;
	$body.addClass('phoneGap');	
}

function deviceReady(){
	App.initialize();
	StatusBar.hide();
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
		'slickCarousel'
	]
);

app.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		if (error === "AUTH_REQUIRED") { 
			$location.path('/portal');
		}
	});
}]);

app.config( function($routeProvider) {
    $routeProvider

        // route for simply typing in the address
        .when('/', {
            templateUrl : 'assets/inc/hello.html',
            controller  : 'helloCtrl',
        })

        // route for the login / portal page
        .when('/portal', {
            templateUrl : 'assets/inc/portal.html',
            controller  : 'portalCtrl',
        })

        // route for the info page
        .when('/info', {
            templateUrl : 'assets/inc/info.html',
            controller  : 'infoCtrl',
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

        // route for text
        .when('/text/:id', {
            templateUrl : 'assets/inc/text.html',
            controller  : 'textCtrl'
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

        // route for history
        .when('/history', { 
			templateUrl : 'assets/inc/history.html',
			controller  : 'historyCtrl'
        })

        // route for share
        .when('/share/:id', { 
			templateUrl : 'assets/inc/share.html',
			controller  : 'shareCtrl'
        })

        // route for list
        .when('/colophon', { 
			templateUrl : 'assets/inc/colophon.html',
			controller  : 'colophonCtrl'
        });
})
.run( function($rootScope, $location, $cookies, Login, $route, $timeout, $animate) {
	$rootScope.$on( '$routeChangeStart', function(event, next, current) {

		window.historical.push($location.path());

		window.localStorage.historical_last = $location.path();

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

			if ($location.path() === '/')
				$location.path('/list');

			return true;
		}
		else{
			if ( 
				(!window.localStorage.email && !window.localStorage.pass) &&
				next.templateUrl !== 'assets/inc/colophon.html'
			){	
				console.log('no stored login, goto start')
				$location.path('/portal')
				$timeout(function () {
					$body.addClass('ready');
				});
			}
			else if ( 
				($cookies.email && $cookies.pass) || 
				(window.localStorage.email && window.localStorage.pass)
			){
				console.log('stored login found, logging in')

				var loginEmail = $cookies.email || window.localStorage.email,
					loginPass = $cookies.pass || window.localStorage.pass;

				Login(loginEmail, loginPass, function(){
					if (next.templateUrl === 'assets/inc/portal.html'){
						$body.addClass('ready');

						if (window.localStorage.historical_last)
							$location.path(window.localStorage.historical_last);
						else
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

app.factory("Login", ['$rootScope', "$firebaseAuth", "$cookies", '$timeout', 'Auth', '$location', 'Notes',
	function($rootScope, $firebaseAuth, $cookies, $timeout, Auth, $location, Notes) {
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

					window.localStorage.email = $cookies.email = theEmail;
					window.localStorage.email_escaped = $cookies.email_escaped = window.emailEscaper(theEmail);
					window.localStorage.pass = $cookies.pass = thePass;

					window.localStorage.uid = window.uid = authData.uid;

					window.loggedIn = true;

					if(
						(navigator.userAgent.match(/iPhone/i)) || 
						(navigator.userAgent.match(/iPod/i)) ||
						(navigator.userAgent.match(/Android/i))
					) {
						window.device = 'Mobile';
					}else{
						window.device = 'Desktop';
					}

					if (typeof(callback) === 'function'){
						$timeout(function () {
							callback();
						});
					}

					//UPDATE

					ref = window._Firebase.child(window.uid + '/meta');
					ref.once('value', function(snapshot) {

						if (!snapshot.exists()){
							ref.set({
								user: {
									email_escaped: $cookies.email_escaped,
									uid: window.uid
								}
							})
						}
					});

				}).catch(function(error) {
					if (typeof(errorCallback) === 'function'){
						errorCallback();
					}

					window.loggingIn = false;
					$location.path('/portal');
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

app.factory("Logout", ["$firebaseAuth", "$cookies", 'Auth', '$location', '$timeout', 
	function($firebaseAuth, $cookies, Auth, $location, $timeout) {
		return function(){

			window.loggedIn = false;

			$timeout(function () {
				Auth.$unauth();
				$cookies.email = '';
				$cookies.pass = '';
				window.localStorage.email = '';
				window.localStorage.pass = '';
				window.uid = '';

				$location.path('/portal');
			});

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

app.factory('Meta', ['$firebaseObject',
	function($firebaseObject) {
		return function() {
			var ref = window._Firebase.child(window.uid + '/meta');
			return $firebaseObject(ref);
		};
	}
]);

app.factory('historyCount',
	function() {
		return function(callback) {
			var ref = window._Firebase.child(window.uid + '/meta/history'),
				count = 0;

			ref.once("value", function(snapshot) {

				snapshot.forEach(function(childSnapshot) {
					var childData = childSnapshot.val();

					if (
						( childData.device !== window.device ) || 
						( childData.time < ( Date.now() - 3600000 ) )
					){
						count++;
					}
				});

				callback(count)
			})
		};
	}
);

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

app.factory('firstNote', ['newBit', '$cookies',
	function(newBit, $cookies) {
		return function(parent, id) {
			var ref = window._Firebase.child(window.uid + '/meta/user');

			ref.set({
				email_escaped: $cookies.email_escaped,
				uid: window.uid
			})

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

			console.log(arguments)
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
				list: true,
				x: 0,
				y: 0,
				lastEdited: Date.now()
			});

			return noteID;
		};
	}
]);

app.factory('shareNote', ['$firebaseObject', 'Meta', 'Note', 'Notes', '$cookies', '$location',
	function($firebaseObject, Meta, Note, Notes, $cookies, $location) {
		return function(id, target, callback) {

			console.log(arguments)

			var metaRef = window._Firebase.child(window.uid + '/meta/sharedUsers/').push(target);

			var transaction = Note(id).$loaded().then(function(privateNote) {
				console.log(privateNote)
				var sharing = {};
				if (privateNote.parent){
					sharing[$cookies.email_escaped] = {
						uid: window.uid,
						parent: privateNote.parent,
						x: privateNote.x,
						y: privateNote.y
					}
				}else{
					sharing[$cookies.email_escaped] = { 
						parent: false,
						uid: window.uid,
					}
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

				callback();
			});
		};
	}
]);

app.factory('addToSharedNote', ['$firebaseObject', 'Meta', 'Note', '$cookies', '$location',
	function($firebaseObject, Meta, Note, $cookies, $location) {
		return function(id, target, callback) {

			var metaRef = window._Firebase.child(window.uid + '/meta/sharedUsers/').push(target);

			var participantRef = window._Firebase.child('_shared/' + id + '/participants/' + emailEscaper(target));

			console.log(participantRef)

			participantRef.set({
				parent: false
			}, callback)
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

			console.log(id);

			sharednote = sharedNote(id);
			sharednote.$remove();
		};
	}
]);

app.factory('newBoard', ['newNote',
	function(newNote) {
		return function() {
			boardID = $$_.randomize();

			//BOARDS
			var boardRef = window._Firebase.child(window.uid + '/boards/' + boardID );
			boardRef.set({
				title: '',
				id: boardID,
				starred: null,
				lastEdited: Date.now(),
				notes:[]
			});

			newNote(boardID);

			return boardID;
		};
	}
]);

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

app.controller('helloCtrl', 
	[
		'$scope',
		'$timeout',
		helloCtrl
	]
);

app.controller('portalCtrl', 
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
		portalCtrl
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
		'Meta',
		'historyCount',
		noteCtrl
	]
);

app.controller('infoCtrl', 
	[
		'$scope',
		'hotkeys',
		'$timeout',
		infoCtrl
	]
);

app.controller('textCtrl', 
	[
		'$scope',
		'$routeParams',
		'Note',
		'sharedNote', 
		'hotkeys',
		'$location',
		'$timeout',
		textCtrl
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

app.controller('historyCtrl', 
	[
		'$rootScope', 
		'$scope',
		'newBoard',
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$window',
		'$cookies',
		'Meta',
		historyCtrl
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
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$interval',
		'$cookies',
		'Logout',
		'concentricity',
		'historyCount',
		boardCtrl
	]
);

app.controller('listCtrl', 
	[
		'$scope', 
		'Notes',
		'SharedNotes',
		'newNote',
		'killNote',
		'Boards',
		'newBoard',
		'$route',
		'hotkeys',
		'$location',
		'$cookies',
		'$timeout',
		'Logout',
		'concentricity',
		'historyCount',
		listCtrl
	]
);

app.controller('shareCtrl', 
	[
		'$scope',
		'hotkeys',
		'Meta',
		'Note',
		'sharedNote',
		'shareNote',
		'addToSharedNote',
		'$routeParams', 
		'$timeout',
		'$location',
		shareCtrl
	]
);

app.controller('colophonCtrl', 
	[
		'$rootScope', 
		'$scope', 
		'hotkeys',
		'$timeout',
		colophonCtrl
	]
);















},{"./modules/boardCtrl":2,"./modules/changeCtrl":3,"./modules/colophonCtrl":4,"./modules/helloCtrl":5,"./modules/historyCtrl":6,"./modules/infoCtrl":7,"./modules/listCtrl":8,"./modules/noteCtrl":9,"./modules/portalCtrl":10,"./modules/shareCtrl":11,"./modules/textCtrl":12,"./shared/core":13}],2:[function(require,module,exports){
module.exports = function(
	$rootScope, 
	$scope, 
	Board,
	newBoard,
	killBoard,
	Notes,
	SharedNotes,
	newNote,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location,
	$interval,
	$cookies,
	Logout,
	concentricity,
	historyCount
) {
	$timeout(function() {
		$scope.$digest();
	})

    $scope.pageClass = 'board';

    $scope.$on('$destroy', window.unbindAll)

	Board($routeParams.id).$bindTo($scope, 'board')
		.then(function(unbinder){

			window.unbinding.push(unbinder)

			$timeout(function() {
				if ($scope.board.starred)
					$scope.starNote($scope.board.starred)
				
				if ($scope.board.title === '')
					$('.board_title textarea').focus()
				
				if (!$scope.board.lastEdited)
					$scope.board.lastEdited = Date.now()
			})
		});

	Notes($routeParams.id).$bindTo($scope, 'notes')
		.then(function(unbinder){

			window.unbinding.push(unbinder)

			$timeout(function() {
				if ($scope.board.starred)
					$scope.starNote($scope.board.starred)
			})
		});

	SharedNotes($routeParams.id).$bindTo($scope, 'sharednotes')
		.then(function(unbinder) {

			window.unbinding.push(unbinder)

			sharedGenerator(
				$scope.sharednotes, 
				window.getObjectDeepSize($scope.sharednotes), 
				function(sharedNotes){
					$scope.sharedFilter = sharedNotes;
				}
			)

		});

	sharedGenerator = function(notes, count, callback){

		var shared = {},
			sharedCounter = 0;

		angular.forEach(notes, function(e, k){
			if (typeof(e) === 'object' && !!e){
				angular.forEach(e.participants, function(f, l){
					if (
						(l == window.uid || l == $cookies.email_escaped) 
						&& (e.participants[$cookies.email_escaped].parent === $routeParams.id)
					){
						shared[k] = e;
					}
				})

				sharedCounter++;
				if (sharedCounter === count && !$.isEmptyObject(shared))
					callback(shared)
			}
		})
	}


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
		.add({
			combo: 'enter',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				event.preventDefault();
				newNote($scope.board.id);
			}
		})



	$scope.newNote = function(boardID){
		$location.path('/note/' + newNote(boardID));
		$scope.closeMenu();
	};

	$scope.newBoard = function(){
		$location.path('/board/' + newBoard());
		$scope.closeMenu();
	};

	$scope.historical = _.debounce(function(){
		$scope.board.lastEdited = Date.now();

		$timeout(function() {
			$scope.$digest();
		})

		console.log('HISTORICAL')
	}, 5000)

	$scope.starNote = function(id) {
		console.log(id)

		$('.board_note').each(function(){
			var $that = $(this)

			if (id && id === $that.attr('data-id')){
				$that.addClass('starred')
			}else{
				$that.removeClass('starred')
			}

		})

		$scope.board.starred = id;
	}

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
	    row: window.innerWidth < 768 ? 'note.y * 2' : 'note.y',
	    col: 'note.x'
	};

	$scope.boardItemOpts_shared = {
	    sizeX: '1',
	    sizeY: window.innerWidth < 768 ? 2 : 1,
	    row: window.innerWidth < 768 ? 'note.participants["' + $cookies.email_escaped + '"].y * 2' : 'note.participants["' + $cookies.email_escaped + '"].y',
	    col: 'note.participants["' + $cookies.email_escaped + '"].x'
	};

	$scope.boardGridOpts = {
	    columns: 4,
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
			// handle: window.innerWidth < 768 ? '.grabber' : null
			handle: '.grabber'
		}
	};

	historyCount(function(theNumber){
		$scope.historyCounter = function(){
			return theNumber;
		}
	})

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
		
	$timeout(function() {
		$scope.$digest();
	})

	$scope.$on('$destroy', window.unbindAll)

	Boards().$bindTo($scope, 'boards');

	if (window.historical[window.historical.length - 2].indexOf('shared') > 0){
		console.log('SHARED')
		sharedNote($routeParams.id).$bindTo($scope, 'note')
		.then(function(unbinder){
			window.unbinding.push(unbinder)
		})
	}else{
		console.log('PRIVATE')
		Note($routeParams.id).$bindTo($scope, 'note')
		.then(function(unbinder){
			window.unbinding.push(unbinder)
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
	hotkeys,
	$timeout
) {

	$timeout(function() {
		$scope.$digest();
	})
	
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
	$scope,
	$timeout
) {
	$timeout(function() {
		$scope.$digest();
	})
	
	$scope.pageClass = 'hello';
}
},{}],6:[function(require,module,exports){
module.exports = function(
	$rootScope,
	$scope,
	newBoard,
	$route,
	hotkeys,
	$timeout,
	$location,
	$window,
	$cookies,
	Meta
) {

	$timeout(function() {
		$scope.$digest();
	})
	
	Meta().$bindTo($scope, 'meta')
		.then(function(unbinder){
			window.unbinding.push(unbinder)
		})

    $scope.pageClass = 'history';

    $scope.$on('$destroy', window.unbindAll)

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

	$scope.editedOn = function(time){
		var incoming = moment(time);
		return incoming.format('H:m ddd Do MMMM')
	}

	historyCount = 0;

	$scope.historyCompare = function(device, time){
		if (
			(device !== window.device) || 
			( time < ( Date.now() - 3600000 ) )
		){
			historyCount++;
			return true;
		}else return false;
	}

	$scope.editedBy = function(author){
		return window.emailUnescaper(author);
	}

	$scope.clearHistory = function(){
		$scope.meta.history = {};
	}

	$scope.goBack = function(){
		// if ($scope.meta.history.length)
		if (historyCount === 0)
			$location.path('/list')
		else
			window.history.back();
	}
};










},{}],7:[function(require,module,exports){
module.exports = function(
	$scope, 
	hotkeys,
	$timeout
) {

	$timeout(function() {
		$scope.$digest();
	})
	
	$scope.pageClass = 'info';

	hotkeys.bindTo($scope)
		.add({
			combo: 'esc',
			description: 'Go back to List',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				window.history.back();
			}
		});

	$scope.slideCount = 0;

	$info = $('.info');

	$scope.slickConfig = {
		enabled: true,
		dots: true,
		infinite: false,
		event: {
			afterChange: function (event, slick, currentSlide, nextSlide) {
				$info.removeClass('firstSlide lastSlide')
				if (currentSlide === 0){
					$info.addClass('firstSlide')
				}else if (currentSlide === ($scope.slideCount - 1)){
					$info.addClass('lastSlide')
				}
			},
			init: function(slick){
				$scope.slideCount = $('.slick-slider .slick-slide').length
			}
		}
	};

	$scope.goBack = function(){
		window.history.back();
	}
}
},{}],8:[function(require,module,exports){
module.exports = function(
	$scope, 
	Notes,
	SharedNotes,
	newNote,
	killNote,
	Boards,
	newBoard,
	$route, 
	hotkeys,
	$location,
	$cookies,
	$timeout,
	Logout,
	concentricity,
	historyCount
) {
	$timeout(function() {
		$scope.$digest();
	})

    $scope.pageClass = 'list';

    $scope.$on('$destroy', window.unbindAll)

	Notes().$bindTo($scope, 'notes').then(function(unbinder) {

		window.unbinding.push(unbinder)

		$scope.privateFilter = function(t){

			var notes = []

			angular.forEach(t, function(e, k){
				if (typeof(e) === 'object' && !!e){	
					if (!e.lastEdited) e.lastEdited = Date.now();
					notes.push(e)
				}
			});

			return notes;
		}
	})

	Boards().$bindTo($scope, 'boards')
		.then(function(unbinder){

			window.unbinding.push(unbinder)

			$scope.boardsFilter = function(t){
				var boards = []

				angular.forEach($scope.boards, function(e, k){
					if (typeof(e) === 'object' && !!e){	
						if (!e.lastEdited) e.lastEdited = Date.now();
						boards.push(e)
					}
				});

				return boards;
			}
		});

	SharedNotes().$bindTo($scope, 'sharednotes')
		.then(function(unbinder) {

			window.unbinding.push(unbinder)

			$scope.sharedFilter = function(e){

				var shared = [];

				angular.forEach(e, function(e, k){
					if (typeof(e) === 'object' && !!e){
						if (!e.lastEdited) e.lastEdited = Date.now();

						angular.forEach(e.participants, function(f, l){
							if (
								(l == window.uid || l == $cookies.email_escaped) 
								&& (!e.participants[$cookies.email_escaped].parent)
							){
								shared.push(e);
							}
						})
					}
				});

				$scope.sharedCount = shared.length;

				return shared;
			}
		});

	hotkeys.bindTo($scope)
		.add({
			combo: ['esc', 'tab', 'right', 'left'],
			callback: function(event, hotkey) {
				if ($scope.lookingAt === 'boards')
					$scope.lookingAt = window.listLookingAt = 'notes';
				else
					$scope.lookingAt = window.listLookingAt = 'boards';
				event.preventDefault();
			}
		})

    $scope.concentric = function(){
    	concentricity();
    };

	if (window.historical.length > 2 && window.historical[window.historical.length - 2].indexOf('board') > 0)
		$scope.lookingAt = window.listLookingAt = 'boards';

	$scope.lookingAt = window.listLookingAt;

	$scope.$watch('lookingAt', function(){
		$('body').scrollTop(0)
		window.listLookingAt = $scope.lookingAt;
	});

	historyCount(function(theNumber){
		$scope.historyCounter = function(){
			return theNumber;
		}
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
},{}],9:[function(require,module,exports){
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
	Meta,
	historyCount
) {

	$scope.touchy = function(){
		return window.is_touch_device();
	}

	$timeout(function() {
		$scope.$digest();
	})
	
	var showingCheatsheet = false;
	
	$scope.commandIsPressed = false;
	$scope.altIsPressed = false;
	$scope.selectedBits = false;
    $scope.sharePrompt = false;
    $scope.pageClass = 'note';

    $scope.filtered = false;

    $scope.$on('$destroy', window.unbindAll)

    var keysUp = function(){
		$scope.commandIsPressed = false;
		$scope.altIsPressed = false;
		$scope.$digest();
    }

    $(window).on({
    	blur: keysUp,
    	focus: keysUp
    });

    $scope.concentric = function(){
    	concentricity();
    };

    if ($location.path().indexOf('shared') > 0){

    	sharedNote($routeParams.id).$bindTo($scope, 'note')
			.then(function(unbinder) {
				window.unbinding.push(unbinder)
				$scope.onNoteOpen();
			});

    }else{
		Note($routeParams.id).$bindTo($scope, 'note')
			.then(function(unbinder) {
				window.unbinding.push(unbinder)

				if (typeof($scope.note.body) === 'undefined'){
					newNote('', $routeParams.id);
				}
				$scope.onNoteOpen();
			});
    }

    $scope.onNoteOpen = function(){
    	$scope.closeBitMenus();
    	$scope.unselector();
    	$scope.note.kill = false;

    	if ($scope.note.title === '')
    		$('.note_title textarea').focus()
    }

    Meta().$bindTo($scope, 'meta')
    	.then(function(unbinder){
			window.unbinding.push(unbinder)
    	})

    $scope.shareActive = function(){
    	if ($location.path().indexOf('shared') > 0)
    		return true
    	else return false;
    }



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
			combo: ['command', 'ctrl'],
			description: 'Hold down to select bits',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				$scope.commandIsPressed = true;
			}
		})
		.add({
			combo: ['command', 'ctrl'],
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

					$scope.unselector();
					event.preventDefault();

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
			combo: ['tab', 'command+]', 'ctrl+]'],
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
			combo: ['shift+tab', 'command+[', 'ctrl+['],
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
			combo: ['command+shift+d', 'ctrl+shift+d'],
			// description: 'Duplicate currently selected bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea()){
					if (_isBit()){
						event.preventDefault();
						$scope.addBit( _bitIndex(), $scope.note.body[_bitIndex()].content );
					}
				}
			}
		})
		.add({
			combo: ['up', 'down'],
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea()){
					// console.log(event)
					$scope.unselector();
					$scope.caretTracker(_bitIndex(), function(){
						$scope.jumpAround(_bitIndex(), event.keyIdentifier, false);
					})
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
				$scope.selectedBits = true;
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
				$scope.selectedBits = true;
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
				if ( !_isTextSelected($(event.target)[0]) ){
					$scope.note.body[_bitIndex()].selected = true;
					$scope.cut(true);
				}
			}
		})
		.add({
			combo: ['command+c', 'ctrl+c'],
			description: 'Copy selected bits',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( !_isTextSelected($(event.target)[0]) ){
					$scope.note.body[_bitIndex()].selected = true;
					$scope.cut(false);
				}
			}
		})
		.add({
			combo: ['command+v', 'ctrl+v'],
			description: 'Paste cut bits (or just paste the contents of your clipboard)',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				console.log(window.clipboarded)
				if (window.clipboarded){
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
					// $scope.unselector();
					if ($scope.selectedBits){
						angular.forEach($scope.note.body, function(e, k){
							if (e.selected)
								$scope.mark(k);
						})
					}else{
						$scope.mark(_bitIndex())
						// $scope.note.body[_bitIndex()].mark = !$scope.note.body[_bitIndex()].mark;
					}
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
				if ($scope.selectedBits){
					$scope.unselector();
				}
				else if (showingCheatsheet){
					showingCheatsheet = false;
					hotkeys.toggleCheatSheet();
				// }else if ($scope.sharePrompt){
				// 	$scope.sharePrompt = false;					
				}else
					$scope.closeNote();
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

	$scope.openLink = function(bit, event){
		if (bit.isLink && !$scope.altIsPressed){
			var win;
			document.activeElement.blur();

			if (window.isMobileApp){
				win = cordova.InAppBrowser.open(bit.address, '_system');
			}else{
				win = window.open(bit.address, '_blank');
				win.focus();
			}
		}
	}

	$scope.killBit = function(index){

		if (index)
			$scope.note.body[index].selected = true;

		var tempBody = [];
		angular.copy($scope.note.body, tempBody);

		angular.forEach(tempBody.reverse(), function(e, k){
			if (e.selected){
				var reverseTarget = Math.abs(tempBody.length - k) - 1;

				$timeout(function(){
					$scope.note.body.splice(reverseTarget, 1);
					$scope.$digest();
				});
			}
		});

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
			_focusMe(index - 1);
		}

		if (window.innerWidth < 768)
			$scope.note.body[index].menu_open = false;
	}

	$scope.tabIn = function(index){
		if ($scope.note.body[index].tabCount < 3){
			$scope.note.body[index].tabCount++;
		}else{
			_focusMe(index + 1);
		}

		if (window.innerWidth < 768)
			$scope.note.body[index].menu_open = false;
	}

	$scope.caretTracker = function(index, callback){
		var theBit = document.activeElement,
			currentCaret = theBit.selectionStart,
			theValue = theBit.value;

		$scope.note.body[index].contentCaret = 
			theValue.substring(0, currentCaret) + 
			'<span class="hiddenCaret"></span>' + 
			theValue.substring(currentCaret, theValue.length)

		$timeout(function() {
			$scope.$digest();
			if (typeof callback !== 'undefined') callback();
		})
	}

	$scope.autoSizer = function(index, event, content){
		if (event.keyCode !== 13){
			$scope.note.body[index].contentCaret = content;
		}
	}

	$scope.historical = _.debounce(function(){
		if (!$scope.meta.history)
			$scope.meta.history = {};

		var now = Date.now();

		$scope.note.lastEdited = now;

		var historicalMarker = {
			title: $scope.note.title,		
			device: window.device,
			time: now,
			seen: false,
			shared: $scope.shareActive(),
			editor: $cookies.email_escaped,
			uid: window.uid
		}

		if ($scope.shareActive()){
			angular.forEach($scope.note.participants, function(v, k){
				var ref = window._Firebase.child(v.uid + '/meta/history/' + $scope.note.id);
				ref.set(historicalMarker)
			});
		}else{
			$scope.meta.history[$scope.note.id] = historicalMarker;
		}

		if ($scope.note.parent){
			var ref = window._Firebase.child(window.uid + '/boards/' + $scope.note.parent + '/lastEdited');
			ref.set(now)
		}else if ($scope.note.participants && $scope.note.participants[window.localStorage.email_escaped].parent){
			var ref = window._Firebase.child('_shared/' + $scope.note.id + '/participants/' + window.localStorage.email_escaped + '/lastEdited');
			ref.set(now)
		}

		$timeout(function() {
			$scope.$digest();
		})

		console.log('HISTORICAL')
	}, 5000)


	$scope.jumpAround = function(index, key, justgo){
		// console.log(index, key, justgo)
		var $theBit = $(document.activeElement),
			$theCaret = $theBit.siblings('.textarea-autosize').find('.hiddenCaret'),
			theCaretPos = $theCaret.position().top,
			theCaretHeight = 27;

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
				(theCaretPos >= ($theCaret.parent().height() - (theCaretHeight))) 
			)||(
				(key === 'Down') && 
				justgo
			)
		){
			$theBit.parents('.note_bit')
				.next('.note_bit').find('textarea')
				.focus()
		}

		if (
			(key === 'Down') &&
			(index === $scope.note.body.length - 1)
		){
			$scope.addBit(index);
		}
	};

	$scope.mark = function(index, optional){
		// console.log(index, $scope.note.body[index].mark, $scope.note.body[index].menu_open, optional)

		if ((optional && window.innerWidth < 768) || !optional){
			$timeout(function(){
				$scope.note.body[index].mark = !$scope.note.body[index].mark;
				$scope.note.body[index].menu_open = false;
				$scope.$digest();
				// console.log(index, $scope.note.body[index].mark, $scope.note.body[index].menu_open)
			})
		}
	};

	$scope.search = function(content, indent, index){
		console.log(content, indent, index)
		if (indent > 0){
			query = $scope.note.body[index - 1].content + ' ' + content;
		}else{
			query = content;
		}

		var win = window.open('https://www.google.com/search?q=' + query, '_blank');
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
			e.menu_open = false;
		});
		$scope.selectedBits = false;
	};


	$scope.cut = function(kill){
		window.clipboard = [];

		angular.forEach($scope.note.body, function(e, k){
			if (e.selected){
				window.clipboard.push(e);
			}
		});

		if (kill)
			$scope.killBit();

		window.clipboarded = true; 
	};

	$scope.paste = function(){
		console.log(window.clipboard)
		angular.forEach(window.clipboard, function(e, k){
			$scope.note.body.splice((insertIndex + k) + 1, 0, e)
		});

		$scope.unselector();
		window.clipboard = [];
		window.clipboarded = false;
	};

	$scope.isFocused = function(decision){
		if (decision){
			$scope.focused = true;
		}else{
			$timeout(function(){
				$scope.focused = false;
			}, 50);
		}
	}

	$scope.swipe = function(index, direction){
		console.log($scope.noEdit)
		if ($scope.noEdit){
			$scope.mark(index, true);
		}
		else if (direction === 'left')
			$scope.tabOut(index);	
		else if (direction === 'right')
			$scope.tabIn(index);

	}


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

	$scope.closeNote = function(){
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
	};

	$scope.sharePrompter = function(direction){
		$scope.sharePrompt = direction;
	}

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
	},

	_isTextSelected = function(input){
		var startPos = input.selectionStart;
		var endPos = input.selectionEnd;
		var doc = document.selection;

		if(doc && doc.createRange().text.length != 0){
			return true;
		}else if (!doc && input.value.substring(startPos, endPos).length != 0){
			return true;
		}
		return false;
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

	historyCount(function(theNumber){
		$scope.historyCounter = function(){
			return theNumber;
		}
	})

	$scope.logout = function(){
		Logout();
	}
}
},{}],10:[function(require,module,exports){
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

	$timeout(function() {
		$scope.$digest();
	})
	
    $scope.auth = Auth;

    $scope.pageClass = 'portal';
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






},{}],11:[function(require,module,exports){
module.exports = function(
	$scope,
	hotkeys,
	Meta,
	Note,
	sharedNote,
	shareNote,
	addToSharedNote,
	$routeParams,
	$timeout,
	$location
) {

	$timeout(function() {
		$scope.$digest();
	})
	
    $scope.pageClass = 'share';

    $scope.$on('$destroy', window.unbindAll)

	Meta().$bindTo($scope, 'meta')
		.then(function(unbinder){
			window.unbinding.push(unbinder)
			sharedUserGenerator()
		})

	var sharedUserGeneratorGate,
		unbinder,
    	shareSource = function(){

    		if (typeof(unbinder) !== 'undefined')
    			unbinder();

    		if (!$scope.isShared){
				if (window.historical[window.historical.length - 2].indexOf('shared') > 0)
					$scope.isShared = true;
				else
					$scope.isShared = false;
    		}

			if ($scope.isShared){
				// sharedUserGeneratorGate = false;
				console.log('SHARED')
				sharedNote($routeParams.id).$bindTo($scope, 'note')
					.then(function(unbinder){
						window.unbinding.push(unbinder)
						$scope.returnAddress = '/sharednote/' + $scope.note.id;
						sharedUserGenerator(false);
					});
			}
			else{
				sharedUserGeneratorGate = true;
				console.log('PRIVAT')
				Note($routeParams.id).$bindTo($scope, 'note')
					.then(function(unbind){
						unbinder = unbind;
						window.unbinding.push(unbind)
						$scope.returnAddress = '/note/' + $scope.note.id;
						sharedUserGenerator(true);
					});
			}
		},

		sharedUserGenerator = function(alreadyShared){
			if (sharedUserGeneratorGate){

				participantsGenerator();

				var users = angular.copy($scope.meta.sharedUsers),
					uniqueUsers = _.uniq(users);

				if(alreadyShared)
					var participants = angular.copy($scope.meta.sharedUsers)

				angular.forEach(uniqueUsers, function(v, k){
					if (alreadyShared){
						angular.forEach(participants, function(vv, kk){
							if (window.emailUnescaper(kk) === v)
								delete uniqueUsers[k]
						})
					}

					if (v === window.localStorage.email)
						delete uniqueUsers[k]
				})

				$scope.sharedUserFilter = uniqueUsers;
			}

			sharedUserGeneratorGate = true;
		},

		participantsGenerator = function(){

			var _participants = angular.copy($scope.note.participants)

			angular.forEach(_participants, function(v, k){
				if (k === window.localStorage.email_escaped)
					delete _participants[k];
			})

			$scope.noteParticipants = _participants;

			$timeout(function() {
				$scope.$apply();
			})
		}

	shareSource();

	$scope.shareUser = function(target){
		if ($scope.isShared){
			addToSharedNote(
				$scope.note.id, 
				target,
				participantsGenerator
			);
		}else{
			shareNote(
				$scope.note.id, 
				target, 
				function(){
					$timeout(function(){
						$scope.isShared = true;
						shareSource();
					})
				}
			);
		}
	};

	$scope.removeUser = function(target){
		angular.forEach($scope.note.participants, function(v, k){
			console.log(v, k)
			if (target === k)
				delete $scope.note.participants[k];
		})

		participantsGenerator();
	}

	hotkeys.bindTo($scope) 
		.add({
			combo: 'esc',
			description: 'ah, forget it',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				$scope.goBack();
			}
		})
		.add({
			combo: 'enter',
			description: '',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				$scope.shareUser($scope.shareTarget);
			}
		});

	$scope.goBack = function(){
		$location.path($scope.returnAddress);
	}
};










},{}],12:[function(require,module,exports){
module.exports = function(
	$scope,
	$routeParams,
	Note,
	sharedNote,
	hotkeys,
	$location,
	$timeout
) { 

	$timeout(function() {
		$scope.$digest();
	})

	$scope.pageClass = 'text';

	$scope.$on('$destroy', window.unbindAll)

	if (window.historical[window.historical.length - 2].indexOf('shared') > 0)
		sharedNote($routeParams.id).$bindTo($scope, 'note');
	else
		Note($routeParams.id).$bindTo($scope, 'note');
	
	hotkeys.bindTo($scope)
		.add({
			combo: 'esc',
			callback: function(event, hotkey) {
				$scope.closeText();
				event.preventDefault();
			}
		})


	$scope.closeText = function(){
		$location.path(window.localStorage.historical_last);

		if (window.historical[window.historical.length - 2].indexOf('shared') > 0){
			$location.path('/sharednote/' + $routeParams.id);
		}else{
			$location.path('/note/' + $routeParams.id);
		}
	}
}
},{}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9tYWluLmpzIiwiLi4vanMvbW9kdWxlcy9ib2FyZEN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NoYW5nZUN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NvbG9waG9uQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaGVsbG9DdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9oaXN0b3J5Q3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaW5mb0N0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2xpc3RDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9ub3RlQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvcG9ydGFsQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvc2hhcmVDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy90ZXh0Q3RybC5qcyIsIi4uL2pzL3NoYXJlZC9jb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2g5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gVmVuZG9yIGZpbGVzXG4vLyB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9IHJlcXVpcmUoJy4vdmVuZG9yL2pxdWVyeS0xLjExLjEubWluJyk7XG5cbnZhciAkJF8gPSB3aW5kb3cuJCRfID0gcmVxdWlyZSgnLi9zaGFyZWQvY29yZScpOyBcblxudmFyIGhlbGxvQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9oZWxsb0N0cmwnKSxcblx0cG9ydGFsQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9wb3J0YWxDdHJsJyksXG5cdGluZm9DdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2luZm9DdHJsJyksXG5cdG5vdGVDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL25vdGVDdHJsJyksXG5cdHRleHRDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL3RleHRDdHJsJyksXG5cdGNoYW5nZUN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvY2hhbmdlQ3RybCcpLFxuXHRoaXN0b3J5Q3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9oaXN0b3J5Q3RybCcpLFxuXHRib2FyZEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvYm9hcmRDdHJsJyksIFxuXHRsaXN0Q3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9saXN0Q3RybCcpLFxuXHRzaGFyZUN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvc2hhcmVDdHJsJyksXG5cdGNvbG9waG9uQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9jb2xvcGhvbkN0cmwnKTtcblxudmFyICRib2R5ID0gJCgnI25nLWFwcCcpXG5cbndpbmRvdy5fRmlyZWJhc2UgPSBuZXcgRmlyZWJhc2UoICdodHRwczovL2xpY2suZmlyZWJhc2Vpby5jb20nICk7XG53aW5kb3cubGlzdExvb2tpbmdBdCA9ICdub3Rlcyc7XG53aW5kb3cuZGlyZWN0aW9ucyA9IFsnbm9ydGgnLCAnZWFzdCcsICdzb3V0aCcsICd3ZXN0J107XG53aW5kb3cubG9nZ2VkSW4gPSBmYWxzZTtcbndpbmRvdy5sb2dnaW5nSW4gPSBmYWxzZTtcbndpbmRvdy5pc01vYmlsZUFwcCA9IGZhbHNlO1xud2luZG93Lmhpc3RvcmljYWwgPSBbXTtcbndpbmRvdy51bmJpbmRpbmcgPSBbXTtcblxud2luZG93LmVtYWlsRXNjYXBlciA9IGZ1bmN0aW9uKGVtYWlsKXtcblx0cmV0dXJuIGVtYWlsLnJlcGxhY2UoL1sgLl0vZywgXCJfXCIpO1xufTtcblxud2luZG93LmVtYWlsVW5lc2NhcGVyID0gZnVuY3Rpb24oZW1haWwpe1xuXHRyZXR1cm4gZW1haWwucmVwbGFjZSgvW19dL2csIFwiLlwiKTtcbn07XG5cbndpbmRvdy5nZXRPYmplY3RTaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHNpemUgPSAwLCBcbiAgICBrZXk7XG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkgc2l6ZSsrO1xuICAgIH1cbiAgICByZXR1cm4gc2l6ZTtcbn07XG5cbndpbmRvdy5nZXRPYmplY3REZWVwU2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzaXplID0gMCwgXG4gICAgXHRrZXk7XG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgXHR0eXBlb2Yob2JqW2tleV0pID09PSAnb2JqZWN0JyBcbiAgICAgICAgXHQmJiBrZXkuaW5kZXhPZignJCcpIDwgMFxuICAgIFx0KSBzaXplKys7XG4gICAgfVxuICAgIHJldHVybiBzaXplO1xufTtcblxud2luZG93LmlzX3RvdWNoX2RldmljZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8ICdvbm1zZ2VzdHVyZWNoYW5nZScgaW4gd2luZG93O1xufTtcblxud2luZG93LnVuYmluZEFsbCA9IGZ1bmN0aW9uKCl7XG5cdGZvciAodmFyIG1ldGhvZCBpbiB3aW5kb3cudW5iaW5kaW5nKXtcblx0XHR3aW5kb3cudW5iaW5kaW5nW21ldGhvZF0oKTtcblx0fVxufTtcblxuaWYgKHdpbmRvdy5pc190b3VjaF9kZXZpY2UoKSkgJGJvZHkuYWRkQ2xhc3MoJ3RvdWNoeScpXG5cbmlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ2lQYWQnKSA+IC0xKXtcblx0JCgnaHRtbCcpLmFkZENsYXNzKCdpUGFkJylcbn1lbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ2lQaG9uZScpID4gLTEgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdpUG9kJykgPiAtMSl7XG5cdCQoJ2h0bWwnKS5hZGRDbGFzcygnaVBob25lJylcbn1cblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkZXZpY2VSZWFkeScsIGRldmljZVJlYWR5LCBmYWxzZSk7XG5cbmlmIChcdFxuXHQoZG9jdW1lbnQuVVJMLmluZGV4T2YoICdodHRwOi8vJyApID09PSAtMSkgJiZcblx0KGRvY3VtZW50LlVSTC5pbmRleE9mKCAnaHR0cHM6Ly8nICkgPT09IC0xKVxuKXtcblx0d2luZG93LmlzTW9iaWxlQXBwID0gdHJ1ZTtcblx0JGJvZHkuYWRkQ2xhc3MoJ3Bob25lR2FwJyk7XHRcbn1cblxuZnVuY3Rpb24gZGV2aWNlUmVhZHkoKXtcblx0QXBwLmluaXRpYWxpemUoKTtcblx0U3RhdHVzQmFyLmhpZGUoKTtcbn1cblxuLy8gZGVmaW5lIG91ciBhcHAgYW5kIGRlcGVuZGVuY2llcyAocmVtZW1iZXIgdG8gaW5jbHVkZSBmaXJlYmFzZSEpXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoXG5cdCdsaWNrJywgXG5cdFtcblx0XHQnZmlyZWJhc2UnLCBcblx0XHQnbmdSb3V0ZScsXG5cdFx0J3VpLnNvcnRhYmxlJyxcblx0XHQnY2ZwLmhvdGtleXMnLFxuXHRcdCduZ1Nhbml0aXplJyxcblx0XHQnbmdDb29raWVzJyxcblx0XHQnZ3JpZHN0ZXInLFxuXHRcdCduZ0FuaW1hdGUnLFxuXHRcdCduZ1RvdWNoJyxcblx0XHQnc2xpY2tDYXJvdXNlbCdcblx0XVxuKTtcblxuYXBwLnJ1bihbXCIkcm9vdFNjb3BlXCIsIFwiJGxvY2F0aW9uXCIsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbikge1xuXHQkcm9vdFNjb3BlLiRvbihcIiRyb3V0ZUNoYW5nZUVycm9yXCIsIGZ1bmN0aW9uKGV2ZW50LCBuZXh0LCBwcmV2aW91cywgZXJyb3IpIHtcblx0XHRpZiAoZXJyb3IgPT09IFwiQVVUSF9SRVFVSVJFRFwiKSB7IFxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9wb3J0YWwnKTtcblx0XHR9XG5cdH0pO1xufV0pO1xuXG5hcHAuY29uZmlnKCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAgICRyb3V0ZVByb3ZpZGVyXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHNpbXBseSB0eXBpbmcgaW4gdGhlIGFkZHJlc3NcbiAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2hlbGxvLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnaGVsbG9DdHJsJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgdGhlIGxvZ2luIC8gcG9ydGFsIHBhZ2VcbiAgICAgICAgLndoZW4oJy9wb3J0YWwnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL3BvcnRhbC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ3BvcnRhbEN0cmwnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciB0aGUgaW5mbyBwYWdlXG4gICAgICAgIC53aGVuKCcvaW5mbycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvaW5mby5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ2luZm9DdHJsJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3Igbm90ZXNcbiAgICAgICAgLndoZW4oJy9ub3RlLzppZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvbm90ZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ25vdGVDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBzaGFyZWRub3Rlc1xuICAgICAgICAud2hlbignL3NoYXJlZG5vdGUvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ub3RlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnbm90ZUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHRleHRcbiAgICAgICAgLndoZW4oJy90ZXh0LzppZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvdGV4dC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ3RleHRDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBjaGFuZ2luZyBib2FyZHNcbiAgICAgICAgLndoZW4oJy9jaGFuZ2UvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9jaGFuZ2UuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdjaGFuZ2VDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBib2FyZHNcbiAgICAgICAgLndoZW4oJy9ib2FyZC86aWQnLCB7IFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ib2FyZC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ2JvYXJkQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgbGlzdFxuICAgICAgICAud2hlbignL2xpc3QnLCB7IFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9saXN0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciAgOiAnbGlzdEN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGhpc3RvcnlcbiAgICAgICAgLndoZW4oJy9oaXN0b3J5JywgeyBcblx0XHRcdHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvaGlzdG9yeS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgIDogJ2hpc3RvcnlDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBzaGFyZVxuICAgICAgICAud2hlbignL3NoYXJlLzppZCcsIHsgXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL3NoYXJlLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciAgOiAnc2hhcmVDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBsaXN0XG4gICAgICAgIC53aGVuKCcvY29sb3Bob24nLCB7IFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9jb2xvcGhvbi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgIDogJ2NvbG9waG9uQ3RybCdcbiAgICAgICAgfSk7XG59KVxuLnJ1biggZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkY29va2llcywgTG9naW4sICRyb3V0ZSwgJHRpbWVvdXQsICRhbmltYXRlKSB7XG5cdCRyb290U2NvcGUuJG9uKCAnJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgbmV4dCwgY3VycmVudCkge1xuXG5cdFx0d2luZG93Lmhpc3RvcmljYWwucHVzaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuXHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UuaGlzdG9yaWNhbF9sYXN0ID0gJGxvY2F0aW9uLnBhdGgoKTtcblxuXHRcdGlmICgodHlwZW9mKGN1cnJlbnQpICE9PSAndW5kZWZpbmVkJykgJiYgKHR5cGVvZihjdXJyZW50LnRlbXBsYXRlVXJsKSAhPT0gJ3VuZGVmaW5lZCcpKVxuXHRcdFx0JGJvZHkuYXR0ciggJ2RhdGEtbGVhdmluZycsIGN1cnJlbnQudGVtcGxhdGVVcmwuc3BsaXQoJy8nKVsyXS5zcGxpdCgnLicpWzBdICk7XG5cdFx0aWYgKCh0eXBlb2YobmV4dCkgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mKG5leHQudGVtcGxhdGVVcmwpICE9PSAndW5kZWZpbmVkJykpXG5cdFx0XHQkYm9keS5hdHRyKCAnZGF0YS1lbnRlcmluZycsIG5leHQudGVtcGxhdGVVcmwuc3BsaXQoJy8nKVsyXS5zcGxpdCgnLicpWzBdICk7XG5cdFx0ZWxzZXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAod2luZG93LmxvZ2dlZEluKXtcblx0XHRcdGNvbnNvbGUubG9nKCdhbHJlYWR5IGxvZ2dlZCBpbiEnKVxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xuXG5cdFx0XHRpZiAoJGxvY2F0aW9uLnBhdGgoKSA9PT0gJy8nKVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRpZiAoIFxuXHRcdFx0XHQoIXdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwgJiYgIXdpbmRvdy5sb2NhbFN0b3JhZ2UucGFzcykgJiZcblx0XHRcdFx0bmV4dC50ZW1wbGF0ZVVybCAhPT0gJ2Fzc2V0cy9pbmMvY29sb3Bob24uaHRtbCdcblx0XHRcdCl7XHRcblx0XHRcdFx0Y29uc29sZS5sb2coJ25vIHN0b3JlZCBsb2dpbiwgZ290byBzdGFydCcpXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcG9ydGFsJylcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRib2R5LmFkZENsYXNzKCdyZWFkeScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBcblx0XHRcdFx0KCRjb29raWVzLmVtYWlsICYmICRjb29raWVzLnBhc3MpIHx8IFxuXHRcdFx0XHQod2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3MpXG5cdFx0XHQpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc3RvcmVkIGxvZ2luIGZvdW5kLCBsb2dnaW5nIGluJylcblxuXHRcdFx0XHR2YXIgbG9naW5FbWFpbCA9ICRjb29raWVzLmVtYWlsIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwsXG5cdFx0XHRcdFx0bG9naW5QYXNzID0gJGNvb2tpZXMucGFzcyB8fCB3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3M7XG5cblx0XHRcdFx0TG9naW4obG9naW5FbWFpbCwgbG9naW5QYXNzLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmIChuZXh0LnRlbXBsYXRlVXJsID09PSAnYXNzZXRzL2luYy9wb3J0YWwuaHRtbCcpe1xuXHRcdFx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jyk7XG5cblx0XHRcdFx0XHRcdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmhpc3RvcmljYWxfbGFzdClcblx0XHRcdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgod2luZG93LmxvY2FsU3RvcmFnZS5oaXN0b3JpY2FsX2xhc3QpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQkYW5pbWF0ZS5lbmFibGVkKGZhbHNlKTtcblx0XHRcdFx0XHRcdCRyb3V0ZS5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0JGFuaW1hdGUuZW5hYmxlZCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jylcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkYm9keS5hdHRyKCdkYXRhLWRpcmVjdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCRjb29raWVzLmRpcmVjdGlvbil7XG5cdFx0XHRyZXR1cm4gd2luZG93LmRpcmVjdGlvbnNbJGNvb2tpZXMuZGlyZWN0aW9uICUgNF07XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHQkY29va2llcy5kaXJlY3Rpb24gPSAwO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5kaXJlY3Rpb25zWyRjb29raWVzLmRpcmVjdGlvbl07XG5cdFx0fVxuXHR9KSBcbn0pO1xuXG5hcHAuZmFjdG9yeShcIkxvZ2luXCIsIFsnJHJvb3RTY29wZScsIFwiJGZpcmViYXNlQXV0aFwiLCBcIiRjb29raWVzXCIsICckdGltZW91dCcsICdBdXRoJywgJyRsb2NhdGlvbicsICdOb3RlcycsXG5cdGZ1bmN0aW9uKCRyb290U2NvcGUsICRmaXJlYmFzZUF1dGgsICRjb29raWVzLCAkdGltZW91dCwgQXV0aCwgJGxvY2F0aW9uLCBOb3Rlcykge1xuXHRcdHJldHVybiBmdW5jdGlvbih0aGVFbWFpbCwgdGhlUGFzcywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spe1xuXG5cdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cubG9nZ2luZ0luLCB0aGVFbWFpbCwgdGhlUGFzcy8qLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjayovKVxuXG5cdFx0XHRpZiAoIXdpbmRvdy5sb2dnaW5nSW4pe1xuXHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gdHJ1ZTtcblxuXHRcdFx0XHRBdXRoLiRhdXRoV2l0aFBhc3N3b3JkKHtcblx0XHRcdFx0XHRlbWFpbDogdGhlRW1haWwsXG5cdFx0XHRcdFx0cGFzc3dvcmQ6IHRoZVBhc3Ncblx0XHRcdFx0fSkudGhlbihmdW5jdGlvbihhdXRoRGF0YSkge1xuXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2xvZ2dlZCBpbiB3aXRoICcgKyB0aGVFbWFpbCArICcsICcgKyBhdXRoRGF0YS51aWQpXG5cdFx0XHRcdFx0d2luZG93LmxvZ2dpbmdJbiA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCA9ICRjb29raWVzLmVtYWlsID0gdGhlRW1haWw7XG5cdFx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbF9lc2NhcGVkID0gJGNvb2tpZXMuZW1haWxfZXNjYXBlZCA9IHdpbmRvdy5lbWFpbEVzY2FwZXIodGhlRW1haWwpO1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UucGFzcyA9ICRjb29raWVzLnBhc3MgPSB0aGVQYXNzO1xuXG5cdFx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS51aWQgPSB3aW5kb3cudWlkID0gYXV0aERhdGEudWlkO1xuXG5cdFx0XHRcdFx0d2luZG93LmxvZ2dlZEluID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmKFxuXHRcdFx0XHRcdFx0KG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZS9pKSkgfHwgXG5cdFx0XHRcdFx0XHQobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBvZC9pKSkgfHxcblx0XHRcdFx0XHRcdChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpKVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0d2luZG93LmRldmljZSA9ICdNb2JpbGUnO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0d2luZG93LmRldmljZSA9ICdEZXNrdG9wJztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZW9mKGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL1VQREFURVxuXG5cdFx0XHRcdFx0cmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhJyk7XG5cdFx0XHRcdFx0cmVmLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24oc25hcHNob3QpIHtcblxuXHRcdFx0XHRcdFx0aWYgKCFzbmFwc2hvdC5leGlzdHMoKSl7XG5cdFx0XHRcdFx0XHRcdHJlZi5zZXQoe1xuXHRcdFx0XHRcdFx0XHRcdHVzZXI6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsX2VzY2FwZWQ6ICRjb29raWVzLmVtYWlsX2VzY2FwZWQsXG5cdFx0XHRcdFx0XHRcdFx0XHR1aWQ6IHdpbmRvdy51aWRcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGVycm9yQ2FsbGJhY2spID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9wb3J0YWwnKTtcblx0XHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKTtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFwiQXV0aGVudGljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XG5cdFx0XHRcdFx0JGNvb2tpZXMuZW1haWwgPSAnJztcblx0XHRcdFx0XHQkY29va2llcy5wYXNzID0gJyc7XG5cdFx0XHRcdFx0YWxlcnQoJ09oIG5vISBZb3VyIGxvZ2luIGRpZG5cXCd0IHdvcmsuIFRyeSBhZ2Fpbj8gOiknKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdFxuXHRcdH1cblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KFwiTG9nb3V0XCIsIFtcIiRmaXJlYmFzZUF1dGhcIiwgXCIkY29va2llc1wiLCAnQXV0aCcsICckbG9jYXRpb24nLCAnJHRpbWVvdXQnLCBcblx0ZnVuY3Rpb24oJGZpcmViYXNlQXV0aCwgJGNvb2tpZXMsIEF1dGgsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcblxuXHRcdFx0d2luZG93LmxvZ2dlZEluID0gZmFsc2U7XG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0QXV0aC4kdW5hdXRoKCk7XG5cdFx0XHRcdCRjb29raWVzLmVtYWlsID0gJyc7XG5cdFx0XHRcdCRjb29raWVzLnBhc3MgPSAnJztcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCA9ICcnO1xuXHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3MgPSAnJztcblx0XHRcdFx0d2luZG93LnVpZCA9ICcnO1xuXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcG9ydGFsJyk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdBdXRoJywgW1wiJGZpcmViYXNlQXV0aFwiLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VBdXRoKSB7XG5cdFx0cmV0dXJuICRmaXJlYmFzZUF1dGgod2luZG93Ll9GaXJlYmFzZSk7XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnTm90ZXMnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbm90ZXMnKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ1NoYXJlZE5vdGVzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdCb2FyZHMnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkgeyBcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcycpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ub3Rlcy8nICsgaWQpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnc2hhcmVkTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnX3NoYXJlZC8nICsgaWQpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnQm9hcmQnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvYm9hcmRzLycgKyBpZCk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdNZXRhJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdoaXN0b3J5Q291bnQnLFxuXHRmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEvaGlzdG9yeScpLFxuXHRcdFx0XHRjb3VudCA9IDA7XG5cblx0XHRcdHJlZi5vbmNlKFwidmFsdWVcIiwgZnVuY3Rpb24oc25hcHNob3QpIHtcblxuXHRcdFx0XHRzbmFwc2hvdC5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkU25hcHNob3QpIHtcblx0XHRcdFx0XHR2YXIgY2hpbGREYXRhID0gY2hpbGRTbmFwc2hvdC52YWwoKTtcblxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdCggY2hpbGREYXRhLmRldmljZSAhPT0gd2luZG93LmRldmljZSApIHx8IFxuXHRcdFx0XHRcdFx0KCBjaGlsZERhdGEudGltZSA8ICggRGF0ZS5ub3coKSAtIDM2MDAwMDAgKSApXG5cdFx0XHRcdFx0KXtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjYWxsYmFjayhjb3VudClcblx0XHRcdH0pXG5cdFx0fTtcblx0fVxuKTtcblxuYXBwLmZhY3RvcnkoJ25ld0JpdCcsIFxuXHRmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24odGFiLCBjb250ZW50LCBsaW5rKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkaXNwbGF5OiB0cnVlLFxuXHRcdFx0XHR0eXBlOlwicGxhaW5UZXh0XCIsXG5cdFx0XHRcdHRhYkNvdW50OiB0YWIsXG5cdFx0XHRcdGNvbnRlbnQ6IHR5cGVvZihjb250ZW50KSAhPT0gJ3VuZGVmaW5lZCcgPyBjb250ZW50IDogJycsXG5cdFx0XHRcdGNvbnRlbnRDYXJldDogdHlwZW9mKGNvbnRlbnQpICE9PSAndW5kZWZpbmVkJyA/IGNvbnRlbnQgOiAnPHNwYW4gY2xhc3M9XCJoaWRkZW5DYXJldFwiPjwvc3Bhbj4nLFxuXHRcdFx0XHRiaXRJRDogJCRfLnJhbmRvbWl6ZSgpLFxuXHRcdFx0XHRtYXJrOiBmYWxzZSxcblx0XHRcdFx0c2VsZWN0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuXHRcdFx0XHRkZXN0cm95ZWQ6IFwiXCIsXG5cdFx0XHRcdG1hcmtlZDogXCJcIixcblx0XHRcdFx0bWVudV9vcGVuOiBmYWxzZSxcblx0XHRcdFx0aXNMaW5rOiB0eXBlb2YobGluaykgIT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdFx0XHRhZGRyZXNzOiB0eXBlb2YobGluaykgIT09ICd1bmRlZmluZWQnID8gbGluayA6ICcnXG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cbik7XG5cbmFwcC5mYWN0b3J5KCdmaXJzdE5vdGUnLCBbJ25ld0JpdCcsICckY29va2llcycsXG5cdGZ1bmN0aW9uKG5ld0JpdCwgJGNvb2tpZXMpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24ocGFyZW50LCBpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS91c2VyJyk7XG5cblx0XHRcdHJlZi5zZXQoe1xuXHRcdFx0XHRlbWFpbF9lc2NhcGVkOiAkY29va2llcy5lbWFpbF9lc2NhcGVkLFxuXHRcdFx0XHR1aWQ6IHdpbmRvdy51aWRcblx0XHRcdH0pXG5cblx0XHRcdHZhciBub3RlSUQ7XG5cblx0XHRcdGlmIChpZCl7XG5cdFx0XHRcdG5vdGVJRCA9IGlkO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5vdGVJRCA9ICQkXy5yYW5kb21pemUoKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG5vdGVSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzLycgKyBub3RlSUQgKTtcblx0XHRcdG5vdGVSZWYuc2V0KHtcblx0XHRcdFx0dGl0bGU6ICdXZWxjb21lIHRvIExpY2shIDopIENsaWNrIGhlcmUgdG8gZ2V0IHN0YXJ0ZWQhJyxcblx0XHRcdFx0cGFyZW50OiB0eXBlb2YocGFyZW50KSA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcGFyZW50LFxuXHRcdFx0XHRpZDogbm90ZUlELFxuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdIaSB0aGVyZSEgV2VsY29tZSB0byBMaWNrLCB0aGUgc21hcnRlc3Qgd2F5IGZvciB5b3VyIHRvbmd1ZSB0byB0YWtlIG5vdGVzLiBZb3VyIGhhbmRzIGNhbiBoZWxwIHRvbywgaWYgdGhleVxcJ2QgbGlrZS4gOiknKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0xpY2sgaGFybmVzc2VzIHRoZSBwb3dlciBvZiB5b3VyIGZhdm9yaXRlIHRleHQgZWRpdG9yIHRvIGhlbHAgeW91IG9yZ2FuaXplIHlvdXIgbGlmZS4nKSxcblx0XHRcdFx0XHRuZXdCaXQoMSwgJ0lmIHlvdSBkb25cXCd0IGtub3cgd2hhdCBvbmUgb2YgdGhvc2UgaXMsIHRoYXRcXCdzIG9rYXkg4oCTIExpY2sgaXMgc3RpbGwganVzdCB5b3VyIHNwZWVkIScpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnTm90ZXMgY2FuIGVpdGhlciBiZSBzdGFuZC1hbG9uZSwgb3IgY2FuIGJlIG9yZ2FuaXplZCBpbnRvIGJvYXJkcy4gR28gYWhlYWQgYW5kIGNsb3NlIHRoaXMgYW5kIG1ha2UgYSBuZXcgYm9hcmQsIHRoZXlcXCdyZSBwcmV0dHkgaGFuZHkhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdMaWNrIHNlZW1zIHByZXR0eSBzaW1wbGUsIGJ1dCBpdFxcJ3MgZ290IGEgbG90IG9mIGNvb2wgdGhpbmdzIGJ1aWx0IHJpZ2h0IGluLiBJdCBtaWdodCBzdXJwcmlzZSB5b3UhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdBIGxpc3Qgb2YgTGlja1xcJ3Mga2V5Ym9hcmQgc2hvcnRjdXRzIGlzIG5ldmVyIGZhciBmcm9tIHJlYWNoOiBwcmVzcyBjb21tYW5kICsgPyB0byBzZWUgaXQhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdPbiBhIG1vYmlsZSBkZXZpY2U/IFRoZXJlIGFyZSBsb3RzIG9mIHN3aXBhYmxlIHRoaW5ncyDigJMgZ2l2ZSBpdCBhIHNob3QhJyksIFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnTGljayBpcyBhIHdvcmsgaW4gcHJvZ3Jlc3MsIGFuZCBpZiBzb21ldGhpbmcgZ29lcyB3cm9uZywgbGV0IG1lIGtub3cgYXQgZUBqZWN0LmNoLicsICdtYWlsdG86ZUBqZWN0LmNoJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdIYXBweSBMaWNraW5nISA6KScpXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGNhdGVnb3J5OiAwLFxuXHRcdFx0XHRkaXNwbGF5OiB0cnVlLFxuXHRcdFx0XHRsaXN0OiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5vdGVJRDtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ25ld05vdGUnLCBbJ25ld0JpdCcsXG5cdGZ1bmN0aW9uKG5ld0JpdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihwYXJlbnQsIGlkKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKGFyZ3VtZW50cylcblx0XHRcdHZhciBub3RlSUQ7XG5cblx0XHRcdGlmIChpZCl7XG5cdFx0XHRcdG5vdGVJRCA9IGlkO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5vdGVJRCA9ICQkXy5yYW5kb21pemUoKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG5vdGVSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzLycgKyBub3RlSUQgKTtcblx0XHRcdG5vdGVSZWYuc2V0KHtcblx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRwYXJlbnQ6IHR5cGVvZihwYXJlbnQpID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBwYXJlbnQsXG5cdFx0XHRcdGlkOiBub3RlSUQsXG5cdFx0XHRcdGJvZHk6IFtuZXdCaXQoMCldLFxuXHRcdFx0XHRjYXRlZ29yeTogMCxcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0bGlzdDogdHJ1ZSxcblx0XHRcdFx0eDogMCxcblx0XHRcdFx0eTogMCxcblx0XHRcdFx0bGFzdEVkaXRlZDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBub3RlSUQ7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdzaGFyZU5vdGUnLCBbJyRmaXJlYmFzZU9iamVjdCcsICdNZXRhJywgJ05vdGUnLCAnTm90ZXMnLCAnJGNvb2tpZXMnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0LCBNZXRhLCBOb3RlLCBOb3RlcywgJGNvb2tpZXMsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgdGFyZ2V0LCBjYWxsYmFjaykge1xuXG5cdFx0XHRjb25zb2xlLmxvZyhhcmd1bWVudHMpXG5cblx0XHRcdHZhciBtZXRhUmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhL3NoYXJlZFVzZXJzLycpLnB1c2godGFyZ2V0KTtcblxuXHRcdFx0dmFyIHRyYW5zYWN0aW9uID0gTm90ZShpZCkuJGxvYWRlZCgpLnRoZW4oZnVuY3Rpb24ocHJpdmF0ZU5vdGUpIHtcblx0XHRcdFx0Y29uc29sZS5sb2cocHJpdmF0ZU5vdGUpXG5cdFx0XHRcdHZhciBzaGFyaW5nID0ge307XG5cdFx0XHRcdGlmIChwcml2YXRlTm90ZS5wYXJlbnQpe1xuXHRcdFx0XHRcdHNoYXJpbmdbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0gPSB7XG5cdFx0XHRcdFx0XHR1aWQ6IHdpbmRvdy51aWQsXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHByaXZhdGVOb3RlLnBhcmVudCxcblx0XHRcdFx0XHRcdHg6IHByaXZhdGVOb3RlLngsXG5cdFx0XHRcdFx0XHR5OiBwcml2YXRlTm90ZS55XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRzaGFyaW5nWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdID0geyBcblx0XHRcdFx0XHRcdHBhcmVudDogZmFsc2UsXG5cdFx0XHRcdFx0XHR1aWQ6IHdpbmRvdy51aWQsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhcmluZ1tlbWFpbEVzY2FwZXIodGFyZ2V0KV0gPSB7IHBhcmVudDogZmFsc2UgfVxuXG5cdFx0XHRcdHZhciBzaGFyZWRSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkLycgKyBpZCk7XG5cdFx0XHRcdHNoYXJlZFJlZi5zZXQoe1xuXHRcdFx0XHRcdHRpdGxlOiBwcml2YXRlTm90ZS50aXRsZSxcblx0XHRcdFx0XHRpZDogcHJpdmF0ZU5vdGUuaWQsXG5cdFx0XHRcdFx0Ym9keTogcHJpdmF0ZU5vdGUuYm9keSxcblx0XHRcdFx0XHRjYXRlZ29yeTogcHJpdmF0ZU5vdGUuY2F0ZWdvcnksXG5cdFx0XHRcdFx0ZGlzcGxheTogcHJpdmF0ZU5vdGUuZGlzcGxheSxcblx0XHRcdFx0XHRsaXN0OiBwcml2YXRlTm90ZS5saXN0LFxuXHRcdFx0XHRcdHBhcnRpY2lwYW50czogc2hhcmluZ1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRwcml2YXRlTm90ZS4kcmVtb3ZlKCk7XG5cblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnYWRkVG9TaGFyZWROb3RlJywgWyckZmlyZWJhc2VPYmplY3QnLCAnTWV0YScsICdOb3RlJywgJyRjb29raWVzJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCwgTWV0YSwgTm90ZSwgJGNvb2tpZXMsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgdGFyZ2V0LCBjYWxsYmFjaykge1xuXG5cdFx0XHR2YXIgbWV0YVJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS9zaGFyZWRVc2Vycy8nKS5wdXNoKHRhcmdldCk7XG5cblx0XHRcdHZhciBwYXJ0aWNpcGFudFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArIGlkICsgJy9wYXJ0aWNpcGFudHMvJyArIGVtYWlsRXNjYXBlcih0YXJnZXQpKTtcblxuXHRcdFx0Y29uc29sZS5sb2cocGFydGljaXBhbnRSZWYpXG5cblx0XHRcdHBhcnRpY2lwYW50UmVmLnNldCh7XG5cdFx0XHRcdHBhcmVudDogZmFsc2Vcblx0XHRcdH0sIGNhbGxiYWNrKVxuXHRcdH07XG5cdH1cbl0pO1xuXG5cblxuXG5hcHAuZmFjdG9yeSgna2lsbE5vdGUnLCBbJ05vdGUnLCAnc2hhcmVkTm90ZScsICckbG9jYXRpb24nLFxuXHRmdW5jdGlvbihOb3RlLCBzaGFyZWROb3RlLCAkbG9jYXRpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHBhcmVudCkge1xuXG5cdFx0XHRpZiAocGFyZW50KXtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgcGFyZW50KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRub3RlID0gTm90ZShpZCk7XG5cdFx0XHRub3RlLiRyZW1vdmUoKTtcblxuXHRcdFx0Y29uc29sZS5sb2coaWQpO1xuXG5cdFx0XHRzaGFyZWRub3RlID0gc2hhcmVkTm90ZShpZCk7XG5cdFx0XHRzaGFyZWRub3RlLiRyZW1vdmUoKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ25ld0JvYXJkJywgWyduZXdOb3RlJyxcblx0ZnVuY3Rpb24obmV3Tm90ZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGJvYXJkSUQgPSAkJF8ucmFuZG9taXplKCk7XG5cblx0XHRcdC8vQk9BUkRTXG5cdFx0XHR2YXIgYm9hcmRSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcy8nICsgYm9hcmRJRCApO1xuXHRcdFx0Ym9hcmRSZWYuc2V0KHtcblx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRpZDogYm9hcmRJRCxcblx0XHRcdFx0c3RhcnJlZDogbnVsbCxcblx0XHRcdFx0bGFzdEVkaXRlZDogRGF0ZS5ub3coKSxcblx0XHRcdFx0bm90ZXM6W11cblx0XHRcdH0pO1xuXG5cdFx0XHRuZXdOb3RlKGJvYXJkSUQpO1xuXG5cdFx0XHRyZXR1cm4gYm9hcmRJRDtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ2tpbGxCb2FyZCcsIFsnQm9hcmQnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oQm9hcmQsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgcGFyZW50KSB7XG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdGJvYXJkID0gQm9hcmQoaWQpO1xuXHRcdFx0Ym9hcmQuJHJlbW92ZSgpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnY29uY2VudHJpY2l0eScsIFsnJGNvb2tpZXMnLFxuXHRmdW5jdGlvbigkY29va2llcykge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgcGFyZW50KSB7XG5cdFx0XHQkYm9keS5hZGRDbGFzcygnY29uY2VudHJpYycpLmF0dHIoJ2RhdGEtZGlyZWN0aW9uJywgXG5cdFx0XHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cmV0dXJuIHdpbmRvdy5kaXJlY3Rpb25zWysrJGNvb2tpZXMuZGlyZWN0aW9uICUgNF07XG5cdFx0XHRcdH1cblx0XHRcdClcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkYm9keS5yZW1vdmVDbGFzcygnY29uY2VudHJpYycpXG5cdFx0XHR9LCAxMDAwKVxuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuY29udHJvbGxlcignaGVsbG9DdHJsJywgXG5cdFtcblx0XHQnJHNjb3BlJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdGhlbGxvQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcigncG9ydGFsQ3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnTm90ZScsXG5cdFx0J25ld05vdGUnLCBcblx0XHQna2lsbE5vdGUnLFxuXHRcdCduZXdCaXQnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCdBdXRoJyxcblx0XHQnTG9naW4nLFxuXHRcdCdmaXJzdE5vdGUnLFxuXHRcdHBvcnRhbEN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ25vdGVDdHJsJywgXG5cdFtcblx0XHQnJGNvbnRyb2xsZXInLFxuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J05vdGUnLFxuXHRcdCdzaGFyZWROb3RlJyxcblx0XHQnbmV3Tm90ZScsIFxuXHRcdCdraWxsTm90ZScsXG5cdFx0J3NoYXJlTm90ZScsXG5cdFx0J25ld0JpdCcsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckY29va2llcycsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdCdNZXRhJyxcblx0XHQnaGlzdG9yeUNvdW50Jyxcblx0XHRub3RlQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignaW5mb0N0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdGluZm9DdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCd0ZXh0Q3RybCcsIFxuXHRbXG5cdFx0JyRzY29wZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsXG5cdFx0J05vdGUnLFxuXHRcdCdzaGFyZWROb3RlJywgXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckdGltZW91dCcsXG5cdFx0dGV4dEN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NoYW5nZUN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J0JvYXJkcycsXG5cdFx0J25ld0JvYXJkJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJHdpbmRvdycsXG5cdFx0JyRjb29raWVzJyxcblx0XHRjaGFuZ2VDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdoaXN0b3J5Q3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnbmV3Qm9hcmQnLFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckd2luZG93Jyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCdNZXRhJyxcblx0XHRoaXN0b3J5Q3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignYm9hcmRDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLCBcblx0XHQnQm9hcmQnLFxuXHRcdCduZXdCb2FyZCcsXG5cdFx0J2tpbGxCb2FyZCcsXG5cdFx0J05vdGVzJyxcblx0XHQnU2hhcmVkTm90ZXMnLFxuXHRcdCduZXdOb3RlJyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyRpbnRlcnZhbCcsXG5cdFx0JyRjb29raWVzJyxcblx0XHQnTG9nb3V0Jyxcblx0XHQnY29uY2VudHJpY2l0eScsXG5cdFx0J2hpc3RvcnlDb3VudCcsXG5cdFx0Ym9hcmRDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdsaXN0Q3RybCcsIFxuXHRbXG5cdFx0JyRzY29wZScsIFxuXHRcdCdOb3RlcycsXG5cdFx0J1NoYXJlZE5vdGVzJyxcblx0XHQnbmV3Tm90ZScsXG5cdFx0J2tpbGxOb3RlJyxcblx0XHQnQm9hcmRzJyxcblx0XHQnbmV3Qm9hcmQnLFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdCdoaXN0b3J5Q291bnQnLFxuXHRcdGxpc3RDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdzaGFyZUN0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnTWV0YScsXG5cdFx0J05vdGUnLFxuXHRcdCdzaGFyZWROb3RlJyxcblx0XHQnc2hhcmVOb3RlJyxcblx0XHQnYWRkVG9TaGFyZWROb3RlJyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHRzaGFyZUN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NvbG9waG9uQ3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJywgXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0Y29sb3Bob25DdHJsXG5cdF1cbik7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdEJvYXJkLFxuXHRuZXdCb2FyZCxcblx0a2lsbEJvYXJkLFxuXHROb3Rlcyxcblx0U2hhcmVkTm90ZXMsXG5cdG5ld05vdGUsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRpbnRlcnZhbCxcblx0JGNvb2tpZXMsXG5cdExvZ291dCxcblx0Y29uY2VudHJpY2l0eSxcblx0aGlzdG9yeUNvdW50XG4pIHtcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnYm9hcmQnO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKVxuXG5cdEJvYXJkKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdib2FyZCcpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoJHNjb3BlLmJvYXJkLnN0YXJyZWQpXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXJOb3RlKCRzY29wZS5ib2FyZC5zdGFycmVkKVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgKCRzY29wZS5ib2FyZC50aXRsZSA9PT0gJycpXG5cdFx0XHRcdFx0JCgnLmJvYXJkX3RpdGxlIHRleHRhcmVhJykuZm9jdXMoKVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgKCEkc2NvcGUuYm9hcmQubGFzdEVkaXRlZClcblx0XHRcdFx0XHQkc2NvcGUuYm9hcmQubGFzdEVkaXRlZCA9IERhdGUubm93KClcblx0XHRcdH0pXG5cdFx0fSk7XG5cblx0Tm90ZXMoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGVzJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkc2NvcGUuYm9hcmQuc3RhcnJlZClcblx0XHRcdFx0XHQkc2NvcGUuc3Rhck5vdGUoJHNjb3BlLmJvYXJkLnN0YXJyZWQpXG5cdFx0XHR9KVxuXHRcdH0pO1xuXG5cdFNoYXJlZE5vdGVzKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdzaGFyZWRub3RlcycpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHRzaGFyZWRHZW5lcmF0b3IoXG5cdFx0XHRcdCRzY29wZS5zaGFyZWRub3RlcywgXG5cdFx0XHRcdHdpbmRvdy5nZXRPYmplY3REZWVwU2l6ZSgkc2NvcGUuc2hhcmVkbm90ZXMpLCBcblx0XHRcdFx0ZnVuY3Rpb24oc2hhcmVkTm90ZXMpe1xuXHRcdFx0XHRcdCRzY29wZS5zaGFyZWRGaWx0ZXIgPSBzaGFyZWROb3Rlcztcblx0XHRcdFx0fVxuXHRcdFx0KVxuXG5cdFx0fSk7XG5cblx0c2hhcmVkR2VuZXJhdG9yID0gZnVuY3Rpb24obm90ZXMsIGNvdW50LCBjYWxsYmFjayl7XG5cblx0XHR2YXIgc2hhcmVkID0ge30sXG5cdFx0XHRzaGFyZWRDb3VudGVyID0gMDtcblxuXHRcdGFuZ3VsYXIuZm9yRWFjaChub3RlcywgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZS5wYXJ0aWNpcGFudHMsIGZ1bmN0aW9uKGYsIGwpe1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdChsID09IHdpbmRvdy51aWQgfHwgbCA9PSAkY29va2llcy5lbWFpbF9lc2NhcGVkKSBcblx0XHRcdFx0XHRcdCYmIChlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQgPT09ICRyb3V0ZVBhcmFtcy5pZClcblx0XHRcdFx0XHQpe1xuXHRcdFx0XHRcdFx0c2hhcmVkW2tdID0gZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0c2hhcmVkQ291bnRlcisrO1xuXHRcdFx0XHRpZiAoc2hhcmVkQ291bnRlciA9PT0gY291bnQgJiYgISQuaXNFbXB0eU9iamVjdChzaGFyZWQpKVxuXHRcdFx0XHRcdGNhbGxiYWNrKHNoYXJlZClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cblxuICAgICRzY29wZS5jb25jZW50cmljID0gZnVuY3Rpb24oKXtcbiAgICBcdGNvbmNlbnRyaWNpdHkoKTtcbiAgICB9O1xuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnR28gYmFjayB0byBMaXN0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VudGVyJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdG5ld05vdGUoJHNjb3BlLmJvYXJkLmlkKTtcblx0XHRcdH1cblx0XHR9KVxuXG5cblxuXHQkc2NvcGUubmV3Tm90ZSA9IGZ1bmN0aW9uKGJvYXJkSUQpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3Tm90ZShib2FyZElEKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5uZXdCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgbmV3Qm9hcmQoKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5oaXN0b3JpY2FsID0gXy5kZWJvdW5jZShmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5ib2FyZC5sYXN0RWRpdGVkID0gRGF0ZS5ub3coKTtcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHR9KVxuXG5cdFx0Y29uc29sZS5sb2coJ0hJU1RPUklDQUwnKVxuXHR9LCA1MDAwKVxuXG5cdCRzY29wZS5zdGFyTm90ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0Y29uc29sZS5sb2coaWQpXG5cblx0XHQkKCcuYm9hcmRfbm90ZScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhhdCA9ICQodGhpcylcblxuXHRcdFx0aWYgKGlkICYmIGlkID09PSAkdGhhdC5hdHRyKCdkYXRhLWlkJykpe1xuXHRcdFx0XHQkdGhhdC5hZGRDbGFzcygnc3RhcnJlZCcpXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JHRoYXQucmVtb3ZlQ2xhc3MoJ3N0YXJyZWQnKVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHRcdCRzY29wZS5ib2FyZC5zdGFycmVkID0gaWQ7XG5cdH1cblxuXHR2YXIgaXNFbXB0eSA9IHRydWU7XG5cblx0aXNCb2FyZEVtcHR5ID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoJCgnLmJvYXJkX2JvZHkgdWwgbGknKS5sZW5ndGggPiAwKVxuXHRcdFx0aXNFbXB0eSA9IGZhbHNlO1xuXHRcdGVsc2Vcblx0XHRcdGlzRW1wdHkgPSB0cnVlO1xuXG5cdFx0JHNjb3BlLmJvYXJkSXNFbXB0eSA9IGlzRW1wdHk7XG5cdH07XG5cblx0JHNjb3BlLmtpbGxXYXJuID0gZmFsc2U7XG5cblx0JHNjb3BlLmtpbGxCb2FyZCA9IGZ1bmN0aW9uKGlkKXtcblx0XHRpZiAoJHNjb3BlLmJvYXJkSXNFbXB0eSl7XG5cdFx0XHRraWxsQm9hcmQoaWQpO1xuXHRcdH1lbHNle1xuXHRcdFx0JHNjb3BlLmtpbGxXYXJuID0gdHJ1ZTtcblxuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLmtpbGxXYXJuID0gZmFsc2U7XG5cdFx0XHR9LCAzMDAwKTtcblx0XHR9XG5cdH1cblxuXHRlbXB0eVdhdGNoZXIgPSAkaW50ZXJ2YWwoaXNCb2FyZEVtcHR5LCAxMDAwKTtcblxuXHQkc2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKG5leHQsIGN1cnJlbnQpIHsgXG5cdFx0JGludGVydmFsLmNhbmNlbChlbXB0eVdhdGNoZXIpXG5cdH0pO1xuXG5cdCRzY29wZS5ib2FyZEl0ZW1PcHRzX3ByaXZhdGUgPSB7XG5cdCAgICBzaXplWDogJzEnLFxuXHQgICAgc2l6ZVk6IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gMiA6IDEsXG5cdCAgICByb3c6IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gJ25vdGUueSAqIDInIDogJ25vdGUueScsXG5cdCAgICBjb2w6ICdub3RlLngnXG5cdH07XG5cblx0JHNjb3BlLmJvYXJkSXRlbU9wdHNfc2hhcmVkID0ge1xuXHQgICAgc2l6ZVg6ICcxJyxcblx0ICAgIHNpemVZOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IDIgOiAxLFxuXHQgICAgcm93OiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/ICdub3RlLnBhcnRpY2lwYW50c1tcIicgKyAkY29va2llcy5lbWFpbF9lc2NhcGVkICsgJ1wiXS55ICogMicgOiAnbm90ZS5wYXJ0aWNpcGFudHNbXCInICsgJGNvb2tpZXMuZW1haWxfZXNjYXBlZCArICdcIl0ueScsXG5cdCAgICBjb2w6ICdub3RlLnBhcnRpY2lwYW50c1tcIicgKyAkY29va2llcy5lbWFpbF9lc2NhcGVkICsgJ1wiXS54J1xuXHR9O1xuXG5cdCRzY29wZS5ib2FyZEdyaWRPcHRzID0ge1xuXHQgICAgY29sdW1uczogNCxcblx0ICAgIG1vYmlsZU1vZGVFbmFibGVkOiBmYWxzZSxcblx0ICAgIG1pbkNvbHVtbnM6IDQsXG5cdCAgICBtaW5Sb3dzOiA0LFxuXHQgICAgbWF4Um93czogMTAsXG5cdCAgICBkZWZhdWx0U2l6ZVg6IDEsXG5cdCAgICBkZWZhdWx0U2l6ZVk6IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gMiA6IDEsXG5cdCAgICByZXNpemFibGU6IHtcblx0ICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuXHQgICAgfSxcblx0XHRkcmFnZ2FibGU6IHtcblx0XHRcdC8vIGhhbmRsZTogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAnLmdyYWJiZXInIDogbnVsbFxuXHRcdFx0aGFuZGxlOiAnLmdyYWJiZXInXG5cdFx0fVxuXHR9O1xuXG5cdGhpc3RvcnlDb3VudChmdW5jdGlvbih0aGVOdW1iZXIpe1xuXHRcdCRzY29wZS5oaXN0b3J5Q291bnRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhlTnVtYmVyO1xuXHRcdH1cblx0fSlcblxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHRMb2dvdXQoKTtcblx0fVxuXG5cdCRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS50b2dnbGVDbGFzcygnbW9iaWxlTWVudU9wZW4nKTtcdFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZU1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykucmVtb3ZlQ2xhc3MoJ21vYmlsZU1lbnVPcGVuJyk7XHRcblx0fTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLFxuXHRCb2FyZHMsXG5cdG5ld0JvYXJkLFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCR3aW5kb3csXG5cdCRjb29raWVzXG4pIHtcblx0XHRcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuXHQkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpXG5cblx0Qm9hcmRzKCkuJGJpbmRUbygkc2NvcGUsICdib2FyZHMnKTtcblxuXHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblx0XHRjb25zb2xlLmxvZygnU0hBUkVEJylcblx0XHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0fSlcblx0fWVsc2V7XG5cdFx0Y29uc29sZS5sb2coJ1BSSVZBVEUnKVxuXHRcdE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHR9KVxuXHR9XG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2NoYW5nZSc7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhaCwgZm9yZ2V0IGl0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5nb0JhY2soKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcdFx0XG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvc2hhcmVkbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHRlbHNlXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArICRyb3V0ZVBhcmFtcy5pZCk7XG5cdH1cblxuXHQkc2NvcGUuY2hhbmdlQm9hcmQgPSBmdW5jdGlvbihib2FyZCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQgPSBib2FyZDtcblx0XHRlbHNlXG5cdFx0XHQkc2NvcGUubm90ZS5wYXJlbnQgPSBib2FyZDtcblxuXHRcdCRzY29wZS5nb0JhY2soKTtcblx0fTtcblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBuZXdCb2FyZElEID0gbmV3Qm9hcmQoKVxuXG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQgPSBuZXdCb2FyZElEO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IG5ld0JvYXJkSUQ7XG5cblx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyBuZXdCb2FyZElEKTtcblx0fVxuXG5cdCRzY29wZS5ub0JvYXJkID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9IGZhbHNlO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IG51bGw7XG5cblx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXRcbikge1xuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuXHQkc2NvcGUucGFnZUNsYXNzID0gJ2NvbG9waG9uJztcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0dvIGJhY2sgdG8gTGlzdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkc2NvcGUsXG5cdCR0aW1lb3V0XG4pIHtcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG5cdCRzY29wZS5wYWdlQ2xhc3MgPSAnaGVsbG8nO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsXG5cdCRzY29wZSxcblx0bmV3Qm9hcmQsXG5cdCRyb3V0ZSxcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JHdpbmRvdyxcblx0JGNvb2tpZXMsXG5cdE1ldGFcbikge1xuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuXHRNZXRhKCkuJGJpbmRUbygkc2NvcGUsICdtZXRhJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0fSlcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnaGlzdG9yeSc7XG5cbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpXG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKSBcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnYWgsIGZvcmdldCBpdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0JHNjb3BlLmVkaXRlZE9uID0gZnVuY3Rpb24odGltZSl7XG5cdFx0dmFyIGluY29taW5nID0gbW9tZW50KHRpbWUpO1xuXHRcdHJldHVybiBpbmNvbWluZy5mb3JtYXQoJ0g6bSBkZGQgRG8gTU1NTScpXG5cdH1cblxuXHRoaXN0b3J5Q291bnQgPSAwO1xuXG5cdCRzY29wZS5oaXN0b3J5Q29tcGFyZSA9IGZ1bmN0aW9uKGRldmljZSwgdGltZSl7XG5cdFx0aWYgKFxuXHRcdFx0KGRldmljZSAhPT0gd2luZG93LmRldmljZSkgfHwgXG5cdFx0XHQoIHRpbWUgPCAoIERhdGUubm93KCkgLSAzNjAwMDAwICkgKVxuXHRcdCl7XG5cdFx0XHRoaXN0b3J5Q291bnQrKztcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1lbHNlIHJldHVybiBmYWxzZTtcblx0fVxuXG5cdCRzY29wZS5lZGl0ZWRCeSA9IGZ1bmN0aW9uKGF1dGhvcil7XG5cdFx0cmV0dXJuIHdpbmRvdy5lbWFpbFVuZXNjYXBlcihhdXRob3IpO1xuXHR9XG5cblx0JHNjb3BlLmNsZWFySGlzdG9yeSA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLm1ldGEuaGlzdG9yeSA9IHt9O1xuXHR9XG5cblx0JHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly8gaWYgKCRzY29wZS5tZXRhLmhpc3RvcnkubGVuZ3RoKVxuXHRcdGlmIChoaXN0b3J5Q291bnQgPT09IDApXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKVxuXHRcdGVsc2Vcblx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0XG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXHRcblx0JHNjb3BlLnBhZ2VDbGFzcyA9ICdpbmZvJztcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0dvIGJhY2sgdG8gTGlzdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0JHNjb3BlLnNsaWRlQ291bnQgPSAwO1xuXG5cdCRpbmZvID0gJCgnLmluZm8nKTtcblxuXHQkc2NvcGUuc2xpY2tDb25maWcgPSB7XG5cdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRkb3RzOiB0cnVlLFxuXHRcdGluZmluaXRlOiBmYWxzZSxcblx0XHRldmVudDoge1xuXHRcdFx0YWZ0ZXJDaGFuZ2U6IGZ1bmN0aW9uIChldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKSB7XG5cdFx0XHRcdCRpbmZvLnJlbW92ZUNsYXNzKCdmaXJzdFNsaWRlIGxhc3RTbGlkZScpXG5cdFx0XHRcdGlmIChjdXJyZW50U2xpZGUgPT09IDApe1xuXHRcdFx0XHRcdCRpbmZvLmFkZENsYXNzKCdmaXJzdFNsaWRlJylcblx0XHRcdFx0fWVsc2UgaWYgKGN1cnJlbnRTbGlkZSA9PT0gKCRzY29wZS5zbGlkZUNvdW50IC0gMSkpe1xuXHRcdFx0XHRcdCRpbmZvLmFkZENsYXNzKCdsYXN0U2xpZGUnKVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aW5pdDogZnVuY3Rpb24oc2xpY2spe1xuXHRcdFx0XHQkc2NvcGUuc2xpZGVDb3VudCA9ICQoJy5zbGljay1zbGlkZXIgLnNsaWNrLXNsaWRlJykubGVuZ3RoXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSwgXG5cdE5vdGVzLFxuXHRTaGFyZWROb3Rlcyxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdEJvYXJkcyxcblx0bmV3Qm9hcmQsXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCRsb2NhdGlvbixcblx0JGNvb2tpZXMsXG5cdCR0aW1lb3V0LFxuXHRMb2dvdXQsXG5cdGNvbmNlbnRyaWNpdHksXG5cdGhpc3RvcnlDb3VudFxuKSB7XG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2xpc3QnO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKVxuXG5cdE5vdGVzKCkuJGJpbmRUbygkc2NvcGUsICdub3RlcycpLnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblxuXHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdCRzY29wZS5wcml2YXRlRmlsdGVyID0gZnVuY3Rpb24odCl7XG5cblx0XHRcdHZhciBub3RlcyA9IFtdXG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gJ29iamVjdCcgJiYgISFlKXtcdFxuXHRcdFx0XHRcdGlmICghZS5sYXN0RWRpdGVkKSBlLmxhc3RFZGl0ZWQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdG5vdGVzLnB1c2goZSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBub3Rlcztcblx0XHR9XG5cdH0pXG5cblx0Qm9hcmRzKCkuJGJpbmRUbygkc2NvcGUsICdib2FyZHMnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHQkc2NvcGUuYm9hcmRzRmlsdGVyID0gZnVuY3Rpb24odCl7XG5cdFx0XHRcdHZhciBib2FyZHMgPSBbXVxuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuYm9hcmRzLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1x0XG5cdFx0XHRcdFx0XHRpZiAoIWUubGFzdEVkaXRlZCkgZS5sYXN0RWRpdGVkID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRcdGJvYXJkcy5wdXNoKGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gYm9hcmRzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFNoYXJlZE5vdGVzKCkuJGJpbmRUbygkc2NvcGUsICdzaGFyZWRub3RlcycpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHQkc2NvcGUuc2hhcmVkRmlsdGVyID0gZnVuY3Rpb24oZSl7XG5cblx0XHRcdFx0dmFyIHNoYXJlZCA9IFtdO1xuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChlLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1xuXHRcdFx0XHRcdFx0aWYgKCFlLmxhc3RFZGl0ZWQpIGUubGFzdEVkaXRlZCA9IERhdGUubm93KCk7XG5cblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24oZiwgbCl7XG5cdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHQobCA9PSB3aW5kb3cudWlkIHx8IGwgPT0gJGNvb2tpZXMuZW1haWxfZXNjYXBlZCkgXG5cdFx0XHRcdFx0XHRcdFx0JiYgKCFlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQpXG5cdFx0XHRcdFx0XHRcdCl7XG5cdFx0XHRcdFx0XHRcdFx0c2hhcmVkLnB1c2goZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkc2NvcGUuc2hhcmVkQ291bnQgPSBzaGFyZWQubGVuZ3RoO1xuXG5cdFx0XHRcdHJldHVybiBzaGFyZWQ7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnZXNjJywgJ3RhYicsICdyaWdodCcsICdsZWZ0J10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoJHNjb3BlLmxvb2tpbmdBdCA9PT0gJ2JvYXJkcycpXG5cdFx0XHRcdFx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0ID0gJ25vdGVzJztcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5sb29raW5nQXQgPSB3aW5kb3cubGlzdExvb2tpbmdBdCA9ICdib2FyZHMnO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cbiAgICAkc2NvcGUuY29uY2VudHJpYyA9IGZ1bmN0aW9uKCl7XG4gICAgXHRjb25jZW50cmljaXR5KCk7XG4gICAgfTtcblxuXHRpZiAod2luZG93Lmhpc3RvcmljYWwubGVuZ3RoID4gMiAmJiB3aW5kb3cuaGlzdG9yaWNhbFt3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggLSAyXS5pbmRleE9mKCdib2FyZCcpID4gMClcblx0XHQkc2NvcGUubG9va2luZ0F0ID0gd2luZG93Lmxpc3RMb29raW5nQXQgPSAnYm9hcmRzJztcblxuXHQkc2NvcGUubG9va2luZ0F0ID0gd2luZG93Lmxpc3RMb29raW5nQXQ7XG5cblx0JHNjb3BlLiR3YXRjaCgnbG9va2luZ0F0JywgZnVuY3Rpb24oKXtcblx0XHQkKCdib2R5Jykuc2Nyb2xsVG9wKDApXG5cdFx0d2luZG93Lmxpc3RMb29raW5nQXQgPSAkc2NvcGUubG9va2luZ0F0O1xuXHR9KTtcblxuXHRoaXN0b3J5Q291bnQoZnVuY3Rpb24odGhlTnVtYmVyKXtcblx0XHQkc2NvcGUuaGlzdG9yeUNvdW50ZXIgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoZU51bWJlcjtcblx0XHR9XG5cdH0pXG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3Tm90ZSgpKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH07XG5cblx0JHNjb3BlLm5ld0JvYXJkID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyBuZXdCb2FyZCgpKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH07XG5cblx0JHNjb3BlLmtpbGxOb3RlID0gZnVuY3Rpb24oaWQpe1xuXHRcdGtpbGxOb3RlKGlkKTtcblx0fVxuXG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdExvZ291dCgpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fVxuXG5cdCRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS50b2dnbGVDbGFzcygnbW9iaWxlTWVudU9wZW4nKTtcdFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZU1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykucmVtb3ZlQ2xhc3MoJ21vYmlsZU1lbnVPcGVuJyk7XHRcblx0fTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkY29udHJvbGxlcixcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdE5vdGUsXG5cdHNoYXJlZE5vdGUsXG5cdG5ld05vdGUsXG5cdGtpbGxOb3RlLFxuXHRzaGFyZU5vdGUsXG5cdG5ld0JpdCxcblx0JHJvdXRlUGFyYW1zLCBcblx0JHJvdXRlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JGNvb2tpZXMsXG5cdExvZ291dCxcblx0Y29uY2VudHJpY2l0eSxcblx0TWV0YSxcblx0aGlzdG9yeUNvdW50XG4pIHtcblxuXHQkc2NvcGUudG91Y2h5ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gd2luZG93LmlzX3RvdWNoX2RldmljZSgpO1xuXHR9XG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG5cdHZhciBzaG93aW5nQ2hlYXRzaGVldCA9IGZhbHNlO1xuXHRcblx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSBmYWxzZTtcblx0JHNjb3BlLmFsdElzUHJlc3NlZCA9IGZhbHNlO1xuXHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gZmFsc2U7XG4gICAgJHNjb3BlLnNoYXJlUHJvbXB0ID0gZmFsc2U7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdub3RlJztcblxuICAgICRzY29wZS5maWx0ZXJlZCA9IGZhbHNlO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKVxuXG4gICAgdmFyIGtleXNVcCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHQkc2NvcGUuYWx0SXNQcmVzc2VkID0gZmFsc2U7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcbiAgICB9XG5cbiAgICAkKHdpbmRvdykub24oe1xuICAgIFx0Ymx1cjoga2V5c1VwLFxuICAgIFx0Zm9jdXM6IGtleXNVcFxuICAgIH0pO1xuXG4gICAgJHNjb3BlLmNvbmNlbnRyaWMgPSBmdW5jdGlvbigpe1xuICAgIFx0Y29uY2VudHJpY2l0eSgpO1xuICAgIH07XG5cbiAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKS5pbmRleE9mKCdzaGFyZWQnKSA+IDApe1xuXG4gICAgXHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKSB7XG5cdFx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHRcdFx0JHNjb3BlLm9uTm90ZU9wZW4oKTtcblx0XHRcdH0pO1xuXG4gICAgfWVsc2V7XG5cdFx0Tm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcikge1xuXHRcdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdFx0aWYgKHR5cGVvZigkc2NvcGUubm90ZS5ib2R5KSA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdG5ld05vdGUoJycsICRyb3V0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLm9uTm90ZU9wZW4oKTtcblx0XHRcdH0pO1xuICAgIH1cblxuICAgICRzY29wZS5vbk5vdGVPcGVuID0gZnVuY3Rpb24oKXtcbiAgICBcdCRzY29wZS5jbG9zZUJpdE1lbnVzKCk7XG4gICAgXHQkc2NvcGUudW5zZWxlY3RvcigpO1xuICAgIFx0JHNjb3BlLm5vdGUua2lsbCA9IGZhbHNlO1xuXG4gICAgXHRpZiAoJHNjb3BlLm5vdGUudGl0bGUgPT09ICcnKVxuICAgIFx0XHQkKCcubm90ZV90aXRsZSB0ZXh0YXJlYScpLmZvY3VzKClcbiAgICB9XG5cbiAgICBNZXRhKCkuJGJpbmRUbygkc2NvcGUsICdtZXRhJylcbiAgICBcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcbiAgICBcdH0pXG5cbiAgICAkc2NvcGUuc2hhcmVBY3RpdmUgPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignc2hhcmVkJykgPiAwKVxuICAgIFx0XHRyZXR1cm4gdHJ1ZVxuICAgIFx0ZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cblxuXHQvLyBjb25zb2xlLmxvZygkc2NvcGUudXBsb2FkZXIpXG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCAgICxhZDg4ODhiYSwgODg4ODg4ODg4ODg4IDg4ICAgICAgYThQICA4ODg4ODg4ODg4OCA4YiAgICAgICAgZDggYWQ4ODg4OGJhICAgXG5cdC8vIFx0ODggICAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgICAgODggICAgICA4OCAgICAsODgnICAgODggICAgICAgICAgIFk4LCAgICAsOFAgZDhcIiAgICAgXCI4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IGQ4JyAgICAgICAgYDhiICAgIDg4ICAgICAgODggICw4OFwiICAgICA4OCAgICAgICAgICAgIFk4LCAgLDhQICBZOCwgICAgICAgICAgXG5cdC8vIFx0ODhhYWFhYWFhYTg4IDg4ICAgICAgICAgIDg4ICAgIDg4ICAgICAgODgsZDg4JyAgICAgIDg4YWFhYWEgICAgICAgIFwiOGFhOFwiICAgYFk4YWFhYWEsICAgIFxuXHQvLyBcdDg4XCJcIlwiXCJcIlwiXCJcIjg4IDg4ICAgICAgICAgIDg4ICAgIDg4ICAgICAgODg4OFwiODgsICAgICA4OFwiXCJcIlwiXCIgICAgICAgICBgODgnICAgICAgYFwiXCJcIlwiXCI4YiwgIFxuXHQvLyBcdDg4ICAgICAgICA4OCBZOCwgICAgICAgICw4UCAgICA4OCAgICAgIDg4UCAgIFk4YiAgICA4OCAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgIGA4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4ICBZOGEuICAgIC5hOFAgICAgIDg4ICAgICAgODggICAgIFwiODgsICA4OCAgICAgICAgICAgICAgIDg4ICAgICBZOGEgICAgIGE4UCAgXG5cdC8vIFx0ODggICAgICAgIDg4ICAgYFwiWTg4ODhZXCInICAgICAgODggICAgICA4OCAgICAgICBZOGIgODg4ODg4ODg4ODggICAgICA4OCAgICAgIFwiWTg4ODg4UFwiICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnPycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHt9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnYWx0Jyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnSG9sZCBkb3duIHRvIGVkaXQgcGFzdGVkIGxpbmtzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdBTFRfRE9XTicpXG5cdFx0XHRcdCRzY29wZS5hbHRJc1ByZXNzZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2FsdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5dXAnLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0FMVF9VUCcpXG5cdFx0XHRcdCRzY29wZS5hbHRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCcsICdjdHJsJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0hvbGQgZG93biB0byBzZWxlY3QgYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuY29tbWFuZElzUHJlc3NlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQnLCAnY3RybCddLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleXVwJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5jb21tYW5kSXNQcmVzc2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2VudGVyJywgJ3NoaWZ0K2VudGVyJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FkZCBuZXcgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXG5cdFx0XHRcdFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0aWYgKF9pc0JpdCgpKXtcblx0XHRcdFx0XHRcdGlmICgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5jb250ZW50ICE9PSAnJylcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmFkZEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKF9iaXRJbmRleCgpICE9PSAwKXtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uZ2FwID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRfZm9jdXNNZSgwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2VudGVyJywgJ2N0cmwrZW50ZXInXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnYWRkIGEgbGl0dGxlIHNwYWNlIGFib3ZlIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgX2lzQml0KCkpe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcCA9ICEkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXA7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2JhY2tzcGFjZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBcblx0XHRcdFx0XHRfaXNUZXh0YXJlYSgpICYmIFxuXHRcdFx0XHRcdCgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5jb250ZW50ID09PSAnJylcblx0XHRcdFx0KXtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQgPiAwKVxuXHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQtLTtcblx0XHRcdFx0XHRlbHNlIGlmICgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXApXG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXAgPSBmYWxzZTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHQkc2NvcGUua2lsbEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrYmFja3NwYWNlJywgJ2N0cmwrYmFja3NwYWNlJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBEZWxldGUgdGhpcyBiaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSApe1xuXHRcdFx0XHRcdCRzY29wZS5raWxsQml0KCBfYml0SW5kZXgoKSApO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtzaGlmdCtiYWNrc3BhY2UnLCAnY3RybCtzaGlmdCtiYWNrc3BhY2UnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVsZXRlIHRoaXMgbm90ZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUua2lsbCAmJiAkc2NvcGUua2lsbE5vdGUoKTsgXG5cdFx0XHRcdCRzY29wZS5ub3RlLmtpbGwgPSAhJHNjb3BlLm5vdGUua2lsbDtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsndGFiJywgJ2NvbW1hbmQrXScsICdjdHJsK10nXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIEluZGVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSAmJiBfaXNCaXQoKSApe1xuXHRcdFx0XHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRhYkluKGspO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9ZWxzZVxuXHRcdFx0XHRcdFx0JHNjb3BlLnRhYkluKF9iaXRJbmRleCgpKTtcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoIF9pc1RleHRhcmVhKCkgKVxuXHRcdFx0XHRcdF9mb2N1c01lKDApO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydzaGlmdCt0YWInLCAnY29tbWFuZCtbJywgJ2N0cmwrWyddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgT3V0ZGVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSAmJiBfaXNCaXQoKSApe1xuXHRcdFx0XHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRhYk91dChrKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fWVsc2Vcblx0XHRcdFx0XHRcdCRzY29wZS50YWJPdXQoX2JpdEluZGV4KCkpO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtzaGlmdCtkJywgJ2N0cmwrc2hpZnQrZCddLFxuXHRcdFx0Ly8gZGVzY3JpcHRpb246ICdEdXBsaWNhdGUgY3VycmVudGx5IHNlbGVjdGVkIGJpdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHRpZiAoX2lzQml0KCkpe1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdCRzY29wZS5hZGRCaXQoIF9iaXRJbmRleCgpLCAkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5jb250ZW50ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ3VwJywgJ2Rvd24nXSxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhldmVudClcblx0XHRcdFx0XHQkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdFx0XHRcdCRzY29wZS5jYXJldFRyYWNrZXIoX2JpdEluZGV4KCksIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUuanVtcEFyb3VuZChfYml0SW5kZXgoKSwgZXZlbnQua2V5SWRlbnRpZmllciwgZmFsc2UpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVx0XHRcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQrdXAnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKSAtIDFdLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0X2ZvY3VzTWUoX2JpdEluZGV4KCkgLSAxKTtcblx0XHRcdFx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IHRydWU7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQrZG93bicsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpICsgMV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRfZm9jdXNNZShfYml0SW5kZXgoKSArIDEpO1xuXHRcdFx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gdHJ1ZTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY3RybCt1cCcsICdjdHJsK2Rvd24nXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnUXVpY2tseSBqdW1wIGJldHdlZW4gYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0JHNjb3BlLmp1bXBBcm91bmQoX2JpdEluZGV4KCksIGV2ZW50LmtleUlkZW50aWZpZXIsIHRydWUpO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdjdHJsK2NvbW1hbmQrdXAnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgU3dhcCBiaXQgdXAnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHQkc2NvcGUubW92ZVVwKF9iaXRJbmRleCgpKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdjdHJsK2NvbW1hbmQrZG93bicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBTd2FwIGJpdCBkb3duJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0JHNjb3BlLm1vdmVEb3duKF9iaXRJbmRleCgpKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCt4JywgJ2N0cmwreCddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdDdXQgc2VsZWN0ZWQgYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCAhX2lzVGV4dFNlbGVjdGVkKCQoZXZlbnQudGFyZ2V0KVswXSkgKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0JHNjb3BlLmN1dCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2MnLCAnY3RybCtjJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0NvcHkgc2VsZWN0ZWQgYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCAhX2lzVGV4dFNlbGVjdGVkKCQoZXZlbnQudGFyZ2V0KVswXSkgKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0JHNjb3BlLmN1dChmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCt2JywgJ2N0cmwrdiddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdQYXN0ZSBjdXQgYml0cyAob3IganVzdCBwYXN0ZSB0aGUgY29udGVudHMgb2YgeW91ciBjbGlwYm9hcmQpJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cuY2xpcGJvYXJkZWQpXG5cdFx0XHRcdGlmICh3aW5kb3cuY2xpcGJvYXJkZWQpe1xuXHRcdFx0XHRcdCRzY29wZS5wYXN0ZSgpO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5wYXJzZVBhc3RlZChfYml0SW5kZXgoKSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQgc2hpZnQnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgVG9nZ2xlIHRoaXMgYml0IGFzIG1hcmtlZCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXHRcdFx0XHRcdC8vICRzY29wZS51bnNlbGVjdG9yKCk7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdFx0XHRpZiAoZS5zZWxlY3RlZClcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUubWFyayhrKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQkc2NvcGUubWFyayhfYml0SW5kZXgoKSlcblx0XHRcdFx0XHRcdC8vICRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1hcmsgPSAhJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0ubWFyaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY3RybCtzaGlmdCBjdHJsK3NoaWZ0JywgJ2NvbW1hbmQrc2hpZnQgY29tbWFuZCtzaGlmdCddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdUb2dnbGUgdGhpcyBub3RlIGFzIG1hcmtlZCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkc2NvcGUubm90ZS5tYXJrID0gISRzY29wZS5ub3RlLm1hcms7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnQ2xvc2Ugbm90ZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cdFx0XHRcdFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChzaG93aW5nQ2hlYXRzaGVldCl7XG5cdFx0XHRcdFx0c2hvd2luZ0NoZWF0c2hlZXQgPSBmYWxzZTtcblx0XHRcdFx0XHRob3RrZXlzLnRvZ2dsZUNoZWF0U2hlZXQoKTtcblx0XHRcdFx0Ly8gfWVsc2UgaWYgKCRzY29wZS5zaGFyZVByb21wdCl7XG5cdFx0XHRcdC8vIFx0JHNjb3BlLnNoYXJlUHJvbXB0ID0gZmFsc2U7XHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5jbG9zZU5vdGUoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdhbHQrc2hpZnQrLycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1Nob3cgdGhpcyBoYW5keSBndWlkZSA6KScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHNob3dpbmdDaGVhdHNoZWV0ID0gIXNob3dpbmdDaGVhdHNoZWV0O1xuXHRcdFx0XHRob3RrZXlzLnRvZ2dsZUNoZWF0U2hlZXQoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ODg4ODg4ODg4IDg4ICAgICAgICA4OCA4ODhiICAgICAgODggICAsYWQ4ODg4YmEsIDg4ODg4ODg4ODg4OCA4OCAgICxhZDg4ODhiYSwgICA4ODhiICAgICAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4ODg4YiAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgODg4OGIgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICA4OCAgICAgICAgODggODggYDhiICAgIDg4IGQ4JyAgICAgICAgICAgICAgIDg4ICAgICAgODggZDgnICAgICAgICBgOGIgODggYDhiICAgIDg4ICBcblx0Ly8gXHQ4OGFhYWFhICAgICA4OCAgICAgICAgODggODggIGA4YiAgIDg4IDg4ICAgICAgICAgICAgICAgIDg4ICAgICAgODggODggICAgICAgICAgODggODggIGA4YiAgIDg4ICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICA4OCA4OCAgIGA4YiAgODggODggICAgICAgICAgICAgICAgODggICAgICA4OCA4OCAgICAgICAgICA4OCA4OCAgIGA4YiAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4OCAgICBgOGIgODggWTgsICAgICAgICAgICAgICAgODggICAgICA4OCBZOCwgICAgICAgICw4UCA4OCAgICBgOGIgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIFk4YS4gICAgLmE4UCA4OCAgICAgYDg4ODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgWThhLiAgICAuYThQICA4OCAgICAgYDg4ODggIFxuXHQvLyBcdDg4ICAgICAgICAgICBgXCJZODg4OFlcIicgIDg4ICAgICAgYDg4OCAgIGBcIlk4ODg4WVwiJyAgICAgIDg4ICAgICAgODggICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4ODggIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdCRzY29wZS5hZGRCaXQgPSBmdW5jdGlvbihpbmRleCwgY29udGVudCl7XG5cdFx0dmFyIGluY29taW5nQ29udGVudDtcblxuXHRcdGlmICh0eXBlb2YoY29udGVudCkgPT09ICd1bmRlZmluZWQnKVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gJyc7XG5cdFx0ZWxzZVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gY29udGVudDtcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCArIDEsIDAsIG5ld0JpdChcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQsXG5cdFx0XHRcdGluY29taW5nQ29udGVudFxuXHRcdFx0KSk7XG5cblx0XHRcdCRzY29wZS5wYXJzZUxpbmsoaW5kZXgpO1xuXG5cdFx0XHRfZm9jdXNNZShpbmRleCArIDEpO1xuXHRcdH0sIDUwKTtcblx0fTtcblxuXHQkc2NvcGUucGFyc2VQYXN0ZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdC8vIHNwbGl0IGF0IGxpbmUgYnJlYWtzXG5cdFx0XHR2YXIgdGhlQ29udGVudCA9ICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQuc3BsaXQoJ1xcbicpLFxuXHRcdFx0XHR0b1JlbW92ZSA9IFtdO1xuXG5cdFx0XHQvLyByZW1vdmUgZW1wdHkgbGluZXNcblx0XHRcdGZvciAodmFyIGwgPSAwOyBsIDwgdGhlQ29udGVudC5sZW5ndGg7IGwrKyl7XG5cdFx0XHRcdGlmICghdGhlQ29udGVudFtsXSlcblx0XHRcdFx0XHR0b1JlbW92ZS5wdXNoKGwpXG5cdFx0XHR9XG5cblx0XHRcdGZvciAodmFyIHIgPSB0b1JlbW92ZS5sZW5ndGggLSAxOyByID49IDAgOyByLS0pe1xuXHRcdFx0XHR0aGVDb250ZW50LnNwbGljZSh0b1JlbW92ZVtyXSwgMSlcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2V0IGJsb2NrIHRvIGVtcHR5IGJlZm9yZSByZXBsYWNpbmcgdy8gMXN0IGxpbmVcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQgPSAnJztcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQgPSB0aGVDb250ZW50WzBdO1xuXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSAnJztcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IHRoZUNvbnRlbnRbMF07XG5cblx0XHRcdCRzY29wZS5wYXJzZUxpbmsoaW5kZXgpO1xuXG5cdFx0XHRmb3IgKHZhciBsID0gMTsgbCA8IHRoZUNvbnRlbnQubGVuZ3RoOyBsKyspe1xuXHRcdFx0XHQkc2NvcGUuYWRkQml0KGluZGV4ICsgKGwgLSAxKSwgdGhlQ29udGVudFtsXSk7XG5cdFx0XHR9XG5cdFx0fSwgNTApOyBcblx0fVxuXG5cdCRzY29wZS5wYXJzZUxpbmsgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0dmFyIGNvbnRlbnQgPSAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50O1xuXG5cdFx0aWYgKFxuXHRcdFx0Y29udGVudC5pbmRleE9mKFwiaHR0cDovL1wiKSA9PT0gMCB8fFxuXHRcdFx0Y29udGVudC5pbmRleE9mKFwiaHR0cHM6Ly9cIikgPT09IDAgXG5cdFx0KXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdPSCBOT0VTIEEgTElOSycpXG5cblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHRcdGRhdGFUeXBlOidKU09OUCcsXG5cdFx0XHRcdGRhdGE6e1xuXHRcdFx0XHRcdFVSTDogY29udGVudFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR1cmw6IFwiaHR0cDovL3JlLmplY3QuY2gvdHJhL3BocC90aXRsZS5waHBcIlxuXHRcdFx0fSkuZG9uZSggZnVuY3Rpb24odGhlVGl0bGUpe1xuXHRcdFx0XHR2YXIgZXNjYXBlZFRpdGxlID0gXy51bmVzY2FwZSh0aGVUaXRsZS50aXRsZSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVzY2FwZWRUaXRsZSlcblxuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gZXNjYXBlZFRpdGxlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSBlc2NhcGVkVGl0bGU7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmFkZHJlc3MgPSBjb250ZW50O1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5pc0xpbmsgPSB0cnVlO1xuXG5cdFx0XHRcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cblx0JHNjb3BlLm9wZW5MaW5rID0gZnVuY3Rpb24oYml0LCBldmVudCl7XG5cdFx0aWYgKGJpdC5pc0xpbmsgJiYgISRzY29wZS5hbHRJc1ByZXNzZWQpe1xuXHRcdFx0dmFyIHdpbjtcblx0XHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXG5cdFx0XHRpZiAod2luZG93LmlzTW9iaWxlQXBwKXtcblx0XHRcdFx0d2luID0gY29yZG92YS5JbkFwcEJyb3dzZXIub3BlbihiaXQuYWRkcmVzcywgJ19zeXN0ZW0nKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR3aW4gPSB3aW5kb3cub3BlbihiaXQuYWRkcmVzcywgJ19ibGFuaycpO1xuXHRcdFx0XHR3aW4uZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQkc2NvcGUua2lsbEJpdCA9IGZ1bmN0aW9uKGluZGV4KXtcblxuXHRcdGlmIChpbmRleClcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnNlbGVjdGVkID0gdHJ1ZTtcblxuXHRcdHZhciB0ZW1wQm9keSA9IFtdO1xuXHRcdGFuZ3VsYXIuY29weSgkc2NvcGUubm90ZS5ib2R5LCB0ZW1wQm9keSk7XG5cblx0XHRhbmd1bGFyLmZvckVhY2godGVtcEJvZHkucmV2ZXJzZSgpLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0dmFyIHJldmVyc2VUYXJnZXQgPSBNYXRoLmFicyh0ZW1wQm9keS5sZW5ndGggLSBrKSAtIDE7XG5cblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShyZXZlcnNlVGFyZ2V0LCAxKTtcblx0XHRcdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICgkc2NvcGUubm90ZS5ib2R5Lmxlbmd0aCA+IDApe1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggLSAxKVxuXHRcdH1lbHNle1xuXHRcdFx0YWRkQml0KDApO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubW92ZVVwID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaywgMSlbMF07XG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShrIC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKF9iaXRJbmRleCgpLCAxKVswXTtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4IC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRfZm9jdXNNZShpbmRleCAtIDEpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubW92ZURvd24gPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0dmFyIGJvZHlDb3B5ID0gYW5ndWxhci5jb3B5KCRzY29wZS5ub3RlLmJvZHkpO1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goYm9keUNvcHkucmV2ZXJzZSgpLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciByZXZlcnNlVGFyZ2V0ID0gTWF0aC5hYnMoYm9keUNvcHkubGVuZ3RoIC0gaykgLSAxO1xuXHRcdFx0XHRcdFx0dmFyIHRoaXNCaXQgPSAkc2NvcGUubm90ZS5ib2R5LnNwbGljZShyZXZlcnNlVGFyZ2V0LCAxKVswXTtcblx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKHJldmVyc2VUYXJnZXQgKyAxLCAwLCB0aGlzQml0KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoX2JpdEluZGV4KCksIDEpWzBdO1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXggKyAxLCAwLCB0aGlzQml0KTtcblx0XHRcdF9mb2N1c01lKGluZGV4ICsgMSk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS50YWJPdXQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50ID4gMCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudC0tO1xuXHRcdH1lbHNle1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggLSAxKTtcblx0XHR9XG5cblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCA3NjgpXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4gPSBmYWxzZTtcblx0fVxuXG5cdCRzY29wZS50YWJJbiA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQgPCAzKXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50Kys7XG5cdFx0fWVsc2V7XG5cdFx0XHRfZm9jdXNNZShpbmRleCArIDEpO1xuXHRcdH1cblxuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OClcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHR9XG5cblx0JHNjb3BlLmNhcmV0VHJhY2tlciA9IGZ1bmN0aW9uKGluZGV4LCBjYWxsYmFjayl7XG5cdFx0dmFyIHRoZUJpdCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsXG5cdFx0XHRjdXJyZW50Q2FyZXQgPSB0aGVCaXQuc2VsZWN0aW9uU3RhcnQsXG5cdFx0XHR0aGVWYWx1ZSA9IHRoZUJpdC52YWx1ZTtcblxuXHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IFxuXHRcdFx0dGhlVmFsdWUuc3Vic3RyaW5nKDAsIGN1cnJlbnRDYXJldCkgKyBcblx0XHRcdCc8c3BhbiBjbGFzcz1cImhpZGRlbkNhcmV0XCI+PC9zcGFuPicgKyBcblx0XHRcdHRoZVZhbHVlLnN1YnN0cmluZyhjdXJyZW50Q2FyZXQsIHRoZVZhbHVlLmxlbmd0aClcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKSBjYWxsYmFjaygpO1xuXHRcdH0pXG5cdH1cblxuXHQkc2NvcGUuYXV0b1NpemVyID0gZnVuY3Rpb24oaW5kZXgsIGV2ZW50LCBjb250ZW50KXtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSAhPT0gMTMpe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gY29udGVudDtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUuaGlzdG9yaWNhbCA9IF8uZGVib3VuY2UoZnVuY3Rpb24oKXtcblx0XHRpZiAoISRzY29wZS5tZXRhLmhpc3RvcnkpXG5cdFx0XHQkc2NvcGUubWV0YS5oaXN0b3J5ID0ge307XG5cblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcblxuXHRcdCRzY29wZS5ub3RlLmxhc3RFZGl0ZWQgPSBub3c7XG5cblx0XHR2YXIgaGlzdG9yaWNhbE1hcmtlciA9IHtcblx0XHRcdHRpdGxlOiAkc2NvcGUubm90ZS50aXRsZSxcdFx0XG5cdFx0XHRkZXZpY2U6IHdpbmRvdy5kZXZpY2UsXG5cdFx0XHR0aW1lOiBub3csXG5cdFx0XHRzZWVuOiBmYWxzZSxcblx0XHRcdHNoYXJlZDogJHNjb3BlLnNoYXJlQWN0aXZlKCksXG5cdFx0XHRlZGl0b3I6ICRjb29raWVzLmVtYWlsX2VzY2FwZWQsXG5cdFx0XHR1aWQ6IHdpbmRvdy51aWRcblx0XHR9XG5cblx0XHRpZiAoJHNjb3BlLnNoYXJlQWN0aXZlKCkpe1xuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24odiwgayl7XG5cdFx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHYudWlkICsgJy9tZXRhL2hpc3RvcnkvJyArICRzY29wZS5ub3RlLmlkKTtcblx0XHRcdFx0cmVmLnNldChoaXN0b3JpY2FsTWFya2VyKVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkc2NvcGUubWV0YS5oaXN0b3J5WyRzY29wZS5ub3RlLmlkXSA9IGhpc3RvcmljYWxNYXJrZXI7XG5cdFx0fVxuXG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcmVudCl7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ib2FyZHMvJyArICRzY29wZS5ub3RlLnBhcmVudCArICcvbGFzdEVkaXRlZCcpO1xuXHRcdFx0cmVmLnNldChub3cpXG5cdFx0fWVsc2UgaWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cyAmJiAkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbF9lc2NhcGVkXS5wYXJlbnQpe1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArICRzY29wZS5ub3RlLmlkICsgJy9wYXJ0aWNpcGFudHMvJyArIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWxfZXNjYXBlZCArICcvbGFzdEVkaXRlZCcpO1xuXHRcdFx0cmVmLnNldChub3cpXG5cdFx0fVxuXG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHRcdH0pXG5cblx0XHRjb25zb2xlLmxvZygnSElTVE9SSUNBTCcpXG5cdH0sIDUwMDApXG5cblxuXHQkc2NvcGUuanVtcEFyb3VuZCA9IGZ1bmN0aW9uKGluZGV4LCBrZXksIGp1c3Rnbyl7XG5cdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsIGtleSwganVzdGdvKVxuXHRcdHZhciAkdGhlQml0ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSxcblx0XHRcdCR0aGVDYXJldCA9ICR0aGVCaXQuc2libGluZ3MoJy50ZXh0YXJlYS1hdXRvc2l6ZScpLmZpbmQoJy5oaWRkZW5DYXJldCcpLFxuXHRcdFx0dGhlQ2FyZXRQb3MgPSAkdGhlQ2FyZXQucG9zaXRpb24oKS50b3AsXG5cdFx0XHR0aGVDYXJldEhlaWdodCA9IDI3O1xuXG5cdFx0aWYgKCBcblx0XHRcdChcblx0XHRcdFx0KGtleSA9PT0gJ1VwJykgJiYgXG5cdFx0XHRcdCh0aGVDYXJldFBvcyA8IHRoZUNhcmV0SGVpZ2h0IC0gMSkgXG5cdFx0XHQpfHwoXG5cdFx0XHRcdChrZXkgPT09ICdVcCcpICYmIFxuXHRcdFx0XHRqdXN0Z29cblx0XHRcdClcblx0XHQpe1xuXHRcdFx0JHRoZUJpdC5wYXJlbnRzKCcubm90ZV9iaXQnKVxuXHRcdFx0XHQucHJldignLm5vdGVfYml0JykuZmluZCgndGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKVxuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0KGtleSA9PT0gJ0Rvd24nKSAmJiBcblx0XHRcdFx0KHRoZUNhcmV0UG9zID49ICgkdGhlQ2FyZXQucGFyZW50KCkuaGVpZ2h0KCkgLSAodGhlQ2FyZXRIZWlnaHQpKSkgXG5cdFx0XHQpfHwoXG5cdFx0XHRcdChrZXkgPT09ICdEb3duJykgJiYgXG5cdFx0XHRcdGp1c3Rnb1xuXHRcdFx0KVxuXHRcdCl7XG5cdFx0XHQkdGhlQml0LnBhcmVudHMoJy5ub3RlX2JpdCcpXG5cdFx0XHRcdC5uZXh0KCcubm90ZV9iaXQnKS5maW5kKCd0ZXh0YXJlYScpXG5cdFx0XHRcdC5mb2N1cygpXG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KGtleSA9PT0gJ0Rvd24nKSAmJlxuXHRcdFx0KGluZGV4ID09PSAkc2NvcGUubm90ZS5ib2R5Lmxlbmd0aCAtIDEpXG5cdFx0KXtcblx0XHRcdCRzY29wZS5hZGRCaXQoaW5kZXgpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubWFyayA9IGZ1bmN0aW9uKGluZGV4LCBvcHRpb25hbCl7XG5cdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcmssICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3Blbiwgb3B0aW9uYWwpXG5cblx0XHRpZiAoKG9wdGlvbmFsICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4KSB8fCAhb3B0aW9uYWwpe1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWFyayA9ICEkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tYXJrO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4gPSBmYWxzZTtcblx0XHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcmssICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3Blbilcblx0XHRcdH0pXG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbihjb250ZW50LCBpbmRlbnQsIGluZGV4KXtcblx0XHRjb25zb2xlLmxvZyhjb250ZW50LCBpbmRlbnQsIGluZGV4KVxuXHRcdGlmIChpbmRlbnQgPiAwKXtcblx0XHRcdHF1ZXJ5ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleCAtIDFdLmNvbnRlbnQgKyAnICcgKyBjb250ZW50O1xuXHRcdH1lbHNle1xuXHRcdFx0cXVlcnkgPSBjb250ZW50O1xuXHRcdH1cblxuXHRcdHZhciB3aW4gPSB3aW5kb3cub3BlbignaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT0nICsgcXVlcnksICdfYmxhbmsnKTtcblx0ICAgIHdpbi5mb2N1cygpOyBcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VCaXRNZW51cyA9IGZ1bmN0aW9uKGV4Y2VwdCl7XG5cdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0aWYgKHR5cGVvZihlLm1lbnVfb3BlbikgIT09ICd1bmRlZmluZWQnICYmIGUuYml0SUQgIT09IGV4Y2VwdClcblx0XHRcdFx0ZS5tZW51X29wZW4gPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHQkc2NvcGUudG9nZ2xlQml0TWVudSA9IGZ1bmN0aW9uKGluZGV4LCBldmVudCl7XG5cdFx0aWYgKCEkc2NvcGUuY29tbWFuZElzUHJlc3NlZCl7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdCRzY29wZS5jbG9zZUJpdE1lbnVzKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmJpdElEKTtcblxuXHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbiA9ICEkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW47XG5cblx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuKXtcblx0XHRcdCRzY29wZS5tZW51aW5nID0gdHJ1ZTtcblx0XHR9ZWxzZXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5tZW51aW5nID0gZmFsc2U7XHRcdFx0XG5cdFx0XHR9LCAzMDApXG5cdFx0fVxuXHR9XG5cblxuXHR2YXIgaW5zZXJ0SW5kZXg7XG5cblx0JHNjb3BlLnNlbGVjdG9yID0gZnVuY3Rpb24oaW5kZXgsIGV2ZW50KXtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRpZiAoJHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQpe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uc2VsZWN0ZWQgPSAhJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uc2VsZWN0ZWQ7XG5cdFx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdFx0aW5zZXJ0SW5kZXggPSBfYml0SW5kZXgoKTtcblx0fVxuXG5cdCRzY29wZS51bnNlbGVjdG9yID0gZnVuY3Rpb24oZXhjZXB0KXtcblx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRlLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHRcdH0pO1xuXHRcdCRzY29wZS5zZWxlY3RlZEJpdHMgPSBmYWxzZTtcblx0fTtcblxuXG5cdCRzY29wZS5jdXQgPSBmdW5jdGlvbihraWxsKXtcblx0XHR3aW5kb3cuY2xpcGJvYXJkID0gW107XG5cblx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdHdpbmRvdy5jbGlwYm9hcmQucHVzaChlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChraWxsKVxuXHRcdFx0JHNjb3BlLmtpbGxCaXQoKTtcblxuXHRcdHdpbmRvdy5jbGlwYm9hcmRlZCA9IHRydWU7IFxuXHR9O1xuXG5cdCRzY29wZS5wYXN0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2cod2luZG93LmNsaXBib2FyZClcblx0XHRhbmd1bGFyLmZvckVhY2god2luZG93LmNsaXBib2FyZCwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZSgoaW5zZXJ0SW5kZXggKyBrKSArIDEsIDAsIGUpXG5cdFx0fSk7XG5cblx0XHQkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdHdpbmRvdy5jbGlwYm9hcmQgPSBbXTtcblx0XHR3aW5kb3cuY2xpcGJvYXJkZWQgPSBmYWxzZTtcblx0fTtcblxuXHQkc2NvcGUuaXNGb2N1c2VkID0gZnVuY3Rpb24oZGVjaXNpb24pe1xuXHRcdGlmIChkZWNpc2lvbil7XG5cdFx0XHQkc2NvcGUuZm9jdXNlZCA9IHRydWU7XG5cdFx0fWVsc2V7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkc2NvcGUuZm9jdXNlZCA9IGZhbHNlO1xuXHRcdFx0fSwgNTApO1xuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5zd2lwZSA9IGZ1bmN0aW9uKGluZGV4LCBkaXJlY3Rpb24pe1xuXHRcdGNvbnNvbGUubG9nKCRzY29wZS5ub0VkaXQpXG5cdFx0aWYgKCRzY29wZS5ub0VkaXQpe1xuXHRcdFx0JHNjb3BlLm1hcmsoaW5kZXgsIHRydWUpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jylcblx0XHRcdCRzY29wZS50YWJPdXQoaW5kZXgpO1x0XG5cdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKVxuXHRcdFx0JHNjb3BlLnRhYkluKGluZGV4KTtcblxuXHR9XG5cblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4YiAgICAgICAgICAgZDg4IDg4ODg4ODg4ODg4IDg4OGIgICAgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4OGIgICAgICAgICBkODg4IDg4ICAgICAgICAgIDg4ODhiICAgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4YDhiICAgICAgIGQ4Jzg4IDg4ICAgICAgICAgIDg4IGA4YiAgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4IGA4YiAgICAgZDgnIDg4IDg4YWFhYWEgICAgIDg4ICBgOGIgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICBgOGIgICBkOCcgIDg4IDg4XCJcIlwiXCJcIiAgICAgODggICBgOGIgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggICBgOGIgZDgnICAgODggODggICAgICAgICAgODggICAgYDhiIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggICAgYDg4OCcgICAgODggODggICAgICAgICAgODggICAgIGA4ODg4IFk4YS4gICAgLmE4UCAgXG5cdC8vIFx0ODggICAgIGA4JyAgICAgODggODg4ODg4ODg4ODggODggICAgICBgODg4ICBgXCJZODg4OFlcIicgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICBcblxuXHQkc2NvcGUubmV3Tm90ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG5ld0lEID0gbmV3Tm90ZSgkc2NvcGUubm90ZS5wYXJlbnQpO1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3SUQpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUua2lsbE5vdGUgPSBmdW5jdGlvbigpe1xuXHRcdGtpbGxOb3RlKCRzY29wZS5ub3RlLmlkLCAkc2NvcGUubm90ZS5wYXJlbnQpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUuc2hvd0NoZWF0U2hlZXQgPSBmdW5jdGlvbigpe1xuXHRcdGhvdGtleXMudG9nZ2xlQ2hlYXRTaGVldCgpXG5cdH07XG5cblx0JHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnRvZ2dsZUNsYXNzKCdtb2JpbGVNZW51T3BlbicpO1x0XG5cdH07XG5cblx0JHNjb3BlLmNsb3NlTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS5yZW1vdmVDbGFzcygnbW9iaWxlTWVudU9wZW4nKTtcdFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZU5vdGUgPSBmdW5jdGlvbigpe1xuXHRcdGlmICgkc2NvcGUubm90ZS5wYXJlbnQpXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyAkc2NvcGUubm90ZS5wYXJlbnQpXG5cdFx0ZWxzZSBpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKXtcblx0XHRcdGlmICgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50KVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyAkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdH07XG5cblx0JHNjb3BlLnNoYXJlUHJvbXB0ZXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pe1xuXHRcdCRzY29wZS5zaGFyZVByb21wdCA9IGRpcmVjdGlvbjtcblx0fVxuXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4OCAgICAgICAgODggODg4ODg4ODg4ODggODggICAgICAgICAgODg4ODg4ODhiYSAgODg4ODg4ODg4ODggODg4ODg4ODhiYSAgIGFkODg4ODhiYSAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgODggICAgICAgICAgODggICAgICBcIjhiIGQ4XCIgICAgIFwiOGIgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICw4UCA4OCAgICAgICAgICA4OCAgICAgICw4UCBZOCwgICAgICAgICAgXG5cdC8vIFx0ODhhYWFhYWFhYTg4IDg4YWFhYWEgICAgIDg4ICAgICAgICAgIDg4YWFhYWFhOFAnIDg4YWFhYWEgICAgIDg4YWFhYWFhOFAnIGBZOGFhYWFhLCAgICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCJcIlwiXCI4OCA4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICAgIDg4XCJcIlwiXCJcIlwiJyAgIDg4XCJcIlwiXCJcIiAgICAgODhcIlwiXCJcIjg4JyAgICAgYFwiXCJcIlwiXCI4YiwgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICBgOGIgICAgICAgICAgIGA4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICBgOGIgIFk4YSAgICAgYThQICBcblx0Ly8gXHQ4OCAgICAgICAgODggODg4ODg4ODg4ODggODg4ODg4ODg4ODggODggICAgICAgICAgODg4ODg4ODg4ODggODggICAgICBgOGIgIFwiWTg4ODg4UFwiICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdHZhciBfaXNUZXh0YXJlYSA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudHlwZSA9PT0gJ3RleHRhcmVhJztcblx0fSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXHRfaXNCaXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCdtb3VzZXRyYXAnKSA+IC0xO1xuXHR9LFxuXG5cdF9iaXRJbmRleCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkucGFyZW50cygnLm5vdGVfYml0JykuaW5kZXgoKTtcblx0fSxcblxuXHRfZm9jdXNNZSA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkKCcubm90ZV9ib2R5Jylcblx0XHRcdFx0LmZpbmQoJy5ub3RlX2JpdDplcSgnICsgKGluZGV4KSArICcpIHRleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0X2lzVGV4dFNlbGVjdGVkID0gZnVuY3Rpb24oaW5wdXQpe1xuXHRcdHZhciBzdGFydFBvcyA9IGlucHV0LnNlbGVjdGlvblN0YXJ0O1xuXHRcdHZhciBlbmRQb3MgPSBpbnB1dC5zZWxlY3Rpb25FbmQ7XG5cdFx0dmFyIGRvYyA9IGRvY3VtZW50LnNlbGVjdGlvbjtcblxuXHRcdGlmKGRvYyAmJiBkb2MuY3JlYXRlUmFuZ2UoKS50ZXh0Lmxlbmd0aCAhPSAwKXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1lbHNlIGlmICghZG9jICYmIGlucHV0LnZhbHVlLnN1YnN0cmluZyhzdGFydFBvcywgZW5kUG9zKS5sZW5ndGggIT0gMCl7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdCRzY29wZS5zb3J0YWJsZU9wdGlvbnNfbm90ZSA9IHtcblx0XHRoYW5kbGU6ICc+IC5iaXRfYW5jaG9yJyxcblx0XHRheGlzOiAneScsXG5cdFx0c2Nyb2xsOiB0cnVlLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHQvLyBzdGFydDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuXHRcdC8vICAgICQodGhpcykuYXR0cignc3RhcnRpbmdTY3JvbGxUb3AnLCB3aW5kb3cucGFnZVlPZmZzZXQpO1xuXHRcdC8vIH0sXG5cdFx0Ly8gZHJhZzogZnVuY3Rpb24oZXZlbnQsdWkpe1xuXHRcdC8vICAgIHZhciBzdCA9IHBhcnNlSW50KCQodGhpcykuYXR0cignc3RhcnRpbmdTY3JvbGxUb3AnKSk7XG5cdFx0Ly8gICAgdWkucG9zaXRpb24udG9wIC09IHN0O1xuXHRcdC8vIH0sXG5cdFx0J3VpLWZsb2F0aW5nJzogdHJ1ZVxuXHR9O1xuXG5cdGhpc3RvcnlDb3VudChmdW5jdGlvbih0aGVOdW1iZXIpe1xuXHRcdCRzY29wZS5oaXN0b3J5Q291bnRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhlTnVtYmVyO1xuXHRcdH1cblx0fSlcblxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHRMb2dvdXQoKTtcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHROb3RlLFxuXHRuZXdOb3RlLFxuXHRraWxsTm90ZSxcblx0bmV3Qml0LFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsIFxuXHRob3RrZXlzLFxuXHQkdGltZW91dCxcblx0JGxvY2F0aW9uLFxuXHQkY29va2llcyxcblx0QXV0aCxcblx0TG9naW4sXG5cdGZpcnN0Tm90ZVxuKSB7XG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG4gICAgJHNjb3BlLmF1dGggPSBBdXRoO1xuXG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwb3J0YWwnO1xuICAgICRzY29wZS52aWV3aW5nID0gJ3NpZ25Jbic7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgIGlmICh3aW5kb3cubG9nZ2VkSW4pXG5cdCAgICAkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblxuICAgICRzY29wZS5zaWduX3VwID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdCRzY29wZS5hdXRoLiRjcmVhdGVVc2VyKHtcblx0XHRcdGVtYWlsICAgIDogJHNjb3BlLnNpZ25VcF9pbnB1dC5lbWFpbCxcblx0XHRcdHBhc3N3b3JkIDogJHNjb3BlLnNpZ25VcF9pbnB1dC5wYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odXNlckRhdGEpIHtcblxuXHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdFx0Y29uc29sZS5sb2coJ25ldyB1c2VyIFwiJyArIHVzZXJEYXRhLnVpZCArICdcIiBjcmVhdGVkIScpO1xuXG5cdFx0XHR3aW5kb3cudWlkID0gdXNlckRhdGEudWlkO1xuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRMb2dpbigkc2NvcGUuc2lnblVwX2lucHV0LmVtYWlsLCAkc2NvcGUuc2lnblVwX2lucHV0LnBhc3N3b3JkLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGZpcnN0Tm90ZSgpO1xuXHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdC8nKTtcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdH0pO1xuICAgIH1cblxuICAgICRzY29wZS5zaWduX2luID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICBcdExvZ2luKCRzY29wZS5zaWduSW5faW5wdXQuZW1haWwsICRzY29wZS5zaWduSW5faW5wdXQucGFzc3dvcmQsIFxuICAgIFx0XHRmdW5jdGlvbigpe1xuXHQgICAgXHRcdCRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cdCAgICBcdFx0aWYgKCF3aW5kb3cucmVzZXR0aW5nUGFzc3dvcmQpXG5cdFx0ICAgIFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QvJyk7XG5cdFx0ICAgIFx0ZWxzZXtcblx0XHQgICAgXHRcdCRzY29wZS52aWV3aW5nID0gJ3B3Y2hhbmdlJztcblx0XHQgICAgXHR9XG5cdCAgICBcdH0sXG5cdCAgICBcdGZ1bmN0aW9uKCl7XG5cdCAgICBcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0ICAgIFx0XHQkc2NvcGUuc2lnbkluX2lucHV0LmVtYWlsID0gJyc7XG5cdCAgICBcdFx0JHNjb3BlLnNpZ25Jbl9pbnB1dC5wYXNzd29yZCA9ICcnO1xuXHQgICAgXHR9XG4gICAgXHQpO1xuICAgIH1cblxuICAgICRzY29wZS5uZXdQVyA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lKVxuXHQgICAgXHQkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cblx0XHQkc2NvcGUuYXV0aC4kY2hhbmdlUGFzc3dvcmQoe1xuXHRcdFx0ZW1haWw6ICRzY29wZS5zaWduSW5faW5wdXQuZW1haWwsXG5cdFx0XHRvbGRQYXNzd29yZDogJHNjb3BlLnNpZ25Jbl9pbnB1dC5wYXNzd29yZCxcblx0XHRcdG5ld1Bhc3N3b3JkOiAkc2NvcGUucmVzZXRfaW5wdXQucGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdHdpbmRvdy5yZXNldHRpbmdQYXNzd29yZCA9IGZhbHNlO1xuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0LycpO1xuXHRcdFx0YWxlcnQoJ0FscmlnaHQsIHlvdXIgcGFzc3dvcmQgaGFzIGJlZW4gcmVzZXQhXFxuXFxuRG9uXFwndCB3b3JyeSwgaXQgaGFwcGVucyB0byBldmVyeW9uZSEgOiknKVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiLCBlcnJvcik7XG5cdFx0fSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnB3UmVzZXQgPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCEkc2NvcGUuc2lnbkluLiRwcmlzdGluZSlcblx0ICAgIFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lICYmICRzY29wZS5zaWduSW4uJHZhbGlkKXtcblx0XHRcdCRzY29wZS5hdXRoLiRyZXNldFBhc3N3b3JkKHtcblx0XHRcdFx0ZW1haWw6ICRzY29wZS5zaWduSW5faW5wdXQuZW1haWxcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdHdpbmRvdy5yZXNldHRpbmdQYXNzd29yZCA9IHRydWU7XG5cdFx0XHRcdGFsZXJ0KCdBd2Vzb21lIVxcblxcbkdvIGNoZWNrIHlvdXIgZW1haWwsIHdlIGp1c3Qgc2VudCB5b3UgYSB0ZW1wb3JhcnkgcGFzc3dvcmQuIFxcblxcbkdvIGdldCBpdCB0aGVyZSwgbG9naW4gd2l0aCB0aGF0LCBhbmQgd2VcXCdsbCBjaGFuZ2UgeW91ciBwYXNzd29yZCB3aGVuIHlvdSBnZXQgYmFjayEnKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1Bhc3N3b3JkIHJlc2V0IGVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIkVycm9yOiBcIiwgZXJyb3IpO1xuXHRcdFx0fSk7XG4gICAgXHR9ZWxzZXtcbiAgICBcdFx0YWxlcnQoJ0FoIG1hbiwgSSBoYXRlIGl0IHdoZW4gdGhhdCBoYXBwZW5zLlxcblxcbkhlcmUsIHB1dCB5b3VyIGVtYWlsIGluLCBhbmQgY2xpY2sgdGhlIFxcJ0ZvcmdvdCB5b3VyIHBhc3N3b3JkP1xcJyBidXR0b24gYWdhaW4uJylcbiAgICBcdH1cbiAgICB9XG5cbiAgICAkc2NvcGUuZW50ZXJXYXRjaCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBcdGlmIChldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgXHRcdGlmICgkc2NvcGUudmlld2luZyA9PT0gJ3NpZ25VcCcpICRzY29wZS5zaWduX3VwKCk7XG4gICAgXHRcdGVsc2UgaWYgKCRzY29wZS52aWV3aW5nID09PSAnc2lnbkluJykgJHNjb3BlLnNpZ25faW4oKTtcbiAgICBcdFx0ZWxzZSBpZiAoJHNjb3BlLnZpZXdpbmcgPT09ICdwd2NoYW5nZScpICRzY29wZS5uZXdQVygpO1xuICAgIFx0fVxuICAgIH07XG59XG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHNjb3BlLFxuXHRob3RrZXlzLFxuXHRNZXRhLFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHRzaGFyZU5vdGUsXG5cdGFkZFRvU2hhcmVkTm90ZSxcblx0JHJvdXRlUGFyYW1zLFxuXHQkdGltZW91dCxcblx0JGxvY2F0aW9uXG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXHRcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3NoYXJlJztcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbClcblxuXHRNZXRhKCkuJGJpbmRUbygkc2NvcGUsICdtZXRhJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yKClcblx0XHR9KVxuXG5cdHZhciBzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSxcblx0XHR1bmJpbmRlcixcbiAgICBcdHNoYXJlU291cmNlID0gZnVuY3Rpb24oKXtcblxuICAgIFx0XHRpZiAodHlwZW9mKHVuYmluZGVyKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgXHRcdFx0dW5iaW5kZXIoKTtcblxuICAgIFx0XHRpZiAoISRzY29wZS5pc1NoYXJlZCl7XG5cdFx0XHRcdGlmICh3aW5kb3cuaGlzdG9yaWNhbFt3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggLSAyXS5pbmRleE9mKCdzaGFyZWQnKSA+IDApXG5cdFx0XHRcdFx0JHNjb3BlLmlzU2hhcmVkID0gdHJ1ZTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5pc1NoYXJlZCA9IGZhbHNlO1xuICAgIFx0XHR9XG5cblx0XHRcdGlmICgkc2NvcGUuaXNTaGFyZWQpe1xuXHRcdFx0XHQvLyBzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSA9IGZhbHNlO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU0hBUkVEJylcblx0XHRcdFx0c2hhcmVkTm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXHRcdFx0XHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXHRcdFx0XHRcdFx0JHNjb3BlLnJldHVybkFkZHJlc3MgPSAnL3NoYXJlZG5vdGUvJyArICRzY29wZS5ub3RlLmlkO1xuXHRcdFx0XHRcdFx0c2hhcmVkVXNlckdlbmVyYXRvcihmYWxzZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSA9IHRydWU7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQUklWQVQnKVxuXHRcdFx0XHROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbih1bmJpbmQpe1xuXHRcdFx0XHRcdFx0dW5iaW5kZXIgPSB1bmJpbmQ7XG5cdFx0XHRcdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kKVxuXHRcdFx0XHRcdFx0JHNjb3BlLnJldHVybkFkZHJlc3MgPSAnL25vdGUvJyArICRzY29wZS5ub3RlLmlkO1xuXHRcdFx0XHRcdFx0c2hhcmVkVXNlckdlbmVyYXRvcih0cnVlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0c2hhcmVkVXNlckdlbmVyYXRvciA9IGZ1bmN0aW9uKGFscmVhZHlTaGFyZWQpe1xuXHRcdFx0aWYgKHNoYXJlZFVzZXJHZW5lcmF0b3JHYXRlKXtcblxuXHRcdFx0XHRwYXJ0aWNpcGFudHNHZW5lcmF0b3IoKTtcblxuXHRcdFx0XHR2YXIgdXNlcnMgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1ldGEuc2hhcmVkVXNlcnMpLFxuXHRcdFx0XHRcdHVuaXF1ZVVzZXJzID0gXy51bmlxKHVzZXJzKTtcblxuXHRcdFx0XHRpZihhbHJlYWR5U2hhcmVkKVxuXHRcdFx0XHRcdHZhciBwYXJ0aWNpcGFudHMgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1ldGEuc2hhcmVkVXNlcnMpXG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHVuaXF1ZVVzZXJzLCBmdW5jdGlvbih2LCBrKXtcblx0XHRcdFx0XHRpZiAoYWxyZWFkeVNoYXJlZCl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocGFydGljaXBhbnRzLCBmdW5jdGlvbih2diwga2spe1xuXHRcdFx0XHRcdFx0XHRpZiAod2luZG93LmVtYWlsVW5lc2NhcGVyKGtrKSA9PT0gdilcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgdW5pcXVlVXNlcnNba11cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHYgPT09IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwpXG5cdFx0XHRcdFx0XHRkZWxldGUgdW5pcXVlVXNlcnNba11cblx0XHRcdFx0fSlcblxuXHRcdFx0XHQkc2NvcGUuc2hhcmVkVXNlckZpbHRlciA9IHVuaXF1ZVVzZXJzO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSA9IHRydWU7XG5cdFx0fSxcblxuXHRcdHBhcnRpY2lwYW50c0dlbmVyYXRvciA9IGZ1bmN0aW9uKCl7XG5cblx0XHRcdHZhciBfcGFydGljaXBhbnRzID0gYW5ndWxhci5jb3B5KCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKF9wYXJ0aWNpcGFudHMsIGZ1bmN0aW9uKHYsIGspe1xuXHRcdFx0XHRpZiAoayA9PT0gd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbF9lc2NhcGVkKVxuXHRcdFx0XHRcdGRlbGV0ZSBfcGFydGljaXBhbnRzW2tdO1xuXHRcdFx0fSlcblxuXHRcdFx0JHNjb3BlLm5vdGVQYXJ0aWNpcGFudHMgPSBfcGFydGljaXBhbnRzO1xuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0c2hhcmVTb3VyY2UoKTtcblxuXHQkc2NvcGUuc2hhcmVVc2VyID0gZnVuY3Rpb24odGFyZ2V0KXtcblx0XHRpZiAoJHNjb3BlLmlzU2hhcmVkKXtcblx0XHRcdGFkZFRvU2hhcmVkTm90ZShcblx0XHRcdFx0JHNjb3BlLm5vdGUuaWQsIFxuXHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdHBhcnRpY2lwYW50c0dlbmVyYXRvclxuXHRcdFx0KTtcblx0XHR9ZWxzZXtcblx0XHRcdHNoYXJlTm90ZShcblx0XHRcdFx0JHNjb3BlLm5vdGUuaWQsIFxuXHRcdFx0XHR0YXJnZXQsIFxuXHRcdFx0XHRmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTaGFyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0c2hhcmVTb3VyY2UoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUucmVtb3ZlVXNlciA9IGZ1bmN0aW9uKHRhcmdldCl7XG5cdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24odiwgayl7XG5cdFx0XHRjb25zb2xlLmxvZyh2LCBrKVxuXHRcdFx0aWYgKHRhcmdldCA9PT0gaylcblx0XHRcdFx0ZGVsZXRlICRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1trXTtcblx0XHR9KVxuXG5cdFx0cGFydGljaXBhbnRzR2VuZXJhdG9yKCk7XG5cdH1cblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpIFxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhaCwgZm9yZ2V0IGl0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZW50ZXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5zaGFyZVVzZXIoJHNjb3BlLnNoYXJlVGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCgkc2NvcGUucmV0dXJuQWRkcmVzcyk7XG5cdH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkc2NvcGUsXG5cdCRyb3V0ZVBhcmFtcyxcblx0Tm90ZSxcblx0c2hhcmVkTm90ZSxcblx0aG90a2V5cyxcblx0JGxvY2F0aW9uLFxuXHQkdGltZW91dFxuKSB7IFxuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cblx0JHNjb3BlLnBhZ2VDbGFzcyA9ICd0ZXh0JztcblxuXHQkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpXG5cblx0aWYgKHdpbmRvdy5oaXN0b3JpY2FsW3dpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aCAtIDJdLmluZGV4T2YoJ3NoYXJlZCcpID4gMClcblx0XHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJyk7XG5cdGVsc2Vcblx0XHROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJyk7XG5cdFxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuY2xvc2VUZXh0KCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXG5cdCRzY29wZS5jbG9zZVRleHQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKHdpbmRvdy5sb2NhbFN0b3JhZ2UuaGlzdG9yaWNhbF9sYXN0KTtcblxuXHRcdGlmICh3aW5kb3cuaGlzdG9yaWNhbFt3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggLSAyXS5pbmRleE9mKCdzaGFyZWQnKSA+IDApe1xuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9zaGFyZWRub3RlLycgKyAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdH1lbHNle1xuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ub3RlLycgKyAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdH1cblx0fVxufSIsIiQoZnVuY3Rpb24oKSB7XG5cblx0Ly8gRkVBVFVSRSBURVNUU1xuXG5cdHZhciBfcHJvcGVydHlDYWNoZSA9IHt9O1x0XG5cblx0ZXhwb3J0cy5zdXBwb3J0c1N2ZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghX3Byb3BlcnR5Q2FjaGUuc3VwcG9ydHNTdmcpe1xuXHRcdFx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoXCJodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0ltYWdlXCIsIFwiMS4xXCIpO1xuXHRcdFx0X3Byb3BlcnR5Q2FjaGUuc3VwcG9ydHNTdmcgPSByZXN1bHQ7XG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIF9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnO1xuXHR9OyBcblxuXHRleHBvcnRzLm1lZGlhUXVlcmllc1N1cHBvcnRlZCA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCFfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQpe1xuXG5cdFx0XHR2YXIgZ2V0VGVzdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZWRpYXRlc3RcIiksXG5cdFx0XHRcdGJvb2w7XG5cblx0XHRcdGlmICghZ2V0VGVzdGVyKXtcblx0XHRcdFx0dmFyIGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0ZC5pZCA9IFwibWVkaWF0ZXN0XCI7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7XG5cdFx0XHRcdGJvb2wgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgdmFyIGQgPSBnZXRUZXN0ZXI7XG5cblx0XHRcdGlmICggd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZCkucG9zaXRpb24gPT0gXCJhYnNvbHV0ZVwiIClcblx0XHRcdFx0Ym9vbCA9IHRydWU7XG5cblx0XHRcdF9wcm9wZXJ0eUNhY2hlLm1lZGlhUXVlcmllc1N1cHBvcnRlZCA9IGJvb2w7XG5cblx0XHRcdHJldHVybiBib29sO1xuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQ7XG5cdH07IFxuXG5cdGV4cG9ydHMuY292ZXJCYWNrZ3JvdW5kU3VwcG9ydGVkID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoIV9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCl7XG5cdFx0XHR2YXIgcmVzdWx0ID0gKCdiYWNrZ3JvdW5kU2l6ZScgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKTtcblx0XHRcdF9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCA9IHJlc3VsdDtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIF9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZDtcblx0fTtcblx0XG5cblx0Ly8gVVRJTElUSUVTXG5cblx0ZXhwb3J0cy5tYXBfcmFuZ2UgPSBmdW5jdGlvbih2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSB7XG5cdCAgICByZXR1cm4gKGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSkpLnRvRml4ZWQoMik7XG5cdH1cblxuXHRleHBvcnRzLnJhbmRvbUludCA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG5cdCAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcblx0fVxuXG5cdGV4cG9ydHMuc2Nyb2xsVG9IZXJlID0gZnVuY3Rpb24od2hlcmUsIGV4dHJhKXtcblx0XHRpZiAoIWV4dHJhKSBleHRyYSA9IDA7XG5cdFx0XG5cdFx0dmFyIHRhcmdldCA9ICQod2hlcmUpLm9mZnNldCgpLnRvcDtcblxuXHRcdC8vIGRlZmluZSBob3cgbGFyZ2UgeW91ciBzdGlja3kgaGVhZGVyIGlzIGhlcmUhXG5cdFx0aWYgKHdpbmRvdy5tZWRpYVF1ZXJ5LmdldFF1ZXJ5KCkgPT09ICdtb2JpbGUnKSB0YXJnZXQgLT0gNTU7XG5cblx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0ICsgZXh0cmFcblx0XHR9LCA1MDApO1xuXHR9OyBcblxuXHRleHBvcnRzLnBhZ2VTZXR1cCA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgc3Vic2NyaWJlcnMgPSBbXSxcblx0XHRcdGlzU2V0VXAgPSBmYWxzZTtcblxuXHRcdGZ1bmN0aW9uIG9rYXlnbygpe1xuXHRcdFx0Zm9yICh2YXIgbWV0aG9kIGluIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdHN1YnNjcmliZXJzW21ldGhvZF0oKTtcblx0XHRcdH1cblx0XHRcdGlzU2V0VXAgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN1YnNjcmliZShtZXRob2QpIHtcblx0XHRcdHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcblxuXHRcdFx0aXNTZXRVcCAmJiBva2F5Z28oKTtcblx0XHR9XG5cblx0XHQvLyBSZXR1cm5hbCAgXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHJldHVybiB7XG5cdFx0XHRva2F5Z286IG9rYXlnbyxcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlXG5cdFx0fTtcblx0fSkoKTsgXG5cblx0ZXhwb3J0cy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHRcdHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRpbWVzdGFtcDtcblxuXHRcdFx0aWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0aWYgKCFpbW1lZGlhdGUpIHtcblx0XHRcdFx0XHRyZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0XHRcdGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnRleHQgPSB0aGlzO1xuXHRcdFx0YXJncyA9IGFyZ3VtZW50cztcblx0XHRcdHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0dmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG5cdFx0XHRpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblx0XHRcdGlmIChjYWxsTm93KSB7XG5cdFx0XHRcdHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHRcdGNvbnRleHQgPSBhcmdzID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHR9OyBcblxuXHRleHBvcnRzLm1lZGlhUXVlcnkgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN1YnNjcmliZXJzID0gW10sXG5cdFx0XHRtZWRpYUN1cnJlbnQsXG5cdFx0XHRtZWRpYVByZXYsXG5cdFx0XHQkd2luZG93ID0gJCh3aW5kb3cpLFxuXHRcdFx0JGh0bWwgPSAkKCdodG1sJyk7XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGUoKXtcblx0XHRcdHZhciBpbm5lcldpZHRoID0gJHdpbmRvdy5pbm5lcldpZHRoKCksXG5cdFx0XHRcdGlubmVySGVpZ2h0ID0gJHdpbmRvdy5pbm5lckhlaWdodCgpO1xuXG5cdFx0XHRpZiAoIGlubmVyV2lkdGggPCA3NjggKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ21vYmlsZSdcblx0XHRcdGVsc2UgaWYgKCAoIGlubmVyV2lkdGggPj0gNzY4KSAmJiAoIGlubmVyV2lkdGggPCA5OTIgKSApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAndGFibGV0J1xuXHRcdFx0ZWxzZSBpZiAoICggaW5uZXJXaWR0aCA+PSA5OTIgKSAmJiAoIGlubmVyV2lkdGggPCAxMjAwICkgKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ2Rlc2t0b3AnXG5cdFx0XHRlbHNlIGlmICggaW5uZXJXaWR0aCA+PSAxMjAwICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdsYXJnZV9kZXNrdG9wJ1xuXG5cdFx0XHRpZiAoIGlubmVySGVpZ2h0IDwgNzQwIClcblx0XHRcdFx0bWVkaWFDdXJyZW50ICs9ICcgc2hvcnQnXG5cblx0XHRcdGlmICggbWVkaWFDdXJyZW50ICE9PSBtZWRpYVByZXYgKXtcblx0XHRcdFx0Zm9yICh2YXIgbWV0aG9kIGluIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdFx0c3Vic2NyaWJlcnNbbWV0aG9kXShtZWRpYUN1cnJlbnQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFleHBvcnRzLm1lZGlhUXVlcmllc1N1cHBvcnRlZCgpKVxuXHRcdFx0XHRcdCRodG1sLnJlbW92ZUNsYXNzKG1lZGlhUHJldikuYWRkQ2xhc3MobWVkaWFDdXJyZW50KTtcblx0XHRcdH1cblxuXHRcdFx0bWVkaWFQcmV2ID0gbWVkaWFDdXJyZW50OyBcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFF1ZXJ5KCl7XG5cdFx0XHRyZXR1cm4gbWVkaWFDdXJyZW50O1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBpcyhxdWVyeSl7XG5cdFx0XHRyZXR1cm4gbWVkaWFDdXJyZW50LmluZGV4T2YocXVlcnkpID49IDA7XG5cdFx0fTtcblxuXHRcdHZhciBjYWxjdWxhdGVEZWJvdW5jZSA9IGV4cG9ydHMuZGVib3VuY2UoY2FsY3VsYXRlLCAyMDApOyBcblxuXHRcdCR3aW5kb3cucmVzaXplKGNhbGN1bGF0ZURlYm91bmNlKTtcblxuXHRcdC8vIGNhbGN1bGF0ZSgpO1xuXHRcdFxuXHRcdC8vICR3aW5kb3cubG9hZChjYWxjdWxhdGUpO1xuXG5cdFx0Ly8gZXhwb3J0cy5wYWdlU2V0dXAuc3Vic2NyaWJlKGNhbGN1bGF0ZSk7XG5cblx0XHQvLyBSZXR1cm5hbFxuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3Vic2NyaWJlOiBzdWJzY3JpYmUsXG5cdFx0XHRnZXRRdWVyeTogZ2V0UXVlcnksXG5cdFx0XHRpczogaXNcblx0XHR9O1xuXHR9KSgpOyBcblxuXHRleHBvcnRzLmdNYXBMb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBWYXJpYWJsZXNcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXG5cdFx0Ly8gTG9hZCBHb29nbGUgTWFwc1xuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0Z01hcFNldHVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdFx0c2NyaXB0LnNyYyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanM/dj0zLmV4cCYnICsgJ2NhbGxiYWNrPSQkXy5nTWFwTG9hZGVyLnJlYWR5Jztcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiByZWFkeSgpIHtcblx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRzdWJzY3JpYmVyc1ttZXRob2RdKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YnNjcmliZShtZXRob2QpIHtcblx0XHRcdHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcblx0XHR9O1xuXG5cdFx0Ly8gJCh3aW5kb3cpLmxvYWQoZ01hcFNldHVwKVxuXG5cdFx0Ly8gUmV0dXJuYWxcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlYWR5OiByZWFkeSxcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlXG5cdFx0fTtcblx0fSkoKTtcblxuXHRleHBvcnRzLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHR2YXIgdXVpZCA9ICd4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG5cdFx0XHR2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuXHRcdFx0ZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuXHRcdFx0cmV0dXJuIChjID09ICd4JyA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKDE2KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdXVpZDtcblx0fTtcblxuXG59KTsiXX0=
