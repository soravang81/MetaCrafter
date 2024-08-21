// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract Token {
    string public name;
    string public nickname;
    uint public supply;

    mapping(address => uint) public balances;

    constructor() {
        name = "Litcoin";
        nickname = "LCX";
        supply = 0;
    }

    function mint(address _address, uint _value) public {
        supply += _value;
        balances[_address] += _value;
    }

    function burn(address _address, uint _value) public {
        require(balances[_address] >= _value, "Balance is not enough");
        supply -= _value;
        balances[_address] -= _value;
    }
}