var express = require("express");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var morgan = require("morgan");
var bodyParser = require("body-parser");

// var app = express();
// app.use(morgan("dev"));

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());

// app.get("/", function(req, res, next) {
//   return res.status(200).send("pong");
// });

// app.post("/upload", upload.any(), function(req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any

//   console.log(req.body, "Body");
//   console.log(req.files, "files");

//   return res.status(200).send("nice");
// });

// app.listen(4000, function() {
//   console.log("Yep 4000!");
// });

var webshot = require("webshot");

const url =
  "https://www.yliopistonverkkoapteekki.fi/epages/KYA.sf/fi_FI/?ObjectPath=/Shops/KYA/Categories/Laakkeet-ja-e-resepti";
const filename = "00001.png";

var options = {
  // screenSize: {
  //   width: 320,
  //   height: 480
  // },
  // shotSize: {
  //   width: 320,
  //   height: "all"
  // },
  renderDelay: 5000,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0"
};

webshot(url, filename, function(err) {
  // screenshot now saved to google.png
  console.log("Done");
});
