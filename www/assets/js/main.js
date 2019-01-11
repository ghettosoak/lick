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

var config = {
  apiKey: "AIzaSyD7j2bkgZg3led-CR0rH8wXMgksY4sP2o8",
  authDomain: "lick.firebaseapp.com",
  databaseURL: "https://lick.firebaseio.com",
  projectId: "firebase-lick",
  storageBucket: "firebase-lick.appspot.com",
  messagingSenderId: "330483292917"
};

firebase.initializeApp(config);

window._Firebase = firebase.database().ref();

window.listLookingAt = 'notes';
window.directions = ['north', 'east', 'south', 'west'];
window.layers = ['land', 'sky'];
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

$(window).on('scroll', function(e){
	var $that = $(this),
		_st = $that.scrollTop();

	if (window.innerWidth < 768){
		if (_st > 10){
			$body.addClass('topNavigation')
		}else{
			$body.removeClass('topNavigation')			
		}
	}else{
		if (_st > 20){
			$body.addClass('topNavigation')
		}else{
			$body.removeClass('topNavigation')			
		}
	}
})

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
		// 'hmTouchEvents',
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

                                                                             
// 88888888ba    ,ad8888ba,   88        88 888888888888 88888888888 ad88888ba   
// 88      "8b  d8"'    `"8b  88        88      88      88         d8"     "8b  
// 88      ,8P d8'        `8b 88        88      88      88         Y8,          
// 88aaaaaa8P' 88          88 88        88      88      88aaaaa    `Y8aaaaa,    
// 88""""88'   88          88 88        88      88      88"""""      `"""""8b,  
// 88    `8b   Y8,        ,8P 88        88      88      88                 `8b  
// 88     `8b   Y8a.    .a8P  Y8a.    .a8P      88      88         Y8a     a8P  
// 88      `8b   `"Y8888Y"'    `"Y8888Y"'       88      88888888888 "Y88888P"   
                                                                             


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
	
	if ($cookies.layer){
		$rootScope.layer = $cookies.layer;
	}
	else{
		$cookies.layer = 'sky';
		$rootScope.layer = $cookies.layer;
	}
});

                                                                                                  
// 88888888888 db        ,ad8888ba, 888888888888 ,ad8888ba,   88888888ba  88 88888888888 ad88888ba   
// 88         d88b      d8"'    `"8b     88     d8"'    `"8b  88      "8b 88 88         d8"     "8b  
// 88        d8'`8b    d8'               88    d8'        `8b 88      ,8P 88 88         Y8,          
// 88aaaaa  d8'  `8b   88                88    88          88 88aaaaaa8P' 88 88aaaaa    `Y8aaaaa,    
// 88""""" d8YaaaaY8b  88                88    88          88 88""""88'   88 88"""""      `"""""8b,  
// 88     d8""""""""8b Y8,               88    Y8,        ,8P 88    `8b   88 88                 `8b  
// 88    d8'        `8b Y8a.    .a8P     88     Y8a.    .a8P  88     `8b  88 88         Y8a     a8P  
// 88   d8'          `8b `"Y8888Y"'      88      `"Y8888Y"'   88      `8b 88 88888888888 "Y88888P"   
                                                                                                  

                                           
// 88                         88              
// 88                         ""              
// 88                                         
// 88  ,adPPYba,   ,adPPYb,d8 88 8b,dPPYba,   
// 88 a8"     "8a a8"    `Y88 88 88P'   `"8a  
// 88 8b       d8 8b       88 88 88       88  
// 88 "8a,   ,a8" "8a,   ,d88 88 88       88  
// 88  `"YbbdP"'   `"YbbdP"Y8 88 88       88  
//                 aa,    ,88                 
//                  "Y8bbdP"                  

app.factory("Login", ['$rootScope', "$firebaseAuth", "$cookies", '$timeout', 'Auth', '$location', 'Notes',
	function($rootScope, $firebaseAuth, $cookies, $timeout, Auth, $location, Notes) {
		return function(theEmail, thePass, callback, errorCallback){

			console.log(window.loggingIn, theEmail, thePass/*, callback, errorCallback*/)

			if (!window.loggingIn){
				window.loggingIn = true;

				Auth.$signInWithEmailAndPassword(
					theEmail,
					thePass
				).then(function(authData) {

					console.log('logged in with ' + theEmail + ', ' + authData.user.uid)
					window.loggingIn = false;

					window.localStorage.email = $cookies.email = theEmail;
					window.localStorage.email_escaped = $cookies.email_escaped = window.emailEscaper(theEmail);
					window.localStorage.pass = $cookies.pass = thePass;

					window.localStorage.uid = window.uid = authData.user.uid;

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
					alert('Oh no! Your login didn\'t work. Try again!');
				});
			}			
		}
	}
]);

                                                            
// 88                                                          
// 88                                                   ,d     
// 88                                                   88     
// 88  ,adPPYba,   ,adPPYb,d8  ,adPPYba,  88       88 MM88MMM  
// 88 a8"     "8a a8"    `Y88 a8"     "8a 88       88   88     
// 88 8b       d8 8b       88 8b       d8 88       88   88     
// 88 "8a,   ,a8" "8a,   ,d88 "8a,   ,a8" "8a,   ,a88   88,    
// 88  `"YbbdP"'   `"YbbdP"Y8  `"YbbdP"'   `"YbbdP'Y8   "Y888  
//                 aa,    ,88                                  
//                  "Y8bbdP"                                   

app.factory("Logout", ["$firebaseAuth", "$cookies", 'Auth', '$location', '$timeout', 
	function($firebaseAuth, $cookies, Auth, $location, $timeout) {
		return function(){

			window.loggedIn = false;

			$timeout(function () {
				$cookies.email = '';
				$cookies.email_escaped = '';
				$cookies.pass = '';
				window.localStorage.email = '';
				window.localStorage.email_escaped = '';
				window.localStorage.pass = '';
				window.localStorage.uid = '';
				window.uid = '';

				// Auth.$unauth();
				Auth.$signOut().then(function() {
				  // Sign-out successful.
				  console.log('sign out successful')
				}).catch(function(error) {
					console.log('logout failed :(')
				  // An error happened.
				});

				$location.path('/portal');
			});

		}
	}
]);

                                            
//                                88           
//                          ,d    88           
//                          88    88           
// ,adPPYYba, 88       88 MM88MMM 88,dPPYba,   
// ""     `Y8 88       88   88    88P'    "8a  
// ,adPPPPP88 88       88   88    88       88  
// 88,    ,88 "8a,   ,a88   88,   88       88  
// `"8bbdP"Y8  `"YbbdP'Y8   "Y888 88       88  
                                            
                                            

app.factory('Auth', ["$firebaseAuth",
	function($firebaseAuth) {
		var $firebaseAuth = $firebaseAuth();
		return $firebaseAuth;
	}
]);

                                                    
                                                    
//                          ,d                         
//                          88                         
// 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba, ,adPPYba,  
// 88P'   `"8a a8"     "8a  88   a8P_____88 I8[    ""  
// 88       88 8b       d8  88   8PP"""""""  `"Y8ba,   
// 88       88 "8a,   ,a8"  88,  "8b,   ,aa aa    ]8I  
// 88       88  `"YbbdP"'   "Y888 `"Ybbd8"' `"YbbdP"'  
                                                    
                                                    

app.factory('Notes', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child(window.uid + '/notes');
			return $firebaseObject(ref);
		};
	}
]);

                                                                                                                       
//           88                                                    88                                                     
//           88                                                    88                          ,d                         
//           88                                                    88                          88                         
// ,adPPYba, 88,dPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYba,  ,adPPYb,88 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba, ,adPPYba,  
// I8[    "" 88P'    "8a ""     `Y8 88P'   "Y8 a8P_____88 a8"    `Y88 88P'   `"8a a8"     "8a  88   a8P_____88 I8[    ""  
//  `"Y8ba,  88       88 ,adPPPPP88 88         8PP""""""" 8b       88 88       88 8b       d8  88   8PP"""""""  `"Y8ba,   
// aa    ]8I 88       88 88,    ,88 88         "8b,   ,aa "8a,   ,d88 88       88 "8a,   ,a8"  88,  "8b,   ,aa aa    ]8I  
// `"YbbdP"' 88       88 `"8bbdP"Y8 88          `"Ybbd8"'  `"8bbdP"Y8 88       88  `"YbbdP"'   "Y888 `"Ybbd8"' `"YbbdP"'  
                                                                                                                       
                                                                                                                       

app.factory('SharedNotes', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('_shared');
			return $firebaseObject(ref);
		};
	}
]);

                                                                     
// 88                                                     88            
// 88                                                     88            
// 88                                                     88            
// 88,dPPYba,   ,adPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYb,88 ,adPPYba,  
// 88P'    "8a a8"     "8a ""     `Y8 88P'   "Y8 a8"    `Y88 I8[    ""  
// 88       d8 8b       d8 ,adPPPPP88 88         8b       88  `"Y8ba,   
// 88b,   ,a8" "8a,   ,a8" 88,    ,88 88         "8a,   ,d88 aa    ]8I  
// 8Y"Ybbd8"'   `"YbbdP"'  `"8bbdP"Y8 88          `"8bbdP"Y8 `"YbbdP"'  
                                                                     
                                                                     

app.factory('Boards', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) { 
			console.log()
			var ref = window._Firebase.child(window.uid + '/boards');
			return $firebaseObject(ref);
		};
	}
]);

                                          
                                          
//                          ,d               
//                          88               
// 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba,  
// 88P'   `"8a a8"     "8a  88   a8P_____88  
// 88       88 8b       d8  88   8PP"""""""  
// 88       88 "8a,   ,a8"  88,  "8b,   ,aa  
// 88       88  `"YbbdP"'   "Y888 `"Ybbd8"'  
                                          
                                          

app.factory('Note', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child(window.uid + '/notes/' + id);
			return $firebaseObject(ref);
		};
	}
]);

                                                                                                             
//           88                                                    88                                           
//           88                                                    88                          ,d               
//           88                                                    88                          88               
// ,adPPYba, 88,dPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYba,  ,adPPYb,88 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba,  
// I8[    "" 88P'    "8a ""     `Y8 88P'   "Y8 a8P_____88 a8"    `Y88 88P'   `"8a a8"     "8a  88   a8P_____88  
//  `"Y8ba,  88       88 ,adPPPPP88 88         8PP""""""" 8b       88 88       88 8b       d8  88   8PP"""""""  
// aa    ]8I 88       88 88,    ,88 88         "8b,   ,aa "8a,   ,d88 88       88 "8a,   ,a8"  88,  "8b,   ,aa  
// `"YbbdP"' 88       88 `"8bbdP"Y8 88          `"Ybbd8"'  `"8bbdP"Y8 88       88  `"YbbdP"'   "Y888 `"Ybbd8"'  
                                                                                                             
                                                                                                             

app.factory('sharedNote', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child('_shared/' + id);
			return $firebaseObject(ref);
		};
	}
]);

                                                           
// 88                                                     88  
// 88                                                     88  
// 88                                                     88  
// 88,dPPYba,   ,adPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYb,88  
// 88P'    "8a a8"     "8a ""     `Y8 88P'   "Y8 a8"    `Y88  
// 88       d8 8b       d8 ,adPPPPP88 88         8b       88  
// 88b,   ,a8" "8a,   ,a8" 88,    ,88 88         "8a,   ,d88  
// 8Y"Ybbd8"'   `"YbbdP"'  `"8bbdP"Y8 88          `"8bbdP"Y8  
                                                           
                                                           

app.factory('Board', ['$firebaseObject',
	function($firebaseObject) {
		return function(id) {
			var ref = window._Firebase.child(window.uid + '/boards/' + id);
			return $firebaseObject(ref);
		};
	}
]);

                                                  
                                                  
//                                 ,d                
//                                 88                
// 88,dPYba,,adPYba,   ,adPPYba, MM88MMM ,adPPYYba,  
// 88P'   "88"    "8a a8P_____88   88    ""     `Y8  
// 88      88      88 8PP"""""""   88    ,adPPPPP88  
// 88      88      88 "8b,   ,aa   88,   88,    ,88  
// 88      88      88  `"Ybbd8"'   "Y888 `"8bbdP"Y8  
                                                  
                                                  

app.factory('Meta', ['$firebaseObject',
	function($firebaseObject) {
		return function() {
			var ref = window._Firebase.child(window.uid + '/meta');
			return $firebaseObject(ref);
		};
	}
]);

                                                                    
// 88          88                                                      
// 88          ""             ,d                                       
// 88                         88                                       
// 88,dPPYba,  88 ,adPPYba, MM88MMM ,adPPYba,  8b,dPPYba, 8b       d8  
// 88P'    "8a 88 I8[    ""   88   a8"     "8a 88P'   "Y8 `8b     d8'  
// 88       88 88  `"Y8ba,    88   8b       d8 88          `8b   d8'   
// 88       88 88 aa    ]8I   88,  "8a,   ,a8" 88           `8b,d8'    
// 88       88 88 `"YbbdP"'   "Y888 `"YbbdP"'  88             Y88'     
//                                                            d8'      
//                                                           d8'       

app.factory('History', ['$firebaseObject',
	function($firebaseObject) {
		return function() {
			var ref = window._Firebase.child(window.uid + '/meta/history');
			return $firebaseObject(ref);
		};
	}
]);

                                                                                                                          
// 88          88                                                                                                            
// 88          ""             ,d                                                                                      ,d     
// 88                         88                                                                                      88     
// 88,dPPYba,  88 ,adPPYba, MM88MMM ,adPPYba,  8b,dPPYba, 8b       d8  ,adPPYba,  ,adPPYba,  88       88 8b,dPPYba, MM88MMM  
// 88P'    "8a 88 I8[    ""   88   a8"     "8a 88P'   "Y8 `8b     d8' a8"     "" a8"     "8a 88       88 88P'   `"8a  88     
// 88       88 88  `"Y8ba,    88   8b       d8 88          `8b   d8'  8b         8b       d8 88       88 88       88  88     
// 88       88 88 aa    ]8I   88,  "8a,   ,a8" 88           `8b,d8'   "8a,   ,aa "8a,   ,a8" "8a,   ,a88 88       88  88,    
// 88       88 88 `"YbbdP"'   "Y888 `"YbbdP"'  88             Y88'     `"Ybbd8"'  `"YbbdP"'   `"YbbdP'Y8 88       88  "Y888  
//                                                            d8'                                                            
//                                                           d8'                                                             

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

                                                                                    
// 88          88                                         88                       88  
// 88          ""             ,d                          ""                       88  
// 88                         88                                                   88  
// 88,dPPYba,  88 ,adPPYba, MM88MMM ,adPPYba,  8b,dPPYba, 88  ,adPPYba, ,adPPYYba, 88  
// 88P'    "8a 88 I8[    ""   88   a8"     "8a 88P'   "Y8 88 a8"     "" ""     `Y8 88  
// 88       88 88  `"Y8ba,    88   8b       d8 88         88 8b         ,adPPPPP88 88  
// 88       88 88 aa    ]8I   88,  "8a,   ,a8" 88         88 "8a,   ,aa 88,    ,88 88  
// 88       88 88 `"YbbdP"'   "Y888 `"YbbdP"'  88         88  `"Ybbd8"' `"8bbdP"Y8 88  

window.debounceHistorical = _.debounce(function(){

	historical_construct(
		now, 
		incomingNote, 
		shareActive, 
		callback,
		Note,
		Meta,
		$cookies
	)

}, 5000)

// window.debounceHistorical();

var historical_engage = function(
		now, 
		incomingNote, 
		shareActive, 
		callback,
		Note,
		Meta,
		$cookies
	){
	
}

app.service('historical', ['Note', 'Meta', '$cookies',
	function(Note, Meta, $cookies) {
		return function(
			now, 
			incomingNote, 
			shareActive, 
			callback
		) {

			console.log(arguments)

			var historicalMarker = {
				title: incomingNote.title,		
				device: window.device,
				time: now,
				seen: false,
				shared: shareActive,
				editor: $cookies.email_escaped,
				uid: window.uid
			}

			if (shareActive){
				angular.forEach(incomingNote.participants, function(v, k){
					var ref = window._Firebase.child(v.uid + '/meta/history/' + incomingNote.id);
					ref.set(historicalMarker)
				});
			}else{
				var ref = window._Firebase.child(window.uid + '/meta/history/' + incomingNote.id);
				ref.set(historicalMarker)
			}

			if (incomingNote.parent){
				var ref = window._Firebase.child(window.uid + '/boards/' + incomingNote.parent + '/lastEdited');
				ref.set(now)
			}else if (incomingNote.participants && incomingNote.participants[window.localStorage.email_escaped].parent){
				var ref = window._Firebase.child('_shared/' + incomingNote.id + '/participants/' + window.localStorage.email_escaped + '/lastEdited');
				ref.set(now)
			}

			callback();

			console.log('HISTORICAL')

			

		};
	}
]);

                                                                  
//                                           88          88          
//                                           88          ""   ,d     
//                                           88               88     
// 8b,dPPYba,   ,adPPYba, 8b      db      d8 88,dPPYba,  88 MM88MMM  
// 88P'   `"8a a8P_____88 `8b    d88b    d8' 88P'    "8a 88   88     
// 88       88 8PP"""""""  `8b  d8'`8b  d8'  88       d8 88   88     
// 88       88 "8b,   ,aa   `8bd8'  `8bd8'   88b,   ,a8" 88   88,    
// 88       88  `"Ybbd8"'     YP      YP     8Y"Ybbd8"'  88   "Y888  
                                                                  
                                                                  

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

                                                                                  
//    ad88 88                                                                        
//   d8"   ""                        ,d                             ,d               
//   88                              88                             88               
// MM88MMM 88 8b,dPPYba, ,adPPYba, MM88MMM 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba,  
//   88    88 88P'   "Y8 I8[    ""   88    88P'   `"8a a8"     "8a  88   a8P_____88  
//   88    88 88          `"Y8ba,    88    88       88 8b       d8  88   8PP"""""""  
//   88    88 88         aa    ]8I   88,   88       88 "8a,   ,a8"  88,  "8b,   ,aa  
//   88    88 88         `"YbbdP"'   "Y888 88       88  `"YbbdP"'   "Y888 `"Ybbd8"'  
                                                                                  
                                                                                  

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

                                                                                    
                                                                                    
//                                                                    ,d               
//                                                                    88               
// 8b,dPPYba,   ,adPPYba, 8b      db      d8 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba,  
// 88P'   `"8a a8P_____88 `8b    d88b    d8' 88P'   `"8a a8"     "8a  88   a8P_____88  
// 88       88 8PP"""""""  `8b  d8'`8b  d8'  88       88 8b       d8  88   8PP"""""""  
// 88       88 "8b,   ,aa   `8bd8'  `8bd8'   88       88 "8a,   ,a8"  88,  "8b,   ,aa  
// 88       88  `"Ybbd8"'     YP      YP     88       88  `"YbbdP"'   "Y888 `"Ybbd8"'  
                                                                                    
                                                                                    

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

                                                                                                 
//           88                                                                                     
//           88                                                                    ,d               
//           88                                                                    88               
// ,adPPYba, 88,dPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYba, 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba,  
// I8[    "" 88P'    "8a ""     `Y8 88P'   "Y8 a8P_____88 88P'   `"8a a8"     "8a  88   a8P_____88  
//  `"Y8ba,  88       88 ,adPPPPP88 88         8PP""""""" 88       88 8b       d8  88   8PP"""""""  
// aa    ]8I 88       88 88,    ,88 88         "8b,   ,aa 88       88 "8a,   ,a8"  88,  "8b,   ,aa  
// `"YbbdP"' 88       88 `"8bbdP"Y8 88          `"Ybbd8"' 88       88  `"YbbdP"'   "Y888 `"Ybbd8"'  
                                                                                                 
                                                                                                 

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

                                                                                                                                                                   
//                     88          88                              88                                                    88                                           
//                     88          88   ,d                         88                                                    88                          ,d               
//                     88          88   88                         88                                                    88                          88               
// ,adPPYYba,  ,adPPYb,88  ,adPPYb,88 MM88MMM ,adPPYba,  ,adPPYba, 88,dPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYba,  ,adPPYb,88 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba,  
// ""     `Y8 a8"    `Y88 a8"    `Y88   88   a8"     "8a I8[    "" 88P'    "8a ""     `Y8 88P'   "Y8 a8P_____88 a8"    `Y88 88P'   `"8a a8"     "8a  88   a8P_____88  
// ,adPPPPP88 8b       88 8b       88   88   8b       d8  `"Y8ba,  88       88 ,adPPPPP88 88         8PP""""""" 8b       88 88       88 8b       d8  88   8PP"""""""  
// 88,    ,88 "8a,   ,d88 "8a,   ,d88   88,  "8a,   ,a8" aa    ]8I 88       88 88,    ,88 88         "8b,   ,aa "8a,   ,d88 88       88 "8a,   ,a8"  88,  "8b,   ,aa  
// `"8bbdP"Y8  `"8bbdP"Y8  `"8bbdP"Y8   "Y888 `"YbbdP"'  `"YbbdP"' 88       88 `"8bbdP"Y8 88          `"Ybbd8"'  `"8bbdP"Y8 88       88  `"YbbdP"'   "Y888 `"Ybbd8"'  
                                                                                                                                                                   
                                                                                                                                                                   

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




                                                             
// 88        88 88 88                                           
// 88        "" 88 88                          ,d               
// 88           88 88                          88               
// 88   ,d8  88 88 88 8b,dPPYba,   ,adPPYba, MM88MMM ,adPPYba,  
// 88 ,a8"   88 88 88 88P'   `"8a a8"     "8a  88   a8P_____88  
// 8888[     88 88 88 88       88 8b       d8  88   8PP"""""""  
// 88`"Yba,  88 88 88 88       88 "8a,   ,a8"  88,  "8b,   ,aa  
// 88   `Y8a 88 88 88 88       88  `"YbbdP"'   "Y888 `"Ybbd8"'  
                                                             
                                                             

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

                                                                                                     
//                                           88                                                     88  
//                                           88                                                     88  
//                                           88                                                     88  
// 8b,dPPYba,   ,adPPYba, 8b      db      d8 88,dPPYba,   ,adPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYb,88  
// 88P'   `"8a a8P_____88 `8b    d88b    d8' 88P'    "8a a8"     "8a ""     `Y8 88P'   "Y8 a8"    `Y88  
// 88       88 8PP"""""""  `8b  d8'`8b  d8'  88       d8 8b       d8 ,adPPPPP88 88         8b       88  
// 88       88 "8b,   ,aa   `8bd8'  `8bd8'   88b,   ,a8" "8a,   ,a8" 88,    ,88 88         "8a,   ,d88  
// 88       88  `"Ybbd8"'     YP      YP     8Y"Ybbd8"'   `"YbbdP"'  `"8bbdP"Y8 88          `"8bbdP"Y8  
                                                                                                     
                                                                                                     

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

                                                                              
// 88        88 88 88 88                                                     88  
// 88        "" 88 88 88                                                     88  
// 88           88 88 88                                                     88  
// 88   ,d8  88 88 88 88,dPPYba,   ,adPPYba,  ,adPPYYba, 8b,dPPYba,  ,adPPYb,88  
// 88 ,a8"   88 88 88 88P'    "8a a8"     "8a ""     `Y8 88P'   "Y8 a8"    `Y88  
// 8888[     88 88 88 88       d8 8b       d8 ,adPPPPP88 88         8b       88  
// 88`"Yba,  88 88 88 88b,   ,a8" "8a,   ,a8" 88,    ,88 88         "8a,   ,d88  
// 88   `Y8a 88 88 88 8Y"Ybbd8"'   `"YbbdP"'  `"8bbdP"Y8 88          `"8bbdP"Y8  
                                                                              
                                                                              

app.factory('killBoard', ['Board', '$location',
	function(Board, $location) {
		return function(id, parent) {
			$location.path('/list');
			board = Board(id);
			board.$remove();
		};
	}
]);

                                                                                                                             
//                                                                                        88            88                      
//                                                                       ,d               ""            ""   ,d                 
//                                                                       88                                  88                 
//  ,adPPYba,  ,adPPYba,  8b,dPPYba,   ,adPPYba,  ,adPPYba, 8b,dPPYba, MM88MMM 8b,dPPYba, 88  ,adPPYba, 88 MM88MMM 8b       d8  
// a8"     "" a8"     "8a 88P'   `"8a a8"     "" a8P_____88 88P'   `"8a  88    88P'   "Y8 88 a8"     "" 88   88    `8b     d8'  
// 8b         8b       d8 88       88 8b         8PP""""""" 88       88  88    88         88 8b         88   88     `8b   d8'   
// "8a,   ,aa "8a,   ,a8" 88       88 "8a,   ,aa "8b,   ,aa 88       88  88,   88         88 "8a,   ,aa 88   88,     `8b,d8'    
//  `"Ybbd8"'  `"YbbdP"'  88       88  `"Ybbd8"'  `"Ybbd8"' 88       88  "Y888 88         88  `"Ybbd8"' 88   "Y888     Y88'     
//                                                                                                                     d8'      
//                                                                                                                    d8'       

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

app.factory('layering', ['$rootScope', '$cookies',
	function($rootScope, $cookies) {
		return function() {

			console.log($rootScope.layer)

			if ($cookies.layer === 'land'){
				$cookies.layer = 'sky';
				$rootScope.layer = 'sky';
			}else{
				$cookies.layer = 'land';
				$rootScope.layer = 'land';
			}
		};
	}
]);


                                                                        
// 88888888888 88 88     888888888888 88888888888 88888888ba   ad88888ba   
// 88          88 88          88      88          88      "8b d8"     "8b  
// 88          88 88          88      88          88      ,8P Y8,          
// 88aaaaa     88 88          88      88aaaaa     88aaaaaa8P' `Y8aaaaa,    
// 88"""""     88 88          88      88"""""     88""""88'     `"""""8b,  
// 88          88 88          88      88          88    `8b           `8b  
// 88          88 88          88      88          88     `8b  Y8a     a8P  
// 88          88 88888888888 88      88888888888 88      `8b  "Y88888P"   
                                                                        


