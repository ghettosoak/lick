(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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















},{"./modules/boardCtrl":2,"./modules/listCtrl":3,"./modules/noteCtrl":4,"./shared/core":5}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = function(
	$rootScope, 
	$scope, 
	newNote,
	killNote,
	Note, 
	// NoteIndex,
	newBit,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location
) {
	
	var altIsPressed = false;

	Note($routeParams.id).$bindTo($scope, 'note')
	.then(function() {
		if (typeof($scope.note.body) === 'undefined'){
			newNote('', $routeParams.id);
		}
	});

	// NoteIndex().$bindTo($scope, 'noteIndex');

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
			combo: 'alt',
			description: 'disable "links"',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keydown',
			callback: function(event, hotkey) {
				altIsPressed = true;
			}
		})
		.add({
			combo: 'alt',
			description: 'disable "links"',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			action: 'keyup',
			callback: function(event, hotkey) {
				altIsPressed = false;
			}
		})
		.add({
			combo: 'enter',
			description: 'add new bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() ){
					$scope.addBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'backspace',
			description: 'remove bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() && ($scope.note.body[_bitIndex()].content === '')){
					$scope.killBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['command+backspace', 'ctrl+backspace'],
			description: 'remove bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				if ( _isTextarea() ){
					$scope.killBit( _bitIndex() );
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'tab',
			description: 'increase indent',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea() && $scope.note.body[_bitIndex()].tabCount < 2 ){
					$scope.note.body[_bitIndex()].tabCount++;
					event.preventDefault();
				}
			}
		})
		.add({
			combo: 'shift+tab',
			description: 'decrease indent',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea() && $scope.note.body[_bitIndex()].tabCount > 0 ){
					$scope.note.body[_bitIndex()].tabCount--;
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['up', 'down'],
			description: 'movement',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				if ( _isTextarea()){
					$scope.jumpAround(_bitIndex(), event.keyIdentifier);
				}
			}
		})
		.add({
			combo: 'ctrl+command+up',
			description: 'move bit up',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				$scope.moveUp(_bitIndex());
			}
		})
		.add({
			combo: 'ctrl+command+down',
			description: 'move bit down',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				$scope.moveDown(_bitIndex());
			}
		})
		.add({
			combo: ['ctrl+v', 'command+v'],
			description: 'paste',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				$scope.parsePasted(_bitIndex());
			}
		})
		.add({
			combo: 'shift shift',
			description: 'toggle marked',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function() {
				if ( _isTextarea()){
					$scope.note.body[_bitIndex()].mark = !$scope.note.body[_bitIndex()].mark;
				}
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
			$scope.note.body.splice(index + 1, 0, newBit());

			$scope.note.body[index + 1].tabCount = $scope.note.body[index].tabCount;
			$scope.note.body[index + 1].content = incomingContent;
			$scope.note.body[index + 1].contentCaret = incomingContent;

			$scope.parseLink(index);

			_focusMe(index + 1);
		}, 50);
	};

	$scope.parsePasted = function(index){
		$timeout(function(){
			// split at line breaks
			var theContent = $scope.note.body[index].content.split('\n');

			// remove empty lines
			for (var l = 0; l < theContent.length; l++){
				if (theContent[l] === '') theContent.splice(l, 1);
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

		if (bit.isLink && !altIsPressed){
			document.activeElement.blur();
			var win = window.open('https://www.google.com/search?q=' + bit.address, '_blank');
			win.focus();
		}
	}

	$scope.killBit = function(index){
		$scope.note.body.splice(index, 1);
		_focusMe(index - 1)
	};

	$scope.moveUp = function(index){
		var thisBit = $scope.note.body.splice(_bitIndex(), 1)[0];
		$scope.note.body.splice(index - 1, 0, thisBit);
		_focusMe(index - 1)
	};

	$scope.moveDown = function(index){
		var thisBit = $scope.note.body.splice(_bitIndex(), 1)[0];
		$scope.note.body.splice(index + 1, 0, thisBit);
		_focusMe(index + 1)
	};

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


	$scope.jumpAround = function(index, key){
		var $theBit = $(document.activeElement),
			$theCaret = $theBit.next().find('.hiddenCaret'),
			theCaretPos = $theCaret.position().top;

		if ( 
			(key === 'Up') && 
			(theCaretPos > 0) 
		){
			$theBit.parents('.note_bit')
				.prev('.note_bit').find('textarea')
				.focus()
		}

		if ( 
			(key === 'Down') && 
			(theCaretPos < ($theCaret.parent().height() - 18)) 
		){
			$theBit.parents('.note_bit')
				.next('.note_bit').find('textarea')
				.focus()
		}
	};

	$scope.mark = function(index){
		$scope.note.body[_bitIndex()].mark = !$scope.note.body[_bitIndex()].mark;
		$scope.note.body[_bitIndex()].marked = new Date;
		$scope.note.body[_bitIndex()].menu_open = false;
	};

	$scope.search = function(content){
		var win = window.open('https://www.google.com/search?q=' + content, '_blank');
	    win.focus();
	};

	$scope.bitBlur = function($index){
		console.log('BLURD')
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
	};

	$scope.killNote = function(){
		killNote($scope.note.id, $scope.note.parent);
	};

	$scope.showUndoList = function(){

	};

	$scope.markNote = function(){

	};

	$scope.addToTable = function(){

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
		handle: '> .bit_anchor'
	}
}
},{}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9tYWluLmpzIiwiLi4vanMvbW9kdWxlcy9ib2FyZEN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2xpc3RDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9ub3RlQ3RybC5qcyIsIi4uL2pzL3NoYXJlZC9jb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBWZW5kb3IgZmlsZXNcbi8vIHZhciAkID0gd2luZG93LmpRdWVyeSA9IHdpbmRvdy4kID0gcmVxdWlyZSgnLi92ZW5kb3IvanF1ZXJ5LTEuMTEuMS5taW4nKTtcblxudmFyICQkXyA9IHdpbmRvdy4kJF8gPSByZXF1aXJlKCcuL3NoYXJlZC9jb3JlJyk7IFxuXG52YXIgbm90ZUN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvbm90ZUN0cmwnKTtcbnZhciBib2FyZEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvYm9hcmRDdHJsJyk7XG52YXIgbGlzdEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvbGlzdEN0cmwnKTtcblxuLy8gZXhwb3NlIHlvdXIgZnVuY3Rpb25zIHRvIHRoZSBnbG9iYWwgc2NvcGUgZm9yIHRlc3RpbmdcbnZhciBteG0gPSB7fTtcblxud2luZG93Ll9GaXJlYmFzZSA9IG5ldyBGaXJlYmFzZSggJ2h0dHBzOi8vbGljay5maXJlYmFzZWlvLmNvbScgKTtcblxuLy8gZGVmaW5lIG91ciBhcHAgYW5kIGRlcGVuZGVuY2llcyAocmVtZW1iZXIgdG8gaW5jbHVkZSBmaXJlYmFzZSEpXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoXG5cdCdsaWNrJywgXG5cdFtcblx0XHQnZmlyZWJhc2UnLCBcblx0XHQnbmdSb3V0ZScsXG5cdFx0J3VpLnNvcnRhYmxlJyxcblx0XHQnY2ZwLmhvdGtleXMnLFxuXHRcdCduZ1Nhbml0aXplJyxcblx0XHQnZ3JpZHN0ZXInXG5cdF1cbik7XG5cbmFwcC5jb25maWcoIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXJcblxuICAgICAgICAvLyByb3V0ZSBmb3IgdGhlIGhvbWUgcGFnZVxuICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvaG9tZS5odG1sJyxcbiAgICAgICAgICAgIC8vIGNvbnRyb2xsZXIgIDogJ21haW5Db250cm9sbGVyJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBub3Rlc1xuICAgICAgICAud2hlbignL25vdGUvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ub3RlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnbm90ZUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGJvYXJkc1xuICAgICAgICAud2hlbignL2JvYXJkLzppZCcsIHsgXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2JvYXJkLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnYm9hcmRDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBsaXN0XG4gICAgICAgIC53aGVuKCcvbGlzdCcsIHsgXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2xpc3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdsaXN0Q3RybCdcbiAgICAgICAgfSk7XG59KTtcblxuYXBwLmZhY3RvcnkoJ05vdGVzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdub3RlcycpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnQm9hcmRzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdib2FyZHMnKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ05vdGUnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ25vdGVzLycgKyBpZCk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbi8vIGFwcC5mYWN0b3J5KCdOb3RlSW5kZXgnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG4vLyBcdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuLy8gXHRcdHJldHVybiBmdW5jdGlvbigpIHtcbi8vIFx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCcvbm90ZUluZGV4LycpO1xuLy8gXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuLy8gXHRcdH07XG4vLyBcdH1cbi8vIF0pO1xuXG5hcHAuZmFjdG9yeSgnQm9hcmQnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJy9ib2FyZHMvJyArIGlkKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuLy8gYXBwLmZhY3RvcnkoJ0JvYXJkSW5kZXgnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG4vLyBcdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuLy8gXHRcdHJldHVybiBmdW5jdGlvbigpIHtcbi8vIFx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCcvYm9hcmRJbmRleCcpO1xuLy8gXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuLy8gXHRcdH07XG4vLyBcdH1cbi8vIF0pO1xuXG4vLyBhcHAuZmFjdG9yeSgnTGlzdCcsIFsnJGZpcmViYXNlT2JqZWN0Jyxcbi8vIFx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG4vLyBcdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG4vLyBcdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnL2xpc3QnKTtcbi8vIFx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcbi8vIFx0XHR9O1xuLy8gXHR9XG4vLyBdKTtcblxuYXBwLmZhY3RvcnkoJ25ld0JpdCcsIFxuXHRmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkaXNwbGF5OiB0cnVlLFxuXHRcdFx0XHR0eXBlOlwicGxhaW5UZXh0XCIsXG5cdFx0XHRcdHRhYkNvdW50OiAwLFxuXHRcdFx0XHRjb250ZW50OiAnJyxcblx0XHRcdFx0Y29udGVudENhcmV0OiAnJyxcblx0XHRcdFx0Yml0SUQ6ICQkXy5yYW5kb21pemUoKSxcblx0XHRcdFx0bWFyazogZmFsc2UsXG5cdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG5cdFx0XHRcdGRlc3Ryb3llZDogXCJcIixcblx0XHRcdFx0bWFya2VkOiBcIlwiLFxuXHRcdFx0XHRtZW51X29wZW46IGZhbHNlLFxuXHRcdFx0XHRpc0xpbms6IGZhbHNlLFxuXHRcdFx0XHRhZGRyZXNzOiAnJ1xuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG4pO1xuXG5hcHAuZmFjdG9yeSgnbmV3Tm90ZScsWyduZXdCaXQnLCAnJGZpcmViYXNlT2JqZWN0JywgJyRmaXJlYmFzZUFycmF5JywvLyAnTm90ZUluZGV4JywgJ0xpc3QnLFxuXHRmdW5jdGlvbihuZXdCaXQsICRmaXJlYmFzZU9iamVjdCwgJGZpcmViYXNlQXJyYXkvKiwgTm90ZUluZGV4LCBMaXN0Ki8pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24ocGFyZW50LCBpZCkge1xuXHRcdFx0dmFyIG5vdGVJRDtcblxuXHRcdFx0aWYgKGlkKXtcblx0XHRcdFx0bm90ZUlEID0gaWQ7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bm90ZUlEID0gJCRfLnJhbmRvbWl6ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyAvL0FERCBUTyBCT0FSRCAoSUYgTkVDRVNTQVJZKVxuXHRcdFx0Ly8gaWYgKHR5cGVvZihwYXJlbnQpICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKHBhcmVudClcblx0XHRcdC8vIFx0dmFyIG5vdGVSZWZfYm9hcmQgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCcvYm9hcmRzLycgKyBwYXJlbnQgKyAnL25vdGVzJyksXG5cdFx0XHQvLyBcdG9iaiA9ICRmaXJlYmFzZUFycmF5KG5vdGVSZWZfYm9hcmQpLiRsb2FkZWQoZnVuY3Rpb24odGhlTm90ZXMpIHtcblx0XHRcdC8vIFx0XHRub3RlUmVmX2JvYXJkLmNoaWxkKHRoZU5vdGVzLmxlbmd0aCkuc2V0KHtpZDogbm90ZUlEfSk7XG5cdFx0XHQvLyBcdH0pO1xuXHRcdFx0Ly8gfVxuXG5cdFx0XHQvL05PVEUgSU5ERVhcblxuXHRcdFx0Ly8gdmFyIG5vdGVJbmRleFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJy9ub3RlSW5kZXgvJyArIG5vdGVJRCk7XG5cdFx0XHQvLyBub3RlSW5kZXhSZWYuc2V0KCcnKTtcblxuXHRcdFx0Ly9OT1RFU1xuXHRcdFx0dmFyIG5vdGVSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCcvbm90ZXMvJyArIG5vdGVJRCApO1xuXHRcdFx0bm90ZVJlZi5zZXQoe1xuXHRcdFx0XHR0aXRsZTogJycsXG5cdFx0XHRcdHBhcmVudDogdHlwZW9mKHBhcmVudCkgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHBhcmVudCxcblx0XHRcdFx0aWQ6IG5vdGVJRCxcblx0XHRcdFx0Ym9keTogW25ld0JpdCgpXSxcblx0XHRcdFx0Y2F0ZWdvcnk6IDAsXG5cdFx0XHRcdGRpc3BsYXk6IHRydWUsXG5cdFx0XHRcdGxpc3Q6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyAvL0xJU1Rcblx0XHRcdC8vIHZhciBsaXN0UmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnL2xpc3Qvbm90ZXMnKTtcblxuXHRcdFx0Ly8gdmFyIGxpc3QgPSAkZmlyZWJhc2VBcnJheShsaXN0UmVmKS4kbG9hZGVkKGZ1bmN0aW9uKHRoZUxpc3QpIHtcblx0XHRcdC8vIFx0bGlzdFJlZi5jaGlsZCh0aGVMaXN0Lmxlbmd0aCkuc2V0KG5vdGVJRCk7XG5cdFx0XHQvLyB9KTtcblxuXHRcdFx0cmV0dXJuIG5vdGVJRDtcblx0XHR9O1xuXHR9XG5dKTtcblxuXG5hcHAuZmFjdG9yeSgna2lsbE5vdGUnLCBbJyRmaXJlYmFzZUFycmF5JywgJyRmaXJlYmFzZU9iamVjdCcsICdOb3RlJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZUFycmF5LCAkZmlyZWJhc2VPYmplY3QsIE5vdGUsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgcGFyZW50KSB7XG5cblx0XHRcdGlmIChwYXJlbnQgIT09ICcnKXtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgcGFyZW50KTtcblxuXHRcdFx0XHQvLyB2YXIgbm90ZVJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJy9ib2FyZHMvJyArIHBhcmVudCArICcvbm90ZXMnKSxcblx0XHRcdFx0Ly8gb2JqID0gJGZpcmViYXNlQXJyYXkobm90ZVJlZikuJGxvYWRlZChmdW5jdGlvbih0aGVOb3Rlcykge1xuXHRcdFx0XHQvLyBcdHZhciBub3Rlc0luZGV4O1xuXG5cdFx0XHRcdC8vIFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGVOb3Rlcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdC8vIFx0XHRpZiAodGhlTm90ZXNbaV0uaWQgPT09IGlkKVxuXHRcdFx0XHQvLyBcdFx0XHRub3Rlc0luZGV4ID0gaTtcblx0XHRcdFx0Ly8gXHR9XG5cblx0XHRcdFx0Ly8gXHRub3RlUmVmLmNoaWxkKG5vdGVzSW5kZXgpLnJlbW92ZSgpO1xuXHRcdFx0XHQvLyB9KTtcblxuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG5vdGUgPSBOb3RlKGlkKTtcblx0XHRcdG5vdGUuJHJlbW92ZSgpO1xuXG5cdFx0XHQvLyB2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnL25vdGVJbmRleC8nICsgaWQgKSxcblx0XHRcdC8vIFx0b2JqID0gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0XHQvLyBvYmouJHJlbW92ZSgpO1xuXG5cdFx0XHQvLyB2YXIgbGlzdFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJy9saXN0L25vdGVzJyksXG5cblx0XHRcdC8vIGxpc3QgPSAkZmlyZWJhc2VBcnJheShsaXN0UmVmKS4kbG9hZGVkKGZ1bmN0aW9uKHRoZUxpc3QpIHtcblx0XHRcdC8vIFx0dmFyIGxpc3RJbmRleDtcblxuXHRcdFx0Ly8gXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoZUxpc3QubGVuZ3RoOyBpKyspe1xuXHRcdFx0Ly8gXHRcdGlmICh0aGVMaXN0W2ldLiR2YWx1ZSA9PT0gaWQpXG5cdFx0XHQvLyBcdFx0XHRsaXN0SW5kZXggPSBpO1xuXHRcdFx0Ly8gXHR9XG5cblx0XHRcdC8vIFx0bGlzdFJlZi5jaGlsZChsaXN0SW5kZXgpLnJlbW92ZSgpO1xuXHRcdFx0Ly8gfSk7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCduZXdCb2FyZCcsIFsnJGZpcmViYXNlQXJyYXknLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VBcnJheSkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGJvYXJkSUQgPSAkJF8ucmFuZG9taXplKCk7XG5cblx0XHRcdC8vQk9BUkRTXG5cdFx0XHR2YXIgYm9hcmRSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCcvYm9hcmRzLycgKyBib2FyZElEICk7XG5cdFx0XHRib2FyZFJlZi5zZXQoe1xuXHRcdFx0XHR0aXRsZTogJycsXG5cdFx0XHRcdGlkOiBib2FyZElELFxuXHRcdFx0XHRub3RlczpbXVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIC8vQk9BUkRJTkRFWFxuXHRcdFx0Ly8gdmFyIGJvYXJkSW5kZXhSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCcvYm9hcmRJbmRleC8nICsgYm9hcmRJRCk7XG5cdFx0XHQvLyBib2FyZEluZGV4UmVmLnNldCgnJyk7XG5cblx0XHRcdC8vTElTVFxuXHRcdFx0Ly8gdmFyIGxpc3RSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCcvbGlzdC9ib2FyZHMnKTtcblxuXHRcdFx0Ly8gdmFyIGxpc3QgPSAkZmlyZWJhc2VBcnJheShsaXN0UmVmKS4kbG9hZGVkKGZ1bmN0aW9uKHRoZUxpc3QpIHtcblx0XHRcdC8vIFx0bGlzdFJlZi5jaGlsZCh0aGVMaXN0Lmxlbmd0aCkuc2V0KGJvYXJkSUQpO1xuXHRcdFx0Ly8gfSk7XG5cblx0XHRcdHJldHVybiBib2FyZElEO1xuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuY29udHJvbGxlcignbm90ZUN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J25ld05vdGUnLCBcblx0XHQna2lsbE5vdGUnLFxuXHRcdCdOb3RlJyxcblx0XHQvLyAnTm90ZUluZGV4Jyxcblx0XHQnbmV3Qml0Jyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0bm90ZUN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2JvYXJkQ3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJywgXG5cdFx0J0JvYXJkJyxcblx0XHQnTm90ZXMnLFxuXHRcdCduZXdOb3RlJyxcblx0XHQnbmV3Qm9hcmQnLFxuXHRcdC8vICdOb3RlSW5kZXgnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHRib2FyZEN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2xpc3RDdHJsJywgXG5cdFtcblx0XHQnJGZpcmViYXNlQXJyYXknLFxuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsIFxuXHRcdCdOb3RlcycsXG5cdFx0J0JvYXJkcycsXG5cdFx0J25ld05vdGUnLFxuXHRcdCduZXdCb2FyZCcsXG5cdFx0Ly8gJ05vdGVJbmRleCcsXG5cdFx0Ly8gJ0JvYXJkSW5kZXgnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHRsaXN0Q3RybFxuXHRdXG4pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHRCb2FyZCxcblx0Tm90ZXMsXG5cdG5ld05vdGUsXG5cdG5ld0JvYXJkLFxuXHROb3RlSW5kZXgsIFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsIFxuXHRob3RrZXlzLFxuXHQkdGltZW91dCxcblx0JGxvY2F0aW9uXG4pIHtcblx0Qm9hcmQoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ2JvYXJkJyk7XG5cblx0Tm90ZXMoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGVzJyk7XG5cblx0Tm90ZUluZGV4KCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlSW5kZXgnKTtcblxuXHQkc2NvcGUubmV3Tm90ZV9ib2FyZCA9IGZ1bmN0aW9uKGJvYXJkSUQpe1xuXHRcdG5ld05vdGUoYm9hcmRJRCk7XG5cdH1cblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkKCkpO1xuXHR9O1xuXG5cdCRzY29wZS5ib2FyZEdyaWRPcHRzID0ge1xuXHQgICAgY29sdW1uczogNCxcblx0ICAgIGZsb2F0aW5nOiBmYWxzZSxcblx0ICAgIG1vYmlsZU1vZGVFbmFibGVkOiBmYWxzZSxcblx0ICAgIG1pbkNvbHVtbnM6IDQsXG5cdCAgICBtaW5Sb3dzOiA0LFxuXHQgICAgbWF4Um93czogMTAsXG5cdCAgICBkZWZhdWx0U2l6ZVg6IDEsXG5cdCAgICBkZWZhdWx0U2l6ZVk6IDEsXG5cdCAgICByZXNpemFibGU6IHtcblx0ICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuXHQgICAgfSxcblx0fTtcblxuXHR2YXIgX2lzSW5wdXQgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKCdXSEFUIFRIRSBGVUNLJylcblx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50eXBlID09PSAndGV4dCc7XG5cdH0sXG5cblx0X25vdGVJRCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkucGFyZW50KCcuYm9hcmRfbm90ZScpLmF0dHIoJ2RhdGEtaWQnKTtcblx0fTtcblxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRmaXJlYmFzZUFycmF5LFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0Tm90ZXMsXG5cdEJvYXJkcyxcblx0bmV3Tm90ZSxcblx0bmV3Qm9hcmQsXG5cdC8vIE5vdGVJbmRleCxcblx0Ly8gQm9hcmRJbmRleCxcblx0JHJvdXRlUGFyYW1zLCBcblx0JHJvdXRlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvblxuKSB7XG5cblx0Ly8gJHNjb3BlLmxpc3QgPSBMaXN0KCk7XG5cblx0Tm90ZXMoKS4kYmluZFRvKCRzY29wZSwgJ25vdGVzJyk7XG5cdEJvYXJkcygpLiRiaW5kVG8oJHNjb3BlLCAnYm9hcmRzJyk7XG5cblx0Ly8gTm90ZUluZGV4KCkuJGJpbmRUbygkc2NvcGUsICdub3RlSW5kZXgnKTtcblxuXHQvLyBCb2FyZEluZGV4KCkuJGJpbmRUbygkc2NvcGUsICdib2FyZEluZGV4Jyk7XG5cblx0Ly8gJHNjb3BlLmdldE5hbWVfbm90ZSA9IGZ1bmN0aW9uKGlkKXtcblx0Ly8gXHRyZXR1cm4gJHNjb3BlLm5vdGVJbmRleFtpZF07XG5cdC8vIH1cblxuXHQvLyAkc2NvcGUuZ2V0TmFtZV9ib2FyZCA9IGZ1bmN0aW9uKGlkKXtcblx0Ly8gXHRyZXR1cm4gJHNjb3BlLmJvYXJkSW5kZXhbaWRdO1xuXHQvLyB9XG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3Tm90ZSgpKTtcblx0fTtcblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkKCkpO1xuXHR9O1x0XG5cblx0JHNjb3BlLnNvcnRhYmxlT3B0aW9uc19saXN0ID0ge1xuXHRcdHN0b3A6IGZ1bmN0aW9uKGUsIHVpKXtcblx0XHRcdGNvbnNvbGUubG9nKGUpXG5cdFx0fVxuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdG5ld05vdGUsXG5cdGtpbGxOb3RlLFxuXHROb3RlLCBcblx0Ly8gTm90ZUluZGV4LFxuXHRuZXdCaXQsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb25cbikge1xuXHRcblx0dmFyIGFsdElzUHJlc3NlZCA9IGZhbHNlO1xuXG5cdE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHQudGhlbihmdW5jdGlvbigpIHtcblx0XHRpZiAodHlwZW9mKCRzY29wZS5ub3RlLmJvZHkpID09PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRuZXdOb3RlKCcnLCAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gTm90ZUluZGV4KCkuJGJpbmRUbygkc2NvcGUsICdub3RlSW5kZXgnKTtcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ODggICAgICAgIDg4ICAgLGFkODg4OGJhLCA4ODg4ODg4ODg4ODggODggICAgICBhOFAgIDg4ODg4ODg4ODg4IDhiICAgICAgICBkOCBhZDg4ODg4YmEgICBcblx0Ly8gXHQ4OCAgICAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICAgICw4OCcgICA4OCAgICAgICAgICAgWTgsICAgICw4UCBkOFwiICAgICBcIjhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggZDgnICAgICAgICBgOGIgICAgODggICAgICA4OCAgLDg4XCIgICAgIDg4ICAgICAgICAgICAgWTgsICAsOFAgIFk4LCAgICAgICAgICBcblx0Ly8gXHQ4OGFhYWFhYWFhODggODggICAgICAgICAgODggICAgODggICAgICA4OCxkODgnICAgICAgODhhYWFhYSAgICAgICAgXCI4YWE4XCIgICBgWThhYWFhYSwgICAgXG5cdC8vIFx0ODhcIlwiXCJcIlwiXCJcIlwiODggODggICAgICAgICAgODggICAgODggICAgICA4ODg4XCI4OCwgICAgIDg4XCJcIlwiXCJcIiAgICAgICAgIGA4OCcgICAgICBgXCJcIlwiXCJcIjhiLCAgXG5cdC8vIFx0ODggICAgICAgIDg4IFk4LCAgICAgICAgLDhQICAgIDg4ICAgICAgODhQICAgWThiICAgIDg4ICAgICAgICAgICAgICAgODggICAgICAgICAgICAgYDhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgICAgXCI4OCwgIDg4ICAgICAgICAgICAgICAgODggICAgIFk4YSAgICAgYThQICBcblx0Ly8gXHQ4OCAgICAgICAgODggICBgXCJZODg4OFlcIicgICAgICA4OCAgICAgIDg4ICAgICAgIFk4YiA4ODg4ODg4ODg4OCAgICAgIDg4ICAgICAgXCJZODg4ODhQXCIgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdhbHQnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdkaXNhYmxlIFwibGlua3NcIicsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRhbHRJc1ByZXNzZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2FsdCcsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2Rpc2FibGUgXCJsaW5rc1wiJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXl1cCcsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRhbHRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlbnRlcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FkZCBuZXcgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgKXtcblx0XHRcdFx0XHQkc2NvcGUuYWRkQml0KCBfYml0SW5kZXgoKSApO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdiYWNrc3BhY2UnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdyZW1vdmUgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgKCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmNvbnRlbnQgPT09ICcnKSl7XG5cdFx0XHRcdFx0JHNjb3BlLmtpbGxCaXQoIF9iaXRJbmRleCgpICk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2JhY2tzcGFjZScsICdjdHJsK2JhY2tzcGFjZSddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdyZW1vdmUgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgKXtcblx0XHRcdFx0XHQkc2NvcGUua2lsbEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAndGFiJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnaW5jcmVhc2UgaW5kZW50Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpICYmICRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50IDwgMiApe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50Kys7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ3NoaWZ0K3RhYicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2RlY3JlYXNlIGluZGVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSAmJiAkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS50YWJDb3VudCA+IDAgKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS50YWJDb3VudC0tO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsndXAnLCAnZG93biddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdtb3ZlbWVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0JHNjb3BlLmp1bXBBcm91bmQoX2JpdEluZGV4KCksIGV2ZW50LmtleUlkZW50aWZpZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnY3RybCtjb21tYW5kK3VwJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnbW92ZSBiaXQgdXAnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLm1vdmVVcChfYml0SW5kZXgoKSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnY3RybCtjb21tYW5kK2Rvd24nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdtb3ZlIGJpdCBkb3duJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzY29wZS5tb3ZlRG93bihfYml0SW5kZXgoKSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2N0cmwrdicsICdjb21tYW5kK3YnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAncGFzdGUnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLnBhcnNlUGFzdGVkKF9iaXRJbmRleCgpKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdzaGlmdCBzaGlmdCcsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ3RvZ2dsZSBtYXJrZWQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5tYXJrID0gISRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1hcms7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ODg4ODg4ODg4IDg4ICAgICAgICA4OCA4ODhiICAgICAgODggICAsYWQ4ODg4YmEsIDg4ODg4ODg4ODg4OCA4OCAgICxhZDg4ODhiYSwgICA4ODhiICAgICAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4ODg4YiAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgODg4OGIgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICA4OCAgICAgICAgODggODggYDhiICAgIDg4IGQ4JyAgICAgICAgICAgICAgIDg4ICAgICAgODggZDgnICAgICAgICBgOGIgODggYDhiICAgIDg4ICBcblx0Ly8gXHQ4OGFhYWFhICAgICA4OCAgICAgICAgODggODggIGA4YiAgIDg4IDg4ICAgICAgICAgICAgICAgIDg4ICAgICAgODggODggICAgICAgICAgODggODggIGA4YiAgIDg4ICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICA4OCA4OCAgIGA4YiAgODggODggICAgICAgICAgICAgICAgODggICAgICA4OCA4OCAgICAgICAgICA4OCA4OCAgIGA4YiAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4OCAgICBgOGIgODggWTgsICAgICAgICAgICAgICAgODggICAgICA4OCBZOCwgICAgICAgICw4UCA4OCAgICBgOGIgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIFk4YS4gICAgLmE4UCA4OCAgICAgYDg4ODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgWThhLiAgICAuYThQICA4OCAgICAgYDg4ODggIFxuXHQvLyBcdDg4ICAgICAgICAgICBgXCJZODg4OFlcIicgIDg4ICAgICAgYDg4OCAgIGBcIlk4ODg4WVwiJyAgICAgIDg4ICAgICAgODggICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4ODggIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdCRzY29wZS5hZGRCaXQgPSBmdW5jdGlvbihpbmRleCwgY29udGVudCl7XG5cdFx0dmFyIGluY29taW5nQ29udGVudDtcblxuXHRcdGlmICh0eXBlb2YoY29udGVudCkgPT09ICd1bmRlZmluZWQnKVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gJyc7XG5cdFx0ZWxzZVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gY29udGVudDtcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCArIDEsIDAsIG5ld0JpdCgpKTtcblxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleCArIDFdLnRhYkNvdW50ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQ7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4ICsgMV0uY29udGVudCA9IGluY29taW5nQ29udGVudDtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXggKyAxXS5jb250ZW50Q2FyZXQgPSBpbmNvbWluZ0NvbnRlbnQ7XG5cblx0XHRcdCRzY29wZS5wYXJzZUxpbmsoaW5kZXgpO1xuXG5cdFx0XHRfZm9jdXNNZShpbmRleCArIDEpO1xuXHRcdH0sIDUwKTtcblx0fTtcblxuXHQkc2NvcGUucGFyc2VQYXN0ZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdC8vIHNwbGl0IGF0IGxpbmUgYnJlYWtzXG5cdFx0XHR2YXIgdGhlQ29udGVudCA9ICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuXG5cdFx0XHQvLyByZW1vdmUgZW1wdHkgbGluZXNcblx0XHRcdGZvciAodmFyIGwgPSAwOyBsIDwgdGhlQ29udGVudC5sZW5ndGg7IGwrKyl7XG5cdFx0XHRcdGlmICh0aGVDb250ZW50W2xdID09PSAnJykgdGhlQ29udGVudC5zcGxpY2UobCwgMSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNldCBibG9jayB0byBlbXB0eSBiZWZvcmUgcmVwbGFjaW5nIHcvIDFzdCBsaW5lXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gdGhlQ29udGVudFswXTtcblxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSB0aGVDb250ZW50WzBdO1xuXG5cdFx0XHQkc2NvcGUucGFyc2VMaW5rKGluZGV4KTtcblxuXHRcdFx0Zm9yICh2YXIgbCA9IDE7IGwgPCB0aGVDb250ZW50Lmxlbmd0aDsgbCsrKXtcblx0XHRcdFx0JHNjb3BlLmFkZEJpdChpbmRleCArIChsIC0gMSksIHRoZUNvbnRlbnRbbF0pO1xuXHRcdFx0fVxuXHRcdH0sIDUwKTsgXG5cdH1cblxuXHQkc2NvcGUucGFyc2VMaW5rID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHZhciBjb250ZW50ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudDtcblxuXHRcdGlmIChcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHA6Ly9cIikgPT09IDAgfHxcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHBzOi8vXCIpID09PSAwIFxuXHRcdCl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZygnT0ggTk9FUyBBIExJTksnKVxuXG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0XHRkYXRhVHlwZTonSlNPTlAnLFxuXHRcdFx0XHRkYXRhOntcblx0XHRcdFx0XHRVUkw6IGNvbnRlbnRcblx0XHRcdFx0fSxcblx0XHRcdFx0dXJsOiBcImh0dHA6Ly9yZS5qZWN0LmNoL3RyYS9waHAvdGl0bGUucGhwXCJcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKHRoZVRpdGxlKXtcblx0XHRcdFx0dmFyIGVzY2FwZWRUaXRsZSA9IF8udW5lc2NhcGUodGhlVGl0bGUudGl0bGUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlc2NhcGVkVGl0bGUpXG5cblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudCA9IGVzY2FwZWRUaXRsZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gZXNjYXBlZFRpdGxlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5hZGRyZXNzID0gY29udGVudDtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uaXNMaW5rID0gdHJ1ZTtcblxuXHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5vcGVuTGluayA9IGZ1bmN0aW9uKGJpdCl7XG5cblx0XHRpZiAoYml0LmlzTGluayAmJiAhYWx0SXNQcmVzc2VkKXtcblx0XHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXHRcdFx0dmFyIHdpbiA9IHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPScgKyBiaXQuYWRkcmVzcywgJ19ibGFuaycpO1xuXHRcdFx0d2luLmZvY3VzKCk7XG5cdFx0fVxuXHR9XG5cblx0JHNjb3BlLmtpbGxCaXQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdF9mb2N1c01lKGluZGV4IC0gMSlcblx0fTtcblxuXHQkc2NvcGUubW92ZVVwID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoX2JpdEluZGV4KCksIDEpWzBdO1xuXHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4IC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0X2ZvY3VzTWUoaW5kZXggLSAxKVxuXHR9O1xuXG5cdCRzY29wZS5tb3ZlRG93biA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKF9iaXRJbmRleCgpLCAxKVswXTtcblx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCArIDEsIDAsIHRoaXNCaXQpO1xuXHRcdF9mb2N1c01lKGluZGV4ICsgMSlcblx0fTtcblxuXHQkc2NvcGUuY2FyZXRUcmFja2VyID0gZnVuY3Rpb24oaW5kZXgsIGtleSl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHRoZUJpdCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdGN1cnJlbnRDYXJldCA9IHRoZUJpdC5zZWxlY3Rpb25TdGFydCxcblx0XHRcdFx0dGhlVmFsdWUgPSB0aGVCaXQudmFsdWU7XG5cblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IFxuXHRcdFx0XHR0aGVWYWx1ZS5zdWJzdHJpbmcoMCwgY3VycmVudENhcmV0KSArIFxuXHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJoaWRkZW5DYXJldFwiPjwvc3Bhbj4nICsgXG5cdFx0XHRcdHRoZVZhbHVlLnN1YnN0cmluZyhjdXJyZW50Q2FyZXQsIHRoZVZhbHVlLmxlbmd0aClcblxuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0sIDEwKVxuXHR9XG5cblxuXHQkc2NvcGUuanVtcEFyb3VuZCA9IGZ1bmN0aW9uKGluZGV4LCBrZXkpe1xuXHRcdHZhciAkdGhlQml0ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSxcblx0XHRcdCR0aGVDYXJldCA9ICR0aGVCaXQubmV4dCgpLmZpbmQoJy5oaWRkZW5DYXJldCcpLFxuXHRcdFx0dGhlQ2FyZXRQb3MgPSAkdGhlQ2FyZXQucG9zaXRpb24oKS50b3A7XG5cblx0XHRpZiAoIFxuXHRcdFx0KGtleSA9PT0gJ1VwJykgJiYgXG5cdFx0XHQodGhlQ2FyZXRQb3MgPiAwKSBcblx0XHQpe1xuXHRcdFx0JHRoZUJpdC5wYXJlbnRzKCcubm90ZV9iaXQnKVxuXHRcdFx0XHQucHJldignLm5vdGVfYml0JykuZmluZCgndGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKVxuXHRcdH1cblxuXHRcdGlmICggXG5cdFx0XHQoa2V5ID09PSAnRG93bicpICYmIFxuXHRcdFx0KHRoZUNhcmV0UG9zIDwgKCR0aGVDYXJldC5wYXJlbnQoKS5oZWlnaHQoKSAtIDE4KSkgXG5cdFx0KXtcblx0XHRcdCR0aGVCaXQucGFyZW50cygnLm5vdGVfYml0Jylcblx0XHRcdFx0Lm5leHQoJy5ub3RlX2JpdCcpLmZpbmQoJ3RleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKClcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLm1hcmsgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0ubWFyayA9ICEkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5tYXJrO1xuXHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1hcmtlZCA9IG5ldyBEYXRlO1xuXHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHR9O1xuXG5cdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbihjb250ZW50KXtcblx0XHR2YXIgd2luID0gd2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9JyArIGNvbnRlbnQsICdfYmxhbmsnKTtcblx0ICAgIHdpbi5mb2N1cygpO1xuXHR9O1xuXG5cdCRzY29wZS5iaXRCbHVyID0gZnVuY3Rpb24oJGluZGV4KXtcblx0XHRjb25zb2xlLmxvZygnQkxVUkQnKVxuXHR9XG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4OGIgICAgICAgICAgIGQ4OCA4ODg4ODg4ODg4OCA4ODhiICAgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4ODhiICAgICAgICAgZDg4OCA4OCAgICAgICAgICA4ODg4YiAgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OGA4YiAgICAgICBkOCc4OCA4OCAgICAgICAgICA4OCBgOGIgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCBgOGIgICAgIGQ4JyA4OCA4OGFhYWFhICAgICA4OCAgYDhiICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgYDhiICAgZDgnICA4OCA4OFwiXCJcIlwiXCIgICAgIDg4ICAgYDhiICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICAgYDhiIGQ4JyAgIDg4IDg4ICAgICAgICAgIDg4ICAgIGA4YiA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICAgIGA4ODgnICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICBgODg4OCBZOGEuICAgIC5hOFAgIFxuXHQvLyBcdDg4ICAgICBgOCcgICAgIDg4IDg4ODg4ODg4ODg4IDg4ICAgICAgYDg4OCAgYFwiWTg4ODhZXCInICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ICAgXG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBuZXdJRCA9IG5ld05vdGUoJHNjb3BlLm5vdGUucGFyZW50KTtcblx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld0lEKTtcblx0fTtcblxuXHQkc2NvcGUua2lsbE5vdGUgPSBmdW5jdGlvbigpe1xuXHRcdGtpbGxOb3RlKCRzY29wZS5ub3RlLmlkLCAkc2NvcGUubm90ZS5wYXJlbnQpO1xuXHR9O1xuXG5cdCRzY29wZS5zaG93VW5kb0xpc3QgPSBmdW5jdGlvbigpe1xuXG5cdH07XG5cblx0JHNjb3BlLm1hcmtOb3RlID0gZnVuY3Rpb24oKXtcblxuXHR9O1xuXG5cdCRzY29wZS5hZGRUb1RhYmxlID0gZnVuY3Rpb24oKXtcblxuXHR9O1xuXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4OCAgICAgICAgODggODg4ODg4ODg4ODggODggICAgICAgICAgODg4ODg4ODhiYSAgODg4ODg4ODg4ODggODg4ODg4ODhiYSAgIGFkODg4ODhiYSAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgODggICAgICAgICAgODggICAgICBcIjhiIGQ4XCIgICAgIFwiOGIgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICw4UCA4OCAgICAgICAgICA4OCAgICAgICw4UCBZOCwgICAgICAgICAgXG5cdC8vIFx0ODhhYWFhYWFhYTg4IDg4YWFhYWEgICAgIDg4ICAgICAgICAgIDg4YWFhYWFhOFAnIDg4YWFhYWEgICAgIDg4YWFhYWFhOFAnIGBZOGFhYWFhLCAgICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCJcIlwiXCI4OCA4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICAgIDg4XCJcIlwiXCJcIlwiJyAgIDg4XCJcIlwiXCJcIiAgICAgODhcIlwiXCJcIjg4JyAgICAgYFwiXCJcIlwiXCI4YiwgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICBgOGIgICAgICAgICAgIGA4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICBgOGIgIFk4YSAgICAgYThQICBcblx0Ly8gXHQ4OCAgICAgICAgODggODg4ODg4ODg4ODggODg4ODg4ODg4ODggODggICAgICAgICAgODg4ODg4ODg4ODggODggICAgICBgOGIgIFwiWTg4ODg4UFwiICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdHZhciBfaXNUZXh0YXJlYSA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudHlwZSA9PT0gJ3RleHRhcmVhJztcblx0fSxcblxuXHRfYml0SW5kZXggPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnBhcmVudHMoJy5ub3RlX2JpdCcpLmluZGV4KCk7XG5cdH0sXG5cblx0X2ZvY3VzTWUgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0JCgnLm5vdGVfYm9keScpXG5cdFx0XHRcdC5maW5kKCcubm90ZV9iaXQ6ZXEoJyArIChpbmRleCkgKyAnKSB0ZXh0YXJlYScpXG5cdFx0XHRcdC5mb2N1cygpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdCRzY29wZS5zb3J0YWJsZU9wdGlvbnNfbm90ZSA9IHtcblx0XHRoYW5kbGU6ICc+IC5iaXRfYW5jaG9yJ1xuXHR9XG59IiwiJChmdW5jdGlvbigpIHtcblxuXHQvLyBGRUFUVVJFIFRFU1RTXG5cblx0dmFyIF9wcm9wZXJ0eUNhY2hlID0ge307XHRcblxuXHRleHBvcnRzLnN1cHBvcnRzU3ZnID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCFfcHJvcGVydHlDYWNoZS5zdXBwb3J0c1N2Zyl7XG5cdFx0XHR2YXIgcmVzdWx0ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZShcImh0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjSW1hZ2VcIiwgXCIxLjFcIik7XG5cdFx0XHRfcHJvcGVydHlDYWNoZS5zdXBwb3J0c1N2ZyA9IHJlc3VsdDtcblx0XHRcdHJldHVybiByZXN1bHRcblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gX3Byb3BlcnR5Q2FjaGUuc3VwcG9ydHNTdmc7XG5cdH07IFxuXG5cdGV4cG9ydHMubWVkaWFRdWVyaWVzU3VwcG9ydGVkID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoIV9wcm9wZXJ0eUNhY2hlLm1lZGlhUXVlcmllc1N1cHBvcnRlZCl7XG5cblx0XHRcdHZhciBnZXRUZXN0ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lZGlhdGVzdFwiKSxcblx0XHRcdFx0Ym9vbDtcblxuXHRcdFx0aWYgKCFnZXRUZXN0ZXIpe1xuXHRcdFx0XHR2YXIgZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0XHRkLmlkID0gXCJtZWRpYXRlc3RcIjtcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkKTtcblx0XHRcdFx0Ym9vbCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB2YXIgZCA9IGdldFRlc3RlcjtcblxuXHRcdFx0aWYgKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkKS5wb3NpdGlvbiA9PSBcImFic29sdXRlXCIgKVxuXHRcdFx0XHRib29sID0gdHJ1ZTtcblxuXHRcdFx0X3Byb3BlcnR5Q2FjaGUubWVkaWFRdWVyaWVzU3VwcG9ydGVkID0gYm9vbDtcblxuXHRcdFx0cmV0dXJuIGJvb2w7XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIF9wcm9wZXJ0eUNhY2hlLm1lZGlhUXVlcmllc1N1cHBvcnRlZDtcblx0fTsgXG5cblx0ZXhwb3J0cy5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQgPSBmdW5jdGlvbigpe1xuXHRcdGlmICghX3Byb3BlcnR5Q2FjaGUuY292ZXJCYWNrZ3JvdW5kU3VwcG9ydGVkKXtcblx0XHRcdHZhciByZXN1bHQgPSAoJ2JhY2tncm91bmRTaXplJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUpO1xuXHRcdFx0X3Byb3BlcnR5Q2FjaGUuY292ZXJCYWNrZ3JvdW5kU3VwcG9ydGVkID0gcmVzdWx0O1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gX3Byb3BlcnR5Q2FjaGUuY292ZXJCYWNrZ3JvdW5kU3VwcG9ydGVkO1xuXHR9O1xuXHRcblxuXHQvLyBVVElMSVRJRVNcblxuXHRleHBvcnRzLm1hcF9yYW5nZSA9IGZ1bmN0aW9uKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcblx0ICAgIHJldHVybiAobG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKSkudG9GaXhlZCgyKTtcblx0fVxuXG5cdGV4cG9ydHMucmFuZG9tSW50ID0gZnVuY3Rpb24obWluLCBtYXgpIHtcblx0ICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xuXHR9XG5cblx0ZXhwb3J0cy5zY3JvbGxUb0hlcmUgPSBmdW5jdGlvbih3aGVyZSwgZXh0cmEpe1xuXHRcdGlmICghZXh0cmEpIGV4dHJhID0gMDtcblx0XHRcblx0XHR2YXIgdGFyZ2V0ID0gJCh3aGVyZSkub2Zmc2V0KCkudG9wO1xuXG5cdFx0Ly8gZGVmaW5lIGhvdyBsYXJnZSB5b3VyIHN0aWNreSBoZWFkZXIgaXMgaGVyZSFcblx0XHRpZiAod2luZG93Lm1lZGlhUXVlcnkuZ2V0UXVlcnkoKSA9PT0gJ21vYmlsZScpIHRhcmdldCAtPSA1NTtcblxuXHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0c2Nyb2xsVG9wOiB0YXJnZXQgKyBleHRyYVxuXHRcdH0sIDUwMCk7XG5cdH07IFxuXG5cdGV4cG9ydHMucGFnZVNldHVwID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdWJzY3JpYmVycyA9IFtdLFxuXHRcdFx0aXNTZXRVcCA9IGZhbHNlO1xuXG5cdFx0ZnVuY3Rpb24gb2theWdvKCl7XG5cdFx0XHRmb3IgKHZhciBtZXRob2QgaW4gc3Vic2NyaWJlcnMpIHtcblx0XHRcdFx0c3Vic2NyaWJlcnNbbWV0aG9kXSgpO1xuXHRcdFx0fVxuXHRcdFx0aXNTZXRVcCA9IHRydWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3Vic2NyaWJlKG1ldGhvZCkge1xuXHRcdFx0c3Vic2NyaWJlcnMucHVzaChtZXRob2QpO1xuXG5cdFx0XHRpc1NldFVwICYmIG9rYXlnbygpO1xuXHRcdH1cblxuXHRcdC8vIFJldHVybmFsICBcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG9rYXlnbzogb2theWdvLFxuXHRcdFx0c3Vic2NyaWJlOiBzdWJzY3JpYmVcblx0XHR9O1xuXHR9KSgpOyBcblxuXHRleHBvcnRzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG5cdFx0dmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG5cdFx0dmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbGFzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGltZXN0YW1wO1xuXG5cdFx0XHRpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+IDApIHtcblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHRpZiAoIWltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHRcdFx0aWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29udGV4dCA9IHRoaXM7XG5cdFx0XHRhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0dGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHR2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcblx0XHRcdGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuXHRcdFx0aWYgKGNhbGxOb3cpIHtcblx0XHRcdFx0cmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdFx0Y29udGV4dCA9IGFyZ3MgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdH07IFxuXG5cdGV4cG9ydHMubWVkaWFRdWVyeSA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgc3Vic2NyaWJlcnMgPSBbXSxcblx0XHRcdG1lZGlhQ3VycmVudCxcblx0XHRcdG1lZGlhUHJldixcblx0XHRcdCR3aW5kb3cgPSAkKHdpbmRvdyksXG5cdFx0XHQkaHRtbCA9ICQoJ2h0bWwnKTtcblxuXHRcdGZ1bmN0aW9uIGNhbGN1bGF0ZSgpe1xuXHRcdFx0dmFyIGlubmVyV2lkdGggPSAkd2luZG93LmlubmVyV2lkdGgoKSxcblx0XHRcdFx0aW5uZXJIZWlnaHQgPSAkd2luZG93LmlubmVySGVpZ2h0KCk7XG5cblx0XHRcdGlmICggaW5uZXJXaWR0aCA8IDc2OCApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAnbW9iaWxlJ1xuXHRcdFx0ZWxzZSBpZiAoICggaW5uZXJXaWR0aCA+PSA3NjgpICYmICggaW5uZXJXaWR0aCA8IDk5MiApICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICd0YWJsZXQnXG5cdFx0XHRlbHNlIGlmICggKCBpbm5lcldpZHRoID49IDk5MiApICYmICggaW5uZXJXaWR0aCA8IDEyMDAgKSApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAnZGVza3RvcCdcblx0XHRcdGVsc2UgaWYgKCBpbm5lcldpZHRoID49IDEyMDAgKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ2xhcmdlX2Rlc2t0b3AnXG5cblx0XHRcdGlmICggaW5uZXJIZWlnaHQgPCA3NDAgKVxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgKz0gJyBzaG9ydCdcblxuXHRcdFx0aWYgKCBtZWRpYUN1cnJlbnQgIT09IG1lZGlhUHJldiApe1xuXHRcdFx0XHRmb3IgKHZhciBtZXRob2QgaW4gc3Vic2NyaWJlcnMpIHtcblx0XHRcdFx0XHRzdWJzY3JpYmVyc1ttZXRob2RdKG1lZGlhQ3VycmVudCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIWV4cG9ydHMubWVkaWFRdWVyaWVzU3VwcG9ydGVkKCkpXG5cdFx0XHRcdFx0JGh0bWwucmVtb3ZlQ2xhc3MobWVkaWFQcmV2KS5hZGRDbGFzcyhtZWRpYUN1cnJlbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHRtZWRpYVByZXYgPSBtZWRpYUN1cnJlbnQ7IFxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN1YnNjcmliZShtZXRob2QpIHtcblx0XHRcdHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gZ2V0UXVlcnkoKXtcblx0XHRcdHJldHVybiBtZWRpYUN1cnJlbnQ7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGlzKHF1ZXJ5KXtcblx0XHRcdHJldHVybiBtZWRpYUN1cnJlbnQuaW5kZXhPZihxdWVyeSkgPj0gMDtcblx0XHR9O1xuXG5cdFx0dmFyIGNhbGN1bGF0ZURlYm91bmNlID0gZXhwb3J0cy5kZWJvdW5jZShjYWxjdWxhdGUsIDIwMCk7IFxuXG5cdFx0JHdpbmRvdy5yZXNpemUoY2FsY3VsYXRlRGVib3VuY2UpO1xuXG5cdFx0Ly8gY2FsY3VsYXRlKCk7XG5cdFx0XG5cdFx0Ly8gJHdpbmRvdy5sb2FkKGNhbGN1bGF0ZSk7XG5cblx0XHQvLyBleHBvcnRzLnBhZ2VTZXR1cC5zdWJzY3JpYmUoY2FsY3VsYXRlKTtcblxuXHRcdC8vIFJldHVybmFsXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWJzY3JpYmU6IHN1YnNjcmliZSxcblx0XHRcdGdldFF1ZXJ5OiBnZXRRdWVyeSxcblx0XHRcdGlzOiBpc1xuXHRcdH07XG5cdH0pKCk7IFxuXG5cdGV4cG9ydHMuZ01hcExvYWRlciA9IChmdW5jdGlvbigpIHtcblxuXHRcdC8vIFZhcmlhYmxlc1xuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0dmFyIHN1YnNjcmliZXJzID0gW107XG5cblx0XHQvLyBMb2FkIEdvb2dsZSBNYXBzXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHRnTWFwU2V0dXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0XHRzY3JpcHQuc3JjID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcz92PTMuZXhwJicgKyAnY2FsbGJhY2s9JCRfLmdNYXBMb2FkZXIucmVhZHknO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHJlYWR5KCkge1xuXHRcdFx0Zm9yICh2YXIgbWV0aG9kIGluIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdHN1YnNjcmliZXJzW21ldGhvZF0oKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc3Vic2NyaWJlKG1ldGhvZCkge1xuXHRcdFx0c3Vic2NyaWJlcnMucHVzaChtZXRob2QpO1xuXHRcdH07XG5cblx0XHQvLyAkKHdpbmRvdykubG9hZChnTWFwU2V0dXApXG5cblx0XHQvLyBSZXR1cm5hbFxuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVhZHk6IHJlYWR5LFxuXHRcdFx0c3Vic2NyaWJlOiBzdWJzY3JpYmVcblx0XHR9O1xuXHR9KSgpO1xuXG5cdGV4cG9ydHMucmFuZG9taXplID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdHZhciB1dWlkID0gJ3h4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcblx0XHRcdHZhciByID0gKCBkICsgTWF0aC5yYW5kb20oKSAqIDE2ICkgJSAxNiB8IDA7XG5cdFx0XHRkID0gTWF0aC5mbG9vciggZCAvIDE2ICk7XG5cdFx0XHRyZXR1cm4gKGMgPT0gJ3gnID8gciA6ICggciAmIDB4NyB8IDB4OCApICkudG9TdHJpbmcoMTYpO1xuXHRcdH0pO1xuXHRcdHJldHVybiB1dWlkO1xuXHR9O1xuXG5cbn0pOyJdfQ==
