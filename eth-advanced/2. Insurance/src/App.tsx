import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import InsuranceFactoryABI from '../build/contracts/InsuranceFactory.json';
import CryptoWalletInsuranceABI from '../build/contracts/CryptoWalletInsurance.json';
import CollateralProtectionInsuranceABI from '../build/contracts/CollateralProtectionInsurance.json';

const App: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const [walletInsuranceContract, setWalletInsuranceContract] = useState<any>(null);
  const [collateralInsuranceContract, setCollateralInsuranceContract] = useState<any>(null);
  const [walletInsuranceAddress, setWalletInsuranceAddress] = useState<string>('');
  const [policyType, setPolicyType] = useState<string>('Basic');
  const [collateralInsuranceAddress, setCollateralInsuranceAddress] = useState<string>('');
  const [policyCreated , setPolicyCreated] = useState<boolean>(false)
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');

  const contractAddress = InsuranceFactoryABI.networks[11155111].address as string;

  useEffect(() => {
    const initProvider = async () => {
      if ((window as any).ethereum) {
        const providerInstance = new ethers.providers.Web3Provider((window as any).ethereum);
        setProvider(providerInstance);
        const signerInstance = providerInstance.getSigner();
        setSigner(signerInstance);

        const address = await signerInstance.getAddress();
        setUserAddress(address);
        console.log('User Address:', address);

        const factoryInstance = new ethers.Contract(contractAddress, InsuranceFactoryABI.abi, signerInstance);
        setFactoryContract(factoryInstance);
        console.log('Factory Contract:', factoryInstance);
      } else {
        alert('Please install MetaMask!');
      }
    };

    initProvider();
  }, []);

  const createWalletInsurance = async () => {
    if (factoryContract && signer && provider) {
      try {
        const gasPrice = await provider.getGasPrice();
        console.log('Gas price:', gasPrice);
        const tx = await factoryContract.createWalletInsurance({
          gasLimit: ethers.utils.hexlify(900000),
          maxFeePerGas: gasPrice.mul(2),
          maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei')
        });
        console.log(tx);
        const receipt = await tx.wait();
        console.log(receipt);
        const event = receipt.events.find((event:any) => event.event === 'WalletInsuranceCreated');
        const insuranceAddress = event.args.insuranceContract;
        setWalletInsuranceAddress(insuranceAddress);
        const walletInsuranceInstance = new ethers.Contract(insuranceAddress, CryptoWalletInsuranceABI.abi, signer);
        setWalletInsuranceContract(walletInsuranceInstance);
        const insuredAddress = await walletInsuranceInstance.getInsured();
        console.log('Insured Address:', insuredAddress);
      } catch (error) {
        console.error('Error creating wallet insurance', error);
      }
    }
  };  

  const setWalletPolicy = async () => {
    if (walletInsuranceContract && signer) {
      try {
        const type = policyType === "Premium" ? 1 : 0;
        const tx = await walletInsuranceContract.setPolicy(type , { gasLimit: 900000 });
        await tx.wait();
        alert('Policy updated successfully!');
        setPolicyCreated(true);
      } catch (error) {
        console.error('Error setting policy', error);
      }
    }
  };

  const payPriceWalletInsurance = async () => {
    if (walletInsuranceContract && signer ) {
      try {
        if(!policyCreated){
          alert('Please set your policy first!');
          return;
        }
        const tx1 = await walletInsuranceContract.getInsured({gasLimit : 900000})
        console.log(tx1)
        const price = await walletInsuranceContract.price();
        console.log('Policy price:', price);
        const tx = await walletInsuranceContract.payPrice({
          value : price,
          gasLimit: 900000,
        });
        await tx.wait();
        alert('Insurance paid successfully!');
      } catch (error) {
        console.error('Error paying price', error);
      }
    }
  };

  const claimWalletInsurance = async () => {
    if (walletInsuranceContract && signer) {
      try {
        await getLastPaid();
        await getCoverageAmount();
        await getContractBalance();
        const tx = await walletInsuranceContract.claim({ gasLimit: 300000 });
        await tx.wait();
        alert('Insurance claimed successfully!');
      } catch (error) {
        console.error('Error claiming insurance', error);
      }
    }
  };
  const getLastPaid = async () => {
    try {
      const lastPaid = await walletInsuranceContract.lastPaid();
      console.log('Last Paid:', lastPaid.toString());
    } catch (error) {
      console.error('Error getting lastPaid', error);
    }
  };
  
  const getCoverageAmount = async () => {
    try {
      const coverageAmount = await walletInsuranceContract.coverageAmount();
      console.log('wallet insurence address : ' , walletInsuranceAddress);
      console.log('Coverage Amount:', ethers.utils.formatEther(coverageAmount));
    } catch (error) {
      console.error('Error getting coverageAmount', error);
    }
  };
  
  const getContractBalance = async () => {
    try {
      const balance = await provider?.getBalance(walletInsuranceContract.address);
      balance? console.log('Contract Balance:', ethers.utils.formatEther(balance)): null;
    } catch (error) {
      console.error('Error getting contract balance', error);
    }
  };
  const createCollateralInsurance = async () => {
    if (factoryContract && signer) {
      try {
        const tx = await factoryContract.createCollateralInsurance({ gasLimit: 300000 });
        const receipt = await tx.wait();
        const events = factoryContract.interface.parseLog(receipt.logs[0]);
        const insuranceAddress = events.args.insuranceContract;
        setCollateralInsuranceAddress(insuranceAddress);
        const collateralInsuranceInstance = new ethers.Contract(insuranceAddress, CollateralProtectionInsuranceABI.abi, signer);
        setCollateralInsuranceContract(collateralInsuranceInstance);
      } catch (error) {
        console.error('Error creating collateral insurance', error);
      }
    }
  };

  const setCollateralPolicy = async () => {
    if (collateralInsuranceContract && signer) {
      try {
        const tx = await collateralInsuranceContract.setPolicy(policyType, { gasLimit: 300000 });
        await tx.wait();
        alert('Policy updated successfully!');
      } catch (error) {
        console.error('Error setting policy', error);
      }
    }
  };

  const payPriceCollateralInsurance = async () => {
    if (collateralInsuranceContract && signer) {
      try {
        const tx = await collateralInsuranceContract.payPrice({
          value: collateralInsuranceContract.price(),
          gasLimit: 300000
        });
        await tx.wait();
        alert('Premium paid successfully!');
      } catch (error) {
        console.error('Error paying price', error);
      }
    }
  };

  const claimCollateralInsurance = async () => {
    if (collateralInsuranceContract && signer) {
      try {
        const tx = await collateralInsuranceContract.claim(ethers.utils.parseEther(loanAmount), { gasLimit: 300000 });
        await tx.wait();
        alert('Insurance claimed successfully!');
      } catch (error) {
        console.error('Error claiming insurance', error);
      }
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Insurance Management</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Crypto Wallet Insurance</h2>
        <button onClick={createWalletInsurance} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">Create Wallet Insurance</button>
        {walletInsuranceAddress && (
          <div>
            <p className="mb-2">Insurance Address: {walletInsuranceAddress}</p>
            <select 
              onChange={(e) => setPolicyType(e.target.value)} 
              value={policyType}
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
            </select>
            <button onClick={setWalletPolicy} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Set Policy</button>
            <button onClick={payPriceWalletInsurance} className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2">Pay Insurance</button>
            <button onClick={claimWalletInsurance} className="bg-red-500 text-white px-4 py-2 rounded-md">Claim Insurance</button>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Collateral Protection Insurance</h2>
        <button onClick={createCollateralInsurance} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">Create Collateral Insurance</button>
        {collateralInsuranceAddress && (
          <div>
            <p className="mb-2">Insurance Address: {collateralInsuranceAddress}</p>
            <select 
              onChange={(e) => setPolicyType(e.target.value)} 
              value={policyType}
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
            </select>
            <button onClick={setCollateralPolicy} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Set Policy</button>
            <input 
              type="text" 
              placeholder="Loan Amount" 
              value={loanAmount} 
              onChange={(e) => setLoanAmount(e.target.value)} 
              className="block w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <button onClick={payPriceCollateralInsurance} className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2">Pay Insurance</button>
            <button onClick={claimCollateralInsurance} className="bg-red-500 text-white px-4 py-2 rounded-md">Claim Insurance</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

  