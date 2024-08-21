const { EtherscanProvider } = require("@ethersproject/providers");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY || ""

module.exports = {
  solidity: "0.8.20",
  etherscan : {
    apiKey : {
      sepolia : "9F68321DYYE3I34QAANI6I4GQDZ3YIGHYU"
    }
  },
  networks: {
    amoy: {
      url:  `https://eth-sepolia.g.alchemy.com/v2/${api_key.toString()}`,
      chainId: 11155111,
      gasPrice: 250000,
      accounts: [
        private_key
      ]
    },
    holesky : {
      url: `https://eth-holesky.g.alchemy.com/v2/${api_key.toString()}`,
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
    // amoy: {
    //   url: `https://polygon-amoy.g.alchemy.com/v2/${api_key.toString()}`,
    //   chainId: 80002,
    //   gasPrice: 18000000,
    //   accounts: [
    //     private_key
    //   ]
    // },
    mumbai: {
      url: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL,
      chainId: 80001,
      gasPrice: 18000000,
      accounts: [
        private_key
      ]
    }
  },
};

