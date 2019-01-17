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

var firebaseConfig = require('./firebaseConfig')

firebase.initializeApp(firebaseConfig);

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
	// App.initialize();
	// StatusBar.hide();
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

	console.log('HELLO')
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

			console.log(window.loggingIn, theEmail/*, callback, errorCallback*/)

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

					console.log('META');

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
			console.log(window.uid)
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














},{"./firebaseConfig":2,"./modules/boardCtrl":3,"./modules/changeCtrl":4,"./modules/colophonCtrl":5,"./modules/helloCtrl":6,"./modules/historyCtrl":7,"./modules/infoCtrl":8,"./modules/listCtrl":9,"./modules/noteCtrl":10,"./modules/portalCtrl":11,"./modules/shareCtrl":12,"./modules/textCtrl":13,"./shared/core":14}],2:[function(require,module,exports){
module.exports = {
  apiKey: "AIzaSyD7j2bkgZg3led-CR0rH8wXMgksY4sP2o8",
  authDomain: "lick.firebaseapp.com",
  databaseURL: "https://lick.firebaseio.com",
  projectId: "firebase-lick",
  storageBucket: "firebase-lick.appspot.com",
  messagingSenderId: "330483292917"
};
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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










},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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










},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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






},{}],12:[function(require,module,exports){
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
			console.log(v, k);
			if (target === k)
				delete $scope.note.participants[k];
		})

		participantsGenerator();
	}

	$scope.emailUnescaper = function(email) {
		return email.replace(/[_]/g, ".");
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










},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy90b3RlbS5qcyIsIi4uL2pzL2ZpcmViYXNlQ29uZmlnLmpzIiwiLi4vanMvbW9kdWxlcy9ib2FyZEN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NoYW5nZUN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NvbG9waG9uQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaGVsbG9DdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9oaXN0b3J5Q3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaW5mb0N0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2xpc3RDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9ub3RlQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvcG9ydGFsQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvc2hhcmVDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy90ZXh0Q3RybC5qcyIsIi4uL2pzL3NoYXJlZC9jb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1MUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFZlbmRvciBmaWxlc1xuLy8gdmFyICQgPSB3aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSByZXF1aXJlKCcuL3ZlbmRvci9qcXVlcnktMS4xMS4xLm1pbicpO1xuXG52YXIgJCRfID0gd2luZG93LiQkXyA9IHJlcXVpcmUoJy4vc2hhcmVkL2NvcmUnKTsgXG5cbnZhciBoZWxsb0N0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvaGVsbG9DdHJsJyksXG5cdHBvcnRhbEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvcG9ydGFsQ3RybCcpLFxuXHRpbmZvQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9pbmZvQ3RybCcpLFxuXHRub3RlQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9ub3RlQ3RybCcpLFxuXHR0ZXh0Q3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy90ZXh0Q3RybCcpLFxuXHRjaGFuZ2VDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2NoYW5nZUN0cmwnKSxcblx0aGlzdG9yeUN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvaGlzdG9yeUN0cmwnKSxcblx0Ym9hcmRDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2JvYXJkQ3RybCcpLCBcblx0bGlzdEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvbGlzdEN0cmwnKSxcblx0c2hhcmVDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL3NoYXJlQ3RybCcpLFxuXHRjb2xvcGhvbkN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvY29sb3Bob25DdHJsJyk7XG5cbnZhciAkYm9keSA9ICQoJyNuZy1hcHAnKVxuXG52YXIgZmlyZWJhc2VDb25maWcgPSByZXF1aXJlKCcuL2ZpcmViYXNlQ29uZmlnJylcblxuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG5cbndpbmRvdy5fRmlyZWJhc2UgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZigpO1xuXG53aW5kb3cubGlzdExvb2tpbmdBdCA9ICdub3Rlcyc7XG53aW5kb3cuZGlyZWN0aW9ucyA9IFsnbm9ydGgnLCAnZWFzdCcsICdzb3V0aCcsICd3ZXN0J107XG53aW5kb3cubGF5ZXJzID0gWydsYW5kJywgJ3NreSddO1xud2luZG93LmxvZ2dlZEluID0gZmFsc2U7XG53aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG53aW5kb3cuaXNNb2JpbGVBcHAgPSBmYWxzZTtcbndpbmRvdy5oaXN0b3JpY2FsID0gW107XG53aW5kb3cudW5iaW5kaW5nID0gW107XG5cbndpbmRvdy5lbWFpbEVzY2FwZXIgPSBmdW5jdGlvbihlbWFpbCl7XG5cdHJldHVybiBlbWFpbC5yZXBsYWNlKC9bIC5dL2csIFwiX1wiKTtcbn07XG5cbndpbmRvdy5lbWFpbFVuZXNjYXBlciA9IGZ1bmN0aW9uKGVtYWlsKXtcblx0cmV0dXJuIGVtYWlsLnJlcGxhY2UoL1tfXS9nLCBcIi5cIik7XG59O1xuXG53aW5kb3cuZ2V0T2JqZWN0U2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgc2l6ZSA9IDAsIFxuICBrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBzaXplKys7XG4gIH1cbiAgcmV0dXJuIHNpemU7XG59O1xuXG53aW5kb3cuZ2V0T2JqZWN0RGVlcFNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHNpemUgPSAwLCBcbiAgXHRrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgaWYgKFxuICAgICAgXHR0eXBlb2Yob2JqW2tleV0pID09PSAnb2JqZWN0JyBcbiAgICAgIFx0JiYga2V5LmluZGV4T2YoJyQnKSA8IDBcbiAgXHQpIHNpemUrKztcbiAgfVxuICByZXR1cm4gc2l6ZTtcbn07XG5cbndpbmRvdy5pc190b3VjaF9kZXZpY2UgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCAnb25tc2dlc3R1cmVjaGFuZ2UnIGluIHdpbmRvdztcbn07XG5cbndpbmRvdy51bmJpbmRBbGwgPSBmdW5jdGlvbigpe1xuXHRmb3IgKHZhciBtZXRob2QgaW4gd2luZG93LnVuYmluZGluZyl7XG5cdFx0d2luZG93LnVuYmluZGluZ1ttZXRob2RdKCk7XG5cdH1cbn07XG5cbmlmICh3aW5kb3cuaXNfdG91Y2hfZGV2aWNlKCkpICRib2R5LmFkZENsYXNzKCd0b3VjaHknKVxuXG5pZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdpUGFkJykgPiAtMSl7XG5cdCQoJ2h0bWwnKS5hZGRDbGFzcygnaVBhZCcpXG59ZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdpUGhvbmUnKSA+IC0xIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignaVBvZCcpID4gLTEpe1xuXHQkKCdodG1sJykuYWRkQ2xhc3MoJ2lQaG9uZScpXG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlUmVhZHknLCBkZXZpY2VSZWFkeSwgZmFsc2UpO1xuXG5pZiAoXHRcblx0KGRvY3VtZW50LlVSTC5pbmRleE9mKCAnaHR0cDovLycgKSA9PT0gLTEpICYmXG5cdChkb2N1bWVudC5VUkwuaW5kZXhPZiggJ2h0dHBzOi8vJyApID09PSAtMSlcbil7XG5cdHdpbmRvdy5pc01vYmlsZUFwcCA9IHRydWU7XG5cdCRib2R5LmFkZENsYXNzKCdwaG9uZUdhcCcpO1x0XG59XG5cbmZ1bmN0aW9uIGRldmljZVJlYWR5KCl7XG5cdC8vIEFwcC5pbml0aWFsaXplKCk7XG5cdC8vIFN0YXR1c0Jhci5oaWRlKCk7XG59XG5cbiQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oZSl7XG5cdHZhciAkdGhhdCA9ICQodGhpcyksXG5cdFx0X3N0ID0gJHRoYXQuc2Nyb2xsVG9wKCk7XG5cblx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4KXtcblx0XHRpZiAoX3N0ID4gMTApe1xuXHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3RvcE5hdmlnYXRpb24nKVxuXHRcdH1lbHNle1xuXHRcdFx0JGJvZHkucmVtb3ZlQ2xhc3MoJ3RvcE5hdmlnYXRpb24nKVx0XHRcdFxuXHRcdH1cblx0fWVsc2V7XG5cdFx0aWYgKF9zdCA+IDIwKXtcblx0XHRcdCRib2R5LmFkZENsYXNzKCd0b3BOYXZpZ2F0aW9uJylcblx0XHR9ZWxzZXtcblx0XHRcdCRib2R5LnJlbW92ZUNsYXNzKCd0b3BOYXZpZ2F0aW9uJylcdFx0XHRcblx0XHR9XG5cdH1cbn0pXG5cbi8vIGRlZmluZSBvdXIgYXBwIGFuZCBkZXBlbmRlbmNpZXMgKHJlbWVtYmVyIHRvIGluY2x1ZGUgZmlyZWJhc2UhKVxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKFxuXHQnbGljaycsIFxuXHRbXG5cdFx0J2ZpcmViYXNlJywgXG5cdFx0J25nUm91dGUnLFxuXHRcdCd1aS5zb3J0YWJsZScsXG5cdFx0J2NmcC5ob3RrZXlzJyxcblx0XHQnbmdTYW5pdGl6ZScsXG5cdFx0J25nQ29va2llcycsXG5cdFx0J2dyaWRzdGVyJyxcblx0XHQnbmdBbmltYXRlJyxcblx0XHQnbmdUb3VjaCcsXG5cdFx0Ly8gJ2htVG91Y2hFdmVudHMnLFxuXHRcdCdzbGlja0Nhcm91c2VsJ1xuXHRdXG4pO1xuXG5hcHAucnVuKFtcIiRyb290U2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uKSB7XG5cdCRyb290U2NvcGUuJG9uKFwiJHJvdXRlQ2hhbmdlRXJyb3JcIiwgZnVuY3Rpb24oZXZlbnQsIG5leHQsIHByZXZpb3VzLCBlcnJvcikge1xuXHRcdGlmIChlcnJvciA9PT0gXCJBVVRIX1JFUVVJUkVEXCIpIHsgXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BvcnRhbCcpO1xuXHRcdH1cblx0fSk7XG59XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4ODg4ODg4OGJhICAgICxhZDg4ODhiYSwgICA4OCAgICAgICAgODggODg4ODg4ODg4ODg4IDg4ODg4ODg4ODg4IGFkODg4ODhiYSAgIFxuLy8gODggICAgICBcIjhiICBkOFwiJyAgICBgXCI4YiAgODggICAgICAgIDg4ICAgICAgODggICAgICA4OCAgICAgICAgIGQ4XCIgICAgIFwiOGIgIFxuLy8gODggICAgICAsOFAgZDgnICAgICAgICBgOGIgODggICAgICAgIDg4ICAgICAgODggICAgICA4OCAgICAgICAgIFk4LCAgICAgICAgICBcbi8vIDg4YWFhYWFhOFAnIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICA4OCAgICAgIDg4ICAgICAgODhhYWFhYSAgICBgWThhYWFhYSwgICAgXG4vLyA4OFwiXCJcIlwiODgnICAgODggICAgICAgICAgODggODggICAgICAgIDg4ICAgICAgODggICAgICA4OFwiXCJcIlwiXCIgICAgICBgXCJcIlwiXCJcIjhiLCAgXG4vLyA4OCAgICBgOGIgICBZOCwgICAgICAgICw4UCA4OCAgICAgICAgODggICAgICA4OCAgICAgIDg4ICAgICAgICAgICAgICAgICBgOGIgIFxuLy8gODggICAgIGA4YiAgIFk4YS4gICAgLmE4UCAgWThhLiAgICAuYThQICAgICAgODggICAgICA4OCAgICAgICAgIFk4YSAgICAgYThQICBcbi8vIDg4ICAgICAgYDhiICAgYFwiWTg4ODhZXCInICAgIGBcIlk4ODg4WVwiJyAgICAgICA4OCAgICAgIDg4ODg4ODg4ODg4IFwiWTg4ODg4UFwiICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cbmFwcC5jb25maWcoIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG5cblx0Y29uc29sZS5sb2coJ0hFTExPJylcbiAgICAkcm91dGVQcm92aWRlclxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBzaW1wbHkgdHlwaW5nIGluIHRoZSBhZGRyZXNzXG4gICAgICAgIC53aGVuKCcvJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9oZWxsby5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ2hlbGxvQ3RybCcsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHRoZSBsb2dpbiAvIHBvcnRhbCBwYWdlXG4gICAgICAgIC53aGVuKCcvcG9ydGFsJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9wb3J0YWwuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdwb3J0YWxDdHJsJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgdGhlIGluZm8gcGFnZVxuICAgICAgICAud2hlbignL2luZm8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2luZm8uaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdpbmZvQ3RybCcsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIG5vdGVzXG4gICAgICAgIC53aGVuKCcvbm90ZS86aWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL25vdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdub3RlQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3Igc2hhcmVkbm90ZXNcbiAgICAgICAgLndoZW4oJy9zaGFyZWRub3RlLzppZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvbm90ZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ25vdGVDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciB0ZXh0XG4gICAgICAgIC53aGVuKCcvdGV4dC86aWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL3RleHQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICd0ZXh0Q3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgY2hhbmdpbmcgYm9hcmRzXG4gICAgICAgIC53aGVuKCcvY2hhbmdlLzppZCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvY2hhbmdlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnY2hhbmdlQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgYm9hcmRzXG4gICAgICAgIC53aGVuKCcvYm9hcmQvOmlkJywgeyBcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvYm9hcmQuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdib2FyZEN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGxpc3RcbiAgICAgICAgLndoZW4oJy9saXN0JywgeyBcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2xpc3QuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlciAgOiAnbGlzdEN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGhpc3RvcnlcbiAgICAgICAgLndoZW4oJy9oaXN0b3J5JywgeyBcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2hpc3RvcnkuaHRtbCcsXG5cdFx0XHRcdFx0Y29udHJvbGxlciAgOiAnaGlzdG9yeUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHNoYXJlXG4gICAgICAgIC53aGVuKCcvc2hhcmUvOmlkJywgeyBcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL3NoYXJlLmh0bWwnLFxuXHRcdFx0XHRcdGNvbnRyb2xsZXIgIDogJ3NoYXJlQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgbGlzdFxuICAgICAgICAud2hlbignL2NvbG9waG9uJywgeyBcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2NvbG9waG9uLmh0bWwnLFxuXHRcdFx0XHRcdGNvbnRyb2xsZXIgIDogJ2NvbG9waG9uQ3RybCdcbiAgICAgICAgfSk7XG59KVxuLnJ1biggZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkY29va2llcywgTG9naW4sICRyb3V0ZSwgJHRpbWVvdXQsICRhbmltYXRlKSB7XG5cdCRyb290U2NvcGUuJG9uKCAnJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgbmV4dCwgY3VycmVudCkge1xuXG5cdFx0d2luZG93Lmhpc3RvcmljYWwucHVzaCgkbG9jYXRpb24ucGF0aCgpKTtcblxuXHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UuaGlzdG9yaWNhbF9sYXN0ID0gJGxvY2F0aW9uLnBhdGgoKTtcblxuXHRcdGlmICgodHlwZW9mKGN1cnJlbnQpICE9PSAndW5kZWZpbmVkJykgJiYgKHR5cGVvZihjdXJyZW50LnRlbXBsYXRlVXJsKSAhPT0gJ3VuZGVmaW5lZCcpKVxuXHRcdFx0JGJvZHkuYXR0ciggJ2RhdGEtbGVhdmluZycsIGN1cnJlbnQudGVtcGxhdGVVcmwuc3BsaXQoJy8nKVsyXS5zcGxpdCgnLicpWzBdICk7XG5cdFx0aWYgKCh0eXBlb2YobmV4dCkgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mKG5leHQudGVtcGxhdGVVcmwpICE9PSAndW5kZWZpbmVkJykpXG5cdFx0XHQkYm9keS5hdHRyKCAnZGF0YS1lbnRlcmluZycsIG5leHQudGVtcGxhdGVVcmwuc3BsaXQoJy8nKVsyXS5zcGxpdCgnLicpWzBdICk7XG5cdFx0ZWxzZXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRpZiAod2luZG93LmxvZ2dlZEluKXtcblx0XHRcdGNvbnNvbGUubG9nKCdhbHJlYWR5IGxvZ2dlZCBpbiEnKVxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIDApO1xuXG5cdFx0XHRpZiAoJGxvY2F0aW9uLnBhdGgoKSA9PT0gJy8nKVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHRpZiAoIFxuXHRcdFx0XHQoIXdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwgJiYgIXdpbmRvdy5sb2NhbFN0b3JhZ2UucGFzcykgJiZcblx0XHRcdFx0bmV4dC50ZW1wbGF0ZVVybCAhPT0gJ2Fzc2V0cy9pbmMvY29sb3Bob24uaHRtbCdcblx0XHRcdCl7XHRcblx0XHRcdFx0Y29uc29sZS5sb2coJ25vIHN0b3JlZCBsb2dpbiwgZ290byBzdGFydCcpXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvcG9ydGFsJylcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdCRib2R5LmFkZENsYXNzKCdyZWFkeScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBcblx0XHRcdFx0KCRjb29raWVzLmVtYWlsICYmICRjb29raWVzLnBhc3MpIHx8IFxuXHRcdFx0XHQod2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCAmJiB3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3MpXG5cdFx0XHQpe1xuXHRcdFx0XHRjb25zb2xlLmxvZygnc3RvcmVkIGxvZ2luIGZvdW5kLCBsb2dnaW5nIGluJylcblxuXHRcdFx0XHR2YXIgbG9naW5FbWFpbCA9ICRjb29raWVzLmVtYWlsIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwsXG5cdFx0XHRcdFx0bG9naW5QYXNzID0gJGNvb2tpZXMucGFzcyB8fCB3aW5kb3cubG9jYWxTdG9yYWdlLnBhc3M7XG5cblx0XHRcdFx0TG9naW4obG9naW5FbWFpbCwgbG9naW5QYXNzLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmIChuZXh0LnRlbXBsYXRlVXJsID09PSAnYXNzZXRzL2luYy9wb3J0YWwuaHRtbCcpe1xuXHRcdFx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jyk7XG5cblx0XHRcdFx0XHRcdGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmhpc3RvcmljYWxfbGFzdClcblx0XHRcdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgod2luZG93LmxvY2FsU3RvcmFnZS5oaXN0b3JpY2FsX2xhc3QpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQkYW5pbWF0ZS5lbmFibGVkKGZhbHNlKTtcblx0XHRcdFx0XHRcdCRyb3V0ZS5yZWxvYWQoKTtcblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0JGFuaW1hdGUuZW5hYmxlZCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jylcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQkYm9keS5hdHRyKCdkYXRhLWRpcmVjdGlvbicsIGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCRjb29raWVzLmRpcmVjdGlvbil7XG5cdFx0XHRyZXR1cm4gd2luZG93LmRpcmVjdGlvbnNbJGNvb2tpZXMuZGlyZWN0aW9uICUgNF07XG5cdFx0fVxuXHRcdGVsc2V7XG5cdFx0XHQkY29va2llcy5kaXJlY3Rpb24gPSAwO1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5kaXJlY3Rpb25zWyRjb29raWVzLmRpcmVjdGlvbl07XG5cdFx0fVxuXHR9KSBcblx0XG5cdGlmICgkY29va2llcy5sYXllcil7XG5cdFx0JHJvb3RTY29wZS5sYXllciA9ICRjb29raWVzLmxheWVyO1xuXHR9XG5cdGVsc2V7XG5cdFx0JGNvb2tpZXMubGF5ZXIgPSAnc2t5Jztcblx0XHQkcm9vdFNjb3BlLmxheWVyID0gJGNvb2tpZXMubGF5ZXI7XG5cdH1cbn0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODg4ODg4ODg4ODggZGIgICAgICAgICxhZDg4ODhiYSwgODg4ODg4ODg4ODg4ICxhZDg4ODhiYSwgICA4ODg4ODg4OGJhICA4OCA4ODg4ODg4ODg4OCBhZDg4ODg4YmEgICBcbi8vIDg4ICAgICAgICAgZDg4YiAgICAgIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgZDhcIicgICAgYFwiOGIgIDg4ICAgICAgXCI4YiA4OCA4OCAgICAgICAgIGQ4XCIgICAgIFwiOGIgIFxuLy8gODggICAgICAgIGQ4J2A4YiAgICBkOCcgICAgICAgICAgICAgICA4OCAgICBkOCcgICAgICAgIGA4YiA4OCAgICAgICw4UCA4OCA4OCAgICAgICAgIFk4LCAgICAgICAgICBcbi8vIDg4YWFhYWEgIGQ4JyAgYDhiICAgODggICAgICAgICAgICAgICAgODggICAgODggICAgICAgICAgODggODhhYWFhYWE4UCcgODggODhhYWFhYSAgICBgWThhYWFhYSwgICAgXG4vLyA4OFwiXCJcIlwiXCIgZDhZYWFhYVk4YiAgODggICAgICAgICAgICAgICAgODggICAgODggICAgICAgICAgODggODhcIlwiXCJcIjg4JyAgIDg4IDg4XCJcIlwiXCJcIiAgICAgIGBcIlwiXCJcIlwiOGIsICBcbi8vIDg4ICAgICBkOFwiXCJcIlwiXCJcIlwiXCI4YiBZOCwgICAgICAgICAgICAgICA4OCAgICBZOCwgICAgICAgICw4UCA4OCAgICBgOGIgICA4OCA4OCAgICAgICAgICAgICAgICAgYDhiICBcbi8vIDg4ICAgIGQ4JyAgICAgICAgYDhiIFk4YS4gICAgLmE4UCAgICAgODggICAgIFk4YS4gICAgLmE4UCAgODggICAgIGA4YiAgODggODggICAgICAgICBZOGEgICAgIGE4UCAgXG4vLyA4OCAgIGQ4JyAgICAgICAgICBgOGIgYFwiWTg4ODhZXCInICAgICAgODggICAgICBgXCJZODg4OFlcIicgICA4OCAgICAgIGA4YiA4OCA4ODg4ODg4ODg4OCBcIlk4ODg4OFBcIiAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgXCJcIiAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgLGFkUFBZYmEsICAgLGFkUFBZYixkOCA4OCA4YixkUFBZYmEsICAgXG4vLyA4OCBhOFwiICAgICBcIjhhIGE4XCIgICAgYFk4OCA4OCA4OFAnICAgYFwiOGEgIFxuLy8gODggOGIgICAgICAgZDggOGIgICAgICAgODggODggODggICAgICAgODggIFxuLy8gODggXCI4YSwgICAsYThcIiBcIjhhLCAgICxkODggODggODggICAgICAgODggIFxuLy8gODggIGBcIlliYmRQXCInICAgYFwiWWJiZFBcIlk4IDg4IDg4ICAgICAgIDg4ICBcbi8vICAgICAgICAgICAgICAgICBhYSwgICAgLDg4ICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgXCJZOGJiZFBcIiAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeShcIkxvZ2luXCIsIFsnJHJvb3RTY29wZScsIFwiJGZpcmViYXNlQXV0aFwiLCBcIiRjb29raWVzXCIsICckdGltZW91dCcsICdBdXRoJywgJyRsb2NhdGlvbicsICdOb3RlcycsXG5cdGZ1bmN0aW9uKCRyb290U2NvcGUsICRmaXJlYmFzZUF1dGgsICRjb29raWVzLCAkdGltZW91dCwgQXV0aCwgJGxvY2F0aW9uLCBOb3Rlcykge1xuXHRcdHJldHVybiBmdW5jdGlvbih0aGVFbWFpbCwgdGhlUGFzcywgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spe1xuXG5cdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cubG9nZ2luZ0luLCB0aGVFbWFpbC8qLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjayovKVxuXG5cdFx0XHRpZiAoIXdpbmRvdy5sb2dnaW5nSW4pe1xuXHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gdHJ1ZTtcblxuXHRcdFx0XHRBdXRoLiRzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChcblx0XHRcdFx0XHR0aGVFbWFpbCxcblx0XHRcdFx0XHR0aGVQYXNzXG5cdFx0XHRcdCkudGhlbihmdW5jdGlvbihhdXRoRGF0YSkge1xuXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2xvZ2dlZCBpbiB3aXRoICcgKyB0aGVFbWFpbCArICcsICcgKyBhdXRoRGF0YS51c2VyLnVpZClcblx0XHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG5cblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsID0gJGNvb2tpZXMuZW1haWwgPSB0aGVFbWFpbDtcblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsX2VzY2FwZWQgPSAkY29va2llcy5lbWFpbF9lc2NhcGVkID0gd2luZG93LmVtYWlsRXNjYXBlcih0aGVFbWFpbCk7XG5cdFx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5wYXNzID0gJGNvb2tpZXMucGFzcyA9IHRoZVBhc3M7XG5cblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnVpZCA9IHdpbmRvdy51aWQgPSBhdXRoRGF0YS51c2VyLnVpZDtcblxuXHRcdFx0XHRcdHdpbmRvdy5sb2dnZWRJbiA9IHRydWU7XG5cblx0XHRcdFx0XHRpZihcblx0XHRcdFx0XHRcdChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSkpIHx8IFxuXHRcdFx0XHRcdFx0KG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2QvaSkpIHx8XG5cdFx0XHRcdFx0XHQobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZC9pKSlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHdpbmRvdy5kZXZpY2UgPSAnTW9iaWxlJztcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHdpbmRvdy5kZXZpY2UgPSAnRGVza3RvcCc7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZihjYWxsYmFjaykgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly9VUERBVEVcblxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdNRVRBJyk7XG5cblx0XHRcdFx0XHRyZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEnKTtcblx0XHRcdFx0XHRyZWYub25jZSgndmFsdWUnLCBmdW5jdGlvbihzbmFwc2hvdCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoIXNuYXBzaG90LmV4aXN0cygpKXtcblx0XHRcdFx0XHRcdFx0cmVmLnNldCh7XG5cdFx0XHRcdFx0XHRcdFx0dXNlcjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW1haWxfZXNjYXBlZDogJGNvb2tpZXMuZW1haWxfZXNjYXBlZCxcblx0XHRcdFx0XHRcdFx0XHRcdHVpZDogd2luZG93LnVpZFxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTsgXG5cblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGVycm9yQ2FsbGJhY2spID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHRcdGVycm9yQ2FsbGJhY2soKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG5cdFx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9wb3J0YWwnKTtcblx0XHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKTtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFwiQXV0aGVudGljYXRpb24gZmFpbGVkOlwiLCBlcnJvcik7XG5cdFx0XHRcdFx0JGNvb2tpZXMuZW1haWwgPSAnJztcblx0XHRcdFx0XHQkY29va2llcy5wYXNzID0gJyc7XG5cdFx0XHRcdFx0YWxlcnQoJ09oIG5vISBZb3VyIGxvZ2luIGRpZG5cXCd0IHdvcmsuIFRyeSBhZ2FpbiEnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XHRcdFx0XG5cdFx0fVxuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgXG4vLyA4OCAgLGFkUFBZYmEsICAgLGFkUFBZYixkOCAgLGFkUFBZYmEsICA4OCAgICAgICA4OCBNTTg4TU1NICBcbi8vIDg4IGE4XCIgICAgIFwiOGEgYThcIiAgICBgWTg4IGE4XCIgICAgIFwiOGEgODggICAgICAgODggICA4OCAgICAgXG4vLyA4OCA4YiAgICAgICBkOCA4YiAgICAgICA4OCA4YiAgICAgICBkOCA4OCAgICAgICA4OCAgIDg4ICAgICBcbi8vIDg4IFwiOGEsICAgLGE4XCIgXCI4YSwgICAsZDg4IFwiOGEsICAgLGE4XCIgXCI4YSwgICAsYTg4ICAgODgsICAgIFxuLy8gODggIGBcIlliYmRQXCInICAgYFwiWWJiZFBcIlk4ICBgXCJZYmJkUFwiJyAgIGBcIlliYmRQJ1k4ICAgXCJZODg4ICBcbi8vICAgICAgICAgICAgICAgICBhYSwgICAgLDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICBcIlk4YmJkUFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoXCJMb2dvdXRcIiwgW1wiJGZpcmViYXNlQXV0aFwiLCBcIiRjb29raWVzXCIsICdBdXRoJywgJyRsb2NhdGlvbicsICckdGltZW91dCcsIFxuXHRmdW5jdGlvbigkZmlyZWJhc2VBdXRoLCAkY29va2llcywgQXV0aCwgJGxvY2F0aW9uLCAkdGltZW91dCkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpe1xuXG5cdFx0XHR3aW5kb3cubG9nZ2VkSW4gPSBmYWxzZTtcblxuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkY29va2llcy5lbWFpbCA9ICcnO1xuXHRcdFx0XHQkY29va2llcy5lbWFpbF9lc2NhcGVkID0gJyc7XG5cdFx0XHRcdCRjb29raWVzLnBhc3MgPSAnJztcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCA9ICcnO1xuXHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsX2VzY2FwZWQgPSAnJztcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5wYXNzID0gJyc7XG5cdFx0XHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UudWlkID0gJyc7XG5cdFx0XHRcdHdpbmRvdy51aWQgPSAnJztcblxuXHRcdFx0XHQvLyBBdXRoLiR1bmF1dGgoKTtcblx0XHRcdFx0QXV0aC4kc2lnbk91dCgpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCAgLy8gU2lnbi1vdXQgc3VjY2Vzc2Z1bC5cblx0XHRcdFx0ICBjb25zb2xlLmxvZygnc2lnbiBvdXQgc3VjY2Vzc2Z1bCcpXG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ2xvZ291dCBmYWlsZWQgOignKVxuXHRcdFx0XHQgIC8vIEFuIGVycm9yIGhhcHBlbmVkLlxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BvcnRhbCcpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICA4OCAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgODggICAgICAgICAgIFxuLy8gLGFkUFBZWWJhLCA4OCAgICAgICA4OCBNTTg4TU1NIDg4LGRQUFliYSwgICBcbi8vIFwiXCIgICAgIGBZOCA4OCAgICAgICA4OCAgIDg4ICAgIDg4UCcgICAgXCI4YSAgXG4vLyAsYWRQUFBQUDg4IDg4ICAgICAgIDg4ICAgODggICAgODggICAgICAgODggIFxuLy8gODgsICAgICw4OCBcIjhhLCAgICxhODggICA4OCwgICA4OCAgICAgICA4OCAgXG4vLyBgXCI4YmJkUFwiWTggIGBcIlliYmRQJ1k4ICAgXCJZODg4IDg4ICAgICAgIDg4ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnQXV0aCcsIFtcIiRmaXJlYmFzZUF1dGhcIixcblx0ZnVuY3Rpb24oJGZpcmViYXNlQXV0aCkge1xuXHRcdHZhciAkZmlyZWJhc2VBdXRoID0gJGZpcmViYXNlQXV0aCgpO1xuXHRcdHJldHVybiAkZmlyZWJhc2VBdXRoO1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAsYWRQUFliYSwgIFxuLy8gODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCBJOFsgICAgXCJcIiAgXG4vLyA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgYFwiWThiYSwgICBcbi8vIDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgYWEgICAgXThJICBcbi8vIDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyBgXCJZYmJkUFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdOb3RlcycsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ub3RlcycpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gLGFkUFBZYmEsIDg4LGRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYmEsICAsYWRQUFliLDg4IDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgLGFkUFBZYmEsICBcbi8vIEk4WyAgICBcIlwiIDg4UCcgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThQX19fX184OCBhOFwiICAgIGBZODggODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCBJOFsgICAgXCJcIiAgXG4vLyAgYFwiWThiYSwgIDg4ICAgICAgIDg4ICxhZFBQUFBQODggODggICAgICAgICA4UFBcIlwiXCJcIlwiXCJcIiA4YiAgICAgICA4OCA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgYFwiWThiYSwgICBcbi8vIGFhICAgIF04SSA4OCAgICAgICA4OCA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YiwgICAsYWEgXCI4YSwgICAsZDg4IDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgYWEgICAgXThJICBcbi8vIGBcIlliYmRQXCInIDg4ICAgICAgIDg4IGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCJZYmJkOFwiJyAgYFwiOGJiZFBcIlk4IDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyBgXCJZYmJkUFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ1NoYXJlZE5vdGVzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgIFxuLy8gODgsZFBQWWJhLCAgICxhZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliLDg4ICxhZFBQWWJhLCAgXG4vLyA4OFAnICAgIFwiOGEgYThcIiAgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThcIiAgICBgWTg4IEk4WyAgICBcIlwiICBcbi8vIDg4ICAgICAgIGQ4IDhiICAgICAgIGQ4ICxhZFBQUFBQODggODggICAgICAgICA4YiAgICAgICA4OCAgYFwiWThiYSwgICBcbi8vIDg4YiwgICAsYThcIiBcIjhhLCAgICxhOFwiIDg4LCAgICAsODggODggICAgICAgICBcIjhhLCAgICxkODggYWEgICAgXThJICBcbi8vIDhZXCJZYmJkOFwiJyAgIGBcIlliYmRQXCInICBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiOGJiZFBcIlk4IGBcIlliYmRQXCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdCb2FyZHMnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkgeyBcblx0XHRcdGNvbnNvbGUubG9nKClcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcycpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vIDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vIDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cudWlkKVxuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbm90ZXMvJyArIGlkKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIFxuLy8gLGFkUFBZYmEsIDg4LGRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYmEsICAsYWRQUFliLDg4IDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gSThbICAgIFwiXCIgODhQJyAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFBfX19fXzg4IGE4XCIgICAgYFk4OCA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4ICBcbi8vICBgXCJZOGJhLCAgODggICAgICAgODggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhQUFwiXCJcIlwiXCJcIlwiIDhiICAgICAgIDg4IDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBcbi8vIGFhICAgIF04SSA4OCAgICAgICA4OCA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YiwgICAsYWEgXCI4YSwgICAsZDg4IDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgIFxuLy8gYFwiWWJiZFBcIicgODggICAgICAgODggYFwiOGJiZFBcIlk4IDg4ICAgICAgICAgIGBcIlliYmQ4XCInICBgXCI4YmJkUFwiWTggODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ3NoYXJlZE5vdGUnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArIGlkKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4LGRQUFliYSwgICAsYWRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYiw4OCAgXG4vLyA4OFAnICAgIFwiOGEgYThcIiAgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThcIiAgICBgWTg4ICBcbi8vIDg4ICAgICAgIGQ4IDhiICAgICAgIGQ4ICxhZFBQUFBQODggODggICAgICAgICA4YiAgICAgICA4OCAgXG4vLyA4OGIsICAgLGE4XCIgXCI4YSwgICAsYThcIiA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YSwgICAsZDg4ICBcbi8vIDhZXCJZYmJkOFwiJyAgIGBcIlliYmRQXCInICBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiOGJiZFBcIlk4ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnQm9hcmQnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvYm9hcmRzLycgKyBpZCk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgXG4vLyA4OCxkUFliYSwsYWRQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWVliYSwgIFxuLy8gODhQJyAgIFwiODhcIiAgICBcIjhhIGE4UF9fX19fODggICA4OCAgICBcIlwiICAgICBgWTggIFxuLy8gODggICAgICA4OCAgICAgIDg4IDhQUFwiXCJcIlwiXCJcIlwiICAgODggICAgLGFkUFBQUFA4OCAgXG4vLyA4OCAgICAgIDg4ICAgICAgODggXCI4YiwgICAsYWEgICA4OCwgICA4OCwgICAgLDg4ICBcbi8vIDg4ICAgICAgODggICAgICA4OCAgYFwiWWJiZDhcIicgICBcIlk4ODggYFwiOGJiZFBcIlk4ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnTWV0YScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YScpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgIFwiXCIgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCxkUFBZYmEsICA4OCAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIDhiLGRQUFliYSwgOGIgICAgICAgZDggIFxuLy8gODhQJyAgICBcIjhhIDg4IEk4WyAgICBcIlwiICAgODggICBhOFwiICAgICBcIjhhIDg4UCcgICBcIlk4IGA4YiAgICAgZDgnICBcbi8vIDg4ICAgICAgIDg4IDg4ICBgXCJZOGJhLCAgICA4OCAgIDhiICAgICAgIGQ4IDg4ICAgICAgICAgIGA4YiAgIGQ4JyAgIFxuLy8gODggICAgICAgODggODggYWEgICAgXThJICAgODgsICBcIjhhLCAgICxhOFwiIDg4ICAgICAgICAgICBgOGIsZDgnICAgIFxuLy8gODggICAgICAgODggODggYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZFBcIicgIDg4ICAgICAgICAgICAgIFk4OCcgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkOCcgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkOCcgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdIaXN0b3J5JywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhL2hpc3RvcnknKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICBcIlwiICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgIFxuLy8gODgsZFBQWWJhLCAgODggLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICA4YixkUFBZYmEsIDhiICAgICAgIGQ4ICAsYWRQUFliYSwgICxhZFBQWWJhLCAgODggICAgICAgODggOGIsZFBQWWJhLCBNTTg4TU1NICBcbi8vIDg4UCcgICAgXCI4YSA4OCBJOFsgICAgXCJcIiAgIDg4ICAgYThcIiAgICAgXCI4YSA4OFAnICAgXCJZOCBgOGIgICAgIGQ4JyBhOFwiICAgICBcIlwiIGE4XCIgICAgIFwiOGEgODggICAgICAgODggODhQJyAgIGBcIjhhICA4OCAgICAgXG4vLyA4OCAgICAgICA4OCA4OCAgYFwiWThiYSwgICAgODggICA4YiAgICAgICBkOCA4OCAgICAgICAgICBgOGIgICBkOCcgIDhiICAgICAgICAgOGIgICAgICAgZDggODggICAgICAgODggODggICAgICAgODggIDg4ICAgICBcbi8vIDg4ICAgICAgIDg4IDg4IGFhICAgIF04SSAgIDg4LCAgXCI4YSwgICAsYThcIiA4OCAgICAgICAgICAgYDhiLGQ4JyAgIFwiOGEsICAgLGFhIFwiOGEsICAgLGE4XCIgXCI4YSwgICAsYTg4IDg4ICAgICAgIDg4ICA4OCwgICAgXG4vLyA4OCAgICAgICA4OCA4OCBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkUFwiJyAgODggICAgICAgICAgICAgWTg4JyAgICAgYFwiWWJiZDhcIicgIGBcIlliYmRQXCInICAgYFwiWWJiZFAnWTggODggICAgICAgODggIFwiWTg4OCAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4JyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4JyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ2hpc3RvcnlDb3VudCcsXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS9oaXN0b3J5JyksXG5cdFx0XHRcdGNvdW50ID0gMDtcblxuXHRcdFx0cmVmLm9uY2UoXCJ2YWx1ZVwiLCBmdW5jdGlvbihzbmFwc2hvdCkge1xuXG5cdFx0XHRcdHNuYXBzaG90LmZvckVhY2goZnVuY3Rpb24oY2hpbGRTbmFwc2hvdCkge1xuXHRcdFx0XHRcdHZhciBjaGlsZERhdGEgPSBjaGlsZFNuYXBzaG90LnZhbCgpO1xuXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0KCBjaGlsZERhdGEuZGV2aWNlICE9PSB3aW5kb3cuZGV2aWNlICkgfHwgXG5cdFx0XHRcdFx0XHQoIGNoaWxkRGF0YS50aW1lIDwgKCBEYXRlLm5vdygpIC0gMzYwMDAwMCApIClcblx0XHRcdFx0XHQpe1xuXHRcdFx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNhbGxiYWNrKGNvdW50KVxuXHRcdFx0fSlcblx0XHR9O1xuXHR9XG4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODggICAgICAgICAgXCJcIiAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIiAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCxkUFBZYmEsICA4OCAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIDhiLGRQUFliYSwgODggICxhZFBQWWJhLCAsYWRQUFlZYmEsIDg4ICBcbi8vIDg4UCcgICAgXCI4YSA4OCBJOFsgICAgXCJcIiAgIDg4ICAgYThcIiAgICAgXCI4YSA4OFAnICAgXCJZOCA4OCBhOFwiICAgICBcIlwiIFwiXCIgICAgIGBZOCA4OCAgXG4vLyA4OCAgICAgICA4OCA4OCAgYFwiWThiYSwgICAgODggICA4YiAgICAgICBkOCA4OCAgICAgICAgIDg4IDhiICAgICAgICAgLGFkUFBQUFA4OCA4OCAgXG4vLyA4OCAgICAgICA4OCA4OCBhYSAgICBdOEkgICA4OCwgIFwiOGEsICAgLGE4XCIgODggICAgICAgICA4OCBcIjhhLCAgICxhYSA4OCwgICAgLDg4IDg4ICBcbi8vIDg4ICAgICAgIDg4IDg4IGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmRQXCInICA4OCAgICAgICAgIDg4ICBgXCJZYmJkOFwiJyBgXCI4YmJkUFwiWTggODggIFxuXG53aW5kb3cuZGVib3VuY2VIaXN0b3JpY2FsID0gXy5kZWJvdW5jZShmdW5jdGlvbigpe1xuXG5cdGhpc3RvcmljYWxfY29uc3RydWN0KFxuXHRcdG5vdywgXG5cdFx0aW5jb21pbmdOb3RlLCBcblx0XHRzaGFyZUFjdGl2ZSwgXG5cdFx0Y2FsbGJhY2ssXG5cdFx0Tm90ZSxcblx0XHRNZXRhLFxuXHRcdCRjb29raWVzXG5cdClcblxufSwgNTAwMClcblxuLy8gd2luZG93LmRlYm91bmNlSGlzdG9yaWNhbCgpO1xuXG52YXIgaGlzdG9yaWNhbF9lbmdhZ2UgPSBmdW5jdGlvbihcblx0XHRub3csIFxuXHRcdGluY29taW5nTm90ZSwgXG5cdFx0c2hhcmVBY3RpdmUsIFxuXHRcdGNhbGxiYWNrLFxuXHRcdE5vdGUsXG5cdFx0TWV0YSxcblx0XHQkY29va2llc1xuXHQpe1xuXHRcbn1cblxuYXBwLnNlcnZpY2UoJ2hpc3RvcmljYWwnLCBbJ05vdGUnLCAnTWV0YScsICckY29va2llcycsXG5cdGZ1bmN0aW9uKE5vdGUsIE1ldGEsICRjb29raWVzKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKFxuXHRcdFx0bm93LCBcblx0XHRcdGluY29taW5nTm90ZSwgXG5cdFx0XHRzaGFyZUFjdGl2ZSwgXG5cdFx0XHRjYWxsYmFja1xuXHRcdCkge1xuXG5cdFx0XHRjb25zb2xlLmxvZyhhcmd1bWVudHMpXG5cblx0XHRcdHZhciBoaXN0b3JpY2FsTWFya2VyID0ge1xuXHRcdFx0XHR0aXRsZTogaW5jb21pbmdOb3RlLnRpdGxlLFx0XHRcblx0XHRcdFx0ZGV2aWNlOiB3aW5kb3cuZGV2aWNlLFxuXHRcdFx0XHR0aW1lOiBub3csXG5cdFx0XHRcdHNlZW46IGZhbHNlLFxuXHRcdFx0XHRzaGFyZWQ6IHNoYXJlQWN0aXZlLFxuXHRcdFx0XHRlZGl0b3I6ICRjb29raWVzLmVtYWlsX2VzY2FwZWQsXG5cdFx0XHRcdHVpZDogd2luZG93LnVpZFxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2hhcmVBY3RpdmUpe1xuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goaW5jb21pbmdOb3RlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24odiwgayl7XG5cdFx0XHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQodi51aWQgKyAnL21ldGEvaGlzdG9yeS8nICsgaW5jb21pbmdOb3RlLmlkKTtcblx0XHRcdFx0XHRyZWYuc2V0KGhpc3RvcmljYWxNYXJrZXIpXG5cdFx0XHRcdH0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEvaGlzdG9yeS8nICsgaW5jb21pbmdOb3RlLmlkKTtcblx0XHRcdFx0cmVmLnNldChoaXN0b3JpY2FsTWFya2VyKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaW5jb21pbmdOb3RlLnBhcmVudCl7XG5cdFx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcy8nICsgaW5jb21pbmdOb3RlLnBhcmVudCArICcvbGFzdEVkaXRlZCcpO1xuXHRcdFx0XHRyZWYuc2V0KG5vdylcblx0XHRcdH1lbHNlIGlmIChpbmNvbWluZ05vdGUucGFydGljaXBhbnRzICYmIGluY29taW5nTm90ZS5wYXJ0aWNpcGFudHNbd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbF9lc2NhcGVkXS5wYXJlbnQpe1xuXHRcdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnX3NoYXJlZC8nICsgaW5jb21pbmdOb3RlLmlkICsgJy9wYXJ0aWNpcGFudHMvJyArIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWxfZXNjYXBlZCArICcvbGFzdEVkaXRlZCcpO1xuXHRcdFx0XHRyZWYuc2V0KG5vdylcblx0XHRcdH1cblxuXHRcdFx0Y2FsbGJhY2soKTtcblxuXHRcdFx0Y29uc29sZS5sb2coJ0hJU1RPUklDQUwnKVxuXG5cdFx0XHRcblxuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgXCJcIiAgICxkICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgODggICAgIFxuLy8gOGIsZFBQWWJhLCAgICxhZFBQWWJhLCA4YiAgICAgIGRiICAgICAgZDggODgsZFBQWWJhLCAgODggTU04OE1NTSAgXG4vLyA4OFAnICAgYFwiOGEgYThQX19fX184OCBgOGIgICAgZDg4YiAgICBkOCcgODhQJyAgICBcIjhhIDg4ICAgODggICAgIFxuLy8gODggICAgICAgODggOFBQXCJcIlwiXCJcIlwiXCIgIGA4YiAgZDgnYDhiICBkOCcgIDg4ICAgICAgIGQ4IDg4ICAgODggICAgIFxuLy8gODggICAgICAgODggXCI4YiwgICAsYWEgICBgOGJkOCcgIGA4YmQ4JyAgIDg4YiwgICAsYThcIiA4OCAgIDg4LCAgICBcbi8vIDg4ICAgICAgIDg4ICBgXCJZYmJkOFwiJyAgICAgWVAgICAgICBZUCAgICAgOFlcIlliYmQ4XCInICA4OCAgIFwiWTg4OCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnbmV3Qml0JywgXG5cdGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmdW5jdGlvbih0YWIsIGNvbnRlbnQsIGxpbmspIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGRpc3BsYXk6IHRydWUsXG5cdFx0XHRcdHR5cGU6XCJwbGFpblRleHRcIixcblx0XHRcdFx0dGFiQ291bnQ6IHRhYixcblx0XHRcdFx0Y29udGVudDogdHlwZW9mKGNvbnRlbnQpICE9PSAndW5kZWZpbmVkJyA/IGNvbnRlbnQgOiAnJyxcblx0XHRcdFx0Y29udGVudENhcmV0OiB0eXBlb2YoY29udGVudCkgIT09ICd1bmRlZmluZWQnID8gY29udGVudCA6ICc8c3BhbiBjbGFzcz1cImhpZGRlbkNhcmV0XCI+PC9zcGFuPicsXG5cdFx0XHRcdGJpdElEOiAkJF8ucmFuZG9taXplKCksXG5cdFx0XHRcdG1hcms6IGZhbHNlLFxuXHRcdFx0XHRzZWxlY3RlZDogZmFsc2UsXG5cdFx0XHRcdGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG5cdFx0XHRcdGRlc3Ryb3llZDogXCJcIixcblx0XHRcdFx0bWFya2VkOiBcIlwiLFxuXHRcdFx0XHRtZW51X29wZW46IGZhbHNlLFxuXHRcdFx0XHRpc0xpbms6IHR5cGVvZihsaW5rKSAhPT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogZmFsc2UsXG5cdFx0XHRcdGFkZHJlc3M6IHR5cGVvZihsaW5rKSAhPT0gJ3VuZGVmaW5lZCcgPyBsaW5rIDogJydcblx0XHRcdH07XG5cdFx0fTtcblx0fVxuKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgYWQ4OCA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICBkOFwiICAgXCJcIiAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgIFxuLy8gICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIFxuLy8gTU04OE1NTSA4OCA4YixkUFBZYmEsICxhZFBQWWJhLCBNTTg4TU1NIDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gICA4OCAgICA4OCA4OFAnICAgXCJZOCBJOFsgICAgXCJcIiAgIDg4ICAgIDg4UCcgICBgXCI4YSBhOFwiICAgICBcIjhhICA4OCAgIGE4UF9fX19fODggIFxuLy8gICA4OCAgICA4OCA4OCAgICAgICAgICBgXCJZOGJhLCAgICA4OCAgICA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyAgIDg4ICAgIDg4IDg4ICAgICAgICAgYWEgICAgXThJICAgODgsICAgODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSAgXG4vLyAgIDg4ICAgIDg4IDg4ICAgICAgICAgYFwiWWJiZFBcIicgICBcIlk4ODggODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ2ZpcnN0Tm90ZScsIFsnbmV3Qml0JywgJyRjb29raWVzJyxcblx0ZnVuY3Rpb24obmV3Qml0LCAkY29va2llcykge1xuXHRcdHJldHVybiBmdW5jdGlvbihwYXJlbnQsIGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhL3VzZXInKTtcblxuXHRcdFx0cmVmLnNldCh7XG5cdFx0XHRcdGVtYWlsX2VzY2FwZWQ6ICRjb29raWVzLmVtYWlsX2VzY2FwZWQsXG5cdFx0XHRcdHVpZDogd2luZG93LnVpZFxuXHRcdFx0fSlcblxuXHRcdFx0dmFyIG5vdGVJRDtcblxuXHRcdFx0aWYgKGlkKXtcblx0XHRcdFx0bm90ZUlEID0gaWQ7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0bm90ZUlEID0gJCRfLnJhbmRvbWl6ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbm90ZVJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbm90ZXMvJyArIG5vdGVJRCApO1xuXHRcdFx0bm90ZVJlZi5zZXQoe1xuXHRcdFx0XHR0aXRsZTogJ1dlbGNvbWUgdG8gTGljayEgOikgQ2xpY2sgaGVyZSB0byBnZXQgc3RhcnRlZCEnLFxuXHRcdFx0XHRwYXJlbnQ6IHR5cGVvZihwYXJlbnQpID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBwYXJlbnQsXG5cdFx0XHRcdGlkOiBub3RlSUQsXG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0hpIHRoZXJlISBXZWxjb21lIHRvIExpY2ssIHRoZSBzbWFydGVzdCB3YXkgZm9yIHlvdXIgdG9uZ3VlIHRvIHRha2Ugbm90ZXMuIFlvdXIgaGFuZHMgY2FuIGhlbHAgdG9vLCBpZiB0aGV5XFwnZCBsaWtlLiA6KScpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnTGljayBoYXJuZXNzZXMgdGhlIHBvd2VyIG9mIHlvdXIgZmF2b3JpdGUgdGV4dCBlZGl0b3IgdG8gaGVscCB5b3Ugb3JnYW5pemUgeW91ciBsaWZlLicpLFxuXHRcdFx0XHRcdG5ld0JpdCgxLCAnSWYgeW91IGRvblxcJ3Qga25vdyB3aGF0IG9uZSBvZiB0aG9zZSBpcywgdGhhdFxcJ3Mgb2theSDigJMgTGljayBpcyBzdGlsbCBqdXN0IHlvdXIgc3BlZWQhJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdOb3RlcyBjYW4gZWl0aGVyIGJlIHN0YW5kLWFsb25lLCBvciBjYW4gYmUgb3JnYW5pemVkIGludG8gYm9hcmRzLiBHbyBhaGVhZCBhbmQgY2xvc2UgdGhpcyBhbmQgbWFrZSBhIG5ldyBib2FyZCwgdGhleVxcJ3JlIHByZXR0eSBoYW5keSEnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0xpY2sgc2VlbXMgcHJldHR5IHNpbXBsZSwgYnV0IGl0XFwncyBnb3QgYSBsb3Qgb2YgY29vbCB0aGluZ3MgYnVpbHQgcmlnaHQgaW4uIEl0IG1pZ2h0IHN1cnByaXNlIHlvdSEnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0EgbGlzdCBvZiBMaWNrXFwncyBrZXlib2FyZCBzaG9ydGN1dHMgaXMgbmV2ZXIgZmFyIGZyb20gcmVhY2g6IHByZXNzIGNvbW1hbmQgKyA/IHRvIHNlZSBpdCEnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ09uIGEgbW9iaWxlIGRldmljZT8gVGhlcmUgYXJlIGxvdHMgb2Ygc3dpcGFibGUgdGhpbmdzIOKAkyBnaXZlIGl0IGEgc2hvdCEnKSwgXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdMaWNrIGlzIGEgd29yayBpbiBwcm9ncmVzcywgYW5kIGlmIHNvbWV0aGluZyBnb2VzIHdyb25nLCBsZXQgbWUga25vdyBhdCBlQGplY3QuY2guJywgJ21haWx0bzplQGplY3QuY2gnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0hhcHB5IExpY2tpbmchIDopJylcblx0XHRcdFx0XSxcblx0XHRcdFx0Y2F0ZWdvcnk6IDAsXG5cdFx0XHRcdGRpc3BsYXk6IHRydWUsXG5cdFx0XHRcdGxpc3Q6IHRydWVcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbm90ZUlEO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vIDhiLGRQUFliYSwgICAsYWRQUFliYSwgOGIgICAgICBkYiAgICAgIGQ4IDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gODhQJyAgIGBcIjhhIGE4UF9fX19fODggYDhiICAgIGQ4OGIgICAgZDgnIDg4UCcgICBgXCI4YSBhOFwiICAgICBcIjhhICA4OCAgIGE4UF9fX19fODggIFxuLy8gODggICAgICAgODggOFBQXCJcIlwiXCJcIlwiXCIgIGA4YiAgZDgnYDhiICBkOCcgIDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBcbi8vIDg4ICAgICAgIDg4IFwiOGIsICAgLGFhICAgYDhiZDgnICBgOGJkOCcgICA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vIDg4ICAgICAgIDg4ICBgXCJZYmJkOFwiJyAgICAgWVAgICAgICBZUCAgICAgODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCduZXdOb3RlJywgWyduZXdCaXQnLFxuXHRmdW5jdGlvbihuZXdCaXQpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24ocGFyZW50LCBpZCkge1xuXG5cdFx0XHRjb25zb2xlLmxvZyhhcmd1bWVudHMpXG5cdFx0XHR2YXIgbm90ZUlEO1xuXG5cdFx0XHRpZiAoaWQpe1xuXHRcdFx0XHRub3RlSUQgPSBpZDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRub3RlSUQgPSAkJF8ucmFuZG9taXplKCk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBub3RlUmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ub3Rlcy8nICsgbm90ZUlEICk7XG5cdFx0XHRub3RlUmVmLnNldCh7XG5cdFx0XHRcdHRpdGxlOiAnJyxcblx0XHRcdFx0cGFyZW50OiB0eXBlb2YocGFyZW50KSA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcGFyZW50LFxuXHRcdFx0XHRpZDogbm90ZUlELFxuXHRcdFx0XHRib2R5OiBbbmV3Qml0KDApXSxcblx0XHRcdFx0Y2F0ZWdvcnk6IDAsXG5cdFx0XHRcdGRpc3BsYXk6IHRydWUsXG5cdFx0XHRcdGxpc3Q6IHRydWUsXG5cdFx0XHRcdHg6IDAsXG5cdFx0XHRcdHk6IDAsXG5cdFx0XHRcdGxhc3RFZGl0ZWQ6IERhdGUubm93KClcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbm90ZUlEO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgXG4vLyAsYWRQUFliYSwgODgsZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliYSwgOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgXG4vLyBJOFsgICAgXCJcIiA4OFAnICAgIFwiOGEgXCJcIiAgICAgYFk4IDg4UCcgICBcIlk4IGE4UF9fX19fODggODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyAgYFwiWThiYSwgIDg4ICAgICAgIDg4ICxhZFBQUFBQODggODggICAgICAgICA4UFBcIlwiXCJcIlwiXCJcIiA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyBhYSAgICBdOEkgODggICAgICAgODggODgsICAgICw4OCA4OCAgICAgICAgIFwiOGIsICAgLGFhIDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgIFxuLy8gYFwiWWJiZFBcIicgODggICAgICAgODggYFwiOGJiZFBcIlk4IDg4ICAgICAgICAgIGBcIlliYmQ4XCInIDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdzaGFyZU5vdGUnLCBbJyRmaXJlYmFzZU9iamVjdCcsICdNZXRhJywgJ05vdGUnLCAnTm90ZXMnLCAnJGNvb2tpZXMnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0LCBNZXRhLCBOb3RlLCBOb3RlcywgJGNvb2tpZXMsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgdGFyZ2V0LCBjYWxsYmFjaykge1xuXG5cdFx0XHRjb25zb2xlLmxvZyhhcmd1bWVudHMpXG5cblx0XHRcdHZhciBtZXRhUmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhL3NoYXJlZFVzZXJzLycpLnB1c2godGFyZ2V0KTtcblxuXHRcdFx0dmFyIHRyYW5zYWN0aW9uID0gTm90ZShpZCkuJGxvYWRlZCgpLnRoZW4oZnVuY3Rpb24ocHJpdmF0ZU5vdGUpIHtcblx0XHRcdFx0Y29uc29sZS5sb2cocHJpdmF0ZU5vdGUpXG5cdFx0XHRcdHZhciBzaGFyaW5nID0ge307XG5cdFx0XHRcdGlmIChwcml2YXRlTm90ZS5wYXJlbnQpe1xuXHRcdFx0XHRcdHNoYXJpbmdbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0gPSB7XG5cdFx0XHRcdFx0XHR1aWQ6IHdpbmRvdy51aWQsXG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHByaXZhdGVOb3RlLnBhcmVudCxcblx0XHRcdFx0XHRcdHg6IHByaXZhdGVOb3RlLngsXG5cdFx0XHRcdFx0XHR5OiBwcml2YXRlTm90ZS55XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRzaGFyaW5nWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdID0geyBcblx0XHRcdFx0XHRcdHBhcmVudDogZmFsc2UsXG5cdFx0XHRcdFx0XHR1aWQ6IHdpbmRvdy51aWQsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2hhcmluZ1tlbWFpbEVzY2FwZXIodGFyZ2V0KV0gPSB7IHBhcmVudDogZmFsc2UgfVxuXG5cdFx0XHRcdHZhciBzaGFyZWRSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkLycgKyBpZCk7XG5cdFx0XHRcdHNoYXJlZFJlZi5zZXQoe1xuXHRcdFx0XHRcdHRpdGxlOiBwcml2YXRlTm90ZS50aXRsZSxcblx0XHRcdFx0XHRpZDogcHJpdmF0ZU5vdGUuaWQsXG5cdFx0XHRcdFx0Ym9keTogcHJpdmF0ZU5vdGUuYm9keSxcblx0XHRcdFx0XHRjYXRlZ29yeTogcHJpdmF0ZU5vdGUuY2F0ZWdvcnksXG5cdFx0XHRcdFx0ZGlzcGxheTogcHJpdmF0ZU5vdGUuZGlzcGxheSxcblx0XHRcdFx0XHRsaXN0OiBwcml2YXRlTm90ZS5saXN0LFxuXHRcdFx0XHRcdHBhcnRpY2lwYW50czogc2hhcmluZ1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRwcml2YXRlTm90ZS4kcmVtb3ZlKCk7XG5cblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgODggICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgXG4vLyAsYWRQUFlZYmEsICAsYWRQUFliLDg4ICAsYWRQUFliLDg4IE1NODhNTU0gLGFkUFBZYmEsICAsYWRQUFliYSwgODgsZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliYSwgICxhZFBQWWIsODggOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgXG4vLyBcIlwiICAgICBgWTggYThcIiAgICBgWTg4IGE4XCIgICAgYFk4OCAgIDg4ICAgYThcIiAgICAgXCI4YSBJOFsgICAgXCJcIiA4OFAnICAgIFwiOGEgXCJcIiAgICAgYFk4IDg4UCcgICBcIlk4IGE4UF9fX19fODggYThcIiAgICBgWTg4IDg4UCcgICBgXCI4YSBhOFwiICAgICBcIjhhICA4OCAgIGE4UF9fX19fODggIFxuLy8gLGFkUFBQUFA4OCA4YiAgICAgICA4OCA4YiAgICAgICA4OCAgIDg4ICAgOGIgICAgICAgZDggIGBcIlk4YmEsICA4OCAgICAgICA4OCAsYWRQUFBQUDg4IDg4ICAgICAgICAgOFBQXCJcIlwiXCJcIlwiXCIgOGIgICAgICAgODggODggICAgICAgODggOGIgICAgICAgZDggIDg4ICAgOFBQXCJcIlwiXCJcIlwiXCIgIFxuLy8gODgsICAgICw4OCBcIjhhLCAgICxkODggXCI4YSwgICAsZDg4ICAgODgsICBcIjhhLCAgICxhOFwiIGFhICAgIF04SSA4OCAgICAgICA4OCA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YiwgICAsYWEgXCI4YSwgICAsZDg4IDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgIFxuLy8gYFwiOGJiZFBcIlk4ICBgXCI4YmJkUFwiWTggIGBcIjhiYmRQXCJZOCAgIFwiWTg4OCBgXCJZYmJkUFwiJyAgYFwiWWJiZFBcIicgODggICAgICAgODggYFwiOGJiZFBcIlk4IDg4ICAgICAgICAgIGBcIlliYmQ4XCInICBgXCI4YmJkUFwiWTggODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ2FkZFRvU2hhcmVkTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0JywgJ01ldGEnLCAnTm90ZScsICckY29va2llcycsICckbG9jYXRpb24nLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QsIE1ldGEsIE5vdGUsICRjb29raWVzLCAkbG9jYXRpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHRhcmdldCwgY2FsbGJhY2spIHtcblxuXHRcdFx0dmFyIG1ldGFSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEvc2hhcmVkVXNlcnMvJykucHVzaCh0YXJnZXQpO1xuXG5cdFx0XHR2YXIgcGFydGljaXBhbnRSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkLycgKyBpZCArICcvcGFydGljaXBhbnRzLycgKyBlbWFpbEVzY2FwZXIodGFyZ2V0KSk7XG5cblx0XHRcdGNvbnNvbGUubG9nKHBhcnRpY2lwYW50UmVmKVxuXG5cdFx0XHRwYXJ0aWNpcGFudFJlZi5zZXQoe1xuXHRcdFx0XHRwYXJlbnQ6IGZhbHNlXG5cdFx0XHR9LCBjYWxsYmFjaylcblx0XHR9O1xuXHR9XG5dKTtcblxuXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgIDg4IDg4IDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgIFwiXCIgODggODggICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgODggODggICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgXG4vLyA4OCAgICxkOCAgODggODggODggOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgXG4vLyA4OCAsYThcIiAgIDg4IDg4IDg4IDg4UCcgICBgXCI4YSBhOFwiICAgICBcIjhhICA4OCAgIGE4UF9fX19fODggIFxuLy8gODg4OFsgICAgIDg4IDg4IDg4IDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBcbi8vIDg4YFwiWWJhLCAgODggODggODggODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSAgXG4vLyA4OCAgIGBZOGEgODggODggODggODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ2tpbGxOb3RlJywgWydOb3RlJywgJ3NoYXJlZE5vdGUnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oTm90ZSwgc2hhcmVkTm90ZSwgJGxvY2F0aW9uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkLCBwYXJlbnQpIHtcblxuXHRcdFx0aWYgKHBhcmVudCl7XG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIHBhcmVudCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNle1xuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdH1cblxuXHRcdFx0bm90ZSA9IE5vdGUoaWQpO1xuXHRcdFx0bm90ZS4kcmVtb3ZlKCk7XG5cblx0XHRcdGNvbnNvbGUubG9nKGlkKTtcblxuXHRcdFx0c2hhcmVkbm90ZSA9IHNoYXJlZE5vdGUoaWQpO1xuXHRcdFx0c2hhcmVkbm90ZS4kcmVtb3ZlKCk7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4YixkUFBZYmEsICAgLGFkUFBZYmEsIDhiICAgICAgZGIgICAgICBkOCA4OCxkUFBZYmEsICAgLGFkUFBZYmEsICAsYWRQUFlZYmEsIDhiLGRQUFliYSwgICxhZFBQWWIsODggIFxuLy8gODhQJyAgIGBcIjhhIGE4UF9fX19fODggYDhiICAgIGQ4OGIgICAgZDgnIDg4UCcgICAgXCI4YSBhOFwiICAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFwiICAgIGBZODggIFxuLy8gODggICAgICAgODggOFBQXCJcIlwiXCJcIlwiXCIgIGA4YiAgZDgnYDhiICBkOCcgIDg4ICAgICAgIGQ4IDhiICAgICAgIGQ4ICxhZFBQUFBQODggODggICAgICAgICA4YiAgICAgICA4OCAgXG4vLyA4OCAgICAgICA4OCBcIjhiLCAgICxhYSAgIGA4YmQ4JyAgYDhiZDgnICAgODhiLCAgICxhOFwiIFwiOGEsICAgLGE4XCIgODgsICAgICw4OCA4OCAgICAgICAgIFwiOGEsICAgLGQ4OCAgXG4vLyA4OCAgICAgICA4OCAgYFwiWWJiZDhcIicgICAgIFlQICAgICAgWVAgICAgIDhZXCJZYmJkOFwiJyAgIGBcIlliYmRQXCInICBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiOGJiZFBcIlk4ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnbmV3Qm9hcmQnLCBbJ25ld05vdGUnLFxuXHRmdW5jdGlvbihuZXdOb3RlKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ym9hcmRJRCA9ICQkXy5yYW5kb21pemUoKTtcblxuXHRcdFx0Ly9CT0FSRFNcblx0XHRcdHZhciBib2FyZFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvYm9hcmRzLycgKyBib2FyZElEICk7XG5cdFx0XHRib2FyZFJlZi5zZXQoe1xuXHRcdFx0XHR0aXRsZTogJycsXG5cdFx0XHRcdGlkOiBib2FyZElELFxuXHRcdFx0XHRzdGFycmVkOiBudWxsLFxuXHRcdFx0XHRsYXN0RWRpdGVkOiBEYXRlLm5vdygpLFxuXHRcdFx0XHRub3RlczpbXVxuXHRcdFx0fSk7XG5cblx0XHRcdG5ld05vdGUoYm9hcmRJRCk7XG5cblx0XHRcdHJldHVybiBib2FyZElEO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICA4OCA4OCA4OCA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODggICAgICAgIFwiXCIgODggODggODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4ICAgICAgICAgICA4OCA4OCA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODggICAsZDggIDg4IDg4IDg4IDg4LGRQUFliYSwgICAsYWRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYiw4OCAgXG4vLyA4OCAsYThcIiAgIDg4IDg4IDg4IDg4UCcgICAgXCI4YSBhOFwiICAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFwiICAgIGBZODggIFxuLy8gODg4OFsgICAgIDg4IDg4IDg4IDg4ICAgICAgIGQ4IDhiICAgICAgIGQ4ICxhZFBQUFBQODggODggICAgICAgICA4YiAgICAgICA4OCAgXG4vLyA4OGBcIlliYSwgIDg4IDg4IDg4IDg4YiwgICAsYThcIiBcIjhhLCAgICxhOFwiIDg4LCAgICAsODggODggICAgICAgICBcIjhhLCAgICxkODggIFxuLy8gODggICBgWThhIDg4IDg4IDg4IDhZXCJZYmJkOFwiJyAgIGBcIlliYmRQXCInICBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiOGJiZFBcIlk4ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdraWxsQm9hcmQnLCBbJ0JvYXJkJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKEJvYXJkLCAkbG9jYXRpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHBhcmVudCkge1xuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0XHRib2FyZCA9IEJvYXJkKGlkKTtcblx0XHRcdGJvYXJkLiRyZW1vdmUoKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcIlwiICAgICAgICAgICAgXCJcIiAgICxkICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgXG4vLyAgLGFkUFBZYmEsICAsYWRQUFliYSwgIDhiLGRQUFliYSwgICAsYWRQUFliYSwgICxhZFBQWWJhLCA4YixkUFBZYmEsIE1NODhNTU0gOGIsZFBQWWJhLCA4OCAgLGFkUFBZYmEsIDg4IE1NODhNTU0gOGIgICAgICAgZDggIFxuLy8gYThcIiAgICAgXCJcIiBhOFwiICAgICBcIjhhIDg4UCcgICBgXCI4YSBhOFwiICAgICBcIlwiIGE4UF9fX19fODggODhQJyAgIGBcIjhhICA4OCAgICA4OFAnICAgXCJZOCA4OCBhOFwiICAgICBcIlwiIDg4ICAgODggICAgYDhiICAgICBkOCcgIFxuLy8gOGIgICAgICAgICA4YiAgICAgICBkOCA4OCAgICAgICA4OCA4YiAgICAgICAgIDhQUFwiXCJcIlwiXCJcIlwiIDg4ICAgICAgIDg4ICA4OCAgICA4OCAgICAgICAgIDg4IDhiICAgICAgICAgODggICA4OCAgICAgYDhiICAgZDgnICAgXG4vLyBcIjhhLCAgICxhYSBcIjhhLCAgICxhOFwiIDg4ICAgICAgIDg4IFwiOGEsICAgLGFhIFwiOGIsICAgLGFhIDg4ICAgICAgIDg4ICA4OCwgICA4OCAgICAgICAgIDg4IFwiOGEsICAgLGFhIDg4ICAgODgsICAgICBgOGIsZDgnICAgIFxuLy8gIGBcIlliYmQ4XCInICBgXCJZYmJkUFwiJyAgODggICAgICAgODggIGBcIlliYmQ4XCInICBgXCJZYmJkOFwiJyA4OCAgICAgICA4OCAgXCJZODg4IDg4ICAgICAgICAgODggIGBcIlliYmQ4XCInIDg4ICAgXCJZODg4ICAgICBZODgnICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDgnICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDgnICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnY29uY2VudHJpY2l0eScsIFsnJGNvb2tpZXMnLFxuXHRmdW5jdGlvbigkY29va2llcykge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgcGFyZW50KSB7XG5cdFx0XHQkYm9keS5hZGRDbGFzcygnY29uY2VudHJpYycpLmF0dHIoJ2RhdGEtZGlyZWN0aW9uJywgXG5cdFx0XHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cmV0dXJuIHdpbmRvdy5kaXJlY3Rpb25zWysrJGNvb2tpZXMuZGlyZWN0aW9uICUgNF07XG5cdFx0XHRcdH1cblx0XHRcdClcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkYm9keS5yZW1vdmVDbGFzcygnY29uY2VudHJpYycpXG5cdFx0XHR9LCAxMDAwKVxuXHRcdH07XG5cdH1cbl0pO1xuXG5hcHAuZmFjdG9yeSgnbGF5ZXJpbmcnLCBbJyRyb290U2NvcGUnLCAnJGNvb2tpZXMnLFxuXHRmdW5jdGlvbigkcm9vdFNjb3BlLCAkY29va2llcykge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblxuXHRcdFx0Y29uc29sZS5sb2coJHJvb3RTY29wZS5sYXllcilcblxuXHRcdFx0aWYgKCRjb29raWVzLmxheWVyID09PSAnbGFuZCcpe1xuXHRcdFx0XHQkY29va2llcy5sYXllciA9ICdza3knO1xuXHRcdFx0XHQkcm9vdFNjb3BlLmxheWVyID0gJ3NreSc7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0JGNvb2tpZXMubGF5ZXIgPSAnbGFuZCc7XG5cdFx0XHRcdCRyb290U2NvcGUubGF5ZXIgPSAnbGFuZCc7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4ODg4ODg4ODg4OCA4OCA4OCAgICAgODg4ODg4ODg4ODg4IDg4ODg4ODg4ODg4IDg4ODg4ODg4YmEgICBhZDg4ODg4YmEgICBcbi8vIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgODggICAgICAgICAgODggICAgICBcIjhiIGQ4XCIgICAgIFwiOGIgIFxuLy8gODggICAgICAgICAgODggODggICAgICAgICAgODggICAgICA4OCAgICAgICAgICA4OCAgICAgICw4UCBZOCwgICAgICAgICAgXG4vLyA4OGFhYWFhICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgIDg4YWFhYWEgICAgIDg4YWFhYWFhOFAnIGBZOGFhYWFhLCAgICBcbi8vIDg4XCJcIlwiXCJcIiAgICAgODggODggICAgICAgICAgODggICAgICA4OFwiXCJcIlwiXCIgICAgIDg4XCJcIlwiXCI4OCcgICAgIGBcIlwiXCJcIlwiOGIsICBcbi8vIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgODggICAgICAgICAgODggICAgYDhiICAgICAgICAgICBgOGIgIFxuLy8gODggICAgICAgICAgODggODggICAgICAgICAgODggICAgICA4OCAgICAgICAgICA4OCAgICAgYDhiICBZOGEgICAgIGE4UCAgXG4vLyA4OCAgICAgICAgICA4OCA4ODg4ODg4ODg4OCA4OCAgICAgIDg4ODg4ODg4ODg4IDg4ICAgICAgYDhiICBcIlk4ODg4OFBcIiAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblxuYXBwLmZpbHRlcignb3JkZXJPYmplY3RCeScsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oaXRlbXMsIGZpZWxkLCByZXZlcnNlKSB7XG5cdHZhciBmaWx0ZXJlZCA9IFtdO1xuXHRhbmd1bGFyLmZvckVhY2goaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0ZmlsdGVyZWQucHVzaChpdGVtKTtcblx0fSk7XG5cdGZpbHRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0cmV0dXJuIChhW2ZpZWxkXSA+IGJbZmllbGRdID8gMSA6IC0xKTtcblx0fSk7XG5cdGlmKHJldmVyc2UpIGZpbHRlcmVkLnJldmVyc2UoKTtcblx0cmV0dXJuIGZpbHRlcmVkO1xuXHR9O1xufSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgLGFkODg4OGJhLCAgICxhZDg4ODhiYSwgICA4ODhiICAgICAgODggODg4ODg4ODg4ODg4IDg4ODg4ODg4YmEgICAgLGFkODg4OGJhLCAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ODg4ODg4ODg4IDg4ODg4ODg4YmEgICBhZDg4ODg4YmEgICBcbi8vICBkOFwiJyAgICBgXCI4YiBkOFwiJyAgICBgXCI4YiAgODg4OGIgICAgIDg4ICAgICAgODggICAgICA4OCAgICAgIFwiOGIgIGQ4XCInICAgIGBcIjhiICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgZDhcIiAgICAgXCI4YiAgXG4vLyBkOCcgICAgICAgICAgZDgnICAgICAgICBgOGIgODggYDhiICAgIDg4ICAgICAgODggICAgICA4OCAgICAgICw4UCBkOCcgICAgICAgIGA4YiA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICw4UCBZOCwgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgODggICAgICAgICAgODggODggIGA4YiAgIDg4ICAgICAgODggICAgICA4OGFhYWFhYThQJyA4OCAgICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OGFhYWFhICAgICA4OGFhYWFhYThQJyBgWThhYWFhYSwgICAgXG4vLyA4OCAgICAgICAgICAgODggICAgICAgICAgODggODggICBgOGIgIDg4ICAgICAgODggICAgICA4OFwiXCJcIlwiODgnICAgODggICAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODhcIlwiXCJcIlwiICAgICA4OFwiXCJcIlwiODgnICAgICBgXCJcIlwiXCJcIjhiLCAgXG4vLyBZOCwgICAgICAgICAgWTgsICAgICAgICAsOFAgODggICAgYDhiIDg4ICAgICAgODggICAgICA4OCAgICBgOGIgICBZOCwgICAgICAgICw4UCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICBgOGIgICAgICAgICAgIGA4YiAgXG4vLyAgWThhLiAgICAuYThQIFk4YS4gICAgLmE4UCAgODggICAgIGA4ODg4ICAgICAgODggICAgICA4OCAgICAgYDhiICAgWThhLiAgICAuYThQICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgYDhiICBZOGEgICAgIGE4UCAgXG4vLyAgIGBcIlk4ODg4WVwiJyAgIGBcIlk4ODg4WVwiJyAgIDg4ICAgICAgYDg4OCAgICAgIDg4ICAgICAgODggICAgICBgOGIgICBgXCJZODg4OFlcIicgICA4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4OCAgICAgIGA4YiAgXCJZODg4ODhQXCIgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXG5cbmFwcC5jb250cm9sbGVyKCdoZWxsb0N0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0aGVsbG9DdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdwb3J0YWxDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLFxuXHRcdCdOb3RlJyxcblx0XHQnbmV3Tm90ZScsIFxuXHRcdCdraWxsTm90ZScsXG5cdFx0J25ld0JpdCcsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckY29va2llcycsXG5cdFx0J0F1dGgnLFxuXHRcdCdMb2dpbicsXG5cdFx0J2ZpcnN0Tm90ZScsXG5cdFx0cG9ydGFsQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignbm90ZUN0cmwnLCBcblx0W1xuXHRcdCckY29udHJvbGxlcicsXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCduZXdOb3RlJywgXG5cdFx0J2tpbGxOb3RlJyxcblx0XHQnc2hhcmVOb3RlJyxcblx0XHQnbmV3Qml0Jyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyRjb29raWVzJyxcblx0XHQnTG9nb3V0Jyxcblx0XHQnY29uY2VudHJpY2l0eScsXG5cdFx0J2xheWVyaW5nJyxcblx0XHQnTWV0YScsXG5cdFx0J2hpc3RvcnlDb3VudCcsXG5cdFx0J2hpc3RvcmljYWwnLFxuXHRcdG5vdGVDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdpbmZvQ3RybCcsIFxuXHRbXG5cdFx0JyRzY29wZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0aW5mb0N0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ3RleHRDdHJsJywgXG5cdFtcblx0XHQnJHNjb3BlJyxcblx0XHQnJHJvdXRlUGFyYW1zJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLCBcblx0XHQnaG90a2V5cycsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHR0ZXh0Q3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignY2hhbmdlQ3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnQm9hcmRzJyxcblx0XHQnbmV3Qm9hcmQnLFxuXHRcdCdOb3RlJyxcblx0XHQnc2hhcmVkTm90ZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckd2luZG93Jyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdGNoYW5nZUN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2hpc3RvcnlDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLFxuXHRcdCduZXdCb2FyZCcsXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyR3aW5kb3cnLFxuXHRcdCckY29va2llcycsXG5cdFx0J0hpc3RvcnknLFxuXHRcdCdNZXRhJyxcblx0XHRoaXN0b3J5Q3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignYm9hcmRDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLCBcblx0XHQnQm9hcmQnLFxuXHRcdCdraWxsQm9hcmQnLFxuXHRcdCdOb3RlcycsXG5cdFx0J1NoYXJlZE5vdGVzJyxcblx0XHQnbmV3Tm90ZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckaW50ZXJ2YWwnLFxuXHRcdCckY29va2llcycsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdCdsYXllcmluZycsXG5cdFx0J2hpc3RvcnlDb3VudCcsXG5cdFx0Ym9hcmRDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdsaXN0Q3RybCcsIFxuXHRbXG5cdFx0JyRzY29wZScsIFxuXHRcdCdOb3RlcycsXG5cdFx0J1NoYXJlZE5vdGVzJyxcblx0XHQnbmV3Tm90ZScsXG5cdFx0J2tpbGxOb3RlJyxcblx0XHQnQm9hcmRzJyxcblx0XHQnbmV3Qm9hcmQnLFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdCdsYXllcmluZycsXG5cdFx0J2hpc3RvcnlDb3VudCcsXG5cdFx0bGlzdEN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ3NoYXJlQ3RybCcsIFxuXHRbXG5cdFx0JyRzY29wZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCdNZXRhJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCdzaGFyZU5vdGUnLFxuXHRcdCdhZGRUb1NoYXJlZE5vdGUnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdHNoYXJlQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignY29sb3Bob25DdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLCBcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHRjb2xvcGhvbkN0cmxcblx0XVxuKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwaUtleTogXCJBSXphU3lEN2oyYmtnWmczbGVkLUNSMHJIOHdYTWdrc1k0c1AybzhcIixcbiAgYXV0aERvbWFpbjogXCJsaWNrLmZpcmViYXNlYXBwLmNvbVwiLFxuICBkYXRhYmFzZVVSTDogXCJodHRwczovL2xpY2suZmlyZWJhc2Vpby5jb21cIixcbiAgcHJvamVjdElkOiBcImZpcmViYXNlLWxpY2tcIixcbiAgc3RvcmFnZUJ1Y2tldDogXCJmaXJlYmFzZS1saWNrLmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjMzMDQ4MzI5MjkxN1wiXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHRCb2FyZCxcblx0a2lsbEJvYXJkLFxuXHROb3Rlcyxcblx0U2hhcmVkTm90ZXMsXG5cdG5ld05vdGUsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRpbnRlcnZhbCxcblx0JGNvb2tpZXMsXG5cdExvZ291dCxcblx0Y29uY2VudHJpY2l0eSxcblx0bGF5ZXJpbmcsXG5cdGhpc3RvcnlDb3VudFxuKSB7XG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2JvYXJkJztcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbClcblxuICAgICRzY29wZS4kd2F0Y2goJ2JvYXJkLnRpdGxlJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0aWYgKG5ld1ZhbHVlKXtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9IG5ld1ZhbHVlICsgJyDigJMgKGJvYXJkKSDigJMgTElDSyc7XG5cdFx0fWVsc2V7XG5cdFx0XHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnVW50aXRsZWQgQm9hcmQg4oCTIExJQ0snO1xuXHRcdH1cblx0fSk7XG5cblx0Qm9hcmQoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ2JvYXJkJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkc2NvcGUuYm9hcmQuc3RhcnJlZClcblx0XHRcdFx0XHQkc2NvcGUuc3Rhck5vdGUoJHNjb3BlLmJvYXJkLnN0YXJyZWQpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoJHNjb3BlLmJvYXJkLnRpdGxlID09PSAnJylcblx0XHRcdFx0XHQkKCcuYm9hcmRfdGl0bGUgdGV4dGFyZWEnKS5mb2N1cygpXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoISRzY29wZS5ib2FyZC5sYXN0RWRpdGVkKVxuXHRcdFx0XHRcdCRzY29wZS5ib2FyZC5sYXN0RWRpdGVkID0gRGF0ZS5ub3coKVxuXHRcdFx0fSlcblx0XHR9KTtcblxuXHROb3Rlcygkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZXMnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5ib2FyZC5zdGFycmVkKVxuXHRcdFx0XHRcdCRzY29wZS5zdGFyTm90ZSgkc2NvcGUuYm9hcmQuc3RhcnJlZClcblx0XHRcdH0pXG5cdFx0fSk7XG5cblx0U2hhcmVkTm90ZXMoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ3NoYXJlZG5vdGVzJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcikge1xuXG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdHNoYXJlZEdlbmVyYXRvcihcblx0XHRcdFx0JHNjb3BlLnNoYXJlZG5vdGVzLCBcblx0XHRcdFx0d2luZG93LmdldE9iamVjdERlZXBTaXplKCRzY29wZS5zaGFyZWRub3RlcyksIFxuXHRcdFx0XHRmdW5jdGlvbihzaGFyZWROb3Rlcyl7XG5cdFx0XHRcdFx0JHNjb3BlLnNoYXJlZEZpbHRlciA9IHNoYXJlZE5vdGVzO1xuXHRcdFx0XHR9XG5cdFx0XHQpXG5cblx0XHR9KTtcblxuXHRzaGFyZWRHZW5lcmF0b3IgPSBmdW5jdGlvbihub3RlcywgY291bnQsIGNhbGxiYWNrKXtcblxuXHRcdHZhciBzaGFyZWQgPSB7fSxcblx0XHRcdHNoYXJlZENvdW50ZXIgPSAwO1xuXG5cdFx0YW5ndWxhci5mb3JFYWNoKG5vdGVzLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGlmICh0eXBlb2YoZSkgPT09ICdvYmplY3QnICYmICEhZSl7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24oZiwgbCl7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0KGwgPT0gd2luZG93LnVpZCB8fCBsID09ICRjb29raWVzLmVtYWlsX2VzY2FwZWQpIFxuXHRcdFx0XHRcdFx0JiYgKGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9PT0gJHJvdXRlUGFyYW1zLmlkKVxuXHRcdFx0XHRcdCl7XG5cdFx0XHRcdFx0XHRzaGFyZWRba10gPSBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblxuXHRcdFx0XHRzaGFyZWRDb3VudGVyKys7XG5cdFx0XHRcdGlmIChzaGFyZWRDb3VudGVyID09PSBjb3VudCAmJiAhJC5pc0VtcHR5T2JqZWN0KHNoYXJlZCkpXG5cdFx0XHRcdFx0Y2FsbGJhY2soc2hhcmVkKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxuXG4gICAgJHNjb3BlLmNvbmNlbnRyaWMgPSBmdW5jdGlvbigpe1xuICAgIFx0Y29uY2VudHJpY2l0eSgpO1xuICAgIH07XG5cbiAgICAkc2NvcGUubGlnaHRidWxiID0gZnVuY3Rpb24oKXtcbiAgICBcdGxheWVyaW5nKCk7XG4gICAgfTtcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0dvIGJhY2sgdG8gTGlzdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlbnRlcicsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRuZXdOb3RlKCRzY29wZS5ib2FyZC5pZCk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbihib2FyZElEKXtcblx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld05vdGUoYm9hcmRJRCkpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkKCkpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUuaGlzdG9yaWNhbCA9IF8uZGVib3VuY2UoZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUuYm9hcmQubGFzdEVkaXRlZCA9IERhdGUubm93KCk7XG5cblx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdFx0fSlcblxuXHRcdGNvbnNvbGUubG9nKCdISVNUT1JJQ0FMJylcblx0fSwgNTAwMClcblxuXHQkc2NvcGUuc3Rhck5vdGUgPSBmdW5jdGlvbihpZCkge1xuXHRcdGNvbnNvbGUubG9nKGlkKVxuXG5cdFx0JCgnLmJvYXJkX25vdGUnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoYXQgPSAkKHRoaXMpXG5cblx0XHRcdGlmIChpZCAmJiBpZCA9PT0gJHRoYXQuYXR0cignZGF0YS1pZCcpKXtcblx0XHRcdFx0JHRoYXQuYWRkQ2xhc3MoJ3N0YXJyZWQnKVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCR0aGF0LnJlbW92ZUNsYXNzKCdzdGFycmVkJylcblx0XHRcdH1cblxuXHRcdH0pXG5cblx0XHQkc2NvcGUuYm9hcmQuc3RhcnJlZCA9IGlkO1xuXHR9XG5cblx0dmFyIGlzRW1wdHkgPSB0cnVlO1xuXG5cdGlzQm9hcmRFbXB0eSA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCQoJy5ib2FyZF9ib2R5IHVsIGxpJykubGVuZ3RoID4gMClcblx0XHRcdGlzRW1wdHkgPSBmYWxzZTtcblx0XHRlbHNlXG5cdFx0XHRpc0VtcHR5ID0gdHJ1ZTtcblxuXHRcdCRzY29wZS5ib2FyZElzRW1wdHkgPSBpc0VtcHR5O1xuXHR9O1xuXG5cdCRzY29wZS5raWxsV2FybiA9IGZhbHNlO1xuXG5cdCRzY29wZS5raWxsQm9hcmQgPSBmdW5jdGlvbihpZCl7XG5cdFx0aWYgKCRzY29wZS5ib2FyZElzRW1wdHkpe1xuXHRcdFx0a2lsbEJvYXJkKGlkKTtcblx0XHR9ZWxzZXtcblx0XHRcdCRzY29wZS5raWxsV2FybiA9IHRydWU7XG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5raWxsV2FybiA9IGZhbHNlO1xuXHRcdFx0fSwgMzAwMCk7XG5cdFx0fVxuXHR9XG5cblx0ZW1wdHlXYXRjaGVyID0gJGludGVydmFsKGlzQm9hcmRFbXB0eSwgMTAwMCk7XG5cblx0JHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihuZXh0LCBjdXJyZW50KSB7IFxuXHRcdCRpbnRlcnZhbC5jYW5jZWwoZW1wdHlXYXRjaGVyKVxuXHR9KTtcblxuXHQkc2NvcGUuYm9hcmRJdGVtT3B0c19wcml2YXRlID0ge1xuXHQgICAgc2l6ZVg6ICcxJyxcblx0ICAgIHNpemVZOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IDIgOiAxLFxuXHQgICAgcm93OiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/ICdub3RlLnkgKiAyJyA6ICdub3RlLnknLFxuXHQgICAgY29sOiAnbm90ZS54J1xuXHR9O1xuXG5cdCRzY29wZS5ib2FyZEl0ZW1PcHRzX3NoYXJlZCA9IHtcblx0ICAgIHNpemVYOiAnMScsXG5cdCAgICBzaXplWTogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAyIDogMSxcblx0ICAgIHJvdzogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAnbm90ZS5wYXJ0aWNpcGFudHNbXCInICsgJGNvb2tpZXMuZW1haWxfZXNjYXBlZCArICdcIl0ueSAqIDInIDogJ25vdGUucGFydGljaXBhbnRzW1wiJyArICRjb29raWVzLmVtYWlsX2VzY2FwZWQgKyAnXCJdLnknLFxuXHQgICAgY29sOiAnbm90ZS5wYXJ0aWNpcGFudHNbXCInICsgJGNvb2tpZXMuZW1haWxfZXNjYXBlZCArICdcIl0ueCdcblx0fTtcblxuXHQkc2NvcGUuYm9hcmRHcmlkT3B0cyA9IHtcblx0ICAgIGNvbHVtbnM6IDUsXG5cdCAgICBtb2JpbGVNb2RlRW5hYmxlZDogZmFsc2UsXG5cdCAgICBtaW5Db2x1bW5zOiA0LFxuXHQgICAgZmxvYXRpbmc6IGZhbHNlLFxuXHQgICAgc3dhcHBpbmc6IHRydWUsXG5cdCAgICBwdXNoaW5nOiBmYWxzZSxcblx0ICAgIG1pblJvd3M6IDQsXG5cdCAgICBtYXhSb3dzOiAxMCxcblx0ICAgIGRlZmF1bHRTaXplWDogMSxcblx0ICAgIGRlZmF1bHRTaXplWTogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAyIDogMSxcblx0ICAgIG1hcmdpbnM6IFs1LCA1XSxcblx0ICAgIHJlc2l6YWJsZToge1xuXHQgICAgICAgZW5hYmxlZDogZmFsc2UsXG5cdCAgICB9LFxuXHRcdGRyYWdnYWJsZToge1xuXHRcdFx0Ly8gaGFuZGxlOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/ICcuZ3JhYmJlcicgOiBudWxsXG5cdFx0XHQvLyBoYW5kbGU6ICcuZ3JhYmJlcidcblx0XHR9XG5cdH07XG5cblx0aGlzdG9yeUNvdW50KGZ1bmN0aW9uKHRoZU51bWJlcil7XG5cdFx0JHNjb3BlLmhpc3RvcnlDb3VudGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGVOdW1iZXI7XG5cdFx0fVxuXHR9KVxuXG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0XHRMb2dvdXQoKTtcblx0fVxuXG5cdCRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS50b2dnbGVDbGFzcygnbWVudU9wZW4nKTtcdFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZU1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykucmVtb3ZlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLFxuXHRCb2FyZHMsXG5cdG5ld0JvYXJkLFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCR3aW5kb3csXG5cdCRjb29raWVzXG4pIHtcblx0XHRcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuXHQkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpXG5cblx0Qm9hcmRzKCkuJGJpbmRUbygkc2NvcGUsICdib2FyZHMnKTtcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnU2VuZCBub3RlIHRvIGJvYXJkIOKAkyBMSUNLJztcblxuXHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblx0XHRjb25zb2xlLmxvZygnU0hBUkVEJylcblx0XHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0fSlcblx0fWVsc2V7XG5cdFx0Y29uc29sZS5sb2coJ1BSSVZBVEUnKVxuXHRcdE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHR9KVxuXHR9XG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2NoYW5nZSc7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhaCwgZm9yZ2V0IGl0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5nb0JhY2soKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcdFx0XG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvc2hhcmVkbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHRlbHNlXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArICRyb3V0ZVBhcmFtcy5pZCk7XG5cdH1cblxuXHQkc2NvcGUuY2hhbmdlQm9hcmQgPSBmdW5jdGlvbihib2FyZCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQgPSBib2FyZDtcblx0XHRlbHNlXG5cdFx0XHQkc2NvcGUubm90ZS5wYXJlbnQgPSBib2FyZDtcblxuXHRcdCRzY29wZS5nb0JhY2soKTtcblx0fTtcblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBuZXdCb2FyZElEID0gbmV3Qm9hcmQoKVxuXG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQgPSBuZXdCb2FyZElEO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IG5ld0JvYXJkSUQ7XG5cblx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyBuZXdCb2FyZElEKTtcblx0fVxuXG5cdCRzY29wZS5ub0JvYXJkID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9IGZhbHNlO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IG51bGw7XG5cblx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXRcbikge1xuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuXHQkc2NvcGUucGFnZUNsYXNzID0gJ2NvbG9waG9uJztcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnQ29sb3Bob24g4oCTIExJQ0snO1xuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnR28gYmFjayB0byBMaXN0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHRcdH1cblx0XHR9KVxuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSxcblx0JHRpbWVvdXRcbikge1xuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KTtcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnTElDSyc7XG5cdFxuXHQkc2NvcGUucGFnZUNsYXNzID0gJ2hlbGxvJztcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLFxuXHQkc2NvcGUsXG5cdG5ld0JvYXJkLFxuXHQkcm91dGUsXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCR3aW5kb3csXG5cdCRjb29raWVzLFxuXHRIaXN0b3J5XG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdoaXN0b3J5JztcblxuICAgIC8vICRzY29wZS5tZXRhID0gTWV0YTtcblxuICAgICQoJyNtYWluJykucmVtb3ZlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbCk7XG5cbiAgICB3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnUmVjZW50bHkgZWRpdGVkIG5vdGVzIOKAkyBMSUNLJztcblxuXHRIaXN0b3J5KCkuJGJpbmRUbygkc2NvcGUsICdoaXN0b3J5Jylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdCRzY29wZS5oaXN0b3J5U29ydGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG5vdGVzID0gW107XG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5oaXN0b3J5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1xuXHRcdFx0XHRcdFx0ZS5pZCA9IGs7XG5cdFx0XHRcdFx0XHRub3Rlcy5wdXNoKGUpO1x0XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIG5vdGVzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSkgXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FoLCBmb3JnZXQgaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmdvQmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdCRzY29wZS5lZGl0ZWRPbiA9IGZ1bmN0aW9uKHRpbWUpe1xuXHRcdHZhciBpbmNvbWluZyA9IG1vbWVudCh0aW1lKTtcblx0XHRyZXR1cm4gaW5jb21pbmcuZm9ybWF0KCdIOm0gZGRkIERvIE1NTU0nKVxuXHR9XG5cblx0aGlzdG9yeUNvdW50ID0gMDtcblxuXHQkc2NvcGUuaGlzdG9yeUNvbXBhcmUgPSBmdW5jdGlvbihkZXZpY2UsIHRpbWUpe1xuXHRcdGlmIChcblx0XHRcdChkZXZpY2UgIT09IHdpbmRvdy5kZXZpY2UpIHx8IFxuXHRcdFx0KCB0aW1lIDwgKCBEYXRlLm5vdygpIC0gMzYwMDAwMCApIClcblx0XHQpe1xuXHRcdFx0aGlzdG9yeUNvdW50Kys7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9ZWxzZSByZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQkc2NvcGUuZWRpdGVkQnkgPSBmdW5jdGlvbihhdXRob3Ipe1xuXHRcdHJldHVybiB3aW5kb3cuZW1haWxVbmVzY2FwZXIoYXV0aG9yKTtcblx0fVxuXG5cdCRzY29wZS5jbGVhckhpc3RvcnkgPSBmdW5jdGlvbigpe1xuXHRcdC8vICRzY29wZS5tZXRhLmhpc3RvcnkgPSB7fTtcblxuXHRcdC8vIE1ldGEuXG5cdFx0SGlzdG9yeSgpLiRyZW1vdmUoKS50aGVuKCgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdISVNUT1JZIENMRUFSRUQnKVxuXHRcdH0pXG5cdH1cblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoaGlzdG9yeUNvdW50ID09PSAwKVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jylcblx0XHRlbHNlXG5cdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkc2NvcGUsIFxuXHRob3RrZXlzLFxuXHQkdGltZW91dFxuKSB7XG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG5cdCRzY29wZS5wYWdlQ2xhc3MgPSAnaW5mbyc7XG5cblx0d2luZG93LmRvY3VtZW50LnRpdGxlID0gJ0hvdyB0byDigJMgTElDSyc7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdHbyBiYWNrIHRvIExpc3QnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdCRzY29wZS5zbGlkZUNvdW50ID0gMDtcblxuXHQkaW5mbyA9ICQoJy5pbmZvJyk7XG5cblx0JHNjb3BlLnNsaWNrQ29uZmlnID0ge1xuXHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0ZG90czogdHJ1ZSxcblx0XHRpbmZpbml0ZTogZmFsc2UsXG5cdFx0ZXZlbnQ6IHtcblx0XHRcdGFmdGVyQ2hhbmdlOiBmdW5jdGlvbiAoZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSkge1xuXHRcdFx0XHQkaW5mby5yZW1vdmVDbGFzcygnZmlyc3RTbGlkZSBsYXN0U2xpZGUnKVxuXHRcdFx0XHRpZiAoY3VycmVudFNsaWRlID09PSAwKXtcblx0XHRcdFx0XHQkaW5mby5hZGRDbGFzcygnZmlyc3RTbGlkZScpXG5cdFx0XHRcdH1lbHNlIGlmIChjdXJyZW50U2xpZGUgPT09ICgkc2NvcGUuc2xpZGVDb3VudCAtIDEpKXtcblx0XHRcdFx0XHQkaW5mby5hZGRDbGFzcygnbGFzdFNsaWRlJylcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGluaXQ6IGZ1bmN0aW9uKHNsaWNrKXtcblx0XHRcdFx0JHNjb3BlLnNsaWRlQ291bnQgPSAkKCcuc2xpY2stc2xpZGVyIC5zbGljay1zbGlkZScpLmxlbmd0aFxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcblx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkc2NvcGUsIFxuXHROb3Rlcyxcblx0U2hhcmVkTm90ZXMsXG5cdG5ld05vdGUsXG5cdGtpbGxOb3RlLFxuXHRCb2FyZHMsXG5cdG5ld0JvYXJkLFxuXHQkcm91dGUsIFxuXHRob3RrZXlzLFxuXHQkbG9jYXRpb24sXG5cdCRjb29raWVzLFxuXHQkdGltZW91dCxcblx0TG9nb3V0LFxuXHRjb25jZW50cmljaXR5LFxuXHRsYXllcmluZyxcblx0aGlzdG9yeUNvdW50XG4pIHtcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnbGlzdCc7XG5cbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpO1xuXG4gICAgd2luZG93LmRvY3VtZW50LnRpdGxlID0gJ0hvbWUg4oCTIExJQ0snO1xuXG4gICAgY29uc29sZS5sb2coJ0xJU1QnKVxuXG5cdE5vdGVzKCkuJGJpbmRUbygkc2NvcGUsICdub3RlcycpLnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblxuXHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdCRzY29wZS5wcml2YXRlRmlsdGVyID0gZnVuY3Rpb24odCl7XG5cblx0XHRcdHZhciBub3RlcyA9IFtdXG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh0LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gJ29iamVjdCcgJiYgISFlKXtcdFxuXHRcdFx0XHRcdGlmICghZS5sYXN0RWRpdGVkKSBlLmxhc3RFZGl0ZWQgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRcdG5vdGVzLnB1c2goZSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBub3Rlcztcblx0XHR9XG5cdH0pXG5cblx0Qm9hcmRzKCkuJGJpbmRUbygkc2NvcGUsICdib2FyZHMnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHQkc2NvcGUuYm9hcmRzRmlsdGVyID0gZnVuY3Rpb24odCl7XG5cdFx0XHRcdHZhciBib2FyZHMgPSBbXVxuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuYm9hcmRzLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1x0XG5cdFx0XHRcdFx0XHRpZiAoIWUubGFzdEVkaXRlZCkgZS5sYXN0RWRpdGVkID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRcdGJvYXJkcy5wdXNoKGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRyZXR1cm4gYm9hcmRzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFNoYXJlZE5vdGVzKCkuJGJpbmRUbygkc2NvcGUsICdzaGFyZWRub3RlcycpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHQkc2NvcGUuc2hhcmVkRmlsdGVyID0gZnVuY3Rpb24oZSl7XG5cblx0XHRcdFx0dmFyIHNoYXJlZCA9IFtdO1xuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChlLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1xuXHRcdFx0XHRcdFx0aWYgKCFlLmxhc3RFZGl0ZWQpIGUubGFzdEVkaXRlZCA9IERhdGUubm93KCk7XG5cblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChlLnBhcnRpY2lwYW50cywgZnVuY3Rpb24oZiwgbCl7XG5cdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHQobCA9PSB3aW5kb3cudWlkIHx8IGwgPT0gJGNvb2tpZXMuZW1haWxfZXNjYXBlZCkgXG5cdFx0XHRcdFx0XHRcdFx0JiYgKCFlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQpXG5cdFx0XHRcdFx0XHRcdCl7XG5cdFx0XHRcdFx0XHRcdFx0c2hhcmVkLnB1c2goZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkc2NvcGUuc2hhcmVkQ291bnQgPSBzaGFyZWQubGVuZ3RoO1xuXG5cdFx0XHRcdHJldHVybiBzaGFyZWQ7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnZXNjJywgJ3RhYicsICdyaWdodCcsICdsZWZ0J10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoJHNjb3BlLmxvb2tpbmdBdCA9PT0gJ2JvYXJkcycpXG5cdFx0XHRcdFx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0ID0gJ25vdGVzJztcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCRzY29wZS5sb29raW5nQXQgPSB3aW5kb3cubGlzdExvb2tpbmdBdCA9ICdib2FyZHMnO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cbiAgICAkc2NvcGUuY29uY2VudHJpYyA9IGZ1bmN0aW9uKCl7XG4gICAgXHRjb25jZW50cmljaXR5KCk7XG4gICAgfTtcblxuICAgICRzY29wZS5saWdodGJ1bGIgPSBmdW5jdGlvbigpe1xuICAgIFx0bGF5ZXJpbmcoKTtcbiAgICB9O1xuXG5cdGlmICh3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggPiAyICYmIHdpbmRvdy5oaXN0b3JpY2FsW3dpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aCAtIDJdLmluZGV4T2YoJ2JvYXJkJykgPiAwKVxuXHRcdCRzY29wZS5sb29raW5nQXQgPSB3aW5kb3cubGlzdExvb2tpbmdBdCA9ICdib2FyZHMnO1xuXG5cdCRzY29wZS5sb29raW5nQXQgPSB3aW5kb3cubGlzdExvb2tpbmdBdDtcblxuXHQkc2NvcGUuJHdhdGNoKCdsb29raW5nQXQnLCBmdW5jdGlvbigpe1xuXHRcdCQoJ2JvZHknKS5zY3JvbGxUb3AoMClcblx0XHR3aW5kb3cubGlzdExvb2tpbmdBdCA9ICRzY29wZS5sb29raW5nQXQ7XG5cdH0pO1xuXG5cdGhpc3RvcnlDb3VudChmdW5jdGlvbih0aGVOdW1iZXIpe1xuXHRcdCRzY29wZS5oaXN0b3J5Q291bnRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhlTnVtYmVyO1xuXHRcdH1cblx0fSlcblxuXHQkc2NvcGUubmV3Tm90ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ub3RlLycgKyBuZXdOb3RlKCkpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkKCkpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUua2lsbE5vdGUgPSBmdW5jdGlvbihpZCl7XG5cdFx0a2lsbE5vdGUoaWQpO1xuXHR9XG5cblx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG5cdFx0TG9nb3V0KCk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9XG5cblx0JHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnRvZ2dsZUNsYXNzKCdtZW51T3BlbicpO1x0XG5cdH07XG5cblx0JHNjb3BlLmNsb3NlTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS5yZW1vdmVDbGFzcygnbWVudU9wZW4nKTtcdFxuXHR9O1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRjb250cm9sbGVyLFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0Tm90ZSxcblx0c2hhcmVkTm90ZSxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdHNoYXJlTm90ZSxcblx0bmV3Qml0LFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsIFxuXHRob3RrZXlzLFxuXHQkdGltZW91dCxcblx0JGxvY2F0aW9uLFxuXHQkY29va2llcyxcblx0TG9nb3V0LFxuXHRjb25jZW50cmljaXR5LFxuXHRsYXllcmluZyxcblx0TWV0YSxcblx0aGlzdG9yeUNvdW50LFxuXHRoaXN0b3JpY2FsXG4pIHtcblxuXHRjb25zb2xlLmxvZygnTk9URScpXG5cblx0JHNjb3BlLnRvdWNoeSA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHdpbmRvdy5pc190b3VjaF9kZXZpY2UoKTtcblx0fVxuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuXHR2YXIgc2hvd2luZ0NoZWF0c2hlZXQgPSBmYWxzZTtcblx0XG5cdCRzY29wZS5jb21tYW5kSXNQcmVzc2VkID0gZmFsc2U7XG5cdCRzY29wZS5hbHRJc1ByZXNzZWQgPSBmYWxzZTtcblx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IGZhbHNlO1xuICAgICRzY29wZS5zaGFyZVByb21wdCA9IGZhbHNlO1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnbm90ZSc7XG5cbiAgICAkc2NvcGUuZmlsdGVyZWQgPSBmYWxzZTtcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbCk7XG5cbiAgICAkc2NvcGUuJHdhdGNoKCdub3RlLnRpdGxlJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0aWYgKG5ld1ZhbHVlKXtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9IG5ld1ZhbHVlICsgJyDigJMgKG5vdGUpIOKAkyBMSUNLJztcblx0XHR9ZWxzZXtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdVbnRpdGxlZCBOb3RlIOKAkyBMSUNLJztcblx0XHR9XG5cdH0pO1xuXG4gICAgdmFyIGtleXNVcCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHQkc2NvcGUuYWx0SXNQcmVzc2VkID0gZmFsc2U7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcbiAgICB9XG5cbiAgICAkKHdpbmRvdykub24oe1xuICAgIFx0Ymx1cjoga2V5c1VwLFxuICAgIFx0Zm9jdXM6IGtleXNVcFxuICAgIH0pO1xuXG4gICAgJHNjb3BlLmNvbmNlbnRyaWMgPSBmdW5jdGlvbigpe1xuICAgIFx0Y29uY2VudHJpY2l0eSgpO1xuICAgIH07XG5cbiAgICAkc2NvcGUubGlnaHRidWxiID0gZnVuY3Rpb24oKXtcbiAgICBcdGxheWVyaW5nKCk7XG4gICAgfTtcblxuICAgIGlmICgkbG9jYXRpb24ucGF0aCgpLmluZGV4T2YoJ3NoYXJlZCcpID4gMCl7XG5cbiAgICBcdHNoYXJlZE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblx0XHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXHRcdFx0XHQkc2NvcGUub25Ob3RlT3BlbigpO1xuXHRcdFx0fSk7XG5cbiAgICB9ZWxzZXtcbiAgICBcdFxuXHRcdFx0Tm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKSB7XG5cdFx0XHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZigkc2NvcGUubm90ZS5ib2R5KSA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdFx0bmV3Tm90ZSgnJywgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHNjb3BlLm9uTm90ZU9wZW4oKTtcblx0XHRcdFx0fSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLm9uTm90ZU9wZW4gPSBmdW5jdGlvbigpe1xuICAgIFx0JHNjb3BlLmNsb3NlQml0TWVudXMoKTtcbiAgICBcdCRzY29wZS51bnNlbGVjdG9yKCk7XG4gICAgXHQkc2NvcGUubm90ZS5raWxsID0gZmFsc2U7XG5cbiAgICBcdGlmICgkc2NvcGUubm90ZS50aXRsZSA9PT0gJycpXG4gICAgXHRcdCQoJy5ub3RlX3RpdGxlIHRleHRhcmVhJykuZm9jdXMoKVxuICAgIH1cblxuICAgIE1ldGEoKS4kYmluZFRvKCRzY29wZSwgJ21ldGEnKVxuICAgIFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuICAgIFx0fSlcblxuICAgICRzY29wZS5zaGFyZUFjdGl2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoJGxvY2F0aW9uLnBhdGgoKS5pbmRleE9mKCdzaGFyZWQnKSA+IDApXG4gICAgXHRcdHJldHVybiB0cnVlXG4gICAgXHRlbHNlIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuXG5cdC8vIGNvbnNvbGUubG9nKCRzY29wZS51cGxvYWRlcilcblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ODggICAgICAgIDg4ICAgLGFkODg4OGJhLCA4ODg4ODg4ODg4ODggODggICAgICBhOFAgIDg4ODg4ODg4ODg4IDhiICAgICAgICBkOCBhZDg4ODg4YmEgICBcblx0Ly8gXHQ4OCAgICAgICAgODggIGQ4XCInICAgIGBcIjhiICAgICA4OCAgICAgIDg4ICAgICw4OCcgICA4OCAgICAgICAgICAgWTgsICAgICw4UCBkOFwiICAgICBcIjhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggZDgnICAgICAgICBgOGIgICAgODggICAgICA4OCAgLDg4XCIgICAgIDg4ICAgICAgICAgICAgWTgsICAsOFAgIFk4LCAgICAgICAgICBcblx0Ly8gXHQ4OGFhYWFhYWFhODggODggICAgICAgICAgODggICAgODggICAgICA4OCxkODgnICAgICAgODhhYWFhYSAgICAgICAgXCI4YWE4XCIgICBgWThhYWFhYSwgICAgXG5cdC8vIFx0ODhcIlwiXCJcIlwiXCJcIlwiODggODggICAgICAgICAgODggICAgODggICAgICA4ODg4XCI4OCwgICAgIDg4XCJcIlwiXCJcIiAgICAgICAgIGA4OCcgICAgICBgXCJcIlwiXCJcIjhiLCAgXG5cdC8vIFx0ODggICAgICAgIDg4IFk4LCAgICAgICAgLDhQICAgIDg4ICAgICAgODhQICAgWThiICAgIDg4ICAgICAgICAgICAgICAgODggICAgICAgICAgICAgYDhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggIFk4YS4gICAgLmE4UCAgICAgODggICAgICA4OCAgICAgXCI4OCwgIDg4ICAgICAgICAgICAgICAgODggICAgIFk4YSAgICAgYThQICBcblx0Ly8gXHQ4OCAgICAgICAgODggICBgXCJZODg4OFlcIicgICAgICA4OCAgICAgIDg4ICAgICAgIFk4YiA4ODg4ODg4ODg4OCAgICAgIDg4ICAgICAgXCJZODg4ODhQXCIgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICc/Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge31cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdhbHQnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdIb2xkIGRvd24gdG8gZWRpdCBwYXN0ZWQgbGlua3MnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0FMVF9ET1dOJylcblx0XHRcdFx0JHNjb3BlLmFsdElzUHJlc3NlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnYWx0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXl1cCcsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnQUxUX1VQJylcblx0XHRcdFx0JHNjb3BlLmFsdElzUHJlc3NlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kJywgJ2N0cmwnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnSG9sZCBkb3duIHRvIHNlbGVjdCBiaXRzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5jb21tYW5kSXNQcmVzc2VkID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCcsICdjdHJsJ10sXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5dXAnLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnZW50ZXInLCAnc2hpZnQrZW50ZXInXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnYWRkIG5ldyBiaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cblx0XHRcdFx0XHQkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHRpZiAoX2lzQml0KCkpe1xuXHRcdFx0XHRcdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmNvbnRlbnQgIT09ICcnKXtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLmFkZEJpdCggX2JpdEluZGV4KCkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKF9iaXRJbmRleCgpICE9PSAwKXtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uZ2FwID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0X2ZvY3VzTWUoMCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrZW50ZXInLCAnY3RybCtlbnRlciddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhZGQgYSBsaXR0bGUgc3BhY2UgYWJvdmUgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBiaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSAmJiBfaXNCaXQoKSl7XG5cdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uZ2FwID0gISRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcDtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnYmFja3NwYWNlJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIFxuXHRcdFx0XHRcdF9pc1RleHRhcmVhKCkgJiYgXG5cdFx0XHRcdFx0KCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmNvbnRlbnQgPT09ICcnKVxuXHRcdFx0XHQpe1xuXHRcdFx0XHRcdGlmICgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS50YWJDb3VudCA+IDApe1xuXHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uZ2FwKXtcblx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNle1xuXHRcdFx0XHRcdFx0JHNjb3BlLmtpbGxCaXQoIF9iaXRJbmRleCgpICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtiYWNrc3BhY2UnLCAnY3RybCtiYWNrc3BhY2UnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIERlbGV0ZSB0aGlzIGJpdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpICl7XG5cdFx0XHRcdFx0JHNjb3BlLmtpbGxCaXQoIF9iaXRJbmRleCgpICk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK3NoaWZ0K2JhY2tzcGFjZScsICdjdHJsK3NoaWZ0K2JhY2tzcGFjZSddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdEZWxldGUgdGhpcyBub3RlJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUubm90ZS5raWxsICYmICRzY29wZS5raWxsTm90ZSgpOyBcblx0XHRcdFx0JHNjb3BlLm5vdGUua2lsbCA9ICEkc2NvcGUubm90ZS5raWxsO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWyd0YWInLCAnY29tbWFuZCtdJywgJ2N0cmwrXSddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgSW5kZW50Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpICYmIF9pc0JpdCgpICl7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRhYkluKGspO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0JHNjb3BlLnRhYkluKF9iaXRJbmRleCgpKTtcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fWVsc2UgaWYgKCBfaXNUZXh0YXJlYSgpIClcblx0XHRcdFx0XHRfZm9jdXNNZSgwKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnc2hpZnQrdGFiJywgJ2NvbW1hbmQrWycsICdjdHJsK1snXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIE91dGRlbnQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgX2lzQml0KCkgKXtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUudGFiT3V0KGspO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0JHNjb3BlLnRhYk91dChfYml0SW5kZXgoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtzaGlmdCtkJywgJ2N0cmwrc2hpZnQrZCddLFxuXHRcdFx0Ly8gZGVzY3JpcHRpb246ICdEdXBsaWNhdGUgY3VycmVudGx5IHNlbGVjdGVkIGJpdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHRpZiAoX2lzQml0KCkpe1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdCRzY29wZS5hZGRCaXQoIF9iaXRJbmRleCgpLCAkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5jb250ZW50ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ3VwJywgJ2Rvd24nXSxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhldmVudCwgZXZlbnQua2V5Q29kZSlcblx0XHRcdFx0XHQkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdFx0XHRcdCRzY29wZS5jYXJldFRyYWNrZXIoX2JpdEluZGV4KCksIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUuanVtcEFyb3VuZChfYml0SW5kZXgoKSwgZXZlbnQua2V5Q29kZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVx0XHRcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQrdXAnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKSAtIDFdLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0X2ZvY3VzTWUoX2JpdEluZGV4KCkgLSAxKTtcblx0XHRcdFx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IHRydWU7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnc2hpZnQrZG93bicsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpICsgMV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRfZm9jdXNNZShfYml0SW5kZXgoKSArIDEpO1xuXHRcdFx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gdHJ1ZTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY3RybCt1cCcsICdjdHJsK2Rvd24nXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnUXVpY2tseSBqdW1wIGJldHdlZW4gYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0JHNjb3BlLmp1bXBBcm91bmQoX2JpdEluZGV4KCksIGV2ZW50LmtleUNvZGUsIHRydWUpO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY3RybCtjb21tYW5kK3VwJywgJ2N0cmwrYWx0K3VwJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBTd2FwIGJpdCB1cCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdCRzY29wZS5tb3ZlVXAoX2JpdEluZGV4KCkpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjdHJsK2NvbW1hbmQrZG93bicsICdjdHJsK2FsdCt1cCddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgU3dhcCBiaXQgZG93bicsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdCRzY29wZS5tb3ZlRG93bihfYml0SW5kZXgoKSk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ3NoaWZ0ICsgJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ05ldyBub3RlJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ub3RlLycgKyBuZXdOb3RlKCkpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK3NoaWZ0K2EnLCAnY3RybCtzaGlmdCthJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1NlbGVjdCBhbGwgYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlba10uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdCRzY29wZS5zZWxlY3RlZEJpdHMgPSB0cnVlO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQvLyBpZiAoICFfaXNUZXh0U2VsZWN0ZWQoJChldmVudC50YXJnZXQpWzBdKSApe1xuXHRcdFx0XHQvLyB9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQreCcsICdjdHJsK3gnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnQ3V0IHNlbGVjdGVkIGJpdHMnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggIV9pc1RleHRTZWxlY3RlZCgkKGV2ZW50LnRhcmdldClbMF0pICl7XG5cdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdCRzY29wZS5jdXQodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtjJywgJ2N0cmwrYyddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdDb3B5IHNlbGVjdGVkIGJpdHMnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggIV9pc1RleHRTZWxlY3RlZCgkKGV2ZW50LnRhcmdldClbMF0pICl7XG5cdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uc2VsZWN0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdCRzY29wZS5jdXQoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrdicsICdjdHJsK3YnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnUGFzdGUgY3V0IGJpdHMgKG9yIGp1c3QgcGFzdGUgdGhlIGNvbnRlbnRzIG9mIHlvdXIgY2xpcGJvYXJkKScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2cod2luZG93LmNsaXBib2FyZGVkKVxuXHRcdFx0XHRpZiAod2luZG93LmNsaXBib2FyZGVkKXtcblx0XHRcdFx0XHQkc2NvcGUucGFzdGUoKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkc2NvcGUucGFyc2VQYXN0ZWQoX2JpdEluZGV4KCkpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ3NoaWZ0IHNoaWZ0Jyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIFRvZ2dsZSB0aGlzIGJpdCBhcyBtYXJrZWQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpKXtcblx0XHRcdFx0XHQvLyAkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdFx0XHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5tYXJrKGspO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0JHNjb3BlLm1hcmsoX2JpdEluZGV4KCkpXG5cdFx0XHRcdFx0XHQvLyAkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5tYXJrID0gISRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLm1hcms7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2N0cmwrc2hpZnQgY3RybCtzaGlmdCcsICdjb21tYW5kK3NoaWZ0IGNvbW1hbmQrc2hpZnQnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnVG9nZ2xlIHRoaXMgbm90ZSBhcyBtYXJrZWQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUubWFyayA9ICEkc2NvcGUubm90ZS5tYXJrO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0Nsb3NlIG5vdGUnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0XHRcdCRzY29wZS51bnNlbGVjdG9yKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoc2hvd2luZ0NoZWF0c2hlZXQpe1xuXHRcdFx0XHRcdHNob3dpbmdDaGVhdHNoZWV0ID0gZmFsc2U7XG5cdFx0XHRcdFx0aG90a2V5cy50b2dnbGVDaGVhdFNoZWV0KCk7XG5cdFx0XHRcdC8vIH1lbHNlIGlmICgkc2NvcGUuc2hhcmVQcm9tcHQpe1xuXHRcdFx0XHQvLyBcdCRzY29wZS5zaGFyZVByb21wdCA9IGZhbHNlO1x0XHRcdFx0XHRcblx0XHRcdFx0fWVsc2Vcblx0XHRcdFx0XHQkc2NvcGUuY2xvc2VOb3RlKCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnYWx0K3NoaWZ0Ky8nLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdTaG93IHRoaXMgaGFuZHkgZ3VpZGUgOiknLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRzaG93aW5nQ2hlYXRzaGVldCA9ICFzaG93aW5nQ2hlYXRzaGVldDtcblx0XHRcdFx0aG90a2V5cy50b2dnbGVDaGVhdFNoZWV0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4ODg4ODg4ODg4OCA4OCAgICAgICAgODggODg4YiAgICAgIDg4ICAgLGFkODg4OGJhLCA4ODg4ODg4ODg4ODggODggICAsYWQ4ODg4YmEsICAgODg4YiAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICA4OCAgICAgICAgODggODg4OGIgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgICAgODggICAgICA4OCAgZDhcIicgICAgYFwiOGIgIDg4ODhiICAgICA4OCAgXG5cdC8vIFx0ODggICAgICAgICAgODggICAgICAgIDg4IDg4IGA4YiAgICA4OCBkOCcgICAgICAgICAgICAgICA4OCAgICAgIDg4IGQ4JyAgICAgICAgYDhiIDg4IGA4YiAgICA4OCAgXG5cdC8vIFx0ODhhYWFhYSAgICAgODggICAgICAgIDg4IDg4ICBgOGIgICA4OCA4OCAgICAgICAgICAgICAgICA4OCAgICAgIDg4IDg4ICAgICAgICAgIDg4IDg4ICBgOGIgICA4OCAgXG5cdC8vIFx0ODhcIlwiXCJcIlwiICAgICA4OCAgICAgICAgODggODggICBgOGIgIDg4IDg4ICAgICAgICAgICAgICAgIDg4ICAgICAgODggODggICAgICAgICAgODggODggICBgOGIgIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICA4OCAgICAgICAgODggODggICAgYDhiIDg4IFk4LCAgICAgICAgICAgICAgIDg4ICAgICAgODggWTgsICAgICAgICAsOFAgODggICAgYDhiIDg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICBZOGEuICAgIC5hOFAgODggICAgIGA4ODg4ICBZOGEuICAgIC5hOFAgICAgIDg4ICAgICAgODggIFk4YS4gICAgLmE4UCAgODggICAgIGA4ODg4ICBcblx0Ly8gXHQ4OCAgICAgICAgICAgYFwiWTg4ODhZXCInICA4OCAgICAgIGA4ODggICBgXCJZODg4OFlcIicgICAgICA4OCAgICAgIDg4ICAgYFwiWTg4ODhZXCInICAgODggICAgICBgODg4ICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXHQkc2NvcGUuYWRkQml0ID0gZnVuY3Rpb24oaW5kZXgsIGNvbnRlbnQpe1xuXHRcdHZhciBpbmNvbWluZ0NvbnRlbnQ7XG5cblx0XHRpZiAodHlwZW9mKGNvbnRlbnQpID09PSAndW5kZWZpbmVkJylcblx0XHRcdGluY29taW5nQ29udGVudCA9ICcnO1xuXHRcdGVsc2Vcblx0XHRcdGluY29taW5nQ29udGVudCA9IGNvbnRlbnQ7XG5cblx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXggKyAxLCAwLCBuZXdCaXQoXG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50LFxuXHRcdFx0XHRpbmNvbWluZ0NvbnRlbnRcblx0XHRcdCkpO1xuXG5cdFx0XHQkc2NvcGUucGFyc2VMaW5rKGluZGV4KTtcblxuXHRcdFx0X2ZvY3VzTWUoaW5kZXggKyAxKTtcblx0XHR9LCA1MCk7XG5cdH07XG5cblx0JHNjb3BlLnBhcnNlUGFzdGVkID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBzcGxpdCBhdCBsaW5lIGJyZWFrc1xuXHRcdFx0dmFyIHRoZUNvbnRlbnQgPSAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50LnNwbGl0KCdcXG4nKSxcblx0XHRcdFx0dG9SZW1vdmUgPSBbXTtcblxuXHRcdFx0Ly8gcmVtb3ZlIGVtcHR5IGxpbmVzXG5cdFx0XHRmb3IgKHZhciBsID0gMDsgbCA8IHRoZUNvbnRlbnQubGVuZ3RoOyBsKyspe1xuXHRcdFx0XHRpZiAoIXRoZUNvbnRlbnRbbF0pXG5cdFx0XHRcdFx0dG9SZW1vdmUucHVzaChsKVxuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKHZhciByID0gdG9SZW1vdmUubGVuZ3RoIC0gMTsgciA+PSAwIDsgci0tKXtcblx0XHRcdFx0dGhlQ29udGVudC5zcGxpY2UodG9SZW1vdmVbcl0sIDEpXG5cdFx0XHR9XG5cblx0XHRcdC8vIHNldCBibG9jayB0byBlbXB0eSBiZWZvcmUgcmVwbGFjaW5nIHcvIDFzdCBsaW5lXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50ID0gdGhlQ29udGVudFswXTtcblxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gJyc7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSB0aGVDb250ZW50WzBdO1xuXG5cdFx0XHQkc2NvcGUucGFyc2VMaW5rKGluZGV4KTtcblxuXHRcdFx0Zm9yICh2YXIgbCA9IDE7IGwgPCB0aGVDb250ZW50Lmxlbmd0aDsgbCsrKXtcblx0XHRcdFx0JHNjb3BlLmFkZEJpdChpbmRleCArIChsIC0gMSksIHRoZUNvbnRlbnRbbF0pO1xuXHRcdFx0fVxuXHRcdH0sIDUwKTsgXG5cdH1cblxuXHQkc2NvcGUucGFyc2VMaW5rID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdHZhciBjb250ZW50ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudDtcblxuXHRcdGlmIChcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHA6Ly9cIikgPT09IDAgfHxcblx0XHRcdGNvbnRlbnQuaW5kZXhPZihcImh0dHBzOi8vXCIpID09PSAwIFxuXHRcdCl7XHRcdFx0XG5cdFx0XHRjb25zb2xlLmxvZygnT0ggTk9FUyBBIExJTksnKVxuXG5cdFx0XHQkLmFqYXgoe1xuXHRcdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0XHRkYXRhVHlwZTonSlNPTlAnLFxuXHRcdFx0XHRkYXRhOntcblx0XHRcdFx0XHRVUkw6IGNvbnRlbnRcblx0XHRcdFx0fSxcblx0XHRcdFx0dXJsOiBcImh0dHA6Ly9yZS5qZWN0LmNoL3RyYS9waHAvdGl0bGUucGhwXCJcblx0XHRcdH0pLmRvbmUoIGZ1bmN0aW9uKHRoZVRpdGxlKXtcblx0XHRcdFx0dmFyIGVzY2FwZWRUaXRsZSA9IF8udW5lc2NhcGUodGhlVGl0bGUudGl0bGUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlc2NhcGVkVGl0bGUpXG5cblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudCA9IGVzY2FwZWRUaXRsZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gZXNjYXBlZFRpdGxlO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5hZGRyZXNzID0gY29udGVudDtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uaXNMaW5rID0gdHJ1ZTtcblxuXHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5vcGVuTGluayA9IGZ1bmN0aW9uKGJpdCwgZXZlbnQpe1xuXHRcdGlmIChiaXQuaXNMaW5rICYmICEkc2NvcGUuYWx0SXNQcmVzc2VkKXtcblx0XHRcdHZhciB3aW47XG5cdFx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblxuXHRcdFx0aWYgKHdpbmRvdy5pc01vYmlsZUFwcCl7XG5cdFx0XHRcdHdpbiA9IGNvcmRvdmEuSW5BcHBCcm93c2VyLm9wZW4oYml0LmFkZHJlc3MsICdfc3lzdGVtJyk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0d2luID0gd2luZG93Lm9wZW4oYml0LmFkZHJlc3MsICdfYmxhbmsnKTtcblx0XHRcdFx0d2luLmZvY3VzKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0JHNjb3BlLmtpbGxCaXQgPSBmdW5jdGlvbihpbmRleCl7XG5cblx0XHRjb25zb2xlLmxvZyhpbmRleClcblxuXHRcdGlmIChpbmRleClcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnNlbGVjdGVkID0gdHJ1ZTtcblxuXHRcdHZhciB0ZW1wQm9keSA9IFtdO1xuXHRcdGFuZ3VsYXIuY29weSgkc2NvcGUubm90ZS5ib2R5LCB0ZW1wQm9keSk7XG5cblx0XHRhbmd1bGFyLmZvckVhY2godGVtcEJvZHkucmV2ZXJzZSgpLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0dmFyIHJldmVyc2VUYXJnZXQgPSBNYXRoLmFicyh0ZW1wQm9keS5sZW5ndGggLSBrKSAtIDE7XG5cblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShyZXZlcnNlVGFyZ2V0LCAxKTtcblx0XHRcdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICgkc2NvcGUubm90ZS5ib2R5Lmxlbmd0aCA+IDApe1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggLSAxKVxuXHRcdH1lbHNle1xuXHRcdFx0YWRkQml0KDApO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubW92ZVVwID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaywgMSlbMF07XG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShrIC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKF9iaXRJbmRleCgpLCAxKVswXTtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4IC0gMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRfZm9jdXNNZShpbmRleCAtIDEpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubW92ZURvd24gPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0dmFyIGJvZHlDb3B5ID0gYW5ndWxhci5jb3B5KCRzY29wZS5ub3RlLmJvZHkpO1xuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goYm9keUNvcHkucmV2ZXJzZSgpLCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHZhciByZXZlcnNlVGFyZ2V0ID0gTWF0aC5hYnMoYm9keUNvcHkubGVuZ3RoIC0gaykgLSAxO1xuXHRcdFx0XHRcdFx0dmFyIHRoaXNCaXQgPSAkc2NvcGUubm90ZS5ib2R5LnNwbGljZShyZXZlcnNlVGFyZ2V0LCAxKVswXTtcblx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKHJldmVyc2VUYXJnZXQgKyAxLCAwLCB0aGlzQml0KTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9ZWxzZXtcblx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoX2JpdEluZGV4KCksIDEpWzBdO1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoaW5kZXggKyAxLCAwLCB0aGlzQml0KTtcblx0XHRcdF9mb2N1c01lKGluZGV4ICsgMSk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS50YWJPdXQgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50ID4gMCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudC0tO1xuXHRcdH1lbHNle1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggLSAxKTtcblx0XHR9XG5cblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCA3NjgpXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4gPSBmYWxzZTtcblx0fVxuXG5cdCRzY29wZS50YWJJbiA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQgPCA0KXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50Kys7XG5cdFx0fWVsc2V7XG5cdFx0XHRfZm9jdXNNZShpbmRleCArIDEpO1xuXHRcdH1cblxuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OClcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHR9XG5cblx0JHNjb3BlLmNhcmV0VHJhY2tlciA9IGZ1bmN0aW9uKGluZGV4LCBjYWxsYmFjayl7XG5cdFx0dmFyIHRoZUJpdCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQsXG5cdFx0XHRjdXJyZW50Q2FyZXQgPSB0aGVCaXQuc2VsZWN0aW9uU3RhcnQsXG5cdFx0XHR0aGVWYWx1ZSA9IHRoZUJpdC52YWx1ZTtcblxuXHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IFxuXHRcdFx0dGhlVmFsdWUuc3Vic3RyaW5nKDAsIGN1cnJlbnRDYXJldCkgKyBcblx0XHRcdCc8c3BhbiBjbGFzcz1cImhpZGRlbkNhcmV0XCI+PC9zcGFuPicgKyBcblx0XHRcdHRoZVZhbHVlLnN1YnN0cmluZyhjdXJyZW50Q2FyZXQsIHRoZVZhbHVlLmxlbmd0aClcblxuXHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICd1bmRlZmluZWQnKSBjYWxsYmFjaygpO1xuXHRcdH0pXG5cdH1cblxuXHQkc2NvcGUuYXV0b1NpemVyID0gZnVuY3Rpb24oaW5kZXgsIGV2ZW50LCBjb250ZW50KXtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSAhPT0gMTMpe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gY29udGVudDtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUuZGVib3VuY2VIaXN0b3JpY2FsID0gXy5kZWJvdW5jZShmdW5jdGlvbigpe1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpO1xuXG5cdFx0aWYgKCEkc2NvcGUubWV0YS5oaXN0b3J5KVxuXHRcdFx0JHNjb3BlLm1ldGEuaGlzdG9yeSA9IHt9O1xuXG5cdFx0JHNjb3BlLm5vdGUubGFzdEVkaXRlZCA9IG5vdztcblxuXHRcdGhpc3RvcmljYWwoXG5cdFx0XHRub3csIFxuXHRcdFx0JHNjb3BlLm5vdGUsIFxuXHRcdFx0JHNjb3BlLnNoYXJlQWN0aXZlKCksIFxuXHRcdFx0ZnVuY3Rpb24oKXtcblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHQpO1xuXHR9LCA1MDAwKVxuXG5cdCRzY29wZS5oaXN0b3JpY2FsX3RyaWdnZXIgPSAkc2NvcGUuZGVib3VuY2VIaXN0b3JpY2FsO1xuXG5cblx0JHNjb3BlLmp1bXBBcm91bmQgPSBmdW5jdGlvbihpbmRleCwga2V5LCBqdXN0Z28pe1xuXG5cdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsIGtleSwganVzdGdvKVxuXHRcdC8vIGNvbnNvbGUubG9nKGluZGV4LCBrZXksIGp1c3Rnbylcblx0XHR2YXIgJHRoZUJpdCA9ICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCksXG5cdFx0XHQkdGhlQ2FyZXQgPSAkdGhlQml0LnNpYmxpbmdzKCcudGV4dGFyZWEtYXV0b3NpemUnKS5maW5kKCcuaGlkZGVuQ2FyZXQnKSxcblx0XHRcdHRoZUNhcmV0UG9zID0gJHRoZUNhcmV0LnBvc2l0aW9uKCkudG9wLFxuXHRcdFx0dGhlQ2FyZXRIZWlnaHQgPSAyMztcblxuXHRcdC8vIGNvbnNvbGUubG9nKHRoZUNhcmV0UG9zLCB0aGVDYXJldEhlaWdodCwgdGhlQ2FyZXRQb3MgPCB0aGVDYXJldEhlaWdodCAtIDEpXG5cdFx0Y29uc29sZS5sb2coXG5cdFx0XHQgICAnQ0FSRVRQT1MgKyA0JywgdGhlQ2FyZXRQb3MgKyA0LFxuXHRcdFx0Jy8vIENBUkVUSEVJR0hUJywgdGhlQ2FyZXRIZWlnaHQsXG5cdFx0XHQnLy8gT1VURVJIRUlHSFQnLCAkdGhlQ2FyZXQucGFyZW50KCkub3V0ZXJIZWlnaHQodHJ1ZSksXG5cdFx0XHQnLy8gQ0FSRVRIRUlHSFQgLSBPVVRFUkhFSUdIVCcsICgkdGhlQ2FyZXQucGFyZW50KCkub3V0ZXJIZWlnaHQodHJ1ZSkgLSAodGhlQ2FyZXRIZWlnaHQpKSxcblx0XHRcdCcvLyBDQVJFVFBPUyA+PSBDQVJFVEhFSUdIVCAtIE9VVEVSSEVJR0hUJywgdGhlQ2FyZXRQb3MgKyA0ID49ICgkdGhlQ2FyZXQucGFyZW50KCkub3V0ZXJIZWlnaHQodHJ1ZSkgLSAodGhlQ2FyZXRIZWlnaHQpKVxuXHRcdCk7XG5cblx0XHRpZiAoIFxuXHRcdFx0KFxuXHRcdFx0XHQoa2V5ID09PSAzOCkgJiYgXG5cdFx0XHRcdCh0aGVDYXJldFBvcyA8IHRoZUNhcmV0SGVpZ2h0IC0gMSkgXG5cdFx0XHQpfHwoXG5cdFx0XHRcdChrZXkgPT09IDM4KSAmJiBcblx0XHRcdFx0anVzdGdvXG5cdFx0XHQpXG5cdFx0KXtcblx0XHRcdGNvbnNvbGUubG9nKCdVUCcpXG5cdFx0XHQkdGhlQml0LnBhcmVudHMoJy5ub3RlX2JpdCcpXG5cdFx0XHRcdC5wcmV2KCcubm90ZV9iaXQnKS5maW5kKCd0ZXh0YXJlYScpXG5cdFx0XHRcdC5mb2N1cygpXG5cdFx0fVxuXG5cdFx0aWYgKFxuXHRcdFx0KFxuXHRcdFx0XHQoa2V5ID09PSA0MCkgJiYgXG5cdFx0XHRcdCgodGhlQ2FyZXRQb3MgKyA0KSA+PSAoJHRoZUNhcmV0LnBhcmVudCgpLm91dGVySGVpZ2h0KHRydWUpIC0gdGhlQ2FyZXRIZWlnaHQpKSBcblx0XHRcdCl8fChcblx0XHRcdFx0KGtleSA9PT0gNDApICYmIFxuXHRcdFx0XHRqdXN0Z29cblx0XHRcdClcblx0XHQpe1xuXHRcdFx0Y29uc29sZS5sb2coJ0RPV04nKVxuXHRcdFx0JHRoZUJpdC5wYXJlbnRzKCcubm90ZV9iaXQnKVxuXHRcdFx0XHQubmV4dCgnLm5vdGVfYml0JykuZmluZCgndGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKVxuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdChrZXkgPT09IDQwKSAmJlxuXHRcdFx0KGluZGV4ID09PSAkc2NvcGUubm90ZS5ib2R5Lmxlbmd0aCAtIDEpXG5cdFx0KXtcblx0XHRcdCRzY29wZS5hZGRCaXQoaW5kZXgpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUubWFyayA9IGZ1bmN0aW9uKGluZGV4LCBvcHRpb25hbCl7XG5cdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcmssICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3Blbiwgb3B0aW9uYWwpXG5cblx0XHRpZiAoKG9wdGlvbmFsICYmIHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4KSB8fCAhb3B0aW9uYWwpe1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWFyayA9ICEkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tYXJrO1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4gPSBmYWxzZTtcblx0XHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coaW5kZXgsICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcmssICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3Blbilcblx0XHRcdH0pXG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbihjb250ZW50LCBpbmRlbnQsIGluZGV4KXtcblx0XHRjb25zb2xlLmxvZyhjb250ZW50LCBpbmRlbnQsIGluZGV4KVxuXHRcdGlmIChpbmRlbnQgPiAwKXtcblx0XHRcdHF1ZXJ5ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleCAtIDFdLmNvbnRlbnQgKyAnICcgKyBjb250ZW50O1xuXHRcdH1lbHNle1xuXHRcdFx0cXVlcnkgPSBjb250ZW50O1xuXHRcdH1cblxuXHRcdHZhciB3aW4gPSB3aW5kb3cub3BlbignaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT0nICsgcXVlcnksICdfYmxhbmsnKTtcblx0ICAgIHdpbi5mb2N1cygpOyBcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VCaXRNZW51cyA9IGZ1bmN0aW9uKGV4Y2VwdCl7XG5cdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0aWYgKHR5cGVvZihlLm1lbnVfb3BlbikgIT09ICd1bmRlZmluZWQnICYmIGUuYml0SUQgIT09IGV4Y2VwdClcblx0XHRcdFx0ZS5tZW51X29wZW4gPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHQkc2NvcGUudG9nZ2xlQml0TWVudSA9IGZ1bmN0aW9uKGluZGV4LCBldmVudCl7XG5cdFx0aWYgKCEkc2NvcGUuY29tbWFuZElzUHJlc3NlZCl7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9ZWxzZXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdCRzY29wZS5jbG9zZUJpdE1lbnVzKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmJpdElEKTtcblxuXHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3BlbiA9ICEkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW47XG5cblx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuKXtcblx0XHRcdCRzY29wZS5tZW51aW5nID0gdHJ1ZTtcblx0XHR9ZWxzZXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5tZW51aW5nID0gZmFsc2U7XHRcdFx0XG5cdFx0XHR9LCAzMDApXG5cdFx0fVxuXHR9XG5cblxuXHR2YXIgaW5zZXJ0SW5kZXg7XG5cblx0JHNjb3BlLnNlbGVjdG9yID0gZnVuY3Rpb24oaW5kZXgsIGV2ZW50KXtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRpZiAoJHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQpe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uc2VsZWN0ZWQgPSAhJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uc2VsZWN0ZWQ7XG5cdFx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdFx0aW5zZXJ0SW5kZXggPSBfYml0SW5kZXgoKTtcblx0fVxuXG5cdCRzY29wZS51bnNlbGVjdG9yID0gZnVuY3Rpb24oZXhjZXB0KXtcblx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRlLnNlbGVjdGVkID0gZmFsc2U7XG5cdFx0XHRlLm1lbnVfb3BlbiA9IGZhbHNlO1xuXHRcdH0pO1xuXHRcdCRzY29wZS5zZWxlY3RlZEJpdHMgPSBmYWxzZTtcblx0fTtcblxuXG5cdCRzY29wZS5jdXQgPSBmdW5jdGlvbihraWxsKXtcblx0XHR3aW5kb3cuY2xpcGJvYXJkID0gW107XG5cblx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdHdpbmRvdy5jbGlwYm9hcmQucHVzaChlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChraWxsKVxuXHRcdFx0JHNjb3BlLmtpbGxCaXQoKTtcblxuXHRcdHdpbmRvdy5jbGlwYm9hcmRlZCA9IHRydWU7IFxuXHR9O1xuXG5cdCRzY29wZS5wYXN0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2cod2luZG93LmNsaXBib2FyZClcblx0XHRhbmd1bGFyLmZvckVhY2god2luZG93LmNsaXBib2FyZCwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZSgoaW5zZXJ0SW5kZXggKyBrKSArIDEsIDAsIGUpXG5cdFx0fSk7XG5cblx0XHQkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdHdpbmRvdy5jbGlwYm9hcmQgPSBbXTtcblx0XHR3aW5kb3cuY2xpcGJvYXJkZWQgPSBmYWxzZTtcblx0fTtcblxuXHQkc2NvcGUuaXNGb2N1c2VkID0gZnVuY3Rpb24oZGVjaXNpb24pe1xuXHRcdGlmIChkZWNpc2lvbil7XG5cdFx0XHQkc2NvcGUuZm9jdXNlZCA9IHRydWU7XG5cdFx0fWVsc2V7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkc2NvcGUuZm9jdXNlZCA9IGZhbHNlO1xuXHRcdFx0fSwgNTApO1xuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5zd2lwZSA9IGZ1bmN0aW9uKGluZGV4LCBkaXJlY3Rpb24pe1xuXHRcdGlmICgkc2NvcGUubm9FZGl0KXtcblx0XHRcdCRzY29wZS5tYXJrKGluZGV4LCB0cnVlKTtcblx0XHR9ZWxzZSBpZiAoIV9pc1RleHRTZWxlY3RlZCgkKGV2ZW50LnRhcmdldClbMF0pKXtcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jyl7XG5cdFx0XHRcdCRzY29wZS50YWJPdXQoaW5kZXgpO1x0XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpe1xuXHRcdFx0XHQkc2NvcGUudGFiSW4oaW5kZXgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4YiAgICAgICAgICAgZDg4IDg4ODg4ODg4ODg4IDg4OGIgICAgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4OGIgICAgICAgICBkODg4IDg4ICAgICAgICAgIDg4ODhiICAgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4YDhiICAgICAgIGQ4Jzg4IDg4ICAgICAgICAgIDg4IGA4YiAgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4IGA4YiAgICAgZDgnIDg4IDg4YWFhYWEgICAgIDg4ICBgOGIgICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICBgOGIgICBkOCcgIDg4IDg4XCJcIlwiXCJcIiAgICAgODggICBgOGIgIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggICBgOGIgZDgnICAgODggODggICAgICAgICAgODggICAgYDhiIDg4IDg4ICAgICAgICA4OCAgXG5cdC8vIFx0ODggICAgYDg4OCcgICAgODggODggICAgICAgICAgODggICAgIGA4ODg4IFk4YS4gICAgLmE4UCAgXG5cdC8vIFx0ODggICAgIGA4JyAgICAgODggODg4ODg4ODg4ODggODggICAgICBgODg4ICBgXCJZODg4OFlcIicgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICBcblxuXHQkc2NvcGUubmV3Tm90ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIG5ld0lEID0gbmV3Tm90ZSgkc2NvcGUubm90ZS5wYXJlbnQpO1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3SUQpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUua2lsbE5vdGUgPSBmdW5jdGlvbigpe1xuXHRcdGtpbGxOb3RlKCRzY29wZS5ub3RlLmlkLCAkc2NvcGUubm90ZS5wYXJlbnQpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUuc2hvd0NoZWF0U2hlZXQgPSBmdW5jdGlvbigpe1xuXHRcdGhvdGtleXMudG9nZ2xlQ2hlYXRTaGVldCgpXG5cdH07XG5cblx0JHNjb3BlLm9wZW5NZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnRvZ2dsZUNsYXNzKCdtZW51T3BlbicpO1x0XG5cdH07XG5cblx0JHNjb3BlLmNsb3NlTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS5yZW1vdmVDbGFzcygnbWVudU9wZW4nKTtcdFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZU5vdGUgPSBmdW5jdGlvbigpe1xuXHRcdGlmICgkc2NvcGUubm90ZS5wYXJlbnQpXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyAkc2NvcGUubm90ZS5wYXJlbnQpXG5cdFx0ZWxzZSBpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKXtcblx0XHRcdGlmICgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50KVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyAkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdH07XG5cblx0JHNjb3BlLnNoYXJlUHJvbXB0ZXIgPSBmdW5jdGlvbihkaXJlY3Rpb24pe1xuXHRcdCRzY29wZS5zaGFyZVByb21wdCA9IGRpcmVjdGlvbjtcblx0fVxuXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4OCAgICAgICAgODggODg4ODg4ODg4ODggODggICAgICAgICAgODg4ODg4ODhiYSAgODg4ODg4ODg4ODggODg4ODg4ODhiYSAgIGFkODg4ODhiYSAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgODggICAgICAgICAgODggICAgICBcIjhiIGQ4XCIgICAgIFwiOGIgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICw4UCA4OCAgICAgICAgICA4OCAgICAgICw4UCBZOCwgICAgICAgICAgXG5cdC8vIFx0ODhhYWFhYWFhYTg4IDg4YWFhYWEgICAgIDg4ICAgICAgICAgIDg4YWFhYWFhOFAnIDg4YWFhYWEgICAgIDg4YWFhYWFhOFAnIGBZOGFhYWFhLCAgICBcblx0Ly8gXHQ4OFwiXCJcIlwiXCJcIlwiXCI4OCA4OFwiXCJcIlwiXCIgICAgIDg4ICAgICAgICAgIDg4XCJcIlwiXCJcIlwiJyAgIDg4XCJcIlwiXCJcIiAgICAgODhcIlwiXCJcIjg4JyAgICAgYFwiXCJcIlwiXCI4YiwgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICBgOGIgICAgICAgICAgIGA4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ICAgICBgOGIgIFk4YSAgICAgYThQICBcblx0Ly8gXHQ4OCAgICAgICAgODggODg4ODg4ODg4ODggODg4ODg4ODg4ODggODggICAgICAgICAgODg4ODg4ODg4ODggODggICAgICBgOGIgIFwiWTg4ODg4UFwiICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdHZhciBfaXNUZXh0YXJlYSA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudHlwZSA9PT0gJ3RleHRhcmVhJztcblx0fSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXHRfaXNCaXQgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNsYXNzTmFtZS5pbmRleE9mKCdtb3VzZXRyYXAnKSA+IC0xO1xuXHR9LFxuXG5cdF9iaXRJbmRleCA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkucGFyZW50cygnLm5vdGVfYml0JykuaW5kZXgoKTtcblx0fSxcblxuXHRfZm9jdXNNZSA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQkKCcubm90ZV9ib2R5Jylcblx0XHRcdFx0LmZpbmQoJy5ub3RlX2JpdDplcSgnICsgKGluZGV4KSArICcpIHRleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKCk7XG5cdFx0fSk7XG5cdH0sXG5cblx0X2lzVGV4dFNlbGVjdGVkID0gZnVuY3Rpb24oaW5wdXQpe1xuXHRcdHZhciBzdGFydFBvcyA9IGlucHV0LnNlbGVjdGlvblN0YXJ0O1xuXHRcdHZhciBlbmRQb3MgPSBpbnB1dC5zZWxlY3Rpb25FbmQ7XG5cdFx0dmFyIGRvYyA9IGRvY3VtZW50LnNlbGVjdGlvbjtcblxuXHRcdGlmKGRvYyAmJiBkb2MuY3JlYXRlUmFuZ2UoKS50ZXh0Lmxlbmd0aCAhPSAwKXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1lbHNlIGlmICghZG9jICYmIGlucHV0LnZhbHVlLnN1YnN0cmluZyhzdGFydFBvcywgZW5kUG9zKS5sZW5ndGggIT0gMCl7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdCRzY29wZS5zb3J0YWJsZU9wdGlvbnNfbm90ZSA9IHtcblx0XHRoYW5kbGU6ICc+IC5iaXRfYW5jaG9yJyxcblx0XHRheGlzOiAneScsXG5cdFx0c2Nyb2xsOiB0cnVlLFxuXHRcdGhlbHBlcjogJ2Nsb25lJyxcblx0XHQvLyBzdGFydDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuXHRcdC8vICAgICQodGhpcykuYXR0cignc3RhcnRpbmdTY3JvbGxUb3AnLCB3aW5kb3cucGFnZVlPZmZzZXQpO1xuXHRcdC8vIH0sXG5cdFx0Ly8gZHJhZzogZnVuY3Rpb24oZXZlbnQsdWkpe1xuXHRcdC8vICAgIHZhciBzdCA9IHBhcnNlSW50KCQodGhpcykuYXR0cignc3RhcnRpbmdTY3JvbGxUb3AnKSk7XG5cdFx0Ly8gICAgdWkucG9zaXRpb24udG9wIC09IHN0O1xuXHRcdC8vIH0sXG5cdFx0J3VpLWZsb2F0aW5nJzogdHJ1ZVxuXHR9O1xuXG5cdGhpc3RvcnlDb3VudChmdW5jdGlvbih0aGVOdW1iZXIpe1xuXHRcdCRzY29wZS5oaXN0b3J5Q291bnRlciA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhlTnVtYmVyO1xuXHRcdH1cblx0fSlcblxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdFx0TG9nb3V0KCk7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0Tm90ZSxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdG5ld0JpdCxcblx0JHJvdXRlUGFyYW1zLCBcblx0JHJvdXRlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvbixcblx0JGNvb2tpZXMsXG5cdEF1dGgsXG5cdExvZ2luLFxuXHRmaXJzdE5vdGVcbikge1xuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuICAgICRzY29wZS5hdXRoID0gQXV0aDtcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncG9ydGFsJztcbiAgICAkc2NvcGUudmlld2luZyA9ICdzaWduSW4nO1xuICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICBpZiAod2luZG93LmxvZ2dlZEluKVxuXHQgICAgJGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cblx0XHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnV2VsY29tZSDigJMgTElDSyc7XG5cbiAgICAkc2NvcGUuc2lnbl91cCA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lKVxuXHQgICAgXHQkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cblx0XHRcdCRzY29wZS5hdXRoLiRjcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQoXG5cdFx0XHRcdCRzY29wZS5zaWduVXBfaW5wdXQuZW1haWwsXG5cdFx0XHRcdCRzY29wZS5zaWduVXBfaW5wdXQucGFzc3dvcmRcblx0XHRcdCkudGhlbihmdW5jdGlvbih1c2VyRGF0YSkge1xuXG5cdFx0XHRcdCRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coJ25ldyB1c2VyIFwiJyArIHVzZXJEYXRhLnVpZCArICdcIiBjcmVhdGVkIScpO1xuXG5cdFx0XHRcdHdpbmRvdy51aWQgPSB1c2VyRGF0YS51aWQ7XG5cblx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRMb2dpbigkc2NvcGUuc2lnblVwX2lucHV0LmVtYWlsLCAkc2NvcGUuc2lnblVwX2lucHV0LnBhc3N3b3JkLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0Zmlyc3ROb3RlKCk7XG5cdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KVxuXG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHR9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2lnbl9pbiA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lKVxuXHQgICAgXHQkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgXHRMb2dpbigkc2NvcGUuc2lnbkluX2lucHV0LmVtYWlsLCAkc2NvcGUuc2lnbkluX2lucHV0LnBhc3N3b3JkLCBcbiAgICBcdFx0ZnVuY3Rpb24oKXtcblx0ICAgIFx0XHQkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXHQgICAgXHRcdGlmICghd2luZG93LnJlc2V0dGluZ1Bhc3N3b3JkKVxuXHRcdCAgICBcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0ICAgIFx0ZWxzZXtcblx0XHQgICAgXHRcdCRzY29wZS52aWV3aW5nID0gJ3B3Y2hhbmdlJztcblx0XHQgICAgXHR9XG5cdCAgICBcdH0sXG5cdCAgICBcdGZ1bmN0aW9uKCl7XG5cdCAgICBcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0ICAgIFx0XHQvLyAkc2NvcGUuc2lnbkluX2lucHV0LmVtYWlsID0gJyc7XG5cdCAgICBcdFx0JHNjb3BlLnNpZ25Jbl9pbnB1dC5wYXNzd29yZCA9ICcnO1xuXHQgICAgXHR9XG4gICAgXHQpO1xuICAgIH1cblxuICAgICRzY29wZS5uZXdQVyA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lKVxuXHQgICAgXHQkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cblx0XHRcdC8vICRzY29wZS5hdXRoLiRjaGFuZ2VQYXNzd29yZCh7XG5cdFx0XHQvLyBcdGVtYWlsOiAkc2NvcGUuc2lnbkluX2lucHV0LmVtYWlsLFxuXHRcdFx0Ly8gXHRvbGRQYXNzd29yZDogJHNjb3BlLnNpZ25Jbl9pbnB1dC5wYXNzd29yZCxcblx0XHRcdC8vIFx0bmV3UGFzc3dvcmQ6ICRzY29wZS5yZXNldF9pbnB1dC5wYXNzd29yZFxuXHRcdFx0Ly8gfSlcblxuXHRcdFx0JHNjb3BlLmF1dGguJGNoYW5nZVBhc3N3b3JkKFxuXHRcdFx0XHQkc2NvcGUucmVzZXRfaW5wdXQucGFzc3dvcmRcblx0XHRcdCkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0d2luZG93LnJlc2V0dGluZ1Bhc3N3b3JkID0gZmFsc2U7XG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0XHRhbGVydCgnWW91ciBwYXNzd29yZCBoYXMgYmVlbiByZXNldC5cXG5cXG5Eb25cXCd0IHdvcnJ5LCBpdCBoYXBwZW5zIHRvIGV2ZXJ5b25lISA6KScpXG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiLCBlcnJvcik7XG5cdFx0XHR9KTtcbiAgICB9XG5cbiAgICAkc2NvcGUucHdSZXNldCA9IGZ1bmN0aW9uKCl7XG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lKVxuXHQgICAgXHQkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUgJiYgJHNjb3BlLnNpZ25Jbi4kdmFsaWQpe1xuXHRcdFx0JHNjb3BlLmF1dGguJHJlc2V0UGFzc3dvcmQoe1xuXHRcdFx0XHRlbWFpbDogJHNjb3BlLnNpZ25Jbl9pbnB1dC5lbWFpbFxuXHRcdFx0fSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0d2luZG93LnJlc2V0dGluZ1Bhc3N3b3JkID0gdHJ1ZTtcblx0XHRcdFx0YWxlcnQoJ09rYXkhXFxuXFxuR28gY2hlY2sgeW91ciBlbWFpbCwgd2UganVzdCBzZW50IHlvdSBhIHRlbXBvcmFyeSBwYXNzd29yZC4gXFxuXFxuR28gZ2V0IGl0IHRoZXJlLCBsb2dpbiB3aXRoIHRoYXQsIGFuZCB3ZVxcJ2xsIGNoYW5nZSB5b3VyIHBhc3N3b3JkIHdoZW4geW91IGdldCBiYWNrIScpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUGFzc3dvcmQgcmVzZXQgZW1haWwgc2VudCBzdWNjZXNzZnVsbHkhJyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiLCBlcnJvcik7XG5cdFx0XHR9KTtcbiAgICBcdH1lbHNle1xuICAgIFx0XHRhbGVydCgnT3UgbmVpIVxcblxcblB1dCB5b3VyIGVtYWlsIGluLCBhbmQgY2xpY2sgdGhlIFxcJ0ZvcmdvdCB5b3VyIHBhc3N3b3JkP1xcJyBidXR0b24gYWdhaW4uJylcbiAgICBcdH1cbiAgICB9XG5cbiAgICAkc2NvcGUuZW50ZXJXYXRjaCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBcdGlmIChldmVudC5rZXlDb2RlID09PSAxMyl7XG4gICAgXHRcdGlmICgkc2NvcGUudmlld2luZyA9PT0gJ3NpZ25VcCcpICRzY29wZS5zaWduX3VwKCk7XG4gICAgXHRcdGVsc2UgaWYgKCRzY29wZS52aWV3aW5nID09PSAnc2lnbkluJykgJHNjb3BlLnNpZ25faW4oKTtcbiAgICBcdFx0ZWxzZSBpZiAoJHNjb3BlLnZpZXdpbmcgPT09ICdwd2NoYW5nZScpICRzY29wZS5uZXdQVygpO1xuICAgIFx0fVxuICAgIH07XG59XG5cblxuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHNjb3BlLFxuXHRob3RrZXlzLFxuXHRNZXRhLFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHRzaGFyZU5vdGUsXG5cdGFkZFRvU2hhcmVkTm90ZSxcblx0JHJvdXRlUGFyYW1zLFxuXHQkdGltZW91dCxcblx0JGxvY2F0aW9uXG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXHRcbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3NoYXJlJztcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbCk7XG5cbiAgICB3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnU2hhcmUgbm90ZSDigJMgTElDSyc7XG5cblx0TWV0YSgpLiRiaW5kVG8oJHNjb3BlLCAnbWV0YScpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXHRcdFx0c2hhcmVkVXNlckdlbmVyYXRvcigpXG5cdFx0fSlcblxuXHR2YXIgc2hhcmVkVXNlckdlbmVyYXRvckdhdGUsXG5cdFx0dW5iaW5kZXIsXG4gICAgXHRzaGFyZVNvdXJjZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICBcdFx0aWYgKHR5cGVvZih1bmJpbmRlcikgIT09ICd1bmRlZmluZWQnKVxuICAgIFx0XHRcdHVuYmluZGVyKCk7XG5cbiAgICBcdFx0aWYgKCEkc2NvcGUuaXNTaGFyZWQpe1xuXHRcdFx0XHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKVxuXHRcdFx0XHRcdCRzY29wZS5pc1NoYXJlZCA9IHRydWU7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkc2NvcGUuaXNTaGFyZWQgPSBmYWxzZTtcbiAgICBcdFx0fVxuXG5cdFx0XHRpZiAoJHNjb3BlLmlzU2hhcmVkKXtcblx0XHRcdFx0Ly8gc2hhcmVkVXNlckdlbmVyYXRvckdhdGUgPSBmYWxzZTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NIQVJFRCcpXG5cdFx0XHRcdHNoYXJlZE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdFx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHRcdFx0XHRcdCRzY29wZS5yZXR1cm5BZGRyZXNzID0gJy9zaGFyZWRub3RlLycgKyAkc2NvcGUubm90ZS5pZDtcblx0XHRcdFx0XHRcdHNoYXJlZFVzZXJHZW5lcmF0b3IoZmFsc2UpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZXtcblx0XHRcdFx0c2hhcmVkVXNlckdlbmVyYXRvckdhdGUgPSB0cnVlO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUFJJVkFUJylcblx0XHRcdFx0Tm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kKXtcblx0XHRcdFx0XHRcdHVuYmluZGVyID0gdW5iaW5kO1xuXHRcdFx0XHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZClcblx0XHRcdFx0XHRcdCRzY29wZS5yZXR1cm5BZGRyZXNzID0gJy9ub3RlLycgKyAkc2NvcGUubm90ZS5pZDtcblx0XHRcdFx0XHRcdHNoYXJlZFVzZXJHZW5lcmF0b3IodHJ1ZSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHNoYXJlZFVzZXJHZW5lcmF0b3IgPSBmdW5jdGlvbihhbHJlYWR5U2hhcmVkKXtcblx0XHRcdGlmIChzaGFyZWRVc2VyR2VuZXJhdG9yR2F0ZSl7XG5cblx0XHRcdFx0cGFydGljaXBhbnRzR2VuZXJhdG9yKCk7XG5cblx0XHRcdFx0dmFyIHVzZXJzID0gYW5ndWxhci5jb3B5KCRzY29wZS5tZXRhLnNoYXJlZFVzZXJzKSxcblx0XHRcdFx0XHR1bmlxdWVVc2VycyA9IF8udW5pcSh1c2Vycyk7XG5cblx0XHRcdFx0aWYoYWxyZWFkeVNoYXJlZClcblx0XHRcdFx0XHR2YXIgcGFydGljaXBhbnRzID0gYW5ndWxhci5jb3B5KCRzY29wZS5tZXRhLnNoYXJlZFVzZXJzKVxuXG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCh1bmlxdWVVc2VycywgZnVuY3Rpb24odiwgayl7XG5cdFx0XHRcdFx0aWYgKGFscmVhZHlTaGFyZWQpe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKHBhcnRpY2lwYW50cywgZnVuY3Rpb24odnYsIGtrKXtcblx0XHRcdFx0XHRcdFx0aWYgKHdpbmRvdy5lbWFpbFVuZXNjYXBlcihraykgPT09IHYpXG5cdFx0XHRcdFx0XHRcdFx0ZGVsZXRlIHVuaXF1ZVVzZXJzW2tdXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh2ID09PSB3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsKVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHVuaXF1ZVVzZXJzW2tdXG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0JHNjb3BlLnNoYXJlZFVzZXJGaWx0ZXIgPSB1bmlxdWVVc2Vycztcblx0XHRcdH1cblxuXHRcdFx0c2hhcmVkVXNlckdlbmVyYXRvckdhdGUgPSB0cnVlO1xuXHRcdH0sXG5cblx0XHRwYXJ0aWNpcGFudHNHZW5lcmF0b3IgPSBmdW5jdGlvbigpe1xuXG5cdFx0XHR2YXIgX3BhcnRpY2lwYW50cyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHMpXG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaChfcGFydGljaXBhbnRzLCBmdW5jdGlvbih2LCBrKXtcblx0XHRcdFx0aWYgKGsgPT09IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWxfZXNjYXBlZClcblx0XHRcdFx0XHRkZWxldGUgX3BhcnRpY2lwYW50c1trXTtcblx0XHRcdH0pXG5cblx0XHRcdCRzY29wZS5ub3RlUGFydGljaXBhbnRzID0gX3BhcnRpY2lwYW50cztcblxuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdH0pXG5cdFx0fVxuXG5cdHNoYXJlU291cmNlKCk7XG5cblx0JHNjb3BlLnNoYXJlVXNlciA9IGZ1bmN0aW9uKHRhcmdldCl7XG5cdFx0aWYgKCRzY29wZS5pc1NoYXJlZCl7XG5cdFx0XHRhZGRUb1NoYXJlZE5vdGUoXG5cdFx0XHRcdCRzY29wZS5ub3RlLmlkLCBcblx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHRwYXJ0aWNpcGFudHNHZW5lcmF0b3Jcblx0XHRcdCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRzaGFyZU5vdGUoXG5cdFx0XHRcdCRzY29wZS5ub3RlLmlkLCBcblx0XHRcdFx0dGFyZ2V0LCBcblx0XHRcdFx0ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0JHNjb3BlLmlzU2hhcmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHNoYXJlU291cmNlKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLnJlbW92ZVVzZXIgPSBmdW5jdGlvbih0YXJnZXQpe1xuXHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5wYXJ0aWNpcGFudHMsIGZ1bmN0aW9uKHYsIGspe1xuXHRcdFx0Y29uc29sZS5sb2codiwgayk7XG5cdFx0XHRpZiAodGFyZ2V0ID09PSBrKVxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLm5vdGUucGFydGljaXBhbnRzW2tdO1xuXHRcdH0pXG5cblx0XHRwYXJ0aWNpcGFudHNHZW5lcmF0b3IoKTtcblx0fVxuXG5cdCRzY29wZS5lbWFpbFVuZXNjYXBlciA9IGZ1bmN0aW9uKGVtYWlsKSB7XG5cdFx0cmV0dXJuIGVtYWlsLnJlcGxhY2UoL1tfXS9nLCBcIi5cIik7XG5cdH1cblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpIFxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhaCwgZm9yZ2V0IGl0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZW50ZXInLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5zaGFyZVVzZXIoJHNjb3BlLnNoYXJlVGFyZ2V0KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCgkc2NvcGUucmV0dXJuQWRkcmVzcyk7XG5cdH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkc2NvcGUsXG5cdCRyb3V0ZVBhcmFtcyxcblx0Tm90ZSxcblx0c2hhcmVkTm90ZSxcblx0aG90a2V5cyxcblx0JGxvY2F0aW9uLFxuXHQkdGltZW91dFxuKSB7IFxuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cblx0JHNjb3BlLnBhZ2VDbGFzcyA9ICd0ZXh0JztcblxuXHQkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpXG5cblxuXHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKVxuXHRcdHNoYXJlZE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKTtcblx0ZWxzZSB7XG5cdFx0Tm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpLnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpIHtcblx0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5vdGUpXG5cblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdUZXh0IHZpZXdlciBmb3InICsgJHNjb3BlLm5vdGUudGl0bGUgKyAnIOKAkyBMSUNLJztcblx0XHR9KTtcdFx0XG5cdH1cblxuXHRcblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmNsb3NlVGV4dCgpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cblxuXHQkc2NvcGUuY2xvc2VUZXh0ID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCh3aW5kb3cubG9jYWxTdG9yYWdlLmhpc3RvcmljYWxfbGFzdCk7XG5cblx0XHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvc2hhcmVkbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHR9ZWxzZXtcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykudG9nZ2xlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcbn0iLCIkKGZ1bmN0aW9uKCkge1xuXG5cdC8vIEZFQVRVUkUgVEVTVFNcblxuXHR2YXIgX3Byb3BlcnR5Q2FjaGUgPSB7fTtcdFxuXG5cdGV4cG9ydHMuc3VwcG9ydHNTdmcgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIV9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnKXtcblx0XHRcdHZhciByZXN1bHQgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKFwiaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSNJbWFnZVwiLCBcIjEuMVwiKTtcblx0XHRcdF9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnID0gcmVzdWx0O1xuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5zdXBwb3J0c1N2Zztcblx0fTsgXG5cblx0ZXhwb3J0cy5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgPSBmdW5jdGlvbigpe1xuXHRcdGlmICghX3Byb3BlcnR5Q2FjaGUubWVkaWFRdWVyaWVzU3VwcG9ydGVkKXtcblxuXHRcdFx0dmFyIGdldFRlc3RlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVkaWF0ZXN0XCIpLFxuXHRcdFx0XHRib29sO1xuXG5cdFx0XHRpZiAoIWdldFRlc3Rlcil7XG5cdFx0XHRcdHZhciBkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0XHRcdGQuaWQgPSBcIm1lZGlhdGVzdFwiO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO1xuXHRcdFx0XHRib29sID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHZhciBkID0gZ2V0VGVzdGVyO1xuXG5cdFx0XHRpZiAoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGQpLnBvc2l0aW9uID09IFwiYWJzb2x1dGVcIiApXG5cdFx0XHRcdGJvb2wgPSB0cnVlO1xuXG5cdFx0XHRfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQgPSBib29sO1xuXG5cdFx0XHRyZXR1cm4gYm9vbDtcblx0XHR9XG5cdFx0ZWxzZSByZXR1cm4gX3Byb3BlcnR5Q2FjaGUubWVkaWFRdWVyaWVzU3VwcG9ydGVkO1xuXHR9OyBcblxuXHRleHBvcnRzLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCFfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQpe1xuXHRcdFx0dmFyIHJlc3VsdCA9ICgnYmFja2dyb3VuZFNpemUnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSk7XG5cdFx0XHRfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQgPSByZXN1bHQ7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5jb3ZlckJhY2tncm91bmRTdXBwb3J0ZWQ7XG5cdH07XG5cdFxuXG5cdC8vIFVUSUxJVElFU1xuXG5cdGV4cG9ydHMubWFwX3JhbmdlID0gZnVuY3Rpb24odmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xuXHQgICAgcmV0dXJuIChsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpKS50b0ZpeGVkKDIpO1xuXHR9XG5cblx0ZXhwb3J0cy5yYW5kb21JbnQgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuXHQgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG5cdH1cblxuXHRleHBvcnRzLnNjcm9sbFRvSGVyZSA9IGZ1bmN0aW9uKHdoZXJlLCBleHRyYSl7XG5cdFx0aWYgKCFleHRyYSkgZXh0cmEgPSAwO1xuXHRcdFxuXHRcdHZhciB0YXJnZXQgPSAkKHdoZXJlKS5vZmZzZXQoKS50b3A7XG5cblx0XHQvLyBkZWZpbmUgaG93IGxhcmdlIHlvdXIgc3RpY2t5IGhlYWRlciBpcyBoZXJlIVxuXHRcdGlmICh3aW5kb3cubWVkaWFRdWVyeS5nZXRRdWVyeSgpID09PSAnbW9iaWxlJykgdGFyZ2V0IC09IDU1O1xuXG5cdFx0JCgnaHRtbCxib2R5JykuYW5pbWF0ZSh7XG5cdFx0XHRzY3JvbGxUb3A6IHRhcmdldCArIGV4dHJhXG5cdFx0fSwgNTAwKTtcblx0fTsgXG5cblx0ZXhwb3J0cy5wYWdlU2V0dXAgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN1YnNjcmliZXJzID0gW10sXG5cdFx0XHRpc1NldFVwID0gZmFsc2U7XG5cblx0XHRmdW5jdGlvbiBva2F5Z28oKXtcblx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRzdWJzY3JpYmVyc1ttZXRob2RdKCk7XG5cdFx0XHR9XG5cdFx0XHRpc1NldFVwID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cblx0XHRcdGlzU2V0VXAgJiYgb2theWdvKCk7XG5cdFx0fVxuXG5cdFx0Ly8gUmV0dXJuYWwgIFxuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0b2theWdvOiBva2F5Z28sXG5cdFx0XHRzdWJzY3JpYmU6IHN1YnNjcmliZVxuXHRcdH07XG5cdH0pKCk7IFxuXG5cdGV4cG9ydHMuZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcblx0XHR2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBsYXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aW1lc3RhbXA7XG5cblx0XHRcdGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID4gMCkge1xuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRcdGlmICghaW1tZWRpYXRlKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcblx0XHRcdFx0XHRpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb250ZXh0ID0gdGhpcztcblx0XHRcdGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHR0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuXHRcdFx0aWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG5cdFx0XHRpZiAoY2FsbE5vdykge1xuXHRcdFx0XHRyZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0XHRjb250ZXh0ID0gYXJncyA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fTtcblx0fTsgXG5cblx0ZXhwb3J0cy5tZWRpYVF1ZXJ5ID0gKGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzdWJzY3JpYmVycyA9IFtdLFxuXHRcdFx0bWVkaWFDdXJyZW50LFxuXHRcdFx0bWVkaWFQcmV2LFxuXHRcdFx0JHdpbmRvdyA9ICQod2luZG93KSxcblx0XHRcdCRodG1sID0gJCgnaHRtbCcpO1xuXG5cdFx0ZnVuY3Rpb24gY2FsY3VsYXRlKCl7XG5cdFx0XHR2YXIgaW5uZXJXaWR0aCA9ICR3aW5kb3cuaW5uZXJXaWR0aCgpLFxuXHRcdFx0XHRpbm5lckhlaWdodCA9ICR3aW5kb3cuaW5uZXJIZWlnaHQoKTtcblxuXHRcdFx0aWYgKCBpbm5lcldpZHRoIDwgNzY4ICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdtb2JpbGUnXG5cdFx0XHRlbHNlIGlmICggKCBpbm5lcldpZHRoID49IDc2OCkgJiYgKCBpbm5lcldpZHRoIDwgOTkyICkgKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ3RhYmxldCdcblx0XHRcdGVsc2UgaWYgKCAoIGlubmVyV2lkdGggPj0gOTkyICkgJiYgKCBpbm5lcldpZHRoIDwgMTIwMCApICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdkZXNrdG9wJ1xuXHRcdFx0ZWxzZSBpZiAoIGlubmVyV2lkdGggPj0gMTIwMCApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAnbGFyZ2VfZGVza3RvcCdcblxuXHRcdFx0aWYgKCBpbm5lckhlaWdodCA8IDc0MCApXG5cdFx0XHRcdG1lZGlhQ3VycmVudCArPSAnIHNob3J0J1xuXG5cdFx0XHRpZiAoIG1lZGlhQ3VycmVudCAhPT0gbWVkaWFQcmV2ICl7XG5cdFx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRcdHN1YnNjcmliZXJzW21ldGhvZF0obWVkaWFDdXJyZW50KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghZXhwb3J0cy5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQoKSlcblx0XHRcdFx0XHQkaHRtbC5yZW1vdmVDbGFzcyhtZWRpYVByZXYpLmFkZENsYXNzKG1lZGlhQ3VycmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdG1lZGlhUHJldiA9IG1lZGlhQ3VycmVudDsgXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc3Vic2NyaWJlKG1ldGhvZCkge1xuXHRcdFx0c3Vic2NyaWJlcnMucHVzaChtZXRob2QpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBnZXRRdWVyeSgpe1xuXHRcdFx0cmV0dXJuIG1lZGlhQ3VycmVudDtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gaXMocXVlcnkpe1xuXHRcdFx0cmV0dXJuIG1lZGlhQ3VycmVudC5pbmRleE9mKHF1ZXJ5KSA+PSAwO1xuXHRcdH07XG5cblx0XHR2YXIgY2FsY3VsYXRlRGVib3VuY2UgPSBleHBvcnRzLmRlYm91bmNlKGNhbGN1bGF0ZSwgMjAwKTsgXG5cblx0XHQkd2luZG93LnJlc2l6ZShjYWxjdWxhdGVEZWJvdW5jZSk7XG5cblx0XHQvLyBjYWxjdWxhdGUoKTtcblx0XHRcblx0XHQvLyAkd2luZG93LmxvYWQoY2FsY3VsYXRlKTtcblxuXHRcdC8vIGV4cG9ydHMucGFnZVNldHVwLnN1YnNjcmliZShjYWxjdWxhdGUpO1xuXG5cdFx0Ly8gUmV0dXJuYWxcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlLFxuXHRcdFx0Z2V0UXVlcnk6IGdldFF1ZXJ5LFxuXHRcdFx0aXM6IGlzXG5cdFx0fTtcblx0fSkoKTsgXG5cblx0ZXhwb3J0cy5nTWFwTG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gVmFyaWFibGVzXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblx0XHR2YXIgc3Vic2NyaWJlcnMgPSBbXTtcblxuXHRcdC8vIExvYWQgR29vZ2xlIE1hcHNcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdGdNYXBTZXR1cCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRcdHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP3Y9My5leHAmJyArICdjYWxsYmFjaz0kJF8uZ01hcExvYWRlci5yZWFkeSc7XG5cdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gcmVhZHkoKSB7XG5cdFx0XHRmb3IgKHZhciBtZXRob2QgaW4gc3Vic2NyaWJlcnMpIHtcblx0XHRcdFx0c3Vic2NyaWJlcnNbbWV0aG9kXSgpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cdFx0fTtcblxuXHRcdC8vICQod2luZG93KS5sb2FkKGdNYXBTZXR1cClcblxuXHRcdC8vIFJldHVybmFsXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZWFkeTogcmVhZHksXG5cdFx0XHRzdWJzY3JpYmU6IHN1YnNjcmliZVxuXHRcdH07XG5cdH0pKCk7XG5cblx0ZXhwb3J0cy5yYW5kb21pemUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0dmFyIHV1aWQgPSAneHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuXHRcdFx0dmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcblx0XHRcdGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcblx0XHRcdHJldHVybiAoYyA9PSAneCcgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZygxNik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHV1aWQ7XG5cdH07XG5cblxufSk7Il19
