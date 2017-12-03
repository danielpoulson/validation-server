const mongoose = require('mongoose');
const userModel = require('../models/User');
const projectModel = require('../models/Project');
const validationModel = require('../models/Validation');
const taskModel = require('../models/Task');
const filesModel = require('../models/File');

/*eslint no-console: 0*/
module.exports = function(config) {
	mongoose.Promise = global.Promise;
	
	mongoose.connect(config.db, {
		useMongoClient: true,
		/* other options */
	});
	
	const db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error...'));
	db.once('open', function callback() {
    console.log('The MongoDB instance of the Project Manager db was opened');
  });

};