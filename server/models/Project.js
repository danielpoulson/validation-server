"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  pj_no: { type: String, required: "{PATH} is required!" },
  pj_title: { type: String, required: "{PATH} is required!" },
  pj_sponsor: { type: String },
  pj_link: { type: String }, // linking to other project or type
  pj_champ: { type: String, required: "{PATH} is required!" },
  pj_cust: { type: String, required: "{PATH} is required!" },
  pj_pry: { type: String },
  pj_start: { type: Date },
  pj_target: { type: Date, required: "{PATH} is required!" },
  pj_closed: { type: Date },
  created: { type: Date, default: Date.now },
  dateclosed: { type: Date },
  pj_stat: { type: Number, required: "{PATH} is required!" },
  pj_descp: { type: String },
  pj_objt: { type: String },
  pj_delry: { type: String },
  pj_log: [
    {
      pj_id: String,
      pj_actby: String,
      pj_actdate: Date,
      pj_action: String,
      pj_actdept: String
    }
  ],
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
});

function autoPopulate(next) {
  this.populate("tasks");
  next();
}

projectSchema.pre("find", autoPopulate);
projectSchema.pre("findOne", autoPopulate);

// projectSchema.virtual("tasks", {
//   ref: "Task",
//   localField: "_id",
//   foreignField: "project"
// });

const Project = mongoose.model("Project", projectSchema);
