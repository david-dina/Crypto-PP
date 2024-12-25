import React, { useState, useEffect } from "react";
import ClickOutside from "@/components/ClickOutside";

type ModalTwoProps = {
  isOpen: boolean; // Modal open state
  onClose: () => void; // Close modal handler
  onUpdateChart: (selectedPlans: string[]) => void; // Function to update chart
  subscriptions: { value: string; label: string }[]; // Subscription options
};

const ModalTwo: React.FC<ModalTwoProps> = ({
  isOpen,
  onClose,
  onUpdateChart,
  subscriptions,
}) => {
  // State for selected plans
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search input

  // Filtered subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selections when modal opens
  useEffect(() => {
    if (!isOpen) {
      setSelectedPlans([]);
      setSearchQuery(""); // Clear search when modal closes
    }
  }, [isOpen]);

  // Toggle selection for a plan
  const handleSelectPlan = (plan: string) => {
    setSelectedPlans((prevSelected) => {
      if (prevSelected.includes(plan)) {
        // Remove if already selected
        return prevSelected.filter((item) => item !== plan);
      } else if (prevSelected.length < 3) {
        // Add if not selected and limit is not exceeded
        return [...prevSelected, plan];
      }
      return prevSelected; // No changes if limit is exceeded
    });
  };

  // Handle apply changes
  const handleApply = () => {
    onUpdateChart(selectedPlans); // Update chart with selected plans
    onClose(); // Close the modal
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#111928]/90 px-4 py-5">
      <ClickOutside onClick={onClose}>
        <div className="w-full max-w-[550px] rounded-[15px] bg-white px-8 py-12 text-center shadow-3 dark:bg-gray-dark dark:shadow-card md:px-15 md:py-15">
          <h3 className="text-xl font-bold text-dark dark:text-white sm:text-2xl">
            Select Subscriptions
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Choose up to 3 subscriptions to compare.
          </p>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />

          {/* Scrollable Subscription List */}
          <div className="max-h-[200px] overflow-y-auto rounded-lg border border-stroke p-2 dark:border-dark-3">
            {filteredSubscriptions.map((subscription) => (
              <label
                key={subscription.value}
                className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition ${
                  selectedPlans.includes(subscription.value)
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-dark-3"
                }`}
                onClick={() => handleSelectPlan(subscription.value)}
              >
                {subscription.label}
                {selectedPlans.includes(subscription.value) && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
              </label>
            ))}
            {filteredSubscriptions.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No subscriptions found.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-[45%] rounded-lg border border-stroke bg-gray-200 px-5 py-3 font-medium text-dark transition hover:bg-gray-300 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-4"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={selectedPlans.length === 0}
              className={`w-[45%] rounded-lg px-5 py-3 font-medium text-white transition ${
                selectedPlans.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark"
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default ModalTwo;


