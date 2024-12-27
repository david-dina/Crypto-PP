"use client";
import React, { useState, useEffect } from "react";
import ClickOutside from "@/components/ClickOutside";

type GraphDatasetModalProps = {
  isOpen: boolean; // Modal open state
  onClose: () => void; // Close modal handler
  onApply: (datasets: { name: string; data: number[] }[]) => void; // Return selected datasets
};

// Dataset Options
const datasetOptions = [
    // Revenue Trends
    { id: "rev_trend_1", label: "Total Revenue", data: [2000, 2500, 3200, 4000, 4500, 5000, 6000] },
    { id: "rev_trend_2", label: "Subscriptions", data: [1200, 1300, 1400, 1600, 1800, 2000, 2200] },
    { id: "rev_trend_3", label: "Payments", data: [800, 900, 1000, 1200, 1300, 1500, 1600] },
  
    // Transaction Trends
    { id: "trans_trend_1", label: "Total Transactions", data: [150, 200, 250, 300, 350, 400, 450] },
    { id: "trans_trend_2", label: "Failed Transactions", data: [10, 15, 20, 25, 30, 35, 40] },
  
    // User Growth Trends
    { id: "user_growth_1", label: "Active Users", data: [800, 900, 1000, 1100, 1200, 1300, 1400] },
    { id: "user_growth_2", label: "New Signups", data: [400, 450, 500, 550, 600, 650, 700] },
    { id: "user_growth_3", label: "Churn Rate", data: [50, 60, 70, 80, 90, 100, 110] },
  
    // Wallet Movements
    { id: "wallet_1", label: "Wallet Deposits", data: [500, 600, 700, 800, 900, 1000, 1100] },
    { id: "wallet_2", label: "Wallet Withdrawals", data: [300, 350, 400, 450, 500, 550, 600] },
  ];
  

const GraphDatasetModal: React.FC<GraphDatasetModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter datasets based on search query
  const filteredDatasets = datasetOptions.filter((dataset) =>
    dataset.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle dataset selection
  const handleToggle = (id: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // Deselect
        : prev.length < 2 // Max 2 selections
        ? [...prev, id]
        : prev
    );
  };

  // Apply selected datasets
  const handleApply = () => {
    const selectedData = selectedDatasets.map((id) =>
      datasetOptions.find((dataset) => dataset.id === id)
    );
    onApply(selectedData || []);
    onClose(); // Close modal
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDatasets([]);
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null; // Hide modal if not open

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[#111928]/90 px-4 py-5">
      <ClickOutside onClick={onClose}>
        <div className="w-full max-w-[550px] rounded-lg bg-white px-6 py-8 shadow-lg dark:bg-gray-dark">
          <h3 className="text-xl font-bold text-dark dark:text-white">
            Select Datasets
          </h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Choose up to 2 datasets to compare.
          </p>

          {/* Search */}
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 w-full rounded-md border px-4 py-2 text-sm"
          />

          {/* Dataset List */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredDatasets.map((dataset) => (
              <label
                key={dataset.id}
                className={`block cursor-pointer rounded-md px-4 py-2 ${
                  selectedDatasets.includes(dataset.id)
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleToggle(dataset.id)}
              >
                {dataset.label}
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={onClose}
              className="w-[45%] rounded-lg bg-gray-200 py-2 font-medium text-dark"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className={`w-[45%] rounded-lg py-2 font-medium text-white ${
                selectedDatasets.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
              disabled={selectedDatasets.length === 0}
            >
              Apply
            </button>
          </div>
        </div>
      </ClickOutside>
    </div>
  );
};

export default GraphDatasetModal;
