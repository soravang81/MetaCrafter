import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Factory from '../../build/contracts/Factory.json';
import Wallet from '../../build/contracts/Wallet.json';

const App: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const [walletContract, setWalletContract] = useState<ethers.Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [network, setNetwork] = useState<string>('sepolia');

  useEffect(() => {
    const init = async () => {
      if ((window as any).ethereum) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const factoryContractAddress = Factory.networks[11155111].address
        const factoryContract = new ethers.Contract(factoryContractAddress,Factory.abi,signer);
        console.log(factoryContract)
        setProvider(provider);
        setSigner(signer);
        setFactoryContract(factoryContract);
        await changeNetwork(network);
      }
      else {
        console.log("wallet error")
        console.error('Please install MetaMask!');
      }
    };

    init();
  }, [network]);

  const changeNetwork = async (network: string) => {
    let chainId: number;
    let contractAddress: string;

    switch (network) {
      case 'sepolia':
        chainId = 11155111; // Sepolia chain ID
        contractAddress = Factory.networks[11155111].address; 
        break;
      case 'mainnet':
        chainId = 1; // Mainnet chain ID
        contractAddress = 'YOUR_MAINNET_CONTRACT_ADDRESS';
        break;
      default:
        return;
    }

    if (provider && signer) {
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(chainId) }]);
        const factoryContract = new ethers.Contract(contractAddress, Factory.abi, signer);
        setFactoryContract(factoryContract);
      } catch (error) {
        console.error('Error switching network:', error);
      }
    }
  };

  const createWallet = async () => {
    if (factoryContract && signer) {
      try {
        const tx = await factoryContract.createWallet({ from: await signer.getAddress() });
        const receipt = await tx.wait();
        console.log('Transaction Hash:', tx.hash);
        console.log('Transaction Receipt:', receipt);
  
        const walletAddress = receipt.events?.find((event: any) => event.event === 'WalletCreated')?.args.walletAddress;
        console.log('Wallet Address:', walletAddress);
  
        if (walletAddress) {
          setWalletAddress(walletAddress);
          const wallet = new ethers.Contract(walletAddress, Wallet.abi, signer);
          setWalletContract(wallet);
        } else {
          console.error('Wallet address not found in receipt events');
        }
      } catch (error) {
        console.error('Error creating wallet:', error);
      }
    }
  };
  
  

  const getBalance = async () => {
    if (walletContract) {
      const balance = await walletContract.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const sendFunds = async () => {
    if (walletContract && recipient && amount) {
      try {
        const tx = await walletContract.transfer(
          recipient,
          ethers.utils.parseEther(amount),
          { gasLimit: 3000000 }
        );
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error('Transaction failed:', error);
        alert('Transaction failed. Check console for details.');
      }
    }
  };

  const depositFunds = async () => {
    if (walletContract) {
      const depositAmount = ethers.utils.parseEther(amount);
      try {
        const tx = await walletContract.deposit({ value: depositAmount });
        await tx.wait();
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
                onClick={sendFunds}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
                >
                  Send Funds
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
  
