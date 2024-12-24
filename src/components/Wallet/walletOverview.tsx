import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaStar, FaRegStar } from "react-icons/fa";
import WalletDropdown from "./walletDropdown";

// Example Wallet Data
const walletData = [
  {
    image: "/images/brand/brand-01.svg",
    name: "Google Wallet",
    balance: "$1,245",
    coins: [
      { coin: "BTC", balance: "0.0345", value: "$800" },
      { coin: "ETH", balance: "1.2", value: "$400" },
      { coin: "USDC", balance: "120.0", value: "$45" },
    ],
  },
  {
    image: "/images/brand/brand-02.svg",
    name: "X.com Wallet",
    balance: "$1,021",
    coins: [
      { coin: "BTC", balance: "0.05", value: "$1,200" },
      { coin: "ETH", balance: "0.8", value: "$300" },
      { coin: "USDC", balance: "90.0", value: "$25" },
    ],
  },
];

const WalletTable = () => {
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);
  const [primaryWallet, setPrimaryWallet] = useState<string | null>("Google Wallet");

  // Store last refreshed time for each wallet
  const [refreshTimes, setRefreshTimes] = useState<{ [key: string]: string }>(() => {
    const initialTimes: { [key: string]: string } = {};
    walletData.forEach((wallet) => {
      initialTimes[wallet.name] = new Date().toLocaleString(); // Default to current time
    });
    return initialTimes;
  });

  // Toggle dropdown to expand/collapse wallet details
  const toggleDropdown = (walletName: string) => {
    setExpandedWallet(expandedWallet === walletName ? null : walletName);
  };

  // Toggle primary wallet
  const togglePrimaryWallet = (walletName: string) => {
    setPrimaryWallet(walletName);
  };

  // Update the last refreshed time for a specific wallet
  const handleRefresh = (walletName: string) => {
    const newTimes = { ...refreshTimes };
    newTimes[walletName] = new Date().toLocaleString();
    setRefreshTimes(newTimes);
  };

  return (
    <div className="rounded-[10px] bg-white px-5 pb-4 pt-5 shadow-1 dark:bg-gray-dark dark:shadow-card w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-lg font-bold text-dark dark:text-white">
          Wallet Balance
        </h4>
        <WalletDropdown />
      </div>

      {/* Wallet Table */}
      <div className="flex flex-col">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-6 text-center">
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase">Source</h5>
          </div>
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase">Balance</h5>
          </div>
          <div className="px-2 pb-3.5">
            <h5 className="text-sm font-medium uppercase">Last Refreshed</h5>
          </div>
        </div>

        {/* Table Rows */}
        {walletData.map((wallet, key) => (
          <div key={key}>
            {/* Wallet Row */}
            <div
              className={`grid sm:grid-cols-6 grid-cols-1 gap-y-4 items-center text-center ${
                key === walletData.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-dark-3"
              }`}
            >
              {/* Source */}
              <div className="flex flex-col sm:flex-row items-center gap-3 px-2 py-4">
                <img
                  src={wallet.image}
                  alt={wallet.name}
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-medium text-dark dark:text-white">
                  {wallet.name}
                </p>
                {/* Primary Wallet Toggle */}
                <button
                  className="ml-2 text-yellow-500"
                  onClick={() => togglePrimaryWallet(wallet.name)}
                >
                  {primaryWallet === wallet.name ? <FaStar /> : <FaRegStar />}
                </button>
              </div>

              {/* Balance */}
              <div
                className="flex items-center justify-center px-2 py-4 cursor-pointer"
                onClick={() => toggleDropdown(wallet.name)}
              >
                <p className="font-medium text-green-500">{wallet.balance}</p>
                {expandedWallet === wallet.name ? (
                  <FaChevronUp className="ml-2 text-dark dark:text-white" />
                ) : (
                  <FaChevronDown className="ml-2 text-dark dark:text-white" />
                )}
              </div>

              {/* Last Refreshed */}
              <div className="flex items-center justify-center px-2 py-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {refreshTimes[wallet.name]}
                </p>
              </div>
            </div>

            {/* Dropdown Details */}
            {expandedWallet === wallet.name && (
              <div className="bg-[#F7F9FC] dark:bg-dark-3 px-4 py-3 rounded-b-md">
                <h5 className="mb-3 text-sm font-medium text-dark dark:text-white">
                  Portfolio Details
                </h5>
                <div className="flex flex-col gap-2">
                  {wallet.coins.map((coin, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm font-medium text-dark dark:text-white"
                    >
                      <span>{coin.coin}</span>
                      <span>
                        {coin.balance} ({coin.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletTable;

