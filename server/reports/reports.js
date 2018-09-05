const json2csv = require("json2csv");
const config = require('../config/config.js');
const fs = require('fs');

/* eslint-disable no-console */
function printToCSV(data, fields) {

  const opts = { fields };
  const csv = json2csv.parse(data, opts);

  return csv
}

exports.printToCSV = printToCSV;