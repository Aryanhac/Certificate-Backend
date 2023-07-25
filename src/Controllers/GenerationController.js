const sendToken = require("../../utils/SendToken");
const User = require("../Models/UserModel");
const asyncHandler = require("../../middleware/catchAsyncError");
const error = require("../../utils/Errorhandling");
const cloudinary = require("cloudinary");
const path = require("path");
const CryptoJS = require("crypto-js");
const fs = require("fs").promises;
const { readdirSync, rmSync } = require("fs");
const reader = require("xlsx");
const QRCode = require("qrcode");
const decompress = require("decompress");
const gm = require("gm").subClass({ imageMagick: true });
const im = require("imagemagick");
const axios = require("axios");
const { uploadToIPFS } = require("../../Blockchain/main");
const { generateCertificate } = require("../../Blockchain/index");

var urls1 = [];
var urls2 = [];
var ids = [];
async function readFile(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  return data;
}

// async function readExcel(filePath) {
//   const data = await fs.readFile(filePath, { encoding: "UTF-8" });
//   // let d = await data.toString();
//   return data;
// }

function uploadFile(fileName, file) {
  return new Promise((resolve, reject) => {
    file.mv(fileName, (err) => {
      if (err) {
        return next(new error(400, err.message));
      }
    });
    setTimeout(() => {
      resolve();
    }, [200]);
  });
}

// taking data from excel file
function extractDataFromExcel(fileName) {
  let data = [];
  // const fili = readExcel(
  //   path.join(__dirname, "..", "..", "Data", `${fileName}`)
  // );
  //for reading the file
  const file = reader.readFile(
    path.join(__dirname, "..", "..", "Data", `${fileName}`)
  );
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  temp.forEach((res) => {
    data.push(res);
  });

  fs.unlink(path.join(__dirname, "..", "..", "Data", `${fileName}`));

  return data;
}

// generating Data for each Certificate from excel and making unique CID
const generateData = asyncHandler(async (req, res, next) => {
  // for uploading file in system
  const fileName = Date.now() + "" + req.files.file.name;
  const file = req.files.file;
  const filePath = path.join(__dirname, "..", "..", "Data", `${fileName}`);

  await uploadFile(filePath, file);

  let certData = extractDataFromExcel(fileName);

  res.status(200).send({
    certData,
  });
});

// Generate Custom ID
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

// upload Certificate and generate ID and QR
const uploadCertificate = asyncHandler(async (req, res, next) => {
  const fileName = Date.now() + "" + req.files.file.name;
  const file = req.files.file;
  const filePath = path.join(__dirname, "..", "..", "Data", `${fileName}`);

  var images = [];
  var imagejson = [];
  var IQR = [];

  await uploadFile(filePath, file);

  const cert = await decompress(filePath, "Data", {
    map: (image) => {
      image.path = `ipfs-${image.path}`;
      images.push({ path: image.path, name: image.name });
      return image;
    },
  });

  // console.log(images, "imgs");
  // console.log(cert, "cert");

  //   uploads on url
  imagejson = [];
  for (var image of images) {
    const pathu = path.join(__dirname, "..", "..", "Data", `${image.path}`);
    let single = {
      name: image.name,
      discription: "This is a degree",
      image: pathu,
    };
    imagejson.push(single);
  }
  // console.log(imagejson, "imagejson");
  // console.log(urls, "urls");

  var newId = new Array(imagejson.length).fill(0);

  for (let j = 0; j < imagejson.length; j++) {
    let fil = readFile(imagejson[j].image);
    fil.then(function (result) {
      var ciphertext = CryptoJS.SHA1(result.toString().slice(-780)).toString();
      // console.log(ciphertext, "ciphertext", imagejson[j].image);
      let id = generateCustomID(ciphertext);
      // console.log(id, "id", ciphertext);
      newId[j] = id;
    });
  }

  urls1 = [];
  ids = newId;
  urls1 = await uploadToIPFS(imagejson);
  // console.log(urls1, ids);
  // await generateCertificate(newId, urls1);
  console.log("uploaded");

  for (var i = 0; i < newId.length; i++) {
    IQR.push({
      CID: newId[i],
    });
  }

  const dir = path.join(__dirname, "..", "..", "Data");

  readdirSync(dir).forEach((f) => {
    if (!f.includes("folder anchor")) {
      rmSync(`${dir}/${f}`);
    }
  });

  res.status(200).send({
    success: true,
    IQR,
  });
});

const uploadCertificate2 = asyncHandler(async (req, res, next) => {
  const fileName = Date.now() + "" + req.files.file.name;
  const file = req.files.file;
  const filePath = path.join(__dirname, "..", "..", "Data", `${fileName}`);

  var images = [];
  var imagejson = [];

  await uploadFile(filePath, file);

  const cert = await decompress(filePath, "Data", {
    map: (image) => {
      image.path = `ipfs-${image.path}`;
      images.push({ path: image.path, name: image.name });
      return image;
    },
  });

  // console.log(images, "imgs");
  // console.log(cert, "cert");

  //   uploads on url
  imagejson = [];
  for (var image of images) {
    const pathu = path.join(__dirname, "..", "..", "Data", `${image.path}`);
    let single = {
      name: image.name,
      discription: "This is a degree",
      image: pathu,
    };
    imagejson.push(single);
  }
  // console.log(imagejson, "imagejson");
  // console.log(urls, "urls");

  urls2 = [];
  urls2 = await uploadToIPFS(imagejson);
  // console.log(urls2, ids);
  await generateCertificate(ids, urls1, urls2);
  console.log("uploaded");

  const dir = path.join(__dirname, "..", "..", "Data");

  readdirSync(dir).forEach((f) => {
    if (!f.includes("folder anchor")) {
      rmSync(`${dir}/${f}`);
    }
  });

  res.status(200).send({
    success: true,
  });
});

module.exports = { generateData, uploadCertificate, uploadCertificate2 };
