var chai = require( '../../node_modules/chai/chai.js' );
// var assert = chai.assert;
var expect = chai.expect;
// var sinon = require( '../../node_modules/sinon/pkg/sinon.js' );

var adjacentKeys = require('../../game/adjacentKeys.js');

describe( 'adjacentKeys', function( ) { // A standard describe block

  it( 'should return an array of strings', function( ) {
    // Here's where the assertions go.
    expect(adjacentKeys('0:-1')).to.deep.equal(['0:0', '0:-2', '1:-1', '-1:-1'])
  });
});