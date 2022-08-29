const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const axios = require('axios');
const config = require('../../config/config');
var url = config.mongoURI;

var moment = require('moment');

const { promisify } = require('util');
const sleep = promisify(setTimeout);

module.exports = function (router) {
  router.post('/order', (req, res1) => {
    console.log('----------------------');
    console.log(req.body.carddata.shopid);

    req.body.buyerid = ObjectId(req.body.buyerid);

    req.body.carddata.productid = ObjectId(req.body.carddata.productid);
    req.body.carddata.shopid = ObjectId(req.body.carddata.shopid);

    req.body.time = new Date();
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo.collection('order').insertOne(req.body, function (err, res) {
        if (err) throw err;
        ////console.log("1 document inserted");
        db.close();
      });

      res1.json('Account created.Now signIn');
    });
  });
};
