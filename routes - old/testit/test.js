var path = require('path');

var isstart = false;

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: 'randomlarka78@gmail.com', // generated ethereal user
    pass: 'Randomlarka@78', // generated ethereal password
  },
});

module.exports = function (router) {
	
	
	
	
	
	
  router.post('/encoderSoftEmail', async (req, res) => {
    try {
      const { name, email, message } = req.body;

      let info = await transporter.sendMail({
        from: 'randomlarka78@gmail.com', // sender address
        to: 'infoencodersoft@gmail.com', // list of receivers
        Subject: ' new cilent reach Wah', // Subject line
        text: name + '\n' + email + '\n' + message, // plain text body
      });

      console.log('Message sent: %s', info.messageId);

      res.send('done');
    } catch(err){
		
		
		console.log(err)
	}
  });
};
