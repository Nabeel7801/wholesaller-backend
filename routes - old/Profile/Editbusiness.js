const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const axios = require('axios');
const config = require('../../config/config');
var url = config.mongoURI;

module.exports = function (router) {
  router.post('/businessedit', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');
      var myquery = { _id: ObjectId(req.body.id) };

      var newvalues = {
        $set: {
          firstName: req.body.name,
          email: req.body.email,
          profileImg: req.body.img,
          phone: req.body.phone,
          address: req.body.address,
        },
      };
      dbo
        .collection('users')
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;

          dbo
            .collection('users')
            .findOne({ _id: ObjectId(req.body.id) }, function (err, result) {
              if (err) throw err;
              // ////console.log(result);

              res1.json(result);
            });
        });
    });
  });

  router.post('/applyforseller', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');
      var myquery = { _id: ObjectId(req.body.id) };

      var newvalues = { $set: { pin: 'seller' } };
      dbo
        .collection('users')
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
        });
    });
  });
};
