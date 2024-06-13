
# Basic DApp with Smart Contract

This is a basic decentralized application (DApp) with a smart contract where users can add balance, spend/burn balance, and transfer balance.

## Requirements

- **Metamask Wallet**: Ensure you have Metamask installed and set up if you want to perform transactions.
- **To Run This Contract Locally**:
  - Alchemy or Infura API key
  - A wallet private key with some ETH (testnet)

## Bug

There is currently a bug that affects running both the Truffle and React app. The steps to handle this issue are outlined below.

## Setting Up

1. **Get Alchemy or Infura API Key**: Obtain your API key and put it in a `.env` file. Refer to `.env.example` for the format.
2. **Get a Wallet Private Key**: Acquire a wallet private key and some testnet ETH from any faucet. One option is [Google Cloud Faucet for Ethereum Sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia). This wallet will be used for deployment.
3. **Set Up Another Wallet Private Key**: You can use the same or a different wallet private key for transactions.
4. **Configure `.env` File**: Add your private key and API key to the `.env` file.

### Handling the Bug

1. **Change Project Configuration**:
   - In `package.json`, change `type` to `commonjs` to run truffle command like (truffle deploy).
   - Agian change the type to "module" to run the frontend using - npm run dev.

## Steps

If you encounter an error, run:
```bash
# Install the dependencies
npm install
```

```bash
# Compile Contracts
truffle compile
```

```bash
# Migrate Contracts
truffle migrate
```

If you experience network errors, re-run the migration command.

**Revert Configuration Changes**:
   - Change `type` in `package.json` to `module`.

```bash
# Run the Application
npm run dev
```