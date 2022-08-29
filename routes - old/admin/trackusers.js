const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const { mongoPoolPromise } = require('../../config/mongoPoolPromise');

const userName = 'adminwhoseller.com';
const pass = 'b2budannetwork';


const axios = require('axios');
const config = require('../../config/config');

var connection = require('../../config/dbconnection');
var url = config.mongoURI;

module.exports = function (router) {
  router.post('/fetchpendingusers', (req, res1) => {
    var allposts = [];
    //   var checksubscribe=[];

    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      async function (err, db) {
        if (err) throw err;
        var dbo = db.db('wholesaller');
        /*Return only the documents with the address "Park Lane 38":*/
        var query = {};

        allposts = await dbo
          .collection('Documentverification')
          .aggregate([
            { $match: {} },
            { $sort: { _id: -1 } },
            {
              $lookup: {
                from: 'users',
                localField: 'uploderid',
                foreignField: '_id',
                as: 'users',
              },
            },

            { $unwind: '$users' },
          ])
          .toArray();

        res1.json(allposts);
      }
    );
  });

  router.post('/fetchpendingsellers', (req, res1) => {
    var allposts = [];
    //   var checksubscribe=[];

    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      async function (err, db) {
        if (err) throw err;
        var dbo = db.db('wholesaller');
        /*Return only the documents with the address "Park Lane 38":*/
        var query = {};

        allposts = await dbo
          .collection('sellerverification')
          .aggregate([
            { $match: {} },
            { $sort: { _id: -1 } },
            {
              $lookup: {
                from: 'users',
                localField: 'uploderid',
                foreignField: '_id',
                as: 'users',
              },
            },

            { $unwind: '$users' },
          ])
          .toArray();

        res1.json(allposts);
      }
    );
  });

  router.post('/fetchonlybuyer', (req, res1) => {
    var allposts = [];
    //   var checksubscribe=[];

    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      async function (err, db) {
        if (err) throw err;
        var dbo = db.db('wholesaller');
        /*Return only the documents with the address "Park Lane 38":*/
        var query = {};

        allposts = await dbo
          .collection('users')
          .aggregate([
            { $match: { userrole: 'customer' } },
            ////  { $sort: { _id: -1 } },
          ])
          .toArray();

        res1.json(allposts);
      }
    );
  });
  router.post('/fetchonlyseller', (req, res1) => {
    var allposts = [];
    //   var checksubscribe=[];

    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      async function (err, db) {
        if (err) throw err;
        var dbo = db.db('wholesaller');
        /*Return only the documents with the address "Park Lane 38":*/
        var query = {};

        allposts = await dbo
          .collection('users')
          .aggregate([
            { $match: { userrole: 'seller' } },
            ////  { $sort: { _id: -1 } },
          ])
          .toArray();

        res1.json(allposts);
      }
    );
  });
  router.post('/approveuser', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('Documentverification')
        .updateOne(
          { _id: ObjectId(req.body.id) },
          { $set: { status: 'approved' } },
          function (err, res) {
            if (err) throw err;
            ////console.log("1 document updated");

            db.close();
            res1.json('user approved');
          }
        );
    });
  });

  router.post('/canceluser', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('Documentverification')
        .updateOne(
          { _id: ObjectId(req.body.id) },
          { $set: { status: 'rejected' } },
          function (err, res) {
            if (err) throw err;
            ////console.log("1 document updated");

            db.close();
            res1.json('user approved');
          }
        );
    });
  });

  router.post('/applyforseller', (req, res1) => {
    var myid = req.body.id;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('sellerverification')
        .findOne({ uploderid: ObjectId(myid) }, function (err, result) {
          if (result != null) {
            dbo.collection('sellerverification').updateOne(
              { uploderid: ObjectId(myid) },
              {
                $set: {
                  status: 'requested',
                  businessname: req.body.businessname,

                  businesstype: req.body.businesstype,
                  category: req.body.category,
                },
              },
              function (err, res) {
                if (err) throw err;
                ////console.log("1 document updated");

                //////  db.close();
                res1.json('Request For Approvel Has been Again Sent');
              }
            );
          } else {
            var myobj = {
              uploderid: ObjectId(myid),
              status: 'requested',
              reasonbyadmin: '',
              businessname: req.body.businessname,

              businesstype: req.body.businesstype,
              category: req.body.category,
            };
            dbo
              .collection('sellerverification')
              .insertOne(myobj, function (err, res) {
                if (err) throw err;
                ////console.log("1 document inserted");
                res1.json('Request For Approvel Has been  Sent');
                db.close();
              });
          }
        });
    });
  });

  router.post('/approveseller', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('sellerverification')
        .updateOne(
          { _id: ObjectId(req.body.id) },
          { $set: { status: 'approved' } },
          function (err, res) {
            if (err) throw err;
            ////console.log("1 document updated");
            db.close();
            res1.json('Approved');
          }
        );
    });
  });

  router.post('/cancelseller', async (req, res1) => {
    db = await connection.connect();
    var dbo = db.db('wholesaller');

    dbo
      .collection('sellerverification')
      .updateOne(
        { _id: ObjectId(req.body.id) },
        { $set: { status: 'rejected' } },
        function (err, res) {
          if (err) throw err;
          ////console.log("1 document updated");
        }
      );
  });

  router.get('/checking', async (req, res1) => {
    dbo = await mongoPoolPromise();

    var myobj = { name: 'Company Inc', address: 'Highway 37' };
    dbo.collection('customers').insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log('1 document inserted');
    });
  });

  router.post('/verifyAdmin', (req, res1) => {
    console.log(req.body);
    if (req.body.email == userName && req.body.pass == pass) {
      res1.json('success');
    } else {
      res1.json('fail');
    }
  });
};
