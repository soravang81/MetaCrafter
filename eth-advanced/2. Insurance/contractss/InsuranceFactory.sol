// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Wallet.sol";
import "./Collateral.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InsuranceFactory is Ownable {
    event WalletInsuranceCreated(address indexed user, address insuranceContract);
    event CollateralInsuranceCreated(address indexed user, address insuranceContract);
    
    constructor() Ownable(msg.sender) {}

    function createWalletInsurance() external {
        address _insured = msg.sender;
        CryptoWalletInsurance walletInsurance = new CryptoWalletInsurance(_insured);
        emit WalletInsuranceCreated(msg.sender, address(walletInsurance));
    }

    function createCollateralInsurance() external {
        address insured = msg.sender;
        CollateralProtectionInsurance collateralInsurance = new CollateralProtectionInsurance(insured);
        emit CollateralInsuranceCreated(msg.sender, address(collateralInsurance));
    }
}
