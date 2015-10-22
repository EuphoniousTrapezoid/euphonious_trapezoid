// hook into core game logic
var Game = require('../game/game.js');

var gameQueue = [];

var host = function(io) {
  // Create a unique Socket.IO Room
  var gameId = (Math.random() * 100000) || 0;
  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  // socket.emit('newGameCreated', {
  //   gameId: thisGameId,
  //   mySocketId: socket.id
  // });

  
  // Join the Room and wait for the players
  this.join(gameId.toString());
  gameQueue.push(gameId.toString());
  console.log('THE GAME QUEUE IS CURRENTLY!!! ' + gameQueue);
};

var join = function(io) {

  
    if (gameQueue[0]) { 
      this.join(gameQueue[0])
      console.log("gameQueue AFTER JOIN IS " + gameQueue);
      console.log("I THINK THIS IS AN OBJECT " + Object.keys(io.nsps['/'].adapter.rooms[gameQueue[0]]));
      if(Object.keys(io.nsps['/'].adapter.rooms[gameQueue[0]]).length === 2) {
        startGame(gameQueue.shift(), io);
      }

    } else { 
      host.call(this);
    }

};

var startGame = function(gameId, io) {

  var sockets = Object.keys(io.nsps['/'].adapter.rooms[gameId]).map(function(socketId) {
    return io.sockets.connected[socketId];
  });

  var game = new Game();
  console.log("GAME MADE - IT IS " + game);
  for (var i = 0; i < sockets.length; i++) {

    var socket = sockets[i];
    socket.on('insert', function(event) {
      game.insert(event);
    });

    socket.emit('started', {playerNum: i})

  }

  var events = ['put', 'removed', 'moved', 'rotated', 'ended'];

  for (i = 0; i < events.length; i++) {

    game.on(events[i], function(event) {
      console.log('this is the name of the event', events[i]);
      io.to(gameId).emit(events[i], event);

    });

  }

  game.on('ended', function() {

    delete game;

  });



  console.log("ALL LISTENERS ATTACHED");
};

module.exports.init = function(io, socket) {
  //socket.emit('connected', can emit when connected to game)

  //Game Events ==========

  //host events
  socket.on('host', host.bind(socket, io));

  socket.on('join', join.bind(socket, io));

  //other events
};



//Host Methods

