import * as hre from 'hardhat';
const { ethers } = hre as any;
import NFTCollection from '../artifacts/contracts/NFTcollection.sol/NFTCollection.json';

const tokenAddress = "0x0743efCD6Db225096E12cCb532691d25e5383Ec6";

const tokenABI = NFTCollection.abi;
const walletAddress = process.env.NEXT_PUBLIC_WALLET_PUBLIC_ADDRESS || ""

async function main() {

  const token = await ethers.getContractAt(tokenABI, tokenAddress);
  // console.log(token);
  console.log("You now have: " + await token.balanceOf(walletAddress) + " tokens");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});