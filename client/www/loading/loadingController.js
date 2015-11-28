sphero.controller('loadingController', ['$scope', '$state', '$stateParams', 'socket', 'player', 'game',
  function($scope, $state, $stateParams, socket, player, game) {


  	var action = $stateParams.action;
    var numPlayers = $stateParams.numPlayers;

    if (action === null) {
      $state.go('nav');
    } else if (action === 'single') {
      socket.emit('single', player.profile);
      game.gameInfo.isSingle = true;
      $scope.isSingle = true;
    } else {
      game.gameInfo.isSingle = false;
      $scope.isSingle = false;
      if (action === 'join') {
        socket.emit('join', {profile: player.profile, numPlayers:numPlayers});
      } else if (action === 'host') {
        socket.emit('host', {profile: player.profile, numPlayers:numPlayers});
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
