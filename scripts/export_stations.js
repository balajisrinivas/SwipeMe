var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');

var file = JSON.parse(fs.readFileSync('/Users/bsrinivasan/GitHub/SwipeMe/data/stations.json', 'utf8'));
var desiredColumns = ["NAME", "the_geom", "LINE", "NOTES"];
var desiredIndexes = [];
var columns = file.meta.view.columns;
var data = file.data;
// console.log('cols ' + JSON.stringify(columns, null, 4));
_.each(columns, function(column) {
	if(_.contains(desiredColumns, column.name)) {
		desiredIndexes.push(_.indexOf(columns, column));
	}
});
// console.log('indexes ' + desiredIndexes);
var csv = "name, locLongitude, locLatitude, lines, notes\n";
var counter = 0;
_.each(data, function(station) {
	//console.log('st ' + JSON.stringify(station));
	var name = _s.quote(station[10]);
	var location = station[11];
	location = _s.strRight(location, "POINT (");
	location = _s.strLeft(location, ")");
	var locationArr = _s.words(location);
	var locationLong = locationArr[0];
	var locationLat = locationArr[1];
	console.log('before ' + station[12]);
	var linesArray = _s.words(station[12], '-');
	linesArray = _.filter(linesArray, function(line) { return !_s.contains(line, " ")})
	console.log('filter ' + linesArray);
	var lines = _s.quote(_s.join(',', linesArray));
	console.log('after ' + lines);
	var notes = _s.quote(station[13]);
	csv += _s.join(',', name, locationLong, locationLat, lines, notes, "\n");
	counter += 1;
});

console.log(csv);
console.log('lines ' + counter);
fs.writeFile('/Users/bsrinivasan/GitHub/SwipeMe/data/stations.csv', csv, function(err) {
	if(err) console.err(err);

	console.log('written!');
});
