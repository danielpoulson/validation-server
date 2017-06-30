//SYNC 11/03/2017 DP
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {type:String},
    email: {type:String},
    username: {type:String},
    passwordHash: {type:String},
    dept: {type:String},
    role: {type:String}
});

const User = mongoose.model('User', userSchema);
