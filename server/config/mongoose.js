const mongoose = require('mongoose');
const userModel = require('../models/User');
const changeModel = require('../models/Change');
const projectModel = require('../models/Project');
const taskModel = require('../models/Task');
const filesModel = require('../models/File');

/*eslint no-console: 0*/
module.exports = function(config) {
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('Technical Services db opened');
  });
}
