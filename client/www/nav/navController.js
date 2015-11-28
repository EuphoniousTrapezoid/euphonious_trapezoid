sphero.controller('navController', ['$scope', '$window', 'Auth', '$state', 'player', '$ionicPopup', 'socket',
  function($scope, $window, Auth, $state, player, $ionicPopup, socket) {

    $scope.loginActive = true;
    $scope.signupActive = false;
    $scope.welcomeActive = false;

    $scope.loggedIn = false;

    $scope.signUpMessage = "";

    $scope.play = function() {
      var anonPlayer = Auth.playAnon();
      Auth.login(anonPlayer.username, anonPlayer.password)
        .then(function(user) {
          if (user) {
            player.profile = user.profile;
            $window.localStorage.setItem('id_token', user.token);

            angular.element(document.querySelector('#navStuff')).addClass('fadeOut');
            setTimeout(function() {

              $state.go('profile.launch');
            },500);

          } else {
            alert('Invalid login, please login or signup');
          }
        });
    };

    $scope.signUp = function(username, password, email) {
      if ($scope.signupActive === false) {
        $scope.loginActive = false;
        $scope.welcomeActive = false;
        setTimeout(function() {
            $scope.signupActive = true;
          }, 1);
        return null;
      }

      // else, if $scope.signupActive === true
      if (username && password && email) {
        console.log("username: ", username, "password: ", password, "email: ", email);
        Auth.signUp(username, password, email)
          .then(function (resp) {
            Auth.login(username, password)
              .then(function(user) {
                player.profile = user.profile;
                $window.localStorage.setItem('id_token', user.token);

                $scope.signUpMessage = 'Welcome ' + username;
                $scope.signupActive = false;
                setTimeout(function () {
                  $scope.loggedIn = true;
                  $scope.welcomeActive = true;
                }, 1);
              });

            // $scope.login(username, password);
          }, function(err) {
            console.log(err);
            console.log('an error')
            if(err.data === 'username already taken') {
              $scope.signUpMessage = 'Username ' + username + ' already exists try again'
              $scope.signupActive = false;
              setTimeout(function () {
                $scope.welcomeActive = true;
              }, 1);
            }
          });
      }
    };


    $scope.login = function(username, password) {
      if (!$scope.loginActive) {
        $scope.signupActive = false;
        setTimeout(function() {
            $scope.loginActive = true;
          },
          1);
        return null;
      } else if (window.localStorage.id_token) {
          angular.element(document.querySelector('#navStuff')).addClass('fadeOut');
          console.log('player profile launching: ', player.profile);

          setTimeout(function() {
            $state.go('profile.launch');
          },500);

      } else {
        if (username && password) {
          Auth.login(username, password)
            .then(function(user) {
              if (user) {
                player.profile = user.profile;
                $window.localStorage.setItem('id_token', user.token);
                angular.element(document.querySelector('#navStuff')).addClass('fadeOut');
                setTimeout(function() {
                  $state.go('profile.launch');
                },500);

              } else {
                //alert('Invalid login, please login or signup');
              }
            });
        }
      }

    };

    $scope.logout = function () {
      $scope.welcomeActive = false;
      $scope.loggedIn = false;
      setTimeout(function() {
        $scope.loginActive = true;
      }, 250);
      

      if (window.localStorage.id_token) {
        Auth.destroyCredentials();
      }
    };

    $scope.$on('$ionicView.enter', function () {
      angular.element(document.querySelector('#navStuff')).removeClass('fadeOut');
      $scope.loggedIn = false;
      $scope.loginActive = true;
      $scope.welcomeActive = false;
      if (window.localStorage.id_token) {
        Auth.destroyCredentials();
      }

    });

  }
]);
