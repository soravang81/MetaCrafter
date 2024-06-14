const WalletFactory = artifacts.require("Factory");
const Wallet = artifacts.require("Wallet");

contract("WalletFactory", (accounts) => {
    let factory;
    let owner;

    before(async () => {
        factory = await WalletFactory.new();
        owner = accounts[0];
    });

    it("should deploy WalletFactory", async () => {
        const address = await factory.address;
        assert.ok(address);
    });

    it("should allow the owner to create a new wallet", async () => {
        await factory.createWallet({ from: owner });
        const wallets = await factory.getWallets();
        assert.equal(wallets.length, 1);
    });

    it("should store the wallet address correctly", async () => {
        const walletAddress = await factory.getWallets();
        const walletInstance = await Wallet.at(walletAddress[0]);
        const balance = await walletInstance.getBalance();
        assert.equal(balance.toString(), '0');
    });
});
