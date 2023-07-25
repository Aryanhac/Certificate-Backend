const { File } = require("nft.storage");
const mime = require("mime");
const fs = require("fs");
const path = require("path");

const ipfsClient = require("ipfs-http-client");
const axios = require("axios");
const INFURA_PROJECT_ID = "";
const INFURA_API_SECRET_KEY = "";

const auth =
  "Basic " +
  Buffer.from(INFURA_PROJECT_ID + ":" + INFURA_API_SECRET_KEY).toString(
    "base64"
  );

const client = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

var ipfsDocLinks = [];
const ipfsImageLinks = [];

async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  const fr = new File([content], path.basename(filePath), { type });
  // console.log("5", fr, "5");
  return fr;
}

const uploadToIPFS = async (imgJson) => {
  ipfsDocLinks = [];
  for (let i = 0; i < imgJson.length; i++) {
    const image = await fileFromPath(imgJson[i].image);
    try {
      const added = await client.add({ content: image });
      const url = `https://degree-verification.infura-ipfs.io/ipfs/${added.path}`;
      ipfsDocLinks.push(url.toString());
      // console.log(url);
    } catch (error) {
      console.log(error);
    }
  }
  return ipfsDocLinks;
};

module.exports = { uploadToIPFS };
