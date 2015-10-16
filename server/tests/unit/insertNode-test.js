var chai = require( '../../node_modules/chai/chai.js' );
// var assert = chai.assert;
var expect = chai.expect;
// var sinon = require( '../../node_modules/sinon/pkg/sinon.js' );
var Game = require('../../game/game.js');

describe( 'insertNode function on game object', function( ) { // A standard describe block
  var game = new Game();

  it( 'should not insert into 0:0', function( ) {

    expect( game.insert('0:0', '0') ).to.be.false;

    expect( game.board['0:0'].state ).to.equal( 'A' );

  });

  it( 'should not insert into 5:5', function( ) {

    expect( game.insert('5:5','0') ).to.be.false;
    expect( game.board[ '5:5' ] ).to.be.undefined;

  });

  it( 'should insert into "1:0"', function( ) {
    // Here's where the assertions go.
    game.insert('1:0', '0');

    expect(game.board['1:0'].state).to.equal('0');
    expect(game.board['1:0'].leafy).to.be.true;
    expect(game.leaves).to.deep.equal([3, 1]);
    expect(game.minimumValence).to.equal(0);
    expect(game.maximumValence).to.equal(1);
    expect(game.board['0:0'].state).to.equal('A');
    expect(game.board['1:1'].state).to.equal('L');
    expect(game.board['2:0'].state).to.equal('L');
    expect(game.board['1:-1'].state).to.equal('L');

  });

  it( 'should insert into "0:1"', function( ) {

    game.insert('0:1', '0');

    expect(game.board['0:1'].state).to.equal('0');
    expect(game.board['0:1'].leafy).to.be.true;
    // expect(game.board['1:1'].leafy).to.be.true
    expect(game.leaves).to.deep.equal([2, 2]);
    expect(game.minimumValence).to.equal(0);
    expect(game.maximumValence).to.equal(1);
    expect(game.board['0:0'].state).to.equal('A');
    expect(game.board['0:2'].state).to.equal('L');
    expect(game.board['1:1'].state).to.equal('L');
    expect(game.board['-1:1'].state).to.equal('L');

  });

  it( 'should insert into "1:1"', function( ) {

    game.insert('1:1', '1');

    expect(game.board['1:1'].state).to.equal('1');
    expect(game.board['1:1'].leafy).to.be.true;
    expect(game.board['1:0'].leafy).to.be.false;
    expect(game.board['0:1'].leafy).to.be.false;
    expect(game.leaves).to.deep.equal([2, 0, 1]);
    expect(game.minimumValence).to.equal(0);
    expect(game.maximumValence).to.equal(2);
    expect(game.board['0:1'].state).to.equal('0');
    expect(game.board['1:0'].state).to.equal('0');
    expect(game.board['2:1'].state).to.equal('L');
    expect(game.board['1:2'].state).to.equal('L');

  });

  it( 'should insert into "1:2"', function( ) {

    game.insert('1:2', '0');

    expect(game.board['1:2'].state).to.equal('0');
    expect(game.board['1:2'].leafy).to.be.true;
    expect(game.board['1:1'].leafy).to.be.false;
    expect(game.leaves).to.deep.equal([2, 0, 0, 1]);
    expect(game.minimumValence).to.equal(0);
    expect(game.maximumValence).to.equal(3);
    expect(game.board['1:1'].state).to.equal('1');
    expect(game.board['0:2'].state).to.equal('L');
    expect(game.board['1:3'].state).to.equal('L');
    expect(game.board['2:2'].state).to.equal('L');

  });

  it( 'should insert into "-1:0", "0:-1", "2:2"', function( ) {

    game.insert('-1:0', '1');
    game.insert('0:-1', '2');
    game.insert('2:2', '1')

    expect(game.board['-1:0'].state).to.equal('1');
    expect(game.board['-1:0'].leafy).to.be.true;
    expect(game.board['0:-1'].state).to.equal('2');
    expect(game.board['0:-1'].leafy).to.be.true;
    expect(game.board['2:2'].state).to.equal('1');
    expect(game.board['2:2'].leafy).to.be.true;
    expect(game.board['1:2'].leafy).to.be.false;
    expect(game.leaves).to.deep.equal([0, 2, 0, 0, 1]);
    expect(game.minimumValence).to.equal(1);
    expect(game.maximumValence).to.equal(4);
    expect(game.board['0:0'].state).to.equal('A');
    expect(game.board['-2:0'].state).to.equal('L');
    expect(game.board['-1:-1'].state).to.equal('L');
    expect(game.board['-1:1'].state).to.equal('L');
    expect(game.board['0:-2'].state).to.equal('L');
    expect(game.board['1:-1'].state).to.equal('L');
    expect(game.board['1:2'].state).to.equal('0');
    expect(game.board['2:3'].state).to.equal('L');
    expect(game.board['3:2'].state).to.equal('L');
    expect(game.board['2:1'].state).to.equal('L');

  });

  it( 'should insert into "2:1"', function( ) {

    game.insert('2:1', '2');

    expect(game.board['2:1'].state).to.equal('2');
    expect(game.board['2:1'].leafy).to.be.false;
    expect(game.board['2:2'].leafy).to.be.true;
    expect(game.leaves).to.deep.equal([0, 2, 0, 0, 1]);
    expect(game.minimumValence).to.equal(1);
    expect(game.maximumValence).to.equal(4);
    expect(game.board['1:1'].state).to.equal('1');
    expect(game.board['2:0'].state).to.equal('L');
    expect(game.board['2:2'].state).to.equal('1');
    expect(game.board['3:1'].state).to.equal('L');

  });

  it( 'should adjust valence recursively', function( ) {

    game = new Game( );

    // expect( game.insert('0:1', '1') ).to.be.true;
    // expect( game.insert('-1:0', '3') ).to.be.true;
    // expect( game.insert('0:-1', '3') ).to.be.true;
    // expect( game.insert('1:0', '3') ).to.be.true;
    // expect( game.insert('-2:0', '1') ).to.be.true;
    // expect( game.insert('-3:0', '2') ).to.be.true;
    // expect( game.insert('0:-2', '1') ).to.be.true;
    // expect( game.insert('0:-3', '2') ).to.be.true;
    // expect( game.insert('2:0', '1') ).to.be.true;
    // expect( game.insert('3:0', '2') ).to.be.true;
    // expect( game.leaves ).to.deep.equal( [0, 1, 0, 3] );
    // game.insert('0:2', '2');
    // game.insert('0:3', '3');
    // game.insert('-1:-3', '1');
    // game.insert('-2:-3', '2');
    // game.insert('-2:-4', '3');
    // game.insert('-1:-3', '1');
    // game.insert('-1:-4', '3');
    // game.insert('-2:-4', '1');
    // game.insert('3:-1', '1');
    // game.insert('4:-1', '3');
    // game.insert('4:-2', '2');
    // game.insert('0:4', '2');
    // game.insert('1:4', '1' );
    // game.insert('2:4', '3');
    // game.insert('2:3', '2');
    // game.insert('2:2', '1');
    // game.insert('1:2', '3');

    // expect( game.leaves ).to.deep.equal( [0, 0, 0, 0, 0, 0, 4] );
    // expect( game.minimumValence ).to.equal( 6 );
    // expect( game.maximumValence ).to.equal( 6 );
    // expect( game.board[ '1:2' ].valence ).to.equal( 3 );
    // expect( game.board[ '2:2' ].valence ).to.equal( 4 );
    // expect( game.board[ '2:3' ].valence ).to.equal( 5 );
    // expect( game.board[ '2:4' ].valence ).to.equal( 6 );
    // expect( game.board[ '1:3' ].valence ).to.equal( 4 );

    expect( game.insert('0:1', '1') ).to.be.true;
    expect( game.insert('-1:0', '3') ).to.be.true;
    expect( game.insert('0:-1', '3') ).to.be.true;
    expect( game.insert('1:0', '3') ).to.be.true;
    expect( game.insert('-2:0', '1') ).to.be.true;
    expect( game.insert('-3:0', '2') ).to.be.true;
    expect( game.insert('0:-2', '1') ).to.be.true;
    expect( game.insert('0:-3', '2') ).to.be.true;
    expect( game.insert('2:0', '1') ).to.be.true;
    expect( game.insert('3:0', '2') ).to.be.true;
    expect( game.insert('0:2', '2') ).to.be.true;
    expect( game.insert('0:3', '3') ).to.be.true;
    expect( game.insert('-3:-1', '1') ).to.be.true;
    expect( game.insert('-3:-2', '2') ).to.be.true;
    expect( game.insert('-4:-2', '3') ).to.be.true;
    expect( game.insert('-1:-3', '1') ).to.be.true;
    expect( game.insert('-1:-4', '3') ).to.be.true;
    expect( game.insert('-2:-4', '1') ).to.be.true;
    expect( game.insert('3:-1', '1') ).to.be.true;
    expect( game.insert('4:-1', '3') ).to.be.true;
    expect( game.insert('4:-2', '2') ).to.be.true;
    expect( game.insert('0:4', '2') ).to.be.true;
    expect( game.insert('1:4', '1' ) ).to.be.true;
    expect( game.insert('2:4', '3') ).to.be.true;
    expect( game.insert('2:3', '2') ).to.be.true;
    expect( game.insert('2:2', '1') ).to.be.true;
    expect( game.insert('1:2', '3') ).to.be.true;

    expect( game.leaves ).to.deep.equal( [0, 0, 0, 0, 0, 0, 4] );
    expect( game.minimumValence ).to.equal( 6 );
    expect( game.maximumValence ).to.equal( 6 );
    expect( game.board[ '1:2' ].valence ).to.equal( 3 );
    expect( game.board[ '2:2' ].valence ).to.equal( 4 );
    expect( game.board[ '2:3' ].valence ).to.equal( 5 );
    expect( game.board[ '2:4' ].valence ).to.equal( 6 );
    expect( game.board[ '1:3' ].valence ).to.equal( 4 );

  });

});