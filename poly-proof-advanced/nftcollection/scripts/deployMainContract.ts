import * as hre from "hardhat";
const { ethers } = hre as any
import dotenv from "dotenv";
dotenv.config()

const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY || ""
const url = process.env.NEXT_PUBLIC_ALCHEMY_API_URL || ""
const fxPortalAddress = "0xCf73231F28B7331BBe3124B907840A94851f9f11"

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/qHx1EyO6UyYMcympPKXlkCLOLScgrEXz");
  const wallet = new ethers.Wallet(private_key, provider);
  console.log("Deploying contracts with the account:", wallet.address);
  let nonce = await wallet.getTransactionCount(); // Fetch the current nonce

  const NFTCollection = await ethers.getContractFactory("NFTCollection", wallet);
  const tx = await NFTCollection.deploy(fxPortalAddress,{gasLimit : 3000000 , gasPrice : 300  , nonce : nonce++});
  // await tx.wait()

  console.log("Contract address:", tx.address);
  console.log("Contract address:", tx.deployTransaction);
  // console.log("Contract address:", token.deployTransaction);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });