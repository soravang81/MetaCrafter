// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DegenToken is ERC20, Ownable {
    enum Items {
        DEGEN_NFT,
        GEMS,
        BOOSTER
    }

    mapping(address => mapping(uint8 => bool)) public itemsOwned;
    mapping(uint8 => uint256) public itemCost;

    constructor(uint256 initialSupply) ERC20("Degen", "DGN") Ownable(msg.sender) {
        require(initialSupply > 0, "Initial supply must be greater than zero");
        _mint(msg.sender, initialSupply);

        // Initial item costs 
        itemCost[uint8(Items.DEGEN_NFT)] = 100;
        itemCost[uint8(Items.GEMS)] = 50;
        itemCost[uint8(Items.BOOSTER)] = 200;
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(amount > 0, "Transfer amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Transfer amount exceeds balance");

        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function redeemItem(Items item) public {
        require(!itemsOwned[msg.sender][uint8(item)], "Item already owned");
        require(itemCost[uint8(item)] > 0, "Item cost must be greater than zero");
        require(balanceOf(msg.sender) >= itemCost[uint8(item)], "Insufficient balance to redeem item");

        itemsOwned[msg.sender][uint8(item)] = true;
        _transfer(msg.sender, address(this), itemCost[uint8(item)]);
    }

}
