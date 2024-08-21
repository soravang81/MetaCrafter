// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

const connectWallet = async () => {
    try {
        const ethereum = (window as any).ethereum;
        if (!ethereum) {
            alert('MetaMask is not installed!');
            return;
        }
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected:', accounts[0]);
        localStorage.setItem('userAddress', accounts[0]);
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Error connecting to MetaMask');
    }
};

const AppWrapper: React.FC = () => {
    const [userAddress, setUserAddress] = React.useState<string | null>(null);

    React.useEffect(() => {
        const address = localStorage.getItem('userAddress');
        if (address) {
            setUserAddress(address);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {userAddress ? (
                <Router>
                    <React.StrictMode>
                        <App />
                    </React.StrictMode>
                </Router>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl mb-4">Connect to MetaMask</h2>
                    <button
                        onClick={connectWallet}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Connect Wallet
                    </button>
                </div>
            )}
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<AppWrapper />);
