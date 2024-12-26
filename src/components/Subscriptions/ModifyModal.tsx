import { useState } from "react";
import ClickOutside from "../ClickOutside";

const PlansModify = ({ plan, onClose, onSave }) => {
  // Plan States
  const [planName, setPlanName] = useState(plan?.name || "");
  const [planDescription, setPlanDescription] = useState(
    plan?.description || ""
  );
  const [billingCycles, setBillingCycles] = useState(
    plan?.billingCycles || []
  );
  const [status, setStatus] = useState(plan?.status || "Active");

  const [coinType, setCoinType] = useState(plan?.coinType || "USDC");

  // Dropdown states
  const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);
  const coinTypes = ["USDC", "ETH", "BTC"];

  // Save Changes
  const handleSave = () => {
    const updatedPlan = {
      ...plan,
      name: planName,
      description: planDescription,
      billingCycles,
      status,
      coinType,
    };
    onSave(updatedPlan);
  };

  // Handle Billing Cycle Updates
  const handleBillingCycleChange = (index, key, value) => {
    const updatedCycles = [...billingCycles];
    updatedCycles[index][key] = value;
    setBillingCycles(updatedCycles);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark w-[600px] max-h-[80vh] overflow-y-auto">
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
              className="w-full p-2 border rounded dark:bg-dark-3 dark:text-white"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Description
            </label>
            <textarea
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="w-full p-2 border rounded dark:bg-dark-3 dark:text-white"
            ></textarea>
          </div>

          {/* Coin Type Dropdown */}
          <div className="mb-4 relative">
            <label className="block mb-2 text-dark dark:text-white">
              Coin Type
            </label>
            <ClickOutside onClick={() => setCoinDropdownOpen(false)}>
              <div
                className="w-full p-2 border rounded cursor-pointer focus:ring-2 focus:ring-primary dark:bg-dark-3 dark:text-white"
                onClick={() => setCoinDropdownOpen(!coinDropdownOpen)}
              >
                {coinType}
              </div>
              {coinDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white dark:bg-dark-3 border shadow-lg rounded">
                  {coinTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        setCoinType(type);
                        setCoinDropdownOpen(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-4"
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </ClickOutside>
          </div>

          {/* Billing Cycles */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Billing Cycles
            </label>
            {billingCycles.map((cycle, index) => (
              <div
                key={cycle.id}
                className="flex items-center gap-4 mb-2 dark:text-white"
              >
                <p className="w-1/3">{cycle.cycle}</p>
                <input
                  type="number"
                  value={cycle.price}
                  onChange={(e) =>
                    handleBillingCycleChange(index, "price", e.target.value)
                  }
                  className="p-2 border rounded dark:bg-dark-3 dark:text-white"
                />
              </div>
            ))}
          </div>

          {/* Status Toggle */}
          <div className="mb-4">
            <label className="block mb-2 text-dark dark:text-white">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded dark:bg-dark-3 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-dark-3 dark:hover:bg-dark-4"
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
