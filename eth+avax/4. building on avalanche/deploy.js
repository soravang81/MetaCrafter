// SPDX-License-Identifier: MIT
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const initialSupply = ethers.utils.parseUnits("1000", 18); // Adjust initial supply if needed
  const DegenToken = await ethers.getContractFactory("DegenToken");
  const token = await DegenToken.deploy(initialSupply);

  console.log("DegenToken address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
