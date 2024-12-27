import { useState, useEffect } from "react";
import SelectGroupOne from "../FormElements/SelectGroup/SelectGroupOne"; // Prebuilt dropdown&#8203;:contentReference[oaicite:2]{index=2}
import InputGroup from "../FormElements/InputGroup"; // Prebuilt input field&#8203;:contentReference[oaicite:3]{index=3}
import { init, useConnectWallet, useNotifications } from "@web3-onboard/react"; // Web3 Onboard
import { ethers } from "ethers";

const SwapModal = ({ isOpen, onClose, wallet }) => {
  const [{ wallet: connectedWallet }] = useConnectWallet();
  const [{ notifications }] = useNotifications();

  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0);
  const [isExternal, setIsExternal] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState("");

  // Detect wallet type (external vs internal)
  useEffect(() => {
    if (wallet) {
      setFromToken(wallet.coins[0].coin); // Default to first coin
      setIsExternal(wallet.name.includes("X.com")); // External check example
    }
  }, [wallet]);

  // Fetch mock conversion rates
  const fetchConversionRate = async () => {
    if (!isExternal) {
      const mockRate = Math.random() * (1.05 - 0.95) + 0.95; // Mock live rate
      setConversionRate(mockRate);
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, [fromToken, toToken, amount]);

  // Handle Swap
  const handleSwap = async () => {
    if (!connectedWallet) {
      setError("No wallet connected!");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Enter a valid amount!");
      return;
    }

    setError("");
    setIsSwapping(true);

    try {
      if (isExternal) {
        // Redirect external wallets to their swap provider
        window.open(`https://swap.provider.com?wallet=${wallet.name}`, "_blank");
      } else {
        // Example transaction using ethers.js
        const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
        const signer = provider.getSigner();

        const tx = {
          to: "0xRecipientAddress", // Replace with actual recipient
          value: ethers.utils.parseEther(amount), // Convert to wei
        };

        const transaction = await signer.sendTransaction(tx);

        console.log("Transaction sent:", transaction.hash);
      }
    } catch (error) {
      console.error("Swap failed:", error);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  // Track Notifications
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      notifications.forEach((notification) => {
        if (notification.type === "transactionSent") {
          console.log("Transaction Pending:", notification.message);
        } else if (notification.type === "transactionConfirmed") {
          console.log("Transaction Confirmed:", notification.message);
        } else if (notification.type === "transactionFailed") {
          console.log("Transaction Failed:", notification.message);
        }
      });
    }
  }, [notifications]);
  

  // Validation to disable the Swap button
  const isDisabled = !amount || parseFloat(amount) <= 0 || !fromToken || !toToken;

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Swap Tokens - {wallet.name}
        </h3>

        {/* From Token */}
        <SelectGroupOne
          label="From"
          name="fromToken"
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          options={wallet.coins.map((coin) => ({
            value: coin.coin,
            label: `${coin.coin} - ${coin.balance}`,
          }))}
        />

        {/* To Token */}
        <SelectGroupOne
          label="To"
          name="toToken"
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          options={[
            { value: "USDC", label: "USDC" },
            { value: "ETH", label: "ETH" },
            { value: "BTC", label: "BTC" },
          ]}
        />

        {/* Amount */}
        <InputGroup
          label="Amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          name="amount"
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {/* Conversion Rate */}
        {!isExternal && (
          <p className="mb-4 text-sm text-green-500">
            Conversion Rate: 1 {fromToken} ≈ {conversionRate.toFixed(2)} {toToken}
          </p>
        )}

        {/* Error Messages */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-dark hover:bg-gray-300"
            disabled={isSwapping}
          >
            Cancel
          </button>
          <button
            onClick={handleSwap}
            className={`rounded-lg bg-primary px-4 py-2 text-white ${
              isDisabled || isSwapping ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
            }`}
            disabled={isDisabled || isSwapping}
          >
            {isSwapping ? "Swapping..." : isExternal ? "Go to Provider" : "Swap"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
