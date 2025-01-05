"use client";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaStar, FaRegStar } from "react-icons/fa";
import WalletDropdown from "./walletDropdown";
import SwapModal from "./SwapModal";
import TransferModal from "./TransferModal";
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import toast from "react-hot-toast";
import ChainSelectionModal from "./ChainSelectModal";

const injected = injectedModule();
const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x1', // Ethereum Mainnet
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    },
    {
      id: '0x89', // Polygon Mainnet
      token: 'MATIC',
      label: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473'
    },
    {
      id: '0x38', // Binance Smart Chain (BSC) Mainnet
      token: 'BNB',
      label: 'Binance Smart Chain',
      rpcUrl: 'https://bsc-mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473'
    },
  ],
  appMetadata: {
    name: 'NexPay',
    icon: 'https://your-app-icon.png',
    description: 'Your most reliable crypto processor',
  },
  accountCenter: {
    desktop: {
      position: "bottomRight",
      enabled: true
    },
    mobile: {
      position: "bottomRight",
      enabled: true
    }
  },
  connect: {
    autoConnectAllPreviousWallet: true
  }
});

const WalletTable = () => {
  const [walletData, setWalletData] = useState<any[]>([]);
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const [primaryWallet, setPrimaryWallet] = useState<string | null>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSwapModalOpen, setSwapModalOpen] = useState({
    isOpen: false,
    wallet: null,
  });
  const [isTransferModalOpen, setTransferModalOpen] = useState({
    isOpen: false,
    wallet: null,
  });
  const [isChainModalOpen, setChainModalOpen] = useState(false);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wallets/getWallets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setWalletData(data.data);
      } else {
        console.error('Failed to fetch wallets');
      }
    } catch (err) {
      console.error(err);
      setError(`${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const detectBlockchain = async (provider: any) => {
    try {
      // Check for Bitcoin-specific providers
      if (provider.isBitcoin) {
        return "Bitcoin";
      }

      // Fallback to EVM chain detection
      if (provider.request && typeof provider.request === 'function') {
        const chainId = await provider.request({ method: 'eth_chainId' });
        switch (chainId) {
          case '0x1': return 'Ethereum';
          case '0x38': return 'BinanceSmartChain';
          case '0x89': return 'Polygon';
          default: return `Unsupported Chain (ID: ${chainId})`;
        }
      }

      // Fallback for non-EVM chains
      if (provider.getNetwork && typeof provider.getNetwork === 'function') {
        const network = await provider.getNetwork();
        if (network.includes('solana')) return 'Solana';
        else return `Unsupported Chain (Network: ${network})`;
      }

      return 'Unsupported Chain';
    } catch (error) {
      console.error('Error detecting blockchain:', error);
      return 'Unsupported Chain';
    }
  };

  const detectInjectors = () => {
      const detectedProviders = [];
      if (window.ethereum) {
        detectedProviders.push({ name: "Ethereum", id: "ethereum" });
      }
      if (window.solana) {
        detectedProviders.push({ name: "Solana", id: "solana" });
      }
      if (window.btc) {
        detectedProviders.push({ name: "Bitcoin", id: "bitcoin" });
      }
      return detectedProviders;
  }

  const handleWalletConnection = async () => {
    // Open the chain selection modal
    const detectedProviders = detectInjectors();
    if (detectedProviders.length === 1) {
      handleChainSelection(detectedProviders[0].id);
    }else if(detectedProviders.length ===0){
      handleChainSelection("ethereum");
    }else{
    setChainModalOpen(true);
  }
  };

  const handleChainSelection = async (selectedChain: string) => {
    setChainModalOpen(false); // Close the modal

    try {
      let wallets = [];

      // Connect wallet based on the selected chain
      if (selectedChain === "ethereum") {
        wallets = await onboard.connectWallet(); // Connect EVM wallet
      } else if (selectedChain === "solana") {
        wallets = await connectSolanaWallet(); // Fake function for Solana
      } else if (selectedChain === "bitcoin") {
        wallets = await connectBitcoinWallet(); // Fake function for Bitcoin
      }

      if (wallets.length > 0) {
        const walletList = [];

        // Process wallet details
        for (const wallet of wallets) {
          const { provider, label, accounts,icon } = wallet;
          const address = accounts[0].address;
          const blockchain = await detectBlockchain(provider);
          const providerName = label;

          walletList.push({ address, blockchain, provider: providerName,providerImage:icon });
        }

        // Save to database
        await saveWalletToDatabase(walletList);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const saveWalletToDatabase = async (walletList: { address: string; blockchain: string; provider: string }[]) => {
    try {
      const response = await fetch('/api/wallets/saveWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallets: walletList }), // Send the list of wallets
      });
      if (response.ok) {
        toast.success("Wallets connected successfully");
        console.log('Wallets saved to database');
        fetchWallets();
      } else {
        console.error('Failed to save wallets to database');
      }
    } catch (error) {
      console.error('Error saving wallets to database:', error);
    }
  };

  // Fake functions for Solana and Bitcoin
  const connectSolanaWallet = async () => {
    return [{ provider: "Solana", label: "Phantom", accounts: [{ address: "SOL-ADDRESS" }] }];
  };

  const connectBitcoinWallet = async () => {
    return [{ provider: "Bitcoin", label: "BTC Wallet", accounts: [{ address: "BTC-ADDRESS" }] }];
  };

  const [refreshTimes, setRefreshTimes] = useState<{ [key: string]: string }>(() => {
    const initialTimes: { [key: string]: string } = {};
    walletData.forEach((wallet) => {
      initialTimes[wallet.address] = new Date().toLocaleString();
    });
    return initialTimes;
  });

  const toggleDropdown = (walletAddress: string) => {
    setExpandedWallet(expandedWallet === walletAddress ? null : walletAddress);
  };

  const togglePrimaryWallet = (walletAddress: string) => {
    setPrimaryWallet(primaryWallet === walletAddress ? null : walletAddress);
  };

  const handleRefresh = (walletAddress: string) => {
    const newTimes = { ...refreshTimes };
    newTimes[walletAddress] = new Date().toLocaleString();
    setRefreshTimes(newTimes);
  };

  return (
    <div className="rounded-[10px] bg-white px-5 pb-4 pt-5 shadow-1 dark:bg-gray-dark dark:shadow-card w-full">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-lg font-bold text-dark dark:text-white">
          Wallet Overview
        </h4>
        <div className="flex items-center gap-2">
          <WalletDropdown
            wallets={walletData}
            refreshWallets={{}}
            connectWallet={handleWalletConnection}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-600 dark:text-gray-300">
          Loading wallets...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-10 text-red-500">
          Error fetching wallets. Try again later.
        </div>
      ) : walletData.length === 0 ? (<div className="flex flex-col justify-center items-center py-10 space-y-4">
        <p className="text-gray-600 dark:text-gray-300">No wallets found. Add one to get started.</p>
        <button
          onClick={handleWalletConnection}
          className="rounded-lg px-6 py-2 font-medium transition-colors hover:shadow-md bg-primary text-white hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-dark"
        >
          Add Wallet
        </button>
      </div>
      ) : (
        <div className="flex flex-col">
          <div className="hidden sm:grid grid-cols-8 text-center">
            <div className="col-span-2 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Source</h5>
            </div>
            <div className="col-span-1 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Balance</h5>
            </div>
            <div className="col-span-2 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Last Refreshed</h5>
            </div>
            <div className="col-span-1 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Network</h5>
            </div>
            <div className="col-span-2 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Actions</h5>
            </div>
          </div>
          {walletData.map((wallet, key) => (
            <div key={key}>
              <div
                className={`grid sm:grid-cols-8 grid-cols-1 gap-y-4 items-center text-center ${
                  key === walletData.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-dark-3"
                }`}
              >
                <div className="col-span-2 flex flex-col sm:flex-row items-center gap-3 px-2 py-4">
                  <img
                    src={wallet.providerImage || "/images/placeholder.svg"} // Use providerImage
                    alt={wallet.provider}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-medium text-dark dark:text-white">
                    {wallet.provider}
                  </p>
                  <button
                    className="ml-2 text-yellow-500"
                    onClick={() => togglePrimaryWallet(wallet.address)}
                  >
                    {primaryWallet === wallet.address ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>
                <div
                  className="col-span-1 flex items-center justify-center px-2 py-4 cursor-pointer"
                  onClick={() => toggleDropdown(wallet.address)}
                >
                  <p className="font-medium text-green-500">{wallet.balance}</p>
                  {expandedWallet === wallet.address ? (
                    <FaChevronUp className="ml-2 text-dark dark:text-white" />
                  ) : (
                    <FaChevronDown className="ml-2 text-dark dark:text-white" />
                  )}
                </div>
                <div className="col-span-2 flex items-center justify-center px-2 py-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(wallet.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-1 flex items-center justify-center px-2 py-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {wallet.blockchain}
                  </p>
                </div>
                <div className="col-span-2 flex justify-end gap-2 px-2 py-4">
                  <button
                    onClick={() => setSwapModalOpen({ isOpen: true, wallet })}
                    className="rounded-lg px-4 py-2 font-medium transition-colors hover:shadow-md bg-primary text-white hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-dark"
                  >
                    Swap
                  </button>
                  <button
                    onClick={() => setTransferModalOpen({ isOpen: true, wallet })}
                    className="font-medium transition-colors hover:underline text-black dark:text-white"
                  >
                    Transfer
                  </button>
                </div>
              </div>
              {expandedWallet === wallet.address && (
                <div className="bg-[#F7F9FC] dark:bg-dark-3 px-4 py-3 rounded-b-md">
                  <h5 className="mb-3 text-sm font-medium text-dark dark:text-white">
                    Portfolio Details
                  </h5>
                  <div className="flex justify-between text-sm font-medium text-dark dark:text-white mb-3">
                    <span>Wallet Address</span>
                    <span className="text-gray-500 dark:text-gray-400">{wallet.address}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {wallet.tokenBalances && wallet.tokenBalances.length > 0 ? (
                      wallet.tokenBalances.map((token, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm font-medium text-dark dark:text-white"
                        >
                          <span>{token.tokenName}</span>
                          <span>
                            {token.balance} {token.icon && <img src={token.icon} alt={token.tokenName} className="w-4 h-4 inline-block" />}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tokens available
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ChainSelectionModal
        isOpen={isChainModalOpen}
        onClose={() => setChainModalOpen(false)}
        onSelect={handleChainSelection}
      />
      <SwapModal
        isOpen={isSwapModalOpen.isOpen}
        onClose={() => setSwapModalOpen({ isOpen: false, wallet: null })}
        wallet={isSwapModalOpen.wallet}
      />
      <TransferModal
        isOpen={isTransferModalOpen.isOpen}
        onClose={() => setTransferModalOpen({ isOpen: false, wallet: null })}
        wallet={isTransferModalOpen.wallet}
      />
    </div>
  );
};

export default WalletTable;