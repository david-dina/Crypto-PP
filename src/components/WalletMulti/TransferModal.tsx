
"use client";
import { useState, useEffect } from "react";
import SelectGroupOne from "../FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "../FormElements/InputGroup";
import { formatEther, parseEther, BrowserProvider } from "ethers";

const TransferModal = ({ isOpen, onClose, wallet }) => {

  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (wallet) {
      setToken(wallet.accounts[0].balance);
    }
  }, [wallet]);

  const handleTransfer = async () => {
    setIsSending(true);
    try {
      const provider = new BrowserProvider(connectedWallet.provider);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
      console.log("Transaction Sent:", tx.hash);
    } catch (err) {
      console.error("Transfer failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const isDisabled = !amount || parseFloat(amount) <= 0 || !recipient || !token;

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Transfer Tokens - {wallet.label}
        </h3>
        <SelectGroupOne
          label="Token"
          name="token"
          value={token}
          options={wallet.accounts.map((account) => ({
            value: account.address,
            label: `${account.balance} ETH`,
          }))}
        />
        <InputGroup
          label="Recipient Address"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <InputGroup
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            className={`bg-primary px-4 py-2 text-white rounded-lg ${
              isDisabled || isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;