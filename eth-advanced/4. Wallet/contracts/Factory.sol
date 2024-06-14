// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Wallet.sol";

contract Factory {
    address public owner;
    Wallet[] public wallets;

    event WalletCreated(address walletAddress);

    constructor() {
        owner = msg.sender;
    }

    function createWallet() public {
        Wallet newWallet = new Wallet(msg.sender);
        wallets.push(newWallet);
        emit WalletCreated(address(newWallet));
    }

    function getWallets() public view returns (address[] memory) {
        address[] memory walletAddresses = new address[](wallets.length);
        for (uint256 i = 0; i < wallets.length; i++) {
            walletAddresses[i] = address(wallets[i]);
        }
        return walletAddresses;
    }
}
