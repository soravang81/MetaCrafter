import * as hre from 'hardhat';
const { ethers } = hre as any;
import NFTCollection from '../artifacts/contracts/NFTcollection.sol/NFTCollection.json';
import * as dotenv from "dotenv";

// const tokenAddress = "0xB775c70674D2AE4C93EA1faF257327Da958FF36E";
const tokenAddress = "0xD25B3bA26009300f5657d166Ebc8A1Cc8f471E13";

const tokenABI = NFTCollection.abi;
const walletAddress = process.env.NEXT_PUBLIC_WALLET_PUBLIC_ADDRESS || ""

async function main() {

    const token = await ethers.getContractAt(tokenABI, tokenAddress);

    console.log("You now have: " + await token.balanceOf(walletAddress) + " tokens");
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });