import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;