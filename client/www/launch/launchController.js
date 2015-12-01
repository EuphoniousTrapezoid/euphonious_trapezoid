sphero.controller('launchController', ['$scope', '$state', 'player', 'socket', 'Auth', function($scope, $state, player, socket, Auth) {

  $scope.activeUsers = {};
  $scope.activeGame = null;
  $scope.showUsers = false;

  $scope.profile = player.profile;


  $scope.back = function() {
    $state.go('nav');
  }

  $scope.logout = function() {
    Auth.destroyCredentials();
    angular.element(document.querySelector('#gameModes')).addClass('fadeOut');
    setTimeout(function () {
      $state.go('nav');
    },250);
  };

  $scope.single = function() {
    $state.go('profile.loading', {
      action: 'single'
    });
  };

  $scope.join = function(numPlayers) {
    $state.go('profile.loading', { action: 'join', numPlayers: numPlayers });
  };


  $scope.rules = function () {
    angular.element(document.querySelector('#gameModes')).addClass('fadeOut');
    setTimeout(function() {

      $state.go('rules');
    },250);
  }

// from host controller

  $scope.toggleShowUsers = function() {
    socket.emit('checkForUsers');
    $scope.showUsers = !$scope.showUsers;

  }

  $scope.invite = function(username) {
    if ($scope.activeUsers[username]) {
      console.log("active game is at ", $scope.activeGame);
      socket.emit('invite', {
        socketID: $scope.activeUsers[username].socketID,
        gameID: $scope.activeGame,
        host: player.profile.userName
      });

    }
  };


  socket.on('updateUsers', function(data) {
    $scope.activeUsers = {};
    for (var socket in data) {

      if (data[socket].profile && data[socket].profile.userName !== 'anonymous') {
        $scope.activeUsers[data[socket].profile.userName] = {
          name: data[socket].profile.userName,
          joined: data[socket].joined,
          socketID: socket
        };
      }
    }
    console.log($scope.activeUsers);
  });

  $scope.$on('$ionicView.enter', function () {
    angular.element(document.querySelector('#gameModes')).removeClass('fadeOut');
    socket.emit('grabProfile', player.profile);
    socket.emit('checkForUsers');
    socket.emit('privateGame', player.profile);
  });

}]);
