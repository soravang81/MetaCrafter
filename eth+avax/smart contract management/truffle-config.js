const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
// import HDWalletProvider from "@truffle/hdwallet-provider"
// import dotenv from "dotenv";
// dotenv.config();

const api_key = process.env.REACT_APP_ALCHEMY_API_KEY || ""
const private_key = process.env.REACT_APP_PRIVATE_KEY || ""
console.log(private_key , api_key)

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys : [private_key.toString()],
        providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/${api_key.toString()}`
      }),
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 100000000,
      timeoutBlocks: 2000,
      networkCheckTimeout: 100000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
};