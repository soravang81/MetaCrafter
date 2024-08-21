import { Contract, ethers } from 'ethers';

export interface CryptoWalletInsurance extends Contract {
  payPremium(value:any): Promise<any>;
  claim(): Promise<any>;
}

export interface CollateralProtectionInsurance extends Contract {
  payPremium(value:any): Promise<any>;
  claim(loanAmount: ethers.BigNumber): Promise<any>;
}
