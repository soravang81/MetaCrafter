import { ethers } from 'ethers';

let provider: ethers.providers.Web3Provider | null = null;
let signer: ethers.Signer | null = null;

if (typeof window !== 'undefined' && (window as any).ethereum) {
  provider = new ethers.providers.Web3Provider((window as any).ethereum);
  await(window as any).ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
    if(provider){
        signer = provider.getSigner();
    }
    console.log('Connected account:', accounts[0]);
  }).catch((error: any) => {
    console.error('User denied account access', error);
  });
} else {
  console.error('MetaMask is not installed');
}

export { provider, signer };