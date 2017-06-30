  "use strict";
  /*eslint no-console: 0*/
  const nodemailer = require('nodemailer');
  const xoauth2 = require('xoauth2');
  const Users = require('../controllers/users');
  const config = require('./config');
  const utils = require('./utils');
  const path = require('path');
  const fs = require('fs');
  const rootPath = path.normalize(__dirname);

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS 
    }
  });


function createHtml(toEmail, emailType, emailActivity) {
  const emailSubject = "You have been assigned ownership of a " + emailType;

 // let _auth = {
 //        xoauth2: xoauth2.createXOAuth2Generator({
 //            user: config.auth.user,
 //            clientId: config.auth.clientId,
 //            clientSecret: config.auth.clientSecret,
 //            refreshToken: config.auth.refreshToken,
 //            accessToken: config.auth.accessToken
 //        })
 //    };

  // let transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: _auth
  // });


  fs.readFile(rootPath + '/mail.html', 'utf8', function(err, html){
      if (err) {
        console.log('Error Reading html file: ' + err);
      }
    
    const _html = '<html><body STYLE="font-size: 12pt/14pt; font-family:sans-serif"><h3>You have been assigned ownership of this '
    + emailType + '</h3></br>' + emailActivity + '</br>' + html + '</body></html>';

    transporter.sendMail({
        from: process.env.MAIL_EMAIL,
        to: toEmail, // An array if you have multiple recipients.
        subject: emailSubject,
        html: _html
      },
      function (err, info) {
      if (err) {
        console.log('Error sending mail: ' + err);
      }

      transporter.close();
    });
  });


};

function sendEmail(body){
  const _targetDate = utils.dpFormatDate(body.TKTarg);
  const emailType = "Change Control - Task";
  const emailActivity = '<b>Associated Change Control - </b><em>' + body.SourceId + '</em></br><b>Task to Complete: </b><i>'
   + body.TKName + '<b>  Date Due </b>' + _targetDate + '</i>';

  const p = Users.getUserEmail(body.TKChamp).exec();

  p.then(function(res){
    const _toEmail = res[0].email;
    createHtml(_toEmail, emailType, emailActivity);
  }).catch(function (err) {
    console.log(err);
  });

}

exports.sendEmail = sendEmail;
