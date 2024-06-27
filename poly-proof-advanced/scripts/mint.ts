import * as hre from "hardhat"
const ethers = hre.ethers;

async function main() {
  const MyNFTCollection = await hre.ethers.getContractFactory("MyNFTCollection");
  const nft = MyNFTCollection.attach("YOUR_DEPLOYED_CONTRACT_ADDRESS");

  const [owner] = await hre.ethers.getSigners();

  const promptsCount = await nft.getPromptsCount();

  for (let i = 0; i < promptsCount.toNumber(); i++) {
    await nft.mint(owner.address, i);
    console.log(`Minted NFT ${i} to ${owner.address}`);
    const prompt = await nft.promptDescription(i);
    console.log(`Prompt for NFT ${i}: ${prompt}`);
  }
}

main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });