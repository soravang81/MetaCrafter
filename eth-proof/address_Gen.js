var ethers = require('ethers');  
var crypto = require('crypto');

var id = crypto.randomBytes(32).toString('hex');
var privateKey = "0x"+id;

var wallet = new ethers.Wallet(privateKey);
console.log(wallet.address);