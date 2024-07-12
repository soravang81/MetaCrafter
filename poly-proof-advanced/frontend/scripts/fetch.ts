import * as hre from "hardhat";
import NFTCollection from "../artifacts/contracts/NFTcollection.sol/NFTCollection.json";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const { ethers } = hre as any;
  const [owner] = await ethers.getSigners();

  const nftAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Replace with actual deployed contract address
  const nftABI = NFTCollection.abi;

  const nftContract = new ethers.Contract(nftAddress, nftABI, owner);
  type nft = {
    prompt : string;
    tokenUri: string;
  }

  const nfts:nft[] = []
  for (let i = 0; i < 5; i++) {
    const prompt = await nftContract.getTokenPrompt(i);
    const tokenUri = await nftContract.tokenURI(i);
    const nftz = {
      prompt : prompt,
      tokenUri : tokenUri,
    }
    console.log(nftz)
    nfts[i] = nftz
    console.log(`Prompt for NFT ${i + 1}: ${prompt}`);
  }
  console.log("nftssssssss  :    "+nfts)
  console.log("type  :    "+ typeof nfts)
  return nfts as nft[]
}

main()
  .then((nfts) => {
    console.log(nfts);
    if (process.send) {
      process.send(nfts.toString()); // Send the collected data as a string
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
