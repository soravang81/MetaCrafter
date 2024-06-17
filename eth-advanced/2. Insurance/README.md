# Problem Statement

Using Solidity, create an insurance provider protocol. The insurance mechanism is simple. Users of an insurance platform provide liquidity to cover damage in the case of an insured event, and they themselves receive interest for providing liquidity. You can refer to Etherisc for some inspiration.

## Requirements

You will have to build two main components of the insurance:

1. **Crypto Wallet Insurance**: Build an insurance protocol that helps owners of smart contract wallets stay protected from hackers. The owners will pay an insurance amount per month, set by the protocol. You can choose to invest the insurance amount in other DeFi schemes.
   
2. **Collateral Protection for Crypto-Backed Loans**: Based on the insurance policy the user has chosen, decide to give back the entire loan or a percentage of the loan when the collateral value drops.

## Assessment Criteria

To pass the assessment, complete the following steps:

1. Create separate Solidity contracts for both insurance types.
2. Have clearly defined policies (a minimum of two different types) for each insurance type.
3. Follow the factory contract model where for each user, a separate insurance contract is deployed.
4. Users should be able to pay the premium and claim the insurance with the required checks.

## To run this project

1. Install dependencies
```code
npm install
```

2. Change the module type in package.json to "commonjs"

3. Rename the .env.example to .env and put in your api key and wallet private key

4. Deploy on sepolia testnet
```code
truffle deploy --network sepolia
```

5. Again , Change the module type in package.json to "module"

6. Start the frontend
```code
npm run dev
```