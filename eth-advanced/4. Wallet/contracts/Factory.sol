// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Wallet.sol";

contract Factory {
    event WalletCreated(address indexed walletAddress, address indexed owner);
    address public owner;
    Wallet[] public wallets;

    constructor() {
        owner = msg.sender;
    }

    function createWallet() external returns (address) {
        Wallet newWallet = new Wallet(msg.sender);
        emit WalletCreated(address(newWallet), msg.sender);
        return address(newWallet);
    }
    function getWallets() public view returns (address[] memory) {
        address[] memory walletAddresses = new address[](wallets.length);
        for (uint256 i = 0; i < wallets.length; i++) {
            walletAddresses[i] = address(wallets[i]);
        }
        return walletAddresses;
    }
}
