// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./node_modules/openzeppelin-contracts/token/ERC20/ERC20.sol";
import "./node_modules/openzeppelin-contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("NotCoin", "NOT") {
        // Mint initial supply to the contract deployer
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    // Function to mint new tokens, only callable by the owner
    function mint(address account, uint256 amount) public onlyOwner {
        require(account != address(0), "ERC20: mint to the zero address");
        _mint(account, amount);
    }

    // Function to burn tokens from the caller's balance
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // Function to transfer tokens, with additional checks
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "ERC20: transfer amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "ERC20: transfer amount exceeds balance");

        _transfer(msg.sender, recipient, amount);
        return true;
    }
}
