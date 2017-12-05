'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv'); //https://www.npmjs.com/package/mongoose-to-csv
const utils = require('../config/utils');

const validationSchema = new Schema({
  Id: Number,
  val_no: { type: String, required: '{PATH} is required!' },
  val_title: { type: String, required: '{PATH} is required!' },
  val_dept: { type: String, required: '{PATH} is required!' },
  val_site: { type: String, required: '{PATH} is required!' },
  val_risk: { type: String },
  val_reval: { type: Date },
  created: { type: Date, default: Date.now },
  val_stat: { type: Number, required: '{PATH} is required!' },
  val_type: String,
  val_descp: { type: String },
  val_log: [
    {
      val_id: String,
      val_actby: String,
      val_actdate: Date,
      val_action: String,
      val_actdept: String
    }
  ],
  val_active: Boolean
});

validationSchema.plugin(mongooseToCsv, {
  headers: 'valNo Title Department Site Risk Type Reval Status Created',
  constraints: {
    valNo: 'val_no',
    Department: 'val_dept',
    Type: 'val_type',
    Site: 'val_site',
    Status: 'val_stat'
  },
  virtuals: {
    Title: function(doc) {
      const title = doc.val_title.replace(/,/g, '');
      return title;
    },
    Risk: function(doc) {
      const risk = doc.val_risk.replace(/,/g, '');
      return risk;
    },
    Reval: function(doc) {
      const _date = typeof doc.val_reval != 'undefined' ? utils.dpFormatDate(doc.val_reval) : '';
      return _date;
    },

    Created: function(doc) {
      const _date = typeof doc.created != 'undefined' ? utils.dpFormatDate(doc.created) : '';
      return _date;
    }
  }
});

const Validation = mongoose.model('Validation', validationSchema);
