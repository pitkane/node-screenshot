require("dotenv").config();

const fs = require("fs"); //Load the filesystem module
const axios = require("axios");

const webshot = require("webshot");
const moment = require("moment");

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
  var initialFileSize = 0;
  var errorRaised = false;

  for (var index = 0; index < 50000; index++) {
    var filename = pad(iterationCycle, 8); // 0010
    // filename = filename + "_" + moment().format("DD-MM-YYY-HHss") + ".png";
    filename = filename + "_" + moment().format("DD-MM-YYY-HHmmss") + ".png";
    console.log(filename);

    const fileSize = await takeScreenshot(url, filename, options);
    if (iterationCycle === 1) {
      initialFileSize = fileSize;
    } else {
      // if the difference is more than 10KB
      if (fileSize + 10000 < initialFileSize) {
        errorRaised = true;
        console.log("THE PAGE IS BROKEN!!!");
        const timestamp = moment().format("HH:mm:ss");
        const payload = {
          text:
            "<https://www.yliopistonverkkoapteekki.fi/epages/KYA.sf/fi_FI/?ObjectPath=/Shops/KYA/Categories/Laakkeet-ja-e-resepti|yliopistonverkkoapteekki.fi> on rikki :( -- " +
            timestamp,
          icon_emoji: ":ghost:"
        };
        await sendStatusText(payload);
      } else {
        if (errorRaised == true) {
          const timestamp = moment().format("HH:mm:ss");
          const payload = {
            text: "ja taas toimii! -- " + timestamp,
            icon_emoji: ":ghost:"
          };
          await sendStatusText(payload);
          errorRaised = false;
        }
      }
      // 285052
      // 258728
    }

    iterationCycle += 1;
  }
})();

function takeScreenshot(url, filename, options) {
  return new Promise((resolve, reject) => {
    const filePath = "screenshots/" + filename;
    webshot(url, filePath, options, function(shot, err) {
      if (err) {
        console.log(err);
        return reject();
      }
      const fileSize = getFilesizeInBytes(filePath);
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

function sendStatusText(payload) {
  return new Promise((resolve, reject) => {
    const slackURL = process.env.SLACK_WEBHOOK_URL;

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
  try {
    const stats = fs.statSync(filename);
  } catch (error) {
    console.log("Shhhh, its ok", error);
  }
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
