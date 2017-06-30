"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv'); //https://www.npmjs.com/package/mongoose-to-csv
const utils = require('../config/utils');

const changeSchema = new Schema({
    Id: Number,
    CC_No: {type: String, required: '{PATH} is required!'},
    CC_Descpt: {type: String, required: '{PATH} is required!'},
    CC_Code: {type: String},
    CC_Multi: {type: String}, // Multiply products affected
    CC_ASS: {type: String}, // Associated deviation or change
    CC_Champ: {type: String, required: '{PATH} is required!'},
    CC_Comp: {type: String, required: '{PATH} is required!'},
    CC_Pry: {type: String, required: '{PATH} is required!'},
    CC_TDate: {type: Date, required: '{PATH} is required!'},
    CC_CDate: { type: Date },
    created: { type: Date, default: Date.now },
    dateclosed: {type:Date},
    CC_Stat: {type: Number, required: '{PATH} is required!'},
    CC_Curt: {type: String},
    CC_Prop: {type: String},
    CC_Rat: {type: String},
    CC_LOG: [{
        CC_Id : String,
        CC_ActBy : String,
        CC_ActDate: Date,
        CC_Action: String,
        CC_ActDept: String
    }],
    Linking   : [{type: Schema.Types.ObjectId, ref: 'Task' }]
});

changeSchema.plugin(mongooseToCsv, {
    headers: 'CCNo Description Owner TargetDate ClosedDate Company Status Created',
    constraints: {
        'CCNo': 'CC_No',
        'Owner': 'CC_Champ',
        'Status': 'CC_Stat'
    },
    virtuals: {
        'Description': function (doc) {
            const descpt = doc.CC_Descpt.replace(/,/g, "");
            return descpt;
        },
        'Company': function (doc) {
            const comp = doc.CC_Comp.replace(/,/g, "");
            return comp;
        },
        'TargetDate': function (doc) {
            const _date = (typeof doc.CC_TDate != 'undefined') ? utils.dpFormatDate(doc.CC_TDate) : '';
            return _date;
        },

        'ClosedDate': function (doc) {
            const _date = (typeof doc.CC_CDate != 'undefined') ? utils.dpFormatDate(doc.CC_CDate) : '';
            return _date;
        },

        'Created': function (doc) {
            const _date = (typeof doc.created != 'undefined') ? utils.dpFormatDate(doc.created) : '';
            return _date;
        }
    }

});


const Change = mongoose.model('Change', changeSchema);
