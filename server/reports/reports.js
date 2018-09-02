const Json2csvParser = require("json2csv").Parser;
const config = require('../config/config.js');
const fs = require('fs');

/* eslint-disable no-console */
function printToCSV(data, fields) {

  const json2csv = new Json2csvParser({ fields });
  const csv = json2csv.parse(data);

  return csv
}

exports.printToCSV = printToCSV;