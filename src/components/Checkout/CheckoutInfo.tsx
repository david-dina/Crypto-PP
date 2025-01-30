import React, { useState } from 'react';
import { FaWallet, FaExchangeAlt } from 'react-icons/fa';
import { Button } from '@/components/Buttons/Button';
import { Card } from '@/components/cards/Card';
import toast from 'react-hot-toast';

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

interface ProductData {
  name: string;
  description: string;
  priceUSD: number;
}

interface CheckoutInfoProps {
  productData: ProductData;
  availableCoins: Coin[];
}

export const CheckoutInfo: React.FC<CheckoutInfoProps> = ({
  productData,
  availableCoins,
}) => {
  // State management
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

  // Handlers
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
    <div className="space-y-6">
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
                    <div className="font-medium">{coin.amount?.toFixed(6)} {coin.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ≈ ${(coin.amount && coin.price * coin.amount).toFixed(2)}
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
  );
};