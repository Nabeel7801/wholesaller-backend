const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const axios = require("axios");
const config = require("../../config/config");
var url = config.mongoURI;
const fs = require("fs");
var path = require("path");
const multer = require("multer");

module.exports = function (router) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images");
    },
    filename: function (req, file = {}, cb) {
      cb(null, (printname = file.originalname));
      filename = printname;
    },
  });

  const upload = multer({ storage });

  router.post("/uploddata", upload.array("file"), (req, res1) => {
    const file = req.file; // file passed from client
    const meta = req.body; // all other values passed from the client, like name, etc..
    res1.json("uploded");
  });

  router.post("/addsets", (req, res1) => {
    req.body.maindetails.uploderid = ObjectId(req.body.maindetails.uploderid);

    ////req.body.maindetails.mainimage
    let imgname =
      Math.floor(100000 + Math.random() * 900000) + "-" + Date.now() + ".png";
    let buff = Buffer.from(
      req.body.maindetails.mainimage.substring(
        23,
        req.body.maindetails.mainimage.length
      ),
      "base64"
    );
    fs.writeFileSync(path.dirname("routes") + "/images/" + imgname, buff);

    req.body.maindetails.mainimage = imgname;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      dbo.collection("addlisting").insertOne(req.body, function (err, res) {
        if (err) throw err;

        db.close();

        console.log(res.ops[0]._id);

        res1.json(res.ops[0]._id);
      });

      ////  res1.json("Account created.Now signIn");
    });
  });

  router.post("/storeallsets", (req, res1) => {
    req.body.mainid = ObjectId(req.body.mainid);

    // for (var i = 0; i < req.body.storeallsets.length; i++) {
    //   for (var j = 0; j < req.body.storeallsets[i].length; j++) {
    //     let imgname =
    //       Math.floor(100000 + Math.random() * 900000) +
    //       "-" +
    //       Date.now() +
    //       ".png";
    //     let buff = Buffer.from(
    //       req.body.storeallsets[i][j].img.substring(
    //         23,
    //         req.body.storeallsets[i][j].img.length
    //       ),
    //       "base64"
    //     );
    //     fs.writeFileSync(path.dirname("routes") + "/images/" + imgname, buff);

    //     req.body.storeallsets[i][j].img = imgname;
    //   }
    // }
    // console.log("loop excuted");
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      dbo.collection("storeallsets").insertOne(req.body, function (err, res) {
        if (err) throw err;

        db.close();

        console.log(res.ops[0]._id);

        res1.json(res.ops[0]._id);
      });

      ////  res1.json("Account created.Now signIn");
    });
  });

  router.post("/setdetails", (req, res1) => {
    req.body.mainid = ObjectId(req.body.mainid);

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      dbo.collection("setdetails").insertOne(req.body, function (err, res) {
        if (err) throw err;

        db.close();

        console.log(res.ops[0]._id);

        res1.json(res.ops[0]._id);
      });

      ////  res1.json("Account created.Now signIn");
    });
  });

  router.post("/foredit", (req, res1) => {
    req.body.mainid = ObjectId(req.body.mainid);

    req.body.foredit.allsets;

    // for (var i = 0; i < req.body.foredit.allsets.length; i++) {
    //   for (var j = 0; j < req.body.foredit.allsets[i].length; j++) {
    //     let imgname =
    //       Math.floor(100000 + Math.random() * 900000) +
    //       "-" +
    //       Date.now() +
    //       ".png";
    //     let buff = Buffer.from(
    //       req.body.foredit.allsets[i][j].img.substring(
    //         23,
    //         req.body.foredit.allsets[i][j].img.length
    //       ),
    //       "base64"
    //     );
    //     fs.writeFileSync(path.dirname("routes") + "/images/" + imgname, buff);

    //     req.body.foredit.allsets[i][j].img = imgname;
    //   }
    // }

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      dbo.collection("foredit").insertOne(req.body, function (err, res) {
        if (err) throw err;

        db.close();

        console.log(res.ops[0]._id);

        res1.json(res.ops[0]._id);
      });

      ////  res1.json("Account created.Now signIn");
    });
  });

  router.post("/editaddsets", (req, res1) => {
    console.log(req.body);

    req.body.maindetails.uploderid = ObjectId(req.body.maindetails.uploderid);

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      var myquery = { _id: ObjectId(req.body.iseditornew) };
      var newvalues = { $set: { maindetails: req.body.maindetails } };

      dbo
        .collection("addlisting")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;

          db.close();
        });

      console.log("done");
      res1.json("Account created.Now signIn");
    });
  });

  /////

  router.post("/editstoreallsets", (req, res1) => {
    // for (var i = 0; i < req.body.storeallsets.length; i++) {
    //   for (var j = 0; j < req.body.storeallsets[i].length; j++) {
    //     let imgname =
    //       Math.floor(100000 + Math.random() * 900000) +
    //       "-" +
    //       Date.now() +
    //       ".png";
    //     let buff = Buffer.from(
    //       req.body.storeallsets[i][j].img.substring(
    //         23,
    //         req.body.storeallsets[i][j].img.length
    //       ),
    //       "base64"
    //     );
    //     fs.writeFileSync(path.dirname("routes") + "/images/" + imgname, buff);

    //     req.body.storeallsets[i][j].img = imgname;
    //   }
    // }

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      var myquery = { mainid: ObjectId(req.body.iseditornew) };
      var newvalues = { $set: { storeallsets: req.body.storeallsets } };

      dbo
        .collection("storeallsets")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;

          db.close();
        });

      res1.json("Account created.Now signIn");
    });
  });

  router.post("/editsetdetails", (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      var myquery = { mainid: ObjectId(req.body.iseditornew) };
      var newvalues = { $set: { setdetails: req.body.setdetails } };

      dbo
        .collection("setdetails")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;

          db.close();
        });

      res1.json("Account created.Now signIn");
    });
  });

  ////
  router.post("/editforedit", (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      var myquery = { mainid: ObjectId(req.body.iseditornew) };
      var newvalues = { $set: { foredit: req.body.foredit } };

      dbo
        .collection("foredit")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;

          db.close();
        });

      res1.json("Account created.Now signIn");
    });
  });

  ////

  router.post("/addtocart", (req, res1) => {
    ///////console.log(req.body)

    /// req.body.maindetails.uploderid=ObjectId(req.body.maindetails.uploderid)

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      dbo.collection("carts").insertOne(req.body, function (err, res) {
        if (err) throw err;

        db.close();
      });

      res1.json("Account created.Now signIn");
    });
  });

  router.post("/addlisting", (req, res1) => {
    // var nameArr = req.body.pics.split(',');
    // req.body.pics = nameArr;

    // var array=[];

    // array.push(req.body.pics)
    // array.push(req.body.pic2)
    // array.push(req.body.pic3)
    // array.push(req.body.pic4)

    req.body.pics[0] = req.body.pics[0].split(" ").join("+");
    req.body.pics[1] = req.body.pics[1].split(" ").join("+");
    req.body.pics[2] = req.body.pics[2].split(" ").join("+");
    req.body.pics[3] = req.body.pics[3].split(" ").join("+");
    req.body.uploderid = ObjectId(req.body.uploderid);

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("wholesaller");

      dbo.collection("addlisting").insertOne(req.body, function (err, res) {
        if (err) throw err;
        ////console.log("1 document inserted");
        db.close();
      });

      res1.json("Account created.Now signIn");
    });
  });
};
