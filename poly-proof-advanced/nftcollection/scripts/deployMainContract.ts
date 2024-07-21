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

  const NFTCollection = await ethers.getContractFactory('NFTCollection', wallet);


  const tx = await NFTCollection.deploy(fxPortalAddress, {
    gasLimit: 3000000,
    gasPrice: ethers.utils.parseUnits('6', 'gwei')
  });

  await tx.deployed();

  console.log('Contrsact deployed to address:', tx.address);
  console.log('Contract deployed ', tx.deployTransaction);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
