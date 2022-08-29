const MongoClient = require("mongodb").MongoClient;
const mongo_url = "mongodb://localhost:27017/wholesaller";

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
