var parse = function(coordinates) {
	
	return coordinates.split(':').map(function(string) {
		return +string;
	});

};

module.exports = parse;