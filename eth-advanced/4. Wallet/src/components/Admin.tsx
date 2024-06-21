import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Factory from '../../build/contracts/Factory.json';
import Wallet from '../../build/contracts/Wallet.json';

const App: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [factoryContract, setFactoryContract] = useState<any>(null);
  const [walletContract, setWalletContract] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [network, setNetwork] = useState<string>('sepolia');
  // const networkId = Number(await web3Instance.eth.net.getId());
  const networkId = 11155111;

  useEffect(() => {
    const initWeb3 = async () => {
      if ((window as any).ethereum) {
        const web3Instance = new Web3((window as any).ethereum);
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          const factoryAddress = Factory.networks[networkId]?.address;

          const factoryInstance = new web3Instance.eth.Contract(Factory.abi, factoryAddress);
          setWeb3(web3Instance);
          setAccounts(accounts);
          setFactoryContract(factoryInstance);
          await changeNetwork(network);
        } catch (error) {
          console.error('Error initializing web3:', error);
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };

    initWeb3();
  }, [network]);

  const changeNetwork = async (network: string) => {
    const chainIds: { [key: string]: number } = {
      sepolia: 11155111,
      mainnet: 1,
    };

    const chainId = chainIds[network];

    if (web3 && accounts.length > 0) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        const factoryAddress = Factory.networks[networkId]?.address;
        const factoryInstance = new web3.eth.Contract(Factory.abi, factoryAddress);
        setFactoryContract(factoryInstance);
      } catch (error) {
        console.error('Error switching network:', error);
      }
    }
  };

  const createWallet = async () => {
    if (web3 && factoryContract && accounts.length > 0) {
      try {
        const tx = await factoryContract.methods.createWallet().send({ from: accounts[0] });
        console.log("tx" , tx);
        const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
        console.log(receipt);
        const walletAddress = await tx?.events?.WalletCreated?.returnValues?.walletAddress;
        console.log('Transaction Hash:', tx.transactionHash);
        console.log('Transaction Receipt:', receipt);
        if (walletAddress) {
          setWalletAddress(walletAddress)
          const walletInstance = new web3.eth.Contract(Wallet.abi, walletAddress);
          console.log(walletInstance)
          setWalletContract(walletInstance);
          getBalance();
        } else {
          console.error('Wallet address not found in receipt events');
        }
      } catch (error) {
        console.error('Error creating wallet:', error);
      }
    }
  };

  const directTransfer = async () => {
    if (web3 && walletContract && accounts.length > 0) {
      try {
        const tx = await walletContract.methods.executeTransfer(recipient, web3.utils.toWei(amount, 'ether')).send({ from: accounts[0] });
        const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
        console.log('Direct transfer successful', tx);
        console.log('Transaction Receipt:', receipt);
        getBalance();
      } catch (error) {
        console.error('Direct transfer failed:', error);
      }
    }
  };

  const getBalance = async () => {
    if (web3 && walletContract) {
      const balance = await walletContract.methods.getBalance().call();
      console.log(balance);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }
  };

  const createUserOperation = async () => {
    if (web3 && walletContract && accounts.length > 0) {
      const sender = accounts[0];
      const nonce = await web3.eth.getTransactionCount(sender);
      const etherValue = web3.utils.toWei(amount, 'ether');
      const callData = await walletContract.methods.executeTransfer(recipient, etherValue).encodeABI();
      const messageHash = web3.utils.soliditySha3(sender, nonce, callData);
      if (messageHash) {
        const signature = await web3.eth.sign(messageHash, sender);
        const userOp = {
          sender,
          nonce,
          callData,
          callGasLimit: 1000000000,
          verificationGasLimit: 60000000,
          preVerificationGas: 10000000,
          maxFeePerGas: web3.utils.toWei('100', 'gwei'),
          maxPriorityFeePerGas: web3.utils.toWei('70', 'gwei'),
          paymasterAndData: '0x',
          signature,
        };
        return userOp;
      }
    }
    return null;
  };

  const sendUserOperation = async () => {
    if (web3 && walletContract && recipient && amount) {
      try {
        const userOp = await createUserOperation();
        console.log(userOp)
        const tx = await walletContract.methods.handleUserOperation(userOp).send({ from: accounts[0], gas: 1000000 });
        const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
        console.log('Logs:', tx.events.Logs);
        console.log('Transaction :',tx);
        console.log('New Contract Balance:', web3.utils.fromWei(await walletContract.methods.getBalance().call(), 'ether'));
      } catch (error :any) {
        if (error.receipt && error.receipt.logs && error.receipt.logs.length > 0) {
          const revertLog = error.receipt.logs.find((log : any) => log.topics[0] === web3.utils.keccak256('OperationHandled(address,uint256)'));
          if (revertLog) {
            console.error('Revert Reason:', web3.utils.hexToUtf8(revertLog.data));
          }
        }
        console.error('Operation failed:', error);
        alert(`Operation failed. Check console for details. Error: ${(error as any).message}`);
      }
    }
  };

  const depositFunds = async () => {
    if (web3 && walletContract) {
      const depositAmount = web3.utils.toWei(amount, 'ether');
      try {
        const tx = await walletContract.methods.deposit().send({ from: accounts[0], value: depositAmount, gas: 1000000 });
        const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
        console.log('Deposit successful', receipt);
        getBalance();
      } catch (error) {
        console.error('Deposit failed:', error);
        alert('Deposit failed. Check console for details.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Smart Contract Wallet</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Network:</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="sepolia">Sepolia Testnet</option>
            <option value="mainnet">Mainnet</option>
          </select>
        </div>
        <div className="mb-4">
          <button
            onClick={createWallet}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
          >
            Create Wallet
          </button>
          {walletAddress && <p className="text-gray-700 mb-2">Wallet Address: {walletAddress}</p>}
        </div>
        {walletAddress && (
          <div className="mb-4">
            <button
              onClick={getBalance}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
            >
              Get Balance
            </button>
            <p className="text-gray-700 text-center">Balance: {balance ? `${balance} ETH` : 'Loading...'}</p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
              />
              <input
                type="text"
                placeholder="Amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"
              />
              <button
                onClick={sendUserOperation}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Send Funds
              </button>
              <button
                onClick={directTransfer}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Direct Transfer
              </button>
              <button
                onClick={depositFunds}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Deposit Funds
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
