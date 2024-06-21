const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

const api_key = process.env.REACT_APP_ALCHEMY_API_KEY || ""
const private_key = process.env.REACT_APP_PRIVATE_KEY || ""

module.exports = {
  networks: {
    development: {
      url: "http://127.0.0.1:8545", // URL for Ganache CLI
      accounts: [`0x75f7433ee014b238699fad1e3e43ac6aa4f9e485bf090a03d833e1b819a276b9`],
      network_id: 1718700028844,
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys : [private_key.toString()],
        providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/${api_key.toString()}`
      }),
      network_id: 11155111,
      gas: 5500000,
      gasPrice: 20000000000,
      timeoutBlocks: 2000,
      networkCheckTimeout: 100000,
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