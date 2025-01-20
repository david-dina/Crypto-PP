import React, { useState, useEffect, useMemo } from "react";
import { Plan, Cycle } from '@prisma/client';
import { Token } from "@/libs/tokenConfig";
import { WalletData } from "@/types/Wallet";
import toast from "react-hot-toast";

interface BillingCycleInput {
  cycle: Cycle;
  price: number;
}

interface CreatePlanModalProps {
  onClose: () => void;
  onSave: (plan: any) => void;
  availableCoins?: Token[];
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({ 
  onClose, 
  onSave,
  availableCoins = []  // Default to empty array if not provided
}) => {
  const [planName, setPlanName] = useState<string>("");
  const [planDescription, setPlanDescription] = useState<string>("");
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [billingCycles, setBillingCycles] = useState<BillingCycleInput[]>([]);
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableCoinsState, setAvailableCoinsState] = useState<Token[]>([]);

  const memoizedAvailableCoins = useMemo(() => availableCoins, [availableCoins]);

  useEffect(() => {
    setAvailableCoinsState(memoizedAvailableCoins);
  }, [memoizedAvailableCoins]);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await fetch("/api/wallets/getWallets", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wallets");
        }

        const data = await response.json();
        setWalletData(data.data || []); 
      } catch (error) {
        console.error("Error fetching wallets:", error);
        toast.error("Failed to fetch wallets");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const toggleCycle = (cycle: Cycle) => {
    const exists = billingCycles.some(bc => bc.cycle === cycle);
    if (exists) {
      setBillingCycles(billingCycles.filter(bc => bc.cycle !== cycle));
    } else {
      setBillingCycles([...billingCycles, {
        cycle,
        price: 0,
      }]);
    }
  };

  const updateCyclePrice = (cycle: Cycle, price: number) => {
    setBillingCycles(billingCycles.map(bc => 
      bc.cycle === cycle ? { ...bc, price } : bc
    ));
  };

  const toggleCoin = (coin: string) => {
    if (selectedCoins.includes(coin)) {
      setSelectedCoins(selectedCoins.filter(c => c !== coin));
    } else {
      setSelectedCoins([...selectedCoins, coin]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (billingCycles.length === 0) {
      toast.error("Please select at least one billing cycle");
      return;
    }

    if (selectedCoins.length === 0) {
      toast.error("Please select at least one accepted coin");
      return;
    }

    onSave({
      name: planName,
      description: planDescription,
      acceptedCoins: selectedCoins,
      billingCycles: billingCycles.map(bc => ({
        cycle: bc.cycle,
        price: bc.price,
      }))
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-lg bg-gray-dark p-6 shadow-card my-20 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Name */}
          <div>
            <label className="block mb-2 text-white">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
              required
              placeholder="Enter plan name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-white">Description</label>
            <textarea
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
              rows={4}
              placeholder="Describe your subscription plan"
            />
          </div>

          {/* Billing Cycles */}
          <div className="mb-8">
            <label className="block mb-2 text-white">Billing Cycles & Pricing</label>
            <div className="flex flex-wrap gap-3">
              {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((cycle) => {
                const cycleData = billingCycles.find(bc => bc.cycle === cycle);
                return (
                  <div key={cycle} className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCycle(cycle)}
                      className={`px-4 py-2 rounded border flex items-center gap-2 ${
                        cycleData
                          ? "bg-primary text-white border-primary"
                          : "border-strokedark bg-boxdark text-white hover:bg-gray-700"
                      }`}
                    >
                      {cycle}
                    </button>
                    
                    {cycleData && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">$</span>
                        <input
                          type="number"
                          value={cycleData.price}
                          onChange={(e) => updateCyclePrice(cycle, Number(e.target.value))}
                          className="w-full rounded border-[1.5px] border-stroke bg-white py-1 px-2 text-sm font-medium outline-none transition focus:border-primary active:border-primary text-black"
                          placeholder="Enter price"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accepted Coins */}
          <div>
            <label className="block mb-2 text-white">Accepted Coins</label>
            {loading ? (
              <div className="text-gray-300">
                Loading available coins...
              </div>
            ) : (
              <>
                {availableCoinsState.length === 0 ? (
                  <p className="text-sm text-gray-300">
                    {walletData.length === 0 
                      ? "No wallets connected. Please connect a wallet first."
                      : "No coins available for your connected wallets."}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {availableCoinsState.map((coin) => (
                      <button
                        key={`${coin.symbol}-${coin.address}`}
                        type="button"
                        onClick={() => toggleCoin(coin.symbol)}
                        className={`px-4 py-2 rounded border flex items-center gap-2 ${
                          selectedCoins.includes(coin.symbol)
                            ? "bg-primary text-white border-primary"
                            : "border-strokedark bg-boxdark text-white hover:bg-gray-700"
                        }`}
                      >
                        {coin.logoUrl && (
                          <img
                            src={coin.logoUrl}
                            alt={coin.name}
                            className="w-4 h-4 mr-2"
                          />
                        )}
                        {coin.symbol}
                        {coin.isStablecoin && (
                          <span className="text-xs bg-green-500 bg-opacity-20 text-green-500 px-2 py-0.5 rounded ml-2">
                            Stable
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
            >
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;
