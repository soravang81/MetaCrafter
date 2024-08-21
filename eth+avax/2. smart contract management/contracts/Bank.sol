// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Currency {
    string public name;
    string public symbol;
    uint public supply;

    mapping(address => uint) public bank;

    constructor () public {
        name = "Dollar";
        symbol = "$";
        supply = 0;
    }

    function Print(address _address ,uint  _value)public{ 
        supply += _value;
        bank[_address] += _value;
    }
    function Spend(address _address, uint _value) public {
        require(ba`nk[_address] >= _value, "Bank balance is not enough");
        supply -= _value;
        bank[_address] -= _value;
    }
    function Transfer(address _sender , address  _receiver , uint _value) public {
        require(_value > 0, "Must send some ETH");
        bank[_sender] -= _value;
        bank[_receiver] += _value;
}
}