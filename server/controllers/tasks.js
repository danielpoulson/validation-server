"use strict";
/*eslint no-console: 0*/
const Task = require("mongoose").model("Task");
const Project = require("mongoose").model("Project");
const projects = require("../controllers/projects");
const users = require("../controllers/users");
const files = require("../controllers/files");
const mailer = require("../config/mailer.js");
const config = require("../config/config.js");
const utils = require("../config/utils");
const databind = require("../helpers/data-bind");
const { printToCSV } = require("../reports/reports");

const uploaded = config.uploaded;

exports.getTasks = function(req, res) {
  const status = req.params.status;
  // const capa = req.params.capa || 1;
  const capa = 1;


  const tasks = Task.find({ TKStat: {$gt: capa, $lte: status} })
    .select({
      SourceId: 1,
      TKName: 1,
      TKTarg: 1,
      TKStart: 1,
      TKChamp: 1,
      TKStat: 1,
      TKCapa: 1
    })
    .sort({ TKTarg: 1 });

  tasks.then(tasks => res.send(tasks));
};

exports.test = (req, res) => {

  const projects = getTasksByProjects();
  console.log(projects);
  res.sendStatus(200);
}

const getTasksByProjects = async () => {

  return Task.find()
    .populate(
      {
        path: 'projId',
        match: { pj_stat: { $lt: 4 }},
        select: 'pj_title pj_no pj_stat'
      });
  }


exports.getProjectTaskList = function(req, res) {
  Task.find({ SourceId: req.params.id }, function(err, collection) {
    res.send(collection);
  });
};

function findProjectTasksById(id) {
  return Task.find({ SourceId: id })
    .select({
      TKName: 1,
      TKStart: 1,
      TKTarg: 1,
      TKChamp: 1,
      TKStat: 1,
      SourceId: 1,
      TKCapa: 1,
      TKpcent: 1
  }).exec();
}

exports.updateTask = async (req, res) => {
  const newOwner = req.body.TKChampNew;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  ).exec();

  if (newOwner) {
    const user = users.getUserEmail(req.body.TKChamp);

    user.then(user => {
      mailer.send({
        toEmail: user[0].email,
        subject: "Project Task",
        emailType: "Project Task",
        projectAss: "",
        projectNo: req.body.SourceId,
        action: `Action to complete : ${req.body.TKName}`,
        target: utils.dpFormatDate(req.body.TKTarg)
      });
    });
  }

  res.sendStatus(200);
};

exports.deleteTask = function(req, res) {
  const taskId = req.params.id;
  let taskTitle = "";
  let SourceId = "";
  const user = req.user.fullname;

  Task.findOne({ _id: taskId }).exec(function(err, task) {
    taskTitle = task.TKName;
    SourceId = task.SourceId;

    Task.remove({ _id: taskId }, function(err) {
      if (err) return handleError(err);
      res.status(200).send(taskId);
    });

    utils.write_to_log(
      "DELETED TASK - " + "(" + SourceId + " - " + taskTitle + ") by " + user
    );
  });
};


// When a new task is created a reference to that tasks is saved to the associated project
exports.createTask = async (req, res) => {
  const task = await new Task(req.body).save();
  res.status(200).send(task);
};

exports.getTaskById = function(req, res) {
  Task.findById(req.params.id).exec(function(err, task) {
    res.send(task);
  });
};

exports.getTaskCount = function(req, res) {
  Task.count({ SourceId: req.params.id }, function(err, taskCount) {
    res.send(taskCount.toString());
  });
};

exports.getTasksCountByUser = function(user) {
  return Task.count({ $and: [{ TKChamp: user }, { TKStat: { $lt: 5 } }] });
};

exports.getCountAll = function() {
  return Task.count({ TKStat: { $lt: 5 } });
};

exports.getReportData = function() {
  return Task.find(
    { TKStat: { $lte: 4 } },
    { SourceId: 1, TKName: 1, TKTarg: 1, TKStart: 1, TKChamp: 1, TKStat: 1 }
  )
    .sort({ TKTarg: 1 })
    .exec();
};

exports.dumpTasks = async function(req, res) {

  const _search = !req.body.search ? "." : req.body.search;
  const regExSearch = new RegExp(_search + ".*", "i");
  const _status = 4;
  const fields = [ 
    {
      label: 'Project No',
      value: 'SourceId'
    },
    {
      label: 'Project Description',
      value: '_name'
    },
    {
      label: 'Pry',
      value: 'Pry'
    },
    {
      label: 'Task Name',
      value: 'TKName'
    },
    {
      label: 'Start',
      value: 'TKStart'
    },
    {
      label: 'Target',
      value: 'TKTarg'
    },
    {
      label: 'Champ',
      value: 'TKChamp'
    },
    {
      label: 'Status',
      value: 'TKStat'
    }
  ];


  const data = await databind.createTaskReport(_search, regExSearch, _status);

  const csv = printToCSV(data, fields);

  try {
    res.setHeader("Content-disposition", "attachment; filename=data.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
  }

};

exports.dumpProjectsTaskList = async (req, res) => {
  const source = req.params.id;

  const fields = [ 

    {
      label: 'Task Name',
      value: 'TKName'
    },
    {
      label: 'Status',
      value: 'TKStat'
    },
    {
      label: 'Start',
      value: 'TKStart'
    },
    {
      label: 'Dur',
      value: 'dur'
    },
    {
      label: 'Target',
      value: 'TKTarg'
    },    
    {
      label: 'Champ',
      value: 'TKChamp'
    },
    {
      label: 'Per%',
      value: 'TKpcent'
    }
  ];


  const data = await databind.createProjectTaskReport(source);

  const csv = printToCSV(data, fields);

  try {
    res.setHeader("Content-disposition", "attachment; filename=data.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
  }

}

function handleError(err) {
  console.log(err);
}

exports.findProjectTasksById = findProjectTasksById;
exports.getTasksByProjects = getTasksByProjects;
