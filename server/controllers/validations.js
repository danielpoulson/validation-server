const Validation = require("mongoose").model("Validation");
const fs = require("fs");
const files = require("../controllers/files");
const config = require("../config/config.js");
const { printToCSV } = require("../reports/reports");

const uploaded = config.uploaded;

exports.createValidation = function(req, res, next) {
  // let val = req.body;

  const validation = new Validation(req.body);

  validation.save(err => {
    if (err) return handleError(err);
    res.sendStatus(200);
  });
};

exports.getValidations = function(req, res) {
  const status = req.params.status;
  Validation.find()
    .select({ val_no: 1, val_title: 1, val_type: 1, val_reval: 1, val_stat: 1 })
    .sort({ val_no: 1 })
    .exec(function(err, collection) {
      res.send(collection);
    });
};

exports.getValidationById = function(req, res) {
  Validation.findOne({ val_no: req.params.id }).exec(function(err, val) {
    res.send(val);
  });
};

exports.updateValidation = function(req, res) {
  let _val = req.body;

  Validation.update({ _id: req.body._id }, { $set: req.body }, function(err) {
    if (err) return handleError(err);
    res.sendStatus(200);
  });
};

exports.updateValidationComment = function(req, res) {
  const valID = req.body.val_id || 4;

  const _update = {
    val_id: valID,
    val_actdept: req.body.val_actdept,
    val_actby: req.body.val_actby,
    val_actdate: req.body.val_actdate,
    val_action: req.body.val_action
  };

  const validation = Validation.update(
    { val_no: req.params.id },
    { $addToSet: { val_log: _update } },
    { new: true }
  );

  validation.then(res.sendStatus(200));
  validation.catch(err => handleError(err));
};

exports.updateValidationVms = (req, res) => {
  Validation.findByIdAndUpdate(req.params.id, { val_vms: req.body }, () => {
    res.sendStatus(200);
  });
};

exports.dumpValidations = async function(req, res) {

  const _search = !req.body.search ? "." : req.body.search;
  const regExSearch = new RegExp(_search + ".*", "i");
  // const _status = req.body.showAll ? 5 : 4;

 const valdata = await Validation.find()
    .select({
      val_no: true,
      val_title: true,
      val_dept: true,
      val_site: true,
      val_risk: true,
      val_stat: true,
      val_type: true,
      val_reval: true,
      created: true,
      _id: 0
    })
    .where({
      $or: [
        { val_type: regExSearch },
        { val_no: regExSearch },
        { val_title: regExSearch }
      ]
    });

    const fields = [
    { label: "No.", value: "val_no" },
    { label: "Description", value: "val_title" },
    { label: "Dept", value: "val_dept" },
    { label: "Site", value: "val_site" },
    { label: "Risk", value: "val_risk" },
    { label: "Status", value: "val_stat" },
    { label: "Type", value: "val_type" },
    { label: "Reval", value: "val_reval" },
    { label: "Created", value: "created" }
  ];


  const csv = printToCSV(valdata, fields);


  try {

    res.setHeader("Content-disposition", "attachment; filename=data.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
  }
};

/*eslint no-console: 0*/

function handleError(err) {
  console.log(err);
}

function logMessage(message) {
  console.log(message);
}
