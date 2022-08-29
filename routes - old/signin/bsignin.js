const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

const axios = require('axios');
const config = require('../../config/config');
var url = config.mongoURI;

var { sendotp } = require('../../services/smsservice');
module.exports = function (router) {
  function sendotp(myph, code) {
    var ph = '91' + myph;

    const axios = require('axios');
    var url =
      'https://api.textlocal.in/send/?apikey=akrUIXWaqFE-Dzmso5T12G2gWQo8X6u99aSwFHz3Vf&numbers=' +
      myph +
      '&sender=WHOSLR&message=' +
      encodeURIComponent(
        'This is your one-time password ' + code + '- Prayash E-commerce'
      );
    axios
      .get(url)
      .then(function (response) {
        ////console.log(response.data);
      })
      .catch(function (error) {
        ////console.log(error);
      });
  }

  router.post('/signin', (req, res1) => {
    var finalcode = Math.floor(1000 + Math.random() * 9000);
    ////console.log(finalcode);

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('users')
        .findOne(
          { email: req.body.email, showpassword: req.body.pass },
          function (err, result) {
            if (err) throw err;

            if (result == null) {
              res1.json('fail');
            } else {
              /// sendotp(result.phone,finalcode)
              ///result["otp"] = finalcode;

              ///  sendotp()

              res1.json(result);
            }
          }
        );
    });
  });

  router.post('/signinbyph', (req, res1) => {
    var finalcode = Math.floor(1000 + Math.random() * 9000);
    ////console.log(finalcode);

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('users')
        .findOne({ phone: req.body.ph }, function (err, result) {
          if (err) throw err;

          if (result == null) {
            res1.json('fail');
          } else {
            sendotp(result.phone, finalcode);
            result['otp'] = finalcode;

            ///  sendotp()

            res1.json(result);
          }
        });
    });
  });

  router.post('/fetchcurrentstatus', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('Documentverification')
        .findOne(
          { uploderid: mongoose.Types.ObjectId(req.body.id) },
          function (err, result) {
            if (err) throw err;
            console.log('hhhhh');

            res1.json(result);
            //   if (result == null) {

            //     res1.json("fail");
            //   }

            // else{
            //  /// sendotp(result.phone,finalcode)
            //   ///result["otp"] = finalcode;

            // ///  sendotp()

            //   ////console.log(result)
            //     res1.json(result);
            // }
          }
        );
    });
  });

  router.post('/fetchsellerstatus', (req, res1) => {
    console.log(req.body);

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db('wholesaller');

        dbo.collection('sellerverification').findOne(
          {
            uploderid: mongoose.Types.ObjectId(req.body.id),
          },
          function (err, result) {
            if (err) throw err;
            console.log(result);
            console.log(err);

            res1.json(result);
          }
        );
      }
    );

    //           var allposts=[];
    //           //   var checksubscribe=[];

    //               MongoClient.connect(url, {
    //                 useNewUrlParser: true,
    //                 useUnifiedTopology: true,
    //               },async function(err, db) {
    //                 if (err) throw err;
    //                 var dbo = db.db("wholesaller");
    //                 /*Return only the documents with the address "Park Lane 38":*/
    //                 var query = {};

    //                 allposts= await dbo.collection('sellerverification').aggregate([
    //                   { $match : {
    //                     uploderid:mongoose.Types.ObjectId(req.body.id)

    //                   }},

    //                  ]).toArray()

    //                 console.log(allposts)

    //                               res1.json(allposts);

    //                });
  });
};
