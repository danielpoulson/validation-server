'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv'); //https://www.npmjs.com/package/mongoose-to-csv
const utils = require('../config/utils');

const projectSchema = new Schema({
  Id: Number,
  pj_no: { type: String, required: '{PATH} is required!' },
  pj_title: { type: String, required: '{PATH} is required!' },
  pj_sponsor: { type: String },
  pj_link: { type: String }, // linking to other project or type
  pj_champ: { type: String, required: '{PATH} is required!' },
  pj_cust: { type: String, required: '{PATH} is required!' },
  pj_pry: { type: String, required: '{PATH} is required!' },
  pj_target: { type: Date, required: '{PATH} is required!' },
  pj_closed: { type: Date },
  created: { type: Date, default: Date.now },
  dateclosed: { type: Date },
  pj_stat: { type: Number, required: '{PATH} is required!' },
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
  Linking: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

projectSchema.plugin(mongooseToCsv, {
  headers: 'pjNo Description Owner TargetDate ClosedDate Company Status Created',
  constraints: {
    pjNo: 'pj_no',
    Owner: 'pj_champ',
    Status: 'pj_stat'
  },
  virtuals: {
    Description: function(doc) {
      const descpt = doc.pj_title.replace(/,/g, '');
      return descpt;
    },
    Company: function(doc) {
      const comp = doc.pj_cust.replace(/,/g, '');
      return comp;
    },
    TargetDate: function(doc) {
      const _date = typeof doc.pj_target != 'undefined' ? utils.dpFormatDate(doc.pj_target) : '';
      return _date;
    },

    ClosedDate: function(doc) {
      const _date = typeof doc.pj_closed != 'undefined' ? utils.dpFormatDate(doc.pj_closed) : '';
      return _date;
    },

    Created: function(doc) {
      const _date = typeof doc.created != 'undefined' ? utils.dpFormatDate(doc.created) : '';
      return _date;
    }
  }
});

const Project = mongoose.model('Project', projectSchema);