app.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
	var filtered = [];
	angular.forEach(items, function(item) {
	filtered.push(item);
	});
	filtered.sort(function (a, b) {
	return (a[field] > b[field] ? 1 : -1);
	});
	if(reverse) filtered.reverse();
	return filtered;
	};
});

                                                                                                                                              
//   ,ad8888ba,   ,ad8888ba,   888b      88 888888888888 88888888ba    ,ad8888ba,   88          88          88888888888 88888888ba   ad88888ba   
//  d8"'    `"8b d8"'    `"8b  8888b     88      88      88      "8b  d8"'    `"8b  88          88          88          88      "8b d8"     "8b  
// d8'          d8'        `8b 88 `8b    88      88      88      ,8P d8'        `8b 88          88          88          88      ,8P Y8,          
// 88           88          88 88  `8b   88      88      88aaaaaa8P' 88          88 88          88          88aaaaa     88aaaaaa8P' `Y8aaaaa,    
// 88           88          88 88   `8b  88      88      88""""88'   88          88 88          88          88"""""     88""""88'     `"""""8b,  
// Y8,          Y8,        ,8P 88    `8b 88      88      88    `8b   Y8,        ,8P 88          88          88          88    `8b           `8b  
//  Y8a.    .a8P Y8a.    .a8P  88     `8888      88      88     `8b   Y8a.    .a8P  88          88          88          88     `8b  Y8a     a8P  
//   `"Y8888Y"'   `"Y8888Y"'   88      `888      88      88      `8b   `"Y8888Y"'   88888888888 88888888888 88888888888 88      `8b  "Y88888P"   
                                                                                                                                              



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
		'layering',
		'Meta',
		'historyCount',
		'historical',
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
		'History',
		'Meta',
		historyCtrl
	]
);

