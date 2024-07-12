import * as hre from 'hardhat';
const { ethers } = hre as any
import NFTCollection from '../artifacts/contracts/NFTcollection.sol/NFTCollection.json';
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Transferring NFTs with the account:", deployer.address);
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  console.log(address) ;
  const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/qHx1EyO6UyYMcympPKXlkCLOLScgrEXz"); // Connect to your Ethereum provider
  const signer = provider.getSigner();
  const nft = new ethers.Contract(address, NFTCollection.abi, signer); // Use your contract address from environment variables

  const nextTokenId = await nft.nextTokenId();
  console.log("nxt tkn",nextTokenId)

  for (let i = 0; i < nextTokenId; i++) {
    const prompt = await nft.getTokenPrompt(i);
    const tokenURI = await nft.tokenURI(i);

    console.log(`Transferring NFT ${i + 1} with token URI "${tokenURI}", and prompt "${prompt}"`);

    await nft.approveFxPortal(i);
    console.log(`Approved NFT ${i + 1} for FxPortal`);

    await nft.depositToPolygon(i);
    console.log(`Deposited NFT ${i + 1} to Polygon`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
