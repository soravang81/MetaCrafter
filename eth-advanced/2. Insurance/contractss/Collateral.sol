// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CollateralProtectionInsurance is ReentrancyGuard, Ownable {
    address public insured;
    uint256 public price;
    uint256 public coverageAmount;
    uint256 public lastPaid;

    enum PolicyType { Basic, Premium }
    PolicyType public policy;
    event PricePaid(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);
    event PolicyChanged(PolicyType newPolicy);

    modifier onlyInsured() {
        require(msg.sender == insured, "Only the insured can perform this action");
        _;
    }

    constructor(address _insured) Ownable(_insured) {
        insured = _insured;
    }

    function setPolicy(PolicyType _policy) public onlyInsured {
        policy = _policy;
        if (policy == PolicyType.Basic) {
            price = 0.001 ether;
            coverageAmount = 0.02 ether;
        } else if (policy == PolicyType.Premium) {
            price = 0.025 ether;
            coverageAmount = 0.05 ether;
        }
        emit PolicyChanged(policy);
    }

    function payPrice() public payable onlyInsured nonReentrant {
        require(msg.value == price, "Incorrect price");
        lastPaid = block.timestamp;
        emit PricePaid(msg.sender, msg.value);
    }

    function claim(uint256 loanAmount) public onlyInsured nonReentrant {
        require(block.timestamp <= lastPaid + 30 days, "Policy expired");
        require(loanAmount <= coverageAmount, "Loan amount exceeds coverage");
        payable(insured).transfer(loanAmount);
        emit Claimed(insured, loanAmount);
    }

    receive() external payable {}
}
