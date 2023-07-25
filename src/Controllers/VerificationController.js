const asyncHandler = require("../../middleware/catchAsyncError");
const error = require("../../utils/Errorhandling");
const { fetchCertificateLink } = require("../../Blockchain/index");
const CryptoJS = require("crypto-js");
const { default: axios } = require("axios");
const https = require("https");

const verification = asyncHandler(async (req, res, next) => {
  const val = await fetchCertificateLink(req.body.id);

  const generateCustomID = (ID) => {
    var str = "";
    var index = 0;
    for (var i = 0; i < 10; i++) {
      var substr = ID.substring(index, index + 4);
      var per = i % 4;
      str += substr.charAt(3 - per);
      index = index + 4;
    }
    return str;
  };

  const url1 = val[0];
  const url2 = val[1];
  var data = "";
  var id = "";

  await https
    .get(url1, (res) => {
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        var ciphertext = CryptoJS.SHA1(data.toString().slice(-780)).toString();
        // console.log(ciphertext, "cy");
        id = generateCustomID(ciphertext);
        // console.log(id, "id");
      });
    })
    .on("error", (err) => {
      console.log(err.message);
    });

  setTimeout(() => {
    if (id === req.body.id) {
      res.status(200).send({
        link: url2,
      });
    } else {
      // console.log("invalid ID");
    }
  }, 10000);
});

const download = asyncHandler(async (req, res, next) => {
  const val = await fetchCertificateLink(req.body.id);
  const url2 = val[1];
  var data = "";
  var id = "";
  res.status(200).send({
    link: url2,
  });
});

module.exports = { verification, download };
