import { useState } from "react";
import ClickOutside from "@/components/ClickOutside";

// Mock wallet data for demonstration
const mockWalletData = [
  { name: "Google Wallet", balance: "$1,245", coins: "BTC: 0.0345, ETH: 1.2" },
  { name: "X.com Wallet", balance: "$1,021", coins: "BTC: 0.05, USDC: 90.0" },
];

const WalletDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Export wallet data as CSV
  const handleExport = () => {
    const csvHeader = "Name,Balance,Coins\n";
    const csvRows = mockWalletData.map(
      (wallet) => `${wallet.name},${wallet.balance},${wallet.coins}`
    );
    const csvContent = csvHeader + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wallet_data.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Refresh wallet data (placeholder)
  const handleRefresh = () => {
    console.log("Refreshing wallet data...");
    // Replace with an actual API call or logic to fetch updated data.
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)}>
      <div className="relative flex">
        {/* Dropdown Toggle Button */}
        <button
          className="hover:text-primary"
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
          <div
            className={`absolute right-0 top-full z-40 w-46.5 space-y-1.5 rounded-[7px] border border-stroke bg-white p-2 shadow-2 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card`}
          >
            {/* Edit Button */}
            <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white">
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10L8 4L14 10L8 16L2 10Z" />
              </svg>
              Edit
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
             <svg
  xmlns="http://www.w3.org/2000/svg"
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <polyline points="23 4 23 10 17 10"></polyline>
  <polyline points="1 20 1 14 7 14"></polyline>
  <path d="M3.51 9a9 9 0 0 1 14.1-3.36L23 10"></path>
  <path d="M20.49 15a9 9 0 0 1-14.1 3.36L1 14"></path>
</svg>

              Refresh
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left font-medium text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 11V15H15V11H17V16C17 16.5523 16.5523 17 16 17H2C1.44772 17 1 16.5523 1 16V11H3Z" />
                <path d="M9 1L14 6H11V11H7V6H4L9 1Z" />
              </svg>
              Export
            </button>
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default WalletDropdown;
