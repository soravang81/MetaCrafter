# ETH Proof - Solidity Contract**

### Project Overview**
This project involves creating a Solidity smart contract that implements a simple ERC20-like token. The contract will include functionalities for minting and burning tokens, as well as storing token details and balances. The project will help you understand the basics of Solidity, including data types, mappings, functions, and conditional statements.

### Contract Requirements**
1. ****Public Variables****: The contract will have public variables to store the details about the token, including:
   - Token Name
   - Token Abbreviation (Abbrv.)
   - Total Supply

2. ****Mapping of Addresses to Balances****: A mapping will be used to keep track of the balances of different addresses.

3. ****Mint Function****: A function to mint new tokens. This function will:
   - Take an address and a value as parameters.
   - Increase the total supply by the specified value.
   - Increase the balance of the specified address by the same amount.

4. ****Burn Function****: A function to burn tokens. This function will:
   - Take an address and a value as parameters.
   - Decrease the total supply by the specified value.
   - Decrease the balance of the specified address by the same amount.
   - Ensure that the balance of the address is greater than or equal to the amount to be burned before proceeding.

### Relevant Course Sections**
- ****Introduction to Data Types****
- ****Mapping in Solidity****
- ****Functions Demonstration****
- ****Conditional Statements****

### Example Contract**
Below is a basic Solidity contract template to get you started:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;


       REQUIREMENTS
    1. Your contract will have public variables that store the details about your coin (Token Name, Token Abbrv., Total Supply)
    2. Your contract will have a mapping of addresses to balances (address => uint)
    3. You will have a mint function that takes two parameters: an address and a value.
       The function then increases the total supply by that number and increases the balance
       of the “sender” address by that amount
    4. Your contract will have a burn function, which works the opposite of the mint function, as it will destroy tokens.
       It will take an address and value just like the mint functions. It will then deduct the value from the total supply
       and from the balance of the “sender”.
    5. Lastly, your burn function should have conditionals to make sure the balance of "sender" is greater than or equal
       to the amount that is supposed to be burned.
```


### Steps to Implement the Contract

1. **Define Public Variables**:
   - Define `tokenName`, `tokenAbbrv`, and `totalSupply` as public variables.

2. **Define Mapping**:
   - Create a mapping `balances` to map addresses to their token balances.

3. **Implement Mint Function**:
   - The `mint` function will increase the `totalSupply` and update the balance of the specified address.

4. **Implement Burn Function**:
   - The `burn` function will decrease the `totalSupply` and the balance of the specified address.
   - Ensure the balance is sufficient before burning tokens using a `require` statement.