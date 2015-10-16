var chai = require( '../../node_modules/chai/chai.js' );
// var assert = chai.assert;
var expect = chai.expect;
// var sinon = require( '../../node_modules/sinon/pkg/sinon.js' );
var parse = require('../../game/parse.js');

describe( 'parse', function( ) { // A standard describe block

  it( 'should parse an "x:y" string pair', function( ) {
    // Here's where the assertions go.
    expect(parse('0:0')).to.be.deep.equal([0,0]);
    expect(parse('-1:1')).to.be.deep.equal([-1,1]);
    expect(parse('20:3')).to.be.deep.equal([20,3]);
    expect(parse('-5:-5')).to.be.deep.equal([-5,-5]);
  });
});