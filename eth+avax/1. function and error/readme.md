# Lottery Smart Contract

## Overview

This smart contract implements a decentralized lottery system on the Ethereum blockchain. Participants can buy lottery tickets for a specified price, and when the maximum number of tickets is sold, a winner is randomly selected to receive the entire prize pool. The contract also includes functions for the owner to reset the lottery and to forcefully end the lottery, refunding all participants.

## Contract Functions

1. **Constructor**: Initializes the lottery with a ticket price and a maximum number of tickets.
2. **buyTicket**: Allows participants to buy a ticket if the correct price is paid and tickets are still available.
3. **pickWinner**: Internally called when the maximum number of tickets is sold to randomly select a winner.
4. **resetLottery**: Allows the owner to reset the lottery after it has ended.
5. **forceEndLottery**: Allows the owner to end the lottery prematurely and refund all participants.

## Steps to Deploy and Run the Contract

### Using Remix

1. **Open Remix**: Visit [Remix Ethereum IDE](https://remix.ethereum.org/).
2. **Create a New File**: Click on the "contracts" folder, then create a new file named `Lottery.sol`.
3. **Paste the Code**: Copy the contract code and paste it into `Lottery.sol`.
4. **Compile the Contract**: Click on the "Solidity Compiler" tab and select the appropriate compiler version (0.8.0 or higher). Then click "Compile Lottery.sol".
5. **Deploy the Contract**: Go to the "Deploy & Run Transactions" tab, choose "Lottery" from the contract dropdown, set the constructor parameters (`_ticketPrice` and `_maxTickets`), and click "Deploy".
6. **Interact with the Contract**: Use the deployed contract's interface to call functions like `buyTicket`, `resetLottery`, and `forceEndLottery`.

### Using Truffle

1. **Install Truffle**: Ensure you have Node.js installed, then run `npm install -g truffle`.
2. **Create a Truffle Project**: Run `truffle init` in your project directory.
3. **Add the Contract**: Create a new file in the `contracts` directory named `Lottery.sol` and paste the contract code.
4. **Compile the Contract**: Run `truffle compile`.
5. **Deploy the Contract**: Create a migration script in the `migrations` directory and deploy the contract using `truffle migrate`.
6. **Interact with the Contract**: Use Truffle Console (`truffle console`) or write scripts to interact with the deployed contract.

### Using Hardhat

1. **Install Hardhat**: Run `npm install --save-dev hardhat` in your project directory.
2. **Create a Hardhat Project**: Run `npx hardhat` and follow the prompts to create a new project.
3. **Add the Contract**: Create a new file in the `contracts` directory named `Lottery.sol` and paste the contract code.
4. **Compile the Contract**: Run `npx hardhat compile`.
5. **Deploy the Contract**: Write a deployment script in the `scripts` directory and deploy the contract using `npx hardhat run scripts/deploy.js`.
6. **Interact with the Contract**: Use Hardhat Console (`npx hardhat console`) or write scripts to interact with the deployed contract.
