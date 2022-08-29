const {
  forget_Email_Body,
} = require('../services/Emails_Templetes/forget_Email');
const nodemailer = require('nodemailer');
async function sendEmail(subject, data, Email_templete) {
  /////console.log(process.env.Email_MAIL_JET)

  var Email_Templete_Name = ``;

  if (Email_templete == 'ForgetPass_Email_Body') {
    Email_Templete_Name = await forget_Email_Body(data);
  }

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: data.email, // list of receivers
    Subject: subject, // Subject line
    //// text: "Hello world?", // plain text body
    html: Email_Templete_Name, // html body
  });

  console.log('Message sent: %s', info.messageId);
}

module.exports.sendEmail = sendEmail;
