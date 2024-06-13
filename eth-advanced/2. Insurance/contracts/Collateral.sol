// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollateralProtectionInsurance is ReentrancyGuard, Ownable {
    address public insured;
    uint256 public premium;
    uint256 public coveragePercentage;
    uint256 public lastPaid;

    enum PolicyType { Partial, Full }
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
        if (policy == PolicyType.Partial) {
            premium = 0.02 ether;
            coveragePercentage = 50;
        } else if (policy == PolicyType.Full) {
            premium = 0.1 ether;
            coveragePercentage = 100;
        }
    }

    function payPremium() public payable onlyInsured nonReentrant {
        require(msg.value == premium, "Incorrect premium amount");
        lastPaid = block.timestamp;
        emit PremiumPaid(msg.sender, msg.value);
    }

    function claim(uint256 loanAmount) public onlyInsured nonReentrant {
        require(block.timestamp <= lastPaid + 30 days, "Policy expired");
        uint256 payout = (loanAmount * coveragePercentage) / 100;
        payable(insured).transfer(payout);
        emit Claimed(insured, payout);
    }

    receive() external payable {}
}
