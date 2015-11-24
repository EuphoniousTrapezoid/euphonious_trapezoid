var socketioJwt = require("socketio-jwt");
var Sphero = require('../Sphero/spheroconnection.js');

module.exports = function(io) {

  // io.use(socketioJwt.authorize({
  //   secret: 'flashing kittens love 25% cotton!',
  //   handshake: true
  // }));

  io.on('connection', function(socket) {
    
    Sphero.init(io, socket);

  });

};
