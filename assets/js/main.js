(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Vendor files
// var $ = window.jQuery = window.$ = require('./vendor/jquery-1.11.1.min');

var $$_ = window.$$_ = require('./shared/core'); 

// require('./vendor/chosen.jquery.min'); 

// include your scripts here

// require('./shared/textarea-autosize'); 
// require('./shared/img'); 
// require('./shared/map'); 
// require('./shared/parallax'); 
// require('./shared/select'); 
// require('./shared/search'); 

var noteCtrl = require('./modules/noteCtrl');
var boardCtrl = require('./modules/boardCtrl');

// expose your functions to the global scope for testing
var mxm = {};

window.firebaseURL = 'https://lick.firebaseio.com';

// init some things
// $(function($){

// });


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

app.config(function($routeProvider) {
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
        });
});

app.factory('Note', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = new Firebase( window.firebaseURL + '/notes/' + id);


			// var theFBObject = 

			// console.log(theFBObject)
			// console.log(theFBObject.d)

			return $firebaseObject(ref);
		};
	}
]);

app.factory('NoteIndex', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = new Firebase( window.firebaseURL + '/noteIndex/');

			return $firebaseObject(ref);
		};
	}
]);

app.factory('Board', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = new Firebase( window.firebaseURL + '/boards/' + id);

			return $firebaseObject(ref);
		};
	}
]);

app.factory('BoardIndex', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = new Firebase( window.firebaseURL + '/boardIndex/');

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

app.factory('newNote',['newBit', '$firebaseObject', 'NoteIndex',
	function(newBit, $firebaseObject, NoteIndex) {
		return function(parent, id) {
			
			var noteID;

			if (id){
				noteID = id;
			}else{
				noteID = $$_.randomize();
			}

			var noteIndexRef = new Firebase( window.firebaseURL + '/noteIndex/' + noteID);
			noteIndexRef.set('');

			var noteRef = new Firebase( window.firebaseURL + '/notes/' + noteID );
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


app.factory('newBoard', 
	function() {
		return function() {
			boardID = $$_.randomize();

			var boardRef = new Firebase( window.firebaseURL + '/boards/' + boardID );
			boardRef.set({
				title: '',
				id: boardID,
				notes:[]
			});

			return boardID;
		};
	}
);




app.controller('noteCtrl', 
	[
		'$rootScope', 
		'$scope',
		'newNote', 
		'Note',
		'NoteIndex',
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
		'newNote',
		'NoteIndex',
		'$routeParams', 
		'$route',
		'hotkeys',
		'$timeout',
		'$location',
		boardCtrl
	]
);

// app.directive('caret', function(){
// 	var hello = 0;
// 	return {
//         restrict: 'E',
//         require: 'ngModel',
//         // replace: true,
//         scope: {
//             // props: '=parseUrl',
//             ngModel: '=ngModel'
//         },
//         link: function compile(scope, element, attrs, controller) {
//             scope.$watch('ngModel', function (value) {
//                 // var html = value.replace(urlPattern, '<a target="' + scope.props.target + '" href="$&">$&</a>') + " | " + scope.props.otherProp;
//                 // element.html(html);
//                 // console.log(element)
//                 // console.log(

//                 	var currentCaret = element.next()[0].selectionStart;
//                 	// var theValue = that.target.value;

//                 	// var $theSizer = $(that.target).siblings('.sizer')

//                 	element.html(
//                 		'<span class="delicate">'+
//                 		value.substring(0, currentCaret) + 
//                 		'<span class="hiddenCaret"></span>' + 
//                 		value.substring(currentCaret, value.length)+
//                 		'</span>'
//                 	)


//                 	// element.html('yeah! ' + hello++)

//                 	console.log(element.next())
//                 	console.log(element.next()[0].selectionStart)

//                 	// console.log(value, scope, element, attrs, controller)
//                 	// )
//             });
//         }
//     };
// })



// app.directive('caret', function(){
// 	return {
// 	        restrict: 'A',
// 	        require: '?ngModel',
// 	        link: function (scope, element, attrs, controller) {
// 	            scope.$watch(attrs.ngModel, function(newValue) {
// 	                       console.log("Changed to " + newValue);
// 	            });
// 	        }
// 	    } 
// })
// app.directive('caret', function(){
// 	return {
//         restrict: 'E',
//         scope: {
//             val: '='
//         },
//         link: function(scope, element, attrs) {
//             scope.$watch('val', function(newValue, oldValue) {
//                 if (newValue)
//                     console.log("I see a data change!");
//             }, true);
//         }
//     }
// })

// app.directive('caret', function() {
//   return {
//     restrict: 'E',
//     transclude: true,
//     compile: function(elem) {
//     	console.log('jep')
//       // elem.replaceWith(Markdowner.transform(elem.html()));
//     }
//   }
// });

// app.directive('newFocus', ['$timeout', function($timeout) {
// 	return {
// 		restrict: 'A',
// 		link : function($scope, $element) {
// 			$timeout(function() {
// 				console.log(document.activeElement.type)
// 				if (document.activeElement.type === 'textarea'){
// 					console.log('WOW')
// 					$element[0].focus();
// 				}
// 			});
// 		}
// 	}
// }]);

// app.directive('customAutofocus', function() {
//   return{
//          restrict: 'A',

//          link: function(scope, element, attrs){
//            scope.$watch(function(){
//              return scope.$eval(attrs.customAutofocus);
//              },function (newValue){
//                if (newValue == true){
//                    element[0].focus();//use focus function instead of autofocus attribute to avoid cross browser problem. And autofocus should only be used to mark an element to be focused when page loads.
//                }
//            });
//          }
//      };
// })

















},{"./modules/boardCtrl":2,"./modules/noteCtrl":3,"./shared/core":4}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
module.exports = function(
	$rootScope, 
	$scope, 
	newNote,
	Note, 
	NoteIndex,
	newBit,
	$routeParams, 
	$route, 
	hotkeys,
	$timeout,
	$location
) {
	
	Note($routeParams.id).$bindTo($scope, 'note')
	.then(function() {
		if (typeof($scope.note.body) === 'undefined'){
			newNote('', $routeParams.id);
		}
	});

	NoteIndex($routeParams.id).$bindTo($scope, 'noteIndex');

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
			combo: 'ctrl',
			description: 'add new bit',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				console.log($scope.note)
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

		console.log(index)

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

	$scope.openLink = function(index){
		console.log('yeah!')
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
},{}],4:[function(require,module,exports){
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

		$(window).load(gMapSetup)

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9tYWluLmpzIiwiLi4vanMvbW9kdWxlcy9ib2FyZEN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL25vdGVDdHJsLmpzIiwiLi4vanMvc2hhcmVkL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gVmVuZG9yIGZpbGVzXG4vLyB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgPSB3aW5kb3cuJCA9IHJlcXVpcmUoJy4vdmVuZG9yL2pxdWVyeS0xLjExLjEubWluJyk7XG5cbnZhciAkJF8gPSB3aW5kb3cuJCRfID0gcmVxdWlyZSgnLi9zaGFyZWQvY29yZScpOyBcblxuLy8gcmVxdWlyZSgnLi92ZW5kb3IvY2hvc2VuLmpxdWVyeS5taW4nKTsgXG5cbi8vIGluY2x1ZGUgeW91ciBzY3JpcHRzIGhlcmVcblxuLy8gcmVxdWlyZSgnLi9zaGFyZWQvdGV4dGFyZWEtYXV0b3NpemUnKTsgXG4vLyByZXF1aXJlKCcuL3NoYXJlZC9pbWcnKTsgXG4vLyByZXF1aXJlKCcuL3NoYXJlZC9tYXAnKTsgXG4vLyByZXF1aXJlKCcuL3NoYXJlZC9wYXJhbGxheCcpOyBcbi8vIHJlcXVpcmUoJy4vc2hhcmVkL3NlbGVjdCcpOyBcbi8vIHJlcXVpcmUoJy4vc2hhcmVkL3NlYXJjaCcpOyBcblxudmFyIG5vdGVDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL25vdGVDdHJsJyk7XG52YXIgYm9hcmRDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2JvYXJkQ3RybCcpO1xuXG4vLyBleHBvc2UgeW91ciBmdW5jdGlvbnMgdG8gdGhlIGdsb2JhbCBzY29wZSBmb3IgdGVzdGluZ1xudmFyIG14bSA9IHt9O1xuXG53aW5kb3cuZmlyZWJhc2VVUkwgPSAnaHR0cHM6Ly9saWNrLmZpcmViYXNlaW8uY29tJztcblxuLy8gaW5pdCBzb21lIHRoaW5nc1xuLy8gJChmdW5jdGlvbigkKXtcblxuLy8gfSk7XG5cblxuLy8gZGVmaW5lIG91ciBhcHAgYW5kIGRlcGVuZGVuY2llcyAocmVtZW1iZXIgdG8gaW5jbHVkZSBmaXJlYmFzZSEpXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoXG5cdCdsaWNrJywgXG5cdFtcblx0XHQnZmlyZWJhc2UnLCBcblx0XHQnbmdSb3V0ZScsXG5cdFx0J3VpLnNvcnRhYmxlJyxcblx0XHQnY2ZwLmhvdGtleXMnLFxuXHRcdCduZ1Nhbml0aXplJyxcblx0XHQnZ3JpZHN0ZXInXG5cdF1cbik7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuXG4gICAgICAgIC8vIHJvdXRlIGZvciB0aGUgaG9tZSBwYWdlXG4gICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgLy8gY29udHJvbGxlciAgOiAnbWFpbkNvbnRyb2xsZXInXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIG5vdGVzXG4gICAgICAgIC53aGVuKCcvbm90ZS86aWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL25vdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdub3RlQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgYm9hcmRzXG4gICAgICAgIC53aGVuKCcvYm9hcmQvOmlkJywgeyBcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdib2FyZEN0cmwnXG4gICAgICAgIH0pO1xufSk7XG5cbmFwcC5mYWN0b3J5KCdOb3RlJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSBuZXcgRmlyZWJhc2UoIHdpbmRvdy5maXJlYmFzZVVSTCArICcvbm90ZXMvJyArIGlkKTtcblxuXG5cdFx0XHQvLyB2YXIgdGhlRkJPYmplY3QgPSBcblxuXHRcdFx0Ly8gY29uc29sZS5sb2codGhlRkJPYmplY3QpXG5cdFx0XHQvLyBjb25zb2xlLmxvZyh0aGVGQk9iamVjdC5kKVxuXG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCdOb3RlSW5kZXgnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IG5ldyBGaXJlYmFzZSggd2luZG93LmZpcmViYXNlVVJMICsgJy9ub3RlSW5kZXgvJyk7XG5cblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ0JvYXJkJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSBuZXcgRmlyZWJhc2UoIHdpbmRvdy5maXJlYmFzZVVSTCArICcvYm9hcmRzLycgKyBpZCk7XG5cblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ0JvYXJkSW5kZXgnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IG5ldyBGaXJlYmFzZSggd2luZG93LmZpcmViYXNlVVJMICsgJy9ib2FyZEluZGV4LycpO1xuXG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbmFwcC5mYWN0b3J5KCduZXdCaXQnLCBcblx0ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0dHlwZTpcInBsYWluVGV4dFwiLFxuXHRcdFx0XHR0YWJDb3VudDogMCxcblx0XHRcdFx0Y29udGVudDogJycsXG5cdFx0XHRcdGNvbnRlbnRDYXJldDogJycsXG5cdFx0XHRcdGJpdElEOiAkJF8ucmFuZG9taXplKCksXG5cdFx0XHRcdG1hcms6IGZhbHNlLFxuXHRcdFx0XHRjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuXHRcdFx0XHRkZXN0cm95ZWQ6IFwiXCIsXG5cdFx0XHRcdG1hcmtlZDogXCJcIixcblx0XHRcdFx0bWVudV9vcGVuOiBmYWxzZSxcblx0XHRcdFx0aXNMaW5rOiBmYWxzZSxcblx0XHRcdFx0YWRkcmVzczogJydcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuKTtcblxuYXBwLmZhY3RvcnkoJ25ld05vdGUnLFsnbmV3Qml0JywgJyRmaXJlYmFzZU9iamVjdCcsICdOb3RlSW5kZXgnLFxuXHRmdW5jdGlvbihuZXdCaXQsICRmaXJlYmFzZU9iamVjdCwgTm90ZUluZGV4KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHBhcmVudCwgaWQpIHtcblx0XHRcdFxuXHRcdFx0dmFyIG5vdGVJRDtcblxuXHRcdFx0aWYgKGlkKXtcblx0XHRcdFx0bm90ZUlEID0gaWQ7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bm90ZUlEID0gJCRfLnJhbmRvbWl6ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbm90ZUluZGV4UmVmID0gbmV3IEZpcmViYXNlKCB3aW5kb3cuZmlyZWJhc2VVUkwgKyAnL25vdGVJbmRleC8nICsgbm90ZUlEKTtcblx0XHRcdG5vdGVJbmRleFJlZi5zZXQoJycpO1xuXG5cdFx0XHR2YXIgbm90ZVJlZiA9IG5ldyBGaXJlYmFzZSggd2luZG93LmZpcmViYXNlVVJMICsgJy9ub3Rlcy8nICsgbm90ZUlEICk7XG5cdFx0XHRub3RlUmVmLnNldCh7XG5cdFx0XHRcdHRpdGxlOiAnJyxcblx0XHRcdFx0cGFyZW50OiB0eXBlb2YocGFyZW50KSA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcGFyZW50LFxuXHRcdFx0XHRpZDogbm90ZUlELFxuXHRcdFx0XHRib2R5OiBbbmV3Qml0KCldLFxuXHRcdFx0XHRjYXRlZ29yeTogMCxcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0bGlzdDogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBub3RlSUQ7XG5cdFx0fTtcblx0fVxuXSk7XG5cblxuYXBwLmZhY3RvcnkoJ25ld0JvYXJkJywgXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGJvYXJkSUQgPSAkJF8ucmFuZG9taXplKCk7XG5cblx0XHRcdHZhciBib2FyZFJlZiA9IG5ldyBGaXJlYmFzZSggd2luZG93LmZpcmViYXNlVVJMICsgJy9ib2FyZHMvJyArIGJvYXJkSUQgKTtcblx0XHRcdGJvYXJkUmVmLnNldCh7XG5cdFx0XHRcdHRpdGxlOiAnJyxcblx0XHRcdFx0aWQ6IGJvYXJkSUQsXG5cdFx0XHRcdG5vdGVzOltdXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGJvYXJkSUQ7XG5cdFx0fTtcblx0fVxuKTtcblxuXG5cblxuYXBwLmNvbnRyb2xsZXIoJ25vdGVDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLFxuXHRcdCduZXdOb3RlJywgXG5cdFx0J05vdGUnLFxuXHRcdCdOb3RlSW5kZXgnLFxuXHRcdCduZXdCaXQnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHRub3RlQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignYm9hcmRDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLCBcblx0XHQnQm9hcmQnLFxuXHRcdCduZXdOb3RlJyxcblx0XHQnTm90ZUluZGV4Jyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0Ym9hcmRDdHJsXG5cdF1cbik7XG5cbi8vIGFwcC5kaXJlY3RpdmUoJ2NhcmV0JywgZnVuY3Rpb24oKXtcbi8vIFx0dmFyIGhlbGxvID0gMDtcbi8vIFx0cmV0dXJuIHtcbi8vICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbi8vICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuLy8gICAgICAgICAvLyByZXBsYWNlOiB0cnVlLFxuLy8gICAgICAgICBzY29wZToge1xuLy8gICAgICAgICAgICAgLy8gcHJvcHM6ICc9cGFyc2VVcmwnLFxuLy8gICAgICAgICAgICAgbmdNb2RlbDogJz1uZ01vZGVsJ1xuLy8gICAgICAgICB9LFxuLy8gICAgICAgICBsaW5rOiBmdW5jdGlvbiBjb21waWxlKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikge1xuLy8gICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCduZ01vZGVsJywgZnVuY3Rpb24gKHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICAgLy8gdmFyIGh0bWwgPSB2YWx1ZS5yZXBsYWNlKHVybFBhdHRlcm4sICc8YSB0YXJnZXQ9XCInICsgc2NvcGUucHJvcHMudGFyZ2V0ICsgJ1wiIGhyZWY9XCIkJlwiPiQmPC9hPicpICsgXCIgfCBcIiArIHNjb3BlLnByb3BzLm90aGVyUHJvcDtcbi8vICAgICAgICAgICAgICAgICAvLyBlbGVtZW50Lmh0bWwoaHRtbCk7XG4vLyAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudClcbi8vICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcblxuLy8gICAgICAgICAgICAgICAgIFx0dmFyIGN1cnJlbnRDYXJldCA9IGVsZW1lbnQubmV4dCgpWzBdLnNlbGVjdGlvblN0YXJ0O1xuLy8gICAgICAgICAgICAgICAgIFx0Ly8gdmFyIHRoZVZhbHVlID0gdGhhdC50YXJnZXQudmFsdWU7XG5cbi8vICAgICAgICAgICAgICAgICBcdC8vIHZhciAkdGhlU2l6ZXIgPSAkKHRoYXQudGFyZ2V0KS5zaWJsaW5ncygnLnNpemVyJylcblxuLy8gICAgICAgICAgICAgICAgIFx0ZWxlbWVudC5odG1sKFxuLy8gICAgICAgICAgICAgICAgIFx0XHQnPHNwYW4gY2xhc3M9XCJkZWxpY2F0ZVwiPicrXG4vLyAgICAgICAgICAgICAgICAgXHRcdHZhbHVlLnN1YnN0cmluZygwLCBjdXJyZW50Q2FyZXQpICsgXG4vLyAgICAgICAgICAgICAgICAgXHRcdCc8c3BhbiBjbGFzcz1cImhpZGRlbkNhcmV0XCI+PC9zcGFuPicgKyBcbi8vICAgICAgICAgICAgICAgICBcdFx0dmFsdWUuc3Vic3RyaW5nKGN1cnJlbnRDYXJldCwgdmFsdWUubGVuZ3RoKStcbi8vICAgICAgICAgICAgICAgICBcdFx0Jzwvc3Bhbj4nXG4vLyAgICAgICAgICAgICAgICAgXHQpXG5cblxuLy8gICAgICAgICAgICAgICAgIFx0Ly8gZWxlbWVudC5odG1sKCd5ZWFoISAnICsgaGVsbG8rKylcblxuLy8gICAgICAgICAgICAgICAgIFx0Y29uc29sZS5sb2coZWxlbWVudC5uZXh0KCkpXG4vLyAgICAgICAgICAgICAgICAgXHRjb25zb2xlLmxvZyhlbGVtZW50Lm5leHQoKVswXS5zZWxlY3Rpb25TdGFydClcblxuLy8gICAgICAgICAgICAgICAgIFx0Ly8gY29uc29sZS5sb2codmFsdWUsIHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcilcbi8vICAgICAgICAgICAgICAgICBcdC8vIClcbi8vICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG4vLyAgICAgfTtcbi8vIH0pXG5cblxuXG4vLyBhcHAuZGlyZWN0aXZlKCdjYXJldCcsIGZ1bmN0aW9uKCl7XG4vLyBcdHJldHVybiB7XG4vLyBcdCAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbi8vIFx0ICAgICAgICByZXF1aXJlOiAnP25nTW9kZWwnLFxuLy8gXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIpIHtcbi8vIFx0ICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4vLyBcdCAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2VkIHRvIFwiICsgbmV3VmFsdWUpO1xuLy8gXHQgICAgICAgICAgICB9KTtcbi8vIFx0ICAgICAgICB9XG4vLyBcdCAgICB9IFxuLy8gfSlcbi8vIGFwcC5kaXJlY3RpdmUoJ2NhcmV0JywgZnVuY3Rpb24oKXtcbi8vIFx0cmV0dXJuIHtcbi8vICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbi8vICAgICAgICAgc2NvcGU6IHtcbi8vICAgICAgICAgICAgIHZhbDogJz0nXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuLy8gICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCd2YWwnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUpXG4vLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSSBzZWUgYSBkYXRhIGNoYW5nZSFcIik7XG4vLyAgICAgICAgICAgICB9LCB0cnVlKTtcbi8vICAgICAgICAgfVxuLy8gICAgIH1cbi8vIH0pXG5cbi8vIGFwcC5kaXJlY3RpdmUoJ2NhcmV0JywgZnVuY3Rpb24oKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgcmVzdHJpY3Q6ICdFJyxcbi8vICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuLy8gICAgIGNvbXBpbGU6IGZ1bmN0aW9uKGVsZW0pIHtcbi8vICAgICBcdGNvbnNvbGUubG9nKCdqZXAnKVxuLy8gICAgICAgLy8gZWxlbS5yZXBsYWNlV2l0aChNYXJrZG93bmVyLnRyYW5zZm9ybShlbGVtLmh0bWwoKSkpO1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfSk7XG5cbi8vIGFwcC5kaXJlY3RpdmUoJ25ld0ZvY3VzJywgWyckdGltZW91dCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4vLyBcdHJldHVybiB7XG4vLyBcdFx0cmVzdHJpY3Q6ICdBJyxcbi8vIFx0XHRsaW5rIDogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCkge1xuLy8gXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudHlwZSlcbi8vIFx0XHRcdFx0aWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudHlwZSA9PT0gJ3RleHRhcmVhJyl7XG4vLyBcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1dPVycpXG4vLyBcdFx0XHRcdFx0JGVsZW1lbnRbMF0uZm9jdXMoKTtcbi8vIFx0XHRcdFx0fVxuLy8gXHRcdFx0fSk7XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9XSk7XG5cbi8vIGFwcC5kaXJlY3RpdmUoJ2N1c3RvbUF1dG9mb2N1cycsIGZ1bmN0aW9uKCkge1xuLy8gICByZXR1cm57XG4vLyAgICAgICAgICByZXN0cmljdDogJ0EnLFxuXG4vLyAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuLy8gICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24oKXtcbi8vICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuJGV2YWwoYXR0cnMuY3VzdG9tQXV0b2ZvY3VzKTtcbi8vICAgICAgICAgICAgICB9LGZ1bmN0aW9uIChuZXdWYWx1ZSl7XG4vLyAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gdHJ1ZSl7XG4vLyAgICAgICAgICAgICAgICAgICAgZWxlbWVudFswXS5mb2N1cygpOy8vdXNlIGZvY3VzIGZ1bmN0aW9uIGluc3RlYWQgb2YgYXV0b2ZvY3VzIGF0dHJpYnV0ZSB0byBhdm9pZCBjcm9zcyBicm93c2VyIHByb2JsZW0uIEFuZCBhdXRvZm9jdXMgc2hvdWxkIG9ubHkgYmUgdXNlZCB0byBtYXJrIGFuIGVsZW1lbnQgdG8gYmUgZm9jdXNlZCB3aGVuIHBhZ2UgbG9hZHMuXG4vLyAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgfVxuLy8gICAgICB9O1xuLy8gfSlcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdEJvYXJkLFxuXHRuZXdOb3RlLFxuXHROb3RlSW5kZXgsIFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsIFxuXHRob3RrZXlzLFxuXHQkdGltZW91dCxcblx0JGxvY2F0aW9uXG4pIHtcblx0Qm9hcmQoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ2JvYXJkJyk7XG5cblx0Tm90ZUluZGV4KCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlSW5kZXgnKTtcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VudGVyJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnY29uZmlybSBuZXcgbmFtZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coX2lzSW5wdXQoKSlcblx0XHRcdFx0aWYgKCBfaXNJbnB1dCgpICl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coX25vdGVJRCgpKVxuXHRcdFx0XHRcdC8vICRzY29wZS50aXRsZVNhdmUoX25vdGVJRCgpLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblxuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHQkc2NvcGUubm90ZVRpdGxlTG9va3VwID0gZnVuY3Rpb24oaWQsIGUpe1xuXHRcdHZhciB0aGVUaXRsZSA9ICRzY29wZS5ub3RlSW5kZXhbaWRdO1xuXG5cdFx0aWYgKGUpe1xuXHRcdFx0ZS50YXJnZXQudmFsdWUgPSB0aGVUaXRsZTtcblx0XHRcdCRzY29wZS5ub3RlVGl0bGVMb29rdXAoaWQpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGVUaXRsZTtcblx0fVxuXG5cdCRzY29wZS5uZXdOb3RlX2JvYXJkID0gZnVuY3Rpb24oYm9hcmRJRCl7XG5cdFx0dmFyIG5ld0lEID0gbmV3Tm90ZShib2FyZElEKTtcblx0XHQkc2NvcGUuYm9hcmQubm90ZXMucHVzaCh7XG5cdFx0XHRpZDogbmV3SURcblx0XHR9KTtcblx0fVxuXG5cdCRzY29wZS50aXRsZVNhdmUgPSBmdW5jdGlvbihpZCwgZSl7XG5cdFx0dmFyIG5ld05hbWUgPSBlLnZhbHVlXG5cdFx0JHNjb3BlLm5vdGVJbmRleFtpZF0gPSBuZXdOYW1lO1xuXHRcdHZhciBub3RlUmVmID0gbmV3IEZpcmViYXNlKCB3aW5kb3cuZmlyZWJhc2VVUkwgKyAnL25vdGVzLycgKyBpZCApO1xuXHRcdG5vdGVSZWYuY2hpbGQoJ3RpdGxlJykuc2V0KG5ld05hbWUpO1xuXG5cdFx0JHNjb3BlLm5vdGVUaXRsZUxvb2t1cChpZCk7XG5cdH1cblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkKCkpO1xuXHR9XG5cblx0JHNjb3BlLmJvYXJkR3JpZE9wdHMgPSB7XG5cdCAgICBjb2x1bW5zOiA0LFxuXHQgICAgZmxvYXRpbmc6IGZhbHNlLFxuXHQgICAgbW9iaWxlTW9kZUVuYWJsZWQ6IGZhbHNlLFxuXHQgICAgbWluQ29sdW1uczogNCxcblx0ICAgIG1pblJvd3M6IDQsXG5cdCAgICBtYXhSb3dzOiAxMCxcblx0ICAgIGRlZmF1bHRTaXplWDogMSxcblx0ICAgIGRlZmF1bHRTaXplWTogMSxcblx0ICAgIHJlc2l6YWJsZToge1xuXHQgICAgICAgZW5hYmxlZDogZmFsc2UsXG5cdCAgICB9LFxuXHR9O1xuXG5cdHZhciBfaXNJbnB1dCA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coJ1dIQVQgVEhFIEZVQ0snKVxuXHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnR5cGUgPT09ICd0ZXh0Jztcblx0fSxcblxuXHRfbm90ZUlEID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5wYXJlbnQoJy5ib2FyZF9ub3RlJykuYXR0cignZGF0YS1pZCcpO1xuXHR9O1xuXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdG5ld05vdGUsXG5cdE5vdGUsIFxuXHROb3RlSW5kZXgsXG5cdG5ld0JpdCxcblx0JHJvdXRlUGFyYW1zLCBcblx0JHJvdXRlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvblxuKSB7XG5cdFxuXHROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHR5cGVvZigkc2NvcGUubm90ZS5ib2R5KSA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0bmV3Tm90ZSgnJywgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHR9XG5cdH0pO1xuXG5cdE5vdGVJbmRleCgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZUluZGV4Jyk7XG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCAgICxhZDg4ODhiYSwgODg4ODg4ODg4ODg4IDg4ICAgICAgYThQICA4ODg4ODg4ODg4OCA4YiAgICAgICAgZDggYWQ4ODg4OGJhICAgXG5cdC8vIFx0ODggICAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgICAgODggICAgICA4OCAgICAsODgnICAgODggICAgICAgICAgIFk4LCAgICAsOFAgZDhcIiAgICAgXCI4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IGQ4JyAgICAgICAgYDhiICAgIDg4ICAgICAgODggICw4OFwiICAgICA4OCAgICAgICAgICAgIFk4LCAgLDhQICBZOCwgICAgICAgICAgXG5cdC8vIFx0ODhhYWFhYWFhYTg4IDg4ICAgICAgICAgIDg4ICAgIDg4ICAgICAgODgsZDg4JyAgICAgIDg4YWFhYWEgICAgICAgIFwiOGFhOFwiICAgYFk4YWFhYWEsICAgIFxuXHQvLyBcdDg4XCJcIlwiXCJcIlwiXCJcIjg4IDg4ICAgICAgICAgIDg4ICAgIDg4ICAgICAgODg4OFwiODgsICAgICA4OFwiXCJcIlwiXCIgICAgICAgICBgODgnICAgICAgYFwiXCJcIlwiXCI4YiwgIFxuXHQvLyBcdDg4ICAgICAgICA4OCBZOCwgICAgICAgICw4UCAgICA4OCAgICAgIDg4UCAgIFk4YiAgICA4OCAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgIGA4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4ICBZOGEuICAgIC5hOFAgICAgIDg4ICAgICAgODggICAgIFwiODgsICA4OCAgICAgICAgICAgICAgIDg4ICAgICBZOGEgICAgIGE4UCAgXG5cdC8vIFx0ODggICAgICAgIDg4ICAgYFwiWTg4ODhZXCInICAgICAgODggICAgICA4OCAgICAgICBZOGIgODg4ODg4ODg4ODggICAgICA4OCAgICAgIFwiWTg4ODg4UFwiICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnY3RybCcsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FkZCBuZXcgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUubm90ZSlcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlbnRlcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FkZCBuZXcgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgKXtcblx0XHRcdFx0XHQkc2NvcGUuYWRkQml0KCBfYml0SW5kZXgoKSApO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdiYWNrc3BhY2UnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdyZW1vdmUgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgKCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmNvbnRlbnQgPT09ICcnKSl7XG5cdFx0XHRcdFx0JHNjb3BlLmtpbGxCaXQoIF9iaXRJbmRleCgpICk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2JhY2tzcGFjZScsICdjdHJsK2JhY2tzcGFjZSddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdyZW1vdmUgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgKXtcblx0XHRcdFx0XHQkc2NvcGUua2lsbEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAndGFiJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnaW5jcmVhc2UgaW5kZW50Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpICYmICRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50IDwgMiApe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50Kys7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ3NoaWZ0K3RhYicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2RlY3JlYXNlIGluZGVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSAmJiAkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS50YWJDb3VudCA+IDAgKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS50YWJDb3VudC0tO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsndXAnLCAnZG93biddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdtb3ZlbWVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0JHNjb3BlLmp1bXBBcm91bmQoX2JpdEluZGV4KCksIGV2ZW50LmtleUlkZW50aWZpZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnY3RybCtjb21tYW5kK3VwJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnbW92ZSBiaXQgdXAnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLm1vdmVVcChfYml0SW5kZXgoKSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnY3RybCtjb21tYW5kK2Rvd24nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdtb3ZlIGJpdCBkb3duJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzY29wZS5tb3ZlRG93bihfYml0SW5kZXgoKSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2N0cmwrdicsICdjb21tYW5kK3YnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAncGFzdGUnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLnBhcnNlUGFzdGVkKF9iaXRJbmRleCgpKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ODg4ODg4ODg4IDg4ICAgICAgICA4OCA4ODhiICAgICAgODggICAsYWQ4ODg4YmEsIDg4ODg4ODg4ODg4OCA4OCAgICxhZDg4ODhiYSwgICA4ODhiICAgICAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4ODg4YiAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgODg4OGIgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICA4OCAgICAgICAgODggODggYDhiICAgIDg4IGQ4JyAgICAgICAgICAgICAgIDg4ICAgICAgODggZDgnICAgICAgICBgOGIgODggYDhiICAgIDg4ICBcblx0Ly8gXHQ4OGFhYWFhICAgICA4OCAgICAgICAgODggODggIGA4YiAgIDg4IDg4ICAgICAgICAgICAgICAgIDg4ICAgICAgODggODggICAgICAgICAgODggODggIGA4YiAgIDg4ICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICA4OCA4OCAgIGA4YiAgODggODggICAgICAgICAgICAgICAgODggICAgICA4OCA4OCAgICAgICAgICA4OCA4OCAgIGA4YiAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4OCAgICBgOGIgODggWTgsICAgICAgICAgICAgICAgODggICAgICA4OCBZOCwgICAgICAgICw4UCA4OCAgICBgOGIgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIFk4YS4gICAgLmE4UCA4OCAgICAgYDg4ODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgWThhLiAgICAuYThQICA4OCAgICAgYDg4ODggIFxuXHQvLyBcdDg4ICAgICAgICAgICBgXCJZODg4OFlcIicgIDg4ICAgICAgYDg4OCAgIGBcIlk4ODg4WVwiJyAgICAgIDg4ICAgICAgODggICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4ODggIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdCRzY29wZS5hZGRCaXQgPSBmdW5jdGlvbihpbmRleCwgY29udGVudCl7XG5cblx0XHRjb25zb2xlLmxvZyhpbmRleClcblxuXHRcdHZhciBpbmNvbWluZ0NvbnRlbnQ7XG5cblx0XHRpZiAodHlwZW9mKGNvbnRlbnQpID09PSAndW5kZWZpbmVkJylcblx0XHRcdGluY29taW5nQ29udGVudCA9ICcnO1xuXHRcdGVsc2Vcblx0XHRcdGluY29taW5nQ29udGVudCA9IGNvbnRlbnQ7XG5cblx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXggKyAxLCAwLCBuZXdCaXQoKSk7XG5cblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXggKyAxXS50YWJDb3VudCA9ICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50O1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleCArIDFdLmNvbnRlbnQgPSBpbmNvbWluZ0NvbnRlbnQ7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4ICsgMV0uY29udGVudENhcmV0ID0gaW5jb21pbmdDb250ZW50O1xuXG5cdFx0XHQkc2NvcGUucGFyc2VMaW5rKGluZGV4KTtcblxuXHRcdFx0X2ZvY3VzTWUoaW5kZXggKyAxKTtcblx0XHR9LCA1MCk7XG5cblx0fTtcblxuXHQkc2NvcGUucGFyc2VQYXN0ZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdC8vIHNwbGl0IGF0IGxpbmUgYnJlYWtzXG5cdFx0XHR2YXIgdGhlQ29udGVudCA9ICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuXG5cdFx0XHQvLyByZW1vdmUgZW1wdHkgbGluZXNcblx0XHRcdGZvciAodmFyIGwgPSAwOyBsIDwgdGhlQ29udGVudC5sZW5ndGg7IGwrKyl7XG5cdFx0XHRcdGlmICh0aGVDb250ZW50W2xdID09PSAnJykgdGhlQ29udGVudC5zcGxpY2UobCwgMSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNldCBibG9jayB0byBlbXB0eSBiZWZvcmUgcmVwbGFjaW5nIHcvIDFzdCBsaW5lXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gdGhlQ29udGVudFswXTtcblxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSB0aGVDb250ZW50WzBdO1xuXG5cdFx0XHQkc2NvcGUucGFyc2VMaW5rKGluZGV4KTtcblxuXHRcdFx0Zm9yICh2YXIgbCA9IDE7IGwgPCB0aGVDb250ZW50Lmxlbmd0aDsgbCsrKXtcblx0XHRcdFx0JHNjb3BlLmFkZEJpdChpbmRleCArIChsIC0gMSksIHRoZUNvbnRlbnRbbF0pO1xuXHRcdFx0fVxuXHRcdH0sIDUwKTsgXG5cdH1cblxuXHQkc2NvcGUucGFyc2VMaW5rID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHZhciBjb250ZW50ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudDtcblxuXHRcdGlmIChcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHA6Ly9cIikgPT09IDAgfHxcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHBzOi8vXCIpID09PSAwIFxuXHRcdCl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZygnT0ggTk9FUyBBIExJTksnKVxuXG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0XHRkYXRhVHlwZTonSlNPTlAnLFxuXHRcdFx0XHRkYXRhOntcblx0XHRcdFx0XHRVUkw6IGNvbnRlbnRcblx0XHRcdFx0fSxcblx0XHRcdFx0dXJsOiBcImh0dHA6Ly9yZS5qZWN0LmNoL3RyYS9waHAvdGl0bGUucGhwXCJcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKHRoZVRpdGxlKXtcblx0XHRcdFx0dmFyIGVzY2FwZWRUaXRsZSA9IF8udW5lc2NhcGUodGhlVGl0bGUudGl0bGUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlc2NhcGVkVGl0bGUpXG5cblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudCA9IGVzY2FwZWRUaXRsZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gZXNjYXBlZFRpdGxlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5hZGRyZXNzID0gY29udGVudDtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uaXNMaW5rID0gdHJ1ZTtcblxuXHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5vcGVuTGluayA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRjb25zb2xlLmxvZygneWVhaCEnKVxuXHR9XG5cblx0JHNjb3BlLmtpbGxCaXQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdF9mb2N1c01lKGluZGV4IC0gMSlcblx0fTtcblxuXHQkc2NvcGUubW92ZVVwID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoX2JpdEluZGV4KCksIDEpWzBdO1xuXHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4IC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0X2ZvY3VzTWUoaW5kZXggLSAxKVxuXHR9O1xuXG5cdCRzY29wZS5tb3ZlRG93biA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKF9iaXRJbmRleCgpLCAxKVswXTtcblx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCArIDEsIDAsIHRoaXNCaXQpO1xuXHRcdF9mb2N1c01lKGluZGV4ICsgMSlcblx0fTtcblxuXHQkc2NvcGUuY2FyZXRUcmFja2VyID0gZnVuY3Rpb24oaW5kZXgsIGtleSl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHRoZUJpdCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdGN1cnJlbnRDYXJldCA9IHRoZUJpdC5zZWxlY3Rpb25TdGFydCxcblx0XHRcdFx0dGhlVmFsdWUgPSB0aGVCaXQudmFsdWU7XG5cblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IFxuXHRcdFx0XHR0aGVWYWx1ZS5zdWJzdHJpbmcoMCwgY3VycmVudENhcmV0KSArIFxuXHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJoaWRkZW5DYXJldFwiPjwvc3Bhbj4nICsgXG5cdFx0XHRcdHRoZVZhbHVlLnN1YnN0cmluZyhjdXJyZW50Q2FyZXQsIHRoZVZhbHVlLmxlbmd0aClcblxuXHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdH0sIDEwKVxuXHR9XG5cblxuXHQkc2NvcGUuanVtcEFyb3VuZCA9IGZ1bmN0aW9uKGluZGV4LCBrZXkpe1xuXHRcdHZhciAkdGhlQml0ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSxcblx0XHRcdCR0aGVDYXJldCA9ICR0aGVCaXQubmV4dCgpLmZpbmQoJy5oaWRkZW5DYXJldCcpLFxuXHRcdFx0dGhlQ2FyZXRQb3MgPSAkdGhlQ2FyZXQucG9zaXRpb24oKS50b3A7XG5cblx0XHRpZiAoIFxuXHRcdFx0KGtleSA9PT0gJ1VwJykgJiYgXG5cdFx0XHQodGhlQ2FyZXRQb3MgPiAwKSBcblx0XHQpe1xuXHRcdFx0JHRoZUJpdC5wYXJlbnRzKCcubm90ZV9iaXQnKVxuXHRcdFx0XHQucHJldignLm5vdGVfYml0JykuZmluZCgndGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKVxuXHRcdH1cblxuXHRcdGlmICggXG5cdFx0XHQoa2V5ID09PSAnRG93bicpICYmIFxuXHRcdFx0KHRoZUNhcmV0UG9zIDwgKCR0aGVDYXJldC5wYXJlbnQoKS5oZWlnaHQoKSAtIDE4KSkgXG5cdFx0KXtcblx0XHRcdCR0aGVCaXQucGFyZW50cygnLm5vdGVfYml0Jylcblx0XHRcdFx0Lm5leHQoJy5ub3RlX2JpdCcpLmZpbmQoJ3RleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKClcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLm1hcmsgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0ubWFyayA9ICEkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5tYXJrO1xuXHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1hcmtlZCA9IG5ldyBEYXRlO1xuXHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHR9O1xuXG5cdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbihjb250ZW50KXtcblx0XHR2YXIgd2luID0gd2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9JyArIGNvbnRlbnQsICdfYmxhbmsnKTtcblx0ICAgIHdpbi5mb2N1cygpO1xuXHR9O1xuXG5cdCRzY29wZS5iaXRCbHVyID0gZnVuY3Rpb24oJGluZGV4KXtcblx0XHRjb25zb2xlLmxvZygnQkxVUkQnKVxuXHR9XG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4OGIgICAgICAgICAgIGQ4OCA4ODg4ODg4ODg4OCA4ODhiICAgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4ODhiICAgICAgICAgZDg4OCA4OCAgICAgICAgICA4ODg4YiAgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OGA4YiAgICAgICBkOCc4OCA4OCAgICAgICAgICA4OCBgOGIgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCBgOGIgICAgIGQ4JyA4OCA4OGFhYWFhICAgICA4OCAgYDhiICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgYDhiICAgZDgnICA4OCA4OFwiXCJcIlwiXCIgICAgIDg4ICAgYDhiICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICAgYDhiIGQ4JyAgIDg4IDg4ICAgICAgICAgIDg4ICAgIGA4YiA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICAgIGA4ODgnICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICBgODg4OCBZOGEuICAgIC5hOFAgIFxuXHQvLyBcdDg4ICAgICBgOCcgICAgIDg4IDg4ODg4ODg4ODg4IDg4ICAgICAgYDg4OCAgYFwiWTg4ODhZXCInICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ICAgXG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBuZXdJRCA9IG5ld05vdGUoJHNjb3BlLm5vdGUucGFyZW50KTtcblx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld0lEKTtcblx0fTtcblxuXHQkc2NvcGUua2lsbE5vdGUgPSBmdW5jdGlvbigpe1xuXG5cdH07XG5cblx0JHNjb3BlLnNob3dVbmRvTGlzdCA9IGZ1bmN0aW9uKCl7XG5cblx0fTtcblxuXHQkc2NvcGUubWFya05vdGUgPSBmdW5jdGlvbigpe1xuXG5cdH07XG5cblx0JHNjb3BlLmFkZFRvVGFibGUgPSBmdW5jdGlvbigpe1xuXG5cdH07XG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4ODg4ODg4ODg4OCA4OCAgICAgICAgICA4ODg4ODg4OGJhICA4ODg4ODg4ODg4OCA4ODg4ODg4OGJhICAgYWQ4ODg4OGJhICAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgXCI4YiA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgZDhcIiAgICAgXCI4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgLDhQIDg4ICAgICAgICAgIDg4ICAgICAgLDhQIFk4LCAgICAgICAgICBcblx0Ly8gXHQ4OGFhYWFhYWFhODggODhhYWFhYSAgICAgODggICAgICAgICAgODhhYWFhYWE4UCcgODhhYWFhYSAgICAgODhhYWFhYWE4UCcgYFk4YWFhYWEsICAgIFxuXHQvLyBcdDg4XCJcIlwiXCJcIlwiXCJcIjg4IDg4XCJcIlwiXCJcIiAgICAgODggICAgICAgICAgODhcIlwiXCJcIlwiXCInICAgODhcIlwiXCJcIlwiICAgICA4OFwiXCJcIlwiODgnICAgICBgXCJcIlwiXCJcIjhiLCAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgIGA4YiAgICAgICAgICAgYDhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgIGA4YiAgWThhICAgICBhOFAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4OCAgICAgICAgICA4ODg4ODg4ODg4OCA4OCAgICAgIGA4YiAgXCJZODg4ODhQXCIgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0dmFyIF9pc1RleHRhcmVhID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50eXBlID09PSAndGV4dGFyZWEnO1xuXHR9LFxuXG5cdF9iaXRJbmRleCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkucGFyZW50cygnLm5vdGVfYml0JykuaW5kZXgoKTtcblx0fSxcblxuXHRfZm9jdXNNZSA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkKCcubm90ZV9ib2R5Jylcblx0XHRcdFx0LmZpbmQoJy5ub3RlX2JpdDplcSgnICsgKGluZGV4KSArICcpIHRleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0JHNjb3BlLnNvcnRhYmxlT3B0aW9uc19ub3RlID0ge1xuXHRcdGhhbmRsZTogJz4gLmJpdF9hbmNob3InXG5cdH1cbn0iLCIkKGZ1bmN0aW9uKCkge1xuXG5cdC8vIEZFQVRVUkUgVEVTVFNcblxuXHR2YXIgX3Byb3BlcnR5Q2FjaGUgPSB7fTtcdFxuXG5cdGV4cG9ydHMuc3VwcG9ydHNTdmcgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIV9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnKXtcblx0XHRcdHZhciByZXN1bHQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZVwiLCBcIjEuMVwiKTtcblx0XHRcdF9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnID0gcmVzdWx0O1xuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5zdXBwb3J0c1N2Zztcblx0fTsgXG5cblx0ZXhwb3J0cy5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgPSBmdW5jdGlvbigpe1xuXHRcdGlmICghX3Byb3BlcnR5Q2FjaGUubWVkaWFRdWVyaWVzU3VwcG9ydGVkKXtcblxuXHRcdFx0dmFyIGdldFRlc3RlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVkaWF0ZXN0XCIpLFxuXHRcdFx0XHRib29sO1xuXG5cdFx0XHRpZiAoIWdldFRlc3Rlcil7XG5cdFx0XHRcdHZhciBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGQuaWQgPSBcIm1lZGlhdGVzdFwiO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO1xuXHRcdFx0XHRib29sID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHZhciBkID0gZ2V0VGVzdGVyO1xuXG5cdFx0XHRpZiAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGQpLnBvc2l0aW9uID09IFwiYWJzb2x1dGVcIiApXG5cdFx0XHRcdGJvb2wgPSB0cnVlO1xuXG5cdFx0XHRfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgPSBib29sO1xuXG5cdFx0XHRyZXR1cm4gYm9vbDtcblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gX3Byb3BlcnR5Q2FjaGUubWVkaWFRdWVyaWVzU3VwcG9ydGVkO1xuXHR9OyBcblxuXHRleHBvcnRzLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCFfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQpe1xuXHRcdFx0dmFyIHJlc3VsdCA9ICgnYmFja2dyb3VuZFNpemUnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSk7XG5cdFx0XHRfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQgPSByZXN1bHQ7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQ7XG5cdH07XG5cdFxuXG5cdC8vIFVUSUxJVElFU1xuXG5cdGV4cG9ydHMubWFwX3JhbmdlID0gZnVuY3Rpb24odmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xuXHQgICAgcmV0dXJuIChsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpKS50b0ZpeGVkKDIpO1xuXHR9XG5cblx0ZXhwb3J0cy5yYW5kb21JbnQgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuXHQgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG5cdH1cblxuXHRleHBvcnRzLnNjcm9sbFRvSGVyZSA9IGZ1bmN0aW9uKHdoZXJlLCBleHRyYSl7XG5cdFx0aWYgKCFleHRyYSkgZXh0cmEgPSAwO1xuXHRcdFxuXHRcdHZhciB0YXJnZXQgPSAkKHdoZXJlKS5vZmZzZXQoKS50b3A7XG5cblx0XHQvLyBkZWZpbmUgaG93IGxhcmdlIHlvdXIgc3RpY2t5IGhlYWRlciBpcyBoZXJlIVxuXHRcdGlmICh3aW5kb3cubWVkaWFRdWVyeS5nZXRRdWVyeSgpID09PSAnbW9iaWxlJykgdGFyZ2V0IC09IDU1O1xuXG5cdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRzY3JvbGxUb3A6IHRhcmdldCArIGV4dHJhXG5cdFx0fSwgNTAwKTtcblx0fTsgXG5cblx0ZXhwb3J0cy5wYWdlU2V0dXAgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN1YnNjcmliZXJzID0gW10sXG5cdFx0XHRpc1NldFVwID0gZmFsc2U7XG5cblx0XHRmdW5jdGlvbiBva2F5Z28oKXtcblx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRzdWJzY3JpYmVyc1ttZXRob2RdKCk7XG5cdFx0XHR9XG5cdFx0XHRpc1NldFVwID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cblx0XHRcdGlzU2V0VXAgJiYgb2theWdvKCk7XG5cdFx0fVxuXG5cdFx0Ly8gUmV0dXJuYWwgIFxuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0b2theWdvOiBva2F5Z28sXG5cdFx0XHRzdWJzY3JpYmU6IHN1YnNjcmliZVxuXHRcdH07XG5cdH0pKCk7IFxuXG5cdGV4cG9ydHMuZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcblx0XHR2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBsYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aW1lc3RhbXA7XG5cblx0XHRcdGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID4gMCkge1xuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdFx0XHRpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHR0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdFx0aWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0XHRpZiAoY2FsbE5vdykge1xuXHRcdFx0XHRyZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0XHRjb250ZXh0ID0gYXJncyA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0fTsgXG5cblx0ZXhwb3J0cy5tZWRpYVF1ZXJ5ID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdWJzY3JpYmVycyA9IFtdLFxuXHRcdFx0bWVkaWFDdXJyZW50LFxuXHRcdFx0bWVkaWFQcmV2LFxuXHRcdFx0JHdpbmRvdyA9ICQod2luZG93KSxcblx0XHRcdCRodG1sID0gJCgnaHRtbCcpO1xuXG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlKCl7XG5cdFx0XHR2YXIgaW5uZXJXaWR0aCA9ICR3aW5kb3cuaW5uZXJXaWR0aCgpLFxuXHRcdFx0XHRpbm5lckhlaWdodCA9ICR3aW5kb3cuaW5uZXJIZWlnaHQoKTtcblxuXHRcdFx0aWYgKCBpbm5lcldpZHRoIDwgNzY4ICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdtb2JpbGUnXG5cdFx0XHRlbHNlIGlmICggKCBpbm5lcldpZHRoID49IDc2OCkgJiYgKCBpbm5lcldpZHRoIDwgOTkyICkgKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ3RhYmxldCdcblx0XHRcdGVsc2UgaWYgKCAoIGlubmVyV2lkdGggPj0gOTkyICkgJiYgKCBpbm5lcldpZHRoIDwgMTIwMCApICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdkZXNrdG9wJ1xuXHRcdFx0ZWxzZSBpZiAoIGlubmVyV2lkdGggPj0gMTIwMCApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAnbGFyZ2VfZGVza3RvcCdcblxuXHRcdFx0aWYgKCBpbm5lckhlaWdodCA8IDc0MCApXG5cdFx0XHRcdG1lZGlhQ3VycmVudCArPSAnIHNob3J0J1xuXG5cdFx0XHRpZiAoIG1lZGlhQ3VycmVudCAhPT0gbWVkaWFQcmV2ICl7XG5cdFx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRcdHN1YnNjcmliZXJzW21ldGhvZF0obWVkaWFDdXJyZW50KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghZXhwb3J0cy5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQoKSlcblx0XHRcdFx0XHQkaHRtbC5yZW1vdmVDbGFzcyhtZWRpYVByZXYpLmFkZENsYXNzKG1lZGlhQ3VycmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdG1lZGlhUHJldiA9IG1lZGlhQ3VycmVudDsgXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3Vic2NyaWJlKG1ldGhvZCkge1xuXHRcdFx0c3Vic2NyaWJlcnMucHVzaChtZXRob2QpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRRdWVyeSgpe1xuXHRcdFx0cmV0dXJuIG1lZGlhQ3VycmVudDtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gaXMocXVlcnkpe1xuXHRcdFx0cmV0dXJuIG1lZGlhQ3VycmVudC5pbmRleE9mKHF1ZXJ5KSA+PSAwO1xuXHRcdH07XG5cblx0XHR2YXIgY2FsY3VsYXRlRGVib3VuY2UgPSBleHBvcnRzLmRlYm91bmNlKGNhbGN1bGF0ZSwgMjAwKTsgXG5cblx0XHQkd2luZG93LnJlc2l6ZShjYWxjdWxhdGVEZWJvdW5jZSk7XG5cblx0XHQvLyBjYWxjdWxhdGUoKTtcblx0XHRcblx0XHQvLyAkd2luZG93LmxvYWQoY2FsY3VsYXRlKTtcblxuXHRcdC8vIGV4cG9ydHMucGFnZVNldHVwLnN1YnNjcmliZShjYWxjdWxhdGUpO1xuXG5cdFx0Ly8gUmV0dXJuYWxcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlLFxuXHRcdFx0Z2V0UXVlcnk6IGdldFF1ZXJ5LFxuXHRcdFx0aXM6IGlzXG5cdFx0fTtcblx0fSkoKTsgXG5cblx0ZXhwb3J0cy5nTWFwTG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVmFyaWFibGVzXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHR2YXIgc3Vic2NyaWJlcnMgPSBbXTtcblxuXHRcdC8vIExvYWQgR29vZ2xlIE1hcHNcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdGdNYXBTZXR1cCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRcdHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP3Y9My5leHAmJyArICdjYWxsYmFjaz0kJF8uZ01hcExvYWRlci5yZWFkeSc7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gcmVhZHkoKSB7XG5cdFx0XHRmb3IgKHZhciBtZXRob2QgaW4gc3Vic2NyaWJlcnMpIHtcblx0XHRcdFx0c3Vic2NyaWJlcnNbbWV0aG9kXSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cdFx0fTtcblxuXHRcdCQod2luZG93KS5sb2FkKGdNYXBTZXR1cClcblxuXHRcdC8vIFJldHVybmFsXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZWFkeTogcmVhZHksXG5cdFx0XHRzdWJzY3JpYmU6IHN1YnNjcmliZVxuXHRcdH07XG5cdH0pKCk7XG5cblx0ZXhwb3J0cy5yYW5kb21pemUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0dmFyIHV1aWQgPSAneHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuXHRcdFx0dmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcblx0XHRcdGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcblx0XHRcdHJldHVybiAoYyA9PSAneCcgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZygxNik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHV1aWQ7XG5cdH07XG5cblxufSk7Il19
