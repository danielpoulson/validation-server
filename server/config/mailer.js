const nodemailer = require("nodemailer");
const promisify = require("es6-promisify");
const pug = require("pug");
const config = require("./config");

const transport = nodemailer.createTransport({
  host: config.auth.MAIL_HOST,
  port: config.auth.MAIL_PORT,
  auth: {
    user: config.auth.MAIL_USER,
    pass: config.auth.MAIL_PASS
  }
});

const generateHTML = options => {
  const html = pug.renderFile(
    `${config.rootPath}server/views/mail.pug`,
    options
  );
  // const inlined = juice(html); //in line css styles for emails
  return html;
};

// exports.send = options => {
//   console.log(options);
// };

// CC_TDate, CC_No, CC_Descpt, CC_Champ
exports.send = options => {
  const html = generateHTML(options);

  const mailOptions = {
    from: "Validation Manager <noreply@deltalabs.com.au>",
    to: options.toEmail,
    subject: options.subject,
    html,
    text: "This will be filled in later"
  };

  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions).catch(err => console.log(err));
};
