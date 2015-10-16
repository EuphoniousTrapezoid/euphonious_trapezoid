var chai = require( '../../node_modules/chai/chai.js' );
var assert = chai.assert;
var expect = chai.expect;
// var sinon = require( '../../node_modules/sinon/pkg/sinon.js' );

var Node = require('../../game/node.js' );

describe( 'Graph board node', function( ) { // A standard describe block
  var anchor = new Node('A', 0, true);
  var blueNode = new Node('0', 1);

  it( 'should have a state property', function( ) {
    // Here's where the assertions go.

    expect(anchor.state).to.be.a('string');
    expect(anchor.state).to.equal('A')

    expect(blueNode.state).to.be.a('string');
    expect(blueNode.state).to.equal('0');
  });
  it( 'should have an leafy property', function ( ) {

    expect(anchor.leafy).to.be.a('boolean');
    expect(anchor.leafy).to.be.true;

    expect(blueNode.leafy).to.be.false;

  });
  it( 'should have a valence property', function ( ) {

    expect(anchor.valence).to.equal(0);
    expect(blueNode.valence).to.equal(1);

  })
});