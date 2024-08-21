import * as hre from 'hardhat';
const { ethers } = hre as any;
import dotenv from 'dotenv';
dotenv.config();

const private_key = process.env.NEXT_PUBLIC_PRIVATE_KEY || '';
const url = process.env.NEXT_PUBLIC_ALCHEMY_API_URL || '';
const fxPortalAddress = process.env.NEXT_PUBLIC_FX_PORTAL_ADDRESS;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(private_key, provider);
  console.log('Deploying contracts with the account:', wallet.address);

  // Get the current gas price
  const gasPrice = await provider.getGasPrice();
  console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

  // Get the current nonce
  const nonce = await provider.getTransactionCount(wallet.address);
  console.log(`Current nonce: ${nonce}`);

  const NFTCollection = await ethers.getContractFactory('NFTCollection', wallet);
  
  try {
    const tx = await NFTCollection.deploy(fxPortalAddress, {
      gasLimit: 3000000, // Increased gas limit
      gasPrice: gasPrice.mul(120).div(100), // Use 120% of current gas price
      nonce: nonce
    });

    console.log('Contract deploying to address:', tx.address);
    console.log('Transaction hash:', tx.deployTransaction.hash);

    await tx.deployed();
    console.log('Contract deployed successfully');
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });