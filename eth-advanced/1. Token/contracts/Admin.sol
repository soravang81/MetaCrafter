// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is ERC20 , Ownable {
    constructor(string memory _name, string memory _symbol , uint _initialSupply) ERC20(_name, _symbol) Ownable(msg.sender) {
        _mint(msg.sender, _initialSupply);
    }
    function mint(uint256 amount) external onlyOwner {
        _mint(msg.sender, amount);
    }

    function burn(uint256 amount) external onlyOwner{
        _burn(msg.sender, amount);
    }
    function mintTo(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    function burnFrom(address from, uint256 amount) external {
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "ERC20: Insufficient token to burn");
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
    }
}
