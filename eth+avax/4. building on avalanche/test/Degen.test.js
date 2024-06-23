// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

describe("DegenToken contract", function () {
  let DegenToken;
  let token;
  let owner;
  let addr1;
  let addr2;

  const initialSupply = ethers.utils.parseUnits("1000", 18); // 1000 tokens with 18 decimals

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy DegenToken contract
    DegenToken = await ethers.getContractFactory("DegenToken");
    token = await DegenToken.deploy(initialSupply);
    await token.deployed();
  });

  it("Deployment should assign the initial supply of tokens to the owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance.toString()).to.equal(initialSupply.toString());
  });

  it("Token contract should have correct name and symbol", async function () {
    expect(await token.name()).to.equal("Degen");
    expect(await token.symbol()).to.equal("DGN");
  });

  it("Owner should be able to mint new tokens", async function () {
    const amount = ethers.utils.parseUnits("100", 18);
    await token.connect(owner).mint(addr1.address, amount);

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance.toString()).to.equal(amount.toString());
  });

  it("Anyone should be able to burn tokens", async function () {
    const burnAmount = ethers.utils.parseUnits("50", 18);

    await token.connect(owner).burn(burnAmount);

    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance.toString()).to.equal(initialSupply.sub(burnAmount).toString());
  });

  it("Users should be able to transfer tokens", async function () {
    const transferAmount = ethers.utils.parseUnits("20", 18);

    await token.connect(owner).transfer(addr1.address, transferAmount);

    const ownerBalance = await token.balanceOf(owner.address);
    const addr1Balance = await token.balanceOf(addr1.address);

    expect(ownerBalance.toString()).to.equal(initialSupply.sub(transferAmount).toString());
    expect(addr1Balance.toString()).to.equal(transferAmount.toString());
  });

  it("Users should be able to redeem items with associated costs", async function () {
    // Set up item costs (in tokens)
    const DEGEN_NFT_COST = ethers.utils.parseUnits("100", 18);
    const GEMS_COST = ethers.utils.parseUnits("50", 18);
    const BOOSTER_COST = ethers.utils.parseUnits("200", 18);

    // Redeem DEGEN_NFT item
    await token.connect(owner).redeemItem(0); // Assuming DEGEN_NFT is the first item in enum

    // Check itemsOwned mapping after redemption
    const ownerItem = await token.itemsOwned(owner.address);
    expect(ownerItem).to.equal(0); // Check if DEGEN_NFT is owned by the user

    // Check balances after redemption
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance.toString()).to.equal(initialSupply.sub(DEGEN_NFT_COST).toString());
  });
});
