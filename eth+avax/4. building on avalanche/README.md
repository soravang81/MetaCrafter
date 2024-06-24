# DegenToken Contract

ERC20 token with additional functionality for redeeming items like DEGEN_NFT, GEMS, and BOOSTER.

## Description

DegenToken is an ERC20 token named "Degen" with the symbol "DGN". It includes additional functionalities where users can redeem specific items using their tokens. The contract allows the owner to mint new tokens and any token holder to burn their tokens. Additionally, users can transfer tokens with checks for zero transfer amounts and sufficient balances.

## Getting Started

### Installing

1. Clone the repository to your local machine:
    ```
    git clone https://github.com/soravang81/MetaCrafter.git
    ```
2. Navigate to the project directory:
    ```
    cd eth+avax/4.\ building\ on\ avalanche
    ```
3. Install the required dependencies using npm or yarn:
    ```
    npm install
    ```

### Executing program

1. Deploy the contract using a tool like Remix, Truffle, or Hardhat. For example, using Truffle:
    - Compile the contract:
        ```
        npx hardhat compile
        ```
    - Migrate (deploy) the contract:
        ```
        npx hardhat run deploy.js --network fuji
        ```
    - Make sure to add your wallet private key to deploy this contract in the .env (create new .env file in root folder) , u can look at .env.example


## Help

For any issues or inquiries, reach out on Twitter: [@sourxv_me](https://twitter.com/sourxv_me)

SPDX-License-Identifier: MIT