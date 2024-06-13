// src/pages/Admin.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Admin from "../../build/contracts/Admin.json";
import Vesting from "../../build/contracts/Vesting.json";

const AdminPage: React.FC = () => {
    const [refetch , setRefetch] = useState(false)
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [initialSupply, setInitialSupply] = useState('');
    const [vestingAddress, setVestingAddress] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [amount, setAmount] = useState('');
    const [releaseTime, setReleaseTime] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [mintToAddress, setMintToAddress] = useState('');
    const [burnAmount, setBurnAmount] = useState('');
    const [burnFromAddress, setBurnFromAddress] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenDetails, setTokenDetails] = useState({
        name: '',
        symbol: '',
        totalSupply: '',
        adminBalance: ''
    });
    const getDetails = async()=>{
        const ethereum = (window as any).ethereum;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, Admin.abi, signer);
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        const totalSupply = await tokenContract.totalSupply();
        const adminBalance = await tokenContract.balanceOf(await signer.getAddress());
        setTokenDetails({
            name: name,
            symbol: symbol,
            totalSupply: ethers.utils.formatUnits(totalSupply, 18),
            adminBalance: ethers.utils.formatUnits(adminBalance, 18)
        });
    }
    useEffect(()=>{
        const tokenAdd = localStorage.getItem("tokenContract")
        tokenAdd ? setTokenAddress(tokenAdd):null
        const vestingAdd = localStorage.getItem("vestingContract")
        vestingAdd ? setVestingAddress(vestingAdd):null
        getDetails()
    },[vestingAddress,tokenAddress,refetch])

    const handleDeployContracts = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            // Deploy MyToken
            const MyTokenFactory = new ethers.ContractFactory(Admin.abi, Admin.bytecode, signer);
            const initialSupplyInWei = ethers.utils.parseUnits(initialSupply, 18);
            const myTokenContract = await MyTokenFactory.deploy(tokenName, tokenSymbol, initialSupplyInWei);
            await myTokenContract.deployed();
            alert(`MyToken deployed at: ${myTokenContract.address}`);
            setTokenAddress(myTokenContract.address);
            localStorage.setItem("tokenContract" , myTokenContract.address);

            // Deploy TokenVesting
            const TokenVestingFactory = new ethers.ContractFactory(Vesting.abi, Vesting.bytecode, signer);
            const tokenVestingContract = await TokenVestingFactory.deploy(myTokenContract.address);
            await tokenVestingContract.deployed();

            setVestingAddress(tokenVestingContract.address);
            localStorage.setItem("vestingContract" , tokenVestingContract.address);
            alert(`TokenVesting deployed at: ${tokenVestingContract.address}`);
        } catch (error) {
            console.error(error);
            alert('Error deploying contracts');
        }
    };

    const handleWhitelist = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const vestingContract = new ethers.Contract(vestingAddress, Vesting.abi, signer);

            const tx = await vestingContract.whitelistAddress(beneficiary);
            await tx.wait();
            alert('Address whitelisted successfully');
        } catch (error) {
            console.error(error);
            alert('Error whitelisting address');
        }
    };

    const handleSetVesting = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const vestingContract = new ethers.Contract(vestingAddress, Vesting.abi, signer);

            const amountInWei = ethers.utils.parseUnits(amount, 18);
            const releaseTimestamp = Math.floor(new Date(releaseTime).getTime() / 1000);

            const tx = await vestingContract.setVestingSchedule(beneficiary, amountInWei, releaseTimestamp);
            await tx.wait();
            setRefetch(!refetch)
            alert('Vesting schedule set successfully');
        } catch (error) {
            console.error(error);
            alert('Error setting vesting schedule');
        }
    };

    const handleMint = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, Admin.abi, signer);

            const mintAmountInWei = ethers.utils.parseUnits(mintAmount, 18);
            const tx = await tokenContract.mint(mintAmountInWei);
            await tx.wait();
            alert('Tokens minted successfully');
            setRefetch(!refetch)
        } catch (error) {
            console.error(error);
            alert('Error minting tokens');
        }
    };

    const handleMintTo = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, Admin.abi, signer);

            const mintAmountInWei = ethers.utils.parseUnits(mintAmount, 18);
            const tx = await tokenContract.mintTo(mintToAddress, mintAmountInWei);
            await tx.wait();
            alert('Tokens minted to address successfully');
            setRefetch(!refetch)
        } catch (error) {
            console.error(error);
            alert('Error minting tokens to address');
        }
    };

    const handleBurn = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, Admin.abi, signer);

            const burnAmountInWei = ethers.utils.parseUnits(burnAmount, 18);
            const tx = await tokenContract.burn(burnAmountInWei);
            await tx.wait();
            alert('Tokens burned successfully');
            setRefetch(!refetch)
        } catch (error) {
            console.error(error);
            alert('Error burning tokens');
        }
    };

    const handleBurnFrom = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const tokenContract = new ethers.Contract(tokenAddress, Admin.abi, signer);

            const burnAmountInWei = ethers.utils.parseUnits(burnAmount, 18);
            const tx = await tokenContract.burnFrom(burnFromAddress, burnAmountInWei);
            await tx.wait();
            alert('Tokens burned from address successfully');
            setRefetch(!refetch)
        } catch (error) {
            console.error(error);
            alert('Error burning tokens from address');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl mb-4">Admin Page</h1>
            <div className="w-full max-w-[40rem]">
                <div className='flex  justify-between w-full'>
                    <div className='w-[45%]'>
                        <div className="mb-4">
                        <label className="block text-gray-700">Token Name</label>
                        <input
                            type="text"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded"
                        />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Token Symbol</label>
                            <input
                                type="text"
                                value={tokenSymbol}
                                onChange={(e) => setTokenSymbol(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Initial Supply</label>
                            <input
                                type="text"
                                value={initialSupply}
                                onChange={(e) => setInitialSupply(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleDeployContracts}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8"
                        >
                            Deploy Contracts
                        </button>
                    </div>
                    <div className='w-[50%]'>
                        <div className="bg-white shadow-md rounded-lg p-6 mb-8 h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Your Token Details</h2>
                            </div>
                            <div className="space-y-2 pr-16">
                            <div className="flex text-xl justify-between items-center">
                                <span className="font-medium text-gray-700">Name:</span>
                                <span className="
                               text-xl text-gray-900">{tokenDetails.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-medium text-gray-700">Symbol:</span>
                                <span className="
                               text-xl text-gray-900">{tokenDetails.symbol}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-medium text-gray-700">Total Supply:</span>
                                <span className="
                               text-xl text-gray-900">{tokenDetails.totalSupply}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-medium text-gray-700">Your Balance:</span>
                                <span className="
                               text-xl text-gray-900">{tokenDetails.adminBalance}</span>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className='border border-black w-[40rem] self-center '></div>
                <br/>
                <div className="mb-4">
                    <label className="block text-gray-700">Beneficiary Address</label>
                    <input
                        type="text"
                        value={beneficiary}
                        onChange={(e) => setBeneficiary(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Amount</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Release Time (ISO 8601 format)</label>
                    <input
                        type="text"
                        value={releaseTime}
                        onChange={(e) => setReleaseTime(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handleWhitelist}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Whitelist Address
                    </button>
                    <button
                        onClick={handleSetVesting}
                        className="bg-green-500 text-white px-4                         py-2 rounded hover:bg-green-600"
                    >
                        Set Vesting Schedule
                    </button>
                </div>
                <br/>
                <div className='border border-black w-[40rem] self-center '></div>
                <br/>
                <div className="mb-4">
                    <label className="block text-gray-700">Mint Amount</label>
                    <input
                        type="text"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Mint To Address</label>
                    <input
                        type="text"
                        value={mintToAddress}
                        onChange={(e) => setMintToAddress(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Burn Amount</label>
                    <input
                        type="text"
                        value={burnAmount}
                        onChange={(e) => setBurnAmount(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Burn From Address</label>
                    <input
                        type="text"
                        value={burnFromAddress}
                        onChange={(e) => setBurnFromAddress(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handleMint}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Mint Tokens
                    </button>
                    <button
                        onClick={handleMintTo}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Mint To Address
                    </button>
                </div>
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handleBurn}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Burn Tokens
                    </button>
                    <button
                        onClick={handleBurnFrom}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Burn From Address
                    </button>
                </div>
                

            </div>
        </div>
    );
};

export default AdminPage;

