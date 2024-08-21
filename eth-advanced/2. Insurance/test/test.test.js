const InsuranceFactory = artifacts.require("InsuranceFactory");
const CryptoWalletInsurance = artifacts.require("CryptoWalletInsurance");
const CollateralProtectionInsurance = artifacts.require("CollateralProtectionInsurance");

contract("InsuranceFactory", accounts => {
  let insuranceFactory;

  before(async () => {
    insuranceFactory = await InsuranceFactory.deployed();
  });

  it("should create wallet insurance", async () => {
    await insuranceFactory.createWalletInsurance({ from: accounts[0] });
    const walletInsuranceAddress = await insuranceFactory.userToWalletInsurance(accounts[0]);
    assert(walletInsuranceAddress !== '0x0000000000000000000000000000000000000000', "Wallet insurance not created");
  });

  it("should create collateral insurance", async () => {
    await insuranceFactory.createCollateralInsurance({ from: accounts[1] });
    const collateralInsuranceAddress = await insuranceFactory.userToCollateralInsurance(accounts[1]);
    assert(collateralInsuranceAddress !== '0x0000000000000000000000000000000000000000', "Collateral insurance not created");
  });

  it("should set and pay premium for wallet insurance", async () => {
    const walletInsuranceAddress = await insuranceFactory.userToWalletInsurance(accounts[0]);
    const walletInsurance = await CryptoWalletInsurance.at(walletInsuranceAddress);

    await walletInsurance.setPolicy(0, { from: accounts[0] }); 
    await walletInsurance.payPremium({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });

    const lastPaid = await walletInsurance.lastPaid();
    assert(lastPaid > 0, "Premium not paid");
  });

  it("should set and pay premium for collateral insurance", async () => {
    const collateralInsuranceAddress = await insuranceFactory.userToCollateralInsurance(accounts[1]);
    const collateralInsurance = await CollateralProtectionInsurance.at(collateralInsuranceAddress);

    await collateralInsurance.setPolicy(0, { from: accounts[1] }); 
    await collateralInsurance.payPremium({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });

    const lastPaid = await collateralInsurance.lastPaid();
    assert(lastPaid > 0, "Premium not paid");
  });

  it("should allow claiming wallet insurance", async () => {
    const walletInsuranceAddress = await insuranceFactory.userToWalletInsurance(accounts[0]);
    const walletInsurance = await CryptoWalletInsurance.at(walletInsuranceAddress);

    // Ensure the contract has enough balance to cover the claim
    await web3.eth.sendTransaction({ from: accounts[0], to: walletInsuranceAddress, value: web3.utils.toWei('1', 'ether') });

    const balanceBefore = BigInt(await web3.eth.getBalance(accounts[0]));
    await walletInsurance.claim({ from: accounts[0] });
    const balanceAfter = BigInt(await web3.eth.getBalance(accounts[0]));

    assert(balanceAfter > balanceBefore, "Claim not successful");
  });

  it("should allow claiming collateral insurance", async () => {
    const collateralInsuranceAddress = await insuranceFactory.userToCollateralInsurance(accounts[1]);
    const collateralInsurance = await CollateralProtectionInsurance.at(collateralInsuranceAddress);

    const loanAmount = web3.utils.toWei('1', 'ether');

    await web3.eth.sendTransaction({ from: accounts[1], to: collateralInsuranceAddress, value: web3.utils.toWei('0.5', 'ether') });

    const balanceBefore = BigInt(await web3.eth.getBalance(accounts[1]));
    await collateralInsurance.claim(loanAmount, { from: accounts[1] });
    const balanceAfter = BigInt(await web3.eth.getBalance(accounts[1]));

    assert(balanceAfter > balanceBefore, "Claim not successful");
  });
});
