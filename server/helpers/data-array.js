/* eslint no-var: "off" */
const moment = require("moment");
// const fs = require("fs");

exports.dpFormatDate = date => moment(date).format("DD/MM/YYYY");
