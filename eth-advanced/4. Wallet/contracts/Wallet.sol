// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wallet {
    address public owner;
    event FundsTransferred(address indexed to, uint256 amount);

    constructor(address _owner) {
        owner = _owner;
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function transfer(address payable _to, uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can transfer funds");
        require(address(this).balance >= _amount, "Insufficient balance");
        _to.transfer(_amount);
        emit FundsTransferred(_to, _amount);
    }

    function deposit() public payable {}
}
