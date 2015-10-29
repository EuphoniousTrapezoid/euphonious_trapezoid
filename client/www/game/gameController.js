sphero.controller('gameController', ['game', 'socket', 'player', function(game, socket, player) {

  element = document.getElementById("game");
  
  game.playerNum = String(player.playerNum);

  console.log('game.playerNum: ', game.playerNum);

  game.init(element, 20);

  var eventQueue = [];
  var checkQueue = function () {
    var queued = eventQueue.shift( );
    if( queued ) {
      if( queued.event === 'state' ) {
        game.updateBoard( queued.data );
        setTimeout( checkQueue, 0);
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
      }
    } else {
      setTimeout( checkQueue, 0)
    }
  };

  checkQueue();

  window.addEventListener('resize', function() {
    game.setSize();
  });

  document.getElementById("game").addEventListener('mousedown', function (mouseDownEvent) {
    var coordinates = game.getPosition( mouseDownEvent.clientX, mouseDownEvent.clientY );
    var sending = {coordinates: coordinates, state: game.playerNum };

    socket.emit('insert', {coordinates: coordinates, state: game.playerNum });
  }, false);

// listener for testing solo games, remove in production
  window.addEventListener('keydown', function (keyDownEvent) {
    console.log("keyDownEvent.keyCode: ", keyDownEvent.keyCode)
    if (keyDownEvent.keyCode === 16) {
      game.playerNum = game.playerNum === "0" ? game.playerNum = "1" : game.playerNum = "0" ;
      console.log(game.playerNum);
    }
  });

  socket.on('state', function (data) {
    console.log( 'updateBoard: ', data);
    eventQueue.push({
      event: 'state',
      data: data
    });
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
    eventQueue.push( {
      event: 'suspended',
      data: data
    });
  });

}]);
