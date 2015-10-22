sphero.controller('launchController', ['$scope', '$state', 'socket','player', function($scope, $state, socket, player) {

	$scope.join = function() {
    	console.log('joined');
		socket.emit('join');

	}

	$scope.host = function() {
    	console.log('hosting');
		socket.emit('host');

	}

  socket.on('started', function(data) {
    player.playerNum = String(data.playerNum);
    $state.go('game');
  });

}]);