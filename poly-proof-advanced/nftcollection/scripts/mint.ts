import * as hre from 'hardhat';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const { ethers } = hre as any;
  const promptsString = process.env.NEXT_PUBLIC_PROMPTS;
  const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

  const prompts = promptsString ? JSON.parse(promptsString) : [
    'Default Prompt for NFT 1',
    'Default Prompt for NFT 2',
    'Default Prompt for NFT 3',
    'Default Prompt for NFT 4',
    'Default Prompt for NFT 5'
  ];
  const uris = JSON.parse(baseUri as string);
  console.log(uris);

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  const balance = await deployer.getBalance();
  console.log(`Deployer balance: ${balance.toString()}`);

  const nftAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; 
  const fxPortalAddress = process.env.NEXT_PUBLIC_FX_PORTAL_ADDRESS;

  const NFTCollection = await ethers.getContractFactory('NFTCollection', deployer);
  const nft = NFTCollection.attach(nftAddress);

  console.log('NFTCollection deployed to:', nft.address);

  const gasPrice = await deployer.provider.getGasPrice();
  const higherGasPrice = gasPrice.mul(ethers.BigNumber.from(2)); 

  let nonce = await deployer.getTransactionCount(); 

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const imageURI = uris[i];
    const tx = await nft.mint(deployer.address, imageURI, prompt, {
      gasPrice: higherGasPrice,
      nonce: nonce++ 
    });
    await tx.wait(); 
    console.log(`Minted NFT ${i + 1} with image URI "${imageURI}", and prompt "${prompt}"`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to deploy script:', error);
    process.exit(1);
  });
