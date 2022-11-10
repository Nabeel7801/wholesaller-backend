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
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','DELETE','UPDATE','PUT'],
  exposedHeaders: ['Content-Range'],
}));  

app.use(express.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ---------- Admin Routes ----------
app.use("/api", require('./portals/admin'))

// ---------- Rest of the App Routes ----------
app.use("/api", require("./routes/users"))
app.use("/api", require("./routes/categories"))
app.use("/api", require("./routes/products"))

// ---------- Read Files Route ----------
app.use("/api/readfiles", require("./routes/images"))
app.use("/api/file", require("./routes/images"))

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
