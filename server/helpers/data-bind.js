'use strict';
const projects = require('../controllers/projects');
const tasks = require('../controllers/tasks');
const utils = require('../config/utils');
const reporter = require('./reports');

let reportName = '';
let _status = '';

function createTaskReport(filename, search, regExSearch, status) {
  reportName = filename;
  _status = status;
  const p = projects.getReportData(5);
  p.then(data => getCombinedData(data));
}

function getCombinedData(data) {
  const projectData = data;
  const _tasks = tasks.getReportData(5);
  const fields = ['SourceId', '_name', 'Pry', 'TKName', 'TKStart', 'TKTarg', 'TKChamp', 'TKStat' ];
  const fieldNames = ['Project No', 'Project Description', 'Pry', 'Task Name', 'Start', 'Target', 'Champ', 'Status'];
  
  _tasks.then(data => {
      const reformattedArray = data.map(obj => 
      {
      const TKName = obj.TKName.replace(/,/g, '');
      const TKStart = typeof obj.TKStart != 'undefined' ? utils.dpFormatDate(obj.TKStart) : '';
      const TKTarg = typeof obj.TKTarg != 'undefined' ? utils.dpFormatDate(obj.TKTarg) : '';
      const TKChamp = obj.TKChamp;
      const TKStat = getStatus(obj.TKStat);
      const SourceId = obj.SourceId.replace(/,/g, '');

      const _tasks = projectData.find(project => project.pj_no === obj.SourceId);

      if (typeof _tasks === 'object') {
        const _name = _tasks.pj_title;
        const Pry = _tasks.pj_pry;      
        return { TKName, _name, Pry, TKTarg, TKStart, TKChamp, TKStat, SourceId };
      }
    });

    reporter.printToCSV(reformattedArray, reportName, fields, fieldNames);
  });

  _tasks.catch(err => console.error(err));
}

function getStatus(status) {
  switch (status) {
    case 1:
      return 'Not Started (New)';
    case 2:
      return 'On Track';
    case 3:
      return 'In Concern';
    case 4:
      return 'Behind Schedule';
    case 5:
      return 'Completed';
    default:
      return 'Not Set';
  }
}

exports.createTaskReport = createTaskReport;
