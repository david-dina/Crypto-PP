"use client";
import { useState, useEffect } from "react";
import SelectGroupOne from "../FormElements/SelectGroup/SelectGroupOne"; // Prebuilt dropdown
import InputGroup from "../FormElements/InputGroup"; // Prebuilt input field
import { formatEther, parseUnits,parseEther,BrowserProvider } from "ethers";
import { useConnectWallet, useNotifications } from "@web3-onboard/react";

const TransferModal = ({ isOpen, onClose, wallet }) => {
  const [{ wallet: connectedWallet }] = useConnectWallet(); // Web3 Onboard hook
  const [{ notifications }] = useNotifications(); // Web3 Notifications

  // State variables
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [gasFee, setGasFee] = useState("0"); // Gas fee preview
  const [isExternal, setIsExternal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Detect wallet type (external vs internal)
  useEffect(() => {
    if (wallet) {
      setToken(wallet.coins[0].coin); // Default token
      setIsExternal(wallet.name.includes("X.com")); // Check if external
    }
  }, [wallet]);

  // Calculate Gas Fee for Internal Wallet
  const fetchGasFee = async () => {
    if (!isExternal && amount) {
      try {
        const gasPrice = 50; // Mock gas price in GWEI (replace later with API)
        const estimatedGas = 21000; // Mock gas estimate
        const fee = formatEther(
            parseUnits((gasPrice * estimatedGas).toString(), "gwei")
          );
        setGasFee(fee);
      } catch (err) {
        setError("Failed to estimate gas fees.");
      }
    }
  };

  useEffect(() => {
    fetchGasFee();
  }, [amount, token]);

  // Handle Transfer
  const handleTransfer = async () => {
    setError("");
    setIsSending(true);

    try {
      if (isExternal) {
        // Handle External Wallet Transfer
        if (!connectedWallet) {
          setError("No wallet connected!");
          setIsSending(false);
          return;
        }

        const provider = new BrowserProvider(connectedWallet.provider);
        const signer = await provider.getSigner();
        const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount),
        });

        console.log("Transaction Sent:", tx.hash);
      } else {
        // Handle Internal Wallet Transfer
        console.log("Internal Wallet Transfer:");
        console.log(`Sending ${amount} ${token} to ${recipient}`);
        console.log(`Gas Fee Estimate: ${gasFee} ETH`);
      }
    } catch (err) {
      console.error("Transfer failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsSending(false);
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
  

  // Validation to disable the button
  const isDisabled = !amount || parseFloat(amount) <= 0 || !recipient || !token;

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Transfer Tokens - {wallet.name}
        </h3>

        {/* Token Selection */}
        <SelectGroupOne
          label="Token"
          name="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          options={wallet.coins.map((coin) => ({
            value: coin.coin,
            label: `${coin.coin} - ${coin.balance}`,
          }))}
        />

        {/* Amount Input */}
        <InputGroup
          label="Amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          name="amount"
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {/* Recipient Input */}
        <InputGroup
          label="Recipient Address"
          type="text"
          placeholder="Enter wallet address"
          value={recipient}
          name="recipient"
          onChange={(e) => setRecipient(e.target.value)}
          required
        />

        {/* Gas Fee Preview */}
        {!isExternal && gasFee && (
          <p className="mb-4 text-sm text-green-500">
            Estimated Gas Fee: {gasFee} ETH
          </p>
        )}

        {/* Error Messages */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-dark hover:bg-gray-300"
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            className={`rounded-lg bg-primary px-4 py-2 text-white ${
              isDisabled || isSending ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
            }`}
            disabled={isDisabled || isSending}
          >
            {isSending ? "Sending..." : isExternal ? "Transfer" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
