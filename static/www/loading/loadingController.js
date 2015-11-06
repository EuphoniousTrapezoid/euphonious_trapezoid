<<<<<<< HEAD
sphero.controller('loadingController', ['$scope', '$state', '$stateParams', 'socket', 'player', 
  function($scope, $state, $stateParams, socket, player) {

  	var action = $stateParams.action;

    if (action === 'single') {
      socket.emit('single', player.profile);
    } else if (action === 'join') {
      socket.emit('join', player.profile);
    } else if (action === 'host') {
      socket.emit('host', player.profile);
    }

    $scope.profile = player.profile;
    console.log($scope.profile);

    socket.on('started', function(data) {
      player.playerNum = String(data.playerNum);
      $state.go('profile.game');
    });

}]);
||||||| merged common ancestors
=======
sphero.controller('loadingController', ['$scope', '$state', '$stateParams', 'socket', 'player', 'game',
  function($scope, $state, $stateParams, socket, player, game) {


  	var action = $stateParams.action;
    if (action === null) {
      $state.go('nav');
    } else if (action === 'single') {
      socket.emit('single', player.profile);
      game.gameInfo.isSingle = true;
    } else {
      game.gameInfo.isSingle = false;
      if (action === 'join') {
        socket.emit('join', player.profile);
      } else if (action === 'host') {
        socket.emit('host', player.profile);
      } else if (action === 'joinPrivate') {
        console.log($stateParams.gameID);
        socket.emit('joinPrivate', { profile: player.profile, gameID: $stateParams.gameID });
      }
    }

    socket.on('started', function(data) {
      player.playerNum = String(data.playerNum);
      $state.go('profile.game');
    });

}]);
>>>>>>> fb5e2d189055f8bdf5038afed62cfaa4d949af8c
