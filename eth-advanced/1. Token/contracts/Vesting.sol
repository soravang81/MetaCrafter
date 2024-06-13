// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Admin.sol";

contract Vesting is Ownable {
    enum UserType {
        Founder,
        Investor,
        CoFounder,
        PreSaleBuyer,
        RegularBuyer,
        Consumer,
        Retailer
    }

    struct VestingSchedule {
        UserType userType;
        uint256 amount;
        uint256 releaseTime;
        bool claimed;
    }

    Admin public token;
    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(address => bool) public whitelistedAddresses;

    event TokensReleased(address beneficiary, uint256 amount);

    constructor(Admin _token) Ownable(msg.sender) {
        token = _token;
    }

    function whitelistAddress(address beneficiary) external onlyOwner {
        require(!whitelistedAddresses[beneficiary], "Address is already whitelisted");
        whitelistedAddresses[beneficiary] = true;
    }

    function setVestingSchedule(address beneficiary, UserType userType, uint256 amount, uint256 releaseTime) external onlyOwner {
        require(whitelistedAddresses[beneficiary], "Address is not whitelisted");

        vestingSchedules[beneficiary] = VestingSchedule(userType, amount, releaseTime, false);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
    }

    function releaseTokens() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(whitelistedAddresses[msg.sender], "Address is not whitelisted");
        require(block.timestamp >= schedule.releaseTime, "Tokens are still locked");
        require(!schedule.claimed, "Tokens already claimed");
        require(schedule.amount > 0, "No tokens to release");

        require(
            schedule.userType == UserType.Founder ||
            schedule.userType == UserType.Investor ||
            schedule.userType == UserType.CoFounder ||
            schedule.userType == UserType.PreSaleBuyer,
            "Not allowed to claim tokens"
        );

        schedule.claimed = true;
        token.transfer(msg.sender, schedule.amount);
        vestingSchedules[msg.sender].amount = 0;
        emit TokensReleased(msg.sender, schedule.amount);
    }
}
