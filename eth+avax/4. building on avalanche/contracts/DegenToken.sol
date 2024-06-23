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

    mapping(address => Items) public itemsOwned;
    mapping(Items => uint256) public itemCost;

    constructor(uint256 initialSupply) ERC20("Degen", "DGN") Ownable(msg.sender) {
        require(initialSupply > 0, "Initial supply must be greater than zero");
        _mint(msg.sender, initialSupply);

        // Initialize item costs 
        itemCost[Items.DEGEN_NFT] = 100 ;
        itemCost[Items.GEMS] = 50;
        itemCost[Items.BOOSTER] = 200;
    }

    function mint(address account, uint256 amount) public onlyOwner {
        require(account != address(0), "ERC20: mint to the zero address");
        _mint(account, amount);
    }

    // Function to burn tokens from the caller's balance
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "ERC20: transfer amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "ERC20: transfer amount exceeds balance");

        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function redeemItem(Items item) public {
        require(itemsOwned[msg.sender] == Items(0), "Item already owned");
        require(itemCost[item] > 0, "Item cost must be greater than zero");
        require(balanceOf(msg.sender) >= itemCost[item], "Insufficient balance to redeem item");

        itemsOwned[msg.sender] = item;
        _transfer(msg.sender, address(this), itemCost[item]); // Transfer tokens to contract
    }
}
