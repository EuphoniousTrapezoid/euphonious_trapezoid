var parse = require('./parse.js');

var adjacentKeys = function(coordinates) {
	
	if (typeof coordinates === 'string') {
		coordinates = parse(coordinates);
	}

	return [

		coordinates[0] + ':' + (coordinates[1] + 1),
		coordinates[0] + ':' + (coordinates[1] - 1),
		(coordinates[0] + 1) + ':' + coordinates[1],
		(coordinates[0] - 1) + ':' + coordinates[1]

	];

};

module.exports = adjacentKeys;