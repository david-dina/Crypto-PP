import { useState } from "react";
import { FaPen, FaSync, FaFileExport, FaPlus } from "react-icons/fa";
import ClickOutside from "@/components/ClickOutside";
import { WalletData } from "@/types/Wallet";

interface WalletDropdownProps {
  wallets: WalletData[];
  refreshWallets: () => void;
  connectWallet: () => void;
  onToggleEdit: () => void;
  isEditing: boolean;
  selectedCount: number;
  onCancelEdit: () => void;
  onDisconnectSelected: () => void;
}

const WalletDropdown = ({ 
  wallets, 
  refreshWallets, 
  connectWallet,
  onToggleEdit,
  isEditing,
  selectedCount,
  onCancelEdit,
  onDisconnectSelected
}: WalletDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Export wallet data as CSV
  const handleExport = () => {
    const csvHeader = "Source,Address,Blockchain,Balance,Last Refreshed,Network\n";
    const csvRows = wallets.map((wallet) => {
      return `${wallet.provider},${wallet.address},${wallet.blockchain},${wallet.balance},${new Date(wallet.updatedAt).toLocaleString()},${wallet.blockchain}`;
    });
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wallet_data.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  const handleAddWallet = async () => {
    await connectWallet();
    setDropdownOpen(false);
  };

  const handleRefresh = () => {
    refreshWallets();
    setDropdownOpen(false);
  };

  const handleEdit = () => {
    onToggleEdit();
    setDropdownOpen(false);
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)}>
      <div className="relative flex items-center gap-2">
        {/* Disconnect Button - Only visible when in edit mode and items selected */}
        {isEditing && selectedCount > 0 && (
          <button
            onClick={onDisconnectSelected}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Disconnect ({selectedCount})
          </button>
        )}

        {/* Cancel Button - Only visible when in edit mode */}
        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-dark-3 dark:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        )}

        {/* Main Dropdown Button */}
        <button
          className="hover:text-primary p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-3"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <svg
            className="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 10C3.10457 10 4 9.10457 4 8C4 6.89543 3.10457 6 2 6C0.89543 6 0 6.89543 0 8C0 9.10457 0.89543 10 2 10Z" />
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" />
            <path d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full z-40 w-46.5 space-y-1.5 rounded-[7px] border border-stroke bg-white p-2 shadow-2 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
            <button
              onClick={handleRefresh}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <FaSync className="mr-2" />
              Refresh
            </button>

            <button
              onClick={handleExport}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <FaFileExport className="mr-2" />
              Export
            </button>

            {wallets.length > 0 && (
              <button
                onClick={handleEdit}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
              >
                {isEditing ? (
                  <>
                    <FaPen className="mr-2" />
                    Exit Edit Mode
                  </>
                ) : (
                  <>
                    <FaPen className="mr-2" />
                    Edit
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleAddWallet}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <FaPlus className="mr-2" />
              Add a Wallet
            </button>
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default WalletDropdown;