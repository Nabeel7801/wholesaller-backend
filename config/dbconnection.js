const MongoClient = require("mongodb").MongoClient;
const mongo_url = "mongodb://encodersoft1:Arbisoftisbest1@194.233.77.156:27017/wholesaller?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false";

module.exports = {
  connect: async function (callback) {
    var connection;
    await new Promise((resolve, reject) => {
      MongoClient.connect(
        mongo_url,
        {
          useNewUrlParser: true,
        },
        (err, database) => {
          if (err) reject();
          else {
            connection = database;
            resolve();
          }
        }
      );
    });
    return connection;
  },
};
