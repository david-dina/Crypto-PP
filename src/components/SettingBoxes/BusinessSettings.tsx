import React, { useState } from "react";
import toast from "react-hot-toast";

// Pre-built Components
import MultiSelect from "../FormElements/MultiSelect";
import CustomModal from "./CustomModal";

// Mock Wallet Data (Replace with real data later)
const mockWallets = [
  { id: "wallet_001", name: "Google Wallet", coins: ["BTC", "ETH"] },
  { id: "wallet_002", name: "X.com Wallet", coins: ["BTC", "USDC"] },
];

const BusinessSettings = ({ userData }: { userData: any }) => {
  // State Management
  const [companyName, setCompanyName] = useState(userData?.companyName || "");
  const [currency, setCurrency] = useState(userData?.currency || "USD");
  const [acceptedCoins, setAcceptedCoins] = useState(
    userData?.acceptedCoins || []
  );
  const [withdrawalWallet, setWithdrawalWallet] = useState(
    userData?.withdrawalWallet || ""
  );
  const [selectedWalletName, setSelectedWalletName] = useState(
    mockWallets.find((w) => w.id === userData?.withdrawalWallet)?.name || "No Wallet Selected"
  );

  // Modal States
  const [isCoinsModalOpen, setCoinsModalOpen] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [walletSearch, setWalletSearch] = useState(""); // Search field state

  // Save Settings
  const handleSave = async () => {
    const updatedData = {
      companyName,
      currency,
      acceptedCoins,
      withdrawalWallet,
    };

    const response = await fetch("/api/user/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      toast.success("Business settings updated!");
    } else {
      toast.error("Failed to update settings.");
    }
  };

  // Filter wallets for dropdown search
  const filteredWallets = mockWallets.filter((wallet) =>
    wallet.name.toLowerCase().includes(walletSearch.toLowerCase())
  );

  return (
    <div className="p-7">
      {/* Business Name */}
      <div className="mb-6">
        <label className="block mb-4 text-base font-medium text-dark dark:text-white">
          Business Name
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full rounded-[7px] border px-4 py-3 text-base dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Accepted Fiat Currency */}
      <div className="mb-6">
        <label className="block mb-4 text-base font-medium text-dark dark:text-white">
          Accepted Fiat Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-[7px] border px-4 py-3 text-base dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Accepted Coins */}
      <div className="mb-6">
        <label className="block mb-4 text-base font-medium text-dark dark:text-white">
          Accepted Coins
        </label>
        <button
          onClick={() => setCoinsModalOpen(true)}
          className="w-full rounded-lg bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary-dark"
        >
          Manage Coins
        </button>
      </div>

      {/* Withdrawal Wallet */}
      <div className="mb-6">
        <label className="block mb-4 text-base font-medium text-dark dark:text-white">
          Withdrawal Wallet
        </label>
        <div className="w-full rounded-[7px] border px-4 py-3 text-base font-medium dark:border-dark-3 dark:bg-dark-2 dark:text-white">
          {selectedWalletName}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Select Wallet Button */}
        <button
          onClick={() => setWalletModalOpen(true)}
          className="w-full rounded-lg bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary-dark"
        >
          Select Wallet
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full rounded-lg bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary-dark"
        >
          Save Changes
        </button>
      </div>

      {/* Modals */}

      {/* Accepted Coins Modal */}
      <CustomModal
        isOpen={isCoinsModalOpen}
        onClose={() => setCoinsModalOpen(false)}
        title="Manage Accepted Coins"
      >
        <MultiSelect
          options={["BTC", "ETH", "USDC"]}
          selected={acceptedCoins}
          onChange={(selected) => setAcceptedCoins(selected)}
        />
      </CustomModal>

      {/* Withdrawal Wallet Modal */}
      <CustomModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        title="Select Withdrawal Wallet"
      >
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Wallets..."
          value={walletSearch}
          onChange={(e) => setWalletSearch(e.target.value)}
          className="mb-4 w-full rounded-[7px] border px-4 py-3 text-base dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
        {/* Wallet List */}
        <ul className="max-h-60 overflow-y-auto">
          {filteredWallets.map((wallet) => (
            <li
              key={wallet.id}
              onClick={() => {
                setWithdrawalWallet(wallet.id); // Save selection
                setSelectedWalletName(wallet.name); // Display name
                setWalletModalOpen(false); // Close modal
              }}
              className={`cursor-pointer rounded-lg p-3 text-base hover:bg-gray-200 dark:hover:bg-dark-3 ${
                withdrawalWallet === wallet.id
                  ? "bg-primary text-white"
                  : "text-dark dark:text-white"
              }`}
            >
              {wallet.name}
            </li>
          ))}
        </ul>
      </CustomModal>
    </div>
  );
};

export default BusinessSettings;
