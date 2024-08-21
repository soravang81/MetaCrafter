import "@nomiclabs/hardhat-ethers"
import dotenv from "dotenv"
dotenv.config()

const privateKey = process.env.privateKey || ""

module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: './artifacts'
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      gasPrice: 2500000000,
      accounts: [
        privateKey
      ]
    }
  },
};