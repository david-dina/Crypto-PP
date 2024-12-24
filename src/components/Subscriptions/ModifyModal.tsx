import { useState } from "react";
import ClickOutside from "../ClickOutside"; // Import ClickOutside module

const ModifyModal = ({ subscription, onClose, onSave }) => {
  const [selectedPlan, setSelectedPlan] = useState(subscription.plan);
  const [selectedCoin, setSelectedCoin] = useState(subscription.coinType);
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle);

  // Dropdown state management
  const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const [billingDropdownOpen, setBillingDropdownOpen] = useState(false);

  // Example data
  const availableCoins = [
    { type: "ETH", balance: 1.5, usdValue: 2400 },
    { type: "BTC", balance: 0.05, usdValue: 1500 },
    { type: "USDC", balance: 500, usdValue: 500 },
  ];

  const availablePlans = [
    { id: "basic", name: "Basic", price: 20 },
    { id: "premium", name: "Premium", price: 50 },
    { id: "pro", name: "Pro", price: 100 },
  ];

  const billingCycles = [
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" },
  ];

  const handleSave = () => {
    const changes = {
      plan: selectedPlan,
      coinType: selectedCoin,
      billingCycle: billingCycle,
    };
    onSave(changes);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="text-lg font-bold mb-4 text-dark dark:text-white">
          Modify Subscription
        </h3>
        <form>
          {/* Plan Dropdown */}
          <div className="mb-4 relative">
            <label className="block mb-2 text-dark dark:text-white">
              Choose Plan:
            </label>
            <ClickOutside onClick={() => setPlanDropdownOpen(false)}>
              <div
                className="w-full p-2 border rounded cursor-pointer focus:ring-2 focus:ring-primary dark:bg-dark-3 dark:text-white"
                onClick={() => setPlanDropdownOpen(!planDropdownOpen)}
              >
                {availablePlans.find((plan) => plan.id === selectedPlan)?.name}
              </div>
              {planDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white dark:bg-dark-3 border border-stroke shadow-lg rounded z-50 max-h-60 overflow-y-auto">
                  {availablePlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setPlanDropdownOpen(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-4"
                    >
                      {plan.name} - ${plan.price}
                    </div>
                  ))}
                </div>
              )}
            </ClickOutside>
          </div>

          {/* Coin Dropdown */}
          <div className="mb-4 relative">
            <label className="block mb-2 text-dark dark:text-white">
              Payment Coin:
            </label>
            <ClickOutside onClick={() => setCoinDropdownOpen(false)}>
              <div
                className="w-full p-2 border rounded cursor-pointer focus:ring-2 focus:ring-primary dark:bg-dark-3 dark:text-white"
                onClick={() => setCoinDropdownOpen(!coinDropdownOpen)}
              >
                {selectedCoin}
              </div>
              {coinDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white dark:bg-dark-3 border border-stroke shadow-lg rounded z-50 max-h-60 overflow-y-auto">
                  {availableCoins.map((coin) => (
                    <div
                      key={coin.type}
                      onClick={() => {
                        setSelectedCoin(coin.type);
                        setCoinDropdownOpen(false);
                      }}
                      className="flex justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-4"
                    >
                      <span>{coin.type}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {coin.balance} (${coin.usdValue.toFixed(2)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ClickOutside>
            <p className="mt-2 text-sm text-dark dark:text-white">
              Coins will be automatically converted if needed.
            </p>
          </div>

          {/* Billing Cycle Dropdown */}
          <div className="mb-4 relative">
            <label className="block mb-2 text-dark dark:text-white">
              Billing Cycle:
            </label>
            <ClickOutside onClick={() => setBillingDropdownOpen(false)}>
              <div
                className="w-full p-2 border rounded cursor-pointer focus:ring-2 focus:ring-primary dark:bg-dark-3 dark:text-white"
                onClick={() => setBillingDropdownOpen(!billingDropdownOpen)}
              >
                {
                  billingCycles.find(
                    (cycle) => cycle.value === billingCycle
                  )?.label
                }
              </div>
              {billingDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white dark:bg-dark-3 border border-stroke shadow-lg rounded z-50 max-h-60 overflow-y-auto">
                  {billingCycles.map((cycle) => (
                    <div
                      key={cycle.value}
                      onClick={() => {
                        setBillingCycle(cycle.value);
                        setBillingDropdownOpen(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-4"
                    >
                      {cycle.label}
                    </div>
                  ))}
                </div>
              )}
            </ClickOutside>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-dark hover:bg-gray-300 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-4"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyModal;
