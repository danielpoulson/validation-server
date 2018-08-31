"use strict";
const Project = require("mongoose").model("Project");
const fs = require("fs");
const files = require("../controllers/files");
const tasks = require("../controllers/tasks");
const users = require("../controllers/users");
const mailer = require("../config/mailer.js");
const utils = require("../config/utils");
const { printToCSV } = require("../reports/reports");
const server_data = require("../config/server_data");
const config = require("../config/config.js");
const { createProjectTaskReport } = require("../reports/project-tasks");

const uploaded = config.uploaded;

exports.getProjects = function (req, res) {
  const status = req.params.status;
  Project.find({ pj_stat: { $lt: status } })
    .select({
      pj_no: 1,
      pj_title: 1,
      pj_champ: 1,
      pj_target: 1,
      pj_stat: 1,
      pj_pry: 1
    })
    .sort({ pj_no: 1 })
    .exec(function (err, collection) {
      res.send(collection);
    });
};

exports.getValProjects = (req, res) => {
  const search = new RegExp(req.params.id);
  Project.find({ pj_link: search })
    .select({ pj_no: 1, pj_title: 1, pj_champ: 1, pj_target: 1, pj_stat: 1 })
    .sort({ pj_no: 1 })
    .exec((err, docs) => {
      res.send(docs);
    });
};

exports.createProject = function (req, res, next) {
  let newNum = "";
  const new_date = new Date();
  const yr = new_date
    .getFullYear()
    .toString()
    .substr(2, 2);
  const search = new RegExp("PM" + yr);

  const cnt = Project.count({ pj_no: search }).exec(function (err, count) {
    if (err) return err.toString();

    newNum = "PM" + (yr * 10000 + (count + 1));
    req.body.pj_no = newNum;

    Project.create(req.body, function (err, _project) {
      if (err) {
        if (err.toString().indexOf("E11000") > -1) {
          err = new Error("Duplicate Username");
        }
        res.status(400);
        return res.send({ reason: err.toString() });
      }
      res.status(200).send({
          _id: _project._id,
          pj_no: _project.pj_no,
          pj_title: _project.pj_title,
          pj_champ: _project.pj_champ,
          pj_target: _project.pj_target,
          pj_stat: _project.pj_stat,
          pj_pry: _project.pj_pry
        });

      const user = users.getUserEmail(_project.pj_champ);

      user.then(user => {
        mailer.send({
          toEmail: user[0].email,
          subject: "Project Control",
          emailType: "Project Control",
          ProjectAss: _project.pj_title,
          ProjectNo: _project.pj_no,
          action: "",
          target: utils.dpFormatDate(_project.pj_target)
        });
      });
    });
  });
};

exports.updateProject = function (req, res) {
  let _Projects = req.body;
  let _newOwner = _Projects.newOwner;
  delete _Projects.newOwner;

  Project.update({ _id: req.body._id }, { $set: req.body }, function (err) {
    if (err) return handleError(err);
    res.sendStatus(200);

    if (_newOwner === true) {
      const user = users.getUserEmail(_Projects.pj_champ);

      user.then(user => {
        mailer.send({
          toEmail: user[0].email,
          subject: "Project Control",
          emailType: "Project Control",
          ProjectAss: _Projects.pj_title,
          ProjectNo: _Projects.pj_no,
          action: "",
          target: utils.dpFormatDate(_Projects.pj_target)
        });
      });
    }
  });
};

exports.updateProjectComment = function (req, res) {
  const pmID = req.body.pj_id || 4;

  const _update = {
    pj_id: pmID,
    pj_actdept: req.body.pj_actdept,
    pj_actby: req.body.pj_actby,
    pj_actdate: req.body.pj_actdate,
    pj_action: req.body.pj_action
  };

  // req.body._id = Math.floor(Math.random() * (9999999 - 1)) + 1;

  const project = Project.update(
    { pj_no: req.params.id },
    { $addToSet: { pj_log: _update } },
    { new: true }
  );

  project.then(com => res.send(com));
  project.catch(err => handleError(err));
};

exports.getProjectById = async (req, res) => {
  const id = req.params.id;
  const project = await Project.findOne({ pj_no: id });
  const _tasks = await tasks.findProjectTasksById(id);
  res.send({project, tasks: _tasks});
};

// exports.getEquipment = async (req, res) => {
//   const equipment = req.equipment;
//   const calibrations = await Calibration.getCalListBySource(equipment.equipNo);
//   const events = await Event.getEventBySource(equipment.equipNo);
//   res.send({equipment, planned: calibrations, events});
// };

exports.getReportData = function (status) {
  return Project.find({ pj_stat: { $lt: status } })
    .select({ pj_no: 1, pj_title: 1, pj_pry: 1, _id: 0 })
    .sort({ pj_target: 1 })
    .exec();
};

