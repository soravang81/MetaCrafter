const WalletFactory = artifacts.require("Factory");
const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(WalletFactory);
  const factoryInstance = await WalletFactory.deployed();
  console.log('WalletFactory deployed at address:', factoryInstance.address);
};
