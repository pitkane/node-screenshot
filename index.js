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
var moment = require("moment");
var sleep = require("sleep");

let result = (async function() {
  var url =
    "https://www.yliopistonverkkoapteekki.fi/epages/KYA.sf/fi_FI/?ObjectPath=/Shops/KYA/Categories/Laakkeet-ja-e-resepti";
  // var filename = "screenshots/00001.png";

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

  var iterationCycle = 1;

  for (var index = 0; index < 10000; index++) {
    var filename = pad(iterationCycle, 6); // 0010
    filename = filename + "_" + moment().format("DD-MM-YYY-HHss") + ".png";
    console.log(filename);

    await takeScreenshot(url, filename, options);

    iterationCycle += 1;
  }
})();

function takeScreenshot(url, filename, options) {
  return new Promise((resolve, reject) => {
    webshot(url, "screenshots/" + filename, options, function(err) {
      if (err) {
        console.log(err);
        return reject();
      }
      console.log(`Screenshot taken: ${filename}`);
      return resolve();
    });
  });
}

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
