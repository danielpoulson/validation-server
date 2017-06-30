const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    Id: Number,
    ProjNo: {type: String, required: '{PATH} is required!'},
    Title: {type: String, required: '{PATH} is required!'},
    ProjDescpt: {type: String, required: '{PATH} is required!'},
    Champion: {type: String, required: '{PATH} is required!'},
    Sponsor: {type: String, required: '{PATH} is required!'},
    Stakeholders: {type: String},
    Priority: {type: String, required: '{PATH} is required!'},
    FileName: String,
    Department: {type: String},
    Site: {type: String},
    PROJCD: {type: Date, required: '{PATH} is required!'},
    PROJTD: {type: Date, required: '{PATH} is required!'},
    PROJMD: {type: Date},
    Status: {type: Number, required: '{PATH} is required!'},
    Ass_Cont: String,
    objectives: {
        projObj : String,
        eByObj : String,
        eDateObj: Date
    },
    deliverables: {
        projDel : String,
        eByDel : String,
        eDateDel: Date
    }
});

const Project = mongoose.model('Project', projectSchema);