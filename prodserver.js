const express = require("express");
const path = require("path");
const config = require("./server/config/config");
require("./server/config/auth");
const mongoose = require("./server/config/mongoose");
const expressfile = require("./server/config/express");

const mailer = require("./server/config/mailer");
const utils = require("./server/config/utils");
// import environmental variables from our variables.env file
// require('dotenv').config({ path: '../variables.env' });

process.env.PORT = config.port;

const app = express();

expressfile(app, config);
app.use(express.static(path.join(__dirname, "build")));
mongoose(config);
require("./server/config/passport")();

require("./server/routes")(app);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/*eslint no-console: 0*/
app.listen(process.env.PORT, function() {
  console.log("Express server 🌎  listening on port : " + process.env.PORT);
  console.log(
    "env = " + process.env.NODE_ENV + "\nprocess.cwd = " + process.cwd()
  );
  console.log("Ceated by Daniel Poulson (c) 2017");
  console.log(__dirname);
});
