// Vendor files
// var $ = window.jQuery = window.$ = require('./vendor/jquery-1.11.1.min');

var $$_ = window.$$_ = require('./shared/core'); 

var noteCtrl = require('./modules/noteCtrl'),
	changeCtrl = require('./modules/changeCtrl'),
	boardCtrl = require('./modules/boardCtrl'),
	listCtrl = require('./modules/listCtrl');

// expose your functions to the global scope for testing
var mxm = {};

window._Firebase = new Firebase( 'https://lick.firebaseio.com' );

// define our app and dependencies (remember to include firebase!)
var app = angular.module(
	'lick', 
	[
		'firebase', 
		'ngRoute',
		'ui.sortable',
		'cfp.hotkeys',
		'ngSanitize',
		'gridster'
	]
);

app.config( function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'assets/inc/home.html',
            // controller  : 'mainController'
        })

        // route for notes
        .when('/note/:id', {
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
        });
});

app.factory('Notes', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('notes');
			return $firebaseObject(ref);
		};
	}
]);

app.factory('Boards', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('boards');
			return $firebaseObject(ref);
		};
	}
]);

app.factory('Note', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('notes/' + id);
			return $firebaseObject(ref);
		};
	}
]);

app.factory('Board', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('/boards/' + id);
			return $firebaseObject(ref);
		};
	}
]);

app.factory('newBit', 
	function() {
		return function() {
			return {
				display: true,
				type:"plainText",
				tabCount: 0,
				content: '',
				contentCaret: '',
				bitID: $$_.randomize(),
				mark: false,
				created: new Date(),
				destroyed: "",
				marked: "",
				menu_open: false,
				isLink: false,
				address: ''
			};
		};
	}
);

app.factory('newNote', ['newBit',
	function(newBit) {
		return function(parent, id) {
			var noteID;

			if (id){
				noteID = id;
			}else{
				noteID = $$_.randomize();
			}

			var noteRef = window._Firebase.child('/notes/' + noteID );
			noteRef.set({
				title: '',
				parent: typeof(parent) === 'undefined' ? null : parent,
				id: noteID,
				body: [newBit()],
				category: 0,
				display: true,
				list: true
			});

			return noteID;
		};
	}
]);


app.factory('killNote', ['Note', '$location',
	function(Note, $location) {
		return function(id, parent) {

			if (parent !== ''){
				$location.path('/board/' + parent);
			}
			else{
				$location.path('/list');
			}

			note = Note(id);
			note.$remove();
		};
	}
]);

app.factory('newBoard',
	function() {
		return function() {
			boardID = $$_.randomize();

			//BOARDS
			var boardRef = window._Firebase.child('/boards/' + boardID );
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


app.controller('noteCtrl', 
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
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$window',
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
		'newNote',
		'killNote',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		'$interval',
		boardCtrl
	]
);

app.controller('listCtrl', 
	[
		'$firebaseArray',
		'$rootScope', 
		'$scope', 
		'Notes',
		'newNote',
		'Boards',
		'newBoard',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		listCtrl
	]
);














