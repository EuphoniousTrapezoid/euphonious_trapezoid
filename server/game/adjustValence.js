var Node = require( './node.js' );
var adjacentKeys = require( './adjacentKeys.js' );

var adjustValence = function(relativeCoordinates, valence) {

  for ( var i = 0; i < relativeCoordinates.length; i++ ) {
    var sphere = this.board[relativeCoordinates[i]];
    if (!sphere) {
      sphere = this.board[relativeCoordinates[i]] = new Node('L', valence + 1);
    } else {
    
        if (sphere.valence > valence) {

          var sphereSurrounding = adjacentKeys(relativeCoordinates[i]);

          for (var j = 0; j < sphereSurrounding.length; j++) {

            var surroundingSphere = this.board[sphereSurrounding[j]];

            if (surroundingSphere && surroundingSphere.state !== 'L') {
              if (surroundingSphere.valence >= sphere.valence) {
                break;
              }
              if (surroundingSphere.leafy) {
                surroundingSphere.leafy = !surroundingSphere.leafy;
                this.leaves[surroundingSphere.valence] -= 1;

                while (this.leaves[this.leaves.length -1] === 0) {
                  this.leaves.pop();
                }

              }

            }

          }

          if (j === sphereSurrounding.length && sphere.leafy === false && sphere.state !== 'L') {
            sphere.leafy = true;
            this.leaves[sphere.valence] = 
              this.leaves[sphere.valence] || 0;

            this.leaves[sphere.valence] += 1;

          }

          if (sphere.valence > valence + 1) {

            sphere.valence = valence + 1;

            this.adjustValence(
              adjacentKeys(relativeCoordinates[i]),
              sphere.valence
            );
          }

        }

        // if (sphere.valence > valence + 1) {



        //   sphere.valence = valence + 1;
        //   this.adjustValence(
        //     adjacentKeys(relativeCoordinates[i]),
        //     sphere.valence
        //   );
        // }
    }
  }

};

module.exports = adjustValence;