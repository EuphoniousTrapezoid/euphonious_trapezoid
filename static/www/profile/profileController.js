sphero.controller('profileController', ['$scope', '$window', 'Auth', 'socket', '$state', 'player',
  function($scope, $window, Auth, socket, $state, player) {
  	
  	$scope.profile = player.profile;
    $scope.friends = player.profile.friends;
    console.log($scope.friends);  	
  	$scope.logout = function() {
  		Auth.destroyCredentials();
      setTimeout(function() {$state.go('nav');}, 500);
  	};
  	
  }
]);