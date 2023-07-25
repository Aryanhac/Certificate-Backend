const ContractJson = require("./context/Certification.json");
const hre = require("hardhat");

const abi = ContractJson.abi;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

// generate certificate
const generateCertificate = async (cid, Links1, Links2) => {
  const alchemy = new hre.ethers.providers.AlchemyProvider("maticmum", API_KEY);
  const userWallet = new hre.ethers.Wallet(PRIVATE_KEY , alchemy);
  const Certification = new hre.ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    userWallet
  );
  // console.log(userWallet);

  // Write
  // console.log("Writing to contract...");
  const tx = await Certification.addCertificate(cid, Links1, Links2, {
    gasLimit: 5000000,
  });
  // console.log("waiting for transaction to be mined...");
  await tx.wait();
  console.log("Degree generated successfully");
};

// get certificate link
const fetchCertificateLink = async (cid) => {
  const alchemy = new hre.ethers.providers.AlchemyProvider("maticmum", API_KEY);
  const userWallet = new hre.ethers.Wallet(PRIVATE_KEY, alchemy);
  // console.log(userWallet);
  const Certification = new hre.ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    userWallet
  );

  try {
    const certificateIpfsLink = await Certification.certificateExist(cid); // cid
    // console.log(certificateIpfsLink);

    // return decryptedUrl;
    return certificateIpfsLink;
  } catch (error) {
    return error.reason;
  }
};

// console.log("Successfully done");

module.exports = { generateCertificate, fetchCertificateLink };
