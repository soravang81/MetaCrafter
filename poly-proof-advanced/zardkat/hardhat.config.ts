import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-circom";
import circuits = require('./circuits.config.json')
import dotenv from "dotenv"
dotenv.config()
import "./tasks/newcircuit.ts"
``
const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || ""
const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY || ""

process.env.BASE_PATH = __dirname;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.6.11",
      }
    ]
  },
  networks: {
    sepolia: {
      url:  `https://eth-sepolia.g.alchemy.com/v2/${api_key.toString()}`,
      chainId: 11155111,
      gasPrice: 250000000,
      accounts: [
        private_key
      ]
    },
    holesky : {
      url: `https://eth-holesky.g.alchemy.com/v2/${api_key.toString()}`,
      chainId: 17000,
      gasPrice: 25000000,
      accounts: [
        private_key
      ]
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 250000,
      accounts: [
        private_key
      ]
    },
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${api_key.toString()}`,
      chainId: 80002,
      gasPrice: 3000000,
      accounts: [
        private_key
      ]
    }
  },
  circom: {
    inputBasePath: "./circuits",
    ptau: "powersOfTau28_hez_final_12.ptau",
    circuits: JSON.parse(JSON.stringify(circuits))
  },
};



export default config;
