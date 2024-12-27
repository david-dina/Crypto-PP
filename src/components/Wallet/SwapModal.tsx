import { useState,useEffect } from "react";

const SwapModal = ({ isOpen, onClose, wallet }) => {
    const [fromToken, setFromToken] = useState("");
    const [toToken, setToToken] = useState("");
    const [amount, setAmount] = useState("");
    const [conversionRate, setConversionRate] = useState(0);
    const [isExternal, setIsExternal] = useState(false);
  
    useEffect(() => {
      if (wallet) {
        setFromToken(wallet.coins[0].coin); // Default to first coin
        setIsExternal(wallet.name.includes("X.com")); // Example check for external
      }
    }, [wallet]);
  
    const fetchConversionRate = () => {
      if (!isExternal) {
        const mockRate = Math.random() * (1.05 - 0.95) + 0.95; // Mock live rate
        setConversionRate(mockRate);
      }
    };
  
    useEffect(() => {
      fetchConversionRate();
    }, [fromToken, toToken, amount]);
  
    const handleSwap = () => {
      if (isExternal) {
        window.open(`https://swap.provider.com?wallet=${wallet.name}`, "_blank");
      } else {
        console.log("Swapping", amount, fromToken, "to", toToken, "using", wallet.name);
      }
      onClose();
    };
  
    if (!isOpen || !wallet) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
            Swap Tokens - {wallet.name}
          </h3>
  
          {/* From Token */}
          <label className="block mb-2 text-sm font-medium">From</label>
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="mb-4 w-full rounded-lg border px-4 py-2"
          >
            {wallet.coins.map((coin) => (
              <option key={coin.coin} value={coin.coin}>
                {coin.coin} - {coin.balance}
              </option>
            ))}
          </select>
  
          {/* To Token */}
          <label className="block mb-2 text-sm font-medium">To</label>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="mb-4 w-full rounded-lg border px-4 py-2"
          >
            <option value="USDC">USDC</option>
            <option value="ETH">ETH</option>
            <option value="BTC">BTC</option>
          </select>
  
          {/* Amount */}
          <label className="block mb-2 text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mb-4 w-full rounded-lg border px-4 py-2"
          />
  
          {/* Conversion Rate Preview */}
          {!isExternal && (
            <p className="mb-4 text-sm text-green-500">
              Conversion Rate: 1 {fromToken} ≈ {conversionRate.toFixed(2)} {toToken}
            </p>
          )}
  
          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 text-dark hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSwap}
              className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
            >
              {isExternal ? "Go to Provider" : "Swap"}
            </button>
          </div>
        </div>
      </div>
    );
  };
export default SwapModal