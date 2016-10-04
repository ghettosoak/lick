module.exports = function(
	$scope,
	$timeout
) {
	$timeout(function() {
		$scope.$digest();
	})
	
	$scope.pageClass = 'hello';
}