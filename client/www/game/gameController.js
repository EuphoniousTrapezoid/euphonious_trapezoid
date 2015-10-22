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

      socket.emit('insert', {coordinates: position2d, state:player.playerNum }, function () {
        console.log('emitted: ', {coordinates: position2d, state:player.playerNum });
      });
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

  socket.on('put', function (data) {
    console.log('got some put data: ', data);    
    if (data.success) {
      game.addPiece(data);
    } else {
      console.log('data.success === false');
    }
  });

  socket.on('removed', function (data) {
    if (data.success) {
      game.removePiece(data);
    } else {
      console.log('removed data.error === true');
    }
  });

  socket.on('moved', function (data) {
    if (data.success) {
      game.movePiece(data);
    } else {
      console.log('removed data.error === true');
    }
  });

  socket.on('rotated', function (data) {
    game.rotateBoard(data);
  });

  socket.on('ended', function (data) {
    game.endGame(data);
    console.log('Game has ended.');
  });

}]);
