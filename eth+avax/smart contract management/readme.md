# Basic DApp with Smart Contract

This is a basic decentralized application (DApp) with a smart contract where users can add balance, spend/burn balance, and transfer balance.

## Requirements

- ****Metamask Wallet****: Ensure you have Metamask installed and set up if you want to perform transactions.
- ****To Run This Contract Locally****:
  - Alchemy or Infura API key
  - A wallet private key with some ETH (testnet)

## Bug

There is currently a bug that affects running both the Truffle and React app. The steps to handle this issue are outlined below.

## Setting Up

1. ****Get Alchemy or Infura API Key****: Obtain your API key and put it in a `.env` file. Refer to `.env.example` for the format.
2. ****Get a Wallet Private Key****: Acquire a wallet private key and some testnet ETH from any faucet. One option is [Google Cloud Faucet for Ethereum Sepolia](__https://cloud.google.com/application/web3/faucet/ethereum/sepolia__). This wallet will be used for deployment.
3. ****Set Up Another Wallet Private Key****: You can use the same or a different wallet private key for transactions.
4. ****Configure** **`.env`** **File****: Add your private key and API key to the `.env` file.

### Handling the Bug

1. ****Change Project Configuration****:
   - In `package.json`, change `type` to `commonjs`.
   - In `tsconfig.json` and `tsconfig.ts`, change `module` to `commonjs` and comment out `moduleResolution`.

## Steps

1. ****If you encounter an error, run:****
   ```bash
   npm i
   ```

2. ****If you experience network errors, re-run the migration command.****
   ```bash
   npm run migrate
   ```

3.    ****Revert Configuration Changes****:

-   Change `type` in `package.json` to `module`.
-   Change `module` in `tsconfig.json` and `tsconfig.ts` to `esnext` and uncomment `moduleResolution`.

4. ****Run the Application****
   ```bash
   npm run dev
   ```