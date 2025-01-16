"use client";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaStar, FaRegStar } from "react-icons/fa";
import WalletDropdown from "./walletDropdown";
import SwapModal from "./SwapModal";
import TransferModal from "./TransferModal";
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { requireSupportedChain } from "@/libs/chainConfig";

declare global {
  interface Window {
    ethereum?: any;
    phantom?: any;
  }
}

const injected = injectedModule();

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
  const [onboardInstance, setOnboardInstance] = useState<any>(null);

  useEffect(() => {
    const initOnboard = () => {
      const onboard = Onboard({
        wallets: [injected],
        chains: [
          {
            id: 11155111,
            token: 'ETH',
            label: 'Sepolia',
            rpcUrl: 'https://sepolia.infura.io/v3/6318caa00e7a48e8a961f00bf056b473s'
          }
        ],
        appMetadata: {
          name: 'NexPay (Test)',
          icon: '<your-actual-icon-url>',
          description: 'Testing crypto processor on Sepolia',
        },
        theme: 'system',
        accountCenter: {
          desktop: { position: 'bottomRight', enabled: true },
          mobile: { position: 'bottomRight', enabled: true },
        },
        connect: {
          autoConnectAllPreviousWallet: true,
        },
      });
      setOnboardInstance(onboard);
    };
    fetchWallets();
    initOnboard();
  }, []);

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
    if(loading) return;
    const stateWallets = onboardInstance.state.get()
    const wallets = stateWallets.wallets
    if (wallets.length > 0){
    setPrimaryWallet(wallets[0].accounts[0].address)
    console.log("primary wallet", wallets[0].accounts[0].address)}
  }, [loading]);


  useEffect(() => {
    if (!onboardInstance) return;
    // Subscribe to changes in the `wallets` state
    const subscription = onboardInstance.state.select('wallets').subscribe((updatedWallets) => {
      if (updatedWallets.length > 0) {
        // Typically, we focus on the first wallet
        const firstWallet = updatedWallets[0]
        const { label, accounts, chains } = firstWallet

        // If there's at least one account, get the address
        const address = accounts.length > 0 ? accounts[0].address : null

        // If there's at least one chain, get chain info
        // Note: `chain.id` is often a hex string like '0x1' for Ethereum
        const chainIdHex = chains.length > 0 ? chains[0].id : null
        const chainId = chainIdHex ? parseInt(chainIdHex, 16) : null

        console.log('Wallet label:', label)
        console.log('Active address:', address)
        console.log('Active chainId:', chainId)
        
        // If chain changes from 1 -> 56, you'll see that update here

        // ... Do something whenever chain changes, e.g., re-fetch data, or update DB
        if (chainId) {
          // Possibly store chainId and address in state or call your backend
          // updateChainInDatabase({ address, chainId, providerLabel: label })
        }
      }
    })

    // Cleanup on unmount
    return () => subscription.unsubscribe()
  }, [onboardInstance])

  const handleWalletConnection = async () => {
    if (!onboardInstance) return;
    try {
      const wallets = await onboardInstance.connectWallet();
      console.log("Connecting..")

      if (wallets.length > 0) {
        const walletList = [];

        // Process wallet details
        for (const wallet of wallets) {
          try {
            const { provider, label, accounts, icon } = wallet;
            const address = accounts[0].address;
            const blockchain = await requireSupportedChain(provider);
            const providerName = label;

            walletList.push({ address, blockchain, provider: providerName, providerImage: icon });
          } catch (error: any) {
            // Handle chain validation error
            toast.error(error.message || "Please connect to a supported network");
            return; // Exit early if chain validation fails
          }
        }

        // Only save to database if all wallets are on supported chains
        if (walletList.length > 0) {
          await saveWalletToDatabase(walletList);
        }
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const saveWalletToDatabase = async (walletList: { 
    address: string; 
    blockchain: string; 
    provider: string;
    providerImage?: string; 
  }[]) => {
    try {
      const response = await fetch('/api/wallets/saveWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallets: walletList }),
      });
      
      if (!response.ok) {
        // Add better error handling based on status codes
        if (response.status === 409) {
          toast.error("Wallet already exists");
        } else if (response.status === 401) {
          toast.error("Please login to connect wallets");
        } else {
          toast.error("Failed to save wallets");
        }
        return;
      }
      
      toast.success("Wallets connected successfully");
      fetchWallets();
    } catch (error) {
      console.error('Error saving wallets to database:', error);
      toast.error("Failed to connect wallet");
    }
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

  const togglePrimaryWallet = async (walletAddress: string) => {
    // Ensure wallets are retrieved properly
    const currentWallets = onboardInstance.state.select('wallets');
  
    const wallet = currentWallets.find((w) => w.accounts[0].address === walletAddress); // Use find() instead of map()
  
    if (wallet) {
      onboardInstance.state.actions.setPrimaryWallet(wallet); // Set primary wallet
      setPrimaryWallet(walletAddress); // Update state
    }
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
      ) : walletData.length === 0 ? (<div className="flex sflex-col justify-center items-center py-10 space-y-4">
        <p className="text-gray-600 dark:text-gray-300">No wallets found. Add one to get started.</p>
        <button
          onClick={()=>{handleWalletConnection()}}
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
                    className="ml-2 text-yellow-500 hover:scale-110 transition-transform"
                    onClick={() => togglePrimaryWallet(wallet.address)}
                  >
                    {primaryWallet === wallet.address ? (
                      <FaStar className="drop-shadow-md" />
                    ) : (
                      <FaRegStar />
                    )}
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
                  <p className="text-sm text-dark dark:text-white">
                    {new Date(wallet.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-1 flex items-center justify-center px-2 py-4 text-center">
                  <p className="text-sm text-dark dark:text-white">
                    {wallet.blockchain}
                  </p>
                </div>
                <div className="col-span-2 flex justify-end gap-3 px-2 py-4">
                  <button
                    onClick={() => setSwapModalOpen({ isOpen: true, wallet })}
                    className="rounded-lg px-4 py-2 font-medium transition-all hover:shadow-md bg-primary text-white hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary-dark hover:-translate-y-0.5"
                  >
                    Swap
                  </button>
                  <button
                    onClick={() => setTransferModalOpen({ isOpen: true, wallet })}
                    className="rounded-lg px-4 py-2 font-medium transition-all hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary-light dark:hover:text-primary-light hover:-translate-y-0.5"
                  >
                    Transfer
                  </button>
                </div>
              </div>
              {expandedWallet === wallet.address && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="backdrop-blur-sm bg-white/5 dark:bg-dark/5 px-6 py-4 rounded-lg">
                      <h5 className="mb-4 text-sm font-semibold text-dark dark:text-white">
                        Portfolio Details
                      </h5>
                      <div className="flex justify-between text-sm font-medium text-dark dark:text-white mb-4 p-3 bg-white/50 dark:bg-dark/50 backdrop-blur-md rounded-lg">
                        <span>Wallet Address</span>
                        <span className="font-mono">{wallet.address}</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {wallet.tokenBalances && wallet.tokenBalances.length > 0 ? (
                          wallet.tokenBalances.map((token, idx) => (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={idx}
                              className="flex justify-between items-center text-sm font-medium text-dark dark:text-white p-3 bg-white/50 dark:bg-dark/50 backdrop-blur-md rounded-lg hover:bg-white/70 dark:hover:bg-dark/70 transition-colors"
                            >
                              <span className="flex items-center gap-2">
                                {token.icon && <img src={token.icon} alt={token.tokenName} className="w-5 h-5" />}
                                {token.tokenName}
                              </span>
                              <span className="font-mono">{token.balance}</span>
                            </motion.div>
                          ))
                        ) : (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
                          >
                            No tokens available
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      )}
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