// Vendor files
// var $ = window.jQuery = window.$ = require('./vendor/jquery-1.11.1.min');

var $$_ = window.$$_ = require('./shared/core'); 

var noteCtrl = require('./modules/noteCtrl');
var boardCtrl = require('./modules/boardCtrl');
var listCtrl = require('./modules/listCtrl');

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

// app.factory('NoteIndex', ['$firebaseObject',
// 	function($firebaseObject) {
// 		return function() {
// 			var ref = window._Firebase.child('/noteIndex/');
// 			return $firebaseObject(ref);
// 		};
// 	}
// ]);

app.factory('Board', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('/boards/' + id);
			return $firebaseObject(ref);
		};
	}
]);

// app.factory('BoardIndex', ['$firebaseObject',
// 	function($firebaseObject) {
// 		return function() {
// 			var ref = window._Firebase.child('/boardIndex');
// 			return $firebaseObject(ref);
// 		};
// 	}
// ]);

// app.factory('List', ['$firebaseObject',
// 	function($firebaseObject) {
// 		return function(id) {
// 			var ref = window._Firebase.child('/list');
// 			return $firebaseObject(ref);
// 		};
// 	}
// ]);

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

app.factory('newNote',['newBit', '$firebaseObject', '$firebaseArray',// 'NoteIndex', 'List',
	function(newBit, $firebaseObject, $firebaseArray/*, NoteIndex, List*/) {
		return function(parent, id) {
			var noteID;

			if (id){
				noteID = id;
			}else{
				noteID = $$_.randomize();
			}

			// //ADD TO BOARD (IF NECESSARY)
			// if (typeof(parent) !== 'undefined'){
			// 	console.log(parent)
			// 	var noteRef_board = window._Firebase.child('/boards/' + parent + '/notes'),
			// 	obj = $firebaseArray(noteRef_board).$loaded(function(theNotes) {
			// 		noteRef_board.child(theNotes.length).set({id: noteID});
			// 	});
			// }

			//NOTE INDEX

			// var noteIndexRef = window._Firebase.child('/noteIndex/' + noteID);
			// noteIndexRef.set('');

			//NOTES
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

			// //LIST
			// var listRef = window._Firebase.child('/list/notes');

			// var list = $firebaseArray(listRef).$loaded(function(theList) {
			// 	listRef.child(theList.length).set(noteID);
			// });

			return noteID;
		};
	}
]);


app.factory('killNote', ['$firebaseArray', '$firebaseObject', 'Note', '$location',
	function($firebaseArray, $firebaseObject, Note, $location) {
		return function(id, parent) {

			if (parent !== ''){
				$location.path('/board/' + parent);

				// var noteRef = window._Firebase.child('/boards/' + parent + '/notes'),
				// obj = $firebaseArray(noteRef).$loaded(function(theNotes) {
				// 	var notesIndex;

				// 	for (var i = 0; i < theNotes.length; i++){
				// 		if (theNotes[i].id === id)
				// 			notesIndex = i;
				// 	}

				// 	noteRef.child(notesIndex).remove();
				// });

			}
			else{
				$location.path('/list');
			}

			note = Note(id);
			note.$remove();

			// var ref = window._Firebase.child('/noteIndex/' + id ),
			// 	obj = $firebaseObject(ref);
			// obj.$remove();

			// var listRef = window._Firebase.child('/list/notes'),

			// list = $firebaseArray(listRef).$loaded(function(theList) {
			// 	var listIndex;

			// 	for (var i = 0; i < theList.length; i++){
			// 		if (theList[i].$value === id)
			// 			listIndex = i;
			// 	}

			// 	listRef.child(listIndex).remove();
			// });
		};
	}
]);

app.factory('newBoard', ['$firebaseArray',
	function($firebaseArray) {
		return function() {
			boardID = $$_.randomize();

			//BOARDS
			var boardRef = window._Firebase.child('/boards/' + boardID );
			boardRef.set({
				title: '',
				id: boardID,
				notes:[]
			});

			// //BOARDINDEX
			// var boardIndexRef = window._Firebase.child('/boardIndex/' + boardID);
			// boardIndexRef.set('');

			//LIST
			// var listRef = window._Firebase.child('/list/boards');

			// var list = $firebaseArray(listRef).$loaded(function(theList) {
			// 	listRef.child(theList.length).set(boardID);
			// });

			return boardID;
		};
	}
]);

app.controller('noteCtrl', 
	[
		'$rootScope', 
		'$scope',
		'newNote', 
		'killNote',
		'Note',
		// 'NoteIndex',
		'newBit',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		noteCtrl
	]
);

app.controller('boardCtrl', 
	[
		'$rootScope', 
		'$scope', 
		'Board',
		'Notes',
		'newNote',
		'newBoard',
		// 'NoteIndex',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		boardCtrl
	]
);

app.controller('listCtrl', 
	[
		'$firebaseArray',
		'$rootScope', 
		'$scope', 
		'Notes',
		'Boards',
		'newNote',
		'newBoard',
		// 'NoteIndex',
		// 'BoardIndex',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		listCtrl
	]
);














