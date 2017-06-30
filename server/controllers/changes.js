"use strict";
const Change = require('mongoose').model('Change');
const fs = require('fs');
const files = require('../controllers/files');
const tasks = require('../controllers/tasks');
const users = require('../controllers/users');
const mailer = require('../config/mailer.js');
const utils = require('../config/utils');
const server_data = require('../config/server_data');
const config = require('../config/config.js');

const uploaded = config.uploaded;

exports.getChanges = function(req, res) {
    const status = req.params.status;
    Change.find({CC_Stat: {$lt:status}})
        .select({ CC_No: 1, CC_Descpt: 1, CC_Champ: 1, CC_TDate: 1, CC_Stat: 1, CC_Prop: 1 })
        .sort({CC_No:1})
        .exec(function(err, collection) {
        res.send(collection);
    });
};

exports.createChange = function(req, res, next) {
    let newNum = '';
    const new_date = new Date();
    const yr = new_date.getFullYear().toString().substr(2, 2);
    const search = new RegExp("CC" + yr);

    const cnt = Change.count({CC_No: search}).exec(function (err, count) {
        if (err) return err.toString();

        newNum = "CC" + ((yr * 10000) + (count + 1));
        req.body.CC_No = newNum;

        Change.create(req.body, function(err, _changes) {
            if(err) {
                if(err.toString().indexOf('E11000') > -1) {
                    err = new Error('Duplicate Username');
                }
                res.status(400);
                return res.send({reason:err.toString()});
            }
            res.status(200).send(_changes);
            
            const user = users.getUserEmail(_changes.CC_Champ);

            user.then(user => {
              mailer.send({
                toEmail: user[0].email,
                subject: 'Change Control',
                emailType: 'Change Control',
                changeAss: _changes.CC_Descpt,
                changeNo: _changes.CC_No,
                action: '',
                target: utils.dpFormatDate(_changes.CC_TDate)
              });
            });
        });
    });
};

exports.updateChange = function(req, res) {
  let _changes = req.body;
  let _newOwner = _changes.newOwner;
  delete _changes.newOwner;

  Change.update({_id : req.body._id}, {$set: req.body}, function (err) {
    if (err) return handleError(err);
    res.sendStatus(200);

    if (_newOwner === true) {
      const user = users.getUserEmail(_changes.CC_Champ);

      user.then(user => {
        mailer.send({
          toEmail: user[0].email,
          subject: 'Change Control',
          emailType: 'Change Control',
          changeAss: _changes.CC_Descpt,
          changeNo: _changes.CC_No,
          action: '',
          target: utils.dpFormatDate(_changes.CC_TDate)
        });
      });
    }

  });
};

exports.updateChangeComment = function(req, res) {
  const _log = req.body;

  const _update = {'CC_Id' : "4", 'CC_ActDept': req.body.CC_ActDept , 'CC_ActBy': req.body.CC_ActBy,
              'CC_ActDate': req.body.CC_ActDate, 'CC_Action' : req.body.CC_Action};

  req.body._id = Math.floor(Math.random() * (9999999 - 1)) + 1;

   Change.update({CC_No : req.params.id}, {$push: {CC_LOG : _update}}, (err, data) => {
     if (err) return handleError(err);
     res.send(_log);
   });
};

exports.getChangeById = function(req, res) {
    Change.findOne({CC_No:req.params.id}).exec(function(err, change) {
        res.send(change);
    });
};

exports.getReportData = function(status){

    return Change.find({CC_Stat: {$lt:status}})
        .select({ CC_No: 1, CC_Descpt: 1, _id:0 })
        .sort({CC_TDate:1})
        .exec();
};

