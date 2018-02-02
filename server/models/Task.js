//SYNC 11/03/2017 DP
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const utils = require('../config/utils');

const taskSchema = new Schema({
    ID: Number,
    TKName: {type: String, required: '{PATH} is required!'},
    TKStart: {type: Date, required: '{PATH} is required!'},
    TKTarg: {type: Date, required: '{PATH} is required!'},
    TKChamp: {type: String, required: '{PATH} is required!'},
    TKStat: {type: Number, required: '{PATH} is required!'},
    SourceId: {type: String, required: '{PATH} is required!'},
    TKComment: String,
    TKCapa: {type: Number, default: 0},
    TKChampNew: {type: Boolean, default: false},
    datecreated: {type:Date, default: Date.now},
    dateclosed: {type:Date}
});

const Task = mongoose.model('Task', taskSchema);
