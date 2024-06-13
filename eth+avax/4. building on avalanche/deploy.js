const hre = require("hardhat");

async function main() {
  // Get the Points smart contract
  const Points = await hre.ethers.getContractFactory("Points");

  // Deploy it
  const points = await Points.deploy();
  await points.waitForDeployment();

  // Display the contract address
  console.log(`Points token deployed to ${points.target}`);
}

// Hardhat recommends this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
