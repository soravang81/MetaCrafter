const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

const api_key = process.env.REACT_APP_ALCHEMY_API_KEY || ""
const private_key = process.env.REACT_APP_PRIVATE_KEY || ""

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys : [private_key.toString()],
        providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/${api_key.toString()}`
      }),
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 2500000000,
      timeoutBlocks: 20000,
      networkCheckTimeout: 100000,
      // maxPriorityFeePerGas: 2000000000, // Set max priority fee
      // maxFeePerGas: 2500000000, 
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  }
};