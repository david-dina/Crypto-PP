"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaWallet, FaExchangeAlt } from 'react-icons/fa';
import { Button } from '@/components/Buttons/Button';
import { Card } from '@/components/cards/Card';
import CheckoutHeader from "@/components/Header/CheckoutHeader";
import toast from 'react-hot-toast';
import { User} from '@prisma/client';

// Define types
interface Coin {
  symbol: string;
  name: string;
  price: number;
  amount?: number;
}

interface WalletStatus {
  connected: boolean;
  address: string | null;
}

interface NetworkStatus {
  connected: boolean;
  chainId: string | null;
  isCorrectNetwork: boolean;
}

interface PaymentStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

interface GasEstimate {
  [speed: string]: {
    gwei: number;
    usd: number;
  };
}

interface ConnectedWallet {
  id: string;
  providerName: string;
  walletAddress: string;
  chainId: number;
  balance: number;
  currency: string;
}

export const CheckoutInfo: React.FC<> = () => {
  // State management
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const availableCoins = [
    { symbol: 'ETH', name: 'Ethereum', price: 2850.75 },
    { symbol: 'BTC', name: 'Bitcoin', price: 65400.50 },
    { symbol: 'USDT', name: 'Tether', price: 1.00 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.85 }
  ];
  const productData = {
    name: "Premium Subscription Plan",
    description: "Access to all premium features",
    priceUSD: 499.99,
  };

  const [step, setStep] = useState<number>(1);
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<Coin[]>([]);
  const [gasEstimate] = useState<GasEstimate>({
    low: { gwei: 25, usd: 2.50 },
    medium: { gwei: 35, usd: 3.50 },
    high: { gwei: 45, usd: 4.50 }
  });
  const [selectedGasOption, setSelectedGasOption] = useState<string>('medium');

  const [walletStatus, setWalletStatus] = useState<WalletStatus>({
    connected: false,
    address: null
  });

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: false,
    chainId: null,
    isCorrectNetwork: false
  });

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: 'idle',
    error: null
  });

  // Temporary Cycles array
  const temporaryCycles = [
    {
      id: 'daily',
      name: 'Daily',
      description: 'Pay daily',
      price: productData.priceUSD / 30,
      billingFrequency: 1, // days
    },
    {
      id: 'monthly',
      name: 'Monthly',
      description: 'Pay monthly',
      price: productData.priceUSD,
      billingFrequency: 30, // days
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      description: 'Quarterly billing',
      price: productData.priceUSD * 3,
      billingFrequency: 90, // days
    },
    {
      id: 'annual',
      name: 'Annual',
      description: 'Annual billing',
      price: productData.priceUSD * 12,
      billingFrequency: 365, // days
    }
  ];

  // State for selected cycle
  const [selectedCycle, setSelectedCycle] = useState<typeof temporaryCycles[0] | null>(null);

  // State for connected wallets
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([
    {
      id: '1',
      providerName: 'MetaMask',
      walletAddress: '0x1234...5678',
      chainId: 1, // Ethereum mainnet
      balance: 2.5,
      currency: 'ETH'
    },
    {
      id: '2', 
      providerName: 'WalletConnect',
      walletAddress: '0x8765...4321',
      chainId: 137, // Polygon
      balance: 500,
      currency: 'MATIC'
    }
  ]);

  // Update product price when cycle changes
  useEffect(() => {
    // You might want to update the product price or trigger other logic here
  }, [selectedCycle]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/hydrate");

        if (res.ok) {
          const info = await res.json();
          setUserData(info.user);
          
          // Automatically move to step 2 if user is logged in
          if (info.user) {
            setStep(2);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render connected wallets section
  const renderConnectedWallets = () => {
    return (
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Connected Wallets</h3>
        {connectedWallets.map((wallet) => (
          <div 
            key={wallet.id} 
            className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <div>
              <div className="flex items-center">
                <span className="font-medium dark:text-white mr-2">{wallet.providerName}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {wallet.walletAddress.slice(0, 6)}...{wallet.walletAddress.slice(-4)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Chain ID: {wallet.chainId}
              </span>
            </div>
            <div className="text-right">
              <div className="font-semibold dark:text-white">
                {wallet.balance} {wallet.currency}
              </div>
            </div>
          </div>
        ))}
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          These wallets will be used for potential payment methods.
        </div>
      </div>
    );
  };

  // Handlers
  const handleAuthMethodSelect = (method: string) => {
    setAuthMethod(method);
    setStep(2);
  };

  const handleCoinSelect = (coin: Coin) => {
    const existingCoinIndex = selectedCoins.findIndex(c => c.symbol === coin.symbol);
    
    if (existingCoinIndex !== -1) {
      // Remove coin if already selected
      const updatedCoins = [...selectedCoins];
      updatedCoins.splice(existingCoinIndex, 1);
      setSelectedCoins(updatedCoins);
    } else {
      // Add coin if not already selected
      const amount = productData.priceUSD / coin.price;
      setSelectedCoins([...selectedCoins, { ...coin, amount }]);
    }
  };

  const handleConnectWallet = async () => {
    try {
      setPaymentStatus({ status: 'loading', error: null });
      
      // Simulated wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setWalletStatus({
        connected: true,
        address: '0x1234...5678'
      });
      
      setPaymentStatus({ status: 'idle', error: null });
      toast.success('Wallet connected successfully');
      setStep(3);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setPaymentStatus({
        status: 'error',
        error: errorMessage
      });
      toast.error(errorMessage);
    }
  };

  const handlePayment = async () => {
    if (!walletStatus.connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (selectedCoins.length === 0) {
      toast.error('Please select at least one payment method');
      return;
    }

    setPaymentStatus({ status: 'loading', error: null });

    try {
      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus({ status: 'success', error: null });
      toast.success('Payment processed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentStatus({
        status: 'error',
        error: errorMessage
      });
      toast.error(errorMessage);
    }
  };

  const handleSwap = () => {
    toast.success('Redirecting to swap page...');
    // TODO: Implement actual swap navigation
  };

  return (
    <>
      <CheckoutHeader
        sidebarOpen={false} 
        setSidebarOpen={() => {}} 
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
        </div>
      ) : (
        <Card 
          variant="elevated"
          title={step === 1 ? "Authentication" : step === 2 ? "Complete Purchase" : "Confirmation"}
          footer={
            step === 1 ? null : step === 2 ? (
              <div className="space-y-4">
                {!walletStatus.connected ? (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={handleConnectWallet}
                  >
                    <FaWallet className="mr-2" />
                    Connect Wallet
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={handlePayment}
                    disabled={paymentStatus.status === 'loading'}
                  >
                    {paymentStatus.status === 'loading' ? 'Processing...' : 'Confirm Payment'}
                  </Button>
                )}
              </div>
            ) : null
          }
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-between w-full mb-6">
            {[1, 2, 3].map((number, index) => (
              <React.Fragment key={number}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center z-10
                  ${step >= number 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
                `}>
                  {number}
                </div>
                {index < 2 && (
                  <div className="flex-grow mx-[-12px]">
                    <div className={`h-1 w-full relative 
                      ${step > number 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-200 dark:bg-gray-700'}
                    `} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Authentication */}
          {step === 1 && (
            <div className="space-y-4">
              {['signup', 'login', 'wallet'].map((method) => (
                <div 
                  key={method}
                  className="p-4 rounded-lg border border-gray-200 cursor-pointer 
                             hover:border-indigo-500 dark:border-gray-700 
                             dark:hover:border-indigo-400"
                  onClick={() => handleAuthMethodSelect(method)}
                >
                  <h3 className="font-medium capitalize dark:text-white">{method}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {method === 'signup' 
                      ? 'New to our platform? Create an account' 
                      : method === 'login' 
                      ? 'Already have an account? Sign in'
                      : 'Use your crypto wallet to continue'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Payment Selection */}
          {step === 2 && (
            <div>
              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{productData.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{productData.description}</p>
              </div>

              {/* Payment Periods (Cycles) Selection */}
              <div className="mb-6">
                <h4 className="text-gray-700 mb-3 dark:text-gray-300 font-semibold">Select Billing Period</h4>
                <div className="grid grid-cols-4 gap-3">
                  {temporaryCycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className={`
                        p-3 rounded-lg border cursor-pointer 
                        ${selectedCycle?.id === cycle.id 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                          : 'border-gray-200 dark:border-gray-700'}
                        hover:border-indigo-500 dark:hover:border-indigo-400
                      `}
                      onClick={() => setSelectedCycle(cycle)}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <h5 className="font-medium dark:text-white mb-1">{cycle.name}</h5>
                        <span className="text-sm font-semibold dark:text-white">
                          ${cycle.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {cycle.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="mb-6">
                <h4 className="text-gray-700 mb-2 dark:text-gray-300">Select Payment Method</h4>
                <div className="grid grid-cols-2 gap-4">
                  {availableCoins.map((coin) => (
                    <div
                      key={coin.symbol}
                      className={`p-4 rounded-lg border cursor-pointer hover:border-indigo-500 
                        ${selectedCoins.some(c => c.symbol === coin.symbol) 
                          ? 'border-indigo-500' 
                          : 'border-gray-200 dark:border-gray-700'}
                        dark:hover:border-indigo-400`}
                      onClick={() => handleCoinSelect(coin)}
                    >
                      <h4 className="font-medium dark:text-white">{coin.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">${coin.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Coins Summary */}
              {selectedCoins.length > 0 && selectedCycle && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-gray-700 mb-3 dark:text-gray-300 font-semibold">Coin Conversions</h4>
                  <div className="space-y-2">
                    {selectedCoins.map((coin) => {
                      // Calculate the equivalent amount based on selected cycle's price
                      const equivalentAmount = selectedCycle.price / coin.price;
                      
                      return (
                        <div 
                          key={coin.symbol} 
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-medium dark:text-white">{coin.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold dark:text-white">
                              ~{equivalentAmount.toFixed(4)} {coin.symbol}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Current Price: ${coin.price.toFixed(2)}
                            </div>
                            <button 
                              onClick={() => {
                                // Remove coin from selected coins
                                setSelectedCoins(prev => 
                                  prev.filter(c => c.symbol !== coin.symbol)
                                );
                              }}
                              className="text-red-500 hover:text-red-700 text-xs mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                      These coins will be saved as acceptable payment methods for this transaction.
                    </div>
                  </div>
                </div>
              )}

              {/* Connected Wallets Section */}
              {renderConnectedWallets()}

              {/* Gas Fee Estimate */}
              <div className="mb-6">
                <h4 className="text-gray-700 mb-2 dark:text-gray-300">Gas Fee Estimate</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(gasEstimate).map(([speed, estimate]) => (
                    <div
                      key={speed}
                      className={`p-4 rounded-lg border text-center cursor-pointer 
                        ${selectedGasOption === speed 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                          : 'border-gray-200 dark:border-gray-700'}
                        dark:hover:border-indigo-400`}
                      onClick={() => setSelectedGasOption(speed)}
                    >
                      <div className="font-medium capitalize dark:text-white">{speed}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{estimate.gwei} Gwei</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">${estimate.usd.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Swap Button */}
              <div className="mb-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSwap}
                  className="w-full"
                >
                  <FaExchangeAlt className="mr-2" />
                  Swap Tokens
                </Button>
              </div>

              {/* Total Amount */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-semibold">Total Amount</div>
                <div>
                  <div className="text-lg font-semibold">
                    ${selectedCycle ? selectedCycle.price.toFixed(2) : productData.priceUSD.toFixed(2)} USD
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    + ${gasEstimate[selectedGasOption].usd} (gas)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 
                                dark:bg-green-900/20 dark:border-green-800">
                <h3 className="text-green-800 font-medium mb-2 dark:text-green-300">Waiting for Confirmation</h3>
                <p className="text-green-700 text-sm dark:text-green-400">Please confirm the transaction in your wallet...</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 
                                dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-medium mb-4 dark:text-white">Transaction Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-medium dark:text-white">${selectedCycle ? selectedCycle.price.toFixed(2) : productData.priceUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gas Fee</span>
                    <span className="font-medium dark:text-white">${gasEstimate[selectedGasOption].usd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-medium dark:text-white">
                      ${(selectedCycle ? selectedCycle.price : productData.priceUSD) + gasEstimate[selectedGasOption].usd}.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
};