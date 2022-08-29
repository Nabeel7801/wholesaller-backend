const WolframAlphaAPI = require("wolfram-alpha-api");
const waApi = WolframAlphaAPI("UX77RX-H8TT7UWETJ");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const googleMapKey = "AIzaSyAhwDsbb1ky0UUyUXm-YlCDsD7diI83g9U";

const Message = require("../../model/sms/smsMessage");
const axios = require("axios").default;
module.exports = function (router) {
  async function sendOnlyText(text, res) {
    console.log("---------text---");
    console.log(text);

    const twiml = new MessagingResponse();

    twiml.message(text);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }

  async function sendWithImage(image, res) {
    console.log("---------image---");
    console.log(image);

    const twiml = new MessagingResponse();

    const message = twiml.message();
    /////message.body(text);
    message.media(image);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }

  async function showAllheader(result, res) {
    let finalString = "";

    for (let i = 0; i < result.pods.length; i++) {
      let title = result.pods[i].title;
      if (title != "Input interpretation" || title != "Result"  ) {
        if (finalString != "") {
          finalString = finalString + "\n" + title.toLowerCase();
        } else {
          finalString = title.toLowerCase();
        }
      }
    }

    return finalString;
  }

  async function checkIsItOldQuery(result, subtitle, req, res) {
    subtitle = subtitle.toLowerCase();

    subtitle = subtitle.trim();

    for (let i = 0; i < result.pods.length; i++) {
      let compareTitle = result.pods[i].title;
      compareTitle = compareTitle.toLowerCase();

      if (compareTitle == subtitle) {
        if (result.pods[i].subpods[0].plaintext == "") {
          sendWithImage(result.pods[i].subpods[0].img.src, res);
        } else {
          sendOnlyText(result.pods[i].subpods[0].plaintext, res);
        }

        return;
      }
    }
    thisISNewSMS(req, res);
  }

  async function isHaveResult(result, res) {
    let finalresult = "";

    for (let i = 0; i < result.pods.length; i++) {
      let compareId = result.pods[i].id;

      if (compareId == "Result") {
        if (result.pods[i].subpods[0].plaintext == "") {
          sendWithImage(result.pods[i].subpods[0].img.src, res);
        }

        finalresult = result.pods[i].subpods[0].plaintext;
      }
    }

    return finalresult;
  }

  async function thisISNewSMS(req, res) {
    let apiRes = await waApi.getFull({
      input: req.body.Body,
      output: "json",
    });

    console.log(apiRes);

    if (apiRes.pods == "undefined" || apiRes.pods == undefined) {
      sendOnlyText("Sorry, nothing found", res);
    } else {
      let dataToSave = req.body;
      dataToSave.ApiResponse = apiRes;

      ////  console.log(dataToSave);

      let checkResult = await isHaveResult(apiRes, res);

      let allheaders = await showAllheader(apiRes, res);
      /////console.log(checkResult);
      console.log("-------------all header===");
      console.log(allheaders);

      if (allheaders == "RESULT") {
        if (apiRes.pods[1].subpods[0].plaintext == "") {
          sendWithImage(apiRes.pods[1].subpods[0].img.src, res);
        } else {
          sendOnlyText(apiRes.pods[1].subpods[0].plaintext, res);
        }
      } else {
        const sms = await Message.create(dataToSave);

        let messageBackSend = `\n${checkResult}\n\nREPLY FOR MORE:\n${allheaders}`;

        sendOnlyText(messageBackSend, res);
      }
    }
    ///// console.log(messageBackSend);
  }

  async function getGooglemap(orgin, destination, res) {
    let response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${orgin}&destination=${destination}&mode=driving&key=${googleMapKey}`
    );

    let thires = `https://maps.googleapis.com/maps/api/staticmap?&size=500x500&path=weight:6%7Ccolor:0x0352A0CC%7Cenc:${encodeURIComponent(
      response.data.routes[0].overview_polyline.points
    )}&key=${googleMapKey}`;

    sendWithImage(thires, res);
  }

  router.post("/recieveSMS", async (req, res) => {
    try {
      let fullstring = req.body.Body.toLowerCase();

      console.log(fullstring);

      if (
        fullstring.includes("get route") ||
        fullstring.includes("get directions")
      ) {
        console.log(
          "----------------------------------------------saeed-----------------"
        );
        let myNewString;

        if (fullstring.includes("get route")) {
          myNewString = fullstring.replace("get route from ", "");
        }
        if (fullstring.includes("get directions")) {
          myNewString = fullstring.replace("get directions from ", "");
        }

        let from = myNewString.split(" ")[0];

        let to = fullstring.split(" ").slice(-1)[0];
        ///console.log(from);
        ///console.log(to);
        getGooglemap(from, to, res);
      } else {
        ///// console.log(req.body.Body);
        ////
        //// console.log(req.body.From);

        const findIsLast = await Message.findOne({ From: req.body.From }).sort({
          _id: -1,
        });

        ///console.log(findIsLast);

        if (findIsLast == null) {
          thisISNewSMS(req, res);

          /////// console.log('new fresh SMS');
        } else {
          let isold = await checkIsItOldQuery(
            findIsLast.ApiResponse,
            req.body.Body,
            req,
            res
          );

          /////console.log(isold);

          // if (isold == false) {

          //   thisISNewSMS(req, res);
          // } else {
          //   console.log(isold);
          // }
        }

        //// return res.status(200).json({ message: 'data saved' });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "something Went Wrong" });
    }
  });
};
