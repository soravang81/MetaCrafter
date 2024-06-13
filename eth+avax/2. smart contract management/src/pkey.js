const { ethers } = require('ethers');

// private and public key generator :P
const wallet = ethers.Wallet.createRandom();

console.log(`Private Key: ${wallet.privateKey}`);
console.log(`Public Address: ${wallet.address}`);