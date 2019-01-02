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
		return $firebaseAuth(window._Firebase);
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
		$scope.meta.history = {};
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
	historyCount
) {
	$timeout(function() {
		$scope.$digest();
	})

    $scope.pageClass = 'list';

    $scope.$on('$destroy', window.unbindAll);

    window.document.title = 'Home – LICK';

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
	Meta,
	historyCount,
	historical
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

	window.document.title = 'Text viewer for' + $scope.note.title + ' – LICK';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9qcy9tYWluLmpzIiwiLi4vanMvbW9kdWxlcy9ib2FyZEN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NoYW5nZUN0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2NvbG9waG9uQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaGVsbG9DdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9oaXN0b3J5Q3RybC5qcyIsIi4uL2pzL21vZHVsZXMvaW5mb0N0cmwuanMiLCIuLi9qcy9tb2R1bGVzL2xpc3RDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy9ub3RlQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvcG9ydGFsQ3RybC5qcyIsIi4uL2pzL21vZHVsZXMvc2hhcmVDdHJsLmpzIiwiLi4vanMvbW9kdWxlcy90ZXh0Q3RybC5qcyIsIi4uL2pzL3NoYXJlZC9jb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeHlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeC9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIFZlbmRvciBmaWxlc1xuLy8gdmFyICQgPSB3aW5kb3cualF1ZXJ5ID0gd2luZG93LiQgPSByZXF1aXJlKCcuL3ZlbmRvci9qcXVlcnktMS4xMS4xLm1pbicpO1xuXG52YXIgJCRfID0gd2luZG93LiQkXyA9IHJlcXVpcmUoJy4vc2hhcmVkL2NvcmUnKTsgXG5cbnZhciBoZWxsb0N0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvaGVsbG9DdHJsJyksXG5cdHBvcnRhbEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvcG9ydGFsQ3RybCcpLFxuXHRpbmZvQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9pbmZvQ3RybCcpLFxuXHRub3RlQ3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9ub3RlQ3RybCcpLFxuXHR0ZXh0Q3RybCA9IHJlcXVpcmUoJy4vbW9kdWxlcy90ZXh0Q3RybCcpLFxuXHRjaGFuZ2VDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2NoYW5nZUN0cmwnKSxcblx0aGlzdG9yeUN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvaGlzdG9yeUN0cmwnKSxcblx0Ym9hcmRDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL2JvYXJkQ3RybCcpLCBcblx0bGlzdEN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvbGlzdEN0cmwnKSxcblx0c2hhcmVDdHJsID0gcmVxdWlyZSgnLi9tb2R1bGVzL3NoYXJlQ3RybCcpLFxuXHRjb2xvcGhvbkN0cmwgPSByZXF1aXJlKCcuL21vZHVsZXMvY29sb3Bob25DdHJsJyk7XG5cbnZhciAkYm9keSA9ICQoJyNuZy1hcHAnKVxuXG53aW5kb3cuX0ZpcmViYXNlID0gbmV3IEZpcmViYXNlKCAnaHR0cHM6Ly9saWNrLmZpcmViYXNlaW8uY29tJyApO1xud2luZG93Lmxpc3RMb29raW5nQXQgPSAnbm90ZXMnO1xud2luZG93LmRpcmVjdGlvbnMgPSBbJ25vcnRoJywgJ2Vhc3QnLCAnc291dGgnLCAnd2VzdCddO1xud2luZG93LmxvZ2dlZEluID0gZmFsc2U7XG53aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG53aW5kb3cuaXNNb2JpbGVBcHAgPSBmYWxzZTtcbndpbmRvdy5oaXN0b3JpY2FsID0gW107XG53aW5kb3cudW5iaW5kaW5nID0gW107XG5cbndpbmRvdy5lbWFpbEVzY2FwZXIgPSBmdW5jdGlvbihlbWFpbCl7XG5cdHJldHVybiBlbWFpbC5yZXBsYWNlKC9bIC5dL2csIFwiX1wiKTtcbn07XG5cbndpbmRvdy5lbWFpbFVuZXNjYXBlciA9IGZ1bmN0aW9uKGVtYWlsKXtcblx0cmV0dXJuIGVtYWlsLnJlcGxhY2UoL1tfXS9nLCBcIi5cIik7XG59O1xuXG53aW5kb3cuZ2V0T2JqZWN0U2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzaXplID0gMCwgXG4gICAga2V5O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHNpemUrKztcbiAgICB9XG4gICAgcmV0dXJuIHNpemU7XG59O1xuXG53aW5kb3cuZ2V0T2JqZWN0RGVlcFNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2l6ZSA9IDAsIFxuICAgIFx0a2V5O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICBpZiAoXG4gICAgICAgIFx0dHlwZW9mKG9ialtrZXldKSA9PT0gJ29iamVjdCcgXG4gICAgICAgIFx0JiYga2V5LmluZGV4T2YoJyQnKSA8IDBcbiAgICBcdCkgc2l6ZSsrO1xuICAgIH1cbiAgICByZXR1cm4gc2l6ZTtcbn07XG5cbndpbmRvdy5pc190b3VjaF9kZXZpY2UgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyB8fCAnb25tc2dlc3R1cmVjaGFuZ2UnIGluIHdpbmRvdztcbn07XG5cbndpbmRvdy51bmJpbmRBbGwgPSBmdW5jdGlvbigpe1xuXHRmb3IgKHZhciBtZXRob2QgaW4gd2luZG93LnVuYmluZGluZyl7XG5cdFx0d2luZG93LnVuYmluZGluZ1ttZXRob2RdKCk7XG5cdH1cbn07XG5cbmlmICh3aW5kb3cuaXNfdG91Y2hfZGV2aWNlKCkpICRib2R5LmFkZENsYXNzKCd0b3VjaHknKVxuXG5pZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdpUGFkJykgPiAtMSl7XG5cdCQoJ2h0bWwnKS5hZGRDbGFzcygnaVBhZCcpXG59ZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdpUGhvbmUnKSA+IC0xIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignaVBvZCcpID4gLTEpe1xuXHQkKCdodG1sJykuYWRkQ2xhc3MoJ2lQaG9uZScpXG59XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlUmVhZHknLCBkZXZpY2VSZWFkeSwgZmFsc2UpO1xuXG5pZiAoXHRcblx0KGRvY3VtZW50LlVSTC5pbmRleE9mKCAnaHR0cDovLycgKSA9PT0gLTEpICYmXG5cdChkb2N1bWVudC5VUkwuaW5kZXhPZiggJ2h0dHBzOi8vJyApID09PSAtMSlcbil7XG5cdHdpbmRvdy5pc01vYmlsZUFwcCA9IHRydWU7XG5cdCRib2R5LmFkZENsYXNzKCdwaG9uZUdhcCcpO1x0XG59XG5cbmZ1bmN0aW9uIGRldmljZVJlYWR5KCl7XG5cdEFwcC5pbml0aWFsaXplKCk7XG5cdFN0YXR1c0Jhci5oaWRlKCk7XG59XG5cbiQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oZSl7XG5cdHZhciAkdGhhdCA9ICQodGhpcyksXG5cdFx0X3N0ID0gJHRoYXQuc2Nyb2xsVG9wKCk7XG5cblx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4KXtcblx0XHRpZiAoX3N0ID4gMTApe1xuXHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3RvcE5hdmlnYXRpb24nKVxuXHRcdH1lbHNle1xuXHRcdFx0JGJvZHkucmVtb3ZlQ2xhc3MoJ3RvcE5hdmlnYXRpb24nKVx0XHRcdFxuXHRcdH1cblx0fWVsc2V7XG5cdFx0aWYgKF9zdCA+IDIwKXtcblx0XHRcdCRib2R5LmFkZENsYXNzKCd0b3BOYXZpZ2F0aW9uJylcblx0XHR9ZWxzZXtcblx0XHRcdCRib2R5LnJlbW92ZUNsYXNzKCd0b3BOYXZpZ2F0aW9uJylcdFx0XHRcblx0XHR9XG5cdH1cbn0pXG5cbi8vIGRlZmluZSBvdXIgYXBwIGFuZCBkZXBlbmRlbmNpZXMgKHJlbWVtYmVyIHRvIGluY2x1ZGUgZmlyZWJhc2UhKVxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKFxuXHQnbGljaycsIFxuXHRbXG5cdFx0J2ZpcmViYXNlJywgXG5cdFx0J25nUm91dGUnLFxuXHRcdCd1aS5zb3J0YWJsZScsXG5cdFx0J2NmcC5ob3RrZXlzJyxcblx0XHQnbmdTYW5pdGl6ZScsXG5cdFx0J25nQ29va2llcycsXG5cdFx0J2dyaWRzdGVyJyxcblx0XHQnbmdBbmltYXRlJyxcblx0XHQnbmdUb3VjaCcsXG5cdFx0Ly8gJ2htVG91Y2hFdmVudHMnLFxuXHRcdCdzbGlja0Nhcm91c2VsJ1xuXHRdXG4pO1xuXG5hcHAucnVuKFtcIiRyb290U2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uKSB7XG5cdCRyb290U2NvcGUuJG9uKFwiJHJvdXRlQ2hhbmdlRXJyb3JcIiwgZnVuY3Rpb24oZXZlbnQsIG5leHQsIHByZXZpb3VzLCBlcnJvcikge1xuXHRcdGlmIChlcnJvciA9PT0gXCJBVVRIX1JFUVVJUkVEXCIpIHsgXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BvcnRhbCcpO1xuXHRcdH1cblx0fSk7XG59XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4ODg4ODg4OGJhICAgICxhZDg4ODhiYSwgICA4OCAgICAgICAgODggODg4ODg4ODg4ODg4IDg4ODg4ODg4ODg4IGFkODg4ODhiYSAgIFxuLy8gODggICAgICBcIjhiICBkOFwiJyAgICBgXCI4YiAgODggICAgICAgIDg4ICAgICAgODggICAgICA4OCAgICAgICAgIGQ4XCIgICAgIFwiOGIgIFxuLy8gODggICAgICAsOFAgZDgnICAgICAgICBgOGIgODggICAgICAgIDg4ICAgICAgODggICAgICA4OCAgICAgICAgIFk4LCAgICAgICAgICBcbi8vIDg4YWFhYWFhOFAnIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICA4OCAgICAgIDg4ICAgICAgODhhYWFhYSAgICBgWThhYWFhYSwgICAgXG4vLyA4OFwiXCJcIlwiODgnICAgODggICAgICAgICAgODggODggICAgICAgIDg4ICAgICAgODggICAgICA4OFwiXCJcIlwiXCIgICAgICBgXCJcIlwiXCJcIjhiLCAgXG4vLyA4OCAgICBgOGIgICBZOCwgICAgICAgICw4UCA4OCAgICAgICAgODggICAgICA4OCAgICAgIDg4ICAgICAgICAgICAgICAgICBgOGIgIFxuLy8gODggICAgIGA4YiAgIFk4YS4gICAgLmE4UCAgWThhLiAgICAuYThQICAgICAgODggICAgICA4OCAgICAgICAgIFk4YSAgICAgYThQICBcbi8vIDg4ICAgICAgYDhiICAgYFwiWTg4ODhZXCInICAgIGBcIlk4ODg4WVwiJyAgICAgICA4OCAgICAgIDg4ODg4ODg4ODg4IFwiWTg4ODg4UFwiICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cbmFwcC5jb25maWcoIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXJcblxuICAgICAgICAvLyByb3V0ZSBmb3Igc2ltcGx5IHR5cGluZyBpbiB0aGUgYWRkcmVzc1xuICAgICAgICAud2hlbignLycsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvaGVsbG8uaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdoZWxsb0N0cmwnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciB0aGUgbG9naW4gLyBwb3J0YWwgcGFnZVxuICAgICAgICAud2hlbignL3BvcnRhbCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvcG9ydGFsLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAncG9ydGFsQ3RybCcsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHRoZSBpbmZvIHBhZ2VcbiAgICAgICAgLndoZW4oJy9pbmZvJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9pbmZvLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnaW5mb0N0cmwnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBub3Rlc1xuICAgICAgICAud2hlbignL25vdGUvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9ub3RlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnbm90ZUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHNoYXJlZG5vdGVzXG4gICAgICAgIC53aGVuKCcvc2hhcmVkbm90ZS86aWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL25vdGUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyICA6ICdub3RlQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgdGV4dFxuICAgICAgICAud2hlbignL3RleHQvOmlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy90ZXh0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAndGV4dEN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGNoYW5naW5nIGJvYXJkc1xuICAgICAgICAud2hlbignL2NoYW5nZS86aWQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2NoYW5nZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXIgIDogJ2NoYW5nZUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGJvYXJkc1xuICAgICAgICAud2hlbignL2JvYXJkLzppZCcsIHsgXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2JvYXJkLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlciAgOiAnYm9hcmRDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIHJvdXRlIGZvciBsaXN0XG4gICAgICAgIC53aGVuKCcvbGlzdCcsIHsgXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2xpc3QuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyICA6ICdsaXN0Q3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyByb3V0ZSBmb3IgaGlzdG9yeVxuICAgICAgICAud2hlbignL2hpc3RvcnknLCB7IFxuXHRcdFx0dGVtcGxhdGVVcmwgOiAnYXNzZXRzL2luYy9oaXN0b3J5Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciAgOiAnaGlzdG9yeUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIHNoYXJlXG4gICAgICAgIC53aGVuKCcvc2hhcmUvOmlkJywgeyBcblx0XHRcdHRlbXBsYXRlVXJsIDogJ2Fzc2V0cy9pbmMvc2hhcmUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyICA6ICdzaGFyZUN0cmwnXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gcm91dGUgZm9yIGxpc3RcbiAgICAgICAgLndoZW4oJy9jb2xvcGhvbicsIHsgXG5cdFx0XHR0ZW1wbGF0ZVVybCA6ICdhc3NldHMvaW5jL2NvbG9waG9uLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciAgOiAnY29sb3Bob25DdHJsJ1xuICAgICAgICB9KTtcbn0pXG4ucnVuKCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRjb29raWVzLCBMb2dpbiwgJHJvdXRlLCAkdGltZW91dCwgJGFuaW1hdGUpIHtcblx0JHJvb3RTY29wZS4kb24oICckcm91dGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7XG5cblx0XHR3aW5kb3cuaGlzdG9yaWNhbC5wdXNoKCRsb2NhdGlvbi5wYXRoKCkpO1xuXG5cdFx0d2luZG93LmxvY2FsU3RvcmFnZS5oaXN0b3JpY2FsX2xhc3QgPSAkbG9jYXRpb24ucGF0aCgpO1xuXG5cdFx0aWYgKCh0eXBlb2YoY3VycmVudCkgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mKGN1cnJlbnQudGVtcGxhdGVVcmwpICE9PSAndW5kZWZpbmVkJykpXG5cdFx0XHQkYm9keS5hdHRyKCAnZGF0YS1sZWF2aW5nJywgY3VycmVudC50ZW1wbGF0ZVVybC5zcGxpdCgnLycpWzJdLnNwbGl0KCcuJylbMF0gKTtcblx0XHRpZiAoKHR5cGVvZihuZXh0KSAhPT0gJ3VuZGVmaW5lZCcpICYmICh0eXBlb2YobmV4dC50ZW1wbGF0ZVVybCkgIT09ICd1bmRlZmluZWQnKSlcblx0XHRcdCRib2R5LmF0dHIoICdkYXRhLWVudGVyaW5nJywgbmV4dC50ZW1wbGF0ZVVybC5zcGxpdCgnLycpWzJdLnNwbGl0KCcuJylbMF0gKTtcblx0XHRlbHNle1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGlmICh3aW5kb3cubG9nZ2VkSW4pe1xuXHRcdFx0Y29uc29sZS5sb2coJ2FscmVhZHkgbG9nZ2VkIGluIScpXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG5cblx0XHRcdGlmICgkbG9jYXRpb24ucGF0aCgpID09PSAnLycpXG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdGlmICggXG5cdFx0XHRcdCghd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCAmJiAhd2luZG93LmxvY2FsU3RvcmFnZS5wYXNzKSAmJlxuXHRcdFx0XHRuZXh0LnRlbXBsYXRlVXJsICE9PSAnYXNzZXRzL2luYy9jb2xvcGhvbi5odG1sJ1xuXHRcdFx0KXtcdFxuXHRcdFx0XHRjb25zb2xlLmxvZygnbm8gc3RvcmVkIGxvZ2luLCBnb3RvIHN0YXJ0Jylcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9wb3J0YWwnKVxuXHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0JGJvZHkuYWRkQ2xhc3MoJ3JlYWR5Jyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIFxuXHRcdFx0XHQoJGNvb2tpZXMuZW1haWwgJiYgJGNvb2tpZXMucGFzcykgfHwgXG5cdFx0XHRcdCh3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UucGFzcylcblx0XHRcdCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdzdG9yZWQgbG9naW4gZm91bmQsIGxvZ2dpbmcgaW4nKVxuXG5cdFx0XHRcdHZhciBsb2dpbkVtYWlsID0gJGNvb2tpZXMuZW1haWwgfHwgd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbCxcblx0XHRcdFx0XHRsb2dpblBhc3MgPSAkY29va2llcy5wYXNzIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2UucGFzcztcblxuXHRcdFx0XHRMb2dpbihsb2dpbkVtYWlsLCBsb2dpblBhc3MsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYgKG5leHQudGVtcGxhdGVVcmwgPT09ICdhc3NldHMvaW5jL3BvcnRhbC5odG1sJyl7XG5cdFx0XHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKTtcblxuXHRcdFx0XHRcdFx0aWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuaGlzdG9yaWNhbF9sYXN0KVxuXHRcdFx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCh3aW5kb3cubG9jYWxTdG9yYWdlLmhpc3RvcmljYWxfbGFzdCk7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdCRhbmltYXRlLmVuYWJsZWQoZmFsc2UpO1xuXHRcdFx0XHRcdFx0JHJvdXRlLnJlbG9hZCgpO1xuXHRcdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHQkYW5pbWF0ZS5lbmFibGVkKHRydWUpO1xuXHRcdFx0XHRcdFx0XHQkYm9keS5hZGRDbGFzcygncmVhZHknKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdCRib2R5LmF0dHIoJ2RhdGEtZGlyZWN0aW9uJywgZnVuY3Rpb24oKXtcblx0XHRpZiAoJGNvb2tpZXMuZGlyZWN0aW9uKXtcblx0XHRcdHJldHVybiB3aW5kb3cuZGlyZWN0aW9uc1skY29va2llcy5kaXJlY3Rpb24gJSA0XTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdCRjb29raWVzLmRpcmVjdGlvbiA9IDA7XG5cdFx0XHRyZXR1cm4gd2luZG93LmRpcmVjdGlvbnNbJGNvb2tpZXMuZGlyZWN0aW9uXTtcblx0XHR9XG5cdH0pIFxufSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4ODg4ODg4ODg4OCBkYiAgICAgICAgLGFkODg4OGJhLCA4ODg4ODg4ODg4ODggLGFkODg4OGJhLCAgIDg4ODg4ODg4YmEgIDg4IDg4ODg4ODg4ODg4IGFkODg4ODhiYSAgIFxuLy8gODggICAgICAgICBkODhiICAgICAgZDhcIicgICAgYFwiOGIgICAgIDg4ICAgICBkOFwiJyAgICBgXCI4YiAgODggICAgICBcIjhiIDg4IDg4ICAgICAgICAgZDhcIiAgICAgXCI4YiAgXG4vLyA4OCAgICAgICAgZDgnYDhiICAgIGQ4JyAgICAgICAgICAgICAgIDg4ICAgIGQ4JyAgICAgICAgYDhiIDg4ICAgICAgLDhQIDg4IDg4ICAgICAgICAgWTgsICAgICAgICAgIFxuLy8gODhhYWFhYSAgZDgnICBgOGIgICA4OCAgICAgICAgICAgICAgICA4OCAgICA4OCAgICAgICAgICA4OCA4OGFhYWFhYThQJyA4OCA4OGFhYWFhICAgIGBZOGFhYWFhLCAgICBcbi8vIDg4XCJcIlwiXCJcIiBkOFlhYWFhWThiICA4OCAgICAgICAgICAgICAgICA4OCAgICA4OCAgICAgICAgICA4OCA4OFwiXCJcIlwiODgnICAgODggODhcIlwiXCJcIlwiICAgICAgYFwiXCJcIlwiXCI4YiwgIFxuLy8gODggICAgIGQ4XCJcIlwiXCJcIlwiXCJcIjhiIFk4LCAgICAgICAgICAgICAgIDg4ICAgIFk4LCAgICAgICAgLDhQIDg4ICAgIGA4YiAgIDg4IDg4ICAgICAgICAgICAgICAgICBgOGIgIFxuLy8gODggICAgZDgnICAgICAgICBgOGIgWThhLiAgICAuYThQICAgICA4OCAgICAgWThhLiAgICAuYThQICA4OCAgICAgYDhiICA4OCA4OCAgICAgICAgIFk4YSAgICAgYThQICBcbi8vIDg4ICAgZDgnICAgICAgICAgIGA4YiBgXCJZODg4OFlcIicgICAgICA4OCAgICAgIGBcIlk4ODg4WVwiJyAgIDg4ICAgICAgYDhiIDg4IDg4ODg4ODg4ODg4IFwiWTg4ODg4UFwiICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAsYWRQUFliYSwgICAsYWRQUFliLGQ4IDg4IDhiLGRQUFliYSwgICBcbi8vIDg4IGE4XCIgICAgIFwiOGEgYThcIiAgICBgWTg4IDg4IDg4UCcgICBgXCI4YSAgXG4vLyA4OCA4YiAgICAgICBkOCA4YiAgICAgICA4OCA4OCA4OCAgICAgICA4OCAgXG4vLyA4OCBcIjhhLCAgICxhOFwiIFwiOGEsICAgLGQ4OCA4OCA4OCAgICAgICA4OCAgXG4vLyA4OCAgYFwiWWJiZFBcIicgICBgXCJZYmJkUFwiWTggODggODggICAgICAgODggIFxuLy8gICAgICAgICAgICAgICAgIGFhLCAgICAsODggICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICBcIlk4YmJkUFwiICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KFwiTG9naW5cIiwgWyckcm9vdFNjb3BlJywgXCIkZmlyZWJhc2VBdXRoXCIsIFwiJGNvb2tpZXNcIiwgJyR0aW1lb3V0JywgJ0F1dGgnLCAnJGxvY2F0aW9uJywgJ05vdGVzJyxcblx0ZnVuY3Rpb24oJHJvb3RTY29wZSwgJGZpcmViYXNlQXV0aCwgJGNvb2tpZXMsICR0aW1lb3V0LCBBdXRoLCAkbG9jYXRpb24sIE5vdGVzKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHRoZUVtYWlsLCB0aGVQYXNzLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjayl7XG5cblx0XHRcdGNvbnNvbGUubG9nKHdpbmRvdy5sb2dnaW5nSW4sIHRoZUVtYWlsLCB0aGVQYXNzLyosIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKi8pXG5cblx0XHRcdGlmICghd2luZG93LmxvZ2dpbmdJbil7XG5cdFx0XHRcdHdpbmRvdy5sb2dnaW5nSW4gPSB0cnVlO1xuXG5cdFx0XHRcdEF1dGguJGF1dGhXaXRoUGFzc3dvcmQoe1xuXHRcdFx0XHRcdGVtYWlsOiB0aGVFbWFpbCxcblx0XHRcdFx0XHRwYXNzd29yZDogdGhlUGFzc1xuXHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uKGF1dGhEYXRhKSB7XG5cblx0XHRcdFx0XHRjb25zb2xlLmxvZygnbG9nZ2VkIGluIHdpdGggJyArIHRoZUVtYWlsICsgJywgJyArIGF1dGhEYXRhLnVpZClcblx0XHRcdFx0XHR3aW5kb3cubG9nZ2luZ0luID0gZmFsc2U7XG5cblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsID0gJGNvb2tpZXMuZW1haWwgPSB0aGVFbWFpbDtcblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsX2VzY2FwZWQgPSAkY29va2llcy5lbWFpbF9lc2NhcGVkID0gd2luZG93LmVtYWlsRXNjYXBlcih0aGVFbWFpbCk7XG5cdFx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5wYXNzID0gJGNvb2tpZXMucGFzcyA9IHRoZVBhc3M7XG5cblx0XHRcdFx0XHR3aW5kb3cubG9jYWxTdG9yYWdlLnVpZCA9IHdpbmRvdy51aWQgPSBhdXRoRGF0YS51aWQ7XG5cblx0XHRcdFx0XHR3aW5kb3cubG9nZ2VkSW4gPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYoXG5cdFx0XHRcdFx0XHQobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lL2kpKSB8fCBcblx0XHRcdFx0XHRcdChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUG9kL2kpKSB8fFxuXHRcdFx0XHRcdFx0KG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSkpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cuZGV2aWNlID0gJ01vYmlsZSc7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR3aW5kb3cuZGV2aWNlID0gJ0Rlc2t0b3AnO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0eXBlb2YoY2FsbGJhY2spID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vVVBEQVRFXG5cblx0XHRcdFx0XHRyZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEnKTtcblx0XHRcdFx0XHRyZWYub25jZSgndmFsdWUnLCBmdW5jdGlvbihzbmFwc2hvdCkge1xuXG5cdFx0XHRcdFx0XHRpZiAoIXNuYXBzaG90LmV4aXN0cygpKXtcblx0XHRcdFx0XHRcdFx0cmVmLnNldCh7XG5cdFx0XHRcdFx0XHRcdFx0dXNlcjoge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZW1haWxfZXNjYXBlZDogJGNvb2tpZXMuZW1haWxfZXNjYXBlZCxcblx0XHRcdFx0XHRcdFx0XHRcdHVpZDogd2luZG93LnVpZFxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoZXJyb3JDYWxsYmFjaykgPT09ICdmdW5jdGlvbicpe1xuXHRcdFx0XHRcdFx0ZXJyb3JDYWxsYmFjaygpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHdpbmRvdy5sb2dnaW5nSW4gPSBmYWxzZTtcblx0XHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BvcnRhbCcpO1xuXHRcdFx0XHRcdCRib2R5LmFkZENsYXNzKCdyZWFkeScpO1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJBdXRoZW50aWNhdGlvbiBmYWlsZWQ6XCIsIGVycm9yKTtcblx0XHRcdFx0XHQkY29va2llcy5lbWFpbCA9ICcnO1xuXHRcdFx0XHRcdCRjb29raWVzLnBhc3MgPSAnJztcblx0XHRcdFx0XHRhbGVydCgnT2ggbm8hIFlvdXIgbG9naW4gZGlkblxcJ3Qgd29yay4gVHJ5IGFnYWluIScpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cdFx0XHRcblx0XHR9XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICBcbi8vIDg4ICAsYWRQUFliYSwgICAsYWRQUFliLGQ4ICAsYWRQUFliYSwgIDg4ICAgICAgIDg4IE1NODhNTU0gIFxuLy8gODggYThcIiAgICAgXCI4YSBhOFwiICAgIGBZODggYThcIiAgICAgXCI4YSA4OCAgICAgICA4OCAgIDg4ICAgICBcbi8vIDg4IDhiICAgICAgIGQ4IDhiICAgICAgIDg4IDhiICAgICAgIGQ4IDg4ICAgICAgIDg4ICAgODggICAgIFxuLy8gODggXCI4YSwgICAsYThcIiBcIjhhLCAgICxkODggXCI4YSwgICAsYThcIiBcIjhhLCAgICxhODggICA4OCwgICAgXG4vLyA4OCAgYFwiWWJiZFBcIicgICBgXCJZYmJkUFwiWTggIGBcIlliYmRQXCInICAgYFwiWWJiZFAnWTggICBcIlk4ODggIFxuLy8gICAgICAgICAgICAgICAgIGFhLCAgICAsODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgIFwiWThiYmRQXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeShcIkxvZ291dFwiLCBbXCIkZmlyZWJhc2VBdXRoXCIsIFwiJGNvb2tpZXNcIiwgJ0F1dGgnLCAnJGxvY2F0aW9uJywgJyR0aW1lb3V0JywgXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZUF1dGgsICRjb29raWVzLCBBdXRoLCAkbG9jYXRpb24sICR0aW1lb3V0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XG5cblx0XHRcdHdpbmRvdy5sb2dnZWRJbiA9IGZhbHNlO1xuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdEF1dGguJHVuYXV0aCgpO1xuXHRcdFx0XHQkY29va2llcy5lbWFpbCA9ICcnO1xuXHRcdFx0XHQkY29va2llcy5wYXNzID0gJyc7XG5cdFx0XHRcdHdpbmRvdy5sb2NhbFN0b3JhZ2UuZW1haWwgPSAnJztcblx0XHRcdFx0d2luZG93LmxvY2FsU3RvcmFnZS5wYXNzID0gJyc7XG5cdFx0XHRcdHdpbmRvdy51aWQgPSAnJztcblxuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL3BvcnRhbCcpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICA4OCAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgODggICAgICAgICAgIFxuLy8gLGFkUFBZWWJhLCA4OCAgICAgICA4OCBNTTg4TU1NIDg4LGRQUFliYSwgICBcbi8vIFwiXCIgICAgIGBZOCA4OCAgICAgICA4OCAgIDg4ICAgIDg4UCcgICAgXCI4YSAgXG4vLyAsYWRQUFBQUDg4IDg4ICAgICAgIDg4ICAgODggICAgODggICAgICAgODggIFxuLy8gODgsICAgICw4OCBcIjhhLCAgICxhODggICA4OCwgICA4OCAgICAgICA4OCAgXG4vLyBgXCI4YmJkUFwiWTggIGBcIlliYmRQJ1k4ICAgXCJZODg4IDg4ICAgICAgIDg4ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnQXV0aCcsIFtcIiRmaXJlYmFzZUF1dGhcIixcblx0ZnVuY3Rpb24oJGZpcmViYXNlQXV0aCkge1xuXHRcdHJldHVybiAkZmlyZWJhc2VBdXRoKHdpbmRvdy5fRmlyZWJhc2UpO1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAsYWRQUFliYSwgIFxuLy8gODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCBJOFsgICAgXCJcIiAgXG4vLyA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgYFwiWThiYSwgICBcbi8vIDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgYWEgICAgXThJICBcbi8vIDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyBgXCJZYmJkUFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdOb3RlcycsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ub3RlcycpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gLGFkUFBZYmEsIDg4LGRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYmEsICAsYWRQUFliLDg4IDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgLGFkUFBZYmEsICBcbi8vIEk4WyAgICBcIlwiIDg4UCcgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThQX19fX184OCBhOFwiICAgIGBZODggODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCBJOFsgICAgXCJcIiAgXG4vLyAgYFwiWThiYSwgIDg4ICAgICAgIDg4ICxhZFBQUFBQODggODggICAgICAgICA4UFBcIlwiXCJcIlwiXCJcIiA4YiAgICAgICA4OCA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgYFwiWThiYSwgICBcbi8vIGFhICAgIF04SSA4OCAgICAgICA4OCA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YiwgICAsYWEgXCI4YSwgICAsZDg4IDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgYWEgICAgXThJICBcbi8vIGBcIlliYmRQXCInIDg4ICAgICAgIDg4IGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCJZYmJkOFwiJyAgYFwiOGJiZFBcIlk4IDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyBgXCJZYmJkUFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ1NoYXJlZE5vdGVzJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgIFxuLy8gODgsZFBQWWJhLCAgICxhZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliLDg4ICxhZFBQWWJhLCAgXG4vLyA4OFAnICAgIFwiOGEgYThcIiAgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThcIiAgICBgWTg4IEk4WyAgICBcIlwiICBcbi8vIDg4ICAgICAgIGQ4IDhiICAgICAgIGQ4ICxhZFBQUFBQODggODggICAgICAgICA4YiAgICAgICA4OCAgYFwiWThiYSwgICBcbi8vIDg4YiwgICAsYThcIiBcIjhhLCAgICxhOFwiIDg4LCAgICAsODggODggICAgICAgICBcIjhhLCAgICxkODggYWEgICAgXThJICBcbi8vIDhZXCJZYmJkOFwiJyAgIGBcIlliYmRQXCInICBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiOGJiZFBcIlk4IGBcIlliYmRQXCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdCb2FyZHMnLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCkgeyBcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL2JvYXJkcycpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vIDhiLGRQUFliYSwgICAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIFxuLy8gODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vIDg4ICAgICAgIDg4ICBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkOFwiJyAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ub3Rlcy8nICsgaWQpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgXG4vLyAsYWRQUFliYSwgODgsZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliYSwgICxhZFBQWWIsODggOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgXG4vLyBJOFsgICAgXCJcIiA4OFAnICAgIFwiOGEgXCJcIiAgICAgYFk4IDg4UCcgICBcIlk4IGE4UF9fX19fODggYThcIiAgICBgWTg4IDg4UCcgICBgXCI4YSBhOFwiICAgICBcIjhhICA4OCAgIGE4UF9fX19fODggIFxuLy8gIGBcIlk4YmEsICA4OCAgICAgICA4OCAsYWRQUFBQUDg4IDg4ICAgICAgICAgOFBQXCJcIlwiXCJcIlwiXCIgOGIgICAgICAgODggODggICAgICAgODggOGIgICAgICAgZDggIDg4ICAgOFBQXCJcIlwiXCJcIlwiXCIgIFxuLy8gYWEgICAgXThJIDg4ICAgICAgIDg4IDg4LCAgICAsODggODggICAgICAgICBcIjhiLCAgICxhYSBcIjhhLCAgICxkODggODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSAgXG4vLyBgXCJZYmJkUFwiJyA4OCAgICAgICA4OCBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiWWJiZDhcIicgIGBcIjhiYmRQXCJZOCA4OCAgICAgICA4OCAgYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZDhcIicgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnc2hhcmVkTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCgnX3NoYXJlZC8nICsgaWQpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODgsZFBQWWJhLCAgICxhZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliLDg4ICBcbi8vIDg4UCcgICAgXCI4YSBhOFwiICAgICBcIjhhIFwiXCIgICAgIGBZOCA4OFAnICAgXCJZOCBhOFwiICAgIGBZODggIFxuLy8gODggICAgICAgZDggOGIgICAgICAgZDggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhiICAgICAgIDg4ICBcbi8vIDg4YiwgICAsYThcIiBcIjhhLCAgICxhOFwiIDg4LCAgICAsODggODggICAgICAgICBcIjhhLCAgICxkODggIFxuLy8gOFlcIlliYmQ4XCInICAgYFwiWWJiZFBcIicgIGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCI4YmJkUFwiWTggIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdCb2FyZCcsIFsnJGZpcmViYXNlT2JqZWN0Jyxcblx0ZnVuY3Rpb24oJGZpcmViYXNlT2JqZWN0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ib2FyZHMvJyArIGlkKTtcblx0XHRcdHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICBcbi8vIDg4LGRQWWJhLCxhZFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZWWJhLCAgXG4vLyA4OFAnICAgXCI4OFwiICAgIFwiOGEgYThQX19fX184OCAgIDg4ICAgIFwiXCIgICAgIGBZOCAgXG4vLyA4OCAgICAgIDg4ICAgICAgODggOFBQXCJcIlwiXCJcIlwiXCIgICA4OCAgICAsYWRQUFBQUDg4ICBcbi8vIDg4ICAgICAgODggICAgICA4OCBcIjhiLCAgICxhYSAgIDg4LCAgIDg4LCAgICAsODggIFxuLy8gODggICAgICA4OCAgICAgIDg4ICBgXCJZYmJkOFwiJyAgIFwiWTg4OCBgXCI4YmJkUFwiWTggIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdNZXRhJywgWyckZmlyZWJhc2VPYmplY3QnLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhJyk7XG5cdFx0XHRyZXR1cm4gJGZpcmViYXNlT2JqZWN0KHJlZik7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgXCJcIiAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4LGRQUFliYSwgIDg4ICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgOGIsZFBQWWJhLCA4YiAgICAgICBkOCAgXG4vLyA4OFAnICAgIFwiOGEgODggSThbICAgIFwiXCIgICA4OCAgIGE4XCIgICAgIFwiOGEgODhQJyAgIFwiWTggYDhiICAgICBkOCcgIFxuLy8gODggICAgICAgODggODggIGBcIlk4YmEsICAgIDg4ICAgOGIgICAgICAgZDggODggICAgICAgICAgYDhiICAgZDgnICAgXG4vLyA4OCAgICAgICA4OCA4OCBhYSAgICBdOEkgICA4OCwgIFwiOGEsICAgLGE4XCIgODggICAgICAgICAgIGA4YixkOCcgICAgXG4vLyA4OCAgICAgICA4OCA4OCBgXCJZYmJkUFwiJyAgIFwiWTg4OCBgXCJZYmJkUFwiJyAgODggICAgICAgICAgICAgWTg4JyAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4JyAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4JyAgICAgICBcblxuYXBwLmZhY3RvcnkoJ0hpc3RvcnknLCBbJyRmaXJlYmFzZU9iamVjdCcsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEvaGlzdG9yeScpO1xuXHRcdFx0cmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgIFwiXCIgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICBcbi8vIDg4ICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgXG4vLyA4OCxkUFBZYmEsICA4OCAsYWRQUFliYSwgTU04OE1NTSAsYWRQUFliYSwgIDhiLGRQUFliYSwgOGIgICAgICAgZDggICxhZFBQWWJhLCAgLGFkUFBZYmEsICA4OCAgICAgICA4OCA4YixkUFBZYmEsIE1NODhNTU0gIFxuLy8gODhQJyAgICBcIjhhIDg4IEk4WyAgICBcIlwiICAgODggICBhOFwiICAgICBcIjhhIDg4UCcgICBcIlk4IGA4YiAgICAgZDgnIGE4XCIgICAgIFwiXCIgYThcIiAgICAgXCI4YSA4OCAgICAgICA4OCA4OFAnICAgYFwiOGEgIDg4ICAgICBcbi8vIDg4ICAgICAgIDg4IDg4ICBgXCJZOGJhLCAgICA4OCAgIDhiICAgICAgIGQ4IDg4ICAgICAgICAgIGA4YiAgIGQ4JyAgOGIgICAgICAgICA4YiAgICAgICBkOCA4OCAgICAgICA4OCA4OCAgICAgICA4OCAgODggICAgIFxuLy8gODggICAgICAgODggODggYWEgICAgXThJICAgODgsICBcIjhhLCAgICxhOFwiIDg4ICAgICAgICAgICBgOGIsZDgnICAgXCI4YSwgICAsYWEgXCI4YSwgICAsYThcIiBcIjhhLCAgICxhODggODggICAgICAgODggIDg4LCAgICBcbi8vIDg4ICAgICAgIDg4IDg4IGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmRQXCInICA4OCAgICAgICAgICAgICBZODgnICAgICBgXCJZYmJkOFwiJyAgYFwiWWJiZFBcIicgICBgXCJZYmJkUCdZOCA4OCAgICAgICA4OCAgXCJZODg4ICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDgnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDgnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnaGlzdG9yeUNvdW50Jyxcblx0ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9tZXRhL2hpc3RvcnknKSxcblx0XHRcdFx0Y291bnQgPSAwO1xuXG5cdFx0XHRyZWYub25jZShcInZhbHVlXCIsIGZ1bmN0aW9uKHNuYXBzaG90KSB7XG5cblx0XHRcdFx0c25hcHNob3QuZm9yRWFjaChmdW5jdGlvbihjaGlsZFNuYXBzaG90KSB7XG5cdFx0XHRcdFx0dmFyIGNoaWxkRGF0YSA9IGNoaWxkU25hcHNob3QudmFsKCk7XG5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQoIGNoaWxkRGF0YS5kZXZpY2UgIT09IHdpbmRvdy5kZXZpY2UgKSB8fCBcblx0XHRcdFx0XHRcdCggY2hpbGREYXRhLnRpbWUgPCAoIERhdGUubm93KCkgLSAzNjAwMDAwICkgKVxuXHRcdFx0XHRcdCl7XG5cdFx0XHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y2FsbGJhY2soY291bnQpXG5cdFx0XHR9KVxuXHRcdH07XG5cdH1cbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCAgICAgICAgICBcIlwiICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDg4LGRQUFliYSwgIDg4ICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgOGIsZFBQWWJhLCA4OCAgLGFkUFBZYmEsICxhZFBQWVliYSwgODggIFxuLy8gODhQJyAgICBcIjhhIDg4IEk4WyAgICBcIlwiICAgODggICBhOFwiICAgICBcIjhhIDg4UCcgICBcIlk4IDg4IGE4XCIgICAgIFwiXCIgXCJcIiAgICAgYFk4IDg4ICBcbi8vIDg4ICAgICAgIDg4IDg4ICBgXCJZOGJhLCAgICA4OCAgIDhiICAgICAgIGQ4IDg4ICAgICAgICAgODggOGIgICAgICAgICAsYWRQUFBQUDg4IDg4ICBcbi8vIDg4ICAgICAgIDg4IDg4IGFhICAgIF04SSAgIDg4LCAgXCI4YSwgICAsYThcIiA4OCAgICAgICAgIDg4IFwiOGEsICAgLGFhIDg4LCAgICAsODggODggIFxuLy8gODggICAgICAgODggODggYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZFBcIicgIDg4ICAgICAgICAgODggIGBcIlliYmQ4XCInIGBcIjhiYmRQXCJZOCA4OCAgXG5cbndpbmRvdy5kZWJvdW5jZUhpc3RvcmljYWwgPSBfLmRlYm91bmNlKGZ1bmN0aW9uKCl7XG5cblx0aGlzdG9yaWNhbF9jb25zdHJ1Y3QoXG5cdFx0bm93LCBcblx0XHRpbmNvbWluZ05vdGUsIFxuXHRcdHNoYXJlQWN0aXZlLCBcblx0XHRjYWxsYmFjayxcblx0XHROb3RlLFxuXHRcdE1ldGEsXG5cdFx0JGNvb2tpZXNcblx0KVxuXG59LCA1MDAwKVxuXG4vLyB3aW5kb3cuZGVib3VuY2VIaXN0b3JpY2FsKCk7XG5cbnZhciBoaXN0b3JpY2FsX2VuZ2FnZSA9IGZ1bmN0aW9uKFxuXHRcdG5vdywgXG5cdFx0aW5jb21pbmdOb3RlLCBcblx0XHRzaGFyZUFjdGl2ZSwgXG5cdFx0Y2FsbGJhY2ssXG5cdFx0Tm90ZSxcblx0XHRNZXRhLFxuXHRcdCRjb29raWVzXG5cdCl7XG5cdFxufVxuXG5hcHAuc2VydmljZSgnaGlzdG9yaWNhbCcsIFsnTm90ZScsICdNZXRhJywgJyRjb29raWVzJyxcblx0ZnVuY3Rpb24oTm90ZSwgTWV0YSwgJGNvb2tpZXMpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oXG5cdFx0XHRub3csIFxuXHRcdFx0aW5jb21pbmdOb3RlLCBcblx0XHRcdHNoYXJlQWN0aXZlLCBcblx0XHRcdGNhbGxiYWNrXG5cdFx0KSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKGFyZ3VtZW50cylcblxuXHRcdFx0dmFyIGhpc3RvcmljYWxNYXJrZXIgPSB7XG5cdFx0XHRcdHRpdGxlOiBpbmNvbWluZ05vdGUudGl0bGUsXHRcdFxuXHRcdFx0XHRkZXZpY2U6IHdpbmRvdy5kZXZpY2UsXG5cdFx0XHRcdHRpbWU6IG5vdyxcblx0XHRcdFx0c2VlbjogZmFsc2UsXG5cdFx0XHRcdHNoYXJlZDogc2hhcmVBY3RpdmUsXG5cdFx0XHRcdGVkaXRvcjogJGNvb2tpZXMuZW1haWxfZXNjYXBlZCxcblx0XHRcdFx0dWlkOiB3aW5kb3cudWlkXG5cdFx0XHR9XG5cblx0XHRcdGlmIChzaGFyZUFjdGl2ZSl7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChpbmNvbWluZ05vdGUucGFydGljaXBhbnRzLCBmdW5jdGlvbih2LCBrKXtcblx0XHRcdFx0XHR2YXIgcmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh2LnVpZCArICcvbWV0YS9oaXN0b3J5LycgKyBpbmNvbWluZ05vdGUuaWQpO1xuXHRcdFx0XHRcdHJlZi5zZXQoaGlzdG9yaWNhbE1hcmtlcilcblx0XHRcdFx0fSk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS9oaXN0b3J5LycgKyBpbmNvbWluZ05vdGUuaWQpO1xuXHRcdFx0XHRyZWYuc2V0KGhpc3RvcmljYWxNYXJrZXIpXG5cdFx0XHR9XG5cblx0XHRcdGlmIChpbmNvbWluZ05vdGUucGFyZW50KXtcblx0XHRcdFx0dmFyIHJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvYm9hcmRzLycgKyBpbmNvbWluZ05vdGUucGFyZW50ICsgJy9sYXN0RWRpdGVkJyk7XG5cdFx0XHRcdHJlZi5zZXQobm93KVxuXHRcdFx0fWVsc2UgaWYgKGluY29taW5nTm90ZS5wYXJ0aWNpcGFudHMgJiYgaW5jb21pbmdOb3RlLnBhcnRpY2lwYW50c1t3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsX2VzY2FwZWRdLnBhcmVudCl7XG5cdFx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKCdfc2hhcmVkLycgKyBpbmNvbWluZ05vdGUuaWQgKyAnL3BhcnRpY2lwYW50cy8nICsgd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbF9lc2NhcGVkICsgJy9sYXN0RWRpdGVkJyk7XG5cdFx0XHRcdHJlZi5zZXQobm93KVxuXHRcdFx0fVxuXG5cdFx0XHRjYWxsYmFjaygpO1xuXG5cdFx0XHRjb25zb2xlLmxvZygnSElTVE9SSUNBTCcpXG5cblx0XHRcdFxuXG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICBcIlwiICAgLGQgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICA4OCAgICAgXG4vLyA4YixkUFBZYmEsICAgLGFkUFBZYmEsIDhiICAgICAgZGIgICAgICBkOCA4OCxkUFBZYmEsICA4OCBNTTg4TU1NICBcbi8vIDg4UCcgICBgXCI4YSBhOFBfX19fXzg4IGA4YiAgICBkODhiICAgIGQ4JyA4OFAnICAgIFwiOGEgODggICA4OCAgICAgXG4vLyA4OCAgICAgICA4OCA4UFBcIlwiXCJcIlwiXCJcIiAgYDhiICBkOCdgOGIgIGQ4JyAgODggICAgICAgZDggODggICA4OCAgICAgXG4vLyA4OCAgICAgICA4OCBcIjhiLCAgICxhYSAgIGA4YmQ4JyAgYDhiZDgnICAgODhiLCAgICxhOFwiIDg4ICAgODgsICAgIFxuLy8gODggICAgICAgODggIGBcIlliYmQ4XCInICAgICBZUCAgICAgIFlQICAgICA4WVwiWWJiZDhcIicgIDg4ICAgXCJZODg4ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCduZXdCaXQnLCBcblx0ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHRhYiwgY29udGVudCwgbGluaykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0dHlwZTpcInBsYWluVGV4dFwiLFxuXHRcdFx0XHR0YWJDb3VudDogdGFiLFxuXHRcdFx0XHRjb250ZW50OiB0eXBlb2YoY29udGVudCkgIT09ICd1bmRlZmluZWQnID8gY29udGVudCA6ICcnLFxuXHRcdFx0XHRjb250ZW50Q2FyZXQ6IHR5cGVvZihjb250ZW50KSAhPT0gJ3VuZGVmaW5lZCcgPyBjb250ZW50IDogJzxzcGFuIGNsYXNzPVwiaGlkZGVuQ2FyZXRcIj48L3NwYW4+Jyxcblx0XHRcdFx0Yml0SUQ6ICQkXy5yYW5kb21pemUoKSxcblx0XHRcdFx0bWFyazogZmFsc2UsXG5cdFx0XHRcdHNlbGVjdGVkOiBmYWxzZSxcblx0XHRcdFx0Y3JlYXRlZDogbmV3IERhdGUoKSxcblx0XHRcdFx0ZGVzdHJveWVkOiBcIlwiLFxuXHRcdFx0XHRtYXJrZWQ6IFwiXCIsXG5cdFx0XHRcdG1lbnVfb3BlbjogZmFsc2UsXG5cdFx0XHRcdGlzTGluazogdHlwZW9mKGxpbmspICE9PSAndW5kZWZpbmVkJyA/IHRydWUgOiBmYWxzZSxcblx0XHRcdFx0YWRkcmVzczogdHlwZW9mKGxpbmspICE9PSAndW5kZWZpbmVkJyA/IGxpbmsgOiAnJ1xuXHRcdFx0fTtcblx0XHR9O1xuXHR9XG4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICBhZDg4IDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgIGQ4XCIgICBcIlwiICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxkICAgICAgICAgICAgICAgXG4vLyAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgXG4vLyBNTTg4TU1NIDg4IDhiLGRQUFliYSwgLGFkUFBZYmEsIE1NODhNTU0gOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgXG4vLyAgIDg4ICAgIDg4IDg4UCcgICBcIlk4IEk4WyAgICBcIlwiICAgODggICAgODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyAgIDg4ICAgIDg4IDg4ICAgICAgICAgIGBcIlk4YmEsICAgIDg4ICAgIDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBcbi8vICAgODggICAgODggODggICAgICAgICBhYSAgICBdOEkgICA4OCwgICA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vICAgODggICAgODggODggICAgICAgICBgXCJZYmJkUFwiJyAgIFwiWTg4OCA4OCAgICAgICA4OCAgYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZDhcIicgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnZmlyc3ROb3RlJywgWyduZXdCaXQnLCAnJGNvb2tpZXMnLFxuXHRmdW5jdGlvbihuZXdCaXQsICRjb29raWVzKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHBhcmVudCwgaWQpIHtcblx0XHRcdHZhciByZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEvdXNlcicpO1xuXG5cdFx0XHRyZWYuc2V0KHtcblx0XHRcdFx0ZW1haWxfZXNjYXBlZDogJGNvb2tpZXMuZW1haWxfZXNjYXBlZCxcblx0XHRcdFx0dWlkOiB3aW5kb3cudWlkXG5cdFx0XHR9KVxuXG5cdFx0XHR2YXIgbm90ZUlEO1xuXG5cdFx0XHRpZiAoaWQpe1xuXHRcdFx0XHRub3RlSUQgPSBpZDtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRub3RlSUQgPSAkJF8ucmFuZG9taXplKCk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBub3RlUmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ub3Rlcy8nICsgbm90ZUlEICk7XG5cdFx0XHRub3RlUmVmLnNldCh7XG5cdFx0XHRcdHRpdGxlOiAnV2VsY29tZSB0byBMaWNrISA6KSBDbGljayBoZXJlIHRvIGdldCBzdGFydGVkIScsXG5cdFx0XHRcdHBhcmVudDogdHlwZW9mKHBhcmVudCkgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHBhcmVudCxcblx0XHRcdFx0aWQ6IG5vdGVJRCxcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdG5ld0JpdCgwLCAnSGkgdGhlcmUhIFdlbGNvbWUgdG8gTGljaywgdGhlIHNtYXJ0ZXN0IHdheSBmb3IgeW91ciB0b25ndWUgdG8gdGFrZSBub3Rlcy4gWW91ciBoYW5kcyBjYW4gaGVscCB0b28sIGlmIHRoZXlcXCdkIGxpa2UuIDopJyksXG5cdFx0XHRcdFx0bmV3Qml0KDAsICdMaWNrIGhhcm5lc3NlcyB0aGUgcG93ZXIgb2YgeW91ciBmYXZvcml0ZSB0ZXh0IGVkaXRvciB0byBoZWxwIHlvdSBvcmdhbml6ZSB5b3VyIGxpZmUuJyksXG5cdFx0XHRcdFx0bmV3Qml0KDEsICdJZiB5b3UgZG9uXFwndCBrbm93IHdoYXQgb25lIG9mIHRob3NlIGlzLCB0aGF0XFwncyBva2F5IOKAkyBMaWNrIGlzIHN0aWxsIGp1c3QgeW91ciBzcGVlZCEnKSxcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ05vdGVzIGNhbiBlaXRoZXIgYmUgc3RhbmQtYWxvbmUsIG9yIGNhbiBiZSBvcmdhbml6ZWQgaW50byBib2FyZHMuIEdvIGFoZWFkIGFuZCBjbG9zZSB0aGlzIGFuZCBtYWtlIGEgbmV3IGJvYXJkLCB0aGV5XFwncmUgcHJldHR5IGhhbmR5IScpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnTGljayBzZWVtcyBwcmV0dHkgc2ltcGxlLCBidXQgaXRcXCdzIGdvdCBhIGxvdCBvZiBjb29sIHRoaW5ncyBidWlsdCByaWdodCBpbi4gSXQgbWlnaHQgc3VycHJpc2UgeW91IScpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnQSBsaXN0IG9mIExpY2tcXCdzIGtleWJvYXJkIHNob3J0Y3V0cyBpcyBuZXZlciBmYXIgZnJvbSByZWFjaDogcHJlc3MgY29tbWFuZCArID8gdG8gc2VlIGl0IScpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnT24gYSBtb2JpbGUgZGV2aWNlPyBUaGVyZSBhcmUgbG90cyBvZiBzd2lwYWJsZSB0aGluZ3Mg4oCTIGdpdmUgaXQgYSBzaG90IScpLCBcblx0XHRcdFx0XHRuZXdCaXQoMCwgJ0xpY2sgaXMgYSB3b3JrIGluIHByb2dyZXNzLCBhbmQgaWYgc29tZXRoaW5nIGdvZXMgd3JvbmcsIGxldCBtZSBrbm93IGF0IGVAamVjdC5jaC4nLCAnbWFpbHRvOmVAamVjdC5jaCcpLFxuXHRcdFx0XHRcdG5ld0JpdCgwLCAnSGFwcHkgTGlja2luZyEgOiknKVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRjYXRlZ29yeTogMCxcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0bGlzdDogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBub3RlSUQ7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgIFxuLy8gOGIsZFBQWWJhLCAgICxhZFBQWWJhLCA4YiAgICAgIGRiICAgICAgZDggOGIsZFBQWWJhLCAgICxhZFBQWWJhLCBNTTg4TU1NICxhZFBQWWJhLCAgXG4vLyA4OFAnICAgYFwiOGEgYThQX19fX184OCBgOGIgICAgZDg4YiAgICBkOCcgODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyA4OCAgICAgICA4OCA4UFBcIlwiXCJcIlwiXCJcIiAgYDhiICBkOCdgOGIgIGQ4JyAgODggICAgICAgODggOGIgICAgICAgZDggIDg4ICAgOFBQXCJcIlwiXCJcIlwiXCIgIFxuLy8gODggICAgICAgODggXCI4YiwgICAsYWEgICBgOGJkOCcgIGA4YmQ4JyAgIDg4ICAgICAgIDg4IFwiOGEsICAgLGE4XCIgIDg4LCAgXCI4YiwgICAsYWEgIFxuLy8gODggICAgICAgODggIGBcIlliYmQ4XCInICAgICBZUCAgICAgIFlQICAgICA4OCAgICAgICA4OCAgYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZDhcIicgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ25ld05vdGUnLCBbJ25ld0JpdCcsXG5cdGZ1bmN0aW9uKG5ld0JpdCkge1xuXHRcdHJldHVybiBmdW5jdGlvbihwYXJlbnQsIGlkKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKGFyZ3VtZW50cylcblx0XHRcdHZhciBub3RlSUQ7XG5cblx0XHRcdGlmIChpZCl7XG5cdFx0XHRcdG5vdGVJRCA9IGlkO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG5vdGVJRCA9ICQkXy5yYW5kb21pemUoKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG5vdGVSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL25vdGVzLycgKyBub3RlSUQgKTtcblx0XHRcdG5vdGVSZWYuc2V0KHtcblx0XHRcdFx0dGl0bGU6ICcnLFxuXHRcdFx0XHRwYXJlbnQ6IHR5cGVvZihwYXJlbnQpID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBwYXJlbnQsXG5cdFx0XHRcdGlkOiBub3RlSUQsXG5cdFx0XHRcdGJvZHk6IFtuZXdCaXQoMCldLFxuXHRcdFx0XHRjYXRlZ29yeTogMCxcblx0XHRcdFx0ZGlzcGxheTogdHJ1ZSxcblx0XHRcdFx0bGlzdDogdHJ1ZSxcblx0XHRcdFx0eDogMCxcblx0XHRcdFx0eTogMCxcblx0XHRcdFx0bGFzdEVkaXRlZDogRGF0ZS5ub3coKVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBub3RlSUQ7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vICxhZFBQWWJhLCA4OCxkUFBZYmEsICAsYWRQUFlZYmEsIDhiLGRQUFliYSwgICxhZFBQWWJhLCA4YixkUFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICBcbi8vIEk4WyAgICBcIlwiIDg4UCcgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThQX19fX184OCA4OFAnICAgYFwiOGEgYThcIiAgICAgXCI4YSAgODggICBhOFBfX19fXzg4ICBcbi8vICBgXCJZOGJhLCAgODggICAgICAgODggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhQUFwiXCJcIlwiXCJcIlwiIDg4ICAgICAgIDg4IDhiICAgICAgIGQ4ICA4OCAgIDhQUFwiXCJcIlwiXCJcIlwiICBcbi8vIGFhICAgIF04SSA4OCAgICAgICA4OCA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YiwgICAsYWEgODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSAgXG4vLyBgXCJZYmJkUFwiJyA4OCAgICAgICA4OCBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiWWJiZDhcIicgODggICAgICAgODggIGBcIlliYmRQXCInICAgXCJZODg4IGBcIlliYmQ4XCInICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ3NoYXJlTm90ZScsIFsnJGZpcmViYXNlT2JqZWN0JywgJ01ldGEnLCAnTm90ZScsICdOb3RlcycsICckY29va2llcycsICckbG9jYXRpb24nLFxuXHRmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QsIE1ldGEsIE5vdGUsIE5vdGVzLCAkY29va2llcywgJGxvY2F0aW9uKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkLCB0YXJnZXQsIGNhbGxiYWNrKSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKGFyZ3VtZW50cylcblxuXHRcdFx0dmFyIG1ldGFSZWYgPSB3aW5kb3cuX0ZpcmViYXNlLmNoaWxkKHdpbmRvdy51aWQgKyAnL21ldGEvc2hhcmVkVXNlcnMvJykucHVzaCh0YXJnZXQpO1xuXG5cdFx0XHR2YXIgdHJhbnNhY3Rpb24gPSBOb3RlKGlkKS4kbG9hZGVkKCkudGhlbihmdW5jdGlvbihwcml2YXRlTm90ZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhwcml2YXRlTm90ZSlcblx0XHRcdFx0dmFyIHNoYXJpbmcgPSB7fTtcblx0XHRcdFx0aWYgKHByaXZhdGVOb3RlLnBhcmVudCl7XG5cdFx0XHRcdFx0c2hhcmluZ1skY29va2llcy5lbWFpbF9lc2NhcGVkXSA9IHtcblx0XHRcdFx0XHRcdHVpZDogd2luZG93LnVpZCxcblx0XHRcdFx0XHRcdHBhcmVudDogcHJpdmF0ZU5vdGUucGFyZW50LFxuXHRcdFx0XHRcdFx0eDogcHJpdmF0ZU5vdGUueCxcblx0XHRcdFx0XHRcdHk6IHByaXZhdGVOb3RlLnlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHNoYXJpbmdbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0gPSB7IFxuXHRcdFx0XHRcdFx0cGFyZW50OiBmYWxzZSxcblx0XHRcdFx0XHRcdHVpZDogd2luZG93LnVpZCxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzaGFyaW5nW2VtYWlsRXNjYXBlcih0YXJnZXQpXSA9IHsgcGFyZW50OiBmYWxzZSB9XG5cblx0XHRcdFx0dmFyIHNoYXJlZFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArIGlkKTtcblx0XHRcdFx0c2hhcmVkUmVmLnNldCh7XG5cdFx0XHRcdFx0dGl0bGU6IHByaXZhdGVOb3RlLnRpdGxlLFxuXHRcdFx0XHRcdGlkOiBwcml2YXRlTm90ZS5pZCxcblx0XHRcdFx0XHRib2R5OiBwcml2YXRlTm90ZS5ib2R5LFxuXHRcdFx0XHRcdGNhdGVnb3J5OiBwcml2YXRlTm90ZS5jYXRlZ29yeSxcblx0XHRcdFx0XHRkaXNwbGF5OiBwcml2YXRlTm90ZS5kaXNwbGF5LFxuXHRcdFx0XHRcdGxpc3Q6IHByaXZhdGVOb3RlLmxpc3QsXG5cdFx0XHRcdFx0cGFydGljaXBhbnRzOiBzaGFyaW5nXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHByaXZhdGVOb3RlLiRyZW1vdmUoKTtcblxuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgODggICAsZCAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgODggICA4OCAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vICxhZFBQWVliYSwgICxhZFBQWWIsODggICxhZFBQWWIsODggTU04OE1NTSAsYWRQUFliYSwgICxhZFBQWWJhLCA4OCxkUFBZYmEsICAsYWRQUFlZYmEsIDhiLGRQUFliYSwgICxhZFBQWWJhLCAgLGFkUFBZYiw4OCA4YixkUFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICBcbi8vIFwiXCIgICAgIGBZOCBhOFwiICAgIGBZODggYThcIiAgICBgWTg4ICAgODggICBhOFwiICAgICBcIjhhIEk4WyAgICBcIlwiIDg4UCcgICAgXCI4YSBcIlwiICAgICBgWTggODhQJyAgIFwiWTggYThQX19fX184OCBhOFwiICAgIGBZODggODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyAsYWRQUFBQUDg4IDhiICAgICAgIDg4IDhiICAgICAgIDg4ICAgODggICA4YiAgICAgICBkOCAgYFwiWThiYSwgIDg4ICAgICAgIDg4ICxhZFBQUFBQODggODggICAgICAgICA4UFBcIlwiXCJcIlwiXCJcIiA4YiAgICAgICA4OCA4OCAgICAgICA4OCA4YiAgICAgICBkOCAgODggICA4UFBcIlwiXCJcIlwiXCJcIiAgXG4vLyA4OCwgICAgLDg4IFwiOGEsICAgLGQ4OCBcIjhhLCAgICxkODggICA4OCwgIFwiOGEsICAgLGE4XCIgYWEgICAgXThJIDg4ICAgICAgIDg4IDg4LCAgICAsODggODggICAgICAgICBcIjhiLCAgICxhYSBcIjhhLCAgICxkODggODggICAgICAgODggXCI4YSwgICAsYThcIiAgODgsICBcIjhiLCAgICxhYSAgXG4vLyBgXCI4YmJkUFwiWTggIGBcIjhiYmRQXCJZOCAgYFwiOGJiZFBcIlk4ICAgXCJZODg4IGBcIlliYmRQXCInICBgXCJZYmJkUFwiJyA4OCAgICAgICA4OCBgXCI4YmJkUFwiWTggODggICAgICAgICAgYFwiWWJiZDhcIicgIGBcIjhiYmRQXCJZOCA4OCAgICAgICA4OCAgYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZDhcIicgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgnYWRkVG9TaGFyZWROb3RlJywgWyckZmlyZWJhc2VPYmplY3QnLCAnTWV0YScsICdOb3RlJywgJyRjb29raWVzJywgJyRsb2NhdGlvbicsXG5cdGZ1bmN0aW9uKCRmaXJlYmFzZU9iamVjdCwgTWV0YSwgTm90ZSwgJGNvb2tpZXMsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgdGFyZ2V0LCBjYWxsYmFjaykge1xuXG5cdFx0XHR2YXIgbWV0YVJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQod2luZG93LnVpZCArICcvbWV0YS9zaGFyZWRVc2Vycy8nKS5wdXNoKHRhcmdldCk7XG5cblx0XHRcdHZhciBwYXJ0aWNpcGFudFJlZiA9IHdpbmRvdy5fRmlyZWJhc2UuY2hpbGQoJ19zaGFyZWQvJyArIGlkICsgJy9wYXJ0aWNpcGFudHMvJyArIGVtYWlsRXNjYXBlcih0YXJnZXQpKTtcblxuXHRcdFx0Y29uc29sZS5sb2cocGFydGljaXBhbnRSZWYpXG5cblx0XHRcdHBhcnRpY2lwYW50UmVmLnNldCh7XG5cdFx0XHRcdHBhcmVudDogZmFsc2Vcblx0XHRcdH0sIGNhbGxiYWNrKVxuXHRcdH07XG5cdH1cbl0pO1xuXG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgODggODggODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4OCAgICAgICAgXCJcIiA4OCA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgLGQgICAgICAgICAgICAgICBcbi8vIDg4ICAgICAgICAgICA4OCA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICBcbi8vIDg4ICAgLGQ4ICA4OCA4OCA4OCA4YixkUFBZYmEsICAgLGFkUFBZYmEsIE1NODhNTU0gLGFkUFBZYmEsICBcbi8vIDg4ICxhOFwiICAgODggODggODggODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiOGEgIDg4ICAgYThQX19fX184OCAgXG4vLyA4ODg4WyAgICAgODggODggODggODggICAgICAgODggOGIgICAgICAgZDggIDg4ICAgOFBQXCJcIlwiXCJcIlwiXCIgIFxuLy8gODhgXCJZYmEsICA4OCA4OCA4OCA4OCAgICAgICA4OCBcIjhhLCAgICxhOFwiICA4OCwgIFwiOGIsICAgLGFhICBcbi8vIDg4ICAgYFk4YSA4OCA4OCA4OCA4OCAgICAgICA4OCAgYFwiWWJiZFBcIicgICBcIlk4ODggYFwiWWJiZDhcIicgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5hcHAuZmFjdG9yeSgna2lsbE5vdGUnLCBbJ05vdGUnLCAnc2hhcmVkTm90ZScsICckbG9jYXRpb24nLFxuXHRmdW5jdGlvbihOb3RlLCBzaGFyZWROb3RlLCAkbG9jYXRpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oaWQsIHBhcmVudCkge1xuXG5cdFx0XHRpZiAocGFyZW50KXtcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgcGFyZW50KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRub3RlID0gTm90ZShpZCk7XG5cdFx0XHRub3RlLiRyZW1vdmUoKTtcblxuXHRcdFx0Y29uc29sZS5sb2coaWQpO1xuXG5cdFx0XHRzaGFyZWRub3RlID0gc2hhcmVkTm90ZShpZCk7XG5cdFx0XHRzaGFyZWRub3RlLiRyZW1vdmUoKTtcblx0XHR9O1xuXHR9XG5dKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICBcbi8vIDhiLGRQUFliYSwgICAsYWRQUFliYSwgOGIgICAgICBkYiAgICAgIGQ4IDg4LGRQUFliYSwgICAsYWRQUFliYSwgICxhZFBQWVliYSwgOGIsZFBQWWJhLCAgLGFkUFBZYiw4OCAgXG4vLyA4OFAnICAgYFwiOGEgYThQX19fX184OCBgOGIgICAgZDg4YiAgICBkOCcgODhQJyAgICBcIjhhIGE4XCIgICAgIFwiOGEgXCJcIiAgICAgYFk4IDg4UCcgICBcIlk4IGE4XCIgICAgYFk4OCAgXG4vLyA4OCAgICAgICA4OCA4UFBcIlwiXCJcIlwiXCJcIiAgYDhiICBkOCdgOGIgIGQ4JyAgODggICAgICAgZDggOGIgICAgICAgZDggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhiICAgICAgIDg4ICBcbi8vIDg4ICAgICAgIDg4IFwiOGIsICAgLGFhICAgYDhiZDgnICBgOGJkOCcgICA4OGIsICAgLGE4XCIgXCI4YSwgICAsYThcIiA4OCwgICAgLDg4IDg4ICAgICAgICAgXCI4YSwgICAsZDg4ICBcbi8vIDg4ICAgICAgIDg4ICBgXCJZYmJkOFwiJyAgICAgWVAgICAgICBZUCAgICAgOFlcIlliYmQ4XCInICAgYFwiWWJiZFBcIicgIGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCI4YmJkUFwiWTggIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbmFwcC5mYWN0b3J5KCduZXdCb2FyZCcsIFsnbmV3Tm90ZScsXG5cdGZ1bmN0aW9uKG5ld05vdGUpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0XHRib2FyZElEID0gJCRfLnJhbmRvbWl6ZSgpO1xuXG5cdFx0XHQvL0JPQVJEU1xuXHRcdFx0dmFyIGJvYXJkUmVmID0gd2luZG93Ll9GaXJlYmFzZS5jaGlsZCh3aW5kb3cudWlkICsgJy9ib2FyZHMvJyArIGJvYXJkSUQgKTtcblx0XHRcdGJvYXJkUmVmLnNldCh7XG5cdFx0XHRcdHRpdGxlOiAnJyxcblx0XHRcdFx0aWQ6IGJvYXJkSUQsXG5cdFx0XHRcdHN0YXJyZWQ6IG51bGwsXG5cdFx0XHRcdGxhc3RFZGl0ZWQ6IERhdGUubm93KCksXG5cdFx0XHRcdG5vdGVzOltdXG5cdFx0XHR9KTtcblxuXHRcdFx0bmV3Tm90ZShib2FyZElEKTtcblxuXHRcdFx0cmV0dXJuIGJvYXJkSUQ7XG5cdFx0fTtcblx0fVxuXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gODggICAgICAgIDg4IDg4IDg4IDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCAgICAgICAgXCJcIiA4OCA4OCA4OCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggIFxuLy8gODggICAgICAgICAgIDg4IDg4IDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgXG4vLyA4OCAgICxkOCAgODggODggODggODgsZFBQWWJhLCAgICxhZFBQWWJhLCAgLGFkUFBZWWJhLCA4YixkUFBZYmEsICAsYWRQUFliLDg4ICBcbi8vIDg4ICxhOFwiICAgODggODggODggODhQJyAgICBcIjhhIGE4XCIgICAgIFwiOGEgXCJcIiAgICAgYFk4IDg4UCcgICBcIlk4IGE4XCIgICAgYFk4OCAgXG4vLyA4ODg4WyAgICAgODggODggODggODggICAgICAgZDggOGIgICAgICAgZDggLGFkUFBQUFA4OCA4OCAgICAgICAgIDhiICAgICAgIDg4ICBcbi8vIDg4YFwiWWJhLCAgODggODggODggODhiLCAgICxhOFwiIFwiOGEsICAgLGE4XCIgODgsICAgICw4OCA4OCAgICAgICAgIFwiOGEsICAgLGQ4OCAgXG4vLyA4OCAgIGBZOGEgODggODggODggOFlcIlliYmQ4XCInICAgYFwiWWJiZFBcIicgIGBcIjhiYmRQXCJZOCA4OCAgICAgICAgICBgXCI4YmJkUFwiWTggIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuYXBwLmZhY3RvcnkoJ2tpbGxCb2FyZCcsIFsnQm9hcmQnLCAnJGxvY2F0aW9uJyxcblx0ZnVuY3Rpb24oQm9hcmQsICRsb2NhdGlvbikge1xuXHRcdHJldHVybiBmdW5jdGlvbihpZCwgcGFyZW50KSB7XG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdGJvYXJkID0gQm9hcmQoaWQpO1xuXHRcdFx0Ym9hcmQuJHJlbW92ZSgpO1xuXHRcdH07XG5cdH1cbl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODggICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsZCAgICAgICAgICAgICAgIFwiXCIgICAgICAgICAgICBcIlwiICAgLGQgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICBcbi8vICAsYWRQUFliYSwgICxhZFBQWWJhLCAgOGIsZFBQWWJhLCAgICxhZFBQWWJhLCAgLGFkUFBZYmEsIDhiLGRQUFliYSwgTU04OE1NTSA4YixkUFBZYmEsIDg4ICAsYWRQUFliYSwgODggTU04OE1NTSA4YiAgICAgICBkOCAgXG4vLyBhOFwiICAgICBcIlwiIGE4XCIgICAgIFwiOGEgODhQJyAgIGBcIjhhIGE4XCIgICAgIFwiXCIgYThQX19fX184OCA4OFAnICAgYFwiOGEgIDg4ICAgIDg4UCcgICBcIlk4IDg4IGE4XCIgICAgIFwiXCIgODggICA4OCAgICBgOGIgICAgIGQ4JyAgXG4vLyA4YiAgICAgICAgIDhiICAgICAgIGQ4IDg4ICAgICAgIDg4IDhiICAgICAgICAgOFBQXCJcIlwiXCJcIlwiXCIgODggICAgICAgODggIDg4ICAgIDg4ICAgICAgICAgODggOGIgICAgICAgICA4OCAgIDg4ICAgICBgOGIgICBkOCcgICBcbi8vIFwiOGEsICAgLGFhIFwiOGEsICAgLGE4XCIgODggICAgICAgODggXCI4YSwgICAsYWEgXCI4YiwgICAsYWEgODggICAgICAgODggIDg4LCAgIDg4ICAgICAgICAgODggXCI4YSwgICAsYWEgODggICA4OCwgICAgIGA4YixkOCcgICAgXG4vLyAgYFwiWWJiZDhcIicgIGBcIlliYmRQXCInICA4OCAgICAgICA4OCAgYFwiWWJiZDhcIicgIGBcIlliYmQ4XCInIDg4ICAgICAgIDg4ICBcIlk4ODggODggICAgICAgICA4OCAgYFwiWWJiZDhcIicgODggICBcIlk4ODggICAgIFk4OCcgICAgIFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkOCcgICAgICBcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkOCcgICAgICAgXG5cbmFwcC5mYWN0b3J5KCdjb25jZW50cmljaXR5JywgWyckY29va2llcycsXG5cdGZ1bmN0aW9uKCRjb29raWVzKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGlkLCBwYXJlbnQpIHtcblx0XHRcdCRib2R5LmFkZENsYXNzKCdjb25jZW50cmljJykuYXR0cignZGF0YS1kaXJlY3Rpb24nLCBcblx0XHRcdFx0ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRyZXR1cm4gd2luZG93LmRpcmVjdGlvbnNbKyskY29va2llcy5kaXJlY3Rpb24gJSA0XTtcblx0XHRcdFx0fVxuXHRcdFx0KVxuXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRib2R5LnJlbW92ZUNsYXNzKCdjb25jZW50cmljJylcblx0XHRcdH0sIDEwMDApXG5cdFx0fTtcblx0fVxuXSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyA4ODg4ODg4ODg4OCA4OCA4OCAgICAgODg4ODg4ODg4ODg4IDg4ODg4ODg4ODg4IDg4ODg4ODg4YmEgICBhZDg4ODg4YmEgICBcbi8vIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgODggICAgICAgICAgODggICAgICBcIjhiIGQ4XCIgICAgIFwiOGIgIFxuLy8gODggICAgICAgICAgODggODggICAgICAgICAgODggICAgICA4OCAgICAgICAgICA4OCAgICAgICw4UCBZOCwgICAgICAgICAgXG4vLyA4OGFhYWFhICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgIDg4YWFhYWEgICAgIDg4YWFhYWFhOFAnIGBZOGFhYWFhLCAgICBcbi8vIDg4XCJcIlwiXCJcIiAgICAgODggODggICAgICAgICAgODggICAgICA4OFwiXCJcIlwiXCIgICAgIDg4XCJcIlwiXCI4OCcgICAgIGBcIlwiXCJcIlwiOGIsICBcbi8vIDg4ICAgICAgICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICAgODggICAgICAgICAgODggICAgYDhiICAgICAgICAgICBgOGIgIFxuLy8gODggICAgICAgICAgODggODggICAgICAgICAgODggICAgICA4OCAgICAgICAgICA4OCAgICAgYDhiICBZOGEgICAgIGE4UCAgXG4vLyA4OCAgICAgICAgICA4OCA4ODg4ODg4ODg4OCA4OCAgICAgIDg4ODg4ODg4ODg4IDg4ICAgICAgYDhiICBcIlk4ODg4OFBcIiAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblxuYXBwLmZpbHRlcignb3JkZXJPYmplY3RCeScsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gZnVuY3Rpb24oaXRlbXMsIGZpZWxkLCByZXZlcnNlKSB7XG5cdHZhciBmaWx0ZXJlZCA9IFtdO1xuXHRhbmd1bGFyLmZvckVhY2goaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcblx0ZmlsdGVyZWQucHVzaChpdGVtKTtcblx0fSk7XG5cdGZpbHRlcmVkLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0cmV0dXJuIChhW2ZpZWxkXSA+IGJbZmllbGRdID8gMSA6IC0xKTtcblx0fSk7XG5cdGlmKHJldmVyc2UpIGZpbHRlcmVkLnJldmVyc2UoKTtcblx0cmV0dXJuIGZpbHRlcmVkO1xuXHR9O1xufSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgLGFkODg4OGJhLCAgICxhZDg4ODhiYSwgICA4ODhiICAgICAgODggODg4ODg4ODg4ODg4IDg4ODg4ODg4YmEgICAgLGFkODg4OGJhLCAgIDg4ICAgICAgICAgIDg4ICAgICAgICAgIDg4ODg4ODg4ODg4IDg4ODg4ODg4YmEgICBhZDg4ODg4YmEgICBcbi8vICBkOFwiJyAgICBgXCI4YiBkOFwiJyAgICBgXCI4YiAgODg4OGIgICAgIDg4ICAgICAgODggICAgICA4OCAgICAgIFwiOGIgIGQ4XCInICAgIGBcIjhiICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgIFwiOGIgZDhcIiAgICAgXCI4YiAgXG4vLyBkOCcgICAgICAgICAgZDgnICAgICAgICBgOGIgODggYDhiICAgIDg4ICAgICAgODggICAgICA4OCAgICAgICw4UCBkOCcgICAgICAgIGA4YiA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICw4UCBZOCwgICAgICAgICAgXG4vLyA4OCAgICAgICAgICAgODggICAgICAgICAgODggODggIGA4YiAgIDg4ICAgICAgODggICAgICA4OGFhYWFhYThQJyA4OCAgICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OGFhYWFhICAgICA4OGFhYWFhYThQJyBgWThhYWFhYSwgICAgXG4vLyA4OCAgICAgICAgICAgODggICAgICAgICAgODggODggICBgOGIgIDg4ICAgICAgODggICAgICA4OFwiXCJcIlwiODgnICAgODggICAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODhcIlwiXCJcIlwiICAgICA4OFwiXCJcIlwiODgnICAgICBgXCJcIlwiXCJcIjhiLCAgXG4vLyBZOCwgICAgICAgICAgWTgsICAgICAgICAsOFAgODggICAgYDhiIDg4ICAgICAgODggICAgICA4OCAgICBgOGIgICBZOCwgICAgICAgICw4UCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICBgOGIgICAgICAgICAgIGA4YiAgXG4vLyAgWThhLiAgICAuYThQIFk4YS4gICAgLmE4UCAgODggICAgIGA4ODg4ICAgICAgODggICAgICA4OCAgICAgYDhiICAgWThhLiAgICAuYThQICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgYDhiICBZOGEgICAgIGE4UCAgXG4vLyAgIGBcIlk4ODg4WVwiJyAgIGBcIlk4ODg4WVwiJyAgIDg4ICAgICAgYDg4OCAgICAgIDg4ICAgICAgODggICAgICBgOGIgICBgXCJZODg4OFlcIicgICA4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4ODg4ODg4ODg4OCA4OCAgICAgIGA4YiAgXCJZODg4ODhQXCIgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXG5cbmFwcC5jb250cm9sbGVyKCdoZWxsb0N0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0aGVsbG9DdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdwb3J0YWxDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLFxuXHRcdCdOb3RlJyxcblx0XHQnbmV3Tm90ZScsIFxuXHRcdCdraWxsTm90ZScsXG5cdFx0J25ld0JpdCcsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckY29va2llcycsXG5cdFx0J0F1dGgnLFxuXHRcdCdMb2dpbicsXG5cdFx0J2ZpcnN0Tm90ZScsXG5cdFx0cG9ydGFsQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignbm90ZUN0cmwnLCBcblx0W1xuXHRcdCckY29udHJvbGxlcicsXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCduZXdOb3RlJywgXG5cdFx0J2tpbGxOb3RlJyxcblx0XHQnc2hhcmVOb3RlJyxcblx0XHQnbmV3Qml0Jyxcblx0XHQnJHJvdXRlUGFyYW1zJywgXG5cdFx0JyRyb3V0ZScsXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyRjb29raWVzJyxcblx0XHQnTG9nb3V0Jyxcblx0XHQnY29uY2VudHJpY2l0eScsXG5cdFx0J01ldGEnLFxuXHRcdCdoaXN0b3J5Q291bnQnLFxuXHRcdCdoaXN0b3JpY2FsJyxcblx0XHRub3RlQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignaW5mb0N0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdGluZm9DdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCd0ZXh0Q3RybCcsIFxuXHRbXG5cdFx0JyRzY29wZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsXG5cdFx0J05vdGUnLFxuXHRcdCdzaGFyZWROb3RlJywgXG5cdFx0J2hvdGtleXMnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckdGltZW91dCcsXG5cdFx0dGV4dEN0cmxcblx0XVxuKTtcblxuYXBwLmNvbnRyb2xsZXIoJ2NoYW5nZUN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsXG5cdFx0J0JvYXJkcycsXG5cdFx0J25ld0JvYXJkJyxcblx0XHQnTm90ZScsXG5cdFx0J3NoYXJlZE5vdGUnLFxuXHRcdCckcm91dGVQYXJhbXMnLCBcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyR0aW1lb3V0Jyxcblx0XHQnJGxvY2F0aW9uJyxcblx0XHQnJHdpbmRvdycsXG5cdFx0JyRjb29raWVzJyxcblx0XHRjaGFuZ2VDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdoaXN0b3J5Q3RybCcsIFxuXHRbXG5cdFx0JyRyb290U2NvcGUnLCBcblx0XHQnJHNjb3BlJyxcblx0XHQnbmV3Qm9hcmQnLFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckd2luZG93Jyxcblx0XHQnJGNvb2tpZXMnLFxuXHRcdCdIaXN0b3J5Jyxcblx0XHRoaXN0b3J5Q3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignYm9hcmRDdHJsJywgXG5cdFtcblx0XHQnJHJvb3RTY29wZScsIFxuXHRcdCckc2NvcGUnLCBcblx0XHQnQm9hcmQnLFxuXHRcdCdraWxsQm9hcmQnLFxuXHRcdCdOb3RlcycsXG5cdFx0J1NoYXJlZE5vdGVzJyxcblx0XHQnbmV3Tm90ZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckcm91dGUnLFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCckbG9jYXRpb24nLFxuXHRcdCckaW50ZXJ2YWwnLFxuXHRcdCckY29va2llcycsXG5cdFx0J0xvZ291dCcsXG5cdFx0J2NvbmNlbnRyaWNpdHknLFxuXHRcdCdoaXN0b3J5Q291bnQnLFxuXHRcdGJvYXJkQ3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignbGlzdEN0cmwnLCBcblx0W1xuXHRcdCckc2NvcGUnLCBcblx0XHQnTm90ZXMnLFxuXHRcdCdTaGFyZWROb3RlcycsXG5cdFx0J25ld05vdGUnLFxuXHRcdCdraWxsTm90ZScsXG5cdFx0J0JvYXJkcycsXG5cdFx0J25ld0JvYXJkJyxcblx0XHQnJHJvdXRlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0JyRjb29raWVzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdCdMb2dvdXQnLFxuXHRcdCdjb25jZW50cmljaXR5Jyxcblx0XHQnaGlzdG9yeUNvdW50Jyxcblx0XHRsaXN0Q3RybFxuXHRdXG4pO1xuXG5hcHAuY29udHJvbGxlcignc2hhcmVDdHJsJywgXG5cdFtcblx0XHQnJHNjb3BlJyxcblx0XHQnaG90a2V5cycsXG5cdFx0J01ldGEnLFxuXHRcdCdOb3RlJyxcblx0XHQnc2hhcmVkTm90ZScsXG5cdFx0J3NoYXJlTm90ZScsXG5cdFx0J2FkZFRvU2hhcmVkTm90ZScsXG5cdFx0JyRyb3V0ZVBhcmFtcycsIFxuXHRcdCckdGltZW91dCcsXG5cdFx0JyRsb2NhdGlvbicsXG5cdFx0c2hhcmVDdHJsXG5cdF1cbik7XG5cbmFwcC5jb250cm9sbGVyKCdjb2xvcGhvbkN0cmwnLCBcblx0W1xuXHRcdCckcm9vdFNjb3BlJywgXG5cdFx0JyRzY29wZScsIFxuXHRcdCdob3RrZXlzJyxcblx0XHQnJHRpbWVvdXQnLFxuXHRcdGNvbG9waG9uQ3RybFxuXHRdXG4pO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHRCb2FyZCxcblx0a2lsbEJvYXJkLFxuXHROb3Rlcyxcblx0U2hhcmVkTm90ZXMsXG5cdG5ld05vdGUsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRpbnRlcnZhbCxcblx0JGNvb2tpZXMsXG5cdExvZ291dCxcblx0Y29uY2VudHJpY2l0eSxcblx0aGlzdG9yeUNvdW50XG4pIHtcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnYm9hcmQnO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKVxuXG4gICAgJHNjb3BlLiR3YXRjaCgnYm9hcmQudGl0bGUnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcblx0XHRpZiAobmV3VmFsdWUpe1xuXHRcdFx0d2luZG93LmRvY3VtZW50LnRpdGxlID0gbmV3VmFsdWUgKyAnIOKAkyAoYm9hcmQpIOKAkyBMSUNLJztcblx0XHR9ZWxzZXtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdVbnRpdGxlZCBCb2FyZCDigJMgTElDSyc7XG5cdFx0fVxuXHR9KTtcblxuXHRCb2FyZCgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnYm9hcmQnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblxuXHRcdFx0d2luZG93LnVuYmluZGluZy5wdXNoKHVuYmluZGVyKVxuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5ib2FyZC5zdGFycmVkKVxuXHRcdFx0XHRcdCRzY29wZS5zdGFyTm90ZSgkc2NvcGUuYm9hcmQuc3RhcnJlZClcblx0XHRcdFx0XG5cdFx0XHRcdGlmICgkc2NvcGUuYm9hcmQudGl0bGUgPT09ICcnKVxuXHRcdFx0XHRcdCQoJy5ib2FyZF90aXRsZSB0ZXh0YXJlYScpLmZvY3VzKClcblx0XHRcdFx0XG5cdFx0XHRcdGlmICghJHNjb3BlLmJvYXJkLmxhc3RFZGl0ZWQpXG5cdFx0XHRcdFx0JHNjb3BlLmJvYXJkLmxhc3RFZGl0ZWQgPSBEYXRlLm5vdygpXG5cdFx0XHR9KVxuXHRcdH0pO1xuXG5cdE5vdGVzKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlcycpXG5cdFx0LnRoZW4oZnVuY3Rpb24odW5iaW5kZXIpe1xuXG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoJHNjb3BlLmJvYXJkLnN0YXJyZWQpXG5cdFx0XHRcdFx0JHNjb3BlLnN0YXJOb3RlKCRzY29wZS5ib2FyZC5zdGFycmVkKVxuXHRcdFx0fSlcblx0XHR9KTtcblxuXHRTaGFyZWROb3Rlcygkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnc2hhcmVkbm90ZXMnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKSB7XG5cblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdFx0c2hhcmVkR2VuZXJhdG9yKFxuXHRcdFx0XHQkc2NvcGUuc2hhcmVkbm90ZXMsIFxuXHRcdFx0XHR3aW5kb3cuZ2V0T2JqZWN0RGVlcFNpemUoJHNjb3BlLnNoYXJlZG5vdGVzKSwgXG5cdFx0XHRcdGZ1bmN0aW9uKHNoYXJlZE5vdGVzKXtcblx0XHRcdFx0XHQkc2NvcGUuc2hhcmVkRmlsdGVyID0gc2hhcmVkTm90ZXM7XG5cdFx0XHRcdH1cblx0XHRcdClcblxuXHRcdH0pO1xuXG5cdHNoYXJlZEdlbmVyYXRvciA9IGZ1bmN0aW9uKG5vdGVzLCBjb3VudCwgY2FsbGJhY2spe1xuXG5cdFx0dmFyIHNoYXJlZCA9IHt9LFxuXHRcdFx0c2hhcmVkQ291bnRlciA9IDA7XG5cblx0XHRhbmd1bGFyLmZvckVhY2gobm90ZXMsIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gJ29iamVjdCcgJiYgISFlKXtcblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKGUucGFydGljaXBhbnRzLCBmdW5jdGlvbihmLCBsKXtcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQobCA9PSB3aW5kb3cudWlkIHx8IGwgPT0gJGNvb2tpZXMuZW1haWxfZXNjYXBlZCkgXG5cdFx0XHRcdFx0XHQmJiAoZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50ID09PSAkcm91dGVQYXJhbXMuaWQpXG5cdFx0XHRcdFx0KXtcblx0XHRcdFx0XHRcdHNoYXJlZFtrXSA9IGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdHNoYXJlZENvdW50ZXIrKztcblx0XHRcdFx0aWYgKHNoYXJlZENvdW50ZXIgPT09IGNvdW50ICYmICEkLmlzRW1wdHlPYmplY3Qoc2hhcmVkKSlcblx0XHRcdFx0XHRjYWxsYmFjayhzaGFyZWQpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cbiAgICAkc2NvcGUuY29uY2VudHJpYyA9IGZ1bmN0aW9uKCl7XG4gICAgXHRjb25jZW50cmljaXR5KCk7XG4gICAgfTtcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0dvIGJhY2sgdG8gTGlzdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlbnRlcicsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRuZXdOb3RlKCRzY29wZS5ib2FyZC5pZCk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbihib2FyZElEKXtcblx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld05vdGUoYm9hcmRJRCkpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCcvYm9hcmQvJyArIG5ld0JvYXJkKCkpO1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0fTtcblxuXHQkc2NvcGUuaGlzdG9yaWNhbCA9IF8uZGVib3VuY2UoZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUuYm9hcmQubGFzdEVkaXRlZCA9IERhdGUubm93KCk7XG5cblx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdFx0fSlcblxuXHRcdGNvbnNvbGUubG9nKCdISVNUT1JJQ0FMJylcblx0fSwgNTAwMClcblxuXHQkc2NvcGUuc3Rhck5vdGUgPSBmdW5jdGlvbihpZCkge1xuXHRcdGNvbnNvbGUubG9nKGlkKVxuXG5cdFx0JCgnLmJvYXJkX25vdGUnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoYXQgPSAkKHRoaXMpXG5cblx0XHRcdGlmIChpZCAmJiBpZCA9PT0gJHRoYXQuYXR0cignZGF0YS1pZCcpKXtcblx0XHRcdFx0JHRoYXQuYWRkQ2xhc3MoJ3N0YXJyZWQnKVxuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCR0aGF0LnJlbW92ZUNsYXNzKCdzdGFycmVkJylcblx0XHRcdH1cblxuXHRcdH0pXG5cblx0XHQkc2NvcGUuYm9hcmQuc3RhcnJlZCA9IGlkO1xuXHR9XG5cblx0dmFyIGlzRW1wdHkgPSB0cnVlO1xuXG5cdGlzQm9hcmRFbXB0eSA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCQoJy5ib2FyZF9ib2R5IHVsIGxpJykubGVuZ3RoID4gMClcblx0XHRcdGlzRW1wdHkgPSBmYWxzZTtcblx0XHRlbHNlXG5cdFx0XHRpc0VtcHR5ID0gdHJ1ZTtcblxuXHRcdCRzY29wZS5ib2FyZElzRW1wdHkgPSBpc0VtcHR5O1xuXHR9O1xuXG5cdCRzY29wZS5raWxsV2FybiA9IGZhbHNlO1xuXG5cdCRzY29wZS5raWxsQm9hcmQgPSBmdW5jdGlvbihpZCl7XG5cdFx0aWYgKCRzY29wZS5ib2FyZElzRW1wdHkpe1xuXHRcdFx0a2lsbEJvYXJkKGlkKTtcblx0XHR9ZWxzZXtcblx0XHRcdCRzY29wZS5raWxsV2FybiA9IHRydWU7XG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5raWxsV2FybiA9IGZhbHNlO1xuXHRcdFx0fSwgMzAwMCk7XG5cdFx0fVxuXHR9XG5cblx0ZW1wdHlXYXRjaGVyID0gJGludGVydmFsKGlzQm9hcmRFbXB0eSwgMTAwMCk7XG5cblx0JHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihuZXh0LCBjdXJyZW50KSB7IFxuXHRcdCRpbnRlcnZhbC5jYW5jZWwoZW1wdHlXYXRjaGVyKVxuXHR9KTtcblxuXHQkc2NvcGUuYm9hcmRJdGVtT3B0c19wcml2YXRlID0ge1xuXHQgICAgc2l6ZVg6ICcxJyxcblx0ICAgIHNpemVZOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/IDIgOiAxLFxuXHQgICAgcm93OiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/ICdub3RlLnkgKiAyJyA6ICdub3RlLnknLFxuXHQgICAgY29sOiAnbm90ZS54J1xuXHR9O1xuXG5cdCRzY29wZS5ib2FyZEl0ZW1PcHRzX3NoYXJlZCA9IHtcblx0ICAgIHNpemVYOiAnMScsXG5cdCAgICBzaXplWTogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAyIDogMSxcblx0ICAgIHJvdzogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAnbm90ZS5wYXJ0aWNpcGFudHNbXCInICsgJGNvb2tpZXMuZW1haWxfZXNjYXBlZCArICdcIl0ueSAqIDInIDogJ25vdGUucGFydGljaXBhbnRzW1wiJyArICRjb29raWVzLmVtYWlsX2VzY2FwZWQgKyAnXCJdLnknLFxuXHQgICAgY29sOiAnbm90ZS5wYXJ0aWNpcGFudHNbXCInICsgJGNvb2tpZXMuZW1haWxfZXNjYXBlZCArICdcIl0ueCdcblx0fTtcblxuXHQkc2NvcGUuYm9hcmRHcmlkT3B0cyA9IHtcblx0ICAgIGNvbHVtbnM6IDUsXG5cdCAgICBtb2JpbGVNb2RlRW5hYmxlZDogZmFsc2UsXG5cdCAgICBtaW5Db2x1bW5zOiA0LFxuXHQgICAgZmxvYXRpbmc6IGZhbHNlLFxuXHQgICAgc3dhcHBpbmc6IHRydWUsXG5cdCAgICBwdXNoaW5nOiBmYWxzZSxcblx0ICAgIG1pblJvd3M6IDQsXG5cdCAgICBtYXhSb3dzOiAxMCxcblx0ICAgIGRlZmF1bHRTaXplWDogMSxcblx0ICAgIGRlZmF1bHRTaXplWTogd2luZG93LmlubmVyV2lkdGggPCA3NjggPyAyIDogMSxcblx0ICAgIG1hcmdpbnM6IFs1LCA1XSxcblx0ICAgIHJlc2l6YWJsZToge1xuXHQgICAgICAgZW5hYmxlZDogZmFsc2UsXG5cdCAgICB9LFxuXHRcdGRyYWdnYWJsZToge1xuXHRcdFx0Ly8gaGFuZGxlOiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCA/ICcuZ3JhYmJlcicgOiBudWxsXG5cdFx0XHQvLyBoYW5kbGU6ICcuZ3JhYmJlcidcblx0XHR9XG5cdH07XG5cblx0aGlzdG9yeUNvdW50KGZ1bmN0aW9uKHRoZU51bWJlcil7XG5cdFx0JHNjb3BlLmhpc3RvcnlDb3VudGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGVOdW1iZXI7XG5cdFx0fVxuXHR9KVxuXG5cdCRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5jbG9zZU1lbnUoKTtcblx0XHRMb2dvdXQoKTtcblx0fVxuXG5cdCRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS50b2dnbGVDbGFzcygnbWVudU9wZW4nKTtcdFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZU1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykucmVtb3ZlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLFxuXHRCb2FyZHMsXG5cdG5ld0JvYXJkLFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHQkcm91dGVQYXJhbXMsIFxuXHQkcm91dGUsXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCR3aW5kb3csXG5cdCRjb29raWVzXG4pIHtcblx0XHRcblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuXHQkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpXG5cblx0Qm9hcmRzKCkuJGJpbmRUbygkc2NvcGUsICdib2FyZHMnKTtcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnU2VuZCBub3RlIHRvIGJvYXJkIOKAkyBMSUNLJztcblxuXHRpZiAod2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignc2hhcmVkJykgPiAwKXtcblx0XHRjb25zb2xlLmxvZygnU0hBUkVEJylcblx0XHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0fSlcblx0fWVsc2V7XG5cdFx0Y29uc29sZS5sb2coJ1BSSVZBVEUnKVxuXHRcdE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHR9KVxuXHR9XG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2NoYW5nZSc7XG5cblx0aG90a2V5cy5iaW5kVG8oJHNjb3BlKVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdhaCwgZm9yZ2V0IGl0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5nb0JhY2soKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHQkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKXtcdFx0XG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvc2hhcmVkbm90ZS8nICsgJHJvdXRlUGFyYW1zLmlkKTtcblx0XHRlbHNlXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArICRyb3V0ZVBhcmFtcy5pZCk7XG5cdH1cblxuXHQkc2NvcGUuY2hhbmdlQm9hcmQgPSBmdW5jdGlvbihib2FyZCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQgPSBib2FyZDtcblx0XHRlbHNlXG5cdFx0XHQkc2NvcGUubm90ZS5wYXJlbnQgPSBib2FyZDtcblxuXHRcdCRzY29wZS5nb0JhY2soKTtcblx0fTtcblxuXHQkc2NvcGUubmV3Qm9hcmQgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBuZXdCb2FyZElEID0gbmV3Qm9hcmQoKVxuXG5cdFx0aWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cylcblx0XHRcdCRzY29wZS5ub3RlLnBhcnRpY2lwYW50c1skY29va2llcy5lbWFpbF9lc2NhcGVkXS5wYXJlbnQgPSBuZXdCb2FyZElEO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IG5ld0JvYXJkSUQ7XG5cblx0XHQkbG9jYXRpb24ucGF0aCgnL2JvYXJkLycgKyBuZXdCb2FyZElEKTtcblx0fVxuXG5cdCRzY29wZS5ub0JvYXJkID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXHRcdFx0JHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudCA9IGZhbHNlO1xuXHRcdGVsc2Vcblx0XHRcdCRzY29wZS5ub3RlLnBhcmVudCA9IG51bGw7XG5cblx0XHQkc2NvcGUuZ29CYWNrKCk7XG5cdH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLCBcblx0JHNjb3BlLCBcblx0aG90a2V5cyxcblx0JHRpbWVvdXRcbikge1xuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuXHQkc2NvcGUucGFnZUNsYXNzID0gJ2NvbG9waG9uJztcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnQ29sb3Bob24g4oCTIExJQ0snO1xuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnZXNjJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnR28gYmFjayB0byBMaXN0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0XHRcdH1cblx0XHR9KVxuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSxcblx0JHRpbWVvdXRcbikge1xuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KTtcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnTElDSyc7XG5cdFxuXHQkc2NvcGUucGFnZUNsYXNzID0gJ2hlbGxvJztcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFxuXHQkcm9vdFNjb3BlLFxuXHQkc2NvcGUsXG5cdG5ld0JvYXJkLFxuXHQkcm91dGUsXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCR3aW5kb3csXG5cdCRjb29raWVzLFxuXHRIaXN0b3J5XG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdoaXN0b3J5JztcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbCk7XG5cbiAgICB3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnUmVjZW50bHkgZWRpdGVkIG5vdGVzIOKAkyBMSUNLJztcblxuXHRIaXN0b3J5KCkuJGJpbmRUbygkc2NvcGUsICdoaXN0b3J5Jylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdCRzY29wZS5oaXN0b3J5U29ydGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG5vdGVzID0gW107XG5cblx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5oaXN0b3J5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRpZiAodHlwZW9mKGUpID09PSAnb2JqZWN0JyAmJiAhIWUpe1xuXHRcdFx0XHRcdFx0ZS5pZCA9IGs7XG5cdFx0XHRcdFx0XHRub3Rlcy5wdXNoKGUpO1x0XG5cdFx0XHRcdFx0fSBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIG5vdGVzO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSkgXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FoLCBmb3JnZXQgaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleWRvd24nLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLmdvQmFjaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdCRzY29wZS5lZGl0ZWRPbiA9IGZ1bmN0aW9uKHRpbWUpe1xuXHRcdHZhciBpbmNvbWluZyA9IG1vbWVudCh0aW1lKTtcblx0XHRyZXR1cm4gaW5jb21pbmcuZm9ybWF0KCdIOm0gZGRkIERvIE1NTU0nKVxuXHR9XG5cblx0aGlzdG9yeUNvdW50ID0gMDtcblxuXHQkc2NvcGUuaGlzdG9yeUNvbXBhcmUgPSBmdW5jdGlvbihkZXZpY2UsIHRpbWUpe1xuXHRcdGlmIChcblx0XHRcdChkZXZpY2UgIT09IHdpbmRvdy5kZXZpY2UpIHx8IFxuXHRcdFx0KCB0aW1lIDwgKCBEYXRlLm5vdygpIC0gMzYwMDAwMCApIClcblx0XHQpe1xuXHRcdFx0aGlzdG9yeUNvdW50Kys7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9ZWxzZSByZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQkc2NvcGUuZWRpdGVkQnkgPSBmdW5jdGlvbihhdXRob3Ipe1xuXHRcdHJldHVybiB3aW5kb3cuZW1haWxVbmVzY2FwZXIoYXV0aG9yKTtcblx0fVxuXG5cdCRzY29wZS5jbGVhckhpc3RvcnkgPSBmdW5jdGlvbigpe1xuXHRcdCRzY29wZS5tZXRhLmhpc3RvcnkgPSB7fTtcblx0fVxuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdGlmIChoaXN0b3J5Q291bnQgPT09IDApXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2xpc3QnKVxuXHRcdGVsc2Vcblx0XHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0XG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXHRcblx0JHNjb3BlLnBhZ2VDbGFzcyA9ICdpbmZvJztcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnSG93IHRvIOKAkyBMSUNLJztcblxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0dvIGJhY2sgdG8gTGlzdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0JHNjb3BlLnNsaWRlQ291bnQgPSAwO1xuXG5cdCRpbmZvID0gJCgnLmluZm8nKTtcblxuXHQkc2NvcGUuc2xpY2tDb25maWcgPSB7XG5cdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRkb3RzOiB0cnVlLFxuXHRcdGluZmluaXRlOiBmYWxzZSxcblx0XHRldmVudDoge1xuXHRcdFx0YWZ0ZXJDaGFuZ2U6IGZ1bmN0aW9uIChldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKSB7XG5cdFx0XHRcdCRpbmZvLnJlbW92ZUNsYXNzKCdmaXJzdFNsaWRlIGxhc3RTbGlkZScpXG5cdFx0XHRcdGlmIChjdXJyZW50U2xpZGUgPT09IDApe1xuXHRcdFx0XHRcdCRpbmZvLmFkZENsYXNzKCdmaXJzdFNsaWRlJylcblx0XHRcdFx0fWVsc2UgaWYgKGN1cnJlbnRTbGlkZSA9PT0gKCRzY29wZS5zbGlkZUNvdW50IC0gMSkpe1xuXHRcdFx0XHRcdCRpbmZvLmFkZENsYXNzKCdsYXN0U2xpZGUnKVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aW5pdDogZnVuY3Rpb24oc2xpY2spe1xuXHRcdFx0XHQkc2NvcGUuc2xpZGVDb3VudCA9ICQoJy5zbGljay1zbGlkZXIgLnNsaWNrLXNsaWRlJykubGVuZ3RoXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSwgXG5cdE5vdGVzLFxuXHRTaGFyZWROb3Rlcyxcblx0bmV3Tm90ZSxcblx0a2lsbE5vdGUsXG5cdEJvYXJkcyxcblx0bmV3Qm9hcmQsXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCRsb2NhdGlvbixcblx0JGNvb2tpZXMsXG5cdCR0aW1lb3V0LFxuXHRMb2dvdXQsXG5cdGNvbmNlbnRyaWNpdHksXG5cdGhpc3RvcnlDb3VudFxuKSB7XG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ2xpc3QnO1xuXG4gICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCB3aW5kb3cudW5iaW5kQWxsKTtcblxuICAgIHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdIb21lIOKAkyBMSUNLJztcblxuXHROb3RlcygpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZXMnKS50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKSB7XG5cblx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHQkc2NvcGUucHJpdmF0ZUZpbHRlciA9IGZ1bmN0aW9uKHQpe1xuXG5cdFx0XHR2YXIgbm90ZXMgPSBbXVxuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2godCwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdGlmICh0eXBlb2YoZSkgPT09ICdvYmplY3QnICYmICEhZSl7XHRcblx0XHRcdFx0XHRpZiAoIWUubGFzdEVkaXRlZCkgZS5sYXN0RWRpdGVkID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0XHRub3Rlcy5wdXNoKGUpXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gbm90ZXM7XG5cdFx0fVxuXHR9KVxuXG5cdEJvYXJkcygpLiRiaW5kVG8oJHNjb3BlLCAnYm9hcmRzJylcblx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdFx0JHNjb3BlLmJvYXJkc0ZpbHRlciA9IGZ1bmN0aW9uKHQpe1xuXHRcdFx0XHR2YXIgYm9hcmRzID0gW11cblxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLmJvYXJkcywgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gJ29iamVjdCcgJiYgISFlKXtcdFxuXHRcdFx0XHRcdFx0aWYgKCFlLmxhc3RFZGl0ZWQpIGUubGFzdEVkaXRlZCA9IERhdGUubm93KCk7XG5cdFx0XHRcdFx0XHRib2FyZHMucHVzaChlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIGJvYXJkcztcblx0XHRcdH1cblx0XHR9KTtcblxuXHRTaGFyZWROb3RlcygpLiRiaW5kVG8oJHNjb3BlLCAnc2hhcmVkbm90ZXMnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKSB7XG5cblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblxuXHRcdFx0JHNjb3BlLnNoYXJlZEZpbHRlciA9IGZ1bmN0aW9uKGUpe1xuXG5cdFx0XHRcdHZhciBzaGFyZWQgPSBbXTtcblxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gJ29iamVjdCcgJiYgISFlKXtcblx0XHRcdFx0XHRcdGlmICghZS5sYXN0RWRpdGVkKSBlLmxhc3RFZGl0ZWQgPSBEYXRlLm5vdygpO1xuXG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goZS5wYXJ0aWNpcGFudHMsIGZ1bmN0aW9uKGYsIGwpe1xuXHRcdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdFx0KGwgPT0gd2luZG93LnVpZCB8fCBsID09ICRjb29raWVzLmVtYWlsX2VzY2FwZWQpIFxuXHRcdFx0XHRcdFx0XHRcdCYmICghZS5wYXJ0aWNpcGFudHNbJGNvb2tpZXMuZW1haWxfZXNjYXBlZF0ucGFyZW50KVxuXHRcdFx0XHRcdFx0XHQpe1xuXHRcdFx0XHRcdFx0XHRcdHNoYXJlZC5wdXNoKGUpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JHNjb3BlLnNoYXJlZENvdW50ID0gc2hhcmVkLmxlbmd0aDtcblxuXHRcdFx0XHRyZXR1cm4gc2hhcmVkO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2VzYycsICd0YWInLCAncmlnaHQnLCAnbGVmdCddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5sb29raW5nQXQgPT09ICdib2FyZHMnKVxuXHRcdFx0XHRcdCRzY29wZS5sb29raW5nQXQgPSB3aW5kb3cubGlzdExvb2tpbmdBdCA9ICdub3Rlcyc7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkc2NvcGUubG9va2luZ0F0ID0gd2luZG93Lmxpc3RMb29raW5nQXQgPSAnYm9hcmRzJztcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXG4gICAgJHNjb3BlLmNvbmNlbnRyaWMgPSBmdW5jdGlvbigpe1xuICAgIFx0Y29uY2VudHJpY2l0eSgpO1xuICAgIH07XG5cblx0aWYgKHdpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aCA+IDIgJiYgd2luZG93Lmhpc3RvcmljYWxbd2luZG93Lmhpc3RvcmljYWwubGVuZ3RoIC0gMl0uaW5kZXhPZignYm9hcmQnKSA+IDApXG5cdFx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0ID0gJ2JvYXJkcyc7XG5cblx0JHNjb3BlLmxvb2tpbmdBdCA9IHdpbmRvdy5saXN0TG9va2luZ0F0O1xuXG5cdCRzY29wZS4kd2F0Y2goJ2xvb2tpbmdBdCcsIGZ1bmN0aW9uKCl7XG5cdFx0JCgnYm9keScpLnNjcm9sbFRvcCgwKVxuXHRcdHdpbmRvdy5saXN0TG9va2luZ0F0ID0gJHNjb3BlLmxvb2tpbmdBdDtcblx0fSk7XG5cblx0aGlzdG9yeUNvdW50KGZ1bmN0aW9uKHRoZU51bWJlcil7XG5cdFx0JHNjb3BlLmhpc3RvcnlDb3VudGVyID0gZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiB0aGVOdW1iZXI7XG5cdFx0fVxuXHR9KVxuXG5cdCRzY29wZS5uZXdOb3RlID0gZnVuY3Rpb24oKXtcblx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld05vdGUoKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5uZXdCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgbmV3Qm9hcmQoKSk7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHR9O1xuXG5cdCRzY29wZS5raWxsTm90ZSA9IGZ1bmN0aW9uKGlkKXtcblx0XHRraWxsTm90ZShpZCk7XG5cdH1cblxuXHQkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcblx0XHRMb2dvdXQoKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH1cblxuXHQkc2NvcGUub3Blbk1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykudG9nZ2xlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VNZW51ID0gZnVuY3Rpb24oKXtcblx0XHQkKCcjbWFpbicpLnJlbW92ZUNsYXNzKCdtZW51T3BlbicpO1x0XG5cdH07XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JGNvbnRyb2xsZXIsXG5cdCRyb290U2NvcGUsIFxuXHQkc2NvcGUsIFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHRuZXdOb3RlLFxuXHRraWxsTm90ZSxcblx0c2hhcmVOb3RlLFxuXHRuZXdCaXQsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRjb29raWVzLFxuXHRMb2dvdXQsXG5cdGNvbmNlbnRyaWNpdHksXG5cdE1ldGEsXG5cdGhpc3RvcnlDb3VudCxcblx0aGlzdG9yaWNhbFxuKSB7XG5cblx0JHNjb3BlLnRvdWNoeSA9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIHdpbmRvdy5pc190b3VjaF9kZXZpY2UoKTtcblx0fVxuXG5cdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdH0pXG5cdFxuXHR2YXIgc2hvd2luZ0NoZWF0c2hlZXQgPSBmYWxzZTtcblx0XG5cdCRzY29wZS5jb21tYW5kSXNQcmVzc2VkID0gZmFsc2U7XG5cdCRzY29wZS5hbHRJc1ByZXNzZWQgPSBmYWxzZTtcblx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IGZhbHNlO1xuICAgICRzY29wZS5zaGFyZVByb21wdCA9IGZhbHNlO1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAnbm90ZSc7XG5cbiAgICAkc2NvcGUuZmlsdGVyZWQgPSBmYWxzZTtcblxuICAgICRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbCk7XG5cbiAgICAkc2NvcGUuJHdhdGNoKCdub3RlLnRpdGxlJywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKSB7XG5cdFx0aWYgKG5ld1ZhbHVlKXtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9IG5ld1ZhbHVlICsgJyDigJMgKG5vdGUpIOKAkyBMSUNLJztcblx0XHR9ZWxzZXtcblx0XHRcdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdVbnRpdGxlZCBOb3RlIOKAkyBMSUNLJztcblx0XHR9XG5cdH0pO1xuXG4gICAgdmFyIGtleXNVcCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHQkc2NvcGUuYWx0SXNQcmVzc2VkID0gZmFsc2U7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcbiAgICB9XG5cbiAgICAkKHdpbmRvdykub24oe1xuICAgIFx0Ymx1cjoga2V5c1VwLFxuICAgIFx0Zm9jdXM6IGtleXNVcFxuICAgIH0pO1xuXG4gICAgJHNjb3BlLmNvbmNlbnRyaWMgPSBmdW5jdGlvbigpe1xuICAgIFx0Y29uY2VudHJpY2l0eSgpO1xuICAgIH07XG5cbiAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKS5pbmRleE9mKCdzaGFyZWQnKSA+IDApe1xuXG4gICAgXHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKSB7XG5cdFx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHRcdFx0JHNjb3BlLm9uTm90ZU9wZW4oKTtcblx0XHRcdH0pO1xuXG4gICAgfWVsc2V7XG5cdFx0Tm90ZSgkcm91dGVQYXJhbXMuaWQpLiRiaW5kVG8oJHNjb3BlLCAnbm90ZScpXG5cdFx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcikge1xuXHRcdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cblx0XHRcdFx0aWYgKHR5cGVvZigkc2NvcGUubm90ZS5ib2R5KSA9PT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdG5ld05vdGUoJycsICRyb3V0ZVBhcmFtcy5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JHNjb3BlLm9uTm90ZU9wZW4oKTtcblx0XHRcdH0pO1xuICAgIH1cblxuICAgICRzY29wZS5vbk5vdGVPcGVuID0gZnVuY3Rpb24oKXtcbiAgICBcdCRzY29wZS5jbG9zZUJpdE1lbnVzKCk7XG4gICAgXHQkc2NvcGUudW5zZWxlY3RvcigpO1xuICAgIFx0JHNjb3BlLm5vdGUua2lsbCA9IGZhbHNlO1xuXG4gICAgXHRpZiAoJHNjb3BlLm5vdGUudGl0bGUgPT09ICcnKVxuICAgIFx0XHQkKCcubm90ZV90aXRsZSB0ZXh0YXJlYScpLmZvY3VzKClcbiAgICB9XG5cbiAgICBNZXRhKCkuJGJpbmRUbygkc2NvcGUsICdtZXRhJylcbiAgICBcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcbiAgICBcdH0pXG5cbiAgICAkc2NvcGUuc2hhcmVBY3RpdmUgPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCRsb2NhdGlvbi5wYXRoKCkuaW5kZXhPZignc2hhcmVkJykgPiAwKVxuICAgIFx0XHRyZXR1cm4gdHJ1ZVxuICAgIFx0ZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cblxuXHQvLyBjb25zb2xlLmxvZygkc2NvcGUudXBsb2FkZXIpXG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXHQvLyBcdDg4ICAgICAgICA4OCAgICxhZDg4ODhiYSwgODg4ODg4ODg4ODg4IDg4ICAgICAgYThQICA4ODg4ODg4ODg4OCA4YiAgICAgICAgZDggYWQ4ODg4OGJhICAgXG5cdC8vIFx0ODggICAgICAgIDg4ICBkOFwiJyAgICBgXCI4YiAgICAgODggICAgICA4OCAgICAsODgnICAgODggICAgICAgICAgIFk4LCAgICAsOFAgZDhcIiAgICAgXCI4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4IGQ4JyAgICAgICAgYDhiICAgIDg4ICAgICAgODggICw4OFwiICAgICA4OCAgICAgICAgICAgIFk4LCAgLDhQICBZOCwgICAgICAgICAgXG5cdC8vIFx0ODhhYWFhYWFhYTg4IDg4ICAgICAgICAgIDg4ICAgIDg4ICAgICAgODgsZDg4JyAgICAgIDg4YWFhYWEgICAgICAgIFwiOGFhOFwiICAgYFk4YWFhYWEsICAgIFxuXHQvLyBcdDg4XCJcIlwiXCJcIlwiXCJcIjg4IDg4ICAgICAgICAgIDg4ICAgIDg4ICAgICAgODg4OFwiODgsICAgICA4OFwiXCJcIlwiXCIgICAgICAgICBgODgnICAgICAgYFwiXCJcIlwiXCI4YiwgIFxuXHQvLyBcdDg4ICAgICAgICA4OCBZOCwgICAgICAgICw4UCAgICA4OCAgICAgIDg4UCAgIFk4YiAgICA4OCAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgIGA4YiAgXG5cdC8vIFx0ODggICAgICAgIDg4ICBZOGEuICAgIC5hOFAgICAgIDg4ICAgICAgODggICAgIFwiODgsICA4OCAgICAgICAgICAgICAgIDg4ICAgICBZOGEgICAgIGE4UCAgXG5cdC8vIFx0ODggICAgICAgIDg4ICAgYFwiWTg4ODhZXCInICAgICAgODggICAgICA4OCAgICAgICBZOGIgODg4ODg4ODg4ODggICAgICA4OCAgICAgIFwiWTg4ODg4UFwiICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnPycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHt9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiAnYWx0Jyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnSG9sZCBkb3duIHRvIGVkaXQgcGFzdGVkIGxpbmtzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRhY3Rpb246ICdrZXlkb3duJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdBTFRfRE9XTicpXG5cdFx0XHRcdCRzY29wZS5hbHRJc1ByZXNzZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2FsdCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5dXAnLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0FMVF9VUCcpXG5cdFx0XHRcdCRzY29wZS5hbHRJc1ByZXNzZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCcsICdjdHJsJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0hvbGQgZG93biB0byBzZWxlY3QgYml0cycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0YWN0aW9uOiAna2V5ZG93bicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuY29tbWFuZElzUHJlc3NlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQnLCAnY3RybCddLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGFjdGlvbjogJ2tleXVwJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5jb21tYW5kSXNQcmVzc2VkID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2VudGVyJywgJ3NoaWZ0K2VudGVyJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FkZCBuZXcgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXG5cdFx0XHRcdFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0aWYgKF9pc0JpdCgpKXtcblx0XHRcdFx0XHRcdGlmICgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5jb250ZW50ICE9PSAnJyl7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5hZGRCaXQoIF9iaXRJbmRleCgpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChfYml0SW5kZXgoKSAhPT0gMCl7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcCA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdF9mb2N1c01lKDApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK2VudGVyJywgJ2N0cmwrZW50ZXInXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnYWRkIGEgbGl0dGxlIHNwYWNlIGFib3ZlIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgYml0Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkgJiYgX2lzQml0KCkpe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcCA9ICEkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXA7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2JhY2tzcGFjZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0aWYgKCBcblx0XHRcdFx0XHRfaXNUZXh0YXJlYSgpICYmIFxuXHRcdFx0XHRcdCgkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5jb250ZW50ID09PSAnJylcblx0XHRcdFx0KXtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0udGFiQ291bnQgPiAwKXtcblx0XHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnRhYkNvdW50LS07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLmdhcCl7XG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5nYXAgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZXtcblx0XHRcdFx0XHRcdCRzY29wZS5raWxsQml0KCBfYml0SW5kZXgoKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrYmFja3NwYWNlJywgJ2N0cmwrYmFja3NwYWNlJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBEZWxldGUgdGhpcyBiaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSApe1xuXHRcdFx0XHRcdCRzY29wZS5raWxsQml0KCBfYml0SW5kZXgoKSApO1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtzaGlmdCtiYWNrc3BhY2UnLCAnY3RybCtzaGlmdCtiYWNrc3BhY2UnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnRGVsZXRlIHRoaXMgbm90ZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLm5vdGUua2lsbCAmJiAkc2NvcGUua2lsbE5vdGUoKTsgXG5cdFx0XHRcdCRzY29wZS5ub3RlLmtpbGwgPSAhJHNjb3BlLm5vdGUua2lsbDtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsndGFiJywgJ2NvbW1hbmQrXScsICdjdHJsK10nXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIEluZGVudCcsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSAmJiBfaXNCaXQoKSApe1xuXHRcdFx0XHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS50YWJJbihrKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdCRzY29wZS50YWJJbihfYml0SW5kZXgoKSk7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1lbHNlIGlmICggX2lzVGV4dGFyZWEoKSApXG5cdFx0XHRcdFx0X2ZvY3VzTWUoMCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ3NoaWZ0K3RhYicsICdjb21tYW5kK1snLCAnY3RybCtbJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBPdXRkZW50Jyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0aWYgKCBfaXNUZXh0YXJlYSgpICYmIF9pc0JpdCgpICl7XG5cdFx0XHRcdFx0aWYgKCRzY29wZS5zZWxlY3RlZEJpdHMpe1xuXHRcdFx0XHRcdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0XHRcdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLnRhYk91dChrKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdCRzY29wZS50YWJPdXQoX2JpdEluZGV4KCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrc2hpZnQrZCcsICdjdHJsK3NoaWZ0K2QnXSxcblx0XHRcdC8vIGRlc2NyaXB0aW9uOiAnRHVwbGljYXRlIGN1cnJlbnRseSBzZWxlY3RlZCBiaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0aWYgKF9pc0JpdCgpKXtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHQkc2NvcGUuYWRkQml0KCBfYml0SW5kZXgoKSwgJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0uY29udGVudCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWyd1cCcsICdkb3duJ10sXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXZlbnQsIGV2ZW50LmtleUNvZGUpXG5cdFx0XHRcdFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcblx0XHRcdFx0XHQkc2NvcGUuY2FyZXRUcmFja2VyKF9iaXRJbmRleCgpLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0JHNjb3BlLmp1bXBBcm91bmQoX2JpdEluZGV4KCksIGV2ZW50LmtleUNvZGUsIGZhbHNlKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcdFx0XG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ3NoaWZ0K3VwJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCkgLSAxXS5zZWxlY3RlZCA9IHRydWU7XG5cdFx0XHRcdF9mb2N1c01lKF9iaXRJbmRleCgpIC0gMSk7XG5cdFx0XHRcdCRzY29wZS5zZWxlY3RlZEJpdHMgPSB0cnVlO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ3NoaWZ0K2Rvd24nLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKSArIDFdLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0X2ZvY3VzTWUoX2JpdEluZGV4KCkgKyAxKTtcblx0XHRcdFx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IHRydWU7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2N0cmwrdXAnLCAnY3RybCtkb3duJ10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1F1aWNrbHkganVtcCBiZXR3ZWVuIGJpdHMnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRpZiAoIF9pc1RleHRhcmVhKCkpe1xuXHRcdFx0XHRcdCRzY29wZS5qdW1wQXJvdW5kKF9iaXRJbmRleCgpLCBldmVudC5rZXlDb2RlLCB0cnVlKTtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2N0cmwrY29tbWFuZCt1cCcsICdjdHJsK2FsdCt1cCddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcod2hpbGUgZm9jdXNlZCkgU3dhcCBiaXQgdXAnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHQkc2NvcGUubW92ZVVwKF9iaXRJbmRleCgpKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY3RybCtjb21tYW5kK2Rvd24nLCAnY3RybCthbHQrdXAnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnKHdoaWxlIGZvY3VzZWQpIFN3YXAgYml0IGRvd24nLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHQkc2NvcGUubW92ZURvd24oX2JpdEluZGV4KCkpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydzaGlmdCArICddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdOZXcgbm90ZScsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbm90ZS8nICsgbmV3Tm90ZSgpKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86IFsnY29tbWFuZCtzaGlmdCthJywgJ2N0cmwrc2hpZnQrYSddLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdTZWxlY3QgYWxsIGJpdHMnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2tdLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gdHJ1ZTtcblx0XHRcdFx0fSlcblx0XHRcdFx0Ly8gaWYgKCAhX2lzVGV4dFNlbGVjdGVkKCQoZXZlbnQudGFyZ2V0KVswXSkgKXtcblx0XHRcdFx0Ly8gfVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK3gnLCAnY3RybCt4J10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0N1dCBzZWxlY3RlZCBiaXRzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoICFfaXNUZXh0U2VsZWN0ZWQoJChldmVudC50YXJnZXQpWzBdKSApe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHQkc2NvcGUuY3V0KHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuYWRkKHtcblx0XHRcdGNvbWJvOiBbJ2NvbW1hbmQrYycsICdjdHJsK2MnXSxcblx0XHRcdGRlc2NyaXB0aW9uOiAnQ29weSBzZWxlY3RlZCBiaXRzJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHRpZiAoICFfaXNUZXh0U2VsZWN0ZWQoJChldmVudC50YXJnZXQpWzBdKSApe1xuXHRcdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbX2JpdEluZGV4KCldLnNlbGVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHQkc2NvcGUuY3V0KGZhbHNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjb21tYW5kK3YnLCAnY3RybCt2J10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1Bhc3RlIGN1dCBiaXRzIChvciBqdXN0IHBhc3RlIHRoZSBjb250ZW50cyBvZiB5b3VyIGNsaXBib2FyZCknLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHdpbmRvdy5jbGlwYm9hcmRlZClcblx0XHRcdFx0aWYgKHdpbmRvdy5jbGlwYm9hcmRlZCl7XG5cdFx0XHRcdFx0JHNjb3BlLnBhc3RlKCk7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JHNjb3BlLnBhcnNlUGFzdGVkKF9iaXRJbmRleCgpKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdzaGlmdCBzaGlmdCcsXG5cdFx0XHRkZXNjcmlwdGlvbjogJyh3aGlsZSBmb2N1c2VkKSBUb2dnbGUgdGhpcyBiaXQgYXMgbWFya2VkJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICggX2lzVGV4dGFyZWEoKSl7XG5cdFx0XHRcdFx0Ly8gJHNjb3BlLnVuc2VsZWN0b3IoKTtcblx0XHRcdFx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cdFx0XHRcdFx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUuYm9keSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdFx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUubWFyayhrKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdCRzY29wZS5tYXJrKF9iaXRJbmRleCgpKVxuXHRcdFx0XHRcdFx0Ly8gJHNjb3BlLm5vdGUuYm9keVtfYml0SW5kZXgoKV0ubWFyayA9ICEkc2NvcGUubm90ZS5ib2R5W19iaXRJbmRleCgpXS5tYXJrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogWydjdHJsK3NoaWZ0IGN0cmwrc2hpZnQnLCAnY29tbWFuZCtzaGlmdCBjb21tYW5kK3NoaWZ0J10sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ1RvZ2dsZSB0aGlzIG5vdGUgYXMgbWFya2VkJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzY29wZS5ub3RlLm1hcmsgPSAhJHNjb3BlLm5vdGUubWFyaztcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlc2MnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdDbG9zZSBub3RlJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblx0XHRcdFx0XHQkc2NvcGUudW5zZWxlY3RvcigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHNob3dpbmdDaGVhdHNoZWV0KXtcblx0XHRcdFx0XHRzaG93aW5nQ2hlYXRzaGVldCA9IGZhbHNlO1xuXHRcdFx0XHRcdGhvdGtleXMudG9nZ2xlQ2hlYXRTaGVldCgpO1xuXHRcdFx0XHQvLyB9ZWxzZSBpZiAoJHNjb3BlLnNoYXJlUHJvbXB0KXtcblx0XHRcdFx0Ly8gXHQkc2NvcGUuc2hhcmVQcm9tcHQgPSBmYWxzZTtcdFx0XHRcdFx0XG5cdFx0XHRcdH1lbHNlXG5cdFx0XHRcdFx0JHNjb3BlLmNsb3NlTm90ZSgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2FsdCtzaGlmdCsvJyxcblx0XHRcdGRlc2NyaXB0aW9uOiAnU2hvdyB0aGlzIGhhbmR5IGd1aWRlIDopJyxcblx0XHRcdGFsbG93SW46IFsnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJ10sXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0c2hvd2luZ0NoZWF0c2hlZXQgPSAhc2hvd2luZ0NoZWF0c2hlZXQ7XG5cdFx0XHRcdGhvdGtleXMudG9nZ2xlQ2hlYXRTaGVldCgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ODg4ODg4ODg4ODggODggICAgICAgIDg4IDg4OGIgICAgICA4OCAgICxhZDg4ODhiYSwgODg4ODg4ODg4ODg4IDg4ICAgLGFkODg4OGJhLCAgIDg4OGIgICAgICA4OCAgXG5cdC8vIFx0ODggICAgICAgICAgODggICAgICAgIDg4IDg4ODhiICAgICA4OCAgZDhcIicgICAgYFwiOGIgICAgIDg4ICAgICAgODggIGQ4XCInICAgIGBcIjhiICA4ODg4YiAgICAgODggIFxuXHQvLyBcdDg4ICAgICAgICAgIDg4ICAgICAgICA4OCA4OCBgOGIgICAgODggZDgnICAgICAgICAgICAgICAgODggICAgICA4OCBkOCcgICAgICAgIGA4YiA4OCBgOGIgICAgODggIFxuXHQvLyBcdDg4YWFhYWEgICAgIDg4ICAgICAgICA4OCA4OCAgYDhiICAgODggODggICAgICAgICAgICAgICAgODggICAgICA4OCA4OCAgICAgICAgICA4OCA4OCAgYDhiICAgODggIFxuXHQvLyBcdDg4XCJcIlwiXCJcIiAgICAgODggICAgICAgIDg4IDg4ICAgYDhiICA4OCA4OCAgICAgICAgICAgICAgICA4OCAgICAgIDg4IDg4ICAgICAgICAgIDg4IDg4ICAgYDhiICA4OCAgXG5cdC8vIFx0ODggICAgICAgICAgODggICAgICAgIDg4IDg4ICAgIGA4YiA4OCBZOCwgICAgICAgICAgICAgICA4OCAgICAgIDg4IFk4LCAgICAgICAgLDhQIDg4ICAgIGA4YiA4OCAgXG5cdC8vIFx0ODggICAgICAgICAgWThhLiAgICAuYThQIDg4ICAgICBgODg4OCAgWThhLiAgICAuYThQICAgICA4OCAgICAgIDg4ICBZOGEuICAgIC5hOFAgIDg4ICAgICBgODg4OCAgXG5cdC8vIFx0ODggICAgICAgICAgIGBcIlk4ODg4WVwiJyAgODggICAgICBgODg4ICAgYFwiWTg4ODhZXCInICAgICAgODggICAgICA4OCAgIGBcIlk4ODg4WVwiJyAgIDg4ICAgICAgYDg4OCAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0JHNjb3BlLmFkZEJpdCA9IGZ1bmN0aW9uKGluZGV4LCBjb250ZW50KXtcblx0XHR2YXIgaW5jb21pbmdDb250ZW50O1xuXG5cdFx0aWYgKHR5cGVvZihjb250ZW50KSA9PT0gJ3VuZGVmaW5lZCcpXG5cdFx0XHRpbmNvbWluZ0NvbnRlbnQgPSAnJztcblx0XHRlbHNlXG5cdFx0XHRpbmNvbWluZ0NvbnRlbnQgPSBjb250ZW50O1xuXG5cdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4ICsgMSwgMCwgbmV3Qml0KFxuXHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudCxcblx0XHRcdFx0aW5jb21pbmdDb250ZW50XG5cdFx0XHQpKTtcblxuXHRcdFx0JHNjb3BlLnBhcnNlTGluayhpbmRleCk7XG5cblx0XHRcdF9mb2N1c01lKGluZGV4ICsgMSk7XG5cdFx0fSwgNTApO1xuXHR9O1xuXG5cdCRzY29wZS5wYXJzZVBhc3RlZCA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0Ly8gc3BsaXQgYXQgbGluZSBicmVha3Ncblx0XHRcdHZhciB0aGVDb250ZW50ID0gJHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudC5zcGxpdCgnXFxuJyksXG5cdFx0XHRcdHRvUmVtb3ZlID0gW107XG5cblx0XHRcdC8vIHJlbW92ZSBlbXB0eSBsaW5lc1xuXHRcdFx0Zm9yICh2YXIgbCA9IDA7IGwgPCB0aGVDb250ZW50Lmxlbmd0aDsgbCsrKXtcblx0XHRcdFx0aWYgKCF0aGVDb250ZW50W2xdKVxuXHRcdFx0XHRcdHRvUmVtb3ZlLnB1c2gobClcblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIgciA9IHRvUmVtb3ZlLmxlbmd0aCAtIDE7IHIgPj0gMCA7IHItLSl7XG5cdFx0XHRcdHRoZUNvbnRlbnQuc3BsaWNlKHRvUmVtb3ZlW3JdLCAxKVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBzZXQgYmxvY2sgdG8gZW1wdHkgYmVmb3JlIHJlcGxhY2luZyB3LyAxc3QgbGluZVxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudCA9ICcnO1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudCA9IHRoZUNvbnRlbnRbMF07XG5cblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9ICcnO1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uY29udGVudENhcmV0ID0gdGhlQ29udGVudFswXTtcblxuXHRcdFx0JHNjb3BlLnBhcnNlTGluayhpbmRleCk7XG5cblx0XHRcdGZvciAodmFyIGwgPSAxOyBsIDwgdGhlQ29udGVudC5sZW5ndGg7IGwrKyl7XG5cdFx0XHRcdCRzY29wZS5hZGRCaXQoaW5kZXggKyAobCAtIDEpLCB0aGVDb250ZW50W2xdKTtcblx0XHRcdH1cblx0XHR9LCA1MCk7IFxuXHR9XG5cblx0JHNjb3BlLnBhcnNlTGluayA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHR2YXIgY29udGVudCA9ICRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQ7XG5cblx0XHRpZiAoXG5cdFx0XHRjb250ZW50LmluZGV4T2YoXCJodHRwOi8vXCIpID09PSAwIHx8XG5cdFx0XHRjb250ZW50LmluZGV4T2YoXCJodHRwczovL1wiKSA9PT0gMCBcblx0XHQpe1x0XHRcdFxuXHRcdFx0Y29uc29sZS5sb2coJ09IIE5PRVMgQSBMSU5LJylcblxuXHRcdFx0JC5hamF4KHtcblx0XHRcdFx0dHlwZTogXCJHRVRcIixcblx0XHRcdFx0ZGF0YVR5cGU6J0pTT05QJyxcblx0XHRcdFx0ZGF0YTp7XG5cdFx0XHRcdFx0VVJMOiBjb250ZW50XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHVybDogXCJodHRwOi8vcmUuamVjdC5jaC90cmEvcGhwL3RpdGxlLnBocFwiXG5cdFx0XHR9KS5kb25lKCBmdW5jdGlvbih0aGVUaXRsZSl7XG5cdFx0XHRcdHZhciBlc2NhcGVkVGl0bGUgPSBfLnVuZXNjYXBlKHRoZVRpdGxlLnRpdGxlKTtcblx0XHRcdFx0Y29uc29sZS5sb2coZXNjYXBlZFRpdGxlKVxuXG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnQgPSBlc2NhcGVkVGl0bGU7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IGVzY2FwZWRUaXRsZTtcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0uYWRkcmVzcyA9IGNvbnRlbnQ7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmlzTGluayA9IHRydWU7XG5cblx0XHRcdFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUub3BlbkxpbmsgPSBmdW5jdGlvbihiaXQsIGV2ZW50KXtcblx0XHRpZiAoYml0LmlzTGluayAmJiAhJHNjb3BlLmFsdElzUHJlc3NlZCl7XG5cdFx0XHR2YXIgd2luO1xuXHRcdFx0ZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cblx0XHRcdGlmICh3aW5kb3cuaXNNb2JpbGVBcHApe1xuXHRcdFx0XHR3aW4gPSBjb3Jkb3ZhLkluQXBwQnJvd3Nlci5vcGVuKGJpdC5hZGRyZXNzLCAnX3N5c3RlbScpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHdpbiA9IHdpbmRvdy5vcGVuKGJpdC5hZGRyZXNzLCAnX2JsYW5rJyk7XG5cdFx0XHRcdHdpbi5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5raWxsQml0ID0gZnVuY3Rpb24oaW5kZXgpe1xuXG5cdFx0Y29uc29sZS5sb2coaW5kZXgpXG5cblx0XHRpZiAoaW5kZXgpXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5zZWxlY3RlZCA9IHRydWU7XG5cblx0XHR2YXIgdGVtcEJvZHkgPSBbXTtcblx0XHRhbmd1bGFyLmNvcHkoJHNjb3BlLm5vdGUuYm9keSwgdGVtcEJvZHkpO1xuXG5cdFx0YW5ndWxhci5mb3JFYWNoKHRlbXBCb2R5LnJldmVyc2UoKSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRpZiAoZS5zZWxlY3RlZCl7XG5cdFx0XHRcdHZhciByZXZlcnNlVGFyZ2V0ID0gTWF0aC5hYnModGVtcEJvZHkubGVuZ3RoIC0gaykgLSAxO1xuXG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UocmV2ZXJzZVRhcmdldCwgMSk7XG5cdFx0XHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoJHNjb3BlLm5vdGUuYm9keS5sZW5ndGggPiAwKXtcblx0XHRcdF9mb2N1c01lKGluZGV4IC0gMSlcblx0XHR9ZWxzZXtcblx0XHRcdGFkZEJpdCgwKTtcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLm1vdmVVcCA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRpZiAoJHNjb3BlLnNlbGVjdGVkQml0cyl7XG5cblx0XHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGssIDEpWzBdO1xuXHRcdFx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoayAtIDEsIDAsIHRoaXNCaXQpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHRoaXNCaXQgPSAkc2NvcGUubm90ZS5ib2R5LnNwbGljZShfYml0SW5kZXgoKSwgMSlbMF07XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShpbmRleCAtIDEsIDAsIHRoaXNCaXQpO1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggLSAxKTtcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLm1vdmVEb3duID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdGlmICgkc2NvcGUuc2VsZWN0ZWRCaXRzKXtcblx0XHRcdHZhciBib2R5Q29weSA9IGFuZ3VsYXIuY29weSgkc2NvcGUubm90ZS5ib2R5KTtcblxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGJvZHlDb3B5LnJldmVyc2UoKSwgZnVuY3Rpb24oZSwgayl7XG5cdFx0XHRcdGlmIChlLnNlbGVjdGVkKXtcblxuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHR2YXIgcmV2ZXJzZVRhcmdldCA9IE1hdGguYWJzKGJvZHlDb3B5Lmxlbmd0aCAtIGspIC0gMTtcblx0XHRcdFx0XHRcdHZhciB0aGlzQml0ID0gJHNjb3BlLm5vdGUuYm9keS5zcGxpY2UocmV2ZXJzZVRhcmdldCwgMSlbMF07XG5cdFx0XHRcdFx0XHQkc2NvcGUubm90ZS5ib2R5LnNwbGljZShyZXZlcnNlVGFyZ2V0ICsgMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fWVsc2V7XG5cdFx0XHR2YXIgdGhpc0JpdCA9ICRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKF9iaXRJbmRleCgpLCAxKVswXTtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHkuc3BsaWNlKGluZGV4ICsgMSwgMCwgdGhpc0JpdCk7XG5cdFx0XHRfZm9jdXNNZShpbmRleCArIDEpO1xuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUudGFiT3V0ID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdGlmICgkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudCA+IDApe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0udGFiQ291bnQtLTtcblx0XHR9ZWxzZXtcblx0XHRcdF9mb2N1c01lKGluZGV4IC0gMSk7XG5cdFx0fVxuXG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgNzY4KVxuXHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuID0gZmFsc2U7XG5cdH1cblxuXHQkc2NvcGUudGFiSW4gPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnRhYkNvdW50IDwgNCl7XG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS50YWJDb3VudCsrO1xuXHRcdH1lbHNle1xuXHRcdFx0X2ZvY3VzTWUoaW5kZXggKyAxKTtcblx0XHR9XG5cblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCA3NjgpXG5cdFx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4gPSBmYWxzZTtcblx0fVxuXG5cdCRzY29wZS5jYXJldFRyYWNrZXIgPSBmdW5jdGlvbihpbmRleCwgY2FsbGJhY2spe1xuXHRcdHZhciB0aGVCaXQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50LFxuXHRcdFx0Y3VycmVudENhcmV0ID0gdGhlQml0LnNlbGVjdGlvblN0YXJ0LFxuXHRcdFx0dGhlVmFsdWUgPSB0aGVCaXQudmFsdWU7XG5cblx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5jb250ZW50Q2FyZXQgPSBcblx0XHRcdHRoZVZhbHVlLnN1YnN0cmluZygwLCBjdXJyZW50Q2FyZXQpICsgXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJoaWRkZW5DYXJldFwiPjwvc3Bhbj4nICsgXG5cdFx0XHR0aGVWYWx1ZS5zdWJzdHJpbmcoY3VycmVudENhcmV0LCB0aGVWYWx1ZS5sZW5ndGgpXG5cblx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAndW5kZWZpbmVkJykgY2FsbGJhY2soKTtcblx0XHR9KVxuXHR9XG5cblx0JHNjb3BlLmF1dG9TaXplciA9IGZ1bmN0aW9uKGluZGV4LCBldmVudCwgY29udGVudCl7XG5cdFx0aWYgKGV2ZW50LmtleUNvZGUgIT09IDEzKXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLmNvbnRlbnRDYXJldCA9IGNvbnRlbnQ7XG5cdFx0fVxuXHR9XG5cblx0JHNjb3BlLmRlYm91bmNlSGlzdG9yaWNhbCA9IF8uZGVib3VuY2UoZnVuY3Rpb24oKXtcblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcblxuXHRcdGlmICghJHNjb3BlLm1ldGEuaGlzdG9yeSlcblx0XHRcdCRzY29wZS5tZXRhLmhpc3RvcnkgPSB7fTtcblxuXHRcdCRzY29wZS5ub3RlLmxhc3RFZGl0ZWQgPSBub3c7XG5cblx0XHRoaXN0b3JpY2FsKFxuXHRcdFx0bm93LCBcblx0XHRcdCRzY29wZS5ub3RlLCBcblx0XHRcdCRzY29wZS5zaGFyZUFjdGl2ZSgpLCBcblx0XHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0KTtcblx0fSwgNTAwMClcblxuXHQkc2NvcGUuaGlzdG9yaWNhbF90cmlnZ2VyID0gJHNjb3BlLmRlYm91bmNlSGlzdG9yaWNhbDtcblxuXG5cdCRzY29wZS5qdW1wQXJvdW5kID0gZnVuY3Rpb24oaW5kZXgsIGtleSwganVzdGdvKXtcblxuXHRcdC8vIGNvbnNvbGUubG9nKGluZGV4LCBrZXksIGp1c3Rnbylcblx0XHQvLyBjb25zb2xlLmxvZyhpbmRleCwga2V5LCBqdXN0Z28pXG5cdFx0dmFyICR0aGVCaXQgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLFxuXHRcdFx0JHRoZUNhcmV0ID0gJHRoZUJpdC5zaWJsaW5ncygnLnRleHRhcmVhLWF1dG9zaXplJykuZmluZCgnLmhpZGRlbkNhcmV0JyksXG5cdFx0XHR0aGVDYXJldFBvcyA9ICR0aGVDYXJldC5wb3NpdGlvbigpLnRvcCxcblx0XHRcdHRoZUNhcmV0SGVpZ2h0ID0gMjM7XG5cblx0XHQvLyBjb25zb2xlLmxvZyh0aGVDYXJldFBvcywgdGhlQ2FyZXRIZWlnaHQsIHRoZUNhcmV0UG9zIDwgdGhlQ2FyZXRIZWlnaHQgLSAxKVxuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0ICAgJ0NBUkVUUE9TICsgNCcsIHRoZUNhcmV0UG9zICsgNCxcblx0XHRcdCcvLyBDQVJFVEhFSUdIVCcsIHRoZUNhcmV0SGVpZ2h0LFxuXHRcdFx0Jy8vIE9VVEVSSEVJR0hUJywgJHRoZUNhcmV0LnBhcmVudCgpLm91dGVySGVpZ2h0KHRydWUpLFxuXHRcdFx0Jy8vIENBUkVUSEVJR0hUIC0gT1VURVJIRUlHSFQnLCAoJHRoZUNhcmV0LnBhcmVudCgpLm91dGVySGVpZ2h0KHRydWUpIC0gKHRoZUNhcmV0SGVpZ2h0KSksXG5cdFx0XHQnLy8gQ0FSRVRQT1MgPj0gQ0FSRVRIRUlHSFQgLSBPVVRFUkhFSUdIVCcsIHRoZUNhcmV0UG9zICsgNCA+PSAoJHRoZUNhcmV0LnBhcmVudCgpLm91dGVySGVpZ2h0KHRydWUpIC0gKHRoZUNhcmV0SGVpZ2h0KSlcblx0XHQpO1xuXG5cdFx0aWYgKCBcblx0XHRcdChcblx0XHRcdFx0KGtleSA9PT0gMzgpICYmIFxuXHRcdFx0XHQodGhlQ2FyZXRQb3MgPCB0aGVDYXJldEhlaWdodCAtIDEpIFxuXHRcdFx0KXx8KFxuXHRcdFx0XHQoa2V5ID09PSAzOCkgJiYgXG5cdFx0XHRcdGp1c3Rnb1xuXHRcdFx0KVxuXHRcdCl7XG5cdFx0XHRjb25zb2xlLmxvZygnVVAnKVxuXHRcdFx0JHRoZUJpdC5wYXJlbnRzKCcubm90ZV9iaXQnKVxuXHRcdFx0XHQucHJldignLm5vdGVfYml0JykuZmluZCgndGV4dGFyZWEnKVxuXHRcdFx0XHQuZm9jdXMoKVxuXHRcdH1cblxuXHRcdGlmIChcblx0XHRcdChcblx0XHRcdFx0KGtleSA9PT0gNDApICYmIFxuXHRcdFx0XHQoKHRoZUNhcmV0UG9zICsgNCkgPj0gKCR0aGVDYXJldC5wYXJlbnQoKS5vdXRlckhlaWdodCh0cnVlKSAtIHRoZUNhcmV0SGVpZ2h0KSkgXG5cdFx0XHQpfHwoXG5cdFx0XHRcdChrZXkgPT09IDQwKSAmJiBcblx0XHRcdFx0anVzdGdvXG5cdFx0XHQpXG5cdFx0KXtcblx0XHRcdGNvbnNvbGUubG9nKCdET1dOJylcblx0XHRcdCR0aGVCaXQucGFyZW50cygnLm5vdGVfYml0Jylcblx0XHRcdFx0Lm5leHQoJy5ub3RlX2JpdCcpLmZpbmQoJ3RleHRhcmVhJylcblx0XHRcdFx0LmZvY3VzKClcblx0XHR9XG5cblx0XHRpZiAoXG5cdFx0XHQoa2V5ID09PSA0MCkgJiZcblx0XHRcdChpbmRleCA9PT0gJHNjb3BlLm5vdGUuYm9keS5sZW5ndGggLSAxKVxuXHRcdCl7XG5cdFx0XHQkc2NvcGUuYWRkQml0KGluZGV4KTtcblx0XHR9XG5cdH07XG5cblx0JHNjb3BlLm1hcmsgPSBmdW5jdGlvbihpbmRleCwgb3B0aW9uYWwpe1xuXHRcdC8vIGNvbnNvbGUubG9nKGluZGV4LCAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tYXJrLCAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4sIG9wdGlvbmFsKVxuXG5cdFx0aWYgKChvcHRpb25hbCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8IDc2OCkgfHwgIW9wdGlvbmFsKXtcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1hcmsgPSAhJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWFyaztcblx0XHRcdFx0JHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuID0gZmFsc2U7XG5cdFx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGluZGV4LCAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tYXJrLCAkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4pXG5cdFx0XHR9KVxuXHRcdH1cblx0fTtcblxuXHQkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24oY29udGVudCwgaW5kZW50LCBpbmRleCl7XG5cdFx0Y29uc29sZS5sb2coY29udGVudCwgaW5kZW50LCBpbmRleClcblx0XHRpZiAoaW5kZW50ID4gMCl7XG5cdFx0XHRxdWVyeSA9ICRzY29wZS5ub3RlLmJvZHlbaW5kZXggLSAxXS5jb250ZW50ICsgJyAnICsgY29udGVudDtcblx0XHR9ZWxzZXtcblx0XHRcdHF1ZXJ5ID0gY29udGVudDtcblx0XHR9XG5cblx0XHR2YXIgd2luID0gd2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3Lmdvb2dsZS5jb20vc2VhcmNoP3E9JyArIHF1ZXJ5LCAnX2JsYW5rJyk7XG5cdCAgICB3aW4uZm9jdXMoKTsgXG5cdH07XG5cblx0JHNjb3BlLmNsb3NlQml0TWVudXMgPSBmdW5jdGlvbihleGNlcHQpe1xuXHRcdGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUubm90ZS5ib2R5LCBmdW5jdGlvbihlLCBrKXtcblx0XHRcdGlmICh0eXBlb2YoZS5tZW51X29wZW4pICE9PSAndW5kZWZpbmVkJyAmJiBlLmJpdElEICE9PSBleGNlcHQpXG5cdFx0XHRcdGUubWVudV9vcGVuID0gZmFsc2U7XG5cdFx0fSk7XG5cdH07XG5cblx0JHNjb3BlLnRvZ2dsZUJpdE1lbnUgPSBmdW5jdGlvbihpbmRleCwgZXZlbnQpe1xuXHRcdGlmICghJHNjb3BlLmNvbW1hbmRJc1ByZXNzZWQpe1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQkc2NvcGUuY2xvc2VCaXRNZW51cygkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5iaXRJRCk7XG5cblx0XHQkc2NvcGUubm90ZS5ib2R5W2luZGV4XS5tZW51X29wZW4gPSAhJHNjb3BlLm5vdGUuYm9keVtpbmRleF0ubWVudV9vcGVuO1xuXG5cdFx0aWYgKCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLm1lbnVfb3Blbil7XG5cdFx0XHQkc2NvcGUubWVudWluZyA9IHRydWU7XG5cdFx0fWVsc2V7XG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHQkc2NvcGUubWVudWluZyA9IGZhbHNlO1x0XHRcdFxuXHRcdFx0fSwgMzAwKVxuXHRcdH1cblx0fVxuXG5cblx0dmFyIGluc2VydEluZGV4O1xuXG5cdCRzY29wZS5zZWxlY3RvciA9IGZ1bmN0aW9uKGluZGV4LCBldmVudCl7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0aWYgKCRzY29wZS5jb21tYW5kSXNQcmVzc2VkKXtcblx0XHRcdCRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnNlbGVjdGVkID0gISRzY29wZS5ub3RlLmJvZHlbaW5kZXhdLnNlbGVjdGVkO1xuXHRcdFx0JHNjb3BlLnNlbGVjdGVkQml0cyA9IHRydWU7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRcdGluc2VydEluZGV4ID0gX2JpdEluZGV4KCk7XG5cdH1cblxuXHQkc2NvcGUudW5zZWxlY3RvciA9IGZ1bmN0aW9uKGV4Y2VwdCl7XG5cdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0ZS5zZWxlY3RlZCA9IGZhbHNlO1xuXHRcdFx0ZS5tZW51X29wZW4gPSBmYWxzZTtcblx0XHR9KTtcblx0XHQkc2NvcGUuc2VsZWN0ZWRCaXRzID0gZmFsc2U7XG5cdH07XG5cblxuXHQkc2NvcGUuY3V0ID0gZnVuY3Rpb24oa2lsbCl7XG5cdFx0d2luZG93LmNsaXBib2FyZCA9IFtdO1xuXG5cdFx0YW5ndWxhci5mb3JFYWNoKCRzY29wZS5ub3RlLmJvZHksIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0aWYgKGUuc2VsZWN0ZWQpe1xuXHRcdFx0XHR3aW5kb3cuY2xpcGJvYXJkLnB1c2goZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoa2lsbClcblx0XHRcdCRzY29wZS5raWxsQml0KCk7XG5cblx0XHR3aW5kb3cuY2xpcGJvYXJkZWQgPSB0cnVlOyBcblx0fTtcblxuXHQkc2NvcGUucGFzdGUgPSBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKHdpbmRvdy5jbGlwYm9hcmQpXG5cdFx0YW5ndWxhci5mb3JFYWNoKHdpbmRvdy5jbGlwYm9hcmQsIGZ1bmN0aW9uKGUsIGspe1xuXHRcdFx0JHNjb3BlLm5vdGUuYm9keS5zcGxpY2UoKGluc2VydEluZGV4ICsgaykgKyAxLCAwLCBlKVxuXHRcdH0pO1xuXG5cdFx0JHNjb3BlLnVuc2VsZWN0b3IoKTtcblx0XHR3aW5kb3cuY2xpcGJvYXJkID0gW107XG5cdFx0d2luZG93LmNsaXBib2FyZGVkID0gZmFsc2U7XG5cdH07XG5cblx0JHNjb3BlLmlzRm9jdXNlZCA9IGZ1bmN0aW9uKGRlY2lzaW9uKXtcblx0XHRpZiAoZGVjaXNpb24pe1xuXHRcdFx0JHNjb3BlLmZvY3VzZWQgPSB0cnVlO1xuXHRcdH1lbHNle1xuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0JHNjb3BlLmZvY3VzZWQgPSBmYWxzZTtcblx0XHRcdH0sIDUwKTtcblx0XHR9XG5cdH1cblxuXHQkc2NvcGUuc3dpcGUgPSBmdW5jdGlvbihpbmRleCwgZGlyZWN0aW9uKXtcblx0XHRpZiAoJHNjb3BlLm5vRWRpdCl7XG5cdFx0XHQkc2NvcGUubWFyayhpbmRleCwgdHJ1ZSk7XG5cdFx0fWVsc2UgaWYgKCFfaXNUZXh0U2VsZWN0ZWQoJChldmVudC50YXJnZXQpWzBdKSl7XG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpe1xuXHRcdFx0XHQkc2NvcGUudGFiT3V0KGluZGV4KTtcdFxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKXtcblx0XHRcdFx0JHNjb3BlLnRhYkluKGluZGV4KTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cblx0Ly8gXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblx0Ly8gXHQ4OGIgICAgICAgICAgIGQ4OCA4ODg4ODg4ODg4OCA4ODhiICAgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4ODhiICAgICAgICAgZDg4OCA4OCAgICAgICAgICA4ODg4YiAgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OGA4YiAgICAgICBkOCc4OCA4OCAgICAgICAgICA4OCBgOGIgICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCBgOGIgICAgIGQ4JyA4OCA4OGFhYWFhICAgICA4OCAgYDhiICAgODggODggICAgICAgIDg4ICBcblx0Ly8gXHQ4OCAgYDhiICAgZDgnICA4OCA4OFwiXCJcIlwiXCIgICAgIDg4ICAgYDhiICA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICAgYDhiIGQ4JyAgIDg4IDg4ICAgICAgICAgIDg4ICAgIGA4YiA4OCA4OCAgICAgICAgODggIFxuXHQvLyBcdDg4ICAgIGA4ODgnICAgIDg4IDg4ICAgICAgICAgIDg4ICAgICBgODg4OCBZOGEuICAgIC5hOFAgIFxuXHQvLyBcdDg4ICAgICBgOCcgICAgIDg4IDg4ODg4ODg4ODg4IDg4ICAgICAgYDg4OCAgYFwiWTg4ODhZXCInICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ICAgXG5cblx0JHNjb3BlLm5ld05vdGUgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBuZXdJRCA9IG5ld05vdGUoJHNjb3BlLm5vdGUucGFyZW50KTtcblx0XHQkbG9jYXRpb24ucGF0aCgnL25vdGUvJyArIG5ld0lEKTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH07XG5cblx0JHNjb3BlLmtpbGxOb3RlID0gZnVuY3Rpb24oKXtcblx0XHRraWxsTm90ZSgkc2NvcGUubm90ZS5pZCwgJHNjb3BlLm5vdGUucGFyZW50KTtcblx0XHQkc2NvcGUuY2xvc2VNZW51KCk7XG5cdH07XG5cblx0JHNjb3BlLnNob3dDaGVhdFNoZWV0ID0gZnVuY3Rpb24oKXtcblx0XHRob3RrZXlzLnRvZ2dsZUNoZWF0U2hlZXQoKVxuXHR9O1xuXG5cdCRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS50b2dnbGVDbGFzcygnbWVudU9wZW4nKTtcdFxuXHR9O1xuXG5cdCRzY29wZS5jbG9zZU1lbnUgPSBmdW5jdGlvbigpe1xuXHRcdCQoJyNtYWluJykucmVtb3ZlQ2xhc3MoJ21lbnVPcGVuJyk7XHRcblx0fTtcblxuXHQkc2NvcGUuY2xvc2VOb3RlID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoJHNjb3BlLm5vdGUucGFyZW50KVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgJHNjb3BlLm5vdGUucGFyZW50KVxuXHRcdGVsc2UgaWYgKCRzY29wZS5ub3RlLnBhcnRpY2lwYW50cyl7XG5cdFx0XHRpZiAoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudClcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ib2FyZC8nICsgJHNjb3BlLm5vdGUucGFydGljaXBhbnRzWyRjb29raWVzLmVtYWlsX2VzY2FwZWRdLnBhcmVudClcblx0XHRcdGVsc2Vcblx0XHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9saXN0Jyk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHR9O1xuXG5cdCRzY29wZS5zaGFyZVByb21wdGVyID0gZnVuY3Rpb24oZGlyZWN0aW9uKXtcblx0XHQkc2NvcGUuc2hhcmVQcm9tcHQgPSBkaXJlY3Rpb247XG5cdH1cblxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ODg4ODg4ODg4IDg4ICAgICAgICAgIDg4ODg4ODg4YmEgIDg4ODg4ODg4ODg4IDg4ODg4ODg4YmEgICBhZDg4ODg4YmEgICBcblx0Ly8gXHQ4OCAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODggICAgICBcIjhiIDg4ICAgICAgICAgIDg4ICAgICAgXCI4YiBkOFwiICAgICBcIjhiICBcblx0Ly8gXHQ4OCAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODggICAgICAsOFAgODggICAgICAgICAgODggICAgICAsOFAgWTgsICAgICAgICAgIFxuXHQvLyBcdDg4YWFhYWFhYWE4OCA4OGFhYWFhICAgICA4OCAgICAgICAgICA4OGFhYWFhYThQJyA4OGFhYWFhICAgICA4OGFhYWFhYThQJyBgWThhYWFhYSwgICAgXG5cdC8vIFx0ODhcIlwiXCJcIlwiXCJcIlwiODggODhcIlwiXCJcIlwiICAgICA4OCAgICAgICAgICA4OFwiXCJcIlwiXCJcIicgICA4OFwiXCJcIlwiXCIgICAgIDg4XCJcIlwiXCI4OCcgICAgIGBcIlwiXCJcIlwiOGIsICBcblx0Ly8gXHQ4OCAgICAgICAgODggODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgICAgICAgODggICAgYDhiICAgICAgICAgICBgOGIgIFxuXHQvLyBcdDg4ICAgICAgICA4OCA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgICAgICA4OCAgICAgYDhiICBZOGEgICAgIGE4UCAgXG5cdC8vIFx0ODggICAgICAgIDg4IDg4ODg4ODg4ODg4IDg4ODg4ODg4ODg4IDg4ICAgICAgICAgIDg4ODg4ODg4ODg4IDg4ICAgICAgYDhiICBcIlk4ODg4OFBcIiAgIFxuXHQvLyBcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cdC8vIFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuXHR2YXIgX2lzVGV4dGFyZWEgPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnR5cGUgPT09ICd0ZXh0YXJlYSc7XG5cdH0sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblx0X2lzQml0ID0gZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignbW91c2V0cmFwJykgPiAtMTtcblx0fSxcblxuXHRfYml0SW5kZXggPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnBhcmVudHMoJy5ub3RlX2JpdCcpLmluZGV4KCk7XG5cdH0sXG5cblx0X2ZvY3VzTWUgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0JCgnLm5vdGVfYm9keScpXG5cdFx0XHRcdC5maW5kKCcubm90ZV9iaXQ6ZXEoJyArIChpbmRleCkgKyAnKSB0ZXh0YXJlYScpXG5cdFx0XHRcdC5mb2N1cygpO1xuXHRcdH0pO1xuXHR9LFxuXG5cdF9pc1RleHRTZWxlY3RlZCA9IGZ1bmN0aW9uKGlucHV0KXtcblx0XHR2YXIgc3RhcnRQb3MgPSBpbnB1dC5zZWxlY3Rpb25TdGFydDtcblx0XHR2YXIgZW5kUG9zID0gaW5wdXQuc2VsZWN0aW9uRW5kO1xuXHRcdHZhciBkb2MgPSBkb2N1bWVudC5zZWxlY3Rpb247XG5cblx0XHRpZihkb2MgJiYgZG9jLmNyZWF0ZVJhbmdlKCkudGV4dC5sZW5ndGggIT0gMCl7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9ZWxzZSBpZiAoIWRvYyAmJiBpbnB1dC52YWx1ZS5zdWJzdHJpbmcoc3RhcnRQb3MsIGVuZFBvcykubGVuZ3RoICE9IDApe1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXHQkc2NvcGUuc29ydGFibGVPcHRpb25zX25vdGUgPSB7XG5cdFx0aGFuZGxlOiAnPiAuYml0X2FuY2hvcicsXG5cdFx0YXhpczogJ3knLFxuXHRcdHNjcm9sbDogdHJ1ZSxcblx0XHRoZWxwZXI6ICdjbG9uZScsXG5cdFx0Ly8gc3RhcnQ6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcblx0XHQvLyAgICAkKHRoaXMpLmF0dHIoJ3N0YXJ0aW5nU2Nyb2xsVG9wJywgd2luZG93LnBhZ2VZT2Zmc2V0KTtcblx0XHQvLyB9LFxuXHRcdC8vIGRyYWc6IGZ1bmN0aW9uKGV2ZW50LHVpKXtcblx0XHQvLyAgICB2YXIgc3QgPSBwYXJzZUludCgkKHRoaXMpLmF0dHIoJ3N0YXJ0aW5nU2Nyb2xsVG9wJykpO1xuXHRcdC8vICAgIHVpLnBvc2l0aW9uLnRvcCAtPSBzdDtcblx0XHQvLyB9LFxuXHRcdCd1aS1mbG9hdGluZyc6IHRydWVcblx0fTtcblxuXHRoaXN0b3J5Q291bnQoZnVuY3Rpb24odGhlTnVtYmVyKXtcblx0XHQkc2NvcGUuaGlzdG9yeUNvdW50ZXIgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoZU51bWJlcjtcblx0XHR9XG5cdH0pXG5cblx0JHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLmNsb3NlTWVudSgpO1xuXHRcdExvZ291dCgpO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihcblx0JHJvb3RTY29wZSwgXG5cdCRzY29wZSwgXG5cdE5vdGUsXG5cdG5ld05vdGUsXG5cdGtpbGxOb3RlLFxuXHRuZXdCaXQsXG5cdCRyb3V0ZVBhcmFtcywgXG5cdCRyb3V0ZSwgXG5cdGhvdGtleXMsXG5cdCR0aW1lb3V0LFxuXHQkbG9jYXRpb24sXG5cdCRjb29raWVzLFxuXHRBdXRoLFxuXHRMb2dpbixcblx0Zmlyc3ROb3RlXG4pIHtcblxuXHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xuXHR9KVxuXHRcbiAgICAkc2NvcGUuYXV0aCA9IEF1dGg7XG5cbiAgICAkc2NvcGUucGFnZUNsYXNzID0gJ3BvcnRhbCc7XG4gICAgJHNjb3BlLnZpZXdpbmcgPSAnc2lnbkluJztcbiAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgaWYgKHdpbmRvdy5sb2dnZWRJbilcblx0ICAgICRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXG5cdHdpbmRvdy5kb2N1bWVudC50aXRsZSA9ICdXZWxjb21lIOKAkyBMSUNLJztcblxuICAgICRzY29wZS5zaWduX3VwID0gZnVuY3Rpb24oKXtcbiAgICBcdGlmICghJHNjb3BlLnNpZ25Jbi4kcHJpc3RpbmUpXG5cdCAgICBcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuXHRcdCRzY29wZS5hdXRoLiRjcmVhdGVVc2VyKHtcblx0XHRcdGVtYWlsICAgIDogJHNjb3BlLnNpZ25VcF9pbnB1dC5lbWFpbCxcblx0XHRcdHBhc3N3b3JkIDogJHNjb3BlLnNpZ25VcF9pbnB1dC5wYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odXNlckRhdGEpIHtcblxuXHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdFx0Y29uc29sZS5sb2coJ25ldyB1c2VyIFwiJyArIHVzZXJEYXRhLnVpZCArICdcIiBjcmVhdGVkIScpO1xuXG5cdFx0XHR3aW5kb3cudWlkID0gdXNlckRhdGEudWlkO1xuXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRMb2dpbigkc2NvcGUuc2lnblVwX2lucHV0LmVtYWlsLCAkc2NvcGUuc2lnblVwX2lucHV0LnBhc3N3b3JkLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGZpcnN0Tm90ZSgpO1xuXHRcdFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0fSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNpZ25faW4gPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCEkc2NvcGUuc2lnbkluLiRwcmlzdGluZSlcblx0ICAgIFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgIFx0TG9naW4oJHNjb3BlLnNpZ25Jbl9pbnB1dC5lbWFpbCwgJHNjb3BlLnNpZ25Jbl9pbnB1dC5wYXNzd29yZCwgXG4gICAgXHRcdGZ1bmN0aW9uKCl7XG5cdCAgICBcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0ICAgIFx0XHRpZiAoIXdpbmRvdy5yZXNldHRpbmdQYXNzd29yZClcblx0XHQgICAgXHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdCAgICBcdGVsc2V7XG5cdFx0ICAgIFx0XHQkc2NvcGUudmlld2luZyA9ICdwd2NoYW5nZSc7XG5cdFx0ICAgIFx0fVxuXHQgICAgXHR9LFxuXHQgICAgXHRmdW5jdGlvbigpe1xuXHQgICAgXHRcdCRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cdCAgICBcdFx0JHNjb3BlLnNpZ25Jbl9pbnB1dC5lbWFpbCA9ICcnO1xuXHQgICAgXHRcdCRzY29wZS5zaWduSW5faW5wdXQucGFzc3dvcmQgPSAnJztcblx0ICAgIFx0fVxuICAgIFx0KTtcbiAgICB9XG5cbiAgICAkc2NvcGUubmV3UFcgPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCEkc2NvcGUuc2lnbkluLiRwcmlzdGluZSlcblx0ICAgIFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0JHNjb3BlLmF1dGguJGNoYW5nZVBhc3N3b3JkKHtcblx0XHRcdGVtYWlsOiAkc2NvcGUuc2lnbkluX2lucHV0LmVtYWlsLFxuXHRcdFx0b2xkUGFzc3dvcmQ6ICRzY29wZS5zaWduSW5faW5wdXQucGFzc3dvcmQsXG5cdFx0XHRuZXdQYXNzd29yZDogJHNjb3BlLnJlc2V0X2lucHV0LnBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbigpIHtcblx0XHRcdCRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHR3aW5kb3cucmVzZXR0aW5nUGFzc3dvcmQgPSBmYWxzZTtcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvbGlzdCcpO1xuXHRcdFx0YWxlcnQoJ1lvdXIgcGFzc3dvcmQgaGFzIGJlZW4gcmVzZXQuXFxuXFxuRG9uXFwndCB3b3JyeSwgaXQgaGFwcGVucyB0byBldmVyeW9uZSEgOiknKVxuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRXJyb3I6IFwiLCBlcnJvcik7XG5cdFx0fSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnB3UmVzZXQgPSBmdW5jdGlvbigpe1xuICAgIFx0aWYgKCEkc2NvcGUuc2lnbkluLiRwcmlzdGluZSlcblx0ICAgIFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgXHRpZiAoISRzY29wZS5zaWduSW4uJHByaXN0aW5lICYmICRzY29wZS5zaWduSW4uJHZhbGlkKXtcblx0XHRcdCRzY29wZS5hdXRoLiRyZXNldFBhc3N3b3JkKHtcblx0XHRcdFx0ZW1haWw6ICRzY29wZS5zaWduSW5faW5wdXQuZW1haWxcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRcdHdpbmRvdy5yZXNldHRpbmdQYXNzd29yZCA9IHRydWU7XG5cdFx0XHRcdGFsZXJ0KCdPa2F5IVxcblxcbkdvIGNoZWNrIHlvdXIgZW1haWwsIHdlIGp1c3Qgc2VudCB5b3UgYSB0ZW1wb3JhcnkgcGFzc3dvcmQuIFxcblxcbkdvIGdldCBpdCB0aGVyZSwgbG9naW4gd2l0aCB0aGF0LCBhbmQgd2VcXCdsbCBjaGFuZ2UgeW91ciBwYXNzd29yZCB3aGVuIHlvdSBnZXQgYmFjayEnKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1Bhc3N3b3JkIHJlc2V0IGVtYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5IScpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIkVycm9yOiBcIiwgZXJyb3IpO1xuXHRcdFx0fSk7XG4gICAgXHR9ZWxzZXtcbiAgICBcdFx0YWxlcnQoJ091IG5laSFcXG5cXG5QdXQgeW91ciBlbWFpbCBpbiwgYW5kIGNsaWNrIHRoZSBcXCdGb3Jnb3QgeW91ciBwYXNzd29yZD9cXCcgYnV0dG9uIGFnYWluLicpXG4gICAgXHR9XG4gICAgfVxuXG4gICAgJHNjb3BlLmVudGVyV2F0Y2ggPSBmdW5jdGlvbihldmVudCl7XG4gICAgXHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpe1xuICAgIFx0XHRpZiAoJHNjb3BlLnZpZXdpbmcgPT09ICdzaWduVXAnKSAkc2NvcGUuc2lnbl91cCgpO1xuICAgIFx0XHRlbHNlIGlmICgkc2NvcGUudmlld2luZyA9PT0gJ3NpZ25JbicpICRzY29wZS5zaWduX2luKCk7XG4gICAgXHRcdGVsc2UgaWYgKCRzY29wZS52aWV3aW5nID09PSAncHdjaGFuZ2UnKSAkc2NvcGUubmV3UFcoKTtcbiAgICBcdH1cbiAgICB9O1xufVxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSxcblx0aG90a2V5cyxcblx0TWV0YSxcblx0Tm90ZSxcblx0c2hhcmVkTm90ZSxcblx0c2hhcmVOb3RlLFxuXHRhZGRUb1NoYXJlZE5vdGUsXG5cdCRyb3V0ZVBhcmFtcyxcblx0JHRpbWVvdXQsXG5cdCRsb2NhdGlvblxuKSB7XG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblx0XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdzaGFyZSc7XG5cbiAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsIHdpbmRvdy51bmJpbmRBbGwpO1xuXG4gICAgd2luZG93LmRvY3VtZW50LnRpdGxlID0gJ1NoYXJlIG5vdGUg4oCTIExJQ0snO1xuXG5cdE1ldGEoKS4kYmluZFRvKCRzY29wZSwgJ21ldGEnKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZGVyKXtcblx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmRlcilcblx0XHRcdHNoYXJlZFVzZXJHZW5lcmF0b3IoKVxuXHRcdH0pXG5cblx0dmFyIHNoYXJlZFVzZXJHZW5lcmF0b3JHYXRlLFxuXHRcdHVuYmluZGVyLFxuICAgIFx0c2hhcmVTb3VyY2UgPSBmdW5jdGlvbigpe1xuXG4gICAgXHRcdGlmICh0eXBlb2YodW5iaW5kZXIpICE9PSAndW5kZWZpbmVkJylcbiAgICBcdFx0XHR1bmJpbmRlcigpO1xuXG4gICAgXHRcdGlmICghJHNjb3BlLmlzU2hhcmVkKXtcblx0XHRcdFx0aWYgKHdpbmRvdy5oaXN0b3JpY2FsW3dpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aCAtIDJdLmluZGV4T2YoJ3NoYXJlZCcpID4gMClcblx0XHRcdFx0XHQkc2NvcGUuaXNTaGFyZWQgPSB0cnVlO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JHNjb3BlLmlzU2hhcmVkID0gZmFsc2U7XG4gICAgXHRcdH1cblxuXHRcdFx0aWYgKCRzY29wZS5pc1NoYXJlZCl7XG5cdFx0XHRcdC8vIHNoYXJlZFVzZXJHZW5lcmF0b3JHYXRlID0gZmFsc2U7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTSEFSRUQnKVxuXHRcdFx0XHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJylcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbih1bmJpbmRlcil7XG5cdFx0XHRcdFx0XHR3aW5kb3cudW5iaW5kaW5nLnB1c2godW5iaW5kZXIpXG5cdFx0XHRcdFx0XHQkc2NvcGUucmV0dXJuQWRkcmVzcyA9ICcvc2hhcmVkbm90ZS8nICsgJHNjb3BlLm5vdGUuaWQ7XG5cdFx0XHRcdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yKGZhbHNlKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2V7XG5cdFx0XHRcdHNoYXJlZFVzZXJHZW5lcmF0b3JHYXRlID0gdHJ1ZTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1BSSVZBVCcpXG5cdFx0XHRcdE5vdGUoJHJvdXRlUGFyYW1zLmlkKS4kYmluZFRvKCRzY29wZSwgJ25vdGUnKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVuYmluZCl7XG5cdFx0XHRcdFx0XHR1bmJpbmRlciA9IHVuYmluZDtcblx0XHRcdFx0XHRcdHdpbmRvdy51bmJpbmRpbmcucHVzaCh1bmJpbmQpXG5cdFx0XHRcdFx0XHQkc2NvcGUucmV0dXJuQWRkcmVzcyA9ICcvbm90ZS8nICsgJHNjb3BlLm5vdGUuaWQ7XG5cdFx0XHRcdFx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yKHRydWUpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRzaGFyZWRVc2VyR2VuZXJhdG9yID0gZnVuY3Rpb24oYWxyZWFkeVNoYXJlZCl7XG5cdFx0XHRpZiAoc2hhcmVkVXNlckdlbmVyYXRvckdhdGUpe1xuXG5cdFx0XHRcdHBhcnRpY2lwYW50c0dlbmVyYXRvcigpO1xuXG5cdFx0XHRcdHZhciB1c2VycyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubWV0YS5zaGFyZWRVc2VycyksXG5cdFx0XHRcdFx0dW5pcXVlVXNlcnMgPSBfLnVuaXEodXNlcnMpO1xuXG5cdFx0XHRcdGlmKGFscmVhZHlTaGFyZWQpXG5cdFx0XHRcdFx0dmFyIHBhcnRpY2lwYW50cyA9IGFuZ3VsYXIuY29weSgkc2NvcGUubWV0YS5zaGFyZWRVc2VycylcblxuXHRcdFx0XHRhbmd1bGFyLmZvckVhY2godW5pcXVlVXNlcnMsIGZ1bmN0aW9uKHYsIGspe1xuXHRcdFx0XHRcdGlmIChhbHJlYWR5U2hhcmVkKXtcblx0XHRcdFx0XHRcdGFuZ3VsYXIuZm9yRWFjaChwYXJ0aWNpcGFudHMsIGZ1bmN0aW9uKHZ2LCBrayl7XG5cdFx0XHRcdFx0XHRcdGlmICh3aW5kb3cuZW1haWxVbmVzY2FwZXIoa2spID09PSB2KVxuXHRcdFx0XHRcdFx0XHRcdGRlbGV0ZSB1bmlxdWVVc2Vyc1trXVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodiA9PT0gd2luZG93LmxvY2FsU3RvcmFnZS5lbWFpbClcblx0XHRcdFx0XHRcdGRlbGV0ZSB1bmlxdWVVc2Vyc1trXVxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdCRzY29wZS5zaGFyZWRVc2VyRmlsdGVyID0gdW5pcXVlVXNlcnM7XG5cdFx0XHR9XG5cblx0XHRcdHNoYXJlZFVzZXJHZW5lcmF0b3JHYXRlID0gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0cGFydGljaXBhbnRzR2VuZXJhdG9yID0gZnVuY3Rpb24oKXtcblxuXHRcdFx0dmFyIF9wYXJ0aWNpcGFudHMgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLm5vdGUucGFydGljaXBhbnRzKVxuXG5cdFx0XHRhbmd1bGFyLmZvckVhY2goX3BhcnRpY2lwYW50cywgZnVuY3Rpb24odiwgayl7XG5cdFx0XHRcdGlmIChrID09PSB3aW5kb3cubG9jYWxTdG9yYWdlLmVtYWlsX2VzY2FwZWQpXG5cdFx0XHRcdFx0ZGVsZXRlIF9wYXJ0aWNpcGFudHNba107XG5cdFx0XHR9KVxuXG5cdFx0XHQkc2NvcGUubm90ZVBhcnRpY2lwYW50cyA9IF9wYXJ0aWNpcGFudHM7XG5cblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRzaGFyZVNvdXJjZSgpO1xuXG5cdCRzY29wZS5zaGFyZVVzZXIgPSBmdW5jdGlvbih0YXJnZXQpe1xuXHRcdGlmICgkc2NvcGUuaXNTaGFyZWQpe1xuXHRcdFx0YWRkVG9TaGFyZWROb3RlKFxuXHRcdFx0XHQkc2NvcGUubm90ZS5pZCwgXG5cdFx0XHRcdHRhcmdldCxcblx0XHRcdFx0cGFydGljaXBhbnRzR2VuZXJhdG9yXG5cdFx0XHQpO1xuXHRcdH1lbHNle1xuXHRcdFx0c2hhcmVOb3RlKFxuXHRcdFx0XHQkc2NvcGUubm90ZS5pZCwgXG5cdFx0XHRcdHRhcmdldCwgXG5cdFx0XHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdCRzY29wZS5pc1NoYXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0XHRzaGFyZVNvdXJjZSgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHR9O1xuXG5cdCRzY29wZS5yZW1vdmVVc2VyID0gZnVuY3Rpb24odGFyZ2V0KXtcblx0XHRhbmd1bGFyLmZvckVhY2goJHNjb3BlLm5vdGUucGFydGljaXBhbnRzLCBmdW5jdGlvbih2LCBrKXtcblx0XHRcdGNvbnNvbGUubG9nKHYsIGspXG5cdFx0XHRpZiAodGFyZ2V0ID09PSBrKVxuXHRcdFx0XHRkZWxldGUgJHNjb3BlLm5vdGUucGFydGljaXBhbnRzW2tdO1xuXHRcdH0pXG5cblx0XHRwYXJ0aWNpcGFudHNHZW5lcmF0b3IoKTtcblx0fVxuXG5cdGhvdGtleXMuYmluZFRvKCRzY29wZSkgXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRkZXNjcmlwdGlvbjogJ2FoLCBmb3JnZXQgaXQnLFxuXHRcdFx0YWxsb3dJbjogWydJTlBVVCcsICdTRUxFQ1QnLCAnVEVYVEFSRUEnXSxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihldmVudCwgaG90a2V5KSB7XG5cdFx0XHRcdCRzY29wZS5nb0JhY2soKTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC5hZGQoe1xuXHRcdFx0Y29tYm86ICdlbnRlcicsXG5cdFx0XHRkZXNjcmlwdGlvbjogJycsXG5cdFx0XHRhbGxvd0luOiBbJ0lOUFVUJywgJ1NFTEVDVCcsICdURVhUQVJFQSddLFxuXHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50LCBob3RrZXkpIHtcblx0XHRcdFx0JHNjb3BlLnNoYXJlVXNlcigkc2NvcGUuc2hhcmVUYXJnZXQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdCRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKCRzY29wZS5yZXR1cm5BZGRyZXNzKTtcblx0fVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oXG5cdCRzY29wZSxcblx0JHJvdXRlUGFyYW1zLFxuXHROb3RlLFxuXHRzaGFyZWROb3RlLFxuXHRob3RrZXlzLFxuXHQkbG9jYXRpb24sXG5cdCR0aW1lb3V0XG4pIHsgXG5cblx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JHNjb3BlLiRkaWdlc3QoKTtcblx0fSlcblxuXHQkc2NvcGUucGFnZUNsYXNzID0gJ3RleHQnO1xuXG5cdCRzY29wZS4kb24oJyRkZXN0cm95Jywgd2luZG93LnVuYmluZEFsbClcblxuXHR3aW5kb3cuZG9jdW1lbnQudGl0bGUgPSAnVGV4dCB2aWV3ZXIgZm9yJyArICRzY29wZS5ub3RlLnRpdGxlICsgJyDigJMgTElDSyc7XG5cblx0aWYgKHdpbmRvdy5oaXN0b3JpY2FsW3dpbmRvdy5oaXN0b3JpY2FsLmxlbmd0aCAtIDJdLmluZGV4T2YoJ3NoYXJlZCcpID4gMClcblx0XHRzaGFyZWROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJyk7XG5cdGVsc2Vcblx0XHROb3RlKCRyb3V0ZVBhcmFtcy5pZCkuJGJpbmRUbygkc2NvcGUsICdub3RlJyk7XG5cdFxuXHRob3RrZXlzLmJpbmRUbygkc2NvcGUpXG5cdFx0LmFkZCh7XG5cdFx0XHRjb21ibzogJ2VzYycsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZXZlbnQsIGhvdGtleSkge1xuXHRcdFx0XHQkc2NvcGUuY2xvc2VUZXh0KCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSlcblxuXG5cdCRzY29wZS5jbG9zZVRleHQgPSBmdW5jdGlvbigpe1xuXHRcdCRsb2NhdGlvbi5wYXRoKHdpbmRvdy5sb2NhbFN0b3JhZ2UuaGlzdG9yaWNhbF9sYXN0KTtcblxuXHRcdGlmICh3aW5kb3cuaGlzdG9yaWNhbFt3aW5kb3cuaGlzdG9yaWNhbC5sZW5ndGggLSAyXS5pbmRleE9mKCdzaGFyZWQnKSA+IDApe1xuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9zaGFyZWRub3RlLycgKyAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdH1lbHNle1xuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ub3RlLycgKyAkcm91dGVQYXJhbXMuaWQpO1xuXHRcdH1cblx0fVxuXG5cdCRzY29wZS5vcGVuTWVudSA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnI21haW4nKS50b2dnbGVDbGFzcygnbWVudU9wZW4nKTtcdFxuXHR9O1xufSIsIiQoZnVuY3Rpb24oKSB7XG5cblx0Ly8gRkVBVFVSRSBURVNUU1xuXG5cdHZhciBfcHJvcGVydHlDYWNoZSA9IHt9O1x0XG5cblx0ZXhwb3J0cy5zdXBwb3J0c1N2ZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICghX3Byb3BlcnR5Q2FjaGUuc3VwcG9ydHNTdmcpe1xuXHRcdFx0dmFyIHJlc3VsdCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoXCJodHRwOi8vd3d3LnczLm9yZy9UUi9TVkcxMS9mZWF0dXJlI0ltYWdlXCIsIFwiMS4xXCIpO1xuXHRcdFx0X3Byb3BlcnR5Q2FjaGUuc3VwcG9ydHNTdmcgPSByZXN1bHQ7XG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIF9wcm9wZXJ0eUNhY2hlLnN1cHBvcnRzU3ZnO1xuXHR9OyBcblxuXHRleHBvcnRzLm1lZGlhUXVlcmllc1N1cHBvcnRlZCA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCFfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQpe1xuXG5cdFx0XHR2YXIgZ2V0VGVzdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZWRpYXRlc3RcIiksXG5cdFx0XHRcdGJvb2w7XG5cblx0XHRcdGlmICghZ2V0VGVzdGVyKXtcblx0XHRcdFx0dmFyIGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0ZC5pZCA9IFwibWVkaWF0ZXN0XCI7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7XG5cdFx0XHRcdGJvb2wgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGVsc2UgdmFyIGQgPSBnZXRUZXN0ZXI7XG5cblx0XHRcdGlmICggd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZCkucG9zaXRpb24gPT0gXCJhYnNvbHV0ZVwiIClcblx0XHRcdFx0Ym9vbCA9IHRydWU7XG5cblx0XHRcdF9wcm9wZXJ0eUNhY2hlLm1lZGlhUXVlcmllc1N1cHBvcnRlZCA9IGJvb2w7XG5cblx0XHRcdHJldHVybiBib29sO1xuXHRcdH1cblx0XHRlbHNlIHJldHVybiBfcHJvcGVydHlDYWNoZS5tZWRpYVF1ZXJpZXNTdXBwb3J0ZWQ7XG5cdH07IFxuXG5cdGV4cG9ydHMuY292ZXJCYWNrZ3JvdW5kU3VwcG9ydGVkID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoIV9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCl7XG5cdFx0XHR2YXIgcmVzdWx0ID0gKCdiYWNrZ3JvdW5kU2l6ZScgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlKTtcblx0XHRcdF9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZCA9IHJlc3VsdDtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXHRcdGVsc2UgcmV0dXJuIF9wcm9wZXJ0eUNhY2hlLmNvdmVyQmFja2dyb3VuZFN1cHBvcnRlZDtcblx0fTtcblx0XG5cblx0Ly8gVVRJTElUSUVTXG5cblx0ZXhwb3J0cy5tYXBfcmFuZ2UgPSBmdW5jdGlvbih2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSB7XG5cdCAgICByZXR1cm4gKGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSkpLnRvRml4ZWQoMik7XG5cdH1cblxuXHRleHBvcnRzLnJhbmRvbUludCA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG5cdCAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcblx0fVxuXG5cdGV4cG9ydHMuc2Nyb2xsVG9IZXJlID0gZnVuY3Rpb24od2hlcmUsIGV4dHJhKXtcblx0XHRpZiAoIWV4dHJhKSBleHRyYSA9IDA7XG5cdFx0XG5cdFx0dmFyIHRhcmdldCA9ICQod2hlcmUpLm9mZnNldCgpLnRvcDtcblxuXHRcdC8vIGRlZmluZSBob3cgbGFyZ2UgeW91ciBzdGlja3kgaGVhZGVyIGlzIGhlcmUhXG5cdFx0aWYgKHdpbmRvdy5tZWRpYVF1ZXJ5LmdldFF1ZXJ5KCkgPT09ICdtb2JpbGUnKSB0YXJnZXQgLT0gNTU7XG5cblx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRcdHNjcm9sbFRvcDogdGFyZ2V0ICsgZXh0cmFcblx0XHR9LCA1MDApO1xuXHR9OyBcblxuXHRleHBvcnRzLnBhZ2VTZXR1cCA9IChmdW5jdGlvbigpIHtcblx0XHR2YXIgc3Vic2NyaWJlcnMgPSBbXSxcblx0XHRcdGlzU2V0VXAgPSBmYWxzZTtcblxuXHRcdGZ1bmN0aW9uIG9rYXlnbygpe1xuXHRcdFx0Zm9yICh2YXIgbWV0aG9kIGluIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdHN1YnNjcmliZXJzW21ldGhvZF0oKTtcblx0XHRcdH1cblx0XHRcdGlzU2V0VXAgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN1YnNjcmliZShtZXRob2QpIHtcblx0XHRcdHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcblxuXHRcdFx0aXNTZXRVcCAmJiBva2F5Z28oKTtcblx0XHR9XG5cblx0XHQvLyBSZXR1cm5hbCAgXG5cdFx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHRcdHJldHVybiB7XG5cdFx0XHRva2F5Z286IG9rYXlnbyxcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlXG5cdFx0fTtcblx0fSkoKTsgXG5cblx0ZXhwb3J0cy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuXHRcdHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuXHRcdHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGxhc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRpbWVzdGFtcDtcblxuXHRcdFx0aWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0aWYgKCFpbW1lZGlhdGUpIHtcblx0XHRcdFx0XHRyZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0XHRcdGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnRleHQgPSB0aGlzO1xuXHRcdFx0YXJncyA9IGFyZ3VtZW50cztcblx0XHRcdHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0dmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG5cdFx0XHRpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblx0XHRcdGlmIChjYWxsTm93KSB7XG5cdFx0XHRcdHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHRcdGNvbnRleHQgPSBhcmdzID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHR9OyBcblxuXHRleHBvcnRzLm1lZGlhUXVlcnkgPSAoZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHN1YnNjcmliZXJzID0gW10sXG5cdFx0XHRtZWRpYUN1cnJlbnQsXG5cdFx0XHRtZWRpYVByZXYsXG5cdFx0XHQkd2luZG93ID0gJCh3aW5kb3cpLFxuXHRcdFx0JGh0bWwgPSAkKCdodG1sJyk7XG5cblx0XHRmdW5jdGlvbiBjYWxjdWxhdGUoKXtcblx0XHRcdHZhciBpbm5lcldpZHRoID0gJHdpbmRvdy5pbm5lcldpZHRoKCksXG5cdFx0XHRcdGlubmVySGVpZ2h0ID0gJHdpbmRvdy5pbm5lckhlaWdodCgpO1xuXG5cdFx0XHRpZiAoIGlubmVyV2lkdGggPCA3NjggKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ21vYmlsZSdcblx0XHRcdGVsc2UgaWYgKCAoIGlubmVyV2lkdGggPj0gNzY4KSAmJiAoIGlubmVyV2lkdGggPCA5OTIgKSApIFxuXHRcdFx0XHRtZWRpYUN1cnJlbnQgPSAndGFibGV0J1xuXHRcdFx0ZWxzZSBpZiAoICggaW5uZXJXaWR0aCA+PSA5OTIgKSAmJiAoIGlubmVyV2lkdGggPCAxMjAwICkgKSBcblx0XHRcdFx0bWVkaWFDdXJyZW50ID0gJ2Rlc2t0b3AnXG5cdFx0XHRlbHNlIGlmICggaW5uZXJXaWR0aCA+PSAxMjAwICkgXG5cdFx0XHRcdG1lZGlhQ3VycmVudCA9ICdsYXJnZV9kZXNrdG9wJ1xuXG5cdFx0XHRpZiAoIGlubmVySGVpZ2h0IDwgNzQwIClcblx0XHRcdFx0bWVkaWFDdXJyZW50ICs9ICcgc2hvcnQnXG5cblx0XHRcdGlmICggbWVkaWFDdXJyZW50ICE9PSBtZWRpYVByZXYgKXtcblx0XHRcdFx0Zm9yICh2YXIgbWV0aG9kIGluIHN1YnNjcmliZXJzKSB7XG5cdFx0XHRcdFx0c3Vic2NyaWJlcnNbbWV0aG9kXShtZWRpYUN1cnJlbnQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFleHBvcnRzLm1lZGlhUXVlcmllc1N1cHBvcnRlZCgpKVxuXHRcdFx0XHRcdCRodG1sLnJlbW92ZUNsYXNzKG1lZGlhUHJldikuYWRkQ2xhc3MobWVkaWFDdXJyZW50KTtcblx0XHRcdH1cblxuXHRcdFx0bWVkaWFQcmV2ID0gbWVkaWFDdXJyZW50OyBcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzdWJzY3JpYmUobWV0aG9kKSB7XG5cdFx0XHRzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGdldFF1ZXJ5KCl7XG5cdFx0XHRyZXR1cm4gbWVkaWFDdXJyZW50O1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBpcyhxdWVyeSl7XG5cdFx0XHRyZXR1cm4gbWVkaWFDdXJyZW50LmluZGV4T2YocXVlcnkpID49IDA7XG5cdFx0fTtcblxuXHRcdHZhciBjYWxjdWxhdGVEZWJvdW5jZSA9IGV4cG9ydHMuZGVib3VuY2UoY2FsY3VsYXRlLCAyMDApOyBcblxuXHRcdCR3aW5kb3cucmVzaXplKGNhbGN1bGF0ZURlYm91bmNlKTtcblxuXHRcdC8vIGNhbGN1bGF0ZSgpO1xuXHRcdFxuXHRcdC8vICR3aW5kb3cubG9hZChjYWxjdWxhdGUpO1xuXG5cdFx0Ly8gZXhwb3J0cy5wYWdlU2V0dXAuc3Vic2NyaWJlKGNhbGN1bGF0ZSk7XG5cblx0XHQvLyBSZXR1cm5hbFxuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3Vic2NyaWJlOiBzdWJzY3JpYmUsXG5cdFx0XHRnZXRRdWVyeTogZ2V0UXVlcnksXG5cdFx0XHRpczogaXNcblx0XHR9O1xuXHR9KSgpOyBcblxuXHRleHBvcnRzLmdNYXBMb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBWYXJpYWJsZXNcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXHRcdHZhciBzdWJzY3JpYmVycyA9IFtdO1xuXG5cdFx0Ly8gTG9hZCBHb29nbGUgTWFwc1xuXHRcdC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cdFx0Z01hcFNldHVwID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdFx0c2NyaXB0LnNyYyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanM/dj0zLmV4cCYnICsgJ2NhbGxiYWNrPSQkXy5nTWFwTG9hZGVyLnJlYWR5Jztcblx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuXHRcdH07XG5cblx0XHRmdW5jdGlvbiByZWFkeSgpIHtcblx0XHRcdGZvciAodmFyIG1ldGhvZCBpbiBzdWJzY3JpYmVycykge1xuXHRcdFx0XHRzdWJzY3JpYmVyc1ttZXRob2RdKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN1YnNjcmliZShtZXRob2QpIHtcblx0XHRcdHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcblx0XHR9O1xuXG5cdFx0Ly8gJCh3aW5kb3cpLmxvYWQoZ01hcFNldHVwKVxuXG5cdFx0Ly8gUmV0dXJuYWxcblx0XHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlYWR5OiByZWFkeSxcblx0XHRcdHN1YnNjcmliZTogc3Vic2NyaWJlXG5cdFx0fTtcblx0fSkoKTtcblxuXHRleHBvcnRzLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHR2YXIgdXVpZCA9ICd4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG5cdFx0XHR2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuXHRcdFx0ZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuXHRcdFx0cmV0dXJuIChjID09ICd4JyA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKDE2KTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdXVpZDtcblx0fTtcblxuXG59KTsiXX0=
