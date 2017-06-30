'use strict';
const changes = require('../controllers/changes');
const tasks = require('../controllers/tasks');
const utils = require('../config/utils');
const reporter = require('./reports');

let reportName = '';
let _status = '';

function createTaskReport(filename, search, regExSearch, status){
    reportName = filename;
    _status = status;
    const p = changes.getReportData(5);
    p.then(data => getCombinedData(data));

}

function getCombinedData(data) {
    const changeData = data;
    const _tasks = tasks.getReportData(5);
    const fields = ['SourceId', '_name', 'TKName', 'TKStart', 'TKTarg', 'TKChamp', 'TKStat'];
    
    _tasks.then( data => {

        const reformattedArray = data.map( obj => {
            const TKName = obj.TKName.replace(/,/g, "");
            const TKStart = (typeof obj.TKStart != 'undefined') ? utils.dpFormatDate(obj.TKStart) : '';                        
            const TKTarg = (typeof obj.TKTarg != 'undefined') ? utils.dpFormatDate(obj.TKTarg) : '';
            const TKChamp = obj.TKChamp;
            const TKStat = getStatus(obj.TKStat);
            const SourceId = obj.SourceId.replace(/,/g, "");

            const _tasks = changeData.find(change => change.CC_No === obj.SourceId);

            if (typeof _tasks === 'object') {
                const _name = _tasks.CC_Descpt;
                return {TKName, _name, TKTarg, TKStart, TKChamp, TKStat, SourceId};
            }

        });
        
        reporter.printToCSV(reformattedArray, reportName, fields);

    });

    _tasks.catch(err => console.error(err));

}

function getStatus(status) {
    switch (status) {
        case 1 :
            return "Not Started (New)";
            break;
        case 2 :
            return 'On Track';
            break;
        case 3 :
            return 'In Concern';
            break;
        case 4 :
            return 'Behind Schedule';
            break;
        case 5 :
            return 'Completed';
            break;
        default :
            return "Not Set";
            break;
    }
}

exports.createTaskReport = createTaskReport;