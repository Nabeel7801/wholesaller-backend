const mongoose = require("mongoose")
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.ATLAS_URI)
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB Connection Successfull");
})

const app = express();
app.use(cors());  

app.use(express.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ---------- Admin Routes ----------
app.use(require("./routes/admin/admins"))

app.use(require("./routes/admin/products"))
app.use(require("./routes/admin/categories"))

app.use(require("./routes/admin/orders"))
app.use(require("./routes/admin/invoices"))

app.use(require("./routes/admin/payments"))

app.use(require("./routes/admin/users"))
app.use(require("./routes/admin/customers"))
app.use(require("./routes/admin/warehouses"))

// ---------- Rest of the App Routes ----------
app.use(require("./routes/users"))
app.use(require("./routes/categories"))
app.use(require("./routes/products"))

// ---------- Read Files Route ----------
app.use("/readfiles", require("./routes/images"))
app.use("/file", require("./routes/images"))



{/*
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const router = express.Router();

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const test = require('./routes/testit/test');
const editbusiness = require('./routes/Profile/Editbusiness');
const addlisting = require('./routes/addlisting/addlisting');
const dynamicdata = require('./routes/admin/dynamicdata');
const payment = require('./routes/payment/bpayment');
const gstdoc = require('./routes/uploaddocument/gstdoc');
const order = require('./routes/orders/order');
const sellerorder = require('./routes/orders/sellerorder');
const clientorder = require('./routes/orders/clientorder');
const trackusers = require('./routes/admin/trackusers');
const applyforForgetPass = require('./routes/forgetPass/applyforForgetPass');
const signup = require('./routes/signnup/bsignup');
const signin = require('./routes/signin/bsignin');
const fetchcards = require('./routes/fetchcards/fetchcards');
const sms_engine = require('./routes/testit/sms-engine');

app.use('/api', router);
app.get('/todos', function (req, res) {});
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

io.on('connection', (socket) => {});

trackusers(router);
fetchcards(router);
addlisting(router);
signup(router);
signin(router);
applyforForgetPass(router);
order(router);
test(router);
//gstbackend(router);
sellerorder(router);
clientorder(router);
payment(router);
sms_engine(router);
gstdoc(router);
editbusiness(router);
dynamicdata(router);

app.get('/readfiles/:img', (req, res1) => {
  res1.sendFile(path.join(__dirname + '/images/' + req.params.img));
});

app.post('/twilioresponse', (req, res) => {
	console.log("-------------twilio response-----");
	console.log(req.body);
	console.log("-------------twilio body-----");
	console.log(req.body.Body);
	const twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

module.exports = router;
*/}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")))

  app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })

} else {
  app.get("/", (req, res) => {
      res.send("Api Running")
  })
}

const port = process.env.PORT || 5000

app.listen(port, () =>
  console.log(`Running on PORT ${process.env.PORT || 5000}`)
);
