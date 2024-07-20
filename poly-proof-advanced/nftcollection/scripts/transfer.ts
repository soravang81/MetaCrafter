import * as hre from 'hardhat';
const { ethers } = hre as any;
import NFTCollection from '../artifacts/contracts/NFTcollection.sol/NFTCollection.json';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Transferring NFTs with the account:', deployer.address);

  const nftAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const fxPortalAddress = process.env.NEXT_PUBLIC_FX_PORTAL_ADDRESS;
  
  const nft = new ethers.Contract(nftAddress, NFTCollection.abi, deployer);
  const fxPortal = new ethers.Contract(fxPortalAddress, [
    'function approve(address to, uint256 tokenId) external',
    'function deposit(uint256 tokenId, address depositor, uint256 amount) external',
  ], deployer);

  const nextTokenId = await nft.nextTokenId();
  console.log('Next token ID:', nextTokenId);
  let nonce = await deployer.getTransactionCount(); // Fetch the current nonce

  const transactions = Array.from({ length: nextTokenId.toNumber() }, (_, i) => i).map(async (i) => {
    const prompt = await nft.getTokenPrompt(i);
    const tokenURI = await nft.tokenURI(i);

    console.log(`Transferring NFT ${i + 1} with token URI "${tokenURI}", and prompt "${prompt}"`);

    let tx = await nft.approve(fxPortalAddress, i, { gasLimit: 300000 ,nonce : nonce++ });
    console.log(`Approved NFT ${i + 1} for FxPortal`, tx);
    await tx.wait();

    tx = await fxPortal.deposit(i, deployer.address, 0, { gasLimit: 300000  ,nonce : nonce++ });
    console.log(`Deposited NFT ${i + 1} for FxPortal`, tx);
    await tx.wait();

    console.log(`Deposited NFT ${i + 1} to Polygon`);
  });

  await Promise.all(transactions);
  console.log('All NFTs have been transferred.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
