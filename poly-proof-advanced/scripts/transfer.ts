import { ethers } from "hardhat";
import { FxPortalClient } from '@fxportal/maticjs-fxportal';
import { use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
import { JsonRpcProvider } from "@ethersproject/providers";

use(Web3ClientPlugin);

// ABI for the rootTunnel contract (you may need to adjust this based on the actual contract)
const rootTunnelABI = [
  "function deposit(address rootToken, address user, uint256 tokenId, bytes memory data) external",
];

async function main() {
  const MyNFTCollection = await ethers.getContractFactory("MyNFTCollection");
  const nft = await MyNFTCollection.attach("YOUR_DEPLOYED_CONTRACT_ADDRESS");

  const [owner] = await ethers.getSigners();

  // Initialize FxPortalClient
  const fxPortalClient = new FxPortalClient();
  await fxPortalClient.init({
    network: 'testnet',
    version: 'mumbai',
    parent: {
      provider: owner.provider,
      defaultConfig: {
        from: owner.address
      }
    },
    child: {
      provider: new JsonRpcProvider('https://rpc-mumbai.matic.today'),
      defaultConfig: {
        from: owner.address
      }
    }
  });

  // Get the root tunnel address
  const rootTunnelAddress = fxPortalClient.rootTunnel.address;

  // Create a contract instance for the root tunnel
  const rootTunnelContract = new ethers.Contract(rootTunnelAddress, rootTunnelABI, owner);

  // Approve NFTs for transfer
  for (let i = 0; i < 5; i++) {
    await nft.approve(rootTunnelAddress, i);
    console.log(`Approved NFT ${i} for transfer`);
  }

  // Deposit NFTs to the bridge
  for (let i = 0; i < 5; i++) {
    const tx = await rootTunnelContract.deposit(
      nft.address,
      owner.address,
      i,
      "0x" // empty bytes data
    );
    const receipt = await tx.wait();
    console.log(`Deposited NFT ${i} to the bridge. Transaction hash: ${receipt.transactionHash}`);
  }

  // Get the child token address (this might not be directly available, you may need to implement this separately)
  // For now, we'll assume you know the child token address
  const childTokenAddress = "CHILD_TOKEN_ADDRESS";

  // Check balance on Mumbai
  const childProvider = new JsonRpcProvider('https://rpc-mumbai.matic.today');
  const childContract = new ethers.Contract(childTokenAddress, ['function balanceOf(address) view returns (uint256)'], childProvider);
  const balance = await childContract.balanceOf(owner.address);
  console.log(`Balance on Mumbai: ${balance.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });