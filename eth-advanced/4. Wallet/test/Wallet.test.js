const Wallet = artifacts.require("Wallet");
const WalletFactory = artifacts.require("Factory");

contract("Wallet", (accounts) => {
    let factory;
    let wallet;
    let owner = accounts[0];
    let recipient = accounts[1];

    before(async () => {
        factory = await WalletFactory.new();
        await factory.createWallet({ from: owner });
        const walletAddresses = await factory.getWallets();
        wallet = await Wallet.at(walletAddresses[0]);
    });

    it("should deploy Wallet contract", async () => {
        const address = wallet.address;
        assert.ok(address, "Wallet contract address is not defined");
    });

    it("should allow the owner to deposit Ether", async () => {
        const depositAmount = web3.utils.toWei("1", "ether");
        await web3.eth.sendTransaction({ from: owner, to: wallet.address, value: depositAmount });
        const balance = await wallet.getBalance();
        assert.equal(balance.toString(), depositAmount, "Deposit amount does not match");
    });

    it("should allow the owner to transfer Ether", async () => {
        const depositAmount = web3.utils.toWei("1", "ether");
        const transferAmount = web3.utils.toWei("0.5", "ether");

        await web3.eth.sendTransaction({ from: owner, to: wallet.address, value: depositAmount });
        const initialBalance = await web3.eth.getBalance(wallet.address);

        const tx = await wallet.transfer(recipient, transferAmount, { from: owner });

        const finalBalance = await web3.eth.getBalance(wallet.address);
        const recipientBalance = await web3.eth.getBalance(recipient);

        const transferEvent = tx.logs.find(log => log.event === 'FundsTransferred');
        assert.ok(transferEvent, "FundsTransferred event was not emitted");
        assert.equal(transferEvent.args.to, recipient, "Transfer recipient mismatch");
        assert.equal(transferEvent.args.amount.toString(), transferAmount, "Transfer amount mismatch");

        assert.equal(web3.utils.toBN(initialBalance).sub(web3.utils.toBN(finalBalance)).toString(), transferAmount, "Balance mismatch after transfer");
        assert.equal(web3.utils.toBN(recipientBalance).toString(), web3.utils.toBN(transferAmount).add(web3.utils.toBN(web3.utils.toWei("0", "ether"))).toString(), "Recipient balance mismatch");
    });
});
