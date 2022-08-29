const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const { mongoPoolPromise } = require('../../config/mongoPoolPromise');
const axios = require('axios');
const config = require('../../config/config');
var url = config.mongoURI;
const Category = require('../../model/email/CategorySchema');

const upload = require('../../middleware/upload');

module.exports = function (router) {
  function slugify(string) {
    const a =
      'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b =
      'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  const buildAncestors = async (id, parent_id) => {
    let ancest = [];
    try {
      let parent_category = await Category.findOne(
        { _id: parent_id },
        { name: 1, slug: 1, ancestors: 1 }
      ).exec();
      if (parent_category) {
        const { _id, name, slug } = parent_category;
        const ancest = [...parent_category.ancestors];
        ancest.unshift({ _id, name, slug });
        const category = await Category.findByIdAndUpdate(id, {
          $set: { ancestors: ancest },
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  router.post('/addnewcategory', upload.array('pics'), async (req, res) => {
    let pic = '';

    if (req.files != '') {
      pic = req.files[0].filename;
    }

    let parent = req.body.parent ? req.body.parent : null;
    const category = new Category({
      name: req.body.name,
      pic: pic,
      parent,
    });
    try {
      let newCategory = await category.save();
      buildAncestors(newCategory._id, parent);
      res.status(201).send({ response: `Category ${newCategory._id}` });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  router.post('/displaycategory', async (req, res) => {
    try {
      const result = await Category.find({})
        .select({
          _id: true,
          name: true,
          pic: true,
          'ancestors.slug': true,
          'ancestors.name': true,
        })
        .exec();
      res.status(201).send({ result });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  router.post('/descendants', async (req, res) => {
    console.log(req.body.category_id);

    try {
      const result = await Category.find({
        'ancestors._id': ObjectId(req.body.category_id),
      })
        .select({ _id: false, name: true, pic: true })
        .exec();
      res.status(201).send({ status: 'success', result: result });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  router.post('/renamecategory', async (req, res) => {
    const { category_id, category_name } = req.body;

    try {
      let res = await Category.findByIdAndUpdate(ObjectId(category_id), {
        $set: { name: category_name, slug: slugify(category_name) },
      });

      let res1 = await Category.update(
        { 'ancestors._id': category_id },
        {
          $set: {
            'ancestors.$.name': category_name,
            'ancestors.$.slug': slugify(category_name),
          },
        },
        { multi: true }
      );

      res.status(201).send({ status: 'success', result: 'dom' });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  router.post('/deleteCategory', async (req, res) => {
    const { category_id } = req.body;

    try {
      var err = await Category.findByIdAndRemove(ObjectId(category_id));
      if (!err)
        var result = await Category.deleteMany({
          'ancestors._id': ObjectId(category_id),
        });

      var err = await Category.findByIdAndRemove(ObjectId(category_id));
      if (!err)
        var result = await Category.deleteMany({
          'ancestors._id': ObjectId(category_id),
        });

      res.status(201).send({ status: 'success', result: result });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  router.post('/testnested', async (req, res1) => {
    console.log(req.body);
    dbo = await mongoPoolPromise();

    dbo.collection('testnested').insertMany([
      {
        _id: 'MongoDB',
        ancestors: ['Books', 'Programming', 'Databases'],
        parent: 'Databases',
      },
      {
        _id: 'dbm',
        ancestors: ['Books', 'Programming', 'Databases'],
        parent: 'Databases',
      },
      {
        _id: 'Databases',
        ancestors: ['Books', 'Programming'],
        parent: 'Programming',
      },
      {
        _id: 'Languages',
        ancestors: ['Books', 'Programming'],
        parent: 'Programming',
      },
      { _id: 'Programming', ancestors: ['Books'], parent: 'Books' },
      { _id: 'Books', ancestors: [], parent: null },
    ]);

    dbo
      .collection('testnested')
      .findOne({ _id: 'MongoDB' })
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
      });

    res1.json('done');
  });

  router.post('/adddesciption', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('dynamicdata')
        .findOne(
          { maindesp: req.body.maindesp, uniquevalue: req.body.uniquevalue },
          function (err, result) {
            if (err) throw err;

            if (result == null) {
              dbo
                .collection('dynamicdata')
                .insertOne(req.body, function (err, res) {
                  if (err) throw err;
                  ////console.log("1 document inserted");
                  //// db.close();
                });
            } else {
              var myquery = {
                maindesp: req.body.maindesp,
                uniquevalue: req.body.uniquevalue,
              };
              var newvalues = {
                $set: { itemsdescription: req.body.itemsdescription },
              };
              dbo
                .collection('dynamicdata')
                .updateOne(myquery, newvalues, function (err, res) {
                  if (err) throw err;

                  ///  db.close();
                });
            }
          }
        );
    });
  });

  router.post('/addcolors', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('dynamicdata')
        .findOne({ maindesp: 'colors' }, function (err, result) {
          if (err) throw err;

          if (result == null) {
            dbo
              .collection('dynamicdata')
              .insertOne(
                { maindesp: 'colors', itemscolor: req.body.itemscolor },
                function (err, res) {
                  if (err) throw err;
                  ////console.log("1 document inserted");
                  //// db.close();
                }
              );
          } else {
            var myquery = { maindesp: 'colors' };
            var newvalues = { $set: { itemscolor: req.body.itemscolor } };
            dbo
              .collection('dynamicdata')
              .updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;

                ///  db.close();
              });
          }
        });
    });
  });

  router.post('/addsizes', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('dynamicdata')
        .findOne({ maindesp: 'sizes' }, function (err, result) {
          if (err) throw err;

          if (result == null) {
            dbo
              .collection('dynamicdata')
              .insertOne(
                { maindesp: 'sizes', itemssize: req.body.itemssize },
                function (err, res) {
                  if (err) throw err;
                  ////console.log("1 document inserted");
                  //// db.close();
                }
              );
          } else {
            var myquery = { maindesp: 'sizes' };
            var newvalues = { $set: { itemssize: req.body.itemssize } };
            dbo
              .collection('dynamicdata')
              .updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                ////console.log("1 document updated");
                ///  db.close();
              });
          }
        });
    });
  });

  router.post('/addcategory', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('dynamiccategory')
        .findOne({ midcategoty: req.body.midcategoty }, function (err, result) {
          if (err) throw err;

          if (result == null) {
            dbo
              .collection('dynamiccategory')
              .insertOne(req.body, function (err, res) {
                if (err) throw err;
                ////console.log("1 document inserted");
                //// db.close();
              });
          } else {
            var myquery = { midcategoty: req.body.midcategoty };
            var newvalues = {
              $set: {
                itemscategory: req.body.itemscategory,
              },
            };
            dbo
              .collection('dynamiccategory')
              .updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                ////console.log("1 document updated");
                ///  db.close();
              });
          }
        });
    });
  });

  router.post('/addmaincategory', async (req, res1) => {
    console.log(req.body);
    dbo = await mongoPoolPromise();

    dbo
      .collection('maincategories')
      .findOne({ searchTag: req.body.searchTag }, function (err, result) {
        if (err) throw err;

        if (result == null) {
          dbo
            .collection('maincategories')
            .insertOne(req.body, function (err, res) {
              if (err) throw err;
              ////console.log("1 document inserted");
              //// db.close();
            });
        } else {
          var myquery = { searchTag: req.body.searchTag };
          var newvalues = {
            $set: {
              maincategory: req.body.maincategory,
            },
          };
          dbo
            .collection('maincategories')
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              ////console.log("1 document updated");
              ///  db.close();
            });

          res1.json('done');
        }
      });
  });

  router.post('/addtagstoDatabase', async (req, res1) => {
    console.log(req.body);
    dbo = await mongoPoolPromise();

    dbo
      .collection('alltags')
      .findOne({ maincategory: req.body.midcategoty }, function (err, result) {
        if (err) throw err;

        if (result == null) {
          dbo.collection('alltags').insertOne(req.body, function (err, res) {
            if (err) throw err;
            ////console.log("1 document inserted");
            //// db.close();
          });
        } else {
          var myquery = { maincategory: req.body.midcategoty };
          var newvalues = {
            $set: {
              tagsList: req.body.tagsList,
            },
          };
          dbo
            .collection('alltags')
            .updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              ////console.log("1 document updated");
              ///  db.close();
            });

          res1.json('done');
        }
      });
  });

  router.post('/fetchcolors', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('dynamicdata')
        .findOne({ maindesp: 'colors' }, function (err, result) {
          if (err) throw err;

          res1.json(result);
        });
    });
  });

  router.post('/fetchsizes', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('dynamicdata')
        .findOne({ maindesp: 'sizes' }, function (err, result) {
          if (err) throw err;

          res1.json(result);
        });
    });
  });

  router.post('/fetchdesp', async (req, res1) => {
    dbo = await mongoPoolPromise();
    allposts = await dbo.collection('dynamicdata').aggregate([]).toArray();
    ////console.log(allposts)

    res1.json(allposts);
  });

  router.post('/fetchcolors', (req, res1) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('wholesaller');

      dbo
        .collection('dynamicdata')
        .findOne({ maindesp: 'colors' }, function (err, result) {
          if (err) throw err;

          res1.json(result);
        });
    });
  });

  router.post('/fetchcategory', (req, res1) => {
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

        var query = {};

        allposts = await dbo
          .collection('dynamiccategory')
          .aggregate([])
          .toArray();
        ////console.log(allposts)

        res1.json(allposts);
      }
    );
  });

  router.post('/fetchmaincategory', async (req, res1) => {
    var allposts = [];
    //   var checksubscribe=[];
    dbo = await mongoPoolPromise();

    var query = {};

    allposts = await dbo.collection('maincategories').aggregate([]).toArray();
    ////console.log(allposts)

    res1.json(allposts);
  });

  router.post('/fetchalltags', async (req, res1) => {
    var allposts = [];
    //   var checksubscribe=[];
    dbo = await mongoPoolPromise();

    var query = {};

    allposts = await dbo.collection('alltags').aggregate([]).toArray();
    ////console.log(allposts)

    res1.json(allposts);
  });

  router.post('/fetchdesciption', (req, res1) => {
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

        var query = {};

        allposts = await dbo
          .collection('dynamicdata')
          .aggregate([{ $match: { uniquevalue: 'desciption' } }])
          .toArray();

        res1.json(allposts);
      }
    );
  });
};
