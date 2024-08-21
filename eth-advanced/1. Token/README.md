# Token Vesting DApp

## Problem Statement

Using Solidity and Ether.js, build a simple DApp that will allow an organization to create a vesting schedule for their tokens. Depending on the tokenomics model of a web3 organization, they will have various vesting schedules for different stakeholders like community, investors, pre-sale buyers, founders, etc.

## Functionality

### Organization Features
- Register themselves and their token (basically spinning off a contract for one ERC20 token).
- Mention the type of stakeholder and their vesting period (timelock).
- Whitelist addresses for certain stakeholders (founders, investors, etc.).

### Stakeholder Features
- Whitelisted addresses should be able to claim their tokens after the vesting period.

## Steps to Implement

# Token Vesting DApp Implementation Guide

## Steps to Implement the Project

### 1. Setup the Project

#### 1.1 Initialize a New React Project
Created a new React project using `npx create-vite@latest`.

```bash
npx npx create-vite@latest
project name : Token
cd Token
```

#### 1.2 Install Dependencies
Installed dependencies for interacting with the Ethereum blockchain.
( listed all dependencies in the package.json )

```bash
#To install all the dependencies
npm install
```

### 2. Develop Solidity Contracts

#### 2.1 ERC20 Token Contract
Created an ERC20 token contract to represent the organization's token.

#### 2.2 Vesting Contract
Created a vesting contract to manage the vesting schedules and whitelisted addresses.

### 3. Front End Development

#### 3.1 Connect Wallet Page
Created a page to allow users to connect their wallet using `ethers.js`.

#### 3.2 Admin Page
Created a page for admins to:
- Register their organization.
- Add stakeholders with vesting details.

#### 3.3 Withdrawal Page
Created a page for users to:
- Withdraw their tokens if they are whitelisted.
- Allow only the organization admin to withdraw if the user is not whitelisted.

### 4. Deploy and Test

#### 4.1 Deploy Contracts
Deploy the ERC20 and Vesting contracts on a test network using Remix or Hardhat.

#### 4.2 Integrate Front End with Contracts
Used `ethers.js` to interact with the deployed contracts from the React front end.

#### 4.3 Test Functionality
Tested the DApp to ensure:
- Organizations can register and add stakeholders.
- Stakeholders can claim tokens after the vesting period.
- Admin-only withdrawal functionality works as expected.

By following these steps, i created a fully functional DApp to manage token vesting schedules for various stakeholders in a web3 organization.
