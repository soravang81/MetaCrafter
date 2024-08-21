import * as hre from 'hardhat';
const { ethers } = hre as any;

const FX_ROOT_ADDRESS = "0xF9bc4a80464E48369303196645e876c8C7D972de";
const NFT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

async function main() {
  try {
    console.log('Starting transfer process...');
    console.log('NFT_ADDRESS:', NFT_ADDRESS);
    console.log('FX_ROOT_ADDRESS:', FX_ROOT_ADDRESS);

    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    const nftCollection = await NFTCollection.attach(NFT_ADDRESS);
    console.log('NFTCollection attached');

    const FxRoot = await ethers.getContractAt("IFxRoot", FX_ROOT_ADDRESS);
    console.log('FxRoot contract instance created');

    const [owner] = await ethers.getSigners();
    console.log('Owner address:', owner.address);

    // Get current gas price
    const gasPrice = await ethers.provider.getGasPrice();
    console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

    // Use 110% of current gas price
    const adjustedGasPrice = gasPrice.mul(110).div(100);
    console.log('Adjusted gas price:', ethers.utils.formatUnits(adjustedGasPrice, 'gwei'), 'gwei');

    // Approve all tokens
    for (let i = 0; i < 5; i++) {
      console.log(`Approving NFT ${i}...`);
      const approveTx = await nftCollection.approve(FX_ROOT_ADDRESS, i, {
        gasLimit: 100000, // Reduced gas limit
        gasPrice: adjustedGasPrice
      });
      await approveTx.wait();
      console.log(`Approved NFT ${i}`);
    }

    // Deposit all tokens
    for (let i = 0; i < 5; i++) {
      console.log(`Depositing NFT ${i}...`);
      const depositTx = await FxRoot.deposit(NFT_ADDRESS, owner.address, i, "0x", {
        gasLimit: 200000, // Reduced gas limit
        gasPrice: adjustedGasPrice
      });
      await depositTx.wait();
      console.log(`Deposited NFT ${i} to Amoy`);
    }

    // Get the child token address on Amoy
    const childTokenAddress = await FxRoot.rootToChildToken(NFT_ADDRESS);
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