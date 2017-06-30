//SYNC 11/03/2017 DP
"use strict";
const User = require('mongoose').model('User');
const passport = require('passport');
const crypto = require('../config/cryptopass');

exports.getAllUsers = function(req, res) {
    const status = req.params.status;

    User
        .find({})
        .select({fullname : 1, "_id" : 0})
        .sort({fullname : 1})
        .exec(function(err, collection) {

          const users = collection.map(function(user) {
            return user.fullname;
          });

          res.send(users);
    });
};

exports.updateUser = function (req, res, next) {
    const password = req.body.password;
    const userData = {};

    userData.username = req.body.username;
    userData.fullname = req.body.fullname;
    userData.email = req.body.email;
    userData.role = req.body.role;

    if (password) {
      userData.passwordHash = crypto.hash(password);
    }

    User.update({_id : req.body._id}, {$set: userData}, function (err) {
      if (err){console.log(err); res.sendStatus(500);}
      res.sendStatus(200);
    });

};

exports.updatePassword = function(req, res) {
  const password = req.body.password;

  console.log(password);
  console.log(req.params.id);

  if (password) {
    
    const _passwordHash = crypto.hash(password);

    User.update({_id : req.params.id}, {$set: {passwordHash: _passwordHash}}, function (err) {
      if (err){console.log(err); res.sendStatus(500);}
      res.sendStatus(200);
    });

  } else {

    res.sendStatus(500);

  }
};

exports.getLoggedUser = function(req, res) {
  if(typeof req.user !== 'undefined') {   
    res.send({success:true, user: makeUserSafe(req.user)});
  } else {
    res.sendStatus(203);
  }
};

exports.getUser = function(req, res) {
    const _fullname = req.params.id;

    User
        .find({})
        .select({"passwordHash": 0})
        .where({fullname : _fullname})
        .exec(function(err, collection) {
          res.send(collection);
    });
};

exports.getFullname = function(username) {
    return User
        .find({})
        .select({ "fullname": 1, "_id": 0 })
        .where({ username: username});
};

exports.getUserEmail = function(user) {
  return User.find({fullname : user},{email:1, "_id" : 0});

};

exports.createUser = function (req, res, next) {

  const userData = req.body;

  userData.username = userData.username.toLowerCase();
  userData.passwordHash = crypto.hash(userData.password);


  User.create(userData, function(err, user) {
    if(err) {
      if(err.toString().indexOf('E11000') > -1) {
        err = new Error('Duplicate Username');
      }
      res.status(400);
      return res.send({reason:err.toString()});
    }

    res.sendStatus(200);
  });

};

exports.deleteUser= function (req, res) {
    const id = req.params.id;

    console.log(req.params.id);

    User.remove({_id: id}, function (err) {
        if (err) return handleError(err);
        res.sendStatus(200);
    });



};

// TODO: (5) LOW Duplicate code with auth.js
function makeUserSafe (user) {
    const safeUser = {};

    const safeKeys = ['id', 'fullname', 'email', 'username', 'dept', 'role'];

    safeKeys.forEach(function (key) {
        safeUser[key] = user[key];
    });
    return safeUser;
}

/*eslint no-console: 0*/
function handleError(err) {
  console.log(err);
}
