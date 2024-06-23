import { HardhatUserConfig } from "hardhat/types";
require("@nomiclabs/hardhat-ethers");

import dotenv from "dotenv"
dotenv.config()

const privateKey = process.env.privateKey || ""

module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: './artifacts', // Example path, customize as needed
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 25000000000,
      accounts: [
        privateKey
      ]
    }
  },
};