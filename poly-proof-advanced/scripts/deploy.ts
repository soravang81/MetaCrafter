import '@nomiclabs/hardhat-ethers'
import * as hre from 'hardhat'
const ethers = hre.ethers;

async function main() {
  const MyNFTCollection = await ethers.getContractFactory("MyNFTCollection");
  const nft = await MyNFTCollection.deploy(
    "MyNFTCollection",
    "MNFT",
    "ipfs://YOUR_BASE_URI/"
  );

  await nft.deployed();
  console.log("MyNFTCollection deployed to:", nft.address);

  // Add prompts for each NFT
  const prompts = [
    "Prompt for NFT 1",
    "Prompt for NFT 2",
    "Prompt for NFT 3",
    "Prompt for NFT 4",
    "Prompt for NFT 5"
  ];

  for (let prompt of prompts) {
    await nft.addPrompt(prompt);
    console.log(`Added prompt: ${prompt}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });