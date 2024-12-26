"use client";

import React, { useState } from "react";

const PlansModify = ({ plan, onClose, onSave }) => {
  // Plan States
  const [planName, setPlanName] = useState(plan.name || "");
  const [planDescription, setPlanDescription] = useState(plan.description || "");
  const [billingCycles, setBillingCycles] = useState(plan.billingCycles || []);
  const [selectedCoins, setSelectedCoins] = useState(plan.coins || ["USDT"]); // Default to USDT
  const [price, setPrice] = useState(plan.price || 0); // Single price for all coins

  const availableCoins = ["USDT", "ETH", "BTC", "DAI", "SOL"]; // Predefined list

  // Toggle Billing Cycle
  const handleBillingCycleToggle = (cycle) => {
    const exists = billingCycles.find((item) => item.cycle === cycle);

    if (exists) {
      setBillingCycles((prev) =>
        prev.filter((item) => item.cycle !== cycle)
      );
    } else {
      setBillingCycles((prev) => [...prev, { cycle }]);
    }
  };

  // Handle Coin Selection
  const handleCoinToggle = (coin) => {
    setSelectedCoins((prev) =>
      prev.includes(coin)
        ? prev.filter((c) => c !== coin) // Remove coin
        : [...prev, coin] // Add coin
    );
  };

  // Handle Save
  const handleSave = () => {
    const updatedPlan = {
      ...plan,
      name: planName,
      description: planDescription,
      billingCycles,
      coins: selectedCoins,
      price, // Shared price for all coins
    };
    onSave(updatedPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 text-dark dark:text-white">
          Modify Plan
        </h3>
        <form>
          {/* Plan Name */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Plan Name
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter plan name"
              className="w-full p-2 border rounded dark:bg-dark-3 dark:text-white"
            />
          </div>

          {/* Plan Description */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Description
            </label>
            <textarea
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full p-2 border rounded dark:bg-dark-3 dark:text-white"
            ></textarea>
          </div>

          {/* Billing Cycles */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Billing Cycles
            </label>
            <div className="flex flex-col gap-3">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((cycle) => {
                const isChecked = billingCycles.some(
                  (item) => item.cycle === cycle
                );

                return (
                  <div key={cycle} className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id={`cycle-${cycle}`}
                      checked={isChecked}
                      onChange={() => handleBillingCycleToggle(cycle)}
                      className="h-5 w-5 rounded border border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`cycle-${cycle}`}
                      className="text-dark dark:text-white cursor-pointer"
                    >
                      {cycle}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coins */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Accepted Coins
            </label>
            <div className="flex flex-wrap gap-3">
              {availableCoins.map((coin) => (
                <button
                  key={coin}
                  type="button"
                  onClick={() => handleCoinToggle(coin)}
                  className={`px-4 py-2 rounded border ${
                    selectedCoins.includes(coin)
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 dark:border-dark-3 dark:hover:bg-dark-2"
                  }`}
                >
                  {coin}
                </button>
              ))}
            </div>
          </div>

          {/* Single Price */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Price (applies to all coins)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              placeholder="Enter price"
              className="w-full p-2 border rounded dark:bg-dark-3 dark:text-white"
            />
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

export default PlansModify;


