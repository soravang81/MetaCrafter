import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { provider, signer } from './ethers.ts';
import Currency from '../build/contracts/Currency.json';
import { Circles, CirclesWithBar, InfinitySpin } from 'react-loader-spinner'
import { disabled } from 'express/lib/application.js';

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false)
  const [currency, setCurrency] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!provider || !signer) {
        console.error('Provider is not initialized');
        return;
      }

      try {
        setLoading(true)
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setLoading(false)

        const networkId = await provider.getNetwork().then(network => network.chainId);
        console.log(Currency.networks)
        const deployedNetwork = Currency.networks[networkId];
        console.log(deployedNetwork)
        const contractInstance = new ethers.Contract(
          deployedNetwork.address,
          Currency.abi,
          signer
        );

        setCurrency(contractInstance);

        const accountBalance = await contractInstance.bank(accounts[0]);
        setBalance(ethers.utils.formatUnits(accountBalance, 18));
      } catch (error) {
        setLoading(false)
        console.error('Error initializing', error);
      }
    };

    init();
  }, []);

  const handlePrint = async () => {
    if (!currency || amount <= 0) return;
    try {
      setLoading(true)
      const tx = await currency.Print(account, ethers.utils.parseUnits(amount.toString(), 18));
      await tx.wait();
      setLoading(false)
      console.log(tx)
      const newBalance = await currency.bank(account);
      setBalance(ethers.utils.formatUnits(newBalance, 18));
    } catch (error) {
      setLoading(false)
      console.error('Error printing currency', error);
    }
  };

  const handleSpend = async () => {
    if (!currency || amount <= 0) return;
    try {
      setLoading(true)
      const tx = await currency.Spend(account, ethers.utils.parseUnits(amount.toString(), 18));
      await tx.wait();
      setLoading(false)
      console.log(tx)
      const newBalance = await currency.bank(account);
      setBalance(ethers.utils.formatUnits(newBalance, 18));
    } catch (error) {
      setLoading(false)
      console.error('Error spending currency', error);
    }
  };
  const handleTrasnfer = async()=>{
    if (!currency || amount <= 0 ) return;
    try {
      setLoading(true)
      const tx = await currency.Transfer(account,ethers.utils.parseUnits(amount.toString(), 18), receiver);
      await tx.wait();
      setLoading(false)
      console.log(tx)
      const newBalance = await currency.bank(account);
      setBalance(ethers.utils.formatUnits(newBalance, 18));
    } catch (error) {
      setLoading(false)
      console.error('Error spending currency', error);
    }
  }

  return (
    <div className='mx-20 my-5 flex flex-col gap-10'>

      <h1 className='text-4xl font-semibold'>Banking DApp</h1>

      <h3 className='text-2xl'>Account : <span>{account}</span></h3>

      <h3 className='text-2xl flex' >Balance : {loading ? <CirclesWithBar height={40}/> :<span> {balance}</span>}</h3>
      
      <form className='w-fit flex gap-4 items-center'>
        <input type="number" className='border-2 py-4 rounded-lg p-2 text-xl' placeholder='Amount' onChange={(e)=>{setAmount(parseInt(e.target.value))}} />
        <button className='w-40 text-white shadow-2xl border-2 border-slate-900 font-semibold text-2xl bg-blue-500 rounded-md px-10 py-3' onClick={handlePrint} disabled={loading}>Print</button>
      </form>

      <form className='w-fit flex gap-4 items-center '>
        <input type="number" className='border-2 py-4 rounded-lg p-2 text-xl' placeholder='Amount' onChange={(e)=>{setAmount(parseInt(e.target.value))}} />
        <button className='w-40 text-white shadow-2xl border-2 border-slate-900 font-semibold text-2xl bg-blue-500 rounded-md px-10 py-3' onClick={handleSpend}disabled={loading}>Spend</button>
      </form>
      
      <form className='w-fit flex gap-4 items-center'>
        <div className='flex flex-col gap-5'>
        <input type="number" className='border-2 py-4 rounded-lg p-2 text-xl' placeholder='Amount' onChange={(e)=>{setAmount(parseInt(e.target.value))}} />
        <input type='text' className='border-2 py-4 rounded-lg p-2 text-xl' placeholder='Receiver address' onChange={(e)=>{setReceiver(e.target.value)}}/>
        </div>
        <button className='w-40 text-white self-end shadow-2xl border-2 border-slate-900 font-semibold text-2xl bg-blue-500 rounded-md px-10 py-3' onClick={handlePrint} disabled={loading}>Transfer</button>
      </form>
    </div>
  );
};

export default App;
