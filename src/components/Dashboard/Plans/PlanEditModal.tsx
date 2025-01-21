import React, { useState, useEffect, useMemo } from 'react';
import { Plan } from '@/types/Plan';
import { Token } from "@/libs/tokenConfig";
import { getChainTokenConfigByKey } from "@/libs/tokenConfig";
import { WalletData } from "@/types/Wallet";
import { Cycle, PlanStatus } from '@prisma/client';
import { PLAN_CONFIG } from '@/config/constants';
import toast from 'react-hot-toast';

interface BillingCycleInput {
  cycle: Cycle;
  price: number;
}

interface PlanEditModalProps {
  plan: Plan;
  onClose: () => void;
  availableCoins?: Token[];
}

const PlanEditModal: React.FC<PlanEditModalProps> = ({ 
  plan, 
  onClose, 
  availableCoins = []
}: PlanEditModalProps) => {
  const [planName, setPlanName] = useState<string>(plan.name || "");
  const [planDescription, setPlanDescription] = useState<string>(plan.description || "");
  const [selectedCoins, setSelectedCoins] = useState<string[]>(plan.acceptedCoins || []);
  const [billingCycles, setBillingCycles] = useState<BillingCycleInput[]>(() => {
    const allCycles: Cycle[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    
    // If billingCycles exists, use those cycles, otherwise use all cycles
    const cyclesToUse = plan.billingCycles?.length 
      ? plan.billingCycles
      : allCycles;

    console.log('Initial Plan:', plan);
    console.log('Initial Billing Cycles:', plan.billingCycles);
    console.log('Initial Billing Cycles Prices:', plan.billingCyclesPrices);

    const initialBillingCycles = cyclesToUse.map(cycle => ({
      cycle,
      price: plan.billingCyclesPrices?.[cycle] ?? 0
    }));

    console.log('Initialized Billing Cycles:', initialBillingCycles);
    return initialBillingCycles;
  });
  const [loading, setLoading] = useState(false);
  const [availableCoinsState, setAvailableCoinsState] = useState<Token[]>([]);
  const [planStatus, setPlanStatus] = useState<PlanStatus>(plan.status || PlanStatus.PRIVATE);

  // Constants for length limits
  const NAME_MAX_LENGTH = PLAN_CONFIG.NAME_MAX_LENGTH;
  const DESCRIPTION_MAX_LENGTH = PLAN_CONFIG.DESCRIPTION_MAX_LENGTH;

  // Use useMemo to memoize the availableCoins comparison
  const memoizedAvailableCoins = useMemo(() => availableCoins, [availableCoins]);

  // Use useEffect to update availableCoinsState only when availableCoins changes
  useEffect(() => {
    setAvailableCoinsState(memoizedAvailableCoins);
  }, [memoizedAvailableCoins]);

  const toggleCycle = (cycle: Cycle) => {
    const exists = billingCycles.some(bc => bc.cycle === cycle);
    if (exists) {
      const updatedCycles = billingCycles.filter(bc => bc.cycle !== cycle);
      console.log(`Removing cycle ${cycle}. Updated cycles:`, updatedCycles);
      setBillingCycles(updatedCycles);
    } else {
      const updatedCycles = [...billingCycles, {
        cycle,
        price: 0,
      }];
      console.log(`Adding cycle ${cycle}. Updated cycles:`, updatedCycles);
      setBillingCycles(updatedCycles);
    }
  };

  const updateCyclePrice = (cycle: Cycle, price: number) => {
    console.log(`Updating price for cycle ${cycle} to ${price}`);
    const updatedCycles = billingCycles.map(bc => 
      bc.cycle === cycle ? { ...bc, price } : bc
    );
    console.log('Updated Billing Cycles:', updatedCycles);
    setBillingCycles(updatedCycles);
  };

  const toggleCoin = (coinSymbol: string) => {
    setSelectedCoins(prev => 
      prev.includes(coinSymbol)
        ? prev.filter(coin => coin !== coinSymbol)
        : [...prev, coinSymbol]
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Convert billingCycles array to the format expected by the API
      const billingCyclesPrices: Record<Cycle, number> = {
        DAILY: 0,
        WEEKLY: 0,
        MONTHLY: 0,
        YEARLY: 0,
      };
      billingCycles.forEach(bc => {
        billingCyclesPrices[bc.cycle] = Number(bc.price);
      });

      // Prepare payload
      const payload = {
        id: plan.id,
        name: planName,
        description: planDescription,
        features: plan.features,
        billingCycles: billingCycles.map(bc => bc.cycle),
        billingCyclesPrices,
        acceptedCoins: selectedCoins,
        status: planStatus
      };

      const response = await fetch("/api/business/plans/updateplan", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update plan error response:', errorText);
        
        toast.error(`Failed to update plan: ${response.status} ${response.statusText}`);
        throw new Error(errorText);
      }
      
      toast.success("Plan updated successfully");
    } catch (error) {
      console.error("Error saving plan:", error);
      
      // Specific error handling
      if (error instanceof TypeError) {
        toast.error(`Network Error: ${error.message}. Please check your internet connection.`);
      } else {
        toast.error("Failed to save plan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-lg bg-white dark:bg-gray-dark p-6 shadow-card my-20 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Plan Name */}
          <div>
            <label className="block mb-2 text-gray-900 dark:text-white">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value.slice(0, NAME_MAX_LENGTH))}
              className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
              required
              placeholder="Enter plan name"
              maxLength={NAME_MAX_LENGTH}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {planName.length}/{NAME_MAX_LENGTH} characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-gray-900 dark:text-white">Description</label>
            <textarea
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value.slice(0, DESCRIPTION_MAX_LENGTH))}
              className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
              rows={4}
              placeholder="Describe your subscription plan"
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {planDescription.length}/{DESCRIPTION_MAX_LENGTH} characters
            </p>
          </div>

          {/* Plan Status */}
          <div>
            <label className="block mb-2 text-gray-900 dark:text-white">Plan Status</label>
            <select
              value={planStatus}
              onChange={(e) => setPlanStatus(e.target.value as PlanStatus)}
              className="w-full rounded border-[1.5px] border-stroke bg-white py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter text-black"
            >
              <option value="ACTIVE">Active</option>
              <option value="PRIVATE">Private</option>

            </select>
          </div>

          {/* Billing Cycles */}
          <div className="mb-8">
            <label className="block mb-2 text-gray-900 dark:text-white">Billing Cycles & Pricing</label>
            <div className="flex flex-wrap gap-3">
              {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as Cycle[]).map((cycle) => {
                const cycleData = billingCycles.find(bc => bc.cycle === cycle);
                return (
                  <div key={cycle} className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => toggleCycle(cycle)}
                      className={`px-4 py-2 rounded border flex items-center gap-2 ${
                        cycleData
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                    >
                      {cycle}
                    </button>
                    
                    {cycleData && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">$</span>
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
            <label className="block mb-2 text-gray-900 dark:text-white">Accepted Coins</label>
            {loading ? (
              <div className="text-gray-500 dark:text-gray-400">
                Loading available coins...
              </div>
            ) : (
              <>
                {availableCoinsState.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No coins available
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
                            : "bg-gray-200 text-black hover:bg-gray-300"
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
              className="px-4 py-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
            >
              Update Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanEditModal;