app.controller('boardCtrl', 
	[
		'$rootScope', 
		'$scope', 
		'Board',
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
		'layering',
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
		'layering',
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
	layering,
	historyCount
) {
	$timeout(function() {
		$scope.$digest();
	})

    $scope.pageClass = 'board';

    $scope.$on('$destroy', window.unbindAll)

    $scope.$watch('board.title', function(newValue, oldValue) {
		if (newValue){
			window.document.title = newValue + ' – (board) – LICK';
		}else{
			window.document.title = 'Untitled Board – LICK';
		}
	});

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

    $scope.lightbulb = function(){
    	layering();
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
	    columns: 5,
	    mobileModeEnabled: false,
	    minColumns: 4,
	    floating: false,
	    swapping: true,
	    pushing: false,
	    minRows: 4,
	    maxRows: 10,
	    defaultSizeX: 1,
	    defaultSizeY: window.innerWidth < 768 ? 2 : 1,
	    margins: [5, 5],
	    resizable: {
	       enabled: false,
	    },
		draggable: {
			// handle: window.innerWidth < 768 ? '.grabber' : null
			// handle: '.grabber'
		}
	};

	historyCount(function(theNumber){
		$scope.historyCounter = function(){
			return theNumber;
		}
	})

	$scope.logout = function(){
		$scope.closeMenu();
		Logout();
	}

	$scope.openMenu = function(){
		$('#main').toggleClass('menuOpen');	
	};

	$scope.closeMenu = function(){
		$('#main').removeClass('menuOpen');	
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

	window.document.title = 'Send note to board – LICK';

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

	window.document.title = 'Colophon – LICK';

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
	});

	window.document.title = 'LICK';
	
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
	History
) {

	$timeout(function() {
		$scope.$digest();
	})

    $scope.pageClass = 'history';

    // $scope.meta = Meta;

    $('#main').removeClass('menuOpen');	

    $scope.$on('$destroy', window.unbindAll);

    window.document.title = 'Recently edited notes – LICK';

	History().$bindTo($scope, 'history')
		.then(function(unbinder){
			window.unbinding.push(unbinder)

			$scope.historySorter = function(){
				var notes = [];

				angular.forEach($scope.history, function(e, k){
					if (typeof(e) === 'object' && !!e){
						e.id = k;
						notes.push(e);	
					} 
				});

				return notes;
			}
		});

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
		// $scope.meta.history = {};

		// Meta.
		History().$remove().then(() => {
			console.log('HISTORY CLEARED')
		})
	}

	$scope.goBack = function(){
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

	window.document.title = 'How to – LICK';

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
	layering,
	historyCount
) {
	$timeout(function() {
		$scope.$digest();
	})

    $scope.pageClass = 'list';

    $scope.$on('$destroy', window.unbindAll);

    window.document.title = 'Home – LICK';

    console.log('LIST')

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

    $scope.lightbulb = function(){
    	layering();
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
		$('#main').toggleClass('menuOpen');	
	};

	$scope.closeMenu = function(){
		$('#main').removeClass('menuOpen');	
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
	layering,
	Meta,
	historyCount,
	historical
) {

	console.log('NOTE')

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

    $scope.$on('$destroy', window.unbindAll);

    $scope.$watch('note.title', function(newValue, oldValue) {
		if (newValue){
			window.document.title = newValue + ' – (note) – LICK';
		}else{
			window.document.title = 'Untitled Note – LICK';
		}
	});

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

    $scope.lightbulb = function(){
    	layering();
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
						if ($scope.note.body[_bitIndex()].content !== ''){
							$scope.addBit( _bitIndex() );
						}
						else if (_bitIndex() !== 0){
							$scope.note.body[_bitIndex()].gap = true;
							$scope.note.body[_bitIndex()].tabCount = 0;
						}
					}
					else{
						_focusMe(0);
					}
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
					if ($scope.note.body[_bitIndex()].tabCount > 0){
						$scope.note.body[_bitIndex()].tabCount--;
					}
					else if ($scope.note.body[_bitIndex()].gap){
						$scope.note.body[_bitIndex()].gap = false;
					}
					else{
						$scope.killBit( _bitIndex() );
					}
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
							if (e.selected){
								$scope.tabIn(k);
							}
						})
					}else{
						$scope.tabIn(_bitIndex());						
					}
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
							if (e.selected){
								$scope.tabOut(k);
							}
						})
					}else{
						$scope.tabOut(_bitIndex());
					}
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
					console.log(event, event.keyCode)
					$scope.unselector();
					$scope.caretTracker(_bitIndex(), function(){
						$scope.jumpAround(_bitIndex(), event.keyCode, false);
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
					$scope.jumpAround(_bitIndex(), event.keyCode, true);
					event.preventDefault();
				}
			}
		})
		.add({
			combo: ['ctrl+command+up', 'ctrl+alt+up'],
			description: '(while focused) Swap bit up',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				$scope.moveUp(_bitIndex());
				event.preventDefault();
			}
		})
		.add({
			combo: ['ctrl+command+down', 'ctrl+alt+up'],
			description: '(while focused) Swap bit down',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				$scope.moveDown(_bitIndex());
				event.preventDefault();
			}
		})
		.add({
			combo: ['shift + '],
			description: 'New note',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event) {
				$location.path('/note/' + newNote());
				event.preventDefault();
			}
		})
		.add({
			combo: ['command+shift+a', 'ctrl+shift+a'],
			description: 'Select all bits',
			allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			callback: function(event, hotkey) {
				event.preventDefault();
				angular.forEach($scope.note.body, function(e, k){
					$scope.note.body[k].selected = true;
					$scope.selectedBits = true;
				})
				// if ( !_isTextSelected($(event.target)[0]) ){
				// }
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
							if (e.selected){
								$scope.mark(k);
							}
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

		console.log(index)

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
		if ($scope.note.body[index].tabCount < 4){
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

	$scope.debounceHistorical = _.debounce(function(){
		var now = Date.now();

		if (!$scope.meta.history)
			$scope.meta.history = {};

		$scope.note.lastEdited = now;

		historical(
			now, 
			$scope.note, 
			$scope.shareActive(), 
			function(){
				$timeout(function() {
					$scope.$digest();
				})
			}
		);
	}, 5000)

	$scope.historical_trigger = $scope.debounceHistorical;


	$scope.jumpAround = function(index, key, justgo){

		// console.log(index, key, justgo)
		// console.log(index, key, justgo)
		var $theBit = $(document.activeElement),
			$theCaret = $theBit.siblings('.textarea-autosize').find('.hiddenCaret'),
			theCaretPos = $theCaret.position().top,
			theCaretHeight = 23;

		// console.log(theCaretPos, theCaretHeight, theCaretPos < theCaretHeight - 1)
		console.log(
			   'CARETPOS + 4', theCaretPos + 4,
			'// CARETHEIGHT', theCaretHeight,
			'// OUTERHEIGHT', $theCaret.parent().outerHeight(true),
			'// CARETHEIGHT - OUTERHEIGHT', ($theCaret.parent().outerHeight(true) - (theCaretHeight)),
			'// CARETPOS >= CARETHEIGHT - OUTERHEIGHT', theCaretPos + 4 >= ($theCaret.parent().outerHeight(true) - (theCaretHeight))
		);

		if ( 
			(
				(key === 38) && 
				(theCaretPos < theCaretHeight - 1) 
			)||(
				(key === 38) && 
				justgo
			)
		){
			console.log('UP')
			$theBit.parents('.note_bit')
				.prev('.note_bit').find('textarea')
				.focus()
		}

		if (
			(
				(key === 40) && 
				((theCaretPos + 4) >= ($theCaret.parent().outerHeight(true) - theCaretHeight)) 
			)||(
				(key === 40) && 
				justgo
			)
		){
			console.log('DOWN')
			$theBit.parents('.note_bit')
				.next('.note_bit').find('textarea')
				.focus()
		}

		if (
			(key === 40) &&
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
		if ($scope.noEdit){
			$scope.mark(index, true);
		}else if (!_isTextSelected($(event.target)[0])){
			if (direction === 'left'){
				$scope.tabOut(index);	
			}
			else if (direction === 'right'){
				$scope.tabIn(index);
			}
		}

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
		$('#main').toggleClass('menuOpen');	
	};

	$scope.closeMenu = function(){
		$('#main').removeClass('menuOpen');	
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
		$scope.closeMenu();
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

		window.document.title = 'Welcome – LICK';

    $scope.sign_up = function(){
    	if (!$scope.signIn.$pristine)
	    	$scope.loading = true;

			$scope.auth.$createUserWithEmailAndPassword(
				$scope.signUp_input.email,
				$scope.signUp_input.password
			).then(function(userData) {

				$scope.loading = false;

				console.log('new user "' + userData.uid + '" created!');

				window.uid = userData.uid;

				$timeout(function(){
					Login($scope.signUp_input.email, $scope.signUp_input.password, function(){
						firstNote();
						$location.path('/list');
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
		    		$location.path('/list');
		    	else{
		    		$scope.viewing = 'pwchange';
		    	}
	    	},
	    	function(){
	    		$scope.loading = false;
	    		// $scope.signIn_input.email = '';
	    		$scope.signIn_input.password = '';
	    	}
    	);
    }

    $scope.newPW = function(){
    	if (!$scope.signIn.$pristine)
	    	$scope.loading = true;

			// $scope.auth.$changePassword({
			// 	email: $scope.signIn_input.email,
			// 	oldPassword: $scope.signIn_input.password,
			// 	newPassword: $scope.reset_input.password
			// })

			$scope.auth.$changePassword(
				$scope.reset_input.password
			).then(function() {
				$scope.loading = false;
				window.resettingPassword = false;
				$location.path('/list');
				alert('Your password has been reset.\n\nDon\'t worry, it happens to everyone! :)')
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
				alert('Okay!\n\nGo check your email, we just sent you a temporary password. \n\nGo get it there, login with that, and we\'ll change your password when you get back!');
				console.log('Password reset email sent successfully!');
			}).catch(function(error) {
				console.error("Error: ", error);
			});
    	}else{
    		alert('Ou nei!\n\nPut your email in, and click the \'Forgot your password?\' button again.')
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

    $scope.$on('$destroy', window.unbindAll);

    window.document.title = 'Share note – LICK';

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
	else {
		Note($routeParams.id).$bindTo($scope, 'note').then(function(unbinder) {
			
			console.log($scope.note)

			window.document.title = 'Text viewer for' + $scope.note.title + ' – LICK';
		});		
	}

	
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

	$scope.openMenu = function(){
		$('#main').toggleClass('menuOpen');	
	};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9tYWluLmpzIiwiLi4vanMvbW9kdWxlcy9ib2FyZEN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NoYW5nZUN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NvbG9waG9uQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaGVsbG9DdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9oaXN0b3J5Q3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaW5mb0N0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2xpc3RDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9ub3RlQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvcG9ydGFsQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvc2hhcmVDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy90ZXh0Q3RybC5qcyIsIi4uL2pzL3NoYXJlZC9jb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy8vQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFZlbmRvciBmaWxlc1xuLy8gdmFyICQgPSB3aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSByZXF1aXJlKCcuL3ZlbmRvci9qcXVlcnktMS4xMS4xLm1pbicpO1xuXG52YXIgJCRfID0gd2luZG93LiQkXyA9IHJlcXVpcmUoJy4vc2hhcmVkL2NvcmUnKTsgXG5cbnZhciBoZWxsb0N0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvaGVsbG9DdHJsJyksXG5cdHBvcnRhbEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvcG9ydGFsQ3RybCcpLFxuXHRpbmZvQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9pbmZvQ3RybCcpLFxuXHRub3RlQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9ub3RlQ3RybCcpLFxuXHR0ZXh0Q3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy90ZXh0Q3RybCcpLFxuXHRjaGFuZ2VDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2NoYW5nZUN0cmwnKSxcblx0aGlzdG9yeUN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvaGlzdG9yeUN0cmwnKSxcblx0Ym9hcmRDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2JvYXJkQ3RybCcpLCBcblx0bGlzdEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvbGlzdEN0cmwnKSxcblx0c2hhcmVDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL3NoYXJlQ3RybCcpLFxuXHRjb2xvcGhvbkN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvY29sb3Bob25DdHJsJyk7XG5cbnZhciAkYm9keSA9ICQoJyNuZy1hcHAnKVxuXG52YXIgY29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5RDdqMmJrZ1pnM2xlZC1DUjBySDh3WE1na3NZNHNQMm84XCIsXG4gIGF1dGhEb21haW46IFwibGljay5maXJlYmFzZWFwcC5jb21cIixcbiAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9saWNrLmZpcmViYXNlaW8uY29tXCIsXG4gIHByb2plY3RJZDogXCJmaXJlYmFzZS1saWNrXCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwiZmlyZWJhc2UtbGljay5hcHBzcG90LmNvbVwiLFxuICBtZXNzYWdpbmdTZW5kZXJJZDogXCIzMzA0ODMyOTI5MTdcIlxufTtcblxuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChjb25maWcpO1xuXG53aW5kb3cuX0ZpcmViYXNlID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKTtcblxud2luZG93Lmxpc3RMb29raW5nQXQgPSAnbm90ZXMnO1xud2luZG93LmRpcmVjdGlvbnMgPSBbJ25vcnRoJywgJ2Vhc3QnLCAnc291dGgnLCAnd2VzdCddO1xud2luZG93LmxheWVycyA9IFsnbGFuZCcsICdza3knXTtcbndpbmRvdy5sb2dnZWRJbiA9IGZhbHNlO1xud2luZG93LmxvZ2dpbmdJbiA9IGZhbHNlO1xud2luZG93LmlzTW9iaWxlQXBwID0gZmFsc2U7XG53aW5kb3cuaGlzdG9yaWNhbCA9IFtdO1xud2luZG93LnVuYmluZGluZyA9IFtdO1xuXG53aW5kb3cuZW1haWxFc2NhcGVyID0gZnVuY3Rpb24oZW1haWwpe1xuXHRyZXR1cm4gZW1haWwucmVwbGFjZSgvWyAuXS9nLCBcIl9cIik7XG59O1xuXG53aW5kb3cuZW1haWxVbmVzY2FwZXIgPSBmdW5jdGlvbihlbWFpbCl7XG5cdHJldHVybiBlbWFpbC5yZXBsYWNlKC9bX10vZywgXCIuXCIpO1xufTtcblxud2luZG93LmdldE9iamVjdFNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHNpemUgPSAwLCBcbiAga2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkgc2l6ZSsrO1xuICB9XG4gIHJldHVybiBzaXplO1xufTtcblxud2luZG93LmdldE9iamVjdERlZXBTaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBzaXplID0gMCwgXG4gIFx0a2V5O1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChcbiAgICAgIFx0dHlwZW9mKG9ialtrZXldKSA9PT0gJ29iamVjdCcgXG4gICAgICBcdCYmIGtleS5pbmRleE9mKCckJykgPCAwXG4gIFx0KSBzaXplKys7XG4gIH1cbiAgcmV0dXJuIHNpemU7XG59O1xuXG53aW5kb3cuaXNfdG91Y2hfZGV2aWNlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgJ29ubXNnZXN0dXJlY2hhbmdlJyBpbiB3aW5kb3c7XG59O1xuXG53aW5kb3cudW5iaW5kQWxsID0gZnVuY3Rpb24oKXtcblx0Zm9yICh2YXIgbWV0aG9kIGluIHdpbmRvdy51bmJpbmRpbmcpe1xuXHRcdHdpbmRvdy51bmJpbmRpbmdbbWV0aG9kXSgpO1xuXHR9XG59O1xuXG5pZiAod2luZG93LmlzX3RvdWNoX2RldmljZSgpKSAkYm9keS5hZGRDbGFzcygndG91Y2h5JylcblxuaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignaVBhZCcpID4gLTEpe1xuXHQkKCdodG1sJykuYWRkQ2xhc3MoJ2lQYWQnKVxufWVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignaVBob25lJykgPiAtMSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ2lQb2QnKSA+IC0xKXtcblx0JCgnaHRtbCcpLmFkZENsYXNzKCdpUGhvbmUnKVxufVxuXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZVJlYWR5JywgZGV2aWNlUmVhZHksIGZhbHNlKTtcblxuaWYgKFx0XG5cdChkb2N1bWVudC5VUkwuaW5kZXhPZiggJ2h0dHA6Ly8nICkgPT09IC0xKSAmJlxuXHQoZG9jdW1lbnQuVVJMLmluZGV4T2YoICdodHRwczovLycgKSA9PT0gLTEpXG4pe1xuXHR3aW5kb3cuaXNNb2JpbGVBcHAgPSB0cnVlO1xuXHQkYm9keS5hZGRDbGFzcygncGhvbmVHYXAnKTtcdFxufVxuXG5mdW5jdGlvbiBkZXZpY2VSZWFkeSgpe1xuXHRBcHAuaW5pdGlhbGl6ZSgpO1xuXHRTdGF0dXNCYXIuaGlkZSgpO1xufVxuXG4kKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpe1xuXHR2YXIgJHRoYXQgPSAkKHRoaXMpLFxuXHRcdF9zdCA9ICR0aGF0LnNjcm9sbFRvcCgpO1xuXG5cdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCl7XG5cdFx0aWYgKF9zdCA+IDEwKXtcblx0XHRcdCRib2R5LmFkZENsYXNzKCd0b3BOYXZpZ2F0aW9uJylcblx0XHR9ZWxzZXtcblx0XHRcdCRib2R5LnJlbW92ZUNsYXNzKCd0b3BOYXZpZ2F0aW9uJylcdFx0XHRcblx0XHR9XG5cdH1lbHNle1xuXHRcdGlmIChfc3QgPiAyMCl7XG5cdFx0XHQkYm9keS5hZGRDbGFzcygndG9wTmF2aWdhdGlvbicpXG5cdFx0fWVsc2V7XG5cdFx0XHQkYm9keS5yZW1vdmVDbGFzcygndG9wTmF2aWdhdGlvbicpXHRcdFx0XG5cdFx0fVxuXHR9XG59KVxuXG4vLyBkZWZpbmUgb3VyIGFwcCBhbmQgZGVwZW5kZW5jaWVzIChyZW1lbWJlciB0byBpbmNsdWRlIGZpcmViYXNlISlcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZShcblx0J2xpY2snLCBcblx0W1xuXHRcdCdmaXJlYmFzZScsIFxuXHRcdCduZ1JvdXRlJyxcblx0XHQndWkuc29ydGFibGUnLFxuXHRcdCdjZnAuaG90a2V5cycsXG5cdFx0J25nU2FuaXRpemUnLFxuXHRcdCduZ0Nvb2tpZXMnLFxuXHRcdCdncmlkc3RlcicsXG5cdFx0J25nQW5pbWF0ZScsXG5cdFx0J25nVG91Y2gnLFxuXHRcdC8vICdobVRvdWNoRXZlbnRzJyxcblx0XHQnc2xpY2tDYXJvdXNlbCdcblx0XVxuKTtcblxuYXBwLnJ1bihbXCIkcm9vdFNjb3BlXCIsIFwiJGxvY2F0aW9uXCIsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRsb2NhdGlvbikge1xuXHQkcm9vdFNjb3BlLiRvbihcIiRyb3V0ZUNoYW5nZUVycm9yXCIsIGZ1bmN0aW9uKGV2ZW50LCBuZXh0LCBwcmV2aW91cywgZXJyb3IpIHtcblx0XHRpZiAoZXJyb3IgPT09IFwiQVVUSF9SRVFVSVJFRFwiKSB7IFxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9wb3J0YWwnKTtcblx0XHR9XG5cdH0pO1xufV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODg4ODg4ODhiYSAgICAsYWQ4ODg4YmEsICAgODggICAgICAgIDg4IDg4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCBhZDg4ODg4YmEgICBcbi8vIDg4ICAgICAgXCI4YiAgZDhcIicgICAgYFwiOGIgIDg4ICAgICAgICA4OCAgICAgIDg4ICAgICAgODggICAgICAgICBkOFwiICAgICBcIjhiICBcbi8vIDg4ICAgICAgLDhQIGQ4JyAgICAgICAgYDhiIDg4ICAgICAgICA4OCAgICAgIDg4ICAgICAgODggICAgICAgICBZOCwgICAgICAgICAgXG4vLyA4OGFhYWFhYThQJyA4OCAgICAgICAgICA4OCA4OCAgICAgICAgODggICAgICA4OCAgICAgIDg4YWFhYWEgICAgYFk4YWFhYWEsICAgIFxuLy8gODhcIlwiXCJcIjg4JyAgIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICA4OCAgICAgIDg4ICAgICAgODhcIlwiXCJcIlwiICAgICAgYFwiXCJcIlwiXCI4YiwgIFxuLy8gODggICAgYDhiICAgWTgsICAgICAgICAsOFAgODggICAgICAgIDg4ICAgICAgODggICAgICA4OCAgICAgICAgICAgICAgICAgYDhiICBcbi8vIDg4ICAgICBgOGIgICBZOGEuICAgIC5hOFAgIFk4YS4gICAgLmE4UCAgICAgIDg4ICAgICAgODggICAgICAgICBZOGEgICAgIGE4UCAgXG4vLyA4OCAgICAgIGA4YiAgIGBcIlk4ODg4WVwiJyAgICBgXCJZODg4OFlcIicgICAgICAgODggICAgICA4ODg4ODg4ODg4OCBcIlk4ODg4OFBcIiAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXG5hcHAuY29uZmlnKCBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICAgICRyb3V0ZVByb3ZpZGVyXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHNpbXBseSB0eXBpbmcgaW4gdGhlIGFkZHJlc3NcbiAgICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2hlbGxvLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnaGVsbG9DdHJsJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgdGhlIGxvZ2luIC8gcG9ydGFsIHBhZ2VcbiAgICAgICAgLndoZW4oJy9wb3J0YWwnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL3BvcnRhbC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ3BvcnRhbEN0cmwnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciB0aGUgaW5mbyBwYWdlXG4gICAgICAgIC53aGVuKCcvaW5mbycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvaW5mby5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ2luZm9DdHJsJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3Igbm90ZXNcbiAgICAgICAgLndoZW4oJy9ub3RlLzppZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvbm90ZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ25vdGVDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBzaGFyZWRub3Rlc1xuICAgICAgICAud2hlbignL3NoYXJlZG5vdGUvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ub3RlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnbm90ZUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHRleHRcbiAgICAgICAgLndoZW4oJy90ZXh0LzppZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvdGV4dC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ3RleHRDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBjaGFuZ2luZyBib2FyZHNcbiAgICAgICAgLndoZW4oJy9jaGFuZ2UvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9jaGFuZ2UuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdjaGFuZ2VDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBib2FyZHNcbiAgICAgICAgLndoZW4oJy9ib2FyZC86aWQnLCB7IFxuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ib2FyZC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ2JvYXJkQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgbGlzdFxuICAgICAgICAud2hlbignL2xpc3QnLCB7IFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9saXN0Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciAgOiAnbGlzdEN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGhpc3RvcnlcbiAgICAgICAgLndoZW4oJy9oaXN0b3J5JywgeyBcblx0XHRcdHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvaGlzdG9yeS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgIDogJ2hpc3RvcnlDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBzaGFyZVxuICAgICAgICAud2hlbignL3NoYXJlLzppZCcsIHsgXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL3NoYXJlLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciAgOiAnc2hhcmVDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBsaXN0XG4gICAgICAgIC53aGVuKCcvY29sb3Bob24nLCB7IFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9jb2xvcGhvbi5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgIDogJ2NvbG9waG9uQ3RybCdcbiAgICAgICAgfSk7XG59KVxuLnJ1biggZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkY29va2llcywgTG9naW4sICRyb3V0ZSwgJHRpbWVvdXQsICRhbmltYXRlKSB7XG5cdCRyb290U2NvcGUuJG9uKCAnJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgbmV4dCwgY3VycmVudCkge1xuXG5cdFx0d2luZG93Lmhpc3RvcmljYWwucHVzaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuXHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UuaGlzdG9yaWNhbF9sYXN0ID0gJGxvY2F0aW9uLnBhdGgoKTtcblxuXHRcdGlmICgodHlwZW9mKGN1cnJlbnQpICE9PSAndW5kZWZpbmVkJykgJiYgKHR5cGVvZihjdXJyZW50LnRlbXBsYXRlVXJsKSAhPT0gJ3VuZGVmaW5lZCcpKVxuXHRcdFx0JGJvZHkuYXR0ciggJ2RhdGEtbGVhdmluZycsIGN1cnJlbnQudGVtcGxhdGVVcmwuc3BsaXQoJy8nKVsyXS5zcGxpdCgnLicpWzBdICk7XG5cdFx0aWYgKCh0eXBlb2YobmV4dCkgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mKG5leHQudGVtcGxhdGVVcmwpICE9PSAndW5kZWZpbmVkJykpXG5cdFx0XHQkYm9keS5hdHRyKCAnZGF0YS1lbnRlcmluZycsIG5leHQudGVtcGxhdGVVcmwuc3BsaXQoJy8nKVsyXS5zcGxpdCgnLicpWzBdICk7XG5cdFx0ZWxzZXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAod2luZG93LmxvZ2dlZEluKXtcblx0XHRcdGNvbnNvbGUubG9nKCdhbHJlYWR5IGxvZ2dlZCBpbiEnKVxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xuXG5cdFx0XHRpZiAoJGxvY2F0aW9uLnBhdGgoKSA9PT0gJy8nKVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRpZiAoIFxuXHRcdFx0XHQoIXdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwgJiYgIXdpbmRvdy5sb2NhbFN0b3JhZ2UucGFzcykgJiZcblx0XHRcdFx0bmV4dC50ZW1wbGF0ZVVybCAhPT0gJ2Fzc2V0cy9pbmMvY29sb3Bob24uaHRtbCdcblx0XHRcdCl7XHRcblx0XHRcdFx0Y29uc29sZS5sb2coJ25vIHN0b3JlZCBsb2dpbiwgZ290byBzdGFydCcpXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcG9ydGFsJylcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRib2R5LmFkZENsYXNzKCdyZWFkeScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBcblx0XHRcdFx0KCRjb29raWVzLmVtYWlsICYmICRjb29raWVzLnBhc3MpIHx8IFxuXHRcdFx0XHQod2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3MpXG5cdFx0XHQpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc3RvcmVkIGxvZ2luIGZvdW5kLCBsb2dnaW5nIGluJylcblxuXHRcdFx0XHR2YXIgbG9naW5FbWFpbCA9ICRjb29raWVzLmVtYWlsIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwsXG5cdFx0XHRcdFx0bG9naW5QYXNzID0gJGNvb2tpZXMucGFzcyB8fCB3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3M7XG5cblx0XHRcdFx0TG9naW4obG9naW5FbWFpbCwgbG9naW5QYXNzLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmIChuZXh0LnRlbXBsYXRlVXJsID09PSAnYXNzZXRzL2luYy9wb3J0YWwuaHRtbCcpe1xuXHRcdFx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jyk7XG5cblx0XHRcdFx0XHRcdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmhpc3RvcmljYWxfbGFzdClcblx0XHRcdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgod2luZG93LmxvY2FsU3RvcmFnZS5oaXN0b3JpY2FsX2xhc3QpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQkYW5pbWF0ZS5lbmFibGVkKGZhbHNlKTtcblx0XHRcdFx0XHRcdCRyb3V0ZS5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0JGFuaW1hdGUuZW5hYmxlZCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jylcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkYm9keS5hdHRyKCdkYXRhLWRpcmVjdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCRjb29raWVzLmRpcmVjdGlvbil7XG5cdFx0XHRyZXR1cm4gd2luZG93LmRpcmVjdGlvbnNbJGNvb2tpZXMuZGlyZWN0aW9uICUgNF07XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHQkY29va2llcy5kaXJlY3Rpb24gPSAwO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5kaXJlY3Rpb25zWyRjb29raWVzLmRpcmVjdGlvbl07XG5cdFx0fVxuXHR9KSBcblx0XG5cdGlmICgkY29va2llcy5sYXllcil7XG5cdFx0JHJvb3RTY29wZS5sYXllciA9ICRjb29raWVzLmxheWVyO1xuXHR9XG5cdGVsc2V7XG5cdFx0JGNvb2tpZXMubGF5ZXIgPSAnc2t5Jztcblx0XHQkcm9vdFNjb3BlLmxheWVyID0gJGNvb2tpZXMubGF5ZXI7XG5cdH1cbn0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODg4ODg4ODg4ODggZGIgICAgICAgICxhZDg4ODhiYSwgODg4ODg4ODg4ODg4ICxhZDg4ODhiYSwgICA4ODg4ODg4OGJhICA4OCA4ODg4ODg4ODg4OCBhZDg4ODg4YmEgICBcbi8vIDg4ICAgICAgICAgZDg4YiAgICAgIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgZDhcIicgICAgYFwiOGIgIDg4ICAgICAgXCI4YiA4OCA4OCAgICAgICAgIGQ4XCIgICAgIFwiOGIgIFxuLy8gODggICAgICAgIGQ4J2A4YiAgICBkOCcgICAgICAgICAgICAgICA4OCAgICBkOCcgICAgICAgIGA4YiA4OCAgICAgICw4UCA4OCA4OCAgICAgICAgIFk4LCAgICAgICAgICBcbi8vIDg4YWFhYWEgIGQ4JyAgYDhiICAgODggICAgICAgICAgICAgICAgODggICAgODggICAgICAgICAgODggODhhYWFhYWE4UCcgODggODhhYWFhYSAgICBgWThhYWFhYSwgICAgXG4vLyA4OFwiXCJcIlwiXCIgZDhZYWFhYVk4YiAgODggICAgICAgICAgICAgICAgODggICAgODggICAgICAgICAgODggODhcIlwiXCJcIjg4JyAgIDg4IDg4XCJcIlwiXCJcIiAgICAgIGBcIlwiXCJcIlwiOGIsICBcbi8vIDg4ICAgICBkOFwiXCJcIlwiXCJcIlwiXCI4YiBZOCwgICAgICAgICAgICAgICA4OCAgICBZOCwgICAgICAgICw4UCA4OCAgICBgOGIgICA4OCA4OCAgICAgICAgICAgICAgICAgYDhiICBcbi8vIDg4ICAgIGQ4JyAgICAgICAgYDhiIFk4YS4gICAgLmE4UCAgICAgODggICAgIFk4YS4gICAgLmE4UCAgODggICAgIGA4YiAgODggODggICAgICAgICBZOGEgICAgIGE4UCAgXG4vLyA4OCAgIGQ4JyAgICAgICAgICBgOGIgYFwiWTg4ODhZXCInICAgICAgODggICAgICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4YiA4OCA4ODg4ODg4ODg4OCBcIlk4ODg4OFBcIiAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgXCJcIiAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgLGFkUFBZYmEsICAgLGFkUFBZYixkOCA4OCA4YixkUFBZYmEsICAgXG4vLyA4OCBhOFwiICAgICBcIjhhIGE4XCIgICAgYFk4OCA4OCA4OFAnICAgYFwiOGEgIFxuLy8gODggOGIgICAgICAgZDggOGIgICAgICAgODggODggODggICAgICAgODggIFxuLy8gODggXCI4YSwgICAsYThcIiBcIjhhLCAgICxkODggODggODggICAgICAgODggIFxuLy8gODggIGBcIlliYmRQXCInICAgYFwiWWJiZFBcIlk4IDg4IDg4ICAgICAgIDg4ICBcbi8vICAgICAgICAgICAgICAgICBhYSwgICAgLDg4ICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgXCJZOGJiZFBcIiAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeShcIkxvZ2luXCIsIFsnJHJvb3RTY29wZScsIFwiJGZpcmViYXNlQXV0aFwiLCBcIiRjb29raWVzXCIsICckdGltZW91dCcsICdBdXRoJywgJyRsb2NhdGlvbicsICdOb3RlcycsXG5cdGZ1bmN0aW9uKCRyb290U2NvcGUsICRmaXJlYmFzZUF1dGgsICRjb29raWVzLCAkdGltZW91dCwgQXV0aCwgJGxvY2F0aW9uLCBOb3Rlcykge1xuXHRcdHJldHVybiBmdW5jdGlvbih0aGVFbWFpbCwgdGhlUGFzcywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spe1xuXG5cdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cubG9nZ2luZ0luLCB0aGVFbWFpbCwgdGhlUGFzcy8qLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjayovKVxuXG5cdFx0XHRpZiAoIXdpbmRvdy5sb2dnaW5nSW4pe1xuXHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gdHJ1ZTtcblxuXHRcdFx0XHRBdXRoLiRzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChcblx0XHRcdFx0XHR0aGVFbWFpbCxcblx0XHRcdFx0XHR0aGVQYXNzXG5cdFx0XHRcdCkudGhlbihmdW5jdGlvbihhdXRoRGF0YSkge1xuXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2xvZ2dlZCBpbiB3aXRoICcgKyB0aGVFbWFpbCArICcsICcgKyBhdXRoRGF0YS51c2VyLnVpZClcblx0XHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG5cblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsID0gJGNvb2tpZXMuZW1haWwgPSB0aGVFbWFpbDtcblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsX2VzY2FwZWQgPSAkY29va2llcy5lbWFpbF9lc2NhcGVkID0gd2luZG93LmVtYWlsRXNjYXBlcih0aGVFbWFpbCk7XG5cdFx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5wYXNzID0gJGNvb2tpZXMucGFzcyA9IHRoZVBhc3M7XG5cblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnVpZCA9IHdpbmRvdy51aWQgPSBhdXRoRGF0YS51c2VyLnVpZDtcblxuXHRcdFx0XHRcdHdpbmRvdy5sb2dnZWRJbiA9IHRydWU7XG5cblx0XHRcdFx0XHRpZihcblx0XHRcdFx0XHRcdChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSkpIHx8IFxuXHRcdFx0XHRcdFx0KG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2QvaSkpIHx8XG5cdFx0XHRcdFx0XHQobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5kZXZpY2UgPSAnTW9iaWxlJztcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHdpbmRvdy5kZXZpY2UgPSAnRGVza3RvcCc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZihjYWxsYmFjaykgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly9VUERBVEVcblxuXHRcdFx0XHRcdHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YScpO1xuXHRcdFx0XHRcdHJlZi5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uKHNuYXBzaG90KSB7XG5cblx0XHRcdFx0XHRcdGlmICghc25hcHNob3QuZXhpc3RzKCkpe1xuXHRcdFx0XHRcdFx0XHRyZWYuc2V0KHtcblx0XHRcdFx0XHRcdFx0XHR1c2VyOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbWFpbF9lc2NhcGVkOiAkY29va2llcy5lbWFpbF9lc2NhcGVkLFxuXHRcdFx0XHRcdFx0XHRcdFx0dWlkOiB3aW5kb3cudWlkXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pOyBcblxuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZXJyb3JDYWxsYmFjaykgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0XHRcdFx0ZXJyb3JDYWxsYmFjaygpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHdpbmRvdy5sb2dnaW5nSW4gPSBmYWxzZTtcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BvcnRhbCcpO1xuXHRcdFx0XHRcdCRib2R5LmFkZENsYXNzKCdyZWFkeScpO1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJBdXRoZW50aWNhdGlvbiBmYWlsZWQ6XCIsIGVycm9yKTtcblx0XHRcdFx0XHQkY29va2llcy5lbWFpbCA9ICcnO1xuXHRcdFx0XHRcdCRjb29raWVzLnBhc3MgPSAnJztcblx0XHRcdFx0XHRhbGVydCgnT2ggbm8hIFlvdXIgbG9naW4gZGlkblxcJ3Qgd29yay4gVHJ5IGFnYWluIScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cdFx0XHRcblx0XHR9XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICBcbi8vIDg4ICAsYWRQUFliYSwgICAsYWRQUFliLGQ4ICAsYWRQUFliYSwgIDg4ICAgICAgIDg4IE1NODhNTU0gIFxuLy8gODggYThcIiAgICAgXCI4YSBhOFwiICAgIGBZODggYThcIiAgICAgXCI4YSA4OCAgICAgICA4OCAgIDg4ICAgICBcbi8vIDg4IDhiICAgICAgIGQ4IDhiICAgICAgIDg4IDhiICAgICAgIGQ4IDg4ICAgICAgIDg4ICAgODggICAgIFxuLy8gODggXCI4YSwgICAsYThcIiBcIjhhLCAgICxkODggXCI4YSwgICAsYThcIiBcIjhhLCAgICxhODggICA4OCwgICAgXG4vLyA4OCAgYFwiWWJiZFBcIicgICBgXCJZYmJkUFwiWTggIGBcIlliYmRQXCInICAgYFwiWWJiZFAnWTggICBcIlk4ODggIFxuLy8gICAgICAgICAgICAgICAgIGFhLCAgICAsODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgIFwiWThiYmRQXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeShcIkxvZ291dFwiLCBbXCIkZmlyZWJhc2VBdXRoXCIsIFwiJGNvb2tpZXNcIiwgJ0F1dGgnLCAnJGxvY2F0aW9uJywgJyR0aW1lb3V0JywgXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZUF1dGgsICRjb29raWVzLCBBdXRoLCAkbG9jYXRpb24sICR0aW1lb3V0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XG5cblx0XHRcdHdpbmRvdy5sb2dnZWRJbiA9IGZhbHNlO1xuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCRjb29raWVzLmVtYWlsID0gJyc7XG5cdFx0XHRcdCRjb29raWVzLmVtYWlsX2VzY2FwZWQgPSAnJztcblx0XHRcdFx0JGNvb2tpZXMucGFzcyA9ICcnO1xuXHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsID0gJyc7XG5cdFx0XHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWxfZXNjYXBlZCA9ICcnO1xuXHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3MgPSAnJztcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS51aWQgPSAnJztcblx0XHRcdFx0d2luZG93LnVpZCA9ICcnO1xuXG5cdFx0XHRcdC8vIEF1dGguJHVuYXV0aCgpO1xuXHRcdFx0XHRBdXRoLiRzaWduT3V0KCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0ICAvLyBTaWduLW91dCBzdWNjZXNzZnVsLlxuXHRcdFx0XHQgIGNvbnNvbGUubG9nKCdzaWduIG91dCBzdWNjZXNzZnVsJylcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnbG9nb3V0IGZhaWxlZCA6KCcpXG5cdFx0XHRcdCAgLy8gQW4gZXJyb3IgaGFwcGVuZWQuXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcG9ydGFsJyk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgIDg4ICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICA4OCAgICAgICAgICAgXG4vLyAsYWRQUFlZYmEsIDg4ICAgICAgIDg4IE1NODhNTU0gODgsZFBQWWJhLCAgIFxuLy8gXCJcIiAgICAgYFk4IDg4ICAgICAgIDg4ICAgODggICAgODhQJyAgICBcIjhhICBcbi8vICxhZFBQUFBQODggODggICAgICAgODggICA4OCAgICA4OCAgICAgICA4OCAgXG4vLyA4OCwgICAgLDg4IFwiOGEsICAgLGE4OCAgIDg4LCAgIDg4ICAgICAgIDg4ICBcbi8vIGBcIjhiYmRQXCJZOCAgYFwiWWJiZFAnWTggICBcIlk4ODggODggICAgICAgODggIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdBdXRoJywgW1wiJGZpcmViYXNlQXV0aFwiLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VBdXRoKSB7XG5cdFx0dmFyICRmaXJlYmFzZUF1dGggPSAkZmlyZWJhc2VBdXRoKCk7XG5cdFx0cmV0dXJuICRmaXJlYmFzZUF1dGg7XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4YixkUFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICxhZFBQWWJhLCAgXG4vLyA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4IEk4WyAgICBcIlwiICBcbi8vIDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBgXCJZOGJhLCAgIFxuLy8gODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSBhYSAgICBdOEkgIFxuLy8gODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInIGBcIlliYmRQXCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ05vdGVzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAsYWRQUFliYSwgODgsZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliYSwgICxhZFBQWWIsODggOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAsYWRQUFliYSwgIFxuLy8gSThbICAgIFwiXCIgODhQJyAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFBfX19fXzg4IGE4XCIgICAgYFk4OCA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4IEk4WyAgICBcIlwiICBcbi8vICBgXCJZOGJhLCAgODggICAgICAgODggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhQUFwiXCJcIlwiXCJcIlwiIDhiICAgICAgIDg4IDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBgXCJZOGJhLCAgIFxuLy8gYWEgICAgXThJIDg4ICAgICAgIDg4IDg4LCAgICAsODggODggICAgICAgICBcIjhiLCAgICxhYSBcIjhhLCAgICxkODggODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSBhYSAgICBdOEkgIFxuLy8gYFwiWWJiZFBcIicgODggICAgICAgODggYFwiOGJiZFBcIlk4IDg4ICAgICAgICAgIGBcIlliYmQ4XCInICBgXCI4YmJkUFwiWTggODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInIGBcIlliYmRQXCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnU2hhcmVkTm90ZXMnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQnKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgXG4vLyA4OCxkUFBZYmEsICAgLGFkUFBZYmEsICAsYWRQUFlZYmEsIDhiLGRQUFliYSwgICxhZFBQWWIsODggLGFkUFBZYmEsICBcbi8vIDg4UCcgICAgXCI4YSBhOFwiICAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFwiICAgIGBZODggSThbICAgIFwiXCIgIFxuLy8gODggICAgICAgZDggOGIgICAgICAgZDggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhiICAgICAgIDg4ICBgXCJZOGJhLCAgIFxuLy8gODhiLCAgICxhOFwiIFwiOGEsICAgLGE4XCIgODgsICAgICw4OCA4OCAgICAgICAgIFwiOGEsICAgLGQ4OCBhYSAgICBdOEkgIFxuLy8gOFlcIlliYmQ4XCInICAgYFwiWWJiZFBcIicgIGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCI4YmJkUFwiWTggYFwiWWJiZFBcIicgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ0JvYXJkcycsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7IFxuXHRcdFx0Y29uc29sZS5sb2coKVxuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvYm9hcmRzJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIFxuLy8gOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgXG4vLyA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4ICBcbi8vIDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBcbi8vIDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgIFxuLy8gODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdOb3RlJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzLycgKyBpZCk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vICxhZFBQWWJhLCA4OCxkUFBZYmEsICAsYWRQUFlZYmEsIDhiLGRQUFliYSwgICxhZFBQWWJhLCAgLGFkUFBZYiw4OCA4YixkUFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICBcbi8vIEk4WyAgICBcIlwiIDg4UCcgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThQX19fX184OCBhOFwiICAgIGBZODggODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyAgYFwiWThiYSwgIDg4ICAgICAgIDg4ICxhZFBQUFBQODggODggICAgICAgICA4UFBcIlwiXCJcIlwiXCJcIiA4YiAgICAgICA4OCA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyBhYSAgICBdOEkgODggICAgICAgODggODgsICAgICw4OCA4OCAgICAgICAgIFwiOGIsICAgLGFhIFwiOGEsICAgLGQ4OCA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vIGBcIlliYmRQXCInIDg4ICAgICAgIDg4IGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCJZYmJkOFwiJyAgYFwiOGJiZFBcIlk4IDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdzaGFyZWROb3RlJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkLycgKyBpZCk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCxkUFBZYmEsICAgLGFkUFBZYmEsICAsYWRQUFlZYmEsIDhiLGRQUFliYSwgICxhZFBQWWIsODggIFxuLy8gODhQJyAgICBcIjhhIGE4XCIgICAgIFwiOGEgXCJcIiAgICAgYFk4IDg4UCcgICBcIlk4IGE4XCIgICAgYFk4OCAgXG4vLyA4OCAgICAgICBkOCA4YiAgICAgICBkOCAsYWRQUFBQUDg4IDg4ICAgICAgICAgOGIgICAgICAgODggIFxuLy8gODhiLCAgICxhOFwiIFwiOGEsICAgLGE4XCIgODgsICAgICw4OCA4OCAgICAgICAgIFwiOGEsICAgLGQ4OCAgXG4vLyA4WVwiWWJiZDhcIicgICBgXCJZYmJkUFwiJyAgYFwiOGJiZFBcIlk4IDg4ICAgICAgICAgIGBcIjhiYmRQXCJZOCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ0JvYXJkJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcy8nICsgaWQpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgIFxuLy8gODgsZFBZYmEsLGFkUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFlZYmEsICBcbi8vIDg4UCcgICBcIjg4XCIgICAgXCI4YSBhOFBfX19fXzg4ICAgODggICAgXCJcIiAgICAgYFk4ICBcbi8vIDg4ICAgICAgODggICAgICA4OCA4UFBcIlwiXCJcIlwiXCJcIiAgIDg4ICAgICxhZFBQUFBQODggIFxuLy8gODggICAgICA4OCAgICAgIDg4IFwiOGIsICAgLGFhICAgODgsICAgODgsICAgICw4OCAgXG4vLyA4OCAgICAgIDg4ICAgICAgODggIGBcIlliYmQ4XCInICAgXCJZODg4IGBcIjhiYmRQXCJZOCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ01ldGEnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEnKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICBcIlwiICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODgsZFBQWWJhLCAgODggLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICA4YixkUFBZYmEsIDhiICAgICAgIGQ4ICBcbi8vIDg4UCcgICAgXCI4YSA4OCBJOFsgICAgXCJcIiAgIDg4ICAgYThcIiAgICAgXCI4YSA4OFAnICAgXCJZOCBgOGIgICAgIGQ4JyAgXG4vLyA4OCAgICAgICA4OCA4OCAgYFwiWThiYSwgICAgODggICA4YiAgICAgICBkOCA4OCAgICAgICAgICBgOGIgICBkOCcgICBcbi8vIDg4ICAgICAgIDg4IDg4IGFhICAgIF04SSAgIDg4LCAgXCI4YSwgICAsYThcIiA4OCAgICAgICAgICAgYDhiLGQ4JyAgICBcbi8vIDg4ICAgICAgIDg4IDg4IGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmRQXCInICA4OCAgICAgICAgICAgICBZODgnICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDgnICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDgnICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnSGlzdG9yeScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS9oaXN0b3J5Jyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgXCJcIiAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICBcbi8vIDg4LGRQUFliYSwgIDg4ICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgOGIsZFBQWWJhLCA4YiAgICAgICBkOCAgLGFkUFBZYmEsICAsYWRQUFliYSwgIDg4ICAgICAgIDg4IDhiLGRQUFliYSwgTU04OE1NTSAgXG4vLyA4OFAnICAgIFwiOGEgODggSThbICAgIFwiXCIgICA4OCAgIGE4XCIgICAgIFwiOGEgODhQJyAgIFwiWTggYDhiICAgICBkOCcgYThcIiAgICAgXCJcIiBhOFwiICAgICBcIjhhIDg4ICAgICAgIDg4IDg4UCcgICBgXCI4YSAgODggICAgIFxuLy8gODggICAgICAgODggODggIGBcIlk4YmEsICAgIDg4ICAgOGIgICAgICAgZDggODggICAgICAgICAgYDhiICAgZDgnICA4YiAgICAgICAgIDhiICAgICAgIGQ4IDg4ICAgICAgIDg4IDg4ICAgICAgIDg4ICA4OCAgICAgXG4vLyA4OCAgICAgICA4OCA4OCBhYSAgICBdOEkgICA4OCwgIFwiOGEsICAgLGE4XCIgODggICAgICAgICAgIGA4YixkOCcgICBcIjhhLCAgICxhYSBcIjhhLCAgICxhOFwiIFwiOGEsICAgLGE4OCA4OCAgICAgICA4OCAgODgsICAgIFxuLy8gODggICAgICAgODggODggYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZFBcIicgIDg4ICAgICAgICAgICAgIFk4OCcgICAgIGBcIlliYmQ4XCInICBgXCJZYmJkUFwiJyAgIGBcIlliYmRQJ1k4IDg4ICAgICAgIDg4ICBcIlk4ODggIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkOCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkOCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdoaXN0b3J5Q291bnQnLFxuXHRmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEvaGlzdG9yeScpLFxuXHRcdFx0XHRjb3VudCA9IDA7XG5cblx0XHRcdHJlZi5vbmNlKFwidmFsdWVcIiwgZnVuY3Rpb24oc25hcHNob3QpIHtcblxuXHRcdFx0XHRzbmFwc2hvdC5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkU25hcHNob3QpIHtcblx0XHRcdFx0XHR2YXIgY2hpbGREYXRhID0gY2hpbGRTbmFwc2hvdC52YWwoKTtcblxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdCggY2hpbGREYXRhLmRldmljZSAhPT0gd2luZG93LmRldmljZSApIHx8IFxuXHRcdFx0XHRcdFx0KCBjaGlsZERhdGEudGltZSA8ICggRGF0ZS5ub3coKSAtIDM2MDAwMDAgKSApXG5cdFx0XHRcdFx0KXtcblx0XHRcdFx0XHRcdGNvdW50Kys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjYWxsYmFjayhjb3VudClcblx0XHRcdH0pXG5cdFx0fTtcblx0fVxuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4ICAgICAgICAgIFwiXCIgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODgsZFBQWWJhLCAgODggLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICA4YixkUFBZYmEsIDg4ICAsYWRQUFliYSwgLGFkUFBZWWJhLCA4OCAgXG4vLyA4OFAnICAgIFwiOGEgODggSThbICAgIFwiXCIgICA4OCAgIGE4XCIgICAgIFwiOGEgODhQJyAgIFwiWTggODggYThcIiAgICAgXCJcIiBcIlwiICAgICBgWTggODggIFxuLy8gODggICAgICAgODggODggIGBcIlk4YmEsICAgIDg4ICAgOGIgICAgICAgZDggODggICAgICAgICA4OCA4YiAgICAgICAgICxhZFBQUFBQODggODggIFxuLy8gODggICAgICAgODggODggYWEgICAgXThJICAgODgsICBcIjhhLCAgICxhOFwiIDg4ICAgICAgICAgODggXCI4YSwgICAsYWEgODgsICAgICw4OCA4OCAgXG4vLyA4OCAgICAgICA4OCA4OCBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkUFwiJyAgODggICAgICAgICA4OCAgYFwiWWJiZDhcIicgYFwiOGJiZFBcIlk4IDg4ICBcblxud2luZG93LmRlYm91bmNlSGlzdG9yaWNhbCA9IF8uZGVib3VuY2UoZnVuY3Rpb24oKXtcblxuXHRoaXN0b3JpY2FsX2NvbnN0cnVjdChcblx0XHRub3csIFxuXHRcdGluY29taW5nTm90ZSwgXG5cdFx0c2hhcmVBY3RpdmUsIFxuXHRcdGNhbGxiYWNrLFxuXHRcdE5vdGUsXG5cdFx0TWV0YSxcblx0XHQkY29va2llc1xuXHQpXG5cbn0sIDUwMDApXG5cbi8vIHdpbmRvdy5kZWJvdW5jZUhpc3RvcmljYWwoKTtcblxudmFyIGhpc3RvcmljYWxfZW5nYWdlID0gZnVuY3Rpb24oXG5cdFx0bm93LCBcblx0XHRpbmNvbWluZ05vdGUsIFxuXHRcdHNoYXJlQWN0aXZlLCBcblx0XHRjYWxsYmFjayxcblx0XHROb3RlLFxuXHRcdE1ldGEsXG5cdFx0JGNvb2tpZXNcblx0KXtcblx0XG59XG5cbmFwcC5zZXJ2aWNlKCdoaXN0b3JpY2FsJywgWydOb3RlJywgJ01ldGEnLCAnJGNvb2tpZXMnLFxuXHRmdW5jdGlvbihOb3RlLCBNZXRhLCAkY29va2llcykge1xuXHRcdHJldHVybiBmdW5jdGlvbihcblx0XHRcdG5vdywgXG5cdFx0XHRpbmNvbWluZ05vdGUsIFxuXHRcdFx0c2hhcmVBY3RpdmUsIFxuXHRcdFx0Y2FsbGJhY2tcblx0XHQpIHtcblxuXHRcdFx0Y29uc29sZS5sb2coYXJndW1lbnRzKVxuXG5cdFx0XHR2YXIgaGlzdG9yaWNhbE1hcmtlciA9IHtcblx0XHRcdFx0dGl0bGU6IGluY29taW5nTm90ZS50aXRsZSxcdFx0XG5cdFx0XHRcdGRldmljZTogd2luZG93LmRldmljZSxcblx0XHRcdFx0dGltZTogbm93LFxuXHRcdFx0XHRzZWVuOiBmYWxzZSxcblx0XHRcdFx0c2hhcmVkOiBzaGFyZUFjdGl2ZSxcblx0XHRcdFx0ZWRpdG9yOiAkY29va2llcy5lbWFpbF9lc2NhcGVkLFxuXHRcdFx0XHR1aWQ6IHdpbmRvdy51aWRcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNoYXJlQWN0aXZlKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGluY29taW5nTm90ZS5wYXJ0aWNpcGFudHMsIGZ1bmN0aW9uKHYsIGspe1xuXHRcdFx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHYudWlkICsgJy9tZXRhL2hpc3RvcnkvJyArIGluY29taW5nTm90ZS5pZCk7XG5cdFx0XHRcdFx0cmVmLnNldChoaXN0b3JpY2FsTWFya2VyKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhL2hpc3RvcnkvJyArIGluY29taW5nTm90ZS5pZCk7XG5cdFx0XHRcdHJlZi5zZXQoaGlzdG9yaWNhbE1hcmtlcilcblx0XHRcdH1cblxuXHRcdFx0aWYgKGluY29taW5nTm90ZS5wYXJlbnQpe1xuXHRcdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ib2FyZHMvJyArIGluY29taW5nTm90ZS5wYXJlbnQgKyAnL2xhc3RFZGl0ZWQnKTtcblx0XHRcdFx0cmVmLnNldChub3cpXG5cdFx0XHR9ZWxzZSBpZiAoaW5jb21pbmdOb3RlLnBhcnRpY2lwYW50cyAmJiBpbmNvbWluZ05vdGUucGFydGljaXBhbnRzW3dpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWxfZXNjYXBlZF0ucGFyZW50KXtcblx0XHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArIGluY29taW5nTm90ZS5pZCArICcvcGFydGljaXBhbnRzLycgKyB3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsX2VzY2FwZWQgKyAnL2xhc3RFZGl0ZWQnKTtcblx0XHRcdFx0cmVmLnNldChub3cpXG5cdFx0XHR9XG5cblx0XHRcdGNhbGxiYWNrKCk7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdISVNUT1JJQ0FMJylcblxuXHRcdFx0XG5cblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgIFwiXCIgICAsZCAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIDg4ICAgICBcbi8vIDhiLGRQUFliYSwgICAsYWRQUFliYSwgOGIgICAgICBkYiAgICAgIGQ4IDg4LGRQUFliYSwgIDg4IE1NODhNTU0gIFxuLy8gODhQJyAgIGBcIjhhIGE4UF9fX19fODggYDhiICAgIGQ4OGIgICAgZDgnIDg4UCcgICAgXCI4YSA4OCAgIDg4ICAgICBcbi8vIDg4ICAgICAgIDg4IDhQUFwiXCJcIlwiXCJcIlwiICBgOGIgIGQ4J2A4YiAgZDgnICA4OCAgICAgICBkOCA4OCAgIDg4ICAgICBcbi8vIDg4ICAgICAgIDg4IFwiOGIsICAgLGFhICAgYDhiZDgnICBgOGJkOCcgICA4OGIsICAgLGE4XCIgODggICA4OCwgICAgXG4vLyA4OCAgICAgICA4OCAgYFwiWWJiZDhcIicgICAgIFlQICAgICAgWVAgICAgIDhZXCJZYmJkOFwiJyAgODggICBcIlk4ODggIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ25ld0JpdCcsIFxuXHRmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24odGFiLCBjb250ZW50LCBsaW5rKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRkaXNwbGF5OiB0cnVlLFxuXHRcdFx0XHR0eXBlOlwicGxhaW5UZXh0XCIsXG5cdFx0XHRcdHRhYkNvdW50OiB0YWIsXG5cdFx0XHRcdGNvbnRlbnQ6IHR5cGVvZihjb250ZW50KSAhPT0gJ3VuZGVmaW5lZCcgPyBjb250ZW50IDogJycsXG5cdFx0XHRcdGNvbnRlbnRDYXJldDogdHlwZW9mKGNvbnRlbnQpICE9PSAndW5kZWZpbmVkJyA/IGNvbnRlbnQgOiAnPHNwYW4gY2xhc3M9XCJoaWRkZW5DYXJldFwiPjwvc3Bhbj4nLFxuXHRcdFx0XHRiaXRJRDogJCRfLnJhbmRvbWl6ZSgpLFxuXHRcdFx0XHRtYXJrOiBmYWxzZSxcblx0XHRcdFx0c2VsZWN0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuXHRcdFx0XHRkZXN0cm95ZWQ6IFwiXCIsXG5cdFx0XHRcdG1hcmtlZDogXCJcIixcblx0XHRcdFx0bWVudV9vcGVuOiBmYWxzZSxcblx0XHRcdFx0aXNMaW5rOiB0eXBlb2YobGluaykgIT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdFx0XHRhZGRyZXNzOiB0eXBlb2YobGluaykgIT09ICd1bmRlZmluZWQnID8gbGluayA6ICcnXG5cdFx0XHR9O1xuXHRcdH07XG5cdH1cbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgIGFkODggODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgZDhcIiAgIFwiXCIgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcbi8vICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vIE1NODhNTU0gODggOGIsZFBQWWJhLCAsYWRQUFliYSwgTU04OE1NTSA4YixkUFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICBcbi8vICAgODggICAgODggODhQJyAgIFwiWTggSThbICAgIFwiXCIgICA4OCAgICA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4ICBcbi8vICAgODggICAgODggODggICAgICAgICAgYFwiWThiYSwgICAgODggICAgODggICAgICAgODggOGIgICAgICAgZDggIDg4ICAgOFBQXCJcIlwiXCJcIlwiXCIgIFxuLy8gICA4OCAgICA4OCA4OCAgICAgICAgIGFhICAgIF04SSAgIDg4LCAgIDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgIFxuLy8gICA4OCAgICA4OCA4OCAgICAgICAgIGBcIlliYmRQXCInICAgXCJZODg4IDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdmaXJzdE5vdGUnLCBbJ25ld0JpdCcsICckY29va2llcycsXG5cdGZ1bmN0aW9uKG5ld0JpdCwgJGNvb2tpZXMpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24ocGFyZW50LCBpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS91c2VyJyk7XG5cblx0XHRcdHJlZi5zZXQoe1xuXHRcdFx0XHRlbWFpbF9lc2NhcGVkOiAkY29va2llcy5lbWFpbF9lc2NhcGVkLFxuXHRcdFx0XHR1aWQ6IHdpbmRvdy51aWRcblx0XHRcdH0pXG5cblx0XHRcdHZhciBub3RlSUQ7XG5cblx0XHRcdGlmIChpZCl7XG5cdFx0XHRcdG5vdGVJRCA9IGlkO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5vdGVJRCA9ICQkXy5yYW5kb21pemUoKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG5vdGVSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzLycgKyBub3RlSUQgKTtcblx0XHRcdG5vdGVSZWYuc2V0KHtcblx0XHRcdFx0dGl0bGU6ICdXZWxjb21lIHRvIExpY2shIDopIENsaWNrIGhlcmUgdG8gZ2V0IHN0YXJ0ZWQhJyxcblx0XHRcdFx0cGFyZW50OiB0eXBlb2YocGFyZW50KSA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcGFyZW50LFxuXHRcdFx0XHRpZDogbm90ZUlELFxuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdIaSB0aGVyZSEgV2VsY29tZSB0byBMaWNrLCB0aGUgc21hcnRlc3Qgd2F5IGZvciB5b3VyIHRvbmd1ZSB0byB0YWtlIG5vdGVzLiBZb3VyIGhhbmRzIGNhbiBoZWxwIHRvbywgaWYgdGhleVxcJ2QgbGlrZS4gOiknKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0xpY2sgaGFybmVzc2VzIHRoZSBwb3dlciBvZiB5b3VyIGZhdm9yaXRlIHRleHQgZWRpdG9yIHRvIGhlbHAgeW91IG9yZ2FuaXplIHlvdXIgbGlmZS4nKSxcblx0XHRcdFx0XHRuZXdCaXQoMSwgJ0lmIHlvdSBkb25cXCd0IGtub3cgd2hhdCBvbmUgb2YgdGhvc2UgaXMsIHRoYXRcXCdzIG9rYXkg4oCTIExpY2sgaXMgc3RpbGwganVzdCB5b3VyIHNwZWVkIScpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnTm90ZXMgY2FuIGVpdGhlciBiZSBzdGFuZC1hbG9uZSwgb3IgY2FuIGJlIG9yZ2FuaXplZCBpbnRvIGJvYXJkcy4gR28gYWhlYWQgYW5kIGNsb3NlIHRoaXMgYW5kIG1ha2UgYSBuZXcgYm9hcmQsIHRoZXlcXCdyZSBwcmV0dHkgaGFuZHkhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdMaWNrIHNlZW1zIHByZXR0eSBzaW1wbGUsIGJ1dCBpdFxcJ3MgZ290IGEgbG90IG9mIGNvb2wgdGhpbmdzIGJ1aWx0IHJpZ2h0IGluLiBJdCBtaWdodCBzdXJwcmlzZSB5b3UhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdBIGxpc3Qgb2YgTGlja1xcJ3Mga2V5Ym9hcmQgc2hvcnRjdXRzIGlzIG5ldmVyIGZhciBmcm9tIHJlYWNoOiBwcmVzcyBjb21tYW5kICsgPyB0byBzZWUgaXQhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdPbiBhIG1vYmlsZSBkZXZpY2U/IFRoZXJlIGFyZSBsb3RzIG9mIHN3aXBhYmxlIHRoaW5ncyDigJMgZ2l2ZSBpdCBhIHNob3QhJyksIFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnTGljayBpcyBhIHdvcmsgaW4gcHJvZ3Jlc3MsIGFuZCBpZiBzb21ldGhpbmcgZ29lcyB3cm9uZywgbGV0IG1lIGtub3cgYXQgZUBqZWN0LmNoLicsICdtYWlsdG86ZUBqZWN0LmNoJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdIYXBweSBMaWNraW5nISA6KScpXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGNhdGVnb3J5OiAwLFxuXHRcdFx0XHRkaXNwbGF5OiB0cnVlLFxuXHRcdFx0XHRsaXN0OiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5vdGVJRDtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgXG4vLyA4YixkUFBZYmEsICAgLGFkUFBZYmEsIDhiICAgICAgZGIgICAgICBkOCA4YixkUFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICBcbi8vIDg4UCcgICBgXCI4YSBhOFBfX19fXzg4IGA4YiAgICBkODhiICAgIGQ4JyA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4ICBcbi8vIDg4ICAgICAgIDg4IDhQUFwiXCJcIlwiXCJcIlwiICBgOGIgIGQ4J2A4YiAgZDgnICA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyA4OCAgICAgICA4OCBcIjhiLCAgICxhYSAgIGA4YmQ4JyAgYDhiZDgnICAgODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSAgXG4vLyA4OCAgICAgICA4OCAgYFwiWWJiZDhcIicgICAgIFlQICAgICAgWVAgICAgIDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnbmV3Tm90ZScsIFsnbmV3Qml0Jyxcblx0ZnVuY3Rpb24obmV3Qml0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHBhcmVudCwgaWQpIHtcblxuXHRcdFx0Y29uc29sZS5sb2coYXJndW1lbnRzKVxuXHRcdFx0dmFyIG5vdGVJRDtcblxuXHRcdFx0aWYgKGlkKXtcblx0XHRcdFx0bm90ZUlEID0gaWQ7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bm90ZUlEID0gJCRfLnJhbmRvbWl6ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbm90ZVJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbm90ZXMvJyArIG5vdGVJRCApO1xuXHRcdFx0bm90ZVJlZi5zZXQoe1xuXHRcdFx0XHR0aXRsZTogJycsXG5cdFx0XHRcdHBhcmVudDogdHlwZW9mKHBhcmVudCkgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHBhcmVudCxcblx0XHRcdFx0aWQ6IG5vdGVJRCxcblx0XHRcdFx0Ym9keTogW25ld0JpdCgwKV0sXG5cdFx0XHRcdGNhdGVnb3J5OiAwLFxuXHRcdFx0XHRkaXNwbGF5OiB0cnVlLFxuXHRcdFx0XHRsaXN0OiB0cnVlLFxuXHRcdFx0XHR4OiAwLFxuXHRcdFx0XHR5OiAwLFxuXHRcdFx0XHRsYXN0RWRpdGVkOiBEYXRlLm5vdygpXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5vdGVJRDtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIFxuLy8gLGFkUFBZYmEsIDg4LGRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYmEsIDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gSThbICAgIFwiXCIgODhQJyAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFBfX19fXzg4IDg4UCcgICBgXCI4YSBhOFwiICAgICBcIjhhICA4OCAgIGE4UF9fX19fODggIFxuLy8gIGBcIlk4YmEsICA4OCAgICAgICA4OCAsYWRQUFBQUDg4IDg4ICAgICAgICAgOFBQXCJcIlwiXCJcIlwiXCIgODggICAgICAgODggOGIgICAgICAgZDggIDg4ICAgOFBQXCJcIlwiXCJcIlwiXCIgIFxuLy8gYWEgICAgXThJIDg4ICAgICAgIDg4IDg4LCAgICAsODggODggICAgICAgICBcIjhiLCAgICxhYSA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vIGBcIlliYmRQXCInIDg4ICAgICAgIDg4IGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCJZYmJkOFwiJyA4OCAgICAgICA4OCAgYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZDhcIicgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnc2hhcmVOb3RlJywgWyckZmlyZWJhc2VPYmplY3QnLCAnTWV0YScsICdOb3RlJywgJ05vdGVzJywgJyRjb29raWVzJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCwgTWV0YSwgTm90ZSwgTm90ZXMsICRjb29raWVzLCAkbG9jYXRpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHRhcmdldCwgY2FsbGJhY2spIHtcblxuXHRcdFx0Y29uc29sZS5sb2coYXJndW1lbnRzKVxuXG5cdFx0XHR2YXIgbWV0YVJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS9zaGFyZWRVc2Vycy8nKS5wdXNoKHRhcmdldCk7XG5cblx0XHRcdHZhciB0cmFuc2FjdGlvbiA9IE5vdGUoaWQpLiRsb2FkZWQoKS50aGVuKGZ1bmN0aW9uKHByaXZhdGVOb3RlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHByaXZhdGVOb3RlKVxuXHRcdFx0XHR2YXIgc2hhcmluZyA9IHt9O1xuXHRcdFx0XHRpZiAocHJpdmF0ZU5vdGUucGFyZW50KXtcblx0XHRcdFx0XHRzaGFyaW5nWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdID0ge1xuXHRcdFx0XHRcdFx0dWlkOiB3aW5kb3cudWlkLFxuXHRcdFx0XHRcdFx0cGFyZW50OiBwcml2YXRlTm90ZS5wYXJlbnQsXG5cdFx0XHRcdFx0XHR4OiBwcml2YXRlTm90ZS54LFxuXHRcdFx0XHRcdFx0eTogcHJpdmF0ZU5vdGUueVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0c2hhcmluZ1skY29va2llcy5lbWFpbF9lc2NhcGVkXSA9IHsgXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0dWlkOiB3aW5kb3cudWlkLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNoYXJpbmdbZW1haWxFc2NhcGVyKHRhcmdldCldID0geyBwYXJlbnQ6IGZhbHNlIH1cblxuXHRcdFx0XHR2YXIgc2hhcmVkUmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnX3NoYXJlZC8nICsgaWQpO1xuXHRcdFx0XHRzaGFyZWRSZWYuc2V0KHtcblx0XHRcdFx0XHR0aXRsZTogcHJpdmF0ZU5vdGUudGl0bGUsXG5cdFx0XHRcdFx0aWQ6IHByaXZhdGVOb3RlLmlkLFxuXHRcdFx0XHRcdGJvZHk6IHByaXZhdGVOb3RlLmJvZHksXG5cdFx0XHRcdFx0Y2F0ZWdvcnk6IHByaXZhdGVOb3RlLmNhdGVnb3J5LFxuXHRcdFx0XHRcdGRpc3BsYXk6IHByaXZhdGVOb3RlLmRpc3BsYXksXG5cdFx0XHRcdFx0bGlzdDogcHJpdmF0ZU5vdGUubGlzdCxcblx0XHRcdFx0XHRwYXJ0aWNpcGFudHM6IHNoYXJpbmdcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cHJpdmF0ZU5vdGUuJHJlbW92ZSgpO1xuXG5cdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICA4OCAgICxkICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICA4OCAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIFxuLy8gLGFkUFBZWWJhLCAgLGFkUFBZYiw4OCAgLGFkUFBZYiw4OCBNTTg4TU1NICxhZFBQWWJhLCAgLGFkUFBZYmEsIDg4LGRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYmEsICAsYWRQUFliLDg4IDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gXCJcIiAgICAgYFk4IGE4XCIgICAgYFk4OCBhOFwiICAgIGBZODggICA4OCAgIGE4XCIgICAgIFwiOGEgSThbICAgIFwiXCIgODhQJyAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFBfX19fXzg4IGE4XCIgICAgYFk4OCA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4ICBcbi8vICxhZFBQUFBQODggOGIgICAgICAgODggOGIgICAgICAgODggICA4OCAgIDhiICAgICAgIGQ4ICBgXCJZOGJhLCAgODggICAgICAgODggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhQUFwiXCJcIlwiXCJcIlwiIDhiICAgICAgIDg4IDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBcbi8vIDg4LCAgICAsODggXCI4YSwgICAsZDg4IFwiOGEsICAgLGQ4OCAgIDg4LCAgXCI4YSwgICAsYThcIiBhYSAgICBdOEkgODggICAgICAgODggODgsICAgICw4OCA4OCAgICAgICAgIFwiOGIsICAgLGFhIFwiOGEsICAgLGQ4OCA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vIGBcIjhiYmRQXCJZOCAgYFwiOGJiZFBcIlk4ICBgXCI4YmJkUFwiWTggICBcIlk4ODggYFwiWWJiZFBcIicgIGBcIlliYmRQXCInIDg4ICAgICAgIDg4IGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCJZYmJkOFwiJyAgYFwiOGJiZFBcIlk4IDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdhZGRUb1NoYXJlZE5vdGUnLCBbJyRmaXJlYmFzZU9iamVjdCcsICdNZXRhJywgJ05vdGUnLCAnJGNvb2tpZXMnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0LCBNZXRhLCBOb3RlLCAkY29va2llcywgJGxvY2F0aW9uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkLCB0YXJnZXQsIGNhbGxiYWNrKSB7XG5cblx0XHRcdHZhciBtZXRhUmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhL3NoYXJlZFVzZXJzLycpLnB1c2godGFyZ2V0KTtcblxuXHRcdFx0dmFyIHBhcnRpY2lwYW50UmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnX3NoYXJlZC8nICsgaWQgKyAnL3BhcnRpY2lwYW50cy8nICsgZW1haWxFc2NhcGVyKHRhcmdldCkpO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhwYXJ0aWNpcGFudFJlZilcblxuXHRcdFx0cGFydGljaXBhbnRSZWYuc2V0KHtcblx0XHRcdFx0cGFyZW50OiBmYWxzZVxuXHRcdFx0fSwgY2FsbGJhY2spXG5cdFx0fTtcblx0fVxuXSk7XG5cblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICA4OCA4OCA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICBcIlwiIDg4IDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgIDg4IDg4ICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIFxuLy8gODggICAsZDggIDg4IDg4IDg4IDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gODggLGE4XCIgICA4OCA4OCA4OCA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4ICBcbi8vIDg4ODhbICAgICA4OCA4OCA4OCA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyA4OGBcIlliYSwgIDg4IDg4IDg4IDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgIFxuLy8gODggICBgWThhIDg4IDg4IDg4IDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdraWxsTm90ZScsIFsnTm90ZScsICdzaGFyZWROb3RlJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKE5vdGUsIHNoYXJlZE5vdGUsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgcGFyZW50KSB7XG5cblx0XHRcdGlmIChwYXJlbnQpe1xuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyBwYXJlbnQpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG5vdGUgPSBOb3RlKGlkKTtcblx0XHRcdG5vdGUuJHJlbW92ZSgpO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhpZCk7XG5cblx0XHRcdHNoYXJlZG5vdGUgPSBzaGFyZWROb3RlKGlkKTtcblx0XHRcdHNoYXJlZG5vdGUuJHJlbW92ZSgpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gOGIsZFBQWWJhLCAgICxhZFBQWWJhLCA4YiAgICAgIGRiICAgICAgZDggODgsZFBQWWJhLCAgICxhZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliLDg4ICBcbi8vIDg4UCcgICBgXCI4YSBhOFBfX19fXzg4IGA4YiAgICBkODhiICAgIGQ4JyA4OFAnICAgIFwiOGEgYThcIiAgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThcIiAgICBgWTg4ICBcbi8vIDg4ICAgICAgIDg4IDhQUFwiXCJcIlwiXCJcIlwiICBgOGIgIGQ4J2A4YiAgZDgnICA4OCAgICAgICBkOCA4YiAgICAgICBkOCAsYWRQUFBQUDg4IDg4ICAgICAgICAgOGIgICAgICAgODggIFxuLy8gODggICAgICAgODggXCI4YiwgICAsYWEgICBgOGJkOCcgIGA4YmQ4JyAgIDg4YiwgICAsYThcIiBcIjhhLCAgICxhOFwiIDg4LCAgICAsODggODggICAgICAgICBcIjhhLCAgICxkODggIFxuLy8gODggICAgICAgODggIGBcIlliYmQ4XCInICAgICBZUCAgICAgIFlQICAgICA4WVwiWWJiZDhcIicgICBgXCJZYmJkUFwiJyAgYFwiOGJiZFBcIlk4IDg4ICAgICAgICAgIGBcIjhiYmRQXCJZOCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ25ld0JvYXJkJywgWyduZXdOb3RlJyxcblx0ZnVuY3Rpb24obmV3Tm90ZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGJvYXJkSUQgPSAkJF8ucmFuZG9taXplKCk7XG5cblx0XHRcdC8vQk9BUkRTXG5cdFx0XHR2YXIgYm9hcmRSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcy8nICsgYm9hcmRJRCApO1xuXHRcdFx0Ym9hcmRSZWYuc2V0KHtcblx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRpZDogYm9hcmRJRCxcblx0XHRcdFx0c3RhcnJlZDogbnVsbCxcblx0XHRcdFx0bGFzdEVkaXRlZDogRGF0ZS5ub3coKSxcblx0XHRcdFx0bm90ZXM6W11cblx0XHRcdH0pO1xuXG5cdFx0XHRuZXdOb3RlKGJvYXJkSUQpO1xuXG5cdFx0XHRyZXR1cm4gYm9hcmRJRDtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgODggODggODggODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4ICAgICAgICBcIlwiIDg4IDg4IDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCAgICAgICAgICAgODggODggODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4ICAgLGQ4ICA4OCA4OCA4OCA4OCxkUFBZYmEsICAgLGFkUFBZYmEsICAsYWRQUFlZYmEsIDhiLGRQUFliYSwgICxhZFBQWWIsODggIFxuLy8gODggLGE4XCIgICA4OCA4OCA4OCA4OFAnICAgIFwiOGEgYThcIiAgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThcIiAgICBgWTg4ICBcbi8vIDg4ODhbICAgICA4OCA4OCA4OCA4OCAgICAgICBkOCA4YiAgICAgICBkOCAsYWRQUFBQUDg4IDg4ICAgICAgICAgOGIgICAgICAgODggIFxuLy8gODhgXCJZYmEsICA4OCA4OCA4OCA4OGIsICAgLGE4XCIgXCI4YSwgICAsYThcIiA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YSwgICAsZDg4ICBcbi8vIDg4ICAgYFk4YSA4OCA4OCA4OCA4WVwiWWJiZDhcIicgICBgXCJZYmJkUFwiJyAgYFwiOGJiZFBcIlk4IDg4ICAgICAgICAgIGBcIjhiYmRQXCJZOCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgna2lsbEJvYXJkJywgWydCb2FyZCcsICckbG9jYXRpb24nLFxuXHRmdW5jdGlvbihCb2FyZCwgJGxvY2F0aW9uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkLCBwYXJlbnQpIHtcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0Ym9hcmQgPSBCb2FyZChpZCk7XG5cdFx0XHRib2FyZC4kcmVtb3ZlKCk7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXCJcIiAgICAgICAgICAgIFwiXCIgICAsZCAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgIFxuLy8gICxhZFBQWWJhLCAgLGFkUFBZYmEsICA4YixkUFBZYmEsICAgLGFkUFBZYmEsICAsYWRQUFliYSwgOGIsZFBQWWJhLCBNTTg4TU1NIDhiLGRQUFliYSwgODggICxhZFBQWWJhLCA4OCBNTTg4TU1NIDhiICAgICAgIGQ4ICBcbi8vIGE4XCIgICAgIFwiXCIgYThcIiAgICAgXCI4YSA4OFAnICAgYFwiOGEgYThcIiAgICAgXCJcIiBhOFBfX19fXzg4IDg4UCcgICBgXCI4YSAgODggICAgODhQJyAgIFwiWTggODggYThcIiAgICAgXCJcIiA4OCAgIDg4ICAgIGA4YiAgICAgZDgnICBcbi8vIDhiICAgICAgICAgOGIgICAgICAgZDggODggICAgICAgODggOGIgICAgICAgICA4UFBcIlwiXCJcIlwiXCJcIiA4OCAgICAgICA4OCAgODggICAgODggICAgICAgICA4OCA4YiAgICAgICAgIDg4ICAgODggICAgIGA4YiAgIGQ4JyAgIFxuLy8gXCI4YSwgICAsYWEgXCI4YSwgICAsYThcIiA4OCAgICAgICA4OCBcIjhhLCAgICxhYSBcIjhiLCAgICxhYSA4OCAgICAgICA4OCAgODgsICAgODggICAgICAgICA4OCBcIjhhLCAgICxhYSA4OCAgIDg4LCAgICAgYDhiLGQ4JyAgICBcbi8vICBgXCJZYmJkOFwiJyAgYFwiWWJiZFBcIicgIDg4ICAgICAgIDg4ICBgXCJZYmJkOFwiJyAgYFwiWWJiZDhcIicgODggICAgICAgODggIFwiWTg4OCA4OCAgICAgICAgIDg4ICBgXCJZYmJkOFwiJyA4OCAgIFwiWTg4OCAgICAgWTg4JyAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4JyAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4JyAgICAgICBcblxuYXBwLmZhY3RvcnkoJ2NvbmNlbnRyaWNpdHknLCBbJyRjb29raWVzJyxcblx0ZnVuY3Rpb24oJGNvb2tpZXMpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHBhcmVudCkge1xuXHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ2NvbmNlbnRyaWMnKS5hdHRyKCdkYXRhLWRpcmVjdGlvbicsIFxuXHRcdFx0XHRmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHJldHVybiB3aW5kb3cuZGlyZWN0aW9uc1srKyRjb29raWVzLmRpcmVjdGlvbiAlIDRdO1xuXHRcdFx0XHR9XG5cdFx0XHQpXG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JGJvZHkucmVtb3ZlQ2xhc3MoJ2NvbmNlbnRyaWMnKVxuXHRcdFx0fSwgMTAwMClcblx0XHR9O1xuXHR9XG5dKTtcblxuYXBwLmZhY3RvcnkoJ2xheWVyaW5nJywgWyckcm9vdFNjb3BlJywgJyRjb29raWVzJyxcblx0ZnVuY3Rpb24oJHJvb3RTY29wZSwgJGNvb2tpZXMpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCRyb290U2NvcGUubGF5ZXIpXG5cblx0XHRcdGlmICgkY29va2llcy5sYXllciA9PT0gJ2xhbmQnKXtcblx0XHRcdFx0JGNvb2tpZXMubGF5ZXIgPSAnc2t5Jztcblx0XHRcdFx0JHJvb3RTY29wZS5sYXllciA9ICdza3knO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCRjb29raWVzLmxheWVyID0gJ2xhbmQnO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmxheWVyID0gJ2xhbmQnO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbl0pO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODg4ODg4ODg4ODggODggODggICAgIDg4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4ODg4ODg4OGJhICAgYWQ4ODg4OGJhICAgXG4vLyA4OCAgICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgXCI4YiBkOFwiICAgICBcIjhiICBcbi8vIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgODggICAgICAgICAgODggICAgICAsOFAgWTgsICAgICAgICAgIFxuLy8gODhhYWFhYSAgICAgODggODggICAgICAgICAgODggICAgICA4OGFhYWFhICAgICA4OGFhYWFhYThQJyBgWThhYWFhYSwgICAgXG4vLyA4OFwiXCJcIlwiXCIgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgODhcIlwiXCJcIlwiICAgICA4OFwiXCJcIlwiODgnICAgICBgXCJcIlwiXCJcIjhiLCAgXG4vLyA4OCAgICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgIDg4ICAgICAgICAgIDg4ICAgIGA4YiAgICAgICAgICAgYDhiICBcbi8vIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgODggICAgICAgICAgODggICAgIGA4YiAgWThhICAgICBhOFAgIFxuLy8gODggICAgICAgICAgODggODg4ODg4ODg4ODggODggICAgICA4ODg4ODg4ODg4OCA4OCAgICAgIGA4YiAgXCJZODg4ODhQXCIgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cbmFwcC5maWx0ZXIoJ29yZGVyT2JqZWN0QnknLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGl0ZW1zLCBmaWVsZCwgcmV2ZXJzZSkge1xuXHR2YXIgZmlsdGVyZWQgPSBbXTtcblx0YW5ndWxhci5mb3JFYWNoKGl0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG5cdGZpbHRlcmVkLnB1c2goaXRlbSk7XG5cdH0pO1xuXHRmaWx0ZXJlZC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdHJldHVybiAoYVtmaWVsZF0gPiBiW2ZpZWxkXSA/IDEgOiAtMSk7XG5cdH0pO1xuXHRpZihyZXZlcnNlKSBmaWx0ZXJlZC5yZXZlcnNlKCk7XG5cdHJldHVybiBmaWx0ZXJlZDtcblx0fTtcbn0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICxhZDg4ODhiYSwgICAsYWQ4ODg4YmEsICAgODg4YiAgICAgIDg4IDg4ODg4ODg4ODg4OCA4ODg4ODg4OGJhICAgICxhZDg4ODhiYSwgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4ODg4ODg4ODg4OCA4ODg4ODg4OGJhICAgYWQ4ODg4OGJhICAgXG4vLyAgZDhcIicgICAgYFwiOGIgZDhcIicgICAgYFwiOGIgIDg4ODhiICAgICA4OCAgICAgIDg4ICAgICAgODggICAgICBcIjhiICBkOFwiJyAgICBgXCI4YiAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICBcIjhiIGQ4XCIgICAgIFwiOGIgIFxuLy8gZDgnICAgICAgICAgIGQ4JyAgICAgICAgYDhiIDg4IGA4YiAgICA4OCAgICAgIDg4ICAgICAgODggICAgICAsOFAgZDgnICAgICAgICBgOGIgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAsOFAgWTgsICAgICAgICAgIFxuLy8gODggICAgICAgICAgIDg4ICAgICAgICAgIDg4IDg4ICBgOGIgICA4OCAgICAgIDg4ICAgICAgODhhYWFhYWE4UCcgODggICAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODhhYWFhYSAgICAgODhhYWFhYWE4UCcgYFk4YWFhYWEsICAgIFxuLy8gODggICAgICAgICAgIDg4ICAgICAgICAgIDg4IDg4ICAgYDhiICA4OCAgICAgIDg4ICAgICAgODhcIlwiXCJcIjg4JyAgIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4XCJcIlwiXCJcIiAgICAgODhcIlwiXCJcIjg4JyAgICAgYFwiXCJcIlwiXCI4YiwgIFxuLy8gWTgsICAgICAgICAgIFk4LCAgICAgICAgLDhQIDg4ICAgIGA4YiA4OCAgICAgIDg4ICAgICAgODggICAgYDhiICAgWTgsICAgICAgICAsOFAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgYDhiICAgICAgICAgICBgOGIgIFxuLy8gIFk4YS4gICAgLmE4UCBZOGEuICAgIC5hOFAgIDg4ICAgICBgODg4OCAgICAgIDg4ICAgICAgODggICAgIGA4YiAgIFk4YS4gICAgLmE4UCAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgIGA4YiAgWThhICAgICBhOFAgIFxuLy8gICBgXCJZODg4OFlcIicgICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4ODggICAgICA4OCAgICAgIDg4ICAgICAgYDhiICAgYFwiWTg4ODhZXCInICAgODg4ODg4ODg4ODggODg4ODg4ODg4ODggODg4ODg4ODg4ODggODggICAgICBgOGIgIFwiWTg4ODg4UFwiICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblxuXG5hcHAuY29udHJvbGxlcignaGVsbG9DdHJsJywgXG5cdFtcblx0XHQnJHNjb3BlJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdGhlbGxvQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcigncG9ydGFsQ3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnTm90ZScsXG5cdFx0J25ld05vdGUnLCBcblx0XHQna2lsbE5vdGUnLFxuXHRcdCduZXdCaXQnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCdBdXRoJyxcblx0XHQnTG9naW4nLFxuXHRcdCdmaXJzdE5vdGUnLFxuXHRcdHBvcnRhbEN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ25vdGVDdHJsJywgXG5cdFtcblx0XHQnJGNvbnRyb2xsZXInLFxuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J05vdGUnLFxuXHRcdCdzaGFyZWROb3RlJyxcblx0XHQnbmV3Tm90ZScsIFxuXHRcdCdraWxsTm90ZScsXG5cdFx0J3NoYXJlTm90ZScsXG5cdFx0J25ld0JpdCcsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckY29va2llcycsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdCdsYXllcmluZycsXG5cdFx0J01ldGEnLFxuXHRcdCdoaXN0b3J5Q291bnQnLFxuXHRcdCdoaXN0b3JpY2FsJyxcblx0XHRub3RlQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignaW5mb0N0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdGluZm9DdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCd0ZXh0Q3RybCcsIFxuXHRbXG5cdFx0JyRzY29wZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsXG5cdFx0J05vdGUnLFxuXHRcdCdzaGFyZWROb3RlJywgXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckdGltZW91dCcsXG5cdFx0dGV4dEN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NoYW5nZUN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J0JvYXJkcycsXG5cdFx0J25ld0JvYXJkJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJHdpbmRvdycsXG5cdFx0JyRjb29raWVzJyxcblx0XHRjaGFuZ2VDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdoaXN0b3J5Q3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnbmV3Qm9hcmQnLFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckd2luZG93Jyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCdIaXN0b3J5Jyxcblx0XHQnTWV0YScsXG5cdFx0aGlzdG9yeUN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2JvYXJkQ3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJywgXG5cdFx0J0JvYXJkJyxcblx0XHQna2lsbEJvYXJkJyxcblx0XHQnTm90ZXMnLFxuXHRcdCdTaGFyZWROb3RlcycsXG5cdFx0J25ld05vdGUnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJGludGVydmFsJyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCdMb2dvdXQnLFxuXHRcdCdjb25jZW50cmljaXR5Jyxcblx0XHQnbGF5ZXJpbmcnLFxuXHRcdCdoaXN0b3J5Q291bnQnLFxuXHRcdGJvYXJkQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignbGlzdEN0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLCBcblx0XHQnTm90ZXMnLFxuXHRcdCdTaGFyZWROb3RlcycsXG5cdFx0J25ld05vdGUnLFxuXHRcdCdraWxsTm90ZScsXG5cdFx0J0JvYXJkcycsXG5cdFx0J25ld0JvYXJkJyxcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyRjb29raWVzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCdMb2dvdXQnLFxuXHRcdCdjb25jZW50cmljaXR5Jyxcblx0XHQnbGF5ZXJpbmcnLFxuXHRcdCdoaXN0b3J5Q291bnQnLFxuXHRcdGxpc3RDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdzaGFyZUN0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnTWV0YScsXG5cdFx0J05vdGUnLFxuXHRcdCdzaGFyZWROb3RlJyxcblx0XHQnc2hhcmVOb3RlJyxcblx0XHQnYWRkVG9TaGFyZWROb3RlJyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHRzaGFyZUN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NvbG9waG9uQ3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJywgXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0Y29sb3Bob25DdHJsXG5cdF1cbik7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdEJvYXJkLFxuXHRraWxsQm9hcmQsXG5cdE5vdGVzLFxuXHRTaGFyZWROb3Rlcyxcblx0bmV3Tm90ZSxcblx0JHJvdXRlUGFyYW1zLCBcblx0JHJvdXRlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JGludGVydmFsLFxuXHQkY29va2llcyxcblx0TG9nb3V0LFxuXHRjb25jZW50cmljaXR5LFxuXHRsYXllcmluZyxcblx0aGlzdG9yeUNvdW50XG4pIHtcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnYm9hcmQnO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKVxuXG4gICAgJHNjb3BlLiR3YXRjaCgnYm9hcmQudGl0bGUnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRpZiAobmV3VmFsdWUpe1xuXHRcdFx0d2luZG93LmRvY3VtZW50LnRpdGxlID0gbmV3VmFsdWUgKyAnIOKAkyAoYm9hcmQpIOKAkyBMSUNLJztcblx0XHR9ZWxzZXtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdVbnRpdGxlZCBCb2FyZCDigJMgTElDSyc7XG5cdFx0fVxuXHR9KTtcblxuXHRCb2FyZCgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnYm9hcmQnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5ib2FyZC5zdGFycmVkKVxuXHRcdFx0XHRcdCRzY29wZS5zdGFyTm90ZSgkc2NvcGUuYm9hcmQuc3RhcnJlZClcblx0XHRcdFx0XG5cdFx0XHRcdGlmICgkc2NvcGUuYm9hcmQudGl0bGUgPT09ICcnKVxuXHRcdFx0XHRcdCQoJy5ib2FyZF90aXRsZSB0ZXh0YXJlYScpLmZvY3VzKClcblx0XHRcdFx0XG5cdFx0XHRcdGlmICghJHNjb3BlLmJvYXJkLmxhc3RFZGl0ZWQpXG5cdFx0XHRcdFx0JHNjb3BlLmJvYXJkLmxhc3RFZGl0ZWQgPSBEYXRlLm5vdygpXG5cdFx0XHR9KVxuXHRcdH0pO1xuXG5cdE5vdGVzKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlcycpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoJHNjb3BlLmJvYXJkLnN0YXJyZWQpXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXJOb3RlKCRzY29wZS5ib2FyZC5zdGFycmVkKVxuXHRcdFx0fSlcblx0XHR9KTtcblxuXHRTaGFyZWROb3Rlcygkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnc2hhcmVkbm90ZXMnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKSB7XG5cblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdFx0c2hhcmVkR2VuZXJhdG9yKFxuXHRcdFx0XHQkc2NvcGUuc2hhcmVkbm90ZXMsIFxuXHRcdFx0XHR3aW5kb3cuZ2V0T2JqZWN0RGVlcFNpemUoJHNjb3BlLnNoYXJlZG5vdGVzKSwgXG5cdFx0XHRcdGZ1bmN0aW9uKHNoYXJlZE5vdGVzKXtcblx0XHRcdFx0XHQkc2NvcGUuc2hhcmVkRmlsdGVyID0gc2hhcmVkTm90ZXM7XG5cdFx0XHRcdH1cblx0XHRcdClcblxuXHRcdH0pO1xuXG5cdHNoYXJlZEdlbmVyYXRvciA9IGZ1bmN0aW9uKG5vdGVzLCBjb3VudCwgY2FsbGJhY2spe1xuXG5cdFx0dmFyIHNoYXJlZCA9IHt9LFxuXHRcdFx0c2hhcmVkQ291bnRlciA9IDA7XG5cblx0XHRhbmd1bGFyLmZvckVhY2gobm90ZXMsIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gJ29iamVjdCcgJiYgISFlKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGUucGFydGljaXBhbnRzLCBmdW5jdGlvbihmLCBsKXtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQobCA9PSB3aW5kb3cudWlkIHx8IGwgPT0gJGNvb2tpZXMuZW1haWxfZXNjYXBlZCkgXG5cdFx0XHRcdFx0XHQmJiAoZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50ID09PSAkcm91dGVQYXJhbXMuaWQpXG5cdFx0XHRcdFx0KXtcblx0XHRcdFx0XHRcdHNoYXJlZFtrXSA9IGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdHNoYXJlZENvdW50ZXIrKztcblx0XHRcdFx0aWYgKHNoYXJlZENvdW50ZXIgPT09IGNvdW50ICYmICEkLmlzRW1wdHlPYmplY3Qoc2hhcmVkKSlcblx0XHRcdFx0XHRjYWxsYmFjayhzaGFyZWQpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cbiAgICAkc2NvcGUuY29uY2VudHJpYyA9IGZ1bmN0aW9uKCl7XG4gICAgXHRjb25jZW50cmljaXR5KCk7XG4gICAgfTtcblxuICAgICRzY29wZS5saWdodGJ1bGIgPSBmdW5jdGlvbigpe1xuICAgIFx0bGF5ZXJpbmcoKTtcbiAgICB9O1xuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnR28gYmFjayB0byBMaXN0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VudGVyJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdG5ld05vdGUoJHNjb3BlLmJvYXJkLmlkKTtcblx0XHRcdH1cblx0XHR9KVxuXG5cblxuXHQkc2NvcGUubmV3Tm90ZSA9IGZ1bmN0aW9uKGJvYXJkSUQpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3Tm90ZShib2FyZElEKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5uZXdCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgbmV3Qm9hcmQoKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5oaXN0b3JpY2FsID0gXy5kZWJvdW5jZShmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5ib2FyZC5sYXN0RWRpdGVkID0gRGF0ZS5ub3coKTtcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHR9KVxuXG5cdFx0Y29uc29sZS5sb2coJ0hJU1RPUklDQUwnKVxuXHR9LCA1MDAwKVxuXG5cdCRzY29wZS5zdGFyTm90ZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0Y29uc29sZS5sb2coaWQpXG5cblx0XHQkKCcuYm9hcmRfbm90ZScpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhhdCA9ICQodGhpcylcblxuXHRcdFx0aWYgKGlkICYmIGlkID09PSAkdGhhdC5hdHRyKCdkYXRhLWlkJykpe1xuXHRcdFx0XHQkdGhhdC5hZGRDbGFzcygnc3RhcnJlZCcpXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JHRoYXQucmVtb3ZlQ2xhc3MoJ3N0YXJyZWQnKVxuXHRcdFx0fVxuXG5cdFx0fSlcblxuXHRcdCRzY29wZS5ib2FyZC5zdGFycmVkID0gaWQ7XG5cdH1cblxuXHR2YXIgaXNFbXB0eSA9IHRydWU7XG5cblx0aXNCb2FyZEVtcHR5ID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoJCgnLmJvYXJkX2JvZHkgdWwgbGknKS5sZW5ndGggPiAwKVxuXHRcdFx0aXNFbXB0eSA9IGZhbHNlO1xuXHRcdGVsc2Vcblx0XHRcdGlzRW1wdHkgPSB0cnVlO1xuXG5cdFx0JHNjb3BlLmJvYXJkSXNFbXB0eSA9IGlzRW1wdHk7XG5cdH07XG5cblx0JHNjb3BlLmtpbGxXYXJuID0gZmFsc2U7XG5cblx0JHNjb3BlLmtpbGxCb2FyZCA9IGZ1bmN0aW9uKGlkKXtcblx0XHRpZiAoJHNjb3BlLmJvYXJkSXNFbXB0eSl7XG5cdFx0XHRraWxsQm9hcmQoaWQpO1xuXHRcdH1lbHNle1xuXHRcdFx0JHNjb3BlLmtpbGxXYXJuID0gdHJ1ZTtcblxuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLmtpbGxXYXJuID0gZmFsc2U7XG5cdFx0XHR9LCAzMDAwKTtcblx0XHR9XG5cdH1cblxuXHRlbXB0eVdhdGNoZXIgPSAkaW50ZXJ2YWwoaXNCb2FyZEVtcHR5LCAxMDAwKTtcblxuXHQkc2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKG5leHQsIGN1cnJlbnQpIHsgXG5cdFx0JGludGVydmFsLmNhbmNlbChlbXB0eVdhdGNoZXIpXG5cdH0pO1xuXG5cdCRzY29wZS5ib2FyZEl0ZW1PcHRzX3ByaXZhdGUgPSB7XG5cdCAgICBzaXplWDogJzEnLFxuXHQgICAgc2l6ZVk6IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gMiA6IDEsXG5cdCAgICByb3c6IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gJ25vdGUueSAqIDInIDogJ25vdGUueScsXG5cdCAgICBjb2w6ICdub3RlLngnXG5cdH07XG5cblx0JHNjb3BlLmJvYXJkSXRlbU9wdHNfc2hhcmVkID0ge1xuXHQgICAgc2l6ZVg6ICcxJyxcblx0ICAgIHNpemVZOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IDIgOiAxLFxuXHQgICAgcm93OiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/ICdub3RlLnBhcnRpY2lwYW50c1tcIicgKyAkY29va2llcy5lbWFpbF9lc2NhcGVkICsgJ1wiXS55ICogMicgOiAnbm90ZS5wYXJ0aWNpcGFudHNbXCInICsgJGNvb2tpZXMuZW1haWxfZXNjYXBlZCArICdcIl0ueScsXG5cdCAgICBjb2w6ICdub3RlLnBhcnRpY2lwYW50c1tcIicgKyAkY29va2llcy5lbWFpbF9lc2NhcGVkICsgJ1wiXS54J1xuXHR9O1xuXG5cdCRzY29wZS5ib2FyZEdyaWRPcHRzID0ge1xuXHQgICAgY29sdW1uczogNSxcblx0ICAgIG1vYmlsZU1vZGVFbmFibGVkOiBmYWxzZSxcblx0ICAgIG1pbkNvbHVtbnM6IDQsXG5cdCAgICBmbG9hdGluZzogZmFsc2UsXG5cdCAgICBzd2FwcGluZzogdHJ1ZSxcblx0ICAgIHB1c2hpbmc6IGZhbHNlLFxuXHQgICAgbWluUm93czogNCxcblx0ICAgIG1heFJvd3M6IDEwLFxuXHQgICAgZGVmYXVsdFNpemVYOiAxLFxuXHQgICAgZGVmYXVsdFNpemVZOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IDIgOiAxLFxuXHQgICAgbWFyZ2luczogWzUsIDVdLFxuXHQgICAgcmVzaXphYmxlOiB7XG5cdCAgICAgICBlbmFibGVkOiBmYWxzZSxcblx0ICAgIH0sXG5cdFx0ZHJhZ2dhYmxlOiB7XG5cdFx0XHQvLyBoYW5kbGU6IHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4ID8gJy5ncmFiYmVyJyA6IG51bGxcblx0XHRcdC8vIGhhbmRsZTogJy5ncmFiYmVyJ1xuXHRcdH1cblx0fTtcblxuXHRoaXN0b3J5Q291bnQoZnVuY3Rpb24odGhlTnVtYmVyKXtcblx0XHQkc2NvcGUuaGlzdG9yeUNvdW50ZXIgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoZU51bWJlcjtcblx0XHR9XG5cdH0pXG5cblx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHRcdExvZ291dCgpO1xuXHR9XG5cblx0JHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnRvZ2dsZUNsYXNzKCdtZW51T3BlbicpO1x0XG5cdH07XG5cblx0JHNjb3BlLmNsb3NlTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS5yZW1vdmVDbGFzcygnbWVudU9wZW4nKTtcdFxuXHR9O1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsXG5cdEJvYXJkcyxcblx0bmV3Qm9hcmQsXG5cdE5vdGUsXG5cdHNoYXJlZE5vdGUsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSxcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JHdpbmRvdyxcblx0JGNvb2tpZXNcbikge1xuXHRcdFxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXG5cdCRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbClcblxuXHRCb2FyZHMoKS4kYmluZFRvKCRzY29wZSwgJ2JvYXJkcycpO1xuXG5cdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdTZW5kIG5vdGUgdG8gYm9hcmQg4oCTIExJQ0snO1xuXG5cdGlmICh3aW5kb3cuaGlzdG9yaWNhbFt3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggLSAyXS5pbmRleE9mKCdzaGFyZWQnKSA+IDApe1xuXHRcdGNvbnNvbGUubG9nKCdTSEFSRUQnKVxuXHRcdHNoYXJlZE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHR9KVxuXHR9ZWxzZXtcblx0XHRjb25zb2xlLmxvZygnUFJJVkFURScpXG5cdFx0Tm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXHRcdH0pXG5cdH1cblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnY2hhbmdlJztcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FoLCBmb3JnZXQgaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmdvQmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1x0XHRcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9zaGFyZWRub3RlLycgKyAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdGVsc2Vcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0fVxuXG5cdCRzY29wZS5jaGFuZ2VCb2FyZCA9IGZ1bmN0aW9uKGJvYXJkKXtcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9IGJvYXJkO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IGJvYXJkO1xuXG5cdFx0JHNjb3BlLmdvQmFjaygpO1xuXHR9O1xuXG5cdCRzY29wZS5uZXdCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG5ld0JvYXJkSUQgPSBuZXdCb2FyZCgpXG5cblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9IG5ld0JvYXJkSUQ7XG5cdFx0ZWxzZVxuXHRcdFx0JHNjb3BlLm5vdGUucGFyZW50ID0gbmV3Qm9hcmRJRDtcblxuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkSUQpO1xuXHR9XG5cblx0JHNjb3BlLm5vQm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdGlmICgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHMpXG5cdFx0XHQkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50ID0gZmFsc2U7XG5cdFx0ZWxzZVxuXHRcdFx0JHNjb3BlLm5vdGUucGFyZW50ID0gbnVsbDtcblxuXHRcdCRzY29wZS5nb0JhY2soKTtcblx0fVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHRob3RrZXlzLFxuXHQkdGltZW91dFxuKSB7XG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG5cdCRzY29wZS5wYWdlQ2xhc3MgPSAnY29sb3Bob24nO1xuXG5cdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdDb2xvcGhvbiDigJMgTElDSyc7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdHbyBiYWNrIHRvIExpc3QnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pXG5cblx0JHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCl7XG5cdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHNjb3BlLFxuXHQkdGltZW91dFxuKSB7XG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pO1xuXG5cdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdMSUNLJztcblx0XG5cdCRzY29wZS5wYWdlQ2xhc3MgPSAnaGVsbG8nO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsXG5cdCRzY29wZSxcblx0bmV3Qm9hcmQsXG5cdCRyb3V0ZSxcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JHdpbmRvdyxcblx0JGNvb2tpZXMsXG5cdEhpc3Rvcnlcbikge1xuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2hpc3RvcnknO1xuXG4gICAgLy8gJHNjb3BlLm1ldGEgPSBNZXRhO1xuXG4gICAgJCgnI21haW4nKS5yZW1vdmVDbGFzcygnbWVudU9wZW4nKTtcdFxuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKTtcblxuICAgIHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdSZWNlbnRseSBlZGl0ZWQgbm90ZXMg4oCTIExJQ0snO1xuXG5cdEhpc3RvcnkoKS4kYmluZFRvKCRzY29wZSwgJ2hpc3RvcnknKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdFx0JHNjb3BlLmhpc3RvcnlTb3J0ZXIgPSBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgbm90ZXMgPSBbXTtcblxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmhpc3RvcnksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZSkgPT09ICdvYmplY3QnICYmICEhZSl7XG5cdFx0XHRcdFx0XHRlLmlkID0gaztcblx0XHRcdFx0XHRcdG5vdGVzLnB1c2goZSk7XHRcblx0XHRcdFx0XHR9IFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gbm90ZXM7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKSBcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnYWgsIGZvcmdldCBpdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0JHNjb3BlLmVkaXRlZE9uID0gZnVuY3Rpb24odGltZSl7XG5cdFx0dmFyIGluY29taW5nID0gbW9tZW50KHRpbWUpO1xuXHRcdHJldHVybiBpbmNvbWluZy5mb3JtYXQoJ0g6bSBkZGQgRG8gTU1NTScpXG5cdH1cblxuXHRoaXN0b3J5Q291bnQgPSAwO1xuXG5cdCRzY29wZS5oaXN0b3J5Q29tcGFyZSA9IGZ1bmN0aW9uKGRldmljZSwgdGltZSl7XG5cdFx0aWYgKFxuXHRcdFx0KGRldmljZSAhPT0gd2luZG93LmRldmljZSkgfHwgXG5cdFx0XHQoIHRpbWUgPCAoIERhdGUubm93KCkgLSAzNjAwMDAwICkgKVxuXHRcdCl7XG5cdFx0XHRoaXN0b3J5Q291bnQrKztcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1lbHNlIHJldHVybiBmYWxzZTtcblx0fVxuXG5cdCRzY29wZS5lZGl0ZWRCeSA9IGZ1bmN0aW9uKGF1dGhvcil7XG5cdFx0cmV0dXJuIHdpbmRvdy5lbWFpbFVuZXNjYXBlcihhdXRob3IpO1xuXHR9XG5cblx0JHNjb3BlLmNsZWFySGlzdG9yeSA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly8gJHNjb3BlLm1ldGEuaGlzdG9yeSA9IHt9O1xuXG5cdFx0Ly8gTWV0YS5cblx0XHRIaXN0b3J5KCkuJHJlbW92ZSgpLnRoZW4oKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ0hJU1RPUlkgQ0xFQVJFRCcpXG5cdFx0fSlcblx0fVxuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdGlmIChoaXN0b3J5Q291bnQgPT09IDApXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKVxuXHRcdGVsc2Vcblx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0XG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXHRcblx0JHNjb3BlLnBhZ2VDbGFzcyA9ICdpbmZvJztcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnSG93IHRvIOKAkyBMSUNLJztcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0dvIGJhY2sgdG8gTGlzdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0JHNjb3BlLnNsaWRlQ291bnQgPSAwO1xuXG5cdCRpbmZvID0gJCgnLmluZm8nKTtcblxuXHQkc2NvcGUuc2xpY2tDb25maWcgPSB7XG5cdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRkb3RzOiB0cnVlLFxuXHRcdGluZmluaXRlOiBmYWxzZSxcblx0XHRldmVudDoge1xuXHRcdFx0YWZ0ZXJDaGFuZ2U6IGZ1bmN0aW9uIChldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKSB7XG5cdFx0XHRcdCRpbmZvLnJlbW92ZUNsYXNzKCdmaXJzdFNsaWRlIGxhc3RTbGlkZScpXG5cdFx0XHRcdGlmIChjdXJyZW50U2xpZGUgPT09IDApe1xuXHRcdFx0XHRcdCRpbmZvLmFkZENsYXNzKCdmaXJzdFNsaWRlJylcblx0XHRcdFx0fWVsc2UgaWYgKGN1cnJlbnRTbGlkZSA9PT0gKCRzY29wZS5zbGlkZUNvdW50IC0gMSkpe1xuXHRcdFx0XHRcdCRpbmZvLmFkZENsYXNzKCdsYXN0U2xpZGUnKVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aW5pdDogZnVuY3Rpb24oc2xpY2spe1xuXHRcdFx0XHQkc2NvcGUuc2xpZGVDb3VudCA9ICQoJy5zbGljay1zbGlkZXIgLnNsaWNrLXNsaWRlJykubGVuZ3RoXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSwgXG5cdE5vdGVzLFxuXHRTaGFyZWROb3Rlcyxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdEJvYXJkcyxcblx0bmV3Qm9hcmQsXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCRsb2NhdGlvbixcblx0JGNvb2tpZXMsXG5cdCR0aW1lb3V0LFxuXHRMb2dvdXQsXG5cdGNvbmNlbnRyaWNpdHksXG5cdGxheWVyaW5nLFxuXHRoaXN0b3J5Q291bnRcbikge1xuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdsaXN0JztcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbCk7XG5cbiAgICB3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnSG9tZSDigJMgTElDSyc7XG5cbiAgICBjb25zb2xlLmxvZygnTElTVCcpXG5cblx0Tm90ZXMoKS4kYmluZFRvKCRzY29wZSwgJ25vdGVzJykudGhlbihmdW5jdGlvbih1bmJpbmRlcikge1xuXG5cdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0JHNjb3BlLnByaXZhdGVGaWx0ZXIgPSBmdW5jdGlvbih0KXtcblxuXHRcdFx0dmFyIG5vdGVzID0gW11cblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKHQsIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1x0XG5cdFx0XHRcdFx0aWYgKCFlLmxhc3RFZGl0ZWQpIGUubGFzdEVkaXRlZCA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0bm90ZXMucHVzaChlKVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIG5vdGVzO1xuXHRcdH1cblx0fSlcblxuXHRCb2FyZHMoKS4kYmluZFRvKCRzY29wZSwgJ2JvYXJkcycpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdCRzY29wZS5ib2FyZHNGaWx0ZXIgPSBmdW5jdGlvbih0KXtcblx0XHRcdFx0dmFyIGJvYXJkcyA9IFtdXG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ib2FyZHMsIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZSkgPT09ICdvYmplY3QnICYmICEhZSl7XHRcblx0XHRcdFx0XHRcdGlmICghZS5sYXN0RWRpdGVkKSBlLmxhc3RFZGl0ZWQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdFx0Ym9hcmRzLnB1c2goZSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiBib2FyZHM7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0U2hhcmVkTm90ZXMoKS4kYmluZFRvKCRzY29wZSwgJ3NoYXJlZG5vdGVzJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcikge1xuXG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdCRzY29wZS5zaGFyZWRGaWx0ZXIgPSBmdW5jdGlvbihlKXtcblxuXHRcdFx0XHR2YXIgc2hhcmVkID0gW107XG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGUsIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZSkgPT09ICdvYmplY3QnICYmICEhZSl7XG5cdFx0XHRcdFx0XHRpZiAoIWUubGFzdEVkaXRlZCkgZS5sYXN0RWRpdGVkID0gRGF0ZS5ub3coKTtcblxuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGUucGFydGljaXBhbnRzLCBmdW5jdGlvbihmLCBsKXtcblx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdChsID09IHdpbmRvdy51aWQgfHwgbCA9PSAkY29va2llcy5lbWFpbF9lc2NhcGVkKSBcblx0XHRcdFx0XHRcdFx0XHQmJiAoIWUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudClcblx0XHRcdFx0XHRcdFx0KXtcblx0XHRcdFx0XHRcdFx0XHRzaGFyZWQucHVzaChlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdCRzY29wZS5zaGFyZWRDb3VudCA9IHNoYXJlZC5sZW5ndGg7XG5cblx0XHRcdFx0cmV0dXJuIHNoYXJlZDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydlc2MnLCAndGFiJywgJ3JpZ2h0JywgJ2xlZnQnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICgkc2NvcGUubG9va2luZ0F0ID09PSAnYm9hcmRzJylcblx0XHRcdFx0XHQkc2NvcGUubG9va2luZ0F0ID0gd2luZG93Lmxpc3RMb29raW5nQXQgPSAnbm90ZXMnO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0ID0gJ2JvYXJkcyc7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblxuICAgICRzY29wZS5jb25jZW50cmljID0gZnVuY3Rpb24oKXtcbiAgICBcdGNvbmNlbnRyaWNpdHkoKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmxpZ2h0YnVsYiA9IGZ1bmN0aW9uKCl7XG4gICAgXHRsYXllcmluZygpO1xuICAgIH07XG5cblx0aWYgKHdpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aCA+IDIgJiYgd2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignYm9hcmQnKSA+IDApXG5cdFx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0ID0gJ2JvYXJkcyc7XG5cblx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0O1xuXG5cdCRzY29wZS4kd2F0Y2goJ2xvb2tpbmdBdCcsIGZ1bmN0aW9uKCl7XG5cdFx0JCgnYm9keScpLnNjcm9sbFRvcCgwKVxuXHRcdHdpbmRvdy5saXN0TG9va2luZ0F0ID0gJHNjb3BlLmxvb2tpbmdBdDtcblx0fSk7XG5cblx0aGlzdG9yeUNvdW50KGZ1bmN0aW9uKHRoZU51bWJlcil7XG5cdFx0JHNjb3BlLmhpc3RvcnlDb3VudGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGVOdW1iZXI7XG5cdFx0fVxuXHR9KVxuXG5cdCRzY29wZS5uZXdOb3RlID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld05vdGUoKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5uZXdCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgbmV3Qm9hcmQoKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5raWxsTm90ZSA9IGZ1bmN0aW9uKGlkKXtcblx0XHRraWxsTm90ZShpZCk7XG5cdH1cblxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHRMb2dvdXQoKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH1cblxuXHQkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykudG9nZ2xlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VNZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnJlbW92ZUNsYXNzKCdtZW51T3BlbicpO1x0XG5cdH07XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JGNvbnRyb2xsZXIsXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHRuZXdOb3RlLFxuXHRraWxsTm90ZSxcblx0c2hhcmVOb3RlLFxuXHRuZXdCaXQsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRjb29raWVzLFxuXHRMb2dvdXQsXG5cdGNvbmNlbnRyaWNpdHksXG5cdGxheWVyaW5nLFxuXHRNZXRhLFxuXHRoaXN0b3J5Q291bnQsXG5cdGhpc3RvcmljYWxcbikge1xuXG5cdGNvbnNvbGUubG9nKCdOT1RFJylcblxuXHQkc2NvcGUudG91Y2h5ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gd2luZG93LmlzX3RvdWNoX2RldmljZSgpO1xuXHR9XG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG5cdHZhciBzaG93aW5nQ2hlYXRzaGVldCA9IGZhbHNlO1xuXHRcblx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSBmYWxzZTtcblx0JHNjb3BlLmFsdElzUHJlc3NlZCA9IGZhbHNlO1xuXHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gZmFsc2U7XG4gICAgJHNjb3BlLnNoYXJlUHJvbXB0ID0gZmFsc2U7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdub3RlJztcblxuICAgICRzY29wZS5maWx0ZXJlZCA9IGZhbHNlO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKTtcblxuICAgICRzY29wZS4kd2F0Y2goJ25vdGUudGl0bGUnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRpZiAobmV3VmFsdWUpe1xuXHRcdFx0d2luZG93LmRvY3VtZW50LnRpdGxlID0gbmV3VmFsdWUgKyAnIOKAkyAobm90ZSkg4oCTIExJQ0snO1xuXHRcdH1lbHNle1xuXHRcdFx0d2luZG93LmRvY3VtZW50LnRpdGxlID0gJ1VudGl0bGVkIE5vdGUg4oCTIExJQ0snO1xuXHRcdH1cblx0fSk7XG5cbiAgICB2YXIga2V5c1VwID0gZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUuY29tbWFuZElzUHJlc3NlZCA9IGZhbHNlO1xuXHRcdCRzY29wZS5hbHRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuICAgIH1cblxuICAgICQod2luZG93KS5vbih7XG4gICAgXHRibHVyOiBrZXlzVXAsXG4gICAgXHRmb2N1czoga2V5c1VwXG4gICAgfSk7XG5cbiAgICAkc2NvcGUuY29uY2VudHJpYyA9IGZ1bmN0aW9uKCl7XG4gICAgXHRjb25jZW50cmljaXR5KCk7XG4gICAgfTtcblxuICAgICRzY29wZS5saWdodGJ1bGIgPSBmdW5jdGlvbigpe1xuICAgIFx0bGF5ZXJpbmcoKTtcbiAgICB9O1xuXG4gICAgaWYgKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblxuICAgIFx0c2hhcmVkTm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcikge1xuXHRcdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0XHRcdCRzY29wZS5vbk5vdGVPcGVuKCk7XG5cdFx0XHR9KTtcblxuICAgIH1lbHNle1xuXHRcdE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblx0XHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHRcdGlmICh0eXBlb2YoJHNjb3BlLm5vdGUuYm9keSkgPT09ICd1bmRlZmluZWQnKXtcblx0XHRcdFx0XHRuZXdOb3RlKCcnLCAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCRzY29wZS5vbk5vdGVPcGVuKCk7XG5cdFx0XHR9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUub25Ob3RlT3BlbiA9IGZ1bmN0aW9uKCl7XG4gICAgXHQkc2NvcGUuY2xvc2VCaXRNZW51cygpO1xuICAgIFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcbiAgICBcdCRzY29wZS5ub3RlLmtpbGwgPSBmYWxzZTtcblxuICAgIFx0aWYgKCRzY29wZS5ub3RlLnRpdGxlID09PSAnJylcbiAgICBcdFx0JCgnLm5vdGVfdGl0bGUgdGV4dGFyZWEnKS5mb2N1cygpXG4gICAgfVxuXG4gICAgTWV0YSgpLiRiaW5kVG8oJHNjb3BlLCAnbWV0YScpXG4gICAgXHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG4gICAgXHR9KVxuXG4gICAgJHNjb3BlLnNoYXJlQWN0aXZlID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICgkbG9jYXRpb24ucGF0aCgpLmluZGV4T2YoJ3NoYXJlZCcpID4gMClcbiAgICBcdFx0cmV0dXJuIHRydWVcbiAgICBcdGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG5cblx0Ly8gY29uc29sZS5sb2coJHNjb3BlLnVwbG9hZGVyKVxuXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4OCAgICAgICAgODggICAsYWQ4ODg4YmEsIDg4ODg4ODg4ODg4OCA4OCAgICAgIGE4UCAgODg4ODg4ODg4ODggOGIgICAgICAgIGQ4IGFkODg4ODhiYSAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCAgZDhcIicgICAgYFwiOGIgICAgIDg4ICAgICAgODggICAgLDg4JyAgIDg4ICAgICAgICAgICBZOCwgICAgLDhQIGQ4XCIgICAgIFwiOGIgIFxuXHQvLyBcdDg4ICAgICAgICA4OCBkOCcgICAgICAgIGA4YiAgICA4OCAgICAgIDg4ICAsODhcIiAgICAgODggICAgICAgICAgICBZOCwgICw4UCAgWTgsICAgICAgICAgIFxuXHQvLyBcdDg4YWFhYWFhYWE4OCA4OCAgICAgICAgICA4OCAgICA4OCAgICAgIDg4LGQ4OCcgICAgICA4OGFhYWFhICAgICAgICBcIjhhYThcIiAgIGBZOGFhYWFhLCAgICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCJcIlwiXCI4OCA4OCAgICAgICAgICA4OCAgICA4OCAgICAgIDg4ODhcIjg4LCAgICAgODhcIlwiXCJcIlwiICAgICAgICAgYDg4JyAgICAgIGBcIlwiXCJcIlwiOGIsICBcblx0Ly8gXHQ4OCAgICAgICAgODggWTgsICAgICAgICAsOFAgICAgODggICAgICA4OFAgICBZOGIgICAgODggICAgICAgICAgICAgICA4OCAgICAgICAgICAgICBgOGIgIFxuXHQvLyBcdDg4ICAgICAgICA4OCAgWThhLiAgICAuYThQICAgICA4OCAgICAgIDg4ICAgICBcIjg4LCAgODggICAgICAgICAgICAgICA4OCAgICAgWThhICAgICBhOFAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCAgIGBcIlk4ODg4WVwiJyAgICAgIDg4ICAgICAgODggICAgICAgWThiIDg4ODg4ODg4ODg4ICAgICAgODggICAgICBcIlk4ODg4OFBcIiAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJz8nLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2FsdCcsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0hvbGQgZG93biB0byBlZGl0IHBhc3RlZCBsaW5rcycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnQUxUX0RPV04nKVxuXHRcdFx0XHQkc2NvcGUuYWx0SXNQcmVzc2VkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdhbHQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleXVwJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdBTFRfVVAnKVxuXHRcdFx0XHQkc2NvcGUuYWx0SXNQcmVzc2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQnLCAnY3RybCddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdIb2xkIGRvd24gdG8gc2VsZWN0IGJpdHMnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kJywgJ2N0cmwnXSxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXl1cCcsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuY29tbWFuZElzUHJlc3NlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydlbnRlcicsICdzaGlmdCtlbnRlciddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhZGQgbmV3IGJpdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblxuXHRcdFx0XHRcdCRzY29wZS51bnNlbGVjdG9yKCk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdGlmIChfaXNCaXQoKSl7XG5cdFx0XHRcdFx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uY29udGVudCAhPT0gJycpe1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUuYWRkQml0KCBfYml0SW5kZXgoKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoX2JpdEluZGV4KCkgIT09IDApe1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXAgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS50YWJDb3VudCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRfZm9jdXNNZSgwKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtlbnRlcicsICdjdHJsK2VudGVyJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FkZCBhIGxpdHRsZSBzcGFjZSBhYm92ZSB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGJpdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpICYmIF9pc0JpdCgpKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXAgPSAhJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uZ2FwO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdiYWNrc3BhY2UnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggXG5cdFx0XHRcdFx0X2lzVGV4dGFyZWEoKSAmJiBcblx0XHRcdFx0XHQoJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uY29udGVudCA9PT0gJycpXG5cdFx0XHRcdCl7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50ID4gMCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS50YWJDb3VudC0tO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXApe1xuXHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uZ2FwID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHQkc2NvcGUua2lsbEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2JhY2tzcGFjZScsICdjdHJsK2JhY2tzcGFjZSddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgRGVsZXRlIHRoaXMgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgKXtcblx0XHRcdFx0XHQkc2NvcGUua2lsbEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrc2hpZnQrYmFja3NwYWNlJywgJ2N0cmwrc2hpZnQrYmFja3NwYWNlJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0RlbGV0ZSB0aGlzIG5vdGUnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmtpbGwgJiYgJHNjb3BlLmtpbGxOb3RlKCk7IFxuXHRcdFx0XHQkc2NvcGUubm90ZS5raWxsID0gISRzY29wZS5ub3RlLmtpbGw7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ3RhYicsICdjb21tYW5kK10nLCAnY3RybCtdJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBJbmRlbnQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgX2lzQml0KCkgKXtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudGFiSW4oayk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQkc2NvcGUudGFiSW4oX2JpdEluZGV4KCkpO1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9ZWxzZSBpZiAoIF9pc1RleHRhcmVhKCkgKVxuXHRcdFx0XHRcdF9mb2N1c01lKDApO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydzaGlmdCt0YWInLCAnY29tbWFuZCtbJywgJ2N0cmwrWyddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgT3V0ZGVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSAmJiBfaXNCaXQoKSApe1xuXHRcdFx0XHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS50YWJPdXQoayk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQkc2NvcGUudGFiT3V0KF9iaXRJbmRleCgpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK3NoaWZ0K2QnLCAnY3RybCtzaGlmdCtkJ10sXG5cdFx0XHQvLyBkZXNjcmlwdGlvbjogJ0R1cGxpY2F0ZSBjdXJyZW50bHkgc2VsZWN0ZWQgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXHRcdFx0XHRcdGlmIChfaXNCaXQoKSl7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0JHNjb3BlLmFkZEJpdCggX2JpdEluZGV4KCksICRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmNvbnRlbnQgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsndXAnLCAnZG93biddLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGV2ZW50LCBldmVudC5rZXlDb2RlKVxuXHRcdFx0XHRcdCRzY29wZS51bnNlbGVjdG9yKCk7XG5cdFx0XHRcdFx0JHNjb3BlLmNhcmV0VHJhY2tlcihfYml0SW5kZXgoKSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCRzY29wZS5qdW1wQXJvdW5kKF9iaXRJbmRleCgpLCBldmVudC5rZXlDb2RlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXHRcdFxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdzaGlmdCt1cCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpIC0gMV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRfZm9jdXNNZShfYml0SW5kZXgoKSAtIDEpO1xuXHRcdFx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gdHJ1ZTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdzaGlmdCtkb3duJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCkgKyAxXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdF9mb2N1c01lKF9iaXRJbmRleCgpICsgMSk7XG5cdFx0XHRcdCRzY29wZS5zZWxlY3RlZEJpdHMgPSB0cnVlO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjdHJsK3VwJywgJ2N0cmwrZG93biddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdRdWlja2x5IGp1bXAgYmV0d2VlbiBiaXRzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHQkc2NvcGUuanVtcEFyb3VuZChfYml0SW5kZXgoKSwgZXZlbnQua2V5Q29kZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjdHJsK2NvbW1hbmQrdXAnLCAnY3RybCthbHQrdXAnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIFN3YXAgYml0IHVwJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0JHNjb3BlLm1vdmVVcChfYml0SW5kZXgoKSk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2N0cmwrY29tbWFuZCtkb3duJywgJ2N0cmwrYWx0K3VwJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBTd2FwIGJpdCBkb3duJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0JHNjb3BlLm1vdmVEb3duKF9iaXRJbmRleCgpKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnc2hpZnQgKyAnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnTmV3IG5vdGUnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld05vdGUoKSk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrc2hpZnQrYScsICdjdHJsK3NoaWZ0K2EnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnU2VsZWN0IGFsbCBiaXRzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtrXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IHRydWU7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC8vIGlmICggIV9pc1RleHRTZWxlY3RlZCgkKGV2ZW50LnRhcmdldClbMF0pICl7XG5cdFx0XHRcdC8vIH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCt4JywgJ2N0cmwreCddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdDdXQgc2VsZWN0ZWQgYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCAhX2lzVGV4dFNlbGVjdGVkKCQoZXZlbnQudGFyZ2V0KVswXSkgKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0JHNjb3BlLmN1dCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2MnLCAnY3RybCtjJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0NvcHkgc2VsZWN0ZWQgYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCAhX2lzVGV4dFNlbGVjdGVkKCQoZXZlbnQudGFyZ2V0KVswXSkgKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdFx0JHNjb3BlLmN1dChmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCt2JywgJ2N0cmwrdiddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdQYXN0ZSBjdXQgYml0cyAob3IganVzdCBwYXN0ZSB0aGUgY29udGVudHMgb2YgeW91ciBjbGlwYm9hcmQpJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cuY2xpcGJvYXJkZWQpXG5cdFx0XHRcdGlmICh3aW5kb3cuY2xpcGJvYXJkZWQpe1xuXHRcdFx0XHRcdCRzY29wZS5wYXN0ZSgpO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5wYXJzZVBhc3RlZChfYml0SW5kZXgoKSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQgc2hpZnQnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgVG9nZ2xlIHRoaXMgYml0IGFzIG1hcmtlZCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXHRcdFx0XHRcdC8vICRzY29wZS51bnNlbGVjdG9yKCk7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLm1hcmsoayk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHQkc2NvcGUubWFyayhfYml0SW5kZXgoKSlcblx0XHRcdFx0XHRcdC8vICRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1hcmsgPSAhJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0ubWFyaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY3RybCtzaGlmdCBjdHJsK3NoaWZ0JywgJ2NvbW1hbmQrc2hpZnQgY29tbWFuZCtzaGlmdCddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdUb2dnbGUgdGhpcyBub3RlIGFzIG1hcmtlZCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkc2NvcGUubm90ZS5tYXJrID0gISRzY29wZS5ub3RlLm1hcms7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnQ2xvc2Ugbm90ZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cdFx0XHRcdFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChzaG93aW5nQ2hlYXRzaGVldCl7XG5cdFx0XHRcdFx0c2hvd2luZ0NoZWF0c2hlZXQgPSBmYWxzZTtcblx0XHRcdFx0XHRob3RrZXlzLnRvZ2dsZUNoZWF0U2hlZXQoKTtcblx0XHRcdFx0Ly8gfWVsc2UgaWYgKCRzY29wZS5zaGFyZVByb21wdCl7XG5cdFx0XHRcdC8vIFx0JHNjb3BlLnNoYXJlUHJvbXB0ID0gZmFsc2U7XHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5jbG9zZU5vdGUoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdhbHQrc2hpZnQrLycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1Nob3cgdGhpcyBoYW5keSBndWlkZSA6KScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHNob3dpbmdDaGVhdHNoZWV0ID0gIXNob3dpbmdDaGVhdHNoZWV0O1xuXHRcdFx0XHRob3RrZXlzLnRvZ2dsZUNoZWF0U2hlZXQoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ODg4ODg4ODg4IDg4ICAgICAgICA4OCA4ODhiICAgICAgODggICAsYWQ4ODg4YmEsIDg4ODg4ODg4ODg4OCA4OCAgICxhZDg4ODhiYSwgICA4ODhiICAgICAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4ODg4YiAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgODg4OGIgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICA4OCAgICAgICAgODggODggYDhiICAgIDg4IGQ4JyAgICAgICAgICAgICAgIDg4ICAgICAgODggZDgnICAgICAgICBgOGIgODggYDhiICAgIDg4ICBcblx0Ly8gXHQ4OGFhYWFhICAgICA4OCAgICAgICAgODggODggIGA4YiAgIDg4IDg4ICAgICAgICAgICAgICAgIDg4ICAgICAgODggODggICAgICAgICAgODggODggIGA4YiAgIDg4ICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICA4OCA4OCAgIGA4YiAgODggODggICAgICAgICAgICAgICAgODggICAgICA4OCA4OCAgICAgICAgICA4OCA4OCAgIGA4YiAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4OCAgICBgOGIgODggWTgsICAgICAgICAgICAgICAgODggICAgICA4OCBZOCwgICAgICAgICw4UCA4OCAgICBgOGIgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIFk4YS4gICAgLmE4UCA4OCAgICAgYDg4ODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgWThhLiAgICAuYThQICA4OCAgICAgYDg4ODggIFxuXHQvLyBcdDg4ICAgICAgICAgICBgXCJZODg4OFlcIicgIDg4ICAgICAgYDg4OCAgIGBcIlk4ODg4WVwiJyAgICAgIDg4ICAgICAgODggICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4ODggIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdCRzY29wZS5hZGRCaXQgPSBmdW5jdGlvbihpbmRleCwgY29udGVudCl7XG5cdFx0dmFyIGluY29taW5nQ29udGVudDtcblxuXHRcdGlmICh0eXBlb2YoY29udGVudCkgPT09ICd1bmRlZmluZWQnKVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gJyc7XG5cdFx0ZWxzZVxuXHRcdFx0aW5jb21pbmdDb250ZW50ID0gY29udGVudDtcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCArIDEsIDAsIG5ld0JpdChcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQsXG5cdFx0XHRcdGluY29taW5nQ29udGVudFxuXHRcdFx0KSk7XG5cblx0XHRcdCRzY29wZS5wYXJzZUxpbmsoaW5kZXgpO1xuXG5cdFx0XHRfZm9jdXNNZShpbmRleCArIDEpO1xuXHRcdH0sIDUwKTtcblx0fTtcblxuXHQkc2NvcGUucGFyc2VQYXN0ZWQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdC8vIHNwbGl0IGF0IGxpbmUgYnJlYWtzXG5cdFx0XHR2YXIgdGhlQ29udGVudCA9ICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQuc3BsaXQoJ1xcbicpLFxuXHRcdFx0XHR0b1JlbW92ZSA9IFtdO1xuXG5cdFx0XHQvLyByZW1vdmUgZW1wdHkgbGluZXNcblx0XHRcdGZvciAodmFyIGwgPSAwOyBsIDwgdGhlQ29udGVudC5sZW5ndGg7IGwrKyl7XG5cdFx0XHRcdGlmICghdGhlQ29udGVudFtsXSlcblx0XHRcdFx0XHR0b1JlbW92ZS5wdXNoKGwpXG5cdFx0XHR9XG5cblx0XHRcdGZvciAodmFyIHIgPSB0b1JlbW92ZS5sZW5ndGggLSAxOyByID49IDAgOyByLS0pe1xuXHRcdFx0XHR0aGVDb250ZW50LnNwbGljZSh0b1JlbW92ZVtyXSwgMSlcblx0XHRcdH1cblxuXHRcdFx0Ly8gc2V0IGJsb2NrIHRvIGVtcHR5IGJlZm9yZSByZXBsYWNpbmcgdy8gMXN0IGxpbmVcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQgPSAnJztcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQgPSB0aGVDb250ZW50WzBdO1xuXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSAnJztcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IHRoZUNvbnRlbnRbMF07XG5cblx0XHRcdCRzY29wZS5wYXJzZUxpbmsoaW5kZXgpO1xuXG5cdFx0XHRmb3IgKHZhciBsID0gMTsgbCA8IHRoZUNvbnRlbnQubGVuZ3RoOyBsKyspe1xuXHRcdFx0XHQkc2NvcGUuYWRkQml0KGluZGV4ICsgKGwgLSAxKSwgdGhlQ29udGVudFtsXSk7XG5cdFx0XHR9XG5cdFx0fSwgNTApOyBcblx0fVxuXG5cdCRzY29wZS5wYXJzZUxpbmsgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0dmFyIGNvbnRlbnQgPSAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50O1xuXG5cdFx0aWYgKFxuXHRcdFx0Y29udGVudC5pbmRleE9mKFwiaHR0cDovL1wiKSA9PT0gMCB8fFxuXHRcdFx0Y29udGVudC5pbmRleE9mKFwiaHR0cHM6Ly9cIikgPT09IDAgXG5cdFx0KXtcdFx0XHRcblx0XHRcdGNvbnNvbGUubG9nKCdPSCBOT0VTIEEgTElOSycpXG5cblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHRcdGRhdGFUeXBlOidKU09OUCcsXG5cdFx0XHRcdGRhdGE6e1xuXHRcdFx0XHRcdFVSTDogY29udGVudFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR1cmw6IFwiaHR0cDovL3JlLmplY3QuY2gvdHJhL3BocC90aXRsZS5waHBcIlxuXHRcdFx0fSkuZG9uZSggZnVuY3Rpb24odGhlVGl0bGUpe1xuXHRcdFx0XHR2YXIgZXNjYXBlZFRpdGxlID0gXy51bmVzY2FwZSh0aGVUaXRsZS50aXRsZSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVzY2FwZWRUaXRsZSlcblxuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gZXNjYXBlZFRpdGxlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSBlc2NhcGVkVGl0bGU7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmFkZHJlc3MgPSBjb250ZW50O1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5pc0xpbmsgPSB0cnVlO1xuXG5cdFx0XHRcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cblx0JHNjb3BlLm9wZW5MaW5rID0gZnVuY3Rpb24oYml0LCBldmVudCl7XG5cdFx0aWYgKGJpdC5pc0xpbmsgJiYgISRzY29wZS5hbHRJc1ByZXNzZWQpe1xuXHRcdFx0dmFyIHdpbjtcblx0XHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXG5cdFx0XHRpZiAod2luZG93LmlzTW9iaWxlQXBwKXtcblx0XHRcdFx0d2luID0gY29yZG92YS5JbkFwcEJyb3dzZXIub3BlbihiaXQuYWRkcmVzcywgJ19zeXN0ZW0nKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHR3aW4gPSB3aW5kb3cub3BlbihiaXQuYWRkcmVzcywgJ19ibGFuaycpO1xuXHRcdFx0XHR3aW4uZm9jdXMoKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQkc2NvcGUua2lsbEJpdCA9IGZ1bmN0aW9uKGluZGV4KXtcblxuXHRcdGNvbnNvbGUubG9nKGluZGV4KVxuXG5cdFx0aWYgKGluZGV4KVxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uc2VsZWN0ZWQgPSB0cnVlO1xuXG5cdFx0dmFyIHRlbXBCb2R5ID0gW107XG5cdFx0YW5ndWxhci5jb3B5KCRzY29wZS5ub3RlLmJvZHksIHRlbXBCb2R5KTtcblxuXHRcdGFuZ3VsYXIuZm9yRWFjaCh0ZW1wQm9keS5yZXZlcnNlKCksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXHRcdFx0XHR2YXIgcmV2ZXJzZVRhcmdldCA9IE1hdGguYWJzKHRlbXBCb2R5Lmxlbmd0aCAtIGspIC0gMTtcblxuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKHJldmVyc2VUYXJnZXQsIDEpO1xuXHRcdFx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKCRzY29wZS5ub3RlLmJvZHkubGVuZ3RoID4gMCl7XG5cdFx0XHRfZm9jdXNNZShpbmRleCAtIDEpXG5cdFx0fWVsc2V7XG5cdFx0XHRhZGRCaXQoMCk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5tb3ZlVXAgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dmFyIHRoaXNCaXQgPSAkc2NvcGUubm90ZS5ib2R5LnNwbGljZShrLCAxKVswXTtcblx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGsgLSAxLCAwLCB0aGlzQml0KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoX2JpdEluZGV4KCksIDEpWzBdO1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXggLSAxLCAwLCB0aGlzQml0KTtcblx0XHRcdF9mb2N1c01lKGluZGV4IC0gMSk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5tb3ZlRG93biA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cdFx0XHR2YXIgYm9keUNvcHkgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5vdGUuYm9keSk7XG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChib2R5Q29weS5yZXZlcnNlKCksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0dmFyIHJldmVyc2VUYXJnZXQgPSBNYXRoLmFicyhib2R5Q29weS5sZW5ndGggLSBrKSAtIDE7XG5cdFx0XHRcdFx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKHJldmVyc2VUYXJnZXQsIDEpWzBdO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UocmV2ZXJzZVRhcmdldCArIDEsIDAsIHRoaXNCaXQpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHRoaXNCaXQgPSAkc2NvcGUubm90ZS5ib2R5LnNwbGljZShfYml0SW5kZXgoKSwgMSlbMF07XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCArIDEsIDAsIHRoaXNCaXQpO1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggKyAxKTtcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLnRhYk91dCA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQgPiAwKXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50LS07XG5cdFx0fWVsc2V7XG5cdFx0XHRfZm9jdXNNZShpbmRleCAtIDEpO1xuXHRcdH1cblxuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OClcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHR9XG5cblx0JHNjb3BlLnRhYkluID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdGlmICgkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudCA8IDQpe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQrKztcblx0XHR9ZWxzZXtcblx0XHRcdF9mb2N1c01lKGluZGV4ICsgMSk7XG5cdFx0fVxuXG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4KVxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuID0gZmFsc2U7XG5cdH1cblxuXHQkc2NvcGUuY2FyZXRUcmFja2VyID0gZnVuY3Rpb24oaW5kZXgsIGNhbGxiYWNrKXtcblx0XHR2YXIgdGhlQml0ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCxcblx0XHRcdGN1cnJlbnRDYXJldCA9IHRoZUJpdC5zZWxlY3Rpb25TdGFydCxcblx0XHRcdHRoZVZhbHVlID0gdGhlQml0LnZhbHVlO1xuXG5cdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gXG5cdFx0XHR0aGVWYWx1ZS5zdWJzdHJpbmcoMCwgY3VycmVudENhcmV0KSArIFxuXHRcdFx0JzxzcGFuIGNsYXNzPVwiaGlkZGVuQ2FyZXRcIj48L3NwYW4+JyArIFxuXHRcdFx0dGhlVmFsdWUuc3Vic3RyaW5nKGN1cnJlbnRDYXJldCwgdGhlVmFsdWUubGVuZ3RoKVxuXG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcpIGNhbGxiYWNrKCk7XG5cdFx0fSlcblx0fVxuXG5cdCRzY29wZS5hdXRvU2l6ZXIgPSBmdW5jdGlvbihpbmRleCwgZXZlbnQsIGNvbnRlbnQpe1xuXHRcdGlmIChldmVudC5rZXlDb2RlICE9PSAxMyl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSBjb250ZW50O1xuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5kZWJvdW5jZUhpc3RvcmljYWwgPSBfLmRlYm91bmNlKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG5vdyA9IERhdGUubm93KCk7XG5cblx0XHRpZiAoISRzY29wZS5tZXRhLmhpc3RvcnkpXG5cdFx0XHQkc2NvcGUubWV0YS5oaXN0b3J5ID0ge307XG5cblx0XHQkc2NvcGUubm90ZS5sYXN0RWRpdGVkID0gbm93O1xuXG5cdFx0aGlzdG9yaWNhbChcblx0XHRcdG5vdywgXG5cdFx0XHQkc2NvcGUubm90ZSwgXG5cdFx0XHQkc2NvcGUuc2hhcmVBY3RpdmUoKSwgXG5cdFx0XHRmdW5jdGlvbigpe1xuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdCk7XG5cdH0sIDUwMDApXG5cblx0JHNjb3BlLmhpc3RvcmljYWxfdHJpZ2dlciA9ICRzY29wZS5kZWJvdW5jZUhpc3RvcmljYWw7XG5cblxuXHQkc2NvcGUuanVtcEFyb3VuZCA9IGZ1bmN0aW9uKGluZGV4LCBrZXksIGp1c3Rnbyl7XG5cblx0XHQvLyBjb25zb2xlLmxvZyhpbmRleCwga2V5LCBqdXN0Z28pXG5cdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsIGtleSwganVzdGdvKVxuXHRcdHZhciAkdGhlQml0ID0gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSxcblx0XHRcdCR0aGVDYXJldCA9ICR0aGVCaXQuc2libGluZ3MoJy50ZXh0YXJlYS1hdXRvc2l6ZScpLmZpbmQoJy5oaWRkZW5DYXJldCcpLFxuXHRcdFx0dGhlQ2FyZXRQb3MgPSAkdGhlQ2FyZXQucG9zaXRpb24oKS50b3AsXG5cdFx0XHR0aGVDYXJldEhlaWdodCA9IDIzO1xuXG5cdFx0Ly8gY29uc29sZS5sb2codGhlQ2FyZXRQb3MsIHRoZUNhcmV0SGVpZ2h0LCB0aGVDYXJldFBvcyA8IHRoZUNhcmV0SGVpZ2h0IC0gMSlcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdCAgICdDQVJFVFBPUyArIDQnLCB0aGVDYXJldFBvcyArIDQsXG5cdFx0XHQnLy8gQ0FSRVRIRUlHSFQnLCB0aGVDYXJldEhlaWdodCxcblx0XHRcdCcvLyBPVVRFUkhFSUdIVCcsICR0aGVDYXJldC5wYXJlbnQoKS5vdXRlckhlaWdodCh0cnVlKSxcblx0XHRcdCcvLyBDQVJFVEhFSUdIVCAtIE9VVEVSSEVJR0hUJywgKCR0aGVDYXJldC5wYXJlbnQoKS5vdXRlckhlaWdodCh0cnVlKSAtICh0aGVDYXJldEhlaWdodCkpLFxuXHRcdFx0Jy8vIENBUkVUUE9TID49IENBUkVUSEVJR0hUIC0gT1VURVJIRUlHSFQnLCB0aGVDYXJldFBvcyArIDQgPj0gKCR0aGVDYXJldC5wYXJlbnQoKS5vdXRlckhlaWdodCh0cnVlKSAtICh0aGVDYXJldEhlaWdodCkpXG5cdFx0KTtcblxuXHRcdGlmICggXG5cdFx0XHQoXG5cdFx0XHRcdChrZXkgPT09IDM4KSAmJiBcblx0XHRcdFx0KHRoZUNhcmV0UG9zIDwgdGhlQ2FyZXRIZWlnaHQgLSAxKSBcblx0XHRcdCl8fChcblx0XHRcdFx0KGtleSA9PT0gMzgpICYmIFxuXHRcdFx0XHRqdXN0Z29cblx0XHRcdClcblx0XHQpe1xuXHRcdFx0Y29uc29sZS5sb2coJ1VQJylcblx0XHRcdCR0aGVCaXQucGFyZW50cygnLm5vdGVfYml0Jylcblx0XHRcdFx0LnByZXYoJy5ub3RlX2JpdCcpLmZpbmQoJ3RleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKClcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQoXG5cdFx0XHRcdChrZXkgPT09IDQwKSAmJiBcblx0XHRcdFx0KCh0aGVDYXJldFBvcyArIDQpID49ICgkdGhlQ2FyZXQucGFyZW50KCkub3V0ZXJIZWlnaHQodHJ1ZSkgLSB0aGVDYXJldEhlaWdodCkpIFxuXHRcdFx0KXx8KFxuXHRcdFx0XHQoa2V5ID09PSA0MCkgJiYgXG5cdFx0XHRcdGp1c3Rnb1xuXHRcdFx0KVxuXHRcdCl7XG5cdFx0XHRjb25zb2xlLmxvZygnRE9XTicpXG5cdFx0XHQkdGhlQml0LnBhcmVudHMoJy5ub3RlX2JpdCcpXG5cdFx0XHRcdC5uZXh0KCcubm90ZV9iaXQnKS5maW5kKCd0ZXh0YXJlYScpXG5cdFx0XHRcdC5mb2N1cygpXG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KGtleSA9PT0gNDApICYmXG5cdFx0XHQoaW5kZXggPT09ICRzY29wZS5ub3RlLmJvZHkubGVuZ3RoIC0gMSlcblx0XHQpe1xuXHRcdFx0JHNjb3BlLmFkZEJpdChpbmRleCk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5tYXJrID0gZnVuY3Rpb24oaW5kZXgsIG9wdGlvbmFsKXtcblx0XHQvLyBjb25zb2xlLmxvZyhpbmRleCwgJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWFyaywgJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuLCBvcHRpb25hbClcblxuXHRcdGlmICgob3B0aW9uYWwgJiYgd2luZG93LmlubmVyV2lkdGggPCA3NjgpIHx8ICFvcHRpb25hbCl7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tYXJrID0gISRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcms7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHRcdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhpbmRleCwgJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWFyaywgJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuKVxuXHRcdFx0fSlcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLnNlYXJjaCA9IGZ1bmN0aW9uKGNvbnRlbnQsIGluZGVudCwgaW5kZXgpe1xuXHRcdGNvbnNvbGUubG9nKGNvbnRlbnQsIGluZGVudCwgaW5kZXgpXG5cdFx0aWYgKGluZGVudCA+IDApe1xuXHRcdFx0cXVlcnkgPSAkc2NvcGUubm90ZS5ib2R5W2luZGV4IC0gMV0uY29udGVudCArICcgJyArIGNvbnRlbnQ7XG5cdFx0fWVsc2V7XG5cdFx0XHRxdWVyeSA9IGNvbnRlbnQ7XG5cdFx0fVxuXG5cdFx0dmFyIHdpbiA9IHdpbmRvdy5vcGVuKCdodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPScgKyBxdWVyeSwgJ19ibGFuaycpO1xuXHQgICAgd2luLmZvY3VzKCk7IFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZUJpdE1lbnVzID0gZnVuY3Rpb24oZXhjZXB0KXtcblx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRpZiAodHlwZW9mKGUubWVudV9vcGVuKSAhPT0gJ3VuZGVmaW5lZCcgJiYgZS5iaXRJRCAhPT0gZXhjZXB0KVxuXHRcdFx0XHRlLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9O1xuXG5cdCRzY29wZS50b2dnbGVCaXRNZW51ID0gZnVuY3Rpb24oaW5kZXgsIGV2ZW50KXtcblx0XHRpZiAoISRzY29wZS5jb21tYW5kSXNQcmVzc2VkKXtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1lbHNle1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0JHNjb3BlLmNsb3NlQml0TWVudXMoJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uYml0SUQpO1xuXG5cdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuID0gISRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbjtcblxuXHRcdGlmICgkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4pe1xuXHRcdFx0JHNjb3BlLm1lbnVpbmcgPSB0cnVlO1xuXHRcdH1lbHNle1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLm1lbnVpbmcgPSBmYWxzZTtcdFx0XHRcblx0XHRcdH0sIDMwMClcblx0XHR9XG5cdH1cblxuXG5cdHZhciBpbnNlcnRJbmRleDtcblxuXHQkc2NvcGUuc2VsZWN0b3IgPSBmdW5jdGlvbihpbmRleCwgZXZlbnQpe1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGlmICgkc2NvcGUuY29tbWFuZElzUHJlc3NlZCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5zZWxlY3RlZCA9ICEkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5zZWxlY3RlZDtcblx0XHRcdCRzY29wZS5zZWxlY3RlZEJpdHMgPSB0cnVlO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0XHRpbnNlcnRJbmRleCA9IF9iaXRJbmRleCgpO1xuXHR9XG5cblx0JHNjb3BlLnVuc2VsZWN0b3IgPSBmdW5jdGlvbihleGNlcHQpe1xuXHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGUuc2VsZWN0ZWQgPSBmYWxzZTtcblx0XHRcdGUubWVudV9vcGVuID0gZmFsc2U7XG5cdFx0fSk7XG5cdFx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IGZhbHNlO1xuXHR9O1xuXG5cblx0JHNjb3BlLmN1dCA9IGZ1bmN0aW9uKGtpbGwpe1xuXHRcdHdpbmRvdy5jbGlwYm9hcmQgPSBbXTtcblxuXHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0d2luZG93LmNsaXBib2FyZC5wdXNoKGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKGtpbGwpXG5cdFx0XHQkc2NvcGUua2lsbEJpdCgpO1xuXG5cdFx0d2luZG93LmNsaXBib2FyZGVkID0gdHJ1ZTsgXG5cdH07XG5cblx0JHNjb3BlLnBhc3RlID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZyh3aW5kb3cuY2xpcGJvYXJkKVxuXHRcdGFuZ3VsYXIuZm9yRWFjaCh3aW5kb3cuY2xpcGJvYXJkLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKChpbnNlcnRJbmRleCArIGspICsgMSwgMCwgZSlcblx0XHR9KTtcblxuXHRcdCRzY29wZS51bnNlbGVjdG9yKCk7XG5cdFx0d2luZG93LmNsaXBib2FyZCA9IFtdO1xuXHRcdHdpbmRvdy5jbGlwYm9hcmRlZCA9IGZhbHNlO1xuXHR9O1xuXG5cdCRzY29wZS5pc0ZvY3VzZWQgPSBmdW5jdGlvbihkZWNpc2lvbil7XG5cdFx0aWYgKGRlY2lzaW9uKXtcblx0XHRcdCRzY29wZS5mb2N1c2VkID0gdHJ1ZTtcblx0XHR9ZWxzZXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5mb2N1c2VkID0gZmFsc2U7XG5cdFx0XHR9LCA1MCk7XG5cdFx0fVxuXHR9XG5cblx0JHNjb3BlLnN3aXBlID0gZnVuY3Rpb24oaW5kZXgsIGRpcmVjdGlvbil7XG5cdFx0aWYgKCRzY29wZS5ub0VkaXQpe1xuXHRcdFx0JHNjb3BlLm1hcmsoaW5kZXgsIHRydWUpO1xuXHRcdH1lbHNlIGlmICghX2lzVGV4dFNlbGVjdGVkKCQoZXZlbnQudGFyZ2V0KVswXSkpe1xuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ2xlZnQnKXtcblx0XHRcdFx0JHNjb3BlLnRhYk91dChpbmRleCk7XHRcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jyl7XG5cdFx0XHRcdCRzY29wZS50YWJJbihpbmRleCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ODhiICAgICAgICAgICBkODggODg4ODg4ODg4ODggODg4YiAgICAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODg4YiAgICAgICAgIGQ4ODggODggICAgICAgICAgODg4OGIgICAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODhgOGIgICAgICAgZDgnODggODggICAgICAgICAgODggYDhiICAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggYDhiICAgICBkOCcgODggODhhYWFhYSAgICAgODggIGA4YiAgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggIGA4YiAgIGQ4JyAgODggODhcIlwiXCJcIlwiICAgICA4OCAgIGA4YiAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgIGA4YiBkOCcgICA4OCA4OCAgICAgICAgICA4OCAgICBgOGIgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICBgODg4JyAgICA4OCA4OCAgICAgICAgICA4OCAgICAgYDg4ODggWThhLiAgICAuYThQICBcblx0Ly8gXHQ4OCAgICAgYDgnICAgICA4OCA4ODg4ODg4ODg4OCA4OCAgICAgIGA4ODggIGBcIlk4ODg4WVwiJyAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgIFxuXG5cdCRzY29wZS5uZXdOb3RlID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgbmV3SUQgPSBuZXdOb3RlKCRzY29wZS5ub3RlLnBhcmVudCk7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ub3RlLycgKyBuZXdJRCk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5raWxsTm90ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0a2lsbE5vdGUoJHNjb3BlLm5vdGUuaWQsICRzY29wZS5ub3RlLnBhcmVudCk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5zaG93Q2hlYXRTaGVldCA9IGZ1bmN0aW9uKCl7XG5cdFx0aG90a2V5cy50b2dnbGVDaGVhdFNoZWV0KClcblx0fTtcblxuXHQkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykudG9nZ2xlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VNZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnJlbW92ZUNsYXNzKCdtZW51T3BlbicpO1x0XG5cdH07XG5cblx0JHNjb3BlLmNsb3NlTm90ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcmVudClcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArICRzY29wZS5ub3RlLnBhcmVudClcblx0XHRlbHNlIGlmICgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHMpe1xuXHRcdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQpXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArICRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0fTtcblxuXHQkc2NvcGUuc2hhcmVQcm9tcHRlciA9IGZ1bmN0aW9uKGRpcmVjdGlvbil7XG5cdFx0JHNjb3BlLnNoYXJlUHJvbXB0ID0gZGlyZWN0aW9uO1xuXHR9XG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4ODg4ODg4ODg4OCA4OCAgICAgICAgICA4ODg4ODg4OGJhICA4ODg4ODg4ODg4OCA4ODg4ODg4OGJhICAgYWQ4ODg4OGJhICAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgXCI4YiA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgZDhcIiAgICAgXCI4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgLDhQIDg4ICAgICAgICAgIDg4ICAgICAgLDhQIFk4LCAgICAgICAgICBcblx0Ly8gXHQ4OGFhYWFhYWFhODggODhhYWFhYSAgICAgODggICAgICAgICAgODhhYWFhYWE4UCcgODhhYWFhYSAgICAgODhhYWFhYWE4UCcgYFk4YWFhYWEsICAgIFxuXHQvLyBcdDg4XCJcIlwiXCJcIlwiXCJcIjg4IDg4XCJcIlwiXCJcIiAgICAgODggICAgICAgICAgODhcIlwiXCJcIlwiXCInICAgODhcIlwiXCJcIlwiICAgICA4OFwiXCJcIlwiODgnICAgICBgXCJcIlwiXCJcIjhiLCAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgIGA4YiAgICAgICAgICAgYDhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgIGA4YiAgWThhICAgICBhOFAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4OCAgICAgICAgICA4ODg4ODg4ODg4OCA4OCAgICAgIGA4YiAgXCJZODg4ODhQXCIgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0dmFyIF9pc1RleHRhcmVhID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50eXBlID09PSAndGV4dGFyZWEnO1xuXHR9LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdF9pc0JpdCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xhc3NOYW1lLmluZGV4T2YoJ21vdXNldHJhcCcpID4gLTE7XG5cdH0sXG5cblx0X2JpdEluZGV4ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5wYXJlbnRzKCcubm90ZV9iaXQnKS5pbmRleCgpO1xuXHR9LFxuXG5cdF9mb2N1c01lID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCQoJy5ub3RlX2JvZHknKVxuXHRcdFx0XHQuZmluZCgnLm5vdGVfYml0OmVxKCcgKyAoaW5kZXgpICsgJykgdGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKTtcblx0XHR9KTtcblx0fSxcblxuXHRfaXNUZXh0U2VsZWN0ZWQgPSBmdW5jdGlvbihpbnB1dCl7XG5cdFx0dmFyIHN0YXJ0UG9zID0gaW5wdXQuc2VsZWN0aW9uU3RhcnQ7XG5cdFx0dmFyIGVuZFBvcyA9IGlucHV0LnNlbGVjdGlvbkVuZDtcblx0XHR2YXIgZG9jID0gZG9jdW1lbnQuc2VsZWN0aW9uO1xuXG5cdFx0aWYoZG9jICYmIGRvYy5jcmVhdGVSYW5nZSgpLnRleHQubGVuZ3RoICE9IDApe1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fWVsc2UgaWYgKCFkb2MgJiYgaW5wdXQudmFsdWUuc3Vic3RyaW5nKHN0YXJ0UG9zLCBlbmRQb3MpLmxlbmd0aCAhPSAwKXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0JHNjb3BlLnNvcnRhYmxlT3B0aW9uc19ub3RlID0ge1xuXHRcdGhhbmRsZTogJz4gLmJpdF9hbmNob3InLFxuXHRcdGF4aXM6ICd5Jyxcblx0XHRzY3JvbGw6IHRydWUsXG5cdFx0aGVscGVyOiAnY2xvbmUnLFxuXHRcdC8vIHN0YXJ0OiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG5cdFx0Ly8gICAgJCh0aGlzKS5hdHRyKCdzdGFydGluZ1Njcm9sbFRvcCcsIHdpbmRvdy5wYWdlWU9mZnNldCk7XG5cdFx0Ly8gfSxcblx0XHQvLyBkcmFnOiBmdW5jdGlvbihldmVudCx1aSl7XG5cdFx0Ly8gICAgdmFyIHN0ID0gcGFyc2VJbnQoJCh0aGlzKS5hdHRyKCdzdGFydGluZ1Njcm9sbFRvcCcpKTtcblx0XHQvLyAgICB1aS5wb3NpdGlvbi50b3AgLT0gc3Q7XG5cdFx0Ly8gfSxcblx0XHQndWktZmxvYXRpbmcnOiB0cnVlXG5cdH07XG5cblx0aGlzdG9yeUNvdW50KGZ1bmN0aW9uKHRoZU51bWJlcil7XG5cdFx0JHNjb3BlLmhpc3RvcnlDb3VudGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGVOdW1iZXI7XG5cdFx0fVxuXHR9KVxuXG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0XHRMb2dvdXQoKTtcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHROb3RlLFxuXHRuZXdOb3RlLFxuXHRraWxsTm90ZSxcblx0bmV3Qml0LFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsIFxuXHRob3RrZXlzLFxuXHQkdGltZW91dCxcblx0JGxvY2F0aW9uLFxuXHQkY29va2llcyxcblx0QXV0aCxcblx0TG9naW4sXG5cdGZpcnN0Tm90ZVxuKSB7XG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG4gICAgJHNjb3BlLmF1dGggPSBBdXRoO1xuXG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwb3J0YWwnO1xuICAgICRzY29wZS52aWV3aW5nID0gJ3NpZ25Jbic7XG4gICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuICAgIGlmICh3aW5kb3cubG9nZ2VkSW4pXG5cdCAgICAkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblxuXHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdXZWxjb21lIOKAkyBMSUNLJztcblxuICAgICRzY29wZS5zaWduX3VwID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdFx0JHNjb3BlLmF1dGguJGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZChcblx0XHRcdFx0JHNjb3BlLnNpZ25VcF9pbnB1dC5lbWFpbCxcblx0XHRcdFx0JHNjb3BlLnNpZ25VcF9pbnB1dC5wYXNzd29yZFxuXHRcdFx0KS50aGVuKGZ1bmN0aW9uKHVzZXJEYXRhKSB7XG5cblx0XHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZygnbmV3IHVzZXIgXCInICsgdXNlckRhdGEudWlkICsgJ1wiIGNyZWF0ZWQhJyk7XG5cblx0XHRcdFx0d2luZG93LnVpZCA9IHVzZXJEYXRhLnVpZDtcblxuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdExvZ2luKCRzY29wZS5zaWduVXBfaW5wdXQuZW1haWwsICRzY29wZS5zaWduVXBfaW5wdXQucGFzc3dvcmQsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRmaXJzdE5vdGUoKTtcblx0XHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pXG5cblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdH0pO1xuICAgIH1cblxuICAgICRzY29wZS5zaWduX2luID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICBcdExvZ2luKCRzY29wZS5zaWduSW5faW5wdXQuZW1haWwsICRzY29wZS5zaWduSW5faW5wdXQucGFzc3dvcmQsIFxuICAgIFx0XHRmdW5jdGlvbigpe1xuXHQgICAgXHRcdCRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cdCAgICBcdFx0aWYgKCF3aW5kb3cucmVzZXR0aW5nUGFzc3dvcmQpXG5cdFx0ICAgIFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHQgICAgXHRlbHNle1xuXHRcdCAgICBcdFx0JHNjb3BlLnZpZXdpbmcgPSAncHdjaGFuZ2UnO1xuXHRcdCAgICBcdH1cblx0ICAgIFx0fSxcblx0ICAgIFx0ZnVuY3Rpb24oKXtcblx0ICAgIFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXHQgICAgXHRcdC8vICRzY29wZS5zaWduSW5faW5wdXQuZW1haWwgPSAnJztcblx0ICAgIFx0XHQkc2NvcGUuc2lnbkluX2lucHV0LnBhc3N3b3JkID0gJyc7XG5cdCAgICBcdH1cbiAgICBcdCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLm5ld1BXID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdFx0Ly8gJHNjb3BlLmF1dGguJGNoYW5nZVBhc3N3b3JkKHtcblx0XHRcdC8vIFx0ZW1haWw6ICRzY29wZS5zaWduSW5faW5wdXQuZW1haWwsXG5cdFx0XHQvLyBcdG9sZFBhc3N3b3JkOiAkc2NvcGUuc2lnbkluX2lucHV0LnBhc3N3b3JkLFxuXHRcdFx0Ly8gXHRuZXdQYXNzd29yZDogJHNjb3BlLnJlc2V0X2lucHV0LnBhc3N3b3JkXG5cdFx0XHQvLyB9KVxuXG5cdFx0XHQkc2NvcGUuYXV0aC4kY2hhbmdlUGFzc3dvcmQoXG5cdFx0XHRcdCRzY29wZS5yZXNldF9pbnB1dC5wYXNzd29yZFxuXHRcdFx0KS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHR3aW5kb3cucmVzZXR0aW5nUGFzc3dvcmQgPSBmYWxzZTtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHRcdGFsZXJ0KCdZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIHJlc2V0LlxcblxcbkRvblxcJ3Qgd29ycnksIGl0IGhhcHBlbnMgdG8gZXZlcnlvbmUhIDopJylcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIsIGVycm9yKTtcblx0XHRcdH0pO1xuICAgIH1cblxuICAgICRzY29wZS5wd1Jlc2V0ID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIFx0aWYgKCEkc2NvcGUuc2lnbkluLiRwcmlzdGluZSAmJiAkc2NvcGUuc2lnbkluLiR2YWxpZCl7XG5cdFx0XHQkc2NvcGUuYXV0aC4kcmVzZXRQYXNzd29yZCh7XG5cdFx0XHRcdGVtYWlsOiAkc2NvcGUuc2lnbkluX2lucHV0LmVtYWlsXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0XHR3aW5kb3cucmVzZXR0aW5nUGFzc3dvcmQgPSB0cnVlO1xuXHRcdFx0XHRhbGVydCgnT2theSFcXG5cXG5HbyBjaGVjayB5b3VyIGVtYWlsLCB3ZSBqdXN0IHNlbnQgeW91IGEgdGVtcG9yYXJ5IHBhc3N3b3JkLiBcXG5cXG5HbyBnZXQgaXQgdGhlcmUsIGxvZ2luIHdpdGggdGhhdCwgYW5kIHdlXFwnbGwgY2hhbmdlIHlvdXIgcGFzc3dvcmQgd2hlbiB5b3UgZ2V0IGJhY2shJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQYXNzd29yZCByZXNldCBlbWFpbCBzZW50IHN1Y2Nlc3NmdWxseSEnKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogXCIsIGVycm9yKTtcblx0XHRcdH0pO1xuICAgIFx0fWVsc2V7XG4gICAgXHRcdGFsZXJ0KCdPdSBuZWkhXFxuXFxuUHV0IHlvdXIgZW1haWwgaW4sIGFuZCBjbGljayB0aGUgXFwnRm9yZ290IHlvdXIgcGFzc3dvcmQ/XFwnIGJ1dHRvbiBhZ2Fpbi4nKVxuICAgIFx0fVxuICAgIH1cblxuICAgICRzY29wZS5lbnRlcldhdGNoID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIFx0aWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKXtcbiAgICBcdFx0aWYgKCRzY29wZS52aWV3aW5nID09PSAnc2lnblVwJykgJHNjb3BlLnNpZ25fdXAoKTtcbiAgICBcdFx0ZWxzZSBpZiAoJHNjb3BlLnZpZXdpbmcgPT09ICdzaWduSW4nKSAkc2NvcGUuc2lnbl9pbigpO1xuICAgIFx0XHRlbHNlIGlmICgkc2NvcGUudmlld2luZyA9PT0gJ3B3Y2hhbmdlJykgJHNjb3BlLm5ld1BXKCk7XG4gICAgXHR9XG4gICAgfTtcbn1cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkc2NvcGUsXG5cdGhvdGtleXMsXG5cdE1ldGEsXG5cdE5vdGUsXG5cdHNoYXJlZE5vdGUsXG5cdHNoYXJlTm90ZSxcblx0YWRkVG9TaGFyZWROb3RlLFxuXHQkcm91dGVQYXJhbXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb25cbikge1xuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnc2hhcmUnO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKTtcblxuICAgIHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdTaGFyZSBub3RlIOKAkyBMSUNLJztcblxuXHRNZXRhKCkuJGJpbmRUbygkc2NvcGUsICdtZXRhJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yKClcblx0XHR9KVxuXG5cdHZhciBzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSxcblx0XHR1bmJpbmRlcixcbiAgICBcdHNoYXJlU291cmNlID0gZnVuY3Rpb24oKXtcblxuICAgIFx0XHRpZiAodHlwZW9mKHVuYmluZGVyKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgXHRcdFx0dW5iaW5kZXIoKTtcblxuICAgIFx0XHRpZiAoISRzY29wZS5pc1NoYXJlZCl7XG5cdFx0XHRcdGlmICh3aW5kb3cuaGlzdG9yaWNhbFt3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggLSAyXS5pbmRleE9mKCdzaGFyZWQnKSA+IDApXG5cdFx0XHRcdFx0JHNjb3BlLmlzU2hhcmVkID0gdHJ1ZTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5pc1NoYXJlZCA9IGZhbHNlO1xuICAgIFx0XHR9XG5cblx0XHRcdGlmICgkc2NvcGUuaXNTaGFyZWQpe1xuXHRcdFx0XHQvLyBzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSA9IGZhbHNlO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU0hBUkVEJylcblx0XHRcdFx0c2hhcmVkTm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXHRcdFx0XHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXHRcdFx0XHRcdFx0JHNjb3BlLnJldHVybkFkZHJlc3MgPSAnL3NoYXJlZG5vdGUvJyArICRzY29wZS5ub3RlLmlkO1xuXHRcdFx0XHRcdFx0c2hhcmVkVXNlckdlbmVyYXRvcihmYWxzZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSA9IHRydWU7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdQUklWQVQnKVxuXHRcdFx0XHROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbih1bmJpbmQpe1xuXHRcdFx0XHRcdFx0dW5iaW5kZXIgPSB1bmJpbmQ7XG5cdFx0XHRcdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kKVxuXHRcdFx0XHRcdFx0JHNjb3BlLnJldHVybkFkZHJlc3MgPSAnL25vdGUvJyArICRzY29wZS5ub3RlLmlkO1xuXHRcdFx0XHRcdFx0c2hhcmVkVXNlckdlbmVyYXRvcih0cnVlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0c2hhcmVkVXNlckdlbmVyYXRvciA9IGZ1bmN0aW9uKGFscmVhZHlTaGFyZWQpe1xuXHRcdFx0aWYgKHNoYXJlZFVzZXJHZW5lcmF0b3JHYXRlKXtcblxuXHRcdFx0XHRwYXJ0aWNpcGFudHNHZW5lcmF0b3IoKTtcblxuXHRcdFx0XHR2YXIgdXNlcnMgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1ldGEuc2hhcmVkVXNlcnMpLFxuXHRcdFx0XHRcdHVuaXF1ZVVzZXJzID0gXy51bmlxKHVzZXJzKTtcblxuXHRcdFx0XHRpZihhbHJlYWR5U2hhcmVkKVxuXHRcdFx0XHRcdHZhciBwYXJ0aWNpcGFudHMgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm1ldGEuc2hhcmVkVXNlcnMpXG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHVuaXF1ZVVzZXJzLCBmdW5jdGlvbih2LCBrKXtcblx0XHRcdFx0XHRpZiAoYWxyZWFkeVNoYXJlZCl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2gocGFydGljaXBhbnRzLCBmdW5jdGlvbih2diwga2spe1xuXHRcdFx0XHRcdFx0XHRpZiAod2luZG93LmVtYWlsVW5lc2NhcGVyKGtrKSA9PT0gdilcblx0XHRcdFx0XHRcdFx0XHRkZWxldGUgdW5pcXVlVXNlcnNba11cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHYgPT09IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwpXG5cdFx0XHRcdFx0XHRkZWxldGUgdW5pcXVlVXNlcnNba11cblx0XHRcdFx0fSlcblxuXHRcdFx0XHQkc2NvcGUuc2hhcmVkVXNlckZpbHRlciA9IHVuaXF1ZVVzZXJzO1xuXHRcdFx0fVxuXG5cdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSA9IHRydWU7XG5cdFx0fSxcblxuXHRcdHBhcnRpY2lwYW50c0dlbmVyYXRvciA9IGZ1bmN0aW9uKCl7XG5cblx0XHRcdHZhciBfcGFydGljaXBhbnRzID0gYW5ndWxhci5jb3B5KCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKF9wYXJ0aWNpcGFudHMsIGZ1bmN0aW9uKHYsIGspe1xuXHRcdFx0XHRpZiAoayA9PT0gd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbF9lc2NhcGVkKVxuXHRcdFx0XHRcdGRlbGV0ZSBfcGFydGljaXBhbnRzW2tdO1xuXHRcdFx0fSlcblxuXHRcdFx0JHNjb3BlLm5vdGVQYXJ0aWNpcGFudHMgPSBfcGFydGljaXBhbnRzO1xuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0c2hhcmVTb3VyY2UoKTtcblxuXHQkc2NvcGUuc2hhcmVVc2VyID0gZnVuY3Rpb24odGFyZ2V0KXtcblx0XHRpZiAoJHNjb3BlLmlzU2hhcmVkKXtcblx0XHRcdGFkZFRvU2hhcmVkTm90ZShcblx0XHRcdFx0JHNjb3BlLm5vdGUuaWQsIFxuXHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdHBhcnRpY2lwYW50c0dlbmVyYXRvclxuXHRcdFx0KTtcblx0XHR9ZWxzZXtcblx0XHRcdHNoYXJlTm90ZShcblx0XHRcdFx0JHNjb3BlLm5vdGUuaWQsIFxuXHRcdFx0XHR0YXJnZXQsIFxuXHRcdFx0XHRmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUuaXNTaGFyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0c2hhcmVTb3VyY2UoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUucmVtb3ZlVXNlciA9IGZ1bmN0aW9uKHRhcmdldCl7XG5cdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24odiwgayl7XG5cdFx0XHRjb25zb2xlLmxvZyh2LCBrKVxuXHRcdFx0aWYgKHRhcmdldCA9PT0gaylcblx0XHRcdFx0ZGVsZXRlICRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1trXTtcblx0XHR9KVxuXG5cdFx0cGFydGljaXBhbnRzR2VuZXJhdG9yKCk7XG5cdH1cblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpIFxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhaCwgZm9yZ2V0IGl0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZW50ZXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5zaGFyZVVzZXIoJHNjb3BlLnNoYXJlVGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCgkc2NvcGUucmV0dXJuQWRkcmVzcyk7XG5cdH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkc2NvcGUsXG5cdCRyb3V0ZVBhcmFtcyxcblx0Tm90ZSxcblx0c2hhcmVkTm90ZSxcblx0aG90a2V5cyxcblx0JGxvY2F0aW9uLFxuXHQkdGltZW91dFxuKSB7IFxuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cblx0JHNjb3BlLnBhZ2VDbGFzcyA9ICd0ZXh0JztcblxuXHQkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpXG5cblxuXHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKVxuXHRcdHNoYXJlZE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKTtcblx0ZWxzZSB7XG5cdFx0Tm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpLnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5vdGUpXG5cblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdUZXh0IHZpZXdlciBmb3InICsgJHNjb3BlLm5vdGUudGl0bGUgKyAnIOKAkyBMSUNLJztcblx0XHR9KTtcdFx0XG5cdH1cblxuXHRcblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmNsb3NlVGV4dCgpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cblxuXHQkc2NvcGUuY2xvc2VUZXh0ID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCh3aW5kb3cubG9jYWxTdG9yYWdlLmhpc3RvcmljYWxfbGFzdCk7XG5cblx0XHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvc2hhcmVkbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHR9ZWxzZXtcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykudG9nZ2xlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcbn0iLCIkKGZ1bmN0aW9uKCkge1xuXG5cdC8vIEZFQVRVUkUgVEVTVFNcblxuXHR2YXIgX3Byb3BlcnR5Q2FjaGUgPSB7fTtcdFxuXG5cdGV4cG9ydHMuc3VwcG9ydHNTdmcgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIV9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnKXtcblx0XHRcdHZhciByZXN1bHQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZVwiLCBcIjEuMVwiKTtcblx0XHRcdF9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnID0gcmVzdWx0O1xuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5zdXBwb3J0c1N2Zztcblx0fTsgXG5cblx0ZXhwb3J0cy5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgPSBmdW5jdGlvbigpe1xuXHRcdGlmICghX3Byb3BlcnR5Q2FjaGUubWVkaWFRdWVyaWVzU3VwcG9ydGVkKXtcblxuXHRcdFx0dmFyIGdldFRlc3RlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVkaWF0ZXN0XCIpLFxuXHRcdFx0XHRib29sO1xuXG5cdFx0XHRpZiAoIWdldFRlc3Rlcil7XG5cdFx0XHRcdHZhciBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGQuaWQgPSBcIm1lZGlhdGVzdFwiO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO1xuXHRcdFx0XHRib29sID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHZhciBkID0gZ2V0VGVzdGVyO1xuXG5cdFx0XHRpZiAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGQpLnBvc2l0aW9uID09IFwiYWJzb2x1dGVcIiApXG5cdFx0XHRcdGJvb2wgPSB0cnVlO1xuXG5cdFx0XHRfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgPSBib29sO1xuXG5cdFx0XHRyZXR1cm4gYm9vbDtcblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gX3Byb3BlcnR5Q2FjaGUubWVkaWFRdWVyaWVzU3VwcG9ydGVkO1xuXHR9OyBcblxuXHRleHBvcnRzLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCFfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQpe1xuXHRcdFx0dmFyIHJlc3VsdCA9ICgnYmFja2dyb3VuZFNpemUnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSk7XG5cdFx0XHRfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQgPSByZXN1bHQ7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQ7XG5cdH07XG5cdFxuXG5cdC8vIFVUSUxJVElFU1xuXG5cdGV4cG9ydHMubWFwX3JhbmdlID0gZnVuY3Rpb24odmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xuXHQgICAgcmV0dXJuIChsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpKS50b0ZpeGVkKDIpO1xuXHR9XG5cblx0ZXhwb3J0cy5yYW5kb21JbnQgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuXHQgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG5cdH1cblxuXHRleHBvcnRzLnNjcm9sbFRvSGVyZSA9IGZ1bmN0aW9uKHdoZXJlLCBleHRyYSl7XG5cdFx0aWYgKCFleHRyYSkgZXh0cmEgPSAwO1xuXHRcdFxuXHRcdHZhciB0YXJnZXQgPSAkKHdoZXJlKS5vZmZzZXQoKS50b3A7XG5cblx0XHQvLyBkZWZpbmUgaG93IGxhcmdlIHlvdXIgc3RpY2t5IGhlYWRlciBpcyBoZXJlIVxuXHRcdGlmICh3aW5kb3cubWVkaWFRdWVyeS5nZXRRdWVyeSgpID09PSAnbW9iaWxlJykgdGFyZ2V0IC09IDU1O1xuXG5cdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRzY3JvbGxUb3A6IHRhcmdldCArIGV4dHJhXG5cdFx0fSwgNTAwKTtcblx0fTsgXG5cblx0ZXhwb3J0cy5wYWdlU2V0dXAgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN1YnNjcmliZXJzID0gW10sXG5cdFx0XHRpc1NldFVwID0gZmFsc2U7XG5cblx0XHRmdW5jdGlvbiBva2F5Z28oKXtcblx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRzdWJzY3JpYmVyc1ttZXRob2RdKCk7XG5cdFx0XHR9XG5cdFx0XHRpc1NldFVwID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cblx0XHRcdGlzU2V0VXAgJiYgb2theWdvKCk7XG5cdFx0fVxuXG5cdFx0Ly8gUmV0dXJuYWwgIFxuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0b2theWdvOiBva2F5Z28sXG5cdFx0XHRzdWJzY3JpYmU6IHN1YnNjcmliZVxuXHRcdH07XG5cdH0pKCk7IFxuXG5cdGV4cG9ydHMuZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcblx0XHR2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBsYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aW1lc3RhbXA7XG5cblx0XHRcdGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID4gMCkge1xuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdFx0XHRpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHR0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdFx0aWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0XHRpZiAoY2FsbE5vdykge1xuXHRcdFx0XHRyZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0XHRjb250ZXh0ID0gYXJncyA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0fTsgXG5cblx0ZXhwb3J0cy5tZWRpYVF1ZXJ5ID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdWJzY3JpYmVycyA9IFtdLFxuXHRcdFx0bWVkaWFDdXJyZW50LFxuXHRcdFx0bWVkaWFQcmV2LFxuXHRcdFx0JHdpbmRvdyA9ICQod2luZG93KSxcblx0XHRcdCRodG1sID0gJCgnaHRtbCcpO1xuXG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlKCl7XG5cdFx0XHR2YXIgaW5uZXJXaWR0aCA9ICR3aW5kb3cuaW5uZXJXaWR0aCgpLFxuXHRcdFx0XHRpbm5lckhlaWdodCA9ICR3aW5kb3cuaW5uZXJIZWlnaHQoKTtcblxuXHRcdFx0aWYgKCBpbm5lcldpZHRoIDwgNzY4ICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdtb2JpbGUnXG5cdFx0XHRlbHNlIGlmICggKCBpbm5lcldpZHRoID49IDc2OCkgJiYgKCBpbm5lcldpZHRoIDwgOTkyICkgKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ3RhYmxldCdcblx0XHRcdGVsc2UgaWYgKCAoIGlubmVyV2lkdGggPj0gOTkyICkgJiYgKCBpbm5lcldpZHRoIDwgMTIwMCApICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdkZXNrdG9wJ1xuXHRcdFx0ZWxzZSBpZiAoIGlubmVyV2lkdGggPj0gMTIwMCApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAnbGFyZ2VfZGVza3RvcCdcblxuXHRcdFx0aWYgKCBpbm5lckhlaWdodCA8IDc0MCApXG5cdFx0XHRcdG1lZGlhQ3VycmVudCArPSAnIHNob3J0J1xuXG5cdFx0XHRpZiAoIG1lZGlhQ3VycmVudCAhPT0gbWVkaWFQcmV2ICl7XG5cdFx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRcdHN1YnNjcmliZXJzW21ldGhvZF0obWVkaWFDdXJyZW50KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghZXhwb3J0cy5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQoKSlcblx0XHRcdFx0XHQkaHRtbC5yZW1vdmVDbGFzcyhtZWRpYVByZXYpLmFkZENsYXNzKG1lZGlhQ3VycmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdG1lZGlhUHJldiA9IG1lZGlhQ3VycmVudDsgXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3Vic2NyaWJlKG1ldGhvZCkge1xuXHRcdFx0c3Vic2NyaWJlcnMucHVzaChtZXRob2QpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRRdWVyeSgpe1xuXHRcdFx0cmV0dXJuIG1lZGlhQ3VycmVudDtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gaXMocXVlcnkpe1xuXHRcdFx0cmV0dXJuIG1lZGlhQ3VycmVudC5pbmRleE9mKHF1ZXJ5KSA+PSAwO1xuXHRcdH07XG5cblx0XHR2YXIgY2FsY3VsYXRlRGVib3VuY2UgPSBleHBvcnRzLmRlYm91bmNlKGNhbGN1bGF0ZSwgMjAwKTsgXG5cblx0XHQkd2luZG93LnJlc2l6ZShjYWxjdWxhdGVEZWJvdW5jZSk7XG5cblx0XHQvLyBjYWxjdWxhdGUoKTtcblx0XHRcblx0XHQvLyAkd2luZG93LmxvYWQoY2FsY3VsYXRlKTtcblxuXHRcdC8vIGV4cG9ydHMucGFnZVNldHVwLnN1YnNjcmliZShjYWxjdWxhdGUpO1xuXG5cdFx0Ly8gUmV0dXJuYWxcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlLFxuXHRcdFx0Z2V0UXVlcnk6IGdldFF1ZXJ5LFxuXHRcdFx0aXM6IGlzXG5cdFx0fTtcblx0fSkoKTsgXG5cblx0ZXhwb3J0cy5nTWFwTG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVmFyaWFibGVzXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHR2YXIgc3Vic2NyaWJlcnMgPSBbXTtcblxuXHRcdC8vIExvYWQgR29vZ2xlIE1hcHNcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdGdNYXBTZXR1cCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRcdHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP3Y9My5leHAmJyArICdjYWxsYmFjaz0kJF8uZ01hcExvYWRlci5yZWFkeSc7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gcmVhZHkoKSB7XG5cdFx0XHRmb3IgKHZhciBtZXRob2QgaW4gc3Vic2NyaWJlcnMpIHtcblx0XHRcdFx0c3Vic2NyaWJlcnNbbWV0aG9kXSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cdFx0fTtcblxuXHRcdC8vICQod2luZG93KS5sb2FkKGdNYXBTZXR1cClcblxuXHRcdC8vIFJldHVybmFsXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZWFkeTogcmVhZHksXG5cdFx0XHRzdWJzY3JpYmU6IHN1YnNjcmliZVxuXHRcdH07XG5cdH0pKCk7XG5cblx0ZXhwb3J0cy5yYW5kb21pemUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0dmFyIHV1aWQgPSAneHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuXHRcdFx0dmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcblx0XHRcdGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcblx0XHRcdHJldHVybiAoYyA9PSAneCcgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZygxNik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHV1aWQ7XG5cdH07XG5cblxufSk7Il19
