sphero.controller('navController', ['$scope', '$window', 'Auth', '$state', 'player', '$ionicPopup',
  function($scope, $window, Auth, $state, player, $ionicPopup) {

    $scope.loaded = false;
    $scope.loginStatus = false;
    $scope.logoutStatus = true;
    $scope.logoutStatusButtons = true;
    $scope.playActive = false;
    $scope.loginActive = true;
    $scope.signupActive = false;
    $scope.pushIt = true;

    $scope.single = function() {
      $state.go('loading', { action: 'single' });
    };

    $scope.play = function() {
      $state.go('loading', { action: 'play' });
    }

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

    $scope.showPopup = function() {
      $scope.signupInfo = {};
      var signupPopUp = $ionicPopup.show({
        template: '<form class="list"><label class="item item-input"><input type="text" placeholder="Username" ng-model="signupInfo.username"></label><label class="item item-input"><input type="text" placeholder="Password" ng-model="signupInfo.password"></label><label class="item item-input" id="email"><input type="text" placeholder="Email" ng-model="signupInfo.email"></label></form>',
        title: 'Enter User info',
        scope: $scope,
        buttons: [{
          text: 'Cancel',
          type: 'button-clear',
          onTap: function(e) {
            return false;
          }
        }, {
          text: '<b>Submit</b>',
          type: 'button-clear',
          onTap: function(e) {
            console.log($scope.signupInfo.username);
            if ($scope.signupInfo.username === undefined || $scope.signupInfo.username === null) {
              console.log('none entered');
              //don't allow the user to close unless he enters proper credentials
              e.preventDefault();
            } else {
              return $scope.signupInfo;
            }
          }
        }, ]
      });

      signupPopUp.then(function(playerInfo) {
        signupPopUp.close();
        if (playerInfo) {
          $scope.signUp(playerInfo.username, playerInfo.password, playerInfo.email);
        }
      });
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
      if($scope.loginActive && username && password){
      Auth.login(username, password)
        .then(function(user) {
          if (user) {
            player.profile = user.profile;
            $window.localStorage.setItem('id_token', user.token);
            var isAuth = Auth.checkAuth();
            $scope.logoutStatus = !isAuth;
            $scope.logoutStatusButtons = !isAuth;
            setTimeout(function() {
              $scope.loginStatus = isAuth;
            }, 150);
          } else {
            alert('Invalid login, please login or signup');
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

    $scope.load = function() {
      if ($window.localStorage.getItem('id_token')) {
        Auth.loadAuth($window.localStorage.getItem('id_token'));
        $scope.logoutStatus = false;
        $scope.logoutStatusButtons = false;
        $scope.loginStatus = true;
        $scope.loaded = true;
      } else {
        $scope.loaded = true;
      }
    };
    // will change the above auth check to be server-side later and integrate promises

    $scope.load();


  }
]);
