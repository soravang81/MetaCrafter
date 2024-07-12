// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DegenToken contract", function () {
    let DegenToken;
    let token;
    let owner;
    let addr1;
    let addr2;

    const initialSupply = ethers.utils.parseUnits("1000", 18); // 1000 tokens with 18 decimals

    const Items = {
        DEGEN_NFT: 0,
        GEMS: 1,
        BOOSTER: 2
    };

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
        const DEGEN_NFT_COST = 100;
        const initialContractBalance = await token.balanceOf(token.address);

        await token.connect(owner).redeemItem(Items.DEGEN_NFT);

        const isDegenNFTOwned = await token.itemsOwned(owner.address, Items.DEGEN_NFT);
        expect(isDegenNFTOwned).to.be.true; 

        const contractBalanceAfterDegenNFT = await token.balanceOf(token.address);
        expect(contractBalanceAfterDegenNFT.toString()).to.equal(initialContractBalance.add(DEGEN_NFT_COST).toString());
    });

    it("Should return correct item names for owned items", async function () {
        await token.connect(owner).redeemItem(Items.DEGEN_NFT);
        await token.connect(owner).redeemItem(Items.GEMS);

        const ownedItems = await token.getOwnedItems(owner.address);
        expect(ownedItems).to.deep.equal(["DEGEN_NFT", "GEMS"]);
    });
});
