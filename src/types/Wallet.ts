export interface Wallet {
  image: string;
  name: string;
  balance: string;
  network: string;
  lastRefreshed: string;
}

export interface Web3OnboardWallet {
  accounts: {
    address: string;
    balance: string;
    ens: string | null;
  }[];
  chains: {
    id: string;
    namespace: string;
  }[];
  label: string;
  icon: string;
  provider: any; // You can make this more specific based on your needs
}

import type { EIP1193Provider } from '@web3-onboard/core';

export interface WalletData {
  id: string;
  address: string;
  blockchain: string;
  provider: string;
  providerImage?: string;
  balance: string;
  updatedAt: string;
  tokenBalances?: {
    tokenName: string;
    balance: string;
    icon?: string;
  }[];
}