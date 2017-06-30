//SYNC 11/03/2017 DP
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filesSchema = new Schema({

    fsFileName: {type: String, required: '{PATH} is required!'},
    fsFileExt: {type: String, required: '{PATH} is required!'},
    fsAddedBy: {type: String, required: '{PATH} is required!'},
    fsAddedAt: {type: Date},
    fsSource: {type: String, required: '{PATH} is required!'},
    fsFilePath: {type: String},
    fsBooked: {type: Number, required: '{PATH} is required!'}


});


const File = mongoose.model('File', filesSchema);