// This function gets the count for **active** tasks and change controls for the logged in user
exports.getUserDashboard = function(req, res){
  const dashboard = {};
  let _barData = [];
  let username = '';
  dashboard.lineData = server_data.lineData;
  dashboard.barData = server_data.barData;

  //TODO: (2) MED There is no limit to the number of years in the bar graph

  const promise = Change.count({CC_Stat: {$lt:4}}).exec();

  promise.then(data => {
    dashboard.allChangeCount = data;
    return users.getFullname(req.params.user);
  }).then(data => {
    username = data[0].fullname;
    return Change.count({$and: [{CC_Champ: username }, {CC_Stat: {$lt:4}}]});
  }).then( data => {
    dashboard.changeCount = data;
    return tasks.getTasksCountByUser(username);
  }).then( data => {
    dashboard.taskCount = data;
    return tasks.getCountAll();
  }).then( data => {
    dashboard.allTaskCount = data;
    return(dashboard);
  }).then( data => {
    Change.aggregate(
    [
      { "$unwind": "$CC_LOG" },
      {
        "$project": {
          "Created": "$CC_LOG.CC_Action",
          "Year": {$year: "$CC_LOG.CC_ActDate"}
        }
      },
      { $match : { Created: "Created" } },
      { $group: {
          "_id": "$Year",
          "open": { "$sum": 1 }
      }},
      { $sort: {"_id": 1}}
    ],
    function(err,result) {

      _barData = result;

      Change.aggregate(
        [
          { "$unwind": "$CC_LOG" },
          {
            "$project": {
              "Created": "$CC_LOG.CC_Action",
              "Year": {$year: "$CC_LOG.CC_ActDate"},
              "CC_Stat": 1
            }
          },
          {
            "$match": {
              "$and": [
                { Created: "Created" },
                { "CC_Stat": { $gt: 3 } },
              ]
            }
          },
          { $group: {
              "_id": "$Year",
              "closed": { "$sum": 1 }
          }}
        ],
        function (err, result) {

          dashboard.barData = _barData.map( barData => {
            const id = barData._id;
            const _result = result.filter( obj => obj._id === id);
            return Object.assign(barData, _result[0]);
          });

          //TODO: (2) This is fake data as there is no data for the first 2 years

          if (dashboard.barData.length === 1) {
            const fakeData = [{
                "_id": 2015,
                "closed": 0,
                "open": 0
              },
              {
                "_id": 2016,
                "closed": 0,
                "open": 0
              }];

              dashboard.barData = fakeData.concat(dashboard.barData);
          }

          res.send(dashboard);

        }
      );
    }
  );
  });
};



exports.dumpChanges = function(req, res) {
    //var status = 2;
    const int = parseInt((Math.random()*1000000000),10);
    const file = uploaded + 'changes' + int + '.csv';
    let fileData = {};
    const newDate = new Date();



    fileData.fsAddedAt = newDate;
    fileData.fsAddedBy = req.body.fsAddedBy;
    fileData.fsFileName = 'changes' + int;
    fileData.fsFileExt = 'csv';
    fileData.fsSource = req.body.fsSource;
    fileData.fsFilePath = 'changes' + int + '.csv';
    fileData.fsBooked = 0;

    files.addExportFile(fileData);//

    const _search = !req.body.search ? "." : req.body.search;
    const regExSearch = new RegExp(_search + ".*", "i");
    const _status = req.body.showAll ? 5 : 4;


    Change.find({CC_Stat: {$lt:_status}})
        .select({CC_No:true, CC_Descpt:true, CC_Champ:true, CC_TDate:true, CC_CDate:true, CC_Comp:true, CC_Stat:true, created:1, _id: 0})
        .where({$or: [{CC_Champ : regExSearch }, {CC_No : regExSearch}, {CC_Descpt : regExSearch}]})
        // .where({CC_Champ : regExSearch })
        .stream()
        .pipe(Change.csvTransformStream())
        .pipe(fs.createWriteStream(file));

    //Create an id for use on the client side
    fileData._id = int;
    res.send(fileData);

};

/*eslint no-console: 0*/

function handleError(err){
    console.log(err);
}

function logMessage(message){
    console.log(message);
}
