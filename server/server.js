const express = require('express');
const config = require('./config/config');
require('./config/auth');
const mongoose = require('./config/mongoose');
const expressfile = require('./config/express');

const mailer = require('./config/mailer');
const utils = require('./config/utils');
// import environmental variables from our variables.env file
require('dotenv').config({ path: '../variables.env' });

process.env.PORT = config.port;

const app = express();

expressfile(app, config);
mongoose(config);
require('./config/passport')();
// app.use(require('./config/route'));

require('./routes')(app);

app.get('*', function (req, res) {
    //res.render('index');
});

/*eslint no-console: 0*/
app.listen(process.env.PORT, function() {
    console.log('Express server 🌎  listening on port : ' + process.env.PORT);
    console.log('env = ' + process.env.NODE_ENV +
                '\nprocess.cwd = ' + process.cwd());
});
