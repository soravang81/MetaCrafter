require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY || ""

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url:  `https://eth-sepolia.g.alchemy.com/v2/${api_key.toString()}`,
      chainId: 11155111,
      gasPrice: 25000,
      accounts: [
        private_key
      ]
    },
    holesky : {
      url: "https://eth-holesky.g.alchemy.com/v2/qHx1EyO6UyYMcympPKXlkCLOLScgrEXz",
      chainId: 17000,
      gasPrice: 250000,
      accounts: [
        private_key
      ]
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 25000000000,
      accounts: [
        private_key
      ]
    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/qHx1EyO6UyYMcympPKXlkCLOLScgrEXz",
      chainId: 80002,
      gasPrice: 18000,
      accounts: [
        private_key
      ]
    }
  },
};

