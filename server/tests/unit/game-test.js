var chai = require( '../../node_modules/chai/chai.js' );
// var assert = chai.assert;
var expect = chai.expect;
// var sinon = require( '../../node_modules/sinon/pkg/sinon.js' );

var Game = require( '../../game/game.js' );
var Node = require( '../../game/node.js' );

describe( 'A game board', function( ) { // A standard describe block
  var game = new Game();
  it( 'should have a leaves property', function( ) {
    // Here's where the assertions go.
    expect(game.leaves).to.be.an('array');
    expect(game.leaves[0]).to.equal(4);
  });
  it( 'should have a maximumValence property', function ( ) {

    expect(game.maximumValence).to.be.a('number');
    expect(game.maximumValence).to.equal(0);
  });
  it( 'should have a minimumValence property', function ( ) {

    expect(game.minimumValence).to.be.a('number');
    expect(game.minimumValence).to.equal(0);
  });
  it( 'should have a board property', function ( ) {

    expect(game.board).to.be.an('object');
    expect(game.board['0:0']).to.be.an.instanceOf(Node);
  });
});