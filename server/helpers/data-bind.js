'use strict';
const projects = require('../controllers/projects');
const tasks = require('../controllers/tasks');
const utils = require('../config/utils');
const reporter = require('../reports/reports');

let reportName = '';
let _status = '';

exports.createTaskReport = async function (search, regExSearch, status) {

  _status = status;
  const projectData = await projects.getReportData(5);
  const _tasks = await tasks.getReportData(5);
  

  const reformattedArray = _tasks.map(obj => 
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

    return reformattedArray;


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

 
