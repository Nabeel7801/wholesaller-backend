const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const axios = require("axios");
const config = require("../../config/config");
var url = config.mongoURI;

var crypto = require("crypto");

module.exports = function (router) {
  router.get(
    "/request/:appId/:orderId/:orderAmount/:orderCurrency/:orderNote/:customerName/:customerPhone",
    function (req, res, next) {
      // 	var user_id = req.param('id');
      // ///////console.log(user_id)

      // ////console.log(req.params)
      var postData = req.params;

      postData.returnUrl = "http://localhost:5000/api/response";
      postData.notifyUrl = "https://www.cashfree.com/";

      postData.customerEmail = "saeedartists@gmail.com";

      // ////console.log(req.params.name)
      // var postData = {
      // 	"appId" : req.body.appId,
      // 	"orderId" : req.body.orderId,
      // 	"orderAmount" : req.body.orderAmount,
      // 	"orderCurrency" : req.body.orderCurrency,
      // 	"orderNote" : req.body.orderNote,
      // 	'customerName' : req.body.customerName,
      // 	"customerEmail" : req.body.customerEmail,
      // 	"customerPhone" : req.body.customerPhone,
      // 	"returnUrl" : req.body.returnUrl,
      // 	"notifyUrl" : req.body.notifyUrl
      // },
      postData,
        (mode = "TEST"),
        (secretKey = "fdda6aae302a8d921b4739c50b8b9b8a6a0cde52"),
        (sortedkeys = Object.keys(postData)),
        (url = ""),
        (signatureData = "");
      sortedkeys.sort();
      for (var i = 0; i < sortedkeys.length; i++) {
        k = sortedkeys[i];
        signatureData += k + postData[k];
      }
      var signature = crypto
        .createHmac("sha256", secretKey)
        .update(signatureData)
        .digest("base64");
      postData["signature"] = signature;
      if (mode == "PROD") {
        url = "https://www.cashfree.com/checkout/post/submit";
      } else {
        url = "https://test.cashfree.com/billpay/checkout/post/submit";
      }
      ////////console.log(postData)

      res.render("request", { postData: JSON.stringify(postData), url: url });
    }
  );

  router.post("/response", function (req, res, next) {
    ////console.log("-----------------------------------------------")
    var postData = {
        orderId: req.body.orderId,
        orderAmount: req.body.orderAmount,
        referenceId: req.body.referenceId,
        txStatus: req.body.txStatus,
        paymentMode: req.body.paymentMode,
        txMsg: req.body.txMsg,
        txTime: req.body.txTime,
      },
      secretKey = "fdda6aae302a8d921b4739c50b8b9b8a6a0cde5",
      signatureData = "";
    for (var key in postData) {
      signatureData += postData[key];
    }
    var computedsignature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureData)
      .digest("base64");
    postData["signature"] = req.body.signature;
    postData["computedsignature"] = computedsignature;

    console.log(postData);

    res.render("response", { postData: JSON.stringify(postData) });
  });
};
