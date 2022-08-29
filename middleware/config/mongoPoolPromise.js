const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://localhost:27017/wholesaller";

let connPoolPromise = null;

const mongoPoolPromise = () => {
  if (connPoolPromise) return connPoolPromise;

  connPoolPromise = new Promise((resolve, reject) => {
    const conn = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (conn.isConnected()) {
      console.log("already connected");
      return resolve(conn);
    } else {
      console.log(" connected new");
      conn
        .connect()
        .then(() => {
          return resolve(conn.db("wholesaller"));
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    }
  });

  return connPoolPromise;
};

module.exports = {
  mongoPoolPromise,
};
