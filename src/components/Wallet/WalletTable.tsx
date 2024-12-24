import { Wallet } from "@/types/Wallet";
import Image from "next/image";
import { useState } from "react"

// Example Wallet Data
const brandData: Wallet[] = [
  {
    image: "/images/brand/brand-01.svg",
    name: "Google",
    balance: "1,245",
  },
  {
    image: "/images/brand/brand-02.svg",
    name: "X.com",
    balance: "1,021",
  },
  {
    image: "/images/brand/brand-03.svg",
    name: "Github",
    balance: "4,190",
  },
  {
    image: "/images/brand/brand-04.svg",
    name: "Vimeo",
    balance: "2,592",
  },
  {
    image: "/images/brand/brand-05.svg",
    name: "Facebook",
    balance: "2,015",
  },
];

const TableOne = () => {
  const [wallets, setWallets] = useState<Wallet[]>(brandData); // Replace with empty array [] to simulate no wallets

  // Handle wallet connection (placeholder for future functionality)
  const handleConnectWallet = () => {
    console.log("Connect Wallet Clicked");
    // Example: Trigger wallet connection flow here
  };

  return (
    <div className="rounded-[10px] bg-white px-5 pb-4 pt-5 shadow-1 dark:bg-gray-dark dark:shadow-card w-full max-w-3xl">
      <h4 className="mb-5 text-lg font-bold text-dark dark:text-white">
        Wallet Balance
      </h4>

      {/* If no wallets, show Connect Wallet Button */}
      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-sm text-dark dark:text-white mb-4">
            No wallets connected.
          </p>
          <button
            onClick={handleConnectWallet}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
          >
            Connect a Wallet
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-5 sm:grid-cols-2">
            <div className="px-2 pb-3.5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Source
              </h5>
            </div>
            <div className="px-2 pb-3.5 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Balance
              </h5>
            </div>
          </div>

          {/* Table Rows */}
          {wallets.map((wallet, key) => (
            <div
              className={`grid grid-cols-5 sm:grid-cols-2 items-center ${
                key === wallets.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-dark-3"
              }`}
              key={key}
            >
              <div className="flex items-center gap-3 px-2 py-4">
                <div className="flex-shrink-0">
                  <img
                    src={wallet.image}
                    alt={wallet.name}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <p className="hidden font-medium text-dark dark:text-white sm:block">
                  {wallet.name}
                </p>
              </div>

              <div className="flex items-center justify-center px-2 py-4">
                <p className="font-medium text-green-500">${wallet.balance}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableOne;
