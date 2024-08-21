const InsuranceFactory = artifacts.require("InsuranceFactory");

module.exports = function(deployer) {
  deployer.deploy(InsuranceFactory);
};