// This function gets the count for **active** tasks and project controls for the logged in user
exports.getUserDashboard = function (req, res) {
  const dashboard = {};
  let _barData = [];
  let username = "";
  dashboard.lineData = server_data.lineData;
  dashboard.barData = server_data.barData;

  //TODO: (2) MED There is no limit to the number of years in the bar graph

  const promise = Project.count({ pj_stat: { $lt: 4 } }).exec();

  promise
    .catch(function (e) {
      console.log(e); // "oh, no!"
    })
    .then(data => {
      dashboard.allProjectCount = data;
      return users.getFullname(req.params.user);
    })
    .then(data => {
      username = data[0].fullname;
      return Project.count({
        $and: [{ pj_champ: username }, { pj_stat: { $lt: 4 } }]
      });
    })
    .then(data => {
      dashboard.projectCount = data;
      return tasks.getTasksCountByUser(username);
    })
    .then(data => {
      dashboard.taskCount = data;
      return tasks.getCountAll();
    })
    .then(data => {
      dashboard.allTaskCount = data;
      return dashboard;
    })
    .then(data => {
      Project.aggregate(
        [
          {
            $group: {
              _id: { $year: "$created" },
              open: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ],
        function (err, result) {
          _barData = result;

          Project.aggregate(
            [
              {
                $project: {
                  Year: { $year: "$created" },
                  pj_stat: 1
                }
              },
              {
                $match: {
                  pj_stat: { $gt: 3 }
                }
              },
              {
                $group: {
                  _id: "$Year",
                  closed: { $sum: 1 }
                }
              }
            ],
            function (err, result) {
              if (err) return console.error(err);

              dashboard.barData = _barData.map(barData => {
                const id = barData._id;
                const _result = result.filter(obj => obj._id === id);

                return Object.assign(barData, _result[0]);
              });

              //TODO: (2) This is fake data as there is no data for the first 2 years

              if (dashboard.barData.length === 1) {
                const fakeData = [
                  {
                    _id: 2015,
                    closed: 0,
                    open: 0
                  },
                  {
                    _id: 2016,
                    closed: 0,
                    open: 0
                  }
                ];

                dashboard.barData = fakeData.concat(dashboard.barData);
              }

              res.send(dashboard);
            }
          );
        }
      );
    });
};

exports.toMsProject = async (req, res) => {
  console.log("toMsProject");
  const int = parseInt(Math.random() * 1000000000, 10);
  const file = uploaded + "MStasks" + int + ".csv";
  let fileData = {};
  const newDate = new Date();
  const filename = "MStasks" + int;

  fileData.fsAddedAt = newDate;
  fileData.fsAddedBy = req.body.fsAddedBy;
  fileData.fsFileName = "MStasks" + int;
  fileData.fsFileExt = "csv";
  fileData.fsSource = req.body.fsSource;
  fileData.fsFilePath = "MStasks" + int + ".csv";
  fileData.fsBooked = 0;

  files.addExportFile(fileData); //

  const projects = await Project.find({ pj_stat: { $lt: 4 } })
    .select({
      pj_no: 1,
      pj_title: 1,
      tasks: 1
    })
    .sort({ pj_no: 1 });

  // databind.createTaskReport(filename, _search, regExSearch, _status);

  const csv = await createProjectTaskReport(projects, filename);

  fileData._id = int;
  res.send(fileData);
};

//TODO: Dump to CSV should user the report helper file - common action
exports.dumpProjects = async function (req, res) {
  //var status = 2;
  const int = parseInt(Math.random() * 1000000000, 10);
  const file = uploaded + "projects" + int + ".csv";
  let fileData = {};
  const newDate = new Date();

  fileData.fsAddedAt = newDate;
  fileData.fsAddedBy = req.body.fsAddedBy;
  fileData.fsFileName = "projects" + int;
  fileData.fsFileExt = "csv";
  fileData.fsSource = req.body.fsSource;
  fileData.fsFilePath = "projects" + int + ".csv";
  fileData.fsBooked = 0;

  files.addExportFile(fileData); 



  const _search = !req.body.search ? "." : req.body.search;
  const regExSearch = new RegExp(_search + ".*", "i");
  const _status = req.body.showAll ? 5 : 4;

  const projects = await Project.find({ pj_stat: { $lt: _status } })
    .select({
      pj_no: 1,
      pj_title: 1,
      pj_pry: 1,
      pj_champ: 1,
      pj_start: 1,
      pj_target: 1,
      pj_closed: 1,
      pj_cust: 1,
      pj_stat: 1,
      created: 1,
      _id: 0
    })
    .where({
      $or: [
        { pj_champ: regExSearch },
        { pj_no: regExSearch },
        { pj_title: regExSearch }
      ]
    });

    const _projects = await projects.map(p => {
      let proj = {};
      proj.pj_no = p.pj_no;
      proj.pj_title = p.pj_title.replace(/,/g, "");
      proj.pj_pry = p.pj_pry;
      proj.pj_champ = p.pj_champ;
      proj.pj_start = typeof p.pj_start != "undefined" ? utils.dpFormatDate(p.pj_start) : "";
      proj.pj_target = typeof p.pj_target != "undefined" ? utils.dpFormatDate(p.pj_target) : "";
      proj.pj_closed = typeof p.pj_closed != "undefined" ? utils.dpFormatDate(p.pj_closed) : "";
      proj.pj_cust = p.pj_cust.replace(/,/g, "");
      proj.pj_stat = p.pj_stat;
      proj.created = typeof p.created != "undefined" ? utils.dpFormatDate(p.created) : "";
      return proj;
    });

    const fields = [
    { label: "No.", value: "pj_no" },
    { label: "Description", value: "pj_title" },
    { label: "Pry", value: "pj_pry" },
    { label: "Start", value: "pj_start" },
    { label: "Target", value: "pj_target" },
    { label: "Closed", value: "pj_closed" },
    { label: "Customer", value: "pj_cust" },
    { label: "Status", value: "pj_stat" },
    { label: "Resource Names", value: "pj_champ" },
    { label: "Created", value: "created" }
  ];

  const reportName = "projects" + int;

  printToCSV(_projects, reportName, fields);


  //Create an id for use on the client side
  fileData._id = int;
  res.send(fileData);
};

/*eslint no-console: 0*/

function handleError(err) {
  console.log(err);
}

function logMessage(message) {
  console.log(message);
}
