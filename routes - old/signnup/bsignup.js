const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const axios = require('axios');
const config = require('../../config/config');
var url = config.mongoURI;
var { sendotp } = require('../../services/smsservice');
module.exports = function (router) {
  // router.post('/verifyUser', (req, res1) => {
  //   let finalcode = Math.floor(1000 + Math.random() * 9000);

  //   sendotp(req.body.ph, finalcode);

  //   res1.json(finalcode);
  // });

  router.post('/signup', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('users')
        .findOne({ email: req.body.email }, function (err, result) {
          if (err) throw err;
          console.log(result);
          if (result == null) {
            let finalcode = Math.floor(1000 + Math.random() * 9000);
            console.log(finalcode);
            sendotp(req.body.ph, finalcode);

            res1.json({ message: 'success', data: finalcode });

            // var userobj = {
            //   userid: 0000000000,
            //   fbprofileid: '',
            //   firstName: ' ',
            //   lastName: '',
            //   phone: req.body.ph,
            //   email: req.body.email,
            //   devicetype: 'android',
            //   password: '',
            //   showpassword: req.body.pass,
            //   otp: 'false',
            //   salesempid: '',
            //   address: '',
            //   city: '',
            //   state: '',
            //   country: '',
            //   pin: '',
            //   profileImg: '',
            //   credit: 'No',
            //   activationKey: '',
            //   passwordKey: '',
            //   status: 'inactive',
            //   partialpayment: 'active',
            //   adcity: '',
            //   adstate: '',
            //   createdOn: '2020-05-24T10:20:23.000Z',
            //   modifiedOn: '2020-05-24T10:20:23.000Z',
            //   LastPresence: '2020-05-24T10:20:23.000Z',
            //   userrole: 'customer',
            // };
            // dbo.collection('users').insertOne(userobj, function (err, res) {
            //   if (err) throw err;
            //   ////console.log("1 document inserted");
            //   db.close();
            // });
            // res1.json('success');
          } else {
            res1.json({
              message: 'This Email Already Exist.Try SignIn your account',
            });
          }
        });
    });
  });

  router.post('/finalsignup', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('users')
        .findOne({ email: req.body.email }, function (err, result) {
          if (err) throw err;
          console.log(result);
          if (result == null) {
            var userobj = {
              userid: 0000000000,
              fbprofileid: '',
              firstName: ' ',
              lastName: '',
              phone: req.body.ph,
              email: req.body.email,
              devicetype: 'android',
              password: '',
              showpassword: req.body.pass,
              otp: 'false',
              salesempid: '',
              address: '',
              city: '',
              state: '',
              country: '',
              pin: '',
              profileImg: '',
              credit: 'No',
              activationKey: '',
              passwordKey: '',
              status: 'inactive',
              partialpayment: 'active',
              adcity: '',
              adstate: '',
              createdOn: '2020-05-24T10:20:23.000Z',
              modifiedOn: '2020-05-24T10:20:23.000Z',
              LastPresence: '2020-05-24T10:20:23.000Z',
              userrole: 'customer',
            };
            dbo.collection('users').insertOne(userobj, function (err, res) {
              if (err) throw err;

              ////console.log("1 document inserted");

              res1.json('success');
              db.close();
            });
            // res1.json('success');
          } else {
            res1.json('This Email Already Exist.Try SignIn your account');
          }
        });
    });
  });
};
