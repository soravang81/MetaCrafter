const Currency = artifacts.require("Currency");

module.exports = function (deployer) {
  deployer.deploy(Currency);
};