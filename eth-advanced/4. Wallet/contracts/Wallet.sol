// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is Ownable {
    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed recipient, uint256 amount);
    event TransferExecuted(address indexed to, uint256 amount);
    event OperationHandled(address indexed sender, uint256 nonce);
    event Logs(uint callGas, bytes callData, address indexed contractaddress , string error);
    
    struct UserOperation {
        address sender;
        uint256 nonce;
        bytes callData;
        uint256 callGasLimit;
        uint256 verificationGasLimit;
        uint256 preVerificationGas;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
        bytes paymasterAndData;
        bytes signature;
    }
    constructor(address _owner) Ownable(_owner) {
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function executeTransfer(address to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(to).transfer(amount);
        emit TransferExecuted(to, amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    function deposit() external payable {
    }

    function handleUserOperation(UserOperation memory userOp) external onlyOwner {
        try this.executeUserOperation(userOp.callData, userOp.callGasLimit) returns (bool success, bytes memory result) {
            if (!success) {
                string memory errorMessage = _getRevertMsg(result);
                emit Logs(userOp.callGasLimit, userOp.callData, address(this), errorMessage);
                revert(errorMessage);
            }
        } catch Error(string memory reason) {
            emit Logs(userOp.callGasLimit, userOp.callData, address(this), reason);
            revert(reason);
        } catch (bytes memory lowLevelData) {
            string memory errorMessage = _getRevertMsg(lowLevelData);
            emit Logs(userOp.callGasLimit, userOp.callData, address(this), errorMessage);
        emit OperationHandled(userOp.sender, userOp.nonce);
    }  
    }
    function executeUserOperation(bytes memory callData, uint256 callGasLimit) external onlyOwner returns (bool, bytes memory) {
        (bool success,) = address(this).call{
                value: missingAccountFunds,
                gas: type(uint256).max
            }();
        return (success, result);
    }

    function _getRevertMsg(bytes memory _returnData) internal pure returns (string memory) {
        if (_returnData.length < 68) return "Transaction reverted silently";
        assembly {
            _returnData := add(_returnData, 0x04)
        }
        return abi.decode(_returnData, (string));
    }
}
