<<<<<<< HEAD
sphero.controller('gameController', ['$scope', '$state', 'game', 'socket', 'player', 'Auth', '$ionicPopup', function($scope, $state, game, socket, player, Auth, $ionicPopup) {

  element = document.getElementById("game");

  var gameEnded = false;
  // var lastTimePlayed = Date.now();

  game.playerInfo.playerNum = String(player.playerNum);
  game.playerInfo.currentTurn = "0"; 
  
  console.log('game.playerInfo.playerNum: ', game.playerInfo.playerNum);

  game.init(element, 16);
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

  checkQueue();

  window.addEventListener('resize', function() {
    game.setSize();
  });

  document.getElementById("game").addEventListener('mousedown', function (mouseDownEvent) {
    var coordinates = game.getPosition( mouseDownEvent.clientX, mouseDownEvent.clientY );
    var sending = {coordinates: coordinates, state: game.playerInfo.playerNum };

    // if (!gameEnded && Date.now() > lastTimePlayed - 500) {
    //   lastTimePlayed = Date.now();
      socket.emit('insert', {
        coordinates: coordinates,
        state: game.playerInfo.playerNum
      });
    // }
  }, false);

// listener for testing solo games, remove in production
  window.addEventListener('keydown', function (keyDownEvent) {
    console.log("keyDownEvent.keyCode: ", keyDownEvent.keyCode)
    if (keyDownEvent.keyCode === 16) {
      game.playerInfo.playerNum = game.playerInfo.playerNum === "0" ? game.playerInfo.playerNum = "1" : game.playerInfo.playerNum = "0" ;
      console.log(game.playerInfo.playerNum);
    }
  });

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
    game.playerInfo.currentTurn = data.players[0];
    
    // do the turn change
    // either with just color or oscillation
    game.showTurnChange( data.duration );  
 

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
||||||| merged common ancestors
=======
sphero.controller('gameController', ['$scope', '$state', 'game', 'socket', 'player', 'Auth', '$ionicPopup', function($scope, $state, game, socket, player, Auth, $ionicPopup) {
  element = document.getElementById("game");

  // var lastTimePlayed = Date.now();

  game.gameInfo.playerNum = String(player.playerNum);
  game.gameInfo.currentTurn = "0";
  game.gameInfo.maxValence = 8;
  game.init(element, (game.gameInfo.maxValence * 2) + 1); // second arg should be equal (max valence * 2) + 1, server should ideally send maxValence


  var gameEnded = false;
  var eventQueue = [];
  var ms = Math.pow(10, -3);
  var k = Math.pow(10, 3);
  var animationTime = 125 * ms;
  var lastScheduledAnimation = game.context.currentTime;
  var scheduleWindowTime = 75 * ms;
  var rescheduleTime = 25 * ms;
  var turnCounter = 0;
  var checkQueue = function() {
    if( !gameEnded ) {
      d3.timer(checkQueue, rescheduleTime * k);
    }
    var startTime = game.context.currentTime;
    while (lastScheduledAnimation + animationTime < startTime + scheduleWindowTime) {
      var queued = eventQueue.shift();
      var delay = (lastScheduledAnimation + animationTime - game.context.currentTime) * k;
      if (queued && queued.event !== 'state' && queued.event !== 'suspended') {
        d3.timer(game.animate[queued.event].bind(null, queued.data), delay);
        game.musical[queued.event](queued.data, lastScheduledAnimation + animationTime);
      } else {
        if (queued) {
          if (queued.event === 'state') {
            d3.timer(game.updateBoard.bind(null, queued.data), delay);
          } else if (queued.event === 'suspended') {
            d3.timer(game.animate[queued.event].bind(null, queued.data), delay);
          }
        }
        game.musical.sequence(lastScheduledAnimation + animationTime);
        d3.timer(game.animate.sequence, delay);
      }
      if (turnCounter % 6 === 0 || turnCounter % 8 === 0 ) {
        game.musical.indicator(lastScheduledAnimation + animationTime);
        d3.timer(game.animate.indicator, delay);
      }
      lastScheduledAnimation += animationTime;
      turnCounter++;
    }
    return true;
  };
  // put, fell, removed have a valence property [MIN, MAX]
  checkQueue();
  var actionListeners = {};
  actionListeners.put = function( data ) {
    if( data.success ) {
      eventQueue.push({
        event: 'put',
        data: data
      });
    } else {
      game.musical.put( data, game.context.currentTime );
      game.animate.put( data );
    }
  };
  var events = [ 'removed', 'moved', 'suspended', 'rotated', 'fell', 'state' ];
  events.forEach( function( event ) {
    actionListeners[ event ] = function( data ) {
      eventQueue.push({
        event: event,
        data: data
      });
    };
  });
  actionListeners.turnEnded = function( data ) {
    game.gameInfo.currentTurn = data.players[ 0 ];
    game.showTurnChange( data.players, data.duration );
  };
  actionListeners.leaveGame = function( ) {
    gameEnded = true;
    game.end( );
    var events = [ 'put', 'removed', 'moved', 'fell', 'suspended', 'rotated', 'state', 'turnEnded', 'ended', 'leaveGame' ];
    events.forEach( function( event ) {
      socket.removeListener( event, actionListeners[ event ] );
    });
    // if( game.gameInfo.isSingle ) {
    //   document.getElementById( 'indicator' ).removeEventListener( 'click', indicatorListener );
    // }
    //document.getElementById( 'game' ).removeEventListener( 'mousedown', gameMousedownListener );
    window.removeEventListener('resize', resizeListener);

  };
  actionListeners.ended = function(data) {
    gameEnded = true;
    // Game.end releases all of the audio resources.
    game.end( );
    // Remove all listeners related to this specific
    // instance of the game.
    var events = [ 'put', 'removed', 'moved', 'fell', 'suspended', 'rotated', 'state', 'turnEnded', 'ended', 'leaveGame' ];
    events.forEach( function( event ) {
      socket.removeListener( event, actionListeners[ event ] );
    });
    if( game.gameInfo.isSingle ) {
      document.getElementById('indicator').removeEventListener( 'click', indicatorListener );
    }
    document.getElementById( 'game' ).removeEventListener( 'mousedown', gameMousedownListener );
    window.removeEventListener('resize', resizeListener );
    $scope.showPopup(data);
  };
  events = [ 'put', 'removed', 'moved', 'fell', 'suspended', 'rotated', 'state', 'turnEnded', 'ended', 'leaveGame' ];
  events.forEach( function( event ) {
    socket.on( event, actionListeners[ event ] );
  });
  var resizeListener = function( ) {
    game.setSize( );
  };
  window.addEventListener('resize', resizeListener );
  if (game.gameInfo.isSingle) {
    var indicatorListener = function( ) {
      if( Number( game.gameInfo.currentTurn ) < 3 ) {
        game.gameInfo.currentTurn = String( Number( game.gameInfo.currentTurn ) + 1 );
        game.gameInfo.playerNum = String( Number( game.gameInfo.playerNum ) + 1 );
      } else {
        game.gameInfo.currentTurn = '0';
        game.gameInfo.playerNum = '0';
      }
      game.showTurnChange( );
    };
    document.getElementById('indicator').addEventListener('click', indicatorListener );
  }
  var gameMousedownListener = function( mouseDownEvent ) {
    var coordinates = game.getPosition( mouseDownEvent.clientX, mouseDownEvent.clientY );
    if( !( coordinates.x === 0 && coordinates.y === 0 ) ) {
      socket.emit( 'insert', {
        coordinates: coordinates,
        state: game.gameInfo.playerNum
      });
    }
  };
  document.getElementById('game').addEventListener( 'mousedown', gameMousedownListener );

  socket.on('turnEnded', function(data) {
    // data === {duration: DUR, players: [0,1,2,3] }
    game.gameInfo.currentTurn = data.players[0];

    // do the turn change
    // either with just color or oscillation
    game.showTurnChange(data.players, data.duration);


  })

  $scope.updateProfile = function() {
    player.profile.gamesPlayed += 1;

    var oldRank = player.profile.ranking;
    var newRank = player.profile.ranking;

    if (Object.keys($scope.placeObj).length === 2) {
      if ($scope.place === 0) {
        newRank = newRank + 100;
      } else {
        newRank = newRank - 100;
      }
    } else if (Object.keys($scope.placeObj).length === 3) {
      if ($scope.place === 0) {
        newRank = newRank + 100;
      } else if ($scope.place === 2) {
        newRank = newRank - 100;
      }
    } else if (Object.keys($scope.placeObj).length === 4) {
      if ($scope.place === 0) {
        newRank = newRank + 100;
      } else if ($scope.place === 1) {
        newRank = newRank + 25;
      } else if ($scope.place === 2) {
        newRank = newRank - 25;
      } else if ($scope.place === 3) {
        newRank = newRank - 100;
      }
    }
    newRank = Math.floor((oldRank + newRank) / 2);
    player.profile.ranking = newRank;

    Auth.updateProfile(player.profile)
      .then(function(results) {
        console.log("Results are", results);

      });
  };

  $scope.showPopup = function(playersArray, addFriendFunc) {
    $scope.endGameArray = []; // an array of the player usernames in order of current game performance
    $scope.me = null;
    $scope.dupObj = {};
    $scope.place = null;
    $scope.placeObj = {
      '0': '1st',
      '1': '2nd',
      '2': '3rd',
      '3': '4th'
    };
    // an array with players profiles in order of their rank for current game
    for (var i = 0; i < playersArray.length; i++) {
      if (playersArray[i]) {
        if (playersArray[i].userName !== player.profile.userName && playersArray[i].userName !== 'anonymous'/*!$scope.dupObj[playersArray[i].userName]*/ ) {
          $scope.endGameArray.push(playersArray[i].userName);
        }
        if (playersArray[i].userName === player.profile.userName) {
          $scope.me = playersArray[i];
          $scope.place = i;
        }
      }
    }
    $scope.updateProfile();
    console.log('endGameArray ============', $scope.endGameArray);
    // //allow player to friend other players
    $scope.friend = function(otherPlayer) {
      Auth.addFriend(otherPlayer, player.profile.id);
    };

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
      if (player.profile.userName === 'anonymous') {
        Auth.destroyCredentials();
      }
      $state.go('nav');
    });
  };

}]);
>>>>>>> fb5e2d189055f8bdf5038afed62cfaa4d949af8c
