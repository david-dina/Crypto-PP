"use client";
import { useState, useEffect } from "react";
import SelectGroupOne from "../FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "../FormElements/InputGroup";
import { parseEther, BrowserProvider } from "ethers";

const SwapModal = ({ isOpen, onClose, wallet }) => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (wallet && wallet.tokenBalances && wallet.tokenBalances.length > 0) {
      setFromToken(wallet.tokenBalances[0].symbol); // Set default token
    }
  }, [wallet]);

  const fetchConversionRate = async () => {
    const mockRate = Math.random() * (1.05 - 0.95) + 0.95;
    setConversionRate(mockRate);
  };

  useEffect(() => {
    fetchConversionRate();
  }, [fromToken, toToken, amount]);

  const handleSwap = async () => {
    if (!wallet) {
      setError("No wallet connected!");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter a valid amount!");
      return;
    }

    setIsSwapping(true);
    setError("");

    try {
      const provider = new BrowserProvider(wallet.provider);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0xRecipientAddress", // Replace with actual recipient address
        value: parseEther(amount),
      });

      console.log("Transaction sent:", tx.hash);
      onClose(); // Close the modal after successful transaction
    } catch (err) {
      console.error("Swap failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  const isDisabled = !amount || parseFloat(amount) <= 0 || !fromToken || !toToken;

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Swap Tokens - {wallet.provider}
        </h3>
        <SelectGroupOne
          label="From"
          name="fromToken"
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          options={wallet.tokenBalances.map((token) => ({
            value: token.symbol,
            label: `${token.balance} ${token.symbol}`,
          }))}
        />
        <InputGroup
          label="Amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSwap}
            className={`bg-primary px-4 py-2 text-white rounded-lg ${
              isDisabled || isSwapping ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSwapping ? "Swapping..." : "Swap"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;