// src/pages/User.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi as vestingAbi  } from "../../build/contracts/Vesting.json"

const User: React.FC = () => {
    const [vestingAddress, setVestingAddress] = useState('');
    const [vestingInfo, setVestingInfo] = useState<any>(null);
    const [isClaimable, setIsClaimable] = useState(false);

    useEffect(() => {
        const address = sessionStorage.getItem('vestingAddress');
        if (address) {
            setVestingAddress(address);
        }
    }, []);

    const handleCheckVesting = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            console.log(userAddress);

            const vestingContract = new ethers.Contract(vestingAddress, vestingAbi, signer);
            const vestingSchedule = await vestingContract.vestingSchedules(userAddress);

            setVestingInfo(vestingSchedule);

            const currentTime = Math.floor(Date.now() / 1000);
            setIsClaimable(currentTime >= vestingSchedule.releaseTime && !vestingSchedule.claimed);
        } catch (error) {
            console.error(error);
            alert('Error checking vesting schedule');
        }
    };

    const handleClaimTokens = async () => {
        try {
            const ethereum = (window as any).ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            const vestingContract = new ethers.Contract(vestingAddress, vestingAbi, signer);

            const tx = await vestingContract.releaseTokens();
            await tx.wait();
            alert('Tokens claimed successfully');
        } catch (error) {
            console.error(error);
            alert('Error claiming tokens');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl mb-4">User Page</h1>
            <div className="w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700">Vesting contract address of the Organization</label>
                    <input
                        type="text"
                        value={vestingAddress}
                        onChange={(e) => setVestingAddress(e.target.value)}
                        className="mt-1 block w-full p-2 border rounded"
                    />
                </div>
                <button
                    onClick={handleCheckVesting}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-8"
                >
                    Check Vesting Schedule
                </button>

                {vestingInfo && (
                    <div className="bg-white p-4 rounded shadow-lg">
                        <p><strong>Amount:</strong> {ethers.utils.formatUnits(vestingInfo.amount, 18)} tokens</p>
                        <p><strong>Release Time:</strong> {new Date(vestingInfo.releaseTime * 1000).toLocaleString()}</p>
                        <p><strong>Claimed:</strong> {vestingInfo.claimed ? 'Yes' : 'No'}</p>
                        <p><strong>Stake-holder Type:</strong> {vestingInfo.userType}</p>
                    </div>
                )}

                {isClaimable && (
                    <button
                        onClick={handleClaimTokens}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                    >
                        Claim Tokens
                    </button>
                )}
            </div>
        </div>
    );
};

export default User;
