require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
// require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("dotenv").config({ path: "config/config.env" });

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.7",
  networks: {
    mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      // gas: 2100000,
      // gasPrice: 80000000,
    },
  },
};
