sphero.controller('gameController', ['$scope', '$state', 'game', 'socket', 'player', 'Auth', '$ionicPopup', function($scope, $state, game, socket, player, Auth, $ionicPopup) {

  element = document.getElementById("game");

  // var lastTimePlayed = Date.now();

  game.gameInfo.playerNum = String(player.playerNum);
  game.gameInfo.currentTurn = "0"; 
  game.gameInfo.maxValence = 8;
  game.init(element, (game.gameInfo.maxValence * 2) + 1 ); // second arg should be equal (max valence * 2) + 1, server should ideally send maxValence
  var gameEnded = false;
  var eventQueue = [];
  var checkQueue = function () {
    var queued = eventQueue.shift( );
    if( queued ) {
      if( queued.event === 'state' ) {
        setTimeout( checkQueue, game.updateBoard( queued.data ) );
      } else if( queued.event === 'ended' ) {
        game.ended( queued.data );
      } else if ( queued.event === 'put' ) {
        setTimeout( checkQueue, game.put( queued.data ) );
      } else if ( queued.event === 'removed' ) {
        setTimeout( checkQueue, game.removed( queued.data) );
      } else if ( queued.event === 'moved') {
        setTimeout( checkQueue, game.moved( queued.data ) );
      } else if ( queued.event === 'suspended') {
        setTimeout( checkQueue, game.suspended( queued.data ));
      } else if ( queued.event === 'rotated' ) {
        setTimeout( checkQueue, game.rotated( queued.data ));
      } else if ( queued.event === 'fell' ) {
        setTimeout( checkQueue, game.fell( queued.data ));
      }
    } else {
      setTimeout( checkQueue, 0);
    }
  };
// put, fell, removed have a valence property [MIN, MAX]
  checkQueue();

  window.addEventListener('resize', function() {
    game.setSize();
  });
  console.log( 'game.gameInfo.isSingle: ', game.gameInfo.isSingle);

  if ( game.gameInfo.isSingle ) {
    document.getElementById("indicator").addEventListener('click', function (clickEvent) {
      if (Number(game.gameInfo.currentTurn) < 3) {
        game.gameInfo.currentTurn = String( Number(game.gameInfo.currentTurn) + 1 );
        game.gameInfo.playerNum = String( Number(game.gameInfo.playerNum) + 1 );
      } else {
        game.gameInfo.currentTurn = "0";
        game.gameInfo.playerNum = "0";
      }
    
    // do the turn change
    // either with just color or oscillation
      game.showTurnChange(); 
    });
    
  }

  document.getElementById("game").addEventListener('mousedown', function (mouseDownEvent) {
    var coordinates = game.getPosition( mouseDownEvent.clientX, mouseDownEvent.clientY );
    var sending = {coordinates: coordinates, state: game.gameInfo.playerNum };
      if ( !(coordinates.x === 0 && coordinates.y === 0) ) {
        socket.emit('insert', {
          coordinates: coordinates,
          state: game.gameInfo.playerNum
        });
      }
  }, false);

  socket.on('state', function (data) {
    console.log( 'updateBoard: ', data);
    eventQueue.push({
      event: 'state',
      data: data
    });
  });

  socket.on('ended', function(data) {
    gameEnded = true;
    window.removeEventListener('resize');
    window.removeEventListener('keydown');
    $scope.showPopup(data);
  });

  socket.on('put', function (data) {
    eventQueue.push( {
      event: 'put',
      data: data
    });
  });

  socket.on('removed', function (data) {
    eventQueue.push({
      event: 'removed',
      data: data
    });
  });

  socket.on('moved', function (data) {
    eventQueue.push( {
      event: 'moved',
      data: data
    });
  });

  socket.on('suspended', function (data) {
    console.log( data.id + " suspended");
    eventQueue.push( {
      event: 'suspended',
      data: data
    });
  });

  socket.on('rotated', function (data) {
    eventQueue.push( {
      event: 'rotated',
      data: data
    });
  });

  socket.on('fell', function (data) {
    console.log( data.id + " fell");
    eventQueue.push( {
      event: 'fell',
      data: data
    });
  });

  socket.on('turnEnded', function (data) {
    // data === {duration: DUR, players: [0,1,2,3] }
    game.gameInfo.currentTurn = data.players[0];
    
    // do the turn change
    // either with just color or oscillation
    game.showTurnChange( data.players, data.duration );  
 

  })

  $scope.showPopup = function(playersArray, addFriendFunc) {
    $scope.endGameArray = []; // an array of the player usernames in order of current game performance
    console.log('in popup ==============', playersArray, $scope.endGameArray);
    $scope.me = null;
    $scope.dupObj = {};
    $scope.place = null;
    $scope.placeObj = {
      '1': '1st',
      '2': '2nd',
      '3': '3rd',
      '4': '4th'
    };
    $scope.addFriends = addFriendFunc;
    // an array with players profiles in order of their rank for current game
    for (var i = 0; i < playersArray.length; i++) {
      if (playersArray[i]) {
        if (playersArray[i].userName !== player.profile.userName && !$scope.dupObj[playersArray[i].userName]) {
          $scope.endGameArray.push(playersArray[i].userName);
          $scope.dupObj[playersArray[i].userName] = playersArray[i].userName;
        }
        if (playersArray[i].userName === player.profile.userName) {
          $scope.me = playersArray[i];
          $scope.place = i;
        }
      }
    }
    // //allow player to friend other players
    // $scope.friend = function(otherPlayer) {
    //   Auth.addFriend(otherPlayer, player.profile.id);
    // };

    var signupPopUp = $ionicPopup.show({
      templateUrl: '../endgame/endgame.html',
      title: 'Game Stats',
      scope: $scope,
      buttons: [{
        text: 'Exit',
        type: 'button-clear',
        onTap: function(e) {
          return true;
        }
      }]
    });

    signupPopUp.then(function() {
      signupPopUp.close();
      if(player.profile.userName === 'anonymous'){
        Auth.destroyCredentials();
      }
      $state.go('nav');
    });
  };

  // todo later - don't queue up the missed insert events, instead show them right away

}]);
