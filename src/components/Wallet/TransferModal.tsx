"use client";
import { useState, useEffect } from "react";
import { formatEther, parseEther, BrowserProvider } from "ethers";
import { FaGasPump } from "react-icons/fa";

interface Token {
  symbol: string;
  balance: string;
  address?: string;
  decimals: number;
}

const TransferModal = ({ isOpen, onClose, wallet, onboardInstance }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [gasEstimate, setGasEstimate] = useState<{
    price: string;
    limit: string;
    total: string;
  }>({
    price: "0",
    limit: "0",
    total: "0"
  });
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Get available tokens for the wallet
  const [availableTokens, setAvailableTokens] = useState<Token[]>([
    // Native token is always first
    {
      symbol: wallet?.blockchain === "Polygon" ? "MATIC" : 
             wallet?.blockchain === "BinanceSmartChain" ? "BNB" : "ETH",
      balance: wallet?.balance || "0",
      decimals: 18
    }
    // Other tokens will be added from wallet.tokenBalances
  ]);

  useEffect(() => {
    if (wallet?.tokenBalances) {
      const tokens = [
        // Keep native token
        availableTokens[0],
        // Add other tokens
        ...wallet.tokenBalances.map(token => ({
          symbol: token.tokenName,
          balance: token.balance,
          address: token.tokenAddress,
          decimals: token.decimals || 18
        }))
      ];
      setAvailableTokens(tokens);
      setSelectedToken(tokens[0]); // Set native token as default
    }
  }, [wallet]);

  // Estimate gas when recipient and amount change
  useEffect(() => {
    const estimateGas = async () => {
      if (!recipient || !amount || !selectedToken || !wallet?.provider) return;
      
      try {
        // Handle different blockchain types
        switch (wallet.blockchain) {
          case 'Ethereum':
          case 'Polygon':
          case 'BinanceSmartChain':
            const provider = new BrowserProvider(wallet.provider);
            const signer = await provider.getSigner();
            
            const tx = {
              to: recipient,
              value: parseEther(amount)
            };

            const gasLimit = await signer.estimateGas(tx);
            const feeData = await provider.getFeeData();
            
            const gasPriceInEth = formatEther(feeData.gasPrice || 0);
            const estimatedCost = formatEther(feeData.gasPrice! * gasLimit);

            setGasEstimate({
              price: gasPriceInEth,
              limit: gasLimit.toString(),
              total: estimatedCost
            });
            break;

          case 'Solana':
            // For Solana, we could estimate the SOL fee
            // This is a simplified example
            setGasEstimate({
              price: "0.000005",
              limit: "1",
              total: "0.000005"
            });
            break;

          default:
            console.warn(`Gas estimation not implemented for ${wallet.blockchain}`);
            setGasEstimate({
              price: "0",
              limit: "0",
              total: "0"
            });
        }
      } catch (err) {
        console.error("Gas estimation failed:", err);
        setError("Failed to estimate gas. Please check the recipient address.");
      }
    };

    estimateGas();
  }, [recipient, amount, selectedToken, wallet]);

  const handleTransfer = async () => {
    setIsSending(true);
    setError("");
    
    try {
      switch (wallet.blockchain) {
        case 'Ethereum':
        case 'Polygon':
        case 'BinanceSmartChain':
          const provider = new BrowserProvider(wallet.provider);
          const signer = await provider.getSigner();
          const tx = {
            to: recipient,
            value: parseEther(amount),
          };
          const transaction = await signer.sendTransaction(tx);
          await transaction.wait();
          break;

        case 'Solana':
          // Handle Solana transfer
          if (wallet.provider.transfer) {
            await wallet.provider.transfer({
              to: recipient,
              amount: parseFloat(amount),
            });
          } else {
            throw new Error("Solana transfer not supported by provider");
          }
          break;

        default:
          throw new Error(`Transfers not implemented for ${wallet.blockchain}`);
      }
      
      onClose();
    } catch (err) {
      console.error("Transfer failed:", err);
      setError(`Transaction failed: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-dark rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-dark dark:text-white">
              Transfer Tokens
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Wallet Info */}
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">From Wallet</span>
              <span className="text-sm font-medium">{wallet.provider}</span>
            </div>
            <div className="text-xs text-gray-500">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Network: {wallet.blockchain}
            </div>
          </div>

          {/* Token Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Token</label>
            <select
              className="w-full p-3 border rounded-lg bg-transparent"
              value={selectedToken?.symbol}
              onChange={(e) => {
                const token = availableTokens.find(t => t.symbol === e.target.value);
                setSelectedToken(token || null);
              }}
            >
              {availableTokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - Balance: {token.balance}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Recipient</label>
            <input
              type="text"
              placeholder="Address or @username"
              className="w-full p-3 border rounded-lg bg-transparent"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              placeholder="0.0"
              className="w-full p-3 border rounded-lg bg-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Gas Estimate */}
          {gasEstimate.total !== "0" && (
            <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaGasPump className="text-gray-500" />
                <span className="text-sm font-medium">Estimated Gas</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Gas Price:</div>
                <div className="text-right">{gasEstimate.price} ETH</div>
                <div>Gas Limit:</div>
                <div className="text-right">{gasEstimate.limit}</div>
                <div className="font-medium">Total Gas Cost:</div>
                <div className="text-right font-medium">{gasEstimate.total} ETH</div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleTransfer}
              disabled={!amount || !recipient || isSending}
              className={`px-4 py-2 bg-primary text-white rounded-lg ${
                (!amount || !recipient || isSending) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
              }`}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;