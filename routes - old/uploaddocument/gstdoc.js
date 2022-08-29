const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const config = require('../../config/config');
var url = config.mongoURI;
var mongoose = require('mongoose');
var gridfs = require('gridfs-stream');
var fs = require('fs');

mongoose.connect(config.mongoURI);
mongoose.Promise = global.Promise;
gridfs.mongo = mongoose.mongo;
const upload = require('../../middleware/upload');
var connection = mongoose.connection;

const axios = require('axios');

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const storage = new GridFsStorage({ url });

// Set multer storage engine to the newly created object

module.exports = function (router) {
  router.post('/gstdocupload', upload.single('file'), (req, res, next) => {
    console.log('----------------------------------'); // ////console.log(res.req.file)

    console.log(res.req.file);
    var myid = req.body.uploderid;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('Documentverification')
        .findOne({ uploderid: ObjectId(myid) }, function (err, result) {
          if (result != null) {
            dbo.collection('Documentverification').updateOne(
              { uploderid: ObjectId(myid) },
              {
                $set: {
                  status: 'requested',
                  file: res.req.file.filename,
                  doctype: req.body.doctype,
                },
              },
              function (err, res) {
                if (err) throw err;
                ////console.log("1 document updated");

                //////  db.close();
                /// res.json("Request For Approvel Has been Again Sent")
              }
            );
          } else {
            var myobj = {
              uploderid: ObjectId(myid),
              status: 'requested',
              reasonbyadmin: '',
              file: res.req.file.filename,
              doctype: req.body.doctype,
            };
            dbo
              .collection('Documentverification')
              .insertOne(myobj, function (err, res) {
                if (err) throw err;
                ////console.log("1 document inserted");
                //// res.json("Request For Approvel Has been  Sent")
                db.close();
              });
          }
        });
    });
  });

  router.post('/readfile', (req, res, next) => {
    ////console.log('hahahha')
    MongoClient.connect(url, function (err, client) {
      if (err) {
        return res.render('index', {
          title: 'Uploaded Error',
          message: 'MongoClient Connection error',
          error: err.errMsg,
        });
      }
      const db = client.db('wholesaller');
      const collection = db.collection('fs.files');
      const collectionChunks = db.collection('fs.chunks');
      collection
        .find({ filename: '6012cba5e393ee405cad0b36' })
        .toArray(function (err, docs) {
          if (err) {
            ////console.log('hahahha')
          }
          if (!docs || docs.length === 0) {
            ////console.log('hahahha')
          } else {
            //Retrieving the chunks from the db
            collectionChunks
              .find({ files_id: ObjectId('6012cba4e393ee405cad0b35') })
              .sort({ n: 1 })
              .toArray(function (err, chunks) {
                if (err) {
                  ////console.log('hahahha')
                }
                if (!chunks || chunks.length === 0) {
                  //No data found
                  ////console.log('hahahha')
                }

                let fileData = [];
                for (let i = 0; i < chunks.length; i++) {
                  //This is in Binary JSON or BSON format, which is stored
                  //in fileData array in base64 endocoded string format

                  fileData.push(chunks[i].data.toString('base64'));
                }

                //Display the chunks using the data URI format
                let finalFile =
                  'data:' +
                  docs[0].contentType +
                  ';base64,' +
                  fileData.join('');
                ////console.log("-----------")
                res.json(finalFile);
                ////// ////console.log(finalFile)
              });
          }
        });
    });
  });

  router.get('/test123/::tagId', (req, res) => {
    ////console.log("ssssssssssssssssss")
    var filename = req.params.tagId;
    res.set({
      'Accept-Ranges': 'bytes',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Type': 'application/pdf',
    });
    gridfs.files.findOne({ filename: filename }, (err, file) => {
      if (!file || file.length === 0) {
        return res.status(404).json({
          error: "That File Doesn't Exist",
        });
      }
      if (file.contentType === 'application/pdf') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        res.json(readstream);
        // ////console.log(readstream)
        // readstream.pipe(res);
      } else {
        res.status(404).json({
          error: 'This is not an zip file',
        });
      }
    });
  });

  var connection = mongoose.connection;
  connection.on('error', console.error.bind(console, 'connection error:'));

  connection.once('open', () => {
    var gfs = gridfs(connection.db);

    // Upload a file from loca file-system to MongoDB

    router.get('/userdoc/:tagId', (req, res) => {
      ////console.log("-----------------=======-------------------------")

      var filename = req.params.tagId;
      // Check file exist on MongoDB

      gfs.exist({ filename: filename }, (err, file) => {
        if (err || !file) {
          res.status(404).send('File Not Found');
          return;
        }

        var readstream = gfs.createReadStream({ filename: filename });
        /// res.send(readstream)
        readstream.pipe(res);
      });
    });
  });
};
