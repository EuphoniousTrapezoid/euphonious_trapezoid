// hook into core game logic
var Game = require('../game/game.js');

var gameQueue = [];

var host = function(socket) {
  // Create a unique Socket.IO Room
  var gameId = (Math.random() * 100000) || 0;
  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  // socket.emit('newGameCreated', {
  //   gameId: thisGameId,
  //   mySocketId: socket.id
  // });

  
  // Join the Room and wait for the players
  socket.join(gameId.toString());
  gameQueue.push(gameId);
  console.log('the game queue is ' + gameQueue);
};

var join = function(socket) {

  
    if (gameQueue[0]) { 
      socket.join(gameQueue[0])

      if(io.sockets.clients(gameQueue[0]).length === 4) {
        startGame(gameQueue.shift());
      }

    } else { 
      host(socket);
    }

};

var startGame = function(gameId) {

  var sockets = io.sockets.clients(gameId);
  var game = new Game();

  for (var i = 0; i < sockets.length; i++) {

    var socket = sockets[i];
    socket.on('insert', function(event) {
      game.insert(event);
    });

  }

  var events = ['put', 'removed', 'moved', 'rotated', 'ended'];

  for (i = 0; i < events.length; i++) {

    game.on(events[i], function(event) {

      io.sockets.in(gameId).emit(events[i], event);

    });

  }

  game.on('ended', function() {

    delete game;

  });

  io.sockets.in(gameId).emit('started');

};

module.exports.init = function(io, socket) {
  //socket.emit('connected', can emit when connected to game)

  //Game Events ==========
  
  //host events
  socket.on('host', host);

  socket.on('join', join);

  //other events
};



//Host Methods

