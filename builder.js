var dir = require('node-dir');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

var contents = [];

mkdirp('./build/', function(err){
	console.log('created build folder');
});

dir.readFiles(__dirname, {
		match: /.sol$/
	},
	function(err, content, next) {
		contents.push(content);
		next();
	},
	function(err, files) {
		files.forEach(function(absolutePath, index) {
			var content = contents[index];
			var fileName = path.basename(absolutePath);

			content = content.replace(/(\r\n|\n|\r)/gm," ");

			fs.writeFileSync(path.join(__dirname, './build/' + fileName), content, 'utf-8');
			
		
		});

		console.log('done with build ;)');

	}
);
