//SYNC 11/03/2017 DP
const json2csv = require('json2csv');
const config = require('../config/config.js');
const fs = require('fs');
 
/* eslint-disable no-console */
function printToCSV(data, reportName, fields) {
    const reportData = data;
    const file = config.uploaded +  reportName + '.csv';
   
    json2csv({ data: reportData , fields: fields }, function(err, csv) {
        
        if (err) console.log(err);
        fs.writeFile(file, csv, function(err) {
        console.log('file saved');
        });
    });

}

exports.printToCSV = printToCSV;