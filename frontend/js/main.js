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
















