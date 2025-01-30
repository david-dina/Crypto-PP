"use client";

import React, { useState, useEffect } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from '@/components/Buttons/Button';
import { Input } from '@/components/FormElements/Input';
import { Card } from '@/components/cards/Card';
import { FaWallet, FaExchangeAlt, FaGasPump } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Sample data for available cryptocurrencies
const availableCoins = [
  { symbol: 'ETH', name: 'Ethereum', price: 2850.75 },
  { symbol: 'BTC', name: 'Bitcoin', price: 65400.50 },
  { symbol: 'USDT', name: 'Tether', price: 1.00 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00 },
  { symbol: 'MATIC', name: 'Polygon', price: 0.85 }
];

// Sample product data
const productData = {
  name: "Premium Subscription Plan",
  description: "12-month access to all premium features",
  priceUSD: 199.99,
};

interface SelectedCoin {
  symbol: string;
  name: string;
  amount: number;
  price: number;
}

interface NetworkStatus {
  connected: boolean;
  chainId: string | null;
  isCorrectNetwork: boolean;
}

export default function CheckoutPage() {
  // Product and payment state
  const [selectedCoins, setSelectedCoins] = useState<SelectedCoin[]>([]);
  const [gasEstimate, setGasEstimate] = useState({
    low: { gwei: 25, usd: 2.50 },
    medium: { gwei: 35, usd: 3.50 },
    high: { gwei: 45, usd: 4.50 }
  });
  const [selectedGasOption, setSelectedGasOption] = useState('medium');

  // Wallet and network state
  const [walletStatus, setWalletStatus] = useState({
    connected: false,
    address: null,
  });

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    connected: false,
    chainId: null,
    isCorrectNetwork: false,
  });

  const [paymentStatus, setPaymentStatus] = useState({
    status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    error: null as string | null,
  });

  // Handle coin selection
  const handleCoinSelect = (coin: typeof availableCoins[0]) => {
    if (selectedCoins.find(c => c.symbol === coin.symbol)) {
      setSelectedCoins(selectedCoins.filter(c => c.symbol !== coin.symbol));
    } else {
      const amount = productData.priceUSD / coin.price;
      setSelectedCoins([...selectedCoins, { ...coin, amount }]);
    }
  };

  // Handlers
  const handleConnectWallet = async () => {
    try {
      setPaymentStatus({ ...paymentStatus, status: 'loading' });
      // TODO: Implement wallet connection
      setWalletStatus({
        connected: true,
        address: '0x1234...5678',
      });
      setPaymentStatus({ status: 'idle', error: null });
    } catch (error) {
      setPaymentStatus({
        status: 'error',
        error: 'Failed to connect wallet',
      });
    }
  };

  const handleSwap = () => {
    toast.success('Redirecting to swap page...');
    // TODO: Implement swap navigation
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
    // TODO: Implement payment logic
    setTimeout(() => {
      setPaymentStatus({ status: 'success', error: null });
      toast.success('Payment successful!');
    }, 2000);
  };

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <Breadcrumb pageName="Checkout" />
        
        <Card 
          variant="elevated"
          title="Complete Purchase"
          footer={
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
          }
        >
          {/* Product Details */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{productData.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{productData.description}</p>
            <div className="mt-2 text-lg font-semibold">
              ${productData.priceUSD.toFixed(2)} USD
            </div>
          </div>

          {/* Wallet Status */}
          {walletStatus.connected && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm">Connected Wallet</div>
              <div className="font-mono text-xs mt-1">{walletStatus.address}</div>
            </div>
          )}

          {/* Payment Methods Selection */}
          <div className="mb-6">
            <h4 className="text-base font-medium mb-3">Select Payment Method</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {availableCoins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => handleCoinSelect(coin)}
                  className={`p-3 rounded-lg border ${
                    selectedCoins.find(c => c.symbol === coin.symbol)
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    1 {coin.symbol} = ${coin.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Coins Summary */}
          {selectedCoins.length > 0 && (
            <div className="mb-6">
              <h4 className="text-base font-medium mb-3">Payment Summary</h4>
              <div className="space-y-3">
                {selectedCoins.map((coin) => (
                  <div key={coin.symbol} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ${coin.price.toFixed(2)} per {coin.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{coin.amount.toFixed(6)} {coin.symbol}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ≈ ${(coin.amount * coin.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gas Estimation */}
          <div className="mb-6">
            <h4 className="text-base font-medium mb-3">Gas Fee Estimate</h4>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(gasEstimate).map(([speed, { gwei, usd }]) => (
                <button
                  key={speed}
                  onClick={() => setSelectedGasOption(speed)}
                  className={`p-3 rounded-lg border ${
                    selectedGasOption === speed
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="font-medium capitalize">{speed}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {gwei} Gwei
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ≈ ${usd}
                  </div>
                </button>
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
                ${productData.priceUSD.toFixed(2)} USD
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                + ${gasEstimate[selectedGasOption].usd} (gas)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
}