sphero.controller('navController', ['$scope', '$window', 'Auth', '$state', 'player', '$ionicPopup', 'socket',
  function($scope, $window, Auth, $state, player, $ionicPopup, socket) {

    $scope.loaded = false;
    $scope.loginStatus = false;
    $scope.logoutStatus = true;
    $scope.logoutStatusButtons = true;
    $scope.playActive = false;
    $scope.loginActive = true;
    $scope.signupActive = false;
    $scope.pushIt = true;

    $scope.activeUsers = {};
    $scope.activeGame = null;
    $scope.showUsers = false;

    $scope.single = function() {
      $state.go('profile.loading', {
        action: 'single'
      });
    };

    $scope.join = function(numPlayers) {

      $state.go('profile.loading', { action: 'join', numPlayers: numPlayers });

    };

    $scope.rules = function () {
      $state.go('rules');
    }

    $scope.play = function() {
      var anonPlayer = Auth.playAnon();
      Auth.login(anonPlayer.username, anonPlayer.password)
        .then(function(user) {
          if (user) {
            player.profile = user.profile;
            $window.localStorage.setItem('id_token', user.token);
            var isAuth = Auth.checkAuth();
            setTimeout(function() {
              $scope.logoutStatus = !isAuth;
            }, 25);
            $scope.logoutStatusButtons = !isAuth;
            setTimeout(function() {
              $scope.loginStatus = isAuth;
            }, 150);
          } else {
            alert('Invalid login, please login or signup');
          }
        });
    };

    $scope.signUp = function(username, password, email) {
      if ($scope.signupActive === false) {
        $scope.loginActive = false;
        setTimeout(function() {
            $scope.signupActive = true;
          },
          1);
        return null;
      }

      if (username && password && email) {
        console.log("username: ", username, "password: ", password, "email: ", email);
        Auth.signUp(username, password, email)
          .then(function() {
            $scope.pushIt = false;
            $scope.login(username, password);
          }, function(err) {
            console.log(err);
            //handle error
          });
      }
    };


    $scope.login = function(username, password) {
      if (!$scope.loginActive && $scope.pushIt) {
        $scope.signupActive = false;
        setTimeout(function() {
            $scope.loginActive = true;
          },
          1);
        return null;
      }
      console.log(username, password);
      if ($scope.loginActive && username && password) {
        Auth.login(username, password)
          .then(function(user) {
            if (user) {
              player.profile = user.profile;
              $window.localStorage.setItem('id_token', user.token);
              var isAuth = Auth.checkAuth();
              $scope.logoutStatusButtons = !isAuth;
              setTimeout(function() {
                $scope.logoutStatus = !isAuth;
              }, 25);
              setTimeout(function() {
                $scope.loginStatus = isAuth;
              }, 150);
            } else {
              //alert('Invalid login, please login or signup');
            }
          });
      }
    };

    $scope.logout = function() {
      Auth.destroyCredentials();
      $scope.loginStatus = false;
      setTimeout(function() {
        $scope.logoutStatus = true;
        $scope.logoutStatusButtons = true;
      }, 250);
    };


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

  socket.on('started', function(data) {
    console.log("did i get this event?");
    player.playerNum = String(data.playerNum);
    $state.go('profile.game');
  });

  socket.on('hosting', function(data) {
    $scope.activeGame = data;
    console.log("did i receive this event? ", $scope.activeGame);
  });

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

  $scope.init = function() {

    if ($window.localStorage.getItem('id_token')) {
      Auth.loadAuth($window.localStorage.getItem('id_token'));
      $scope.logoutStatus = false;
      $scope.logoutStatusButtons = false;
      $scope.loginStatus = true;
      $scope.loaded = true;
    } else {
      $scope.loaded = true;
    }

    socket.emit('grabProfile', player.profile);

    socket.emit('checkForUsers');
    socket.emit('privateGame', player.profile);
  };

  $scope.init();

  }
]);
