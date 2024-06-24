const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

const privateKey = process.env.privateKey || ""

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deploying contracts with the account:", wallet.address);

  const initialSupply = "1000" 
  const DegenToken = await ethers.getContractFactory("DegenToken", wallet);
  const token = await DegenToken.deploy(initialSupply);

  console.log("DegenToken address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
