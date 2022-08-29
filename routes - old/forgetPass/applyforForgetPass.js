const EmailVerifySchema = require('../../model/email/emailVerify');
const ObjectId = require('mongodb').ObjectID;
const { mongoPoolPromise } = require('../../config/mongoPoolPromise');

const forgetPass = require('../../model/email/forgetPass');

const { sendEmail } = require('../../services/mailJetEmail');
var path = require('path');

module.exports = function (router) {
  router.post('/applyforgetpass', async (req, res) => {
    try {
      const { email } = req.body;

      dbo = await mongoPoolPromise();

      dbo
        .collection('users')
        .findOne({ email: email }, async function (err, result) {
          if (err) throw err;

          if (result != null) {
            const passRecoed = await forgetPass.create({
              email: email.toLowerCase(),
            });
            let uniquelink =
              'http://localhost:3001/' +
              'updatepass/' +
              encodeURIComponent(email) +
              '/' +
              passRecoed._id;

            console.log(uniquelink);

            var emailParameters = {
              email,

              uniquelink: uniquelink,
            };

            console.log(emailParameters);

            sendEmail(
              'Forget Password',
              emailParameters,
              'ForgetPass_Email_Body'
            );

            res.json('Email has been sent');
          } else {
            res.json('No Email found ');
          }
        });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'somrthing Went Wrong' });
    }
  });

  router.post('/updatepass', async (req, res) => {
    try {
      const { email, uniqueId, pass } = req.body;

      dbo = await mongoPoolPromise();

      dbo
        .collection('forgetpasses')
        .findOne(
          { _id: ObjectId(uniqueId), email: email },
          async function (err, result) {
            if (err) throw err;

            if (result != null) {
              var myquery = { email: email };
              var newvalues = {
                $set: { showpassword: pass },
              };
              dbo
                .collection('users')
                .updateOne(myquery, newvalues, function (err, res) {
                  if (err) throw err;

                  ///  db.close();
                });

              res.json('Password Has been Reset');
            } else {
              res.json('Enail expire or user not exist. Try again');
            }
          }
        );
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'somrthing Went Wrong' });
    }
  });
};
