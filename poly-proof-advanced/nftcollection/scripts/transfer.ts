import * as hre from 'hardhat';
const { ethers } = hre as any;
import FxAbi from "../app/fxabi.json"

const FX_ROOT_ABI = FxAbi;
const FX_ROOT_ADDRESS = "0x9E688939Cb5d484e401933D850207D6750852053";
const NFT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

async function main() {
  try {
    console.log('Starting transfer process...');
    console.log('NFT_ADDRESS:', NFT_ADDRESS);
    console.log('FX_ROOT_ADDRESS:', FX_ROOT_ADDRESS);

    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    const nftCollection = await NFTCollection.attach(NFT_ADDRESS);
    console.log('NFTCollection attached');

    const [owner] = await ethers.getSigners();
    console.log('Owner address:', owner.address);

    const fxRootContract = new ethers.Contract(FX_ROOT_ADDRESS, FX_ROOT_ABI, owner); // Connect with signer
    console.log('FxRoot contract instance created with signer');

    // Get current gas price
    const gasPrice = await ethers.provider.getGasPrice();
    console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

    // Use 110% of current gas price
    const adjustedGasPrice = gasPrice.mul(110).div(100);
    console.log('Adjusted gas price:', ethers.utils.formatUnits(adjustedGasPrice, 'gwei'), 'gwei');

    // Approve all tokens
    for (let i = 0; i < 5; i++) {
      const approveTx = await nftCollection.approve(FX_ROOT_ADDRESS, i, {
        gasLimit: 300000, 
        gasPrice: adjustedGasPrice
      });
      console.log(`Approving NFT ${i}...txHash : ${approveTx.hash}`);
      await approveTx.wait();
      console.log(`Approved NFT ${i}`);
    }

    // Deposit all tokens
    for (let i = 0; i < 5; i++) {
      console.log(`Depositing NFT ${i}...`);
      const depositTx = await fxRootContract.deposit(NFT_ADDRESS, owner.address, i, "0x", {
        gasLimit: 300000, 
        gasPrice: adjustedGasPrice
      });
      console.log(`Deposit tx ${i}...`, depositTx.hash);
      await depositTx.wait();
      console.log(`Deposited NFT ${i} to Amoy`);
    }

    // Get the child token address on Amoy
    const childTokenAddress = await fxRootContract.rootToChildTokens(NFT_ADDRESS);
    console.log(`Child token address on Amoy: ${childTokenAddress}`);
  } catch (error) {
    console.error('Error in transfer process:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
