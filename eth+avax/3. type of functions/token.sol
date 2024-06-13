// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Token {
    string public name;
    string public symbol;
    uint public supply;
    address public owner;

    mapping(address => uint) public balance;

    constructor () public {
        name = "NotCoin";
        symbol = "ncx";
        supply = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can mint token");
        _;
    }

    function Mint(address _address ,uint  _value)public onlyOwner { 
        supply += _value;
        balance[_address] += _value;
    }
    function Burn(uint _value) public {
        require(balance[msg.sender] >= _value, "Balance is not enough");
        supply -= _value;
        balance[msg.sender] -= _value;
    }
    function Transfer(address  _receiver , uint _value) public {
        require(_value > 0, "Must send some ETH");
        balance[msg.sender] -= _value;
        balance[_receiver] += _value;
}
}