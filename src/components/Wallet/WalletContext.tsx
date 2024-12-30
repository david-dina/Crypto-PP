"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Onboard, { WalletState } from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers, BrowserProvider, JsonRpcSigner, Network } from "ethers";
import { FaBalanceScaleLeft } from "react-icons/fa";

// --- Types ---
interface WalletContextType {
  wallets: WalletState[];
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  balance: string;
  network: Network | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

interface WalletProviderProps {
  children: ReactNode;
}

// --- Context ---
const WalletContext = createContext<WalletContextType | null>(null);

// --- Wallet Provider ---
const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // --- States ---
  const [wallets, setWallets] = useState<WalletState[]>([]);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [balance, setBalance] = useState<string>("0.0");
  const [network, setNetwork] = useState<Network | null>(null);
  const [onboard, setOnboard] = useState<any>(null);

  // --- Initialize Onboard ---
  useEffect(() => {
    const initOnboard = () => {
      const injected = injectedModule();

      const onboardInstance = Onboard({
        wallets: [injected],
        chains: [
          {
            id: "0x1", // Ethereum Mainnet
            token: "ETH",
            label: "Ethereum",
            rpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
          },
          {
            id: "0x89", // Polygon
            token: "MATIC",
            label: "Polygon",
            rpcUrl: "https://polygon-rpc.com",
          },
          {
            id: "0x38", // Binance Smart Chain
            token: "BNB",
            label: "BSC",
            rpcUrl: "https://bsc-dataseed.binance.org/",
          },
        ],
        appMetadata: {
          name: "Crypto PP",
          description: "A crypto-based payment processing platform.",
          recommendedInjectedWallets: [
            { name: "MetaMask", url: "https://metamask.io" },
            { name: "Coinbase", url: "https://wallet.coinbase.com/" },
          ],
        },
      });

      setOnboard(onboardInstance);
    };

    initOnboard();
  }, []);

  // --- Connect Wallet ---
  const connectWallet = async (): Promise<void> => {
    if (!onboard) return;

    const connectedWallets = await onboard.connectWallet();
    if (connectedWallets.length > 0) {
      const walletProvider = connectedWallets[0].provider;

      // Setup Provider and Signer with ethers.js
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      setWallets(connectedWallets);
      setProvider(ethersProvider);
      setSigner(signer);

      // Fetch Balance and Network
      const networkInfo = await ethersProvider.getNetwork();
      setNetwork(networkInfo);

      const address = await signer.getAddress();
      const balance = await ethersProvider.getBalance(address);
      setBalance(ethers.formatEther(balance)); // Convert balance to ETH
      

      console.log("Connected Wallet Address:", address);
      console.log(connectedWallets)
      console.log(balance);
    }
  };

  // --- Disconnect Wallet ---
  const disconnectWallet = async (): Promise<void> => {
    if (!onboard || wallets.length === 0) return;

    await onboard.disconnectWallet({ label: wallets[0].label });

    setWallets([]);
    setProvider(null);
    setSigner(null);
    setBalance("0.0");
    setNetwork(null);

    console.log("Disconnected Wallet");
  };

  // --- Context Values ---
  const walletContextValue: WalletContextType = {
    wallets,
    provider,
    signer,
    balance,
    network,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={walletContextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// --- Hook for Context ---
const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export { WalletProvider, useWallet };
