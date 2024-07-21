import * as hre from 'hardhat';
const { ethers } = hre as any;
import NFTCollection from '../artifacts/contracts/NFTcollection.sol/NFTCollection.json';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();
  const nftAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const fxPortalAddress = process.env.NEXT_PUBLIC_FX_PORTAL_ADDRESS;
  
  const NFT = await ethers.getContractAt('NFTCollection', nftAddress, owner);
  const nextTokenId = await NFT.nextTokenId();

  for (let i = 0; i < nextTokenId.toNumber(); i++) {
    try {
      let tx = await NFT.connect(owner).approve(fxPortalAddress, i,{
        gasLimit: 3000000, 
        gasPrice: ethers.utils.parseUnits('6', 'gwei'), 
      });
      console.log("approve : ",tx)
      await tx.wait();
      
      const depositData = ethers.utils.defaultAbiCoder.encode(["uint256"], [i]);

      const IFxPortal = new ethers.Contract(fxPortalAddress, ['function deposit(address user, address rootToken, bytes calldata depositData) external'], owner);
      tx = await IFxPortal.deposit(owner.address, nftAddress, depositData, {
        gasLimit: 3000000,
        gasPrice: ethers.utils.parseUnits('6', 'gwei'), 
      });
      console.log("deposit : ",tx)
      await tx.wait();

      console.log(`NFT ${i} approved and deposited.`);
    } catch (error) {
      console.error(`Failed to approve and deposit NFT ${i}:`, error);
    }
  }
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
