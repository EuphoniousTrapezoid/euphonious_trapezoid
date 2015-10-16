var adjacentKeys = require('./adjacentKeys.js');

var insertNode = function(coordinates, state) {

	if ( !this.board[coordinates] || this.board[coordinates].state !== 'L' ) {
		// this.board[coordinates] = new Node(state, valence, leafy);
		return false;
	} else {

    var valence = this.board[coordinates].valence;

    var relativeCoordinates = adjacentKeys(coordinates);

    this.board[coordinates].state = state;
    this.adjustValence(
      relativeCoordinates,
      valence
    );

  for (var i = 0; i < relativeCoordinates.length; i++) {
      var sphere = this.board[relativeCoordinates[i]];
      if (sphere.state !== 'L' ) {
        if (sphere.valence >= valence) {
          break;
        }
        if (sphere.leafy) {
          sphere.leafy = !sphere.leafy;
          this.leaves[sphere.valence] -= 1;
        } else if (sphere.state === 'A') {
          this.leaves[0] -= 1;

          while (this.leaves[this.leaves.length - 1] === 0) {
            this.leaves.pop();
          }
        }

      }
    }

    if (i === relativeCoordinates.length && this.board[coordinates].leafy === false) {
      this.board[coordinates].leafy = true;
      this.leaves[this.board[coordinates].valence] = 
        this.leaves[this.board[coordinates].valence] || 0;

      this.leaves[this.board[coordinates].valence] += 1;

    }

    this.maximumValence = Math.max(this.maximumValence, valence);

    if (this.leaves[this.minimumValence] === 0) {
      for (var i = 0; i < this.leaves.length; i++) {
        if (this.leaves[i] !== 0) { 
          this.minimumValence = i;
          break;
        }
      }
    }

    return true;

  }

}

module.exports = insertNode;