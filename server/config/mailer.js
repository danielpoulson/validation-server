const nodemailer = require('nodemailer');
const promisify = require('es6-promisify');
const pug = require('pug');
const config = require('./config');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS 
  }
});

const generateHTML = (options) => {
  const html = pug.renderFile(`${config.rootPath}server/views/mail.pug`, options);
  // const inlined = juice(html); //in line css styles for emails
  return html;
};

// CC_TDate, CC_No, CC_Descpt, CC_Champ
exports.send = (options) => {

  const html = generateHTML(options);

  const mailOptions = {
    from: 'Daniel Poulson <daniel.poulson@fmc.com>',
    to: options.toEmail,
    subject: options.subject,
    html,
    text: 'This will be filled in later'
  };

  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions).catch(err => console.log(err));
}