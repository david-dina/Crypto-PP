"use client";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaStar, FaRegStar } from "react-icons/fa";
import WalletDropdown from "./walletDropdown";
import SwapModal from "./SwapModal";
import TransferModal from "./TransferModal";
import { BrowserProvider } from "ethers";
import {ProviderModal} from "./ProviderModal";

declare global {
  interface Window {
    ethereum?: any;
    phantom?: any;
  }
}

const WalletTable = () => {
  const [walletData, setWalletData] = useState<any[]>([]);
  const [providers, setProviders] = useState([]);
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const [primaryWallet, setPrimaryWallet] = useState<string | null>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isSwapModalOpen, setSwapModalOpen] = useState({
    isOpen: false,
    wallet: null,
  });
  const [isTransferModalOpen, setTransferModalOpen] = useState({
    isOpen: false,
    wallet: null,
  });

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await fetch('/api/wallets/getWallets', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data.data)
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
    fetchWallets();
  }, []);


  const detectSupportedProviders = () => {
    const supportedProviders = [];
     // Check for Phantom (Solana)
    if (window.phantom && window.phantom.isPhantom) {
      supportedProviders.push("Phantom");
    }
  
    // Check for MetaMask
    if (window.ethereum && window.ethereum.isMetaMask) {
      supportedProviders.push("MetaMask");
    }
  
    // Check for Coinbase Wallet
    if (window.ethereum && window.ethereum.isCoinbaseWallet) {
      supportedProviders.push("Coinbase Wallet");
    }
  
    // Check for Trust Wallet
    if (window.ethereum && window.ethereum.isTrust) {
      supportedProviders.push("Trust Wallet");
    }
  
    // Check for Binance Wallet
    if (window.ethereum && window.ethereum.isBinanceWallet) {
      supportedProviders.push("Binance Wallet");
    }
  
    console.log("Supported providers detected:", supportedProviders);
    return supportedProviders;
  };

  const handleWalletConnection = async () => {
    console.log("Connecting to wallet...");
  
    const providers = detectSupportedProviders();
    if (providers.length === 0) {
      console.log("No Ethereum wallet detected. Please install a wallet like MetaMask.");
      return;
    }
  
    if (providers.length > 1) {
      console.log("Multiple wallets detected:", providers);
      setProviders(providers);
      setIsProviderModalOpen(true); // Open modal to let the user choose a wallet
    } else {
      console.log("Single wallet detected:", providers);
      await connectToWallet(handleSelectProvider(providers[0])); // Connect to the single detected wallet
    }
  };

  const handleSelectProvider = async (providerName) => {
    setIsProviderModalOpen(false);
  
    let provider;
    switch (providerName) {
      case "MetaMask":
        provider = window.ethereum?.isMetaMask
        break;
      case "Coinbase Wallet":
        provider = window.ethereum?.isCoinbaseWallet
        break;
      case "Trust Wallet":
        provider = window.ethereum?.isTrust
        break;
      case "Binance Wallet":
        provider = window.ethereum?.isBinanceWallet
        break;
      case "Phantom":
        provider = window.phantom?.isPhantom
        break;
      default:
        console.error("Unsupported provider:", providerName);
        return;
    }
  
    if (!provider) {
      console.error(`Provider ${providerName} not found.`);
      return;
    }
  
    await connectToWallet(provider); // Connect to the selected provider
  };

  const connectToWallet = async (provider) => {
    try {
      const ethersProvider = new BrowserProvider(provider);
      await ethersProvider.send("eth_requestAccounts", []);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();

      const blockchain = "Ethereum";
      const providerName = detectProvider(provider);

      await saveWalletToDatabase(address, blockchain, providerName);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const saveWalletToDatabase = async (address: string, blockchain: string, provider: string) => {
    try {
      console.log(provider)
      const response = await fetch('/api/wallets/saveWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, blockchain,provider }),
      });

      if (response.ok) {
        console.log('Wallet saved to database');
        window.location.reload();
      } else {
        console.error('Failed to save wallet to database');
      }
    } catch (error) {
      console.error('Error saving wallet to database:', error);
    }
  };

  const detectProvider = (provider: any) => {
    if (provider.isPhantom) {
      return "Phantom";}
    else if (provider.isMetaMask) {
      return "MetaMask";
    } else if (provider.isCoinbaseWallet) {
      return "CoinbaseWallet";
    } else if (provider.isTrust) {
      return "TrustWallet";
    } else if (provider.isBinanceWallet) {
      return "BinanceWallet";
    }
  };

  // Store last refreshed time for each wallet
  const [refreshTimes, setRefreshTimes] = useState<{ [key: string]: string }>(() => {
    const initialTimes: { [key: string]: string } = {};
    walletData.forEach((wallet) => {
      initialTimes[wallet.address] = new Date().toLocaleString(); // Use wallet address as key
    });
    return initialTimes;
  });

  // Toggle dropdown to expand/collapse wallet details
  const toggleDropdown = (walletAddress: string) => {
    setExpandedWallet(expandedWallet === walletAddress ? null : walletAddress);
  };

  // Toggle primary wallet
  const togglePrimaryWallet = (walletAddress: string) => {
    setPrimaryWallet(primaryWallet === walletAddress ? null : walletAddress);
  };

  // Update the last refreshed time for a specific wallet
  const handleRefresh = (walletAddress: string) => {
    const newTimes = { ...refreshTimes };
    newTimes[walletAddress] = new Date().toLocaleString();
    setRefreshTimes(newTimes);
  };

  return (
    <div className="rounded-[10px] bg-white px-5 pb-4 pt-5 shadow-1 dark:bg-gray-dark dark:shadow-card w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-lg font-bold text-dark dark:text-white">
          Wallet Overview
        </h4>
        <div className="flex items-center gap-2">

          <WalletDropdown
            wallets={walletData}
            refreshWallets={{}} // Pass the fetchWallets function
            connectWallet={handleWalletConnection} // Pass the handleWalletConnection function
          />
        </div>
      </div>
      <ProviderModal
          isOpen={isProviderModalOpen}
          onClose={() => setIsProviderModalOpen(false)}
          providers={providers}
          onSelectProvider={handleSelectProvider}
        />

      {/* Loading or Error */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-600 dark:text-gray-300">
          Loading wallets...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-10 text-red-500">
          Error fetching wallets. Try again later.
        </div>
      ) : walletData.length === 0 ? (
        <div className="flex justify-center items-center py-10">
          <p>No wallets found. Add one to get started.</p>
          <button
            onClick={() => {}} // Add functionality here
            className="rounded-lg px-4 py-2 font-medium transition-colors hover:shadow-md bg-primary text-white hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-dark"
          >
            Add Wallet
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-8 text-center">
            {/* Group 1: Source */}
            <div className="col-span-2 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Source</h5>
            </div>

            {/* Group 2: Balance */}
            <div className="col-span-1 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Balance</h5>
            </div>

            {/* Group 3: Last Refreshed */}
            <div className="col-span-2 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Last Refreshed</h5>
            </div>

            {/* Group 4: Network */}
            <div className="col-span-1 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Network</h5>
            </div>

            {/* Group 5: Actions */}
            <div className="col-span-2 px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase">Actions</h5>
            </div>
          </div>

          {/* Table Rows */}
          {walletData.map((wallet, key) => (
            <div key={key}>
              {/* Wallet Row */}
              <div
                className={`grid sm:grid-cols-8 grid-cols-1 gap-y-4 items-center text-center ${
                  key === walletData.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-dark-3"
                }`}
              >
                {/* Source */}
                <div className="col-span-2 flex flex-col sm:flex-row items-center gap-3 px-2 py-4">
                  <img
                    src={wallet.image || "/images/placeholder.svg"}
                    alt={wallet.provider}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-medium text-dark dark:text-white">
                    {wallet.provider}
                  </p>
                  {/* Primary Wallet Toggle */}
                  <button
                    className="ml-2 text-yellow-500"
                    onClick={() => togglePrimaryWallet(wallet.address)}
                  >
                    {primaryWallet === wallet.address ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>

                {/* Balance */}
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

                {/* Last Refreshed */}
                <div className="col-span-2 flex items-center justify-center px-2 py-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(wallet.updatedAt).toLocaleString()}
                  </p>
                </div>

                {/* Network */}
                <div className="col-span-1 flex items-center justify-center px-2 py-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {wallet.blockchain}
                  </p>
                </div>

                {/* Actions */}
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

              {/* Dropdown Details */}
              {expandedWallet === wallet.address && (
                <div className="bg-[#F7F9FC] dark:bg-dark-3 px-4 py-3 rounded-b-md">
                  <h5 className="mb-3 text-sm font-medium text-dark dark:text-white">
                    Portfolio Details
                  </h5>
                  {/* Wallet Address */}
                  <div className="flex justify-between text-sm font-medium text-dark dark:text-white mb-3">
                    <span>Wallet Address</span>
                    <span className="text-gray-500 dark:text-gray-400">{wallet.address}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {wallet.coins && wallet.coins.length > 0 ? (
                      wallet.coins.map((coin, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm font-medium text-dark dark:text-white"
                        >
                          <span>{coin.coin}</span>
                          <span>
                            {coin.balance} ({coin.value})
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No coins available
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <SwapModal
        isOpen={isSwapModalOpen.isOpen}
        onClose={() => setSwapModalOpen({ isOpen: false, wallet: null })}
        wallet={isSwapModalOpen.wallet} // Pass wallet data to modal
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