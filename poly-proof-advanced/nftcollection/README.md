# NFTCollection Contract

A Solidity smart contract for creating a unique ERC721 token collection with integrated metadata and ownership features.

## Description

NFTCollection is an ERC721 token named "NFTCollection" with the symbol "NFTC". It utilizes the ERC721URIStorage extension for token metadata management and inherits from Ownable for administrative controls. The contract integrates with an external IFxPortal interface for potential cross-chain functionality, emphasizing the contract's flexibility in real-world applications. 

Key features include:
- Minting NFTs with unique prompts and metadata URLs.
- Storing metadata and prompts associated with each token.
- Owner-only minting permissions, ensuring controlled distribution.
- Transfer the token and nfts to the mumbai testnet using fxportal contract.

## Getting Started

These instructions will guide you through setting up and deploying the NFTCollection contract.

### Installing

To get started with the contract, you need to set up your development environment:

1. Clone the repository:
    ```
    git clone https://github.com/soravang81/MetaCrafter.git
    ```
2. Navigate to the project directory:
    ```
    cd poly-proof-advanced/nftcollection/
    ```
3. Install the required dependencies using npm or yarn:
    ```
    npm install
    ```
4. Get all the apis inside the .env.example and put in a new file named .env

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
    - Make sure to add all the apis in the .env (create new .env file in root folder) , u can look at .env.example

## Author

[@sourxv_me](https://twitter.com/sourxv_me)

## Help

For any issues or inquiries, reach out on Twitter: [@sourxv_me](https://twitter.com/sourxv_me)