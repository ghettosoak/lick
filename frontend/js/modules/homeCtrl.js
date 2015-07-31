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
	Login
) {
    $scope.auth = Auth;

    $scope.signUp = function(){
		$scope.auth.$createUser({
			email    : $scope.signUp.email,
			password : $scope.signUp.password
		}).then(function(userData) {

			window.uid = userData.uid

			Login($scope.signUp.email, $scope.signUp.password);

		}).catch(function(error) {
			console.log(error);
		});
    }

    $scope.signIn = function(){
    	Login($scope.signIn.email, $scope.signIn.password, function(){
    		$location.path('/list/');
    	});
    }
}