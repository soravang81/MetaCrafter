// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoWalletInsurance is ReentrancyGuard, Ownable {
    address public insured;
    uint256 public premium;
    uint256 public coverageAmount;
    uint256 public lastPaid;

    enum PolicyType { Basic, Premium }
    PolicyType public policy;

    event PremiumPaid(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);

    modifier onlyInsured() {
        require(msg.sender == insured, "Only the insured can perform this action");
        _;
    }

    constructor(address _insured) Ownable(msg.sender) {
        insured = _insured;
        transferOwnership(_insured); // Use OpenZeppelin's Ownable to set the owner to the insured
    }

    function setPolicy(PolicyType _policy) public onlyInsured {
        policy = _policy;
        if (policy == PolicyType.Basic) {
            premium = 0.01 ether;
            coverageAmount = 1 ether;
        } else if (policy == PolicyType.Premium) {
            premium = 0.05 ether;
            coverageAmount = 5 ether;
        }
    }

    function payPremium() public payable onlyInsured nonReentrant {
        require(msg.value == premium, "Incorrect premium amount");
        lastPaid = block.timestamp;
        emit PremiumPaid(msg.sender, msg.value);
    }

    function claim() public onlyInsured nonReentrant {
        require(block.timestamp <= lastPaid + 30 days, "Policy expired");
        payable(insured).transfer(coverageAmount);
        emit Claimed(insured, coverageAmount);
    }

    receive() external payable {}
}
