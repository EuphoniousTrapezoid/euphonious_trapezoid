var Node = function(state, valence, leafy) {

	this.states = {

		'A': true,
		'L': true,
		'0': true,
		'1': true,
		'2': true,
		'3': true

	}
	if (!this.states[state]) {

    console.error("Node state must be 'A', 'L', '0', '1', '2', or '3'.");

	} else {
		this._state = state;
	}
	
  this.valence = valence;

	this.leafy = leafy || false;

}

Object.defineProperty(Node.prototype, "state", {
  get: function() { return this._state },
  set: function(state) { 

    if (!this.states[state]) {

      console.error("Node state must be 'A', 'L', '0', '1', '2', or '3'.");

    } else {

      this._state = state;

    }

  }
});

module.exports = Node;