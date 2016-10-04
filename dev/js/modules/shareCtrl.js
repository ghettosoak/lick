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

    $scope.$on('$destroy', window.unbindAll)

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









