//SYNC 11/03/2017 DP
"use strict";
/*eslint no-console: 0*/
const File = require('mongoose').model('File');
const express = require('express');
const config = require('../config/config.js'); 
const app = express();
const fs = require('fs');

const uploaded = config.uploaded;

exports.downloadFile = function (req, res) {
    let filename = req.params.file;
    const fileType = filename.substring(0,3);
    const expfilename = filename.slice(6);
    let file = '';


    if(fileType == 'exp'){
        filename = filename.slice(6);
        file = uploaded + filename;
    } else {
        file = uploaded + filename;
    }

    if (fs.existsSync(file)) {
        res.download(file, filename, function(err){
            if (err) {
                console.log(err);
            } else {
                if(fileType == 'exp'){

                    File.find({fsFilePath : filename})
                        .exec(function (err, collection) {
                        fileDeletion(collection[0]._id);
                    });
                }
            }
        });

    } else {
        res.redirect('/');

        File.remove({fsFilePath: expfilename}, function (err) {
            if (err) {console.log(err);}
        });
    }
};

exports.uploadFile = function (req, res) {
    const fileData = {};
    const docName = req.body.docName;

    const myRe = config.regex;
    const myArray = myRe.exec(docName);


    if(myArray) {
        fileData.fsFileName = docName.split('.').shift().substr(11);
    } else {
        fileData.fsFileName = docName.split('.').shift();
    }

    fileData.fsAddedAt = new Date();
    fileData.fsAddedBy = req.body.dpUser;

    fileData.fsFileExt = docName.split('.').pop();
    fileData.fsSource = req.body.sourceId;
    fileData.fsFilePath = req.files[0].filename;
    fileData.fsBooked = 0;

    File.update({fsFileName: fileData.fsFileName}, fileData, {upsert: true}, function (err) {
        if (err) {
            res.sendStatus(200);
            console.log(err.toString());
        }

        File.findOne({fsFileName : fileData.fsFileName}, function(err, file){
            fileData._id = file._id;
            res.status(200).send(fileData);
        });

    });


};

function addExportFile(fileData){

  File.create(fileData, function (err, small) {
    if (err) return console.log(err);
  });

}

exports.getFiles = function (req, res) {

  File.find({fsSource: req.params.files})
    .exec(function (err, collection) {
        res.send(collection);
    });
};

exports.deletefile = function (req, res) {
    const id = req.params.id;

    fileDeletion(id);
    res.sendStatus(204);

};

function fileDeletion(id) {

    File.findById(id, function (err, doc){

        if(doc){

            File.remove({_id: id}, function (err) {
                if (err) {console.log(err);}
            });

            fs.unlink(uploaded + doc.fsFilePath, function (err) {
                if (err) {console.log(err)};
            });
        }
    });
}

exports.updateFileBook = function(req,res){
    const id = req.params.id;
    File.findById(id, function (err, doc){
        doc.fsBooked = 1;
        doc.fsAddedAt = new Date();
        doc.fsAddedBy = req.body.user;
        doc.save();
    });

    res.status(200).send(id);
};

exports.addExportFile = addExportFile;
