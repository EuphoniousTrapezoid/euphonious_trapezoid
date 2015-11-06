sphero.controller('gameController', ['game', 'socket', 'player', function(game, socket, player) {

  var element = document.getElementById('game');
  
  game.playerNum = String(player.playerNum);

  game.init(element, 2000, 20);

  console.log("game.playerNum: ", player.playerNum);
  window.addEventListener('resize', function() {
    game.resize();
  });

  // game.addPiece({coordinates: {x: 3, y: 2}, state: player.playerNum});
  // game.addPiece({coordinates: {x: 0, y: -1}, state: player.playerNum});


  window.addEventListener('mousedown', function (mouseDownEvent) {
    var pos = game.getGridPosition(mouseDownEvent, function (position2d) {
      if (!gameEnded) {
        socket.emit('insert', {coordinates: position2d, state:player.playerNum }, function () {
          console.log('emitted: ', {coordinates: position2d, state:player.playerNum });
        });
      };
    });

    // game.removePiece({coordinates: {x: 0, y: 0}, state:'A', success:true})
    //testing
    // console.log("pos, player.playerNum: ", pos, player.playerNum);
    // game.rotateBoard([
    //   {from: {x: 3, y: 2}, to: {x: 2, y:-3}, state: player.playerNum, success:true},
    //   {from: {x: 0, y: -1}, to: {x: -1, y:0}, state: player.playerNum, success:true}
    // ]);
//    game.movePiece({from: {x: pos.x, y: pos.y}, to: {x: 1, y:1}, state: game.playerNum, success:true});

  }, false);
  var eventQueue = [];
  setInterval(function( ) {
    var queued = eventQueue.shift( );
    if( queued ) {
      if( queued.event === 'put' ) {
        game.addPiece( queued.data );
      } else if( queued.event === 'removed' ) {
        game.removePiece( queued.data );
      } else if( queued.event === 'moved' ) {
        game.movePiece( queued.data );
      } else if( queued.event === 'rotated' ) {
        game.rotateBoard( queued.data );
      } else if( queued.event === 'suspended' ) {
        game.suspendPiece( queued.data );
      } else if( queued.event === 'fell' ) {
        game.dropPiece( queued.data );
      } else if( queued.event === 'state' ) {
        game.updateBoard( queue.data );
      } else if( queue.event === 'ended' ) {
        game.ended( queued.data );
      }
    }
  }, 75);
  socket.on('put', function (data) {
    console.log( 'Put: ', data );
    if (data.success) {
      eventQueue.push({
        event: 'put',
        data: data
      });
    } else {
      console.log('data.success === false');
    }
  });

  socket.on('removed', function (data) {
    console.log( 'Removed: ', data );
    if (data.success) {
      eventQueue.push({
        event: 'removed',
        data: data
      });
    } else {
      console.log('removed data.error === true');
    }
  });

  socket.on('moved', function (data) {
    console.log( 'Moved: ', data );
    if (data.success) {
      eventQueue.push({
        event: 'moved',
        data: data
      });
    } else {
      console.log('removed data.error === true');
    }
  });
  socket.on('suspended', function( data ) {
    if( data.success ) {
      eventQueue.push({
        event: 'suspended',
        data: data
      });
    }
  });
  socket.on( 'fell', function( data ) {
    if( data.success ) {
      eventQueue.push({
        event: 'fell',
        data: data
      });
    }
  });
  socket.on('rotated', function (data) {
    console.log( 'Rotated: ', data );
    eventQueue.push({
      event: 'rotated',
      data: data
    });
  });
  socket.on('state', function (data) {
    console.log( 'updateBoard: ', data);
    eventQueue.push({
      event: 'state',
      data: data
    })
  });
  socket.on('ended', function (data) {
    game.endGame(data);
    console.log('Game has ended.');
  });

}]);
