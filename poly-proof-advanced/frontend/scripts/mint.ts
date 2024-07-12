import * as hre from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const { ethers } = hre as any
  const promptsString = process.env.NEXT_PUBLIC_PROMPTS;
  const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

  const prompts = promptsString ? JSON.parse(promptsString) : [
    "Default Prompt for NFT 1",
    "Default Prompt for NFT 2",
    "Default Prompt for NFT 3",
    "Default Prompt for NFT 4",
    "Default Prompt for NFT 5"
  ];
  const uris = JSON.parse(baseUri as string);
  console.log(uris);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log(`Deployer balance: ${balance.toString()}`);


  const nftAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Replace with actual deployed contract address
  const fxPortalAddress = process.env.NEXT_PUBLIC_FX_PORTAL_ADDRESS; // Replace with actual FxPortal address

  const NFTCollection = await ethers.getContractFactory("NFTCollection", deployer);
  const nft = NFTCollection.attach(nftAddress);

  console.log("NFTCollection deployed to:", nft.address);

  const gasPrice = await deployer.provider.getGasPrice();
  const higherGasPrice = gasPrice.mul(ethers.BigNumber.from(2)); // Double the current gas price

  let nonce = await deployer.getTransactionCount(); // Fetch the current nonce
  const mintPromises = prompts.map(async (prompt: string, i: number) => {
    const imageURI = uris[i];
    const tx = await nft.mint(deployer.address, imageURI, prompt, {
      gasPrice: higherGasPrice,
      nonce: nonce++ // Manually increment the nonce
    });
    await tx.wait(); // Wait for the transaction to be mined
    console.log(`Minted NFT ${i + 1} with image URI "${imageURI}", and prompt "${prompt}"`);
  });

  await Promise.all(mintPromises);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to deploy script:", error);
    process.exit(1);
  });
