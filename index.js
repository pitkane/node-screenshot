var express = require("express");
var multer = require("multer");
// var upload = multer({ dest: "uploads/" });
var morgan = require("morgan");
var bodyParser = require("body-parser");

const fs = require("fs"); //Load the filesystem module

require('dotenv').config()

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

let result = (async function () {
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
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0"
  };

  var iterationCycle = 1;
  var initialFileSize = 0

  for (var index = 0; index < 50000; index++) {
    var filename = pad(iterationCycle, 8); // 0010
    // filename = filename + "_" + moment().format("DD-MM-YYY-HHss") + ".png";
    filename = filename + "_" + moment().format("DD-MM-YYY-HHmmss") + ".png";
    console.log(filename);

    const fileSize = await takeScreenshot(url, filename, options);
    if (iterationCycle === 1) {
      initialFileSize = fileSize
    } else {
      // if the difference is more than 10KB
      if (fileSize + 10000 < initialFileSize) {
        console.log("THE PAGE IS BROKEN!!!")
        await sendStatusText()
      }
      // 285052
      // 258728
    }

    iterationCycle += 1;
  }
})();


function takeScreenshot(url, filename, options) {
  return new Promise((resolve, reject) => {
    const filePath = "screenshots/" + filename
    webshot(url, filePath, options, function (shot, err) {
      if (err) {
        console.log(err);
        return reject();
      }
      const fileSize = getFilesizeInBytes(filePath)
      console.log(`Screenshot taken: ${filename}, with size: ${fileSize}`);
      return resolve(fileSize);
    });
  });
}

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function sendStatusText() {
  return new Promise((resolve, reject) => {
    const slackURL = process.env.SLACK_WEBHOOK_URL
    const payload = {
      text: "<https://www.yliopistonverkkoapteekki.fi/epages/KYA.sf/fi_FI/?ObjectPath=/Shops/KYA/Categories/Laakkeet-ja-e-resepti|yliopistonverkkoapteekki.fi> on taas rikki :(",
      icon_emoji: ":ghost:"
    };

    // send request to Slack
    axios
      .post(slackURL, payload)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename)
  const fileSizeInBytes = stats.size
  return fileSizeInBytes
}
