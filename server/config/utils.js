/* eslint no-var: "off" */
const moment = require('moment');
const fs = require('fs');

function dpFormatDate(date) {
  return moment(date).format('DD/MM/YYYY');
};

exports.dpDashDates = function(){
	var dates = [];
	dates.push(moment());
	dates.push(moment().subtract(30, 'days'));
	dates.push(moment().subtract(60, 'days'));
	return dates;
};

exports.write_to_log = function(write_data) {
    const fs = require("fs");
    const path = '.././logs/logs.txt';
    const dString = dpFormatDate(new Date());

    write_data = "\r\n" + dString + " - " + write_data;

    fs.appendFile(path, write_data, function(error) {
         if (error) {
           console.error("write error:  " + error.message);
         } else {
           console.log("Successful Write to " + path);
         }
    });
}

exports.dpFormatDate = dpFormatDate;
