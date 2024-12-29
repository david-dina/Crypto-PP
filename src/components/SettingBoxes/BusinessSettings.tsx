import React, { useState } from "react";
import toast from "react-hot-toast";

// Pre-built Components
import CheckboxOne from "../FormElements/Checkboxes/CheckboxOne";
import MultiSelect from "../FormElements/MultiSelect";
import CustomModal from "./CustomModal";

const BusinessSettings = ({ userData }: { userData: any }) => {
  // State Management
  const [companyName, setCompanyName] = useState(userData?.companyName || "");
  const [currency, setCurrency] = useState(userData?.currency || "USD");
  const [acceptedCoins, setAcceptedCoins] = useState(userData?.acceptedCoins || []);
  const [restrictedRegions, setRestrictedRegions] = useState(userData?.restrictedRegions || []);
  const [enableTax, setEnableTax] = useState(userData?.enableTax || false);
  const [withdrawalWallet, setWithdrawalWallet] = useState(userData?.withdrawalWallet || "");

  // Modal States
  const [isRegionModalOpen, setRegionModalOpen] = useState(false);
  const [isCoinsModalOpen, setCoinsModalOpen] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isTaxWarningModalOpen, setTaxWarningModalOpen] = useState(false);

  // Save Settings
  const handleSave = async () => {
    const updatedData = {
      companyName,
      currency,
      acceptedCoins,
      restrictedRegions,
      enableTax,
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

  return (
    <div className="p-7">
      {/* Business Name */}
      <div className="mb-5">
        <label className="block mb-3 text-sm font-medium text-dark dark:text-white">
          Business Name
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full rounded-[7px] border px-4 py-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        />
      </div>

      {/* Accepted Fiat Currency */}
      <div className="mb-5">
        <label className="block mb-3 text-sm font-medium text-dark dark:text-white">
          Accepted Fiat Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-[7px] border px-4 py-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Accepted Coins */}
      <div className="mb-5">
        <label className="block mb-3 text-sm font-medium text-dark dark:text-white">
          Accepted Coins
        </label>
        <button
          onClick={() => setCoinsModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
        >
          Manage Coins
        </button>
      </div>

      {/* Restricted Regions */}
      <div className="mb-5">
        <label className="block mb-3 text-sm font-medium text-dark dark:text-white">
          Restricted Regions
        </label>
        <button
          onClick={() => setRegionModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
        >
          Manage Regions
        </button>
      </div>

      {/* Tax Toggle */}
      <div className="mb-5">
        <CheckboxOne
          label="Enable Taxes"
          name="enableTaxes"
          checked={enableTax}
          onChange={(e) => {
            if (!e.target.checked) {
              setTaxWarningModalOpen(true);
            } else {
              setEnableTax(true);
            }
          }}
        />
      </div>

      {/* Withdrawal Wallet */}
      <div className="mb-5">
        <label className="block mb-3 text-sm font-medium text-dark dark:text-white">
          Withdrawal Wallet
        </label>
        <button
          onClick={() => setWalletModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
        >
          Set Wallet
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
      >
        Save Changes
      </button>

      {/* Modals */}
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

      <CustomModal
        isOpen={isTaxWarningModalOpen}
        onClose={() => setTaxWarningModalOpen(false)}
        title="Tax Compliance Warning"
      >
        <p className="text-sm mb-4">
          Turning off taxes means users won't be taxed. Back-taxes may be deducted from profits later.
        </p>
      </CustomModal>
    </div>
  );
};

export default BusinessSettings;
