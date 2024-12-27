"use client";
import React, { useState } from "react";
import ClickOutside from "@/components/ClickOutside";

const TransferModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [token, setToken] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const handleTransfer = () => {
    console.log("Transferring", amount, token, "to", address);
    onClose(); // Close modal after transfer
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <ClickOutside onClick={onClose}>
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
            Transfer Tokens
          </h3>

          {/* Token */}
          <label className="block text-sm font-medium">Token</label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mb-4 w-full rounded-lg border px-4 py-2"
          >
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
          </select>

          {/* Amount */}
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mb-4 w-full rounded-lg border px-4 py-2"
          />

          {/* Address */}
          <label className="block text-sm font-medium">Recipient Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Wallet address"
            className="mb-4 w-full rounded-lg border px-4 py-2"
          />

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-4 py-2 text-dark hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleTransfer}
              className="rounded-lg bg-secondary px-4 py-2 text-white hover:bg-secondary-dark"
            >
              Transfer
            </button>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default TransferModal;
