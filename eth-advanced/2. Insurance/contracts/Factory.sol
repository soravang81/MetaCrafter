// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Wallet.sol";
import "./Collateral.sol";

contract InsuranceFactory is Ownable {
    constructor() Ownable(msg.sender){
        
    }
    mapping(address => address) public userToWalletInsurance;
    mapping(address => address) public userToCollateralInsurance;

    event WalletInsuranceCreated(address indexed user, address insuranceContract);
    event CollateralInsuranceCreated(address indexed user, address insuranceContract);

    function createWalletInsurance() public {
        require(userToWalletInsurance[msg.sender] == address(0), "Wallet insurance already exists");
        CryptoWalletInsurance walletInsurance = new CryptoWalletInsurance(msg.sender);
        userToWalletInsurance[msg.sender] = address(walletInsurance);
        emit WalletInsuranceCreated(msg.sender, address(walletInsurance));
    }

    function createCollateralInsurance() public {
        require(userToCollateralInsurance[msg.sender] == address(0), "Collateral insurance already exists");
        CollateralProtectionInsurance collateralInsurance = new CollateralProtectionInsurance(msg.sender);
        userToCollateralInsurance[msg.sender] = address(collateralInsurance);
        emit CollateralInsuranceCreated(msg.sender, address(collateralInsurance));
    }
}
