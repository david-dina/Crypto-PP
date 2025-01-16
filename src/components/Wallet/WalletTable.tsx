import { Wallet } from "@/types/Wallet";
import { useState } from "react"

// Updated Wallet Data with new fields
const brandData: Wallet[] = [
  {
    image: "/images/brand/brand-01.svg",
    name: "Google",
    balance: "1,245",
    network: "Ethereum",
    lastRefreshed: new Date().toLocaleString()
  },
  {
    image: "/images/brand/brand-02.svg",
    name: "X.com",
    balance: "1,021",
    network: "Polygon",
    lastRefreshed: new Date().toLocaleString()
  },
  {
    image: "/images/brand/brand-03.svg",
    name: "Github",
    balance: "4,190",
    network: "Binance",
    lastRefreshed: new Date().toLocaleString()
  },
  {
    image: "/images/brand/brand-04.svg",
    name: "Vimeo",
    balance: "2,592",
    network: "Ethereum",
    lastRefreshed: new Date().toLocaleString()
  },
  {
    image: "/images/brand/brand-05.svg",
    name: "Facebook",
    balance: "2,015",
    network: "Polygon",
    lastRefreshed: new Date().toLocaleString()
  },
];

const TableOne = () => {
  const [wallets, setWallets] = useState<Wallet[]>(brandData);

  const handleConnectWallet = () => {
    console.log("Connect Wallet Clicked");
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5 w-full">
      <h4 className="mb-5 text-xl font-bold text-dark dark:text-white">
        Wallet Balance
      </h4>

      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-sm text-dark dark:text-white mb-4">
            No wallets connected.
          </p>
          <button
            onClick={handleConnectWallet}
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark transition"
          >
            Connect a Wallet
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-4 border-b border-stroke py-4 dark:border-dark-3">
            <div className="px-4">
              <h5 className="text-sm font-medium uppercase">Source</h5>
            </div>
            <div className="px-4 text-end">
              <h5 className="text-sm font-medium uppercase">Balance</h5>
            </div>
            <div className="px-4 text-end">
              <h5 className="text-sm font-medium uppercase">Network</h5>
            </div>
            <div className="px-4 text-end">
              <h5 className="text-sm font-medium uppercase">Last Refreshed</h5>
            </div>
          </div>

          {/* Table Rows */}
          {wallets.map((wallet, key) => (
            <div
              className="grid grid-cols-4 border-b border-stroke py-4 dark:border-dark-3 last:border-none hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
              key={key}
            >
              <div className="flex items-center gap-3 px-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <img src={wallet.image} alt={wallet.name} className="w-full" />
                </div>
                <p className="font-medium text-dark dark:text-white">
                  {wallet.name}
                </p>
              </div>

              <div className="flex items-center justify-end px-4">
                <p className="font-medium text-success">${wallet.balance}</p>
              </div>

              <div className="flex items-center justify-end px-4">
                <p className="font-medium text-dark dark:text-white">
                  {wallet.network}
                </p>
              </div>

              <div className="flex items-center justify-end px-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {wallet.lastRefreshed}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableOne;
