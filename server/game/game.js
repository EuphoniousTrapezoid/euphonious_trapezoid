var Node = require('./node.js');
var insertNode = require('./insertNode.js');
var adjustValence = require('./adjustValence.js');


var Game = function ( ) {

	this.board = {

		'0:0': new Node('A', 0, true),
		'0:1': new Node('L', 1),
		'0:-1': new Node('L', 1),
		'1:0': new Node('L', 1),
		'-1:0': new Node('L', 1)

	};

	this.leaves = [4];

	this.maximumValence = 0;

	this.minimumValence = 0;

}

Game.prototype.insert = insertNode;

Game.prototype.adjustValence = adjustValence;

module.exports = Game;