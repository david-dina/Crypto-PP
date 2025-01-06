"use client";
import { useState, useEffect } from "react";

const ChainSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detect wallet providers once the component mounts and the window is available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const detectedProviders = [];
      if (window.ethereum) {
        detectedProviders.push({ name: "Ethereum", id: "ethereum" });
      }
      if (window.solana) {
        detectedProviders.push({ name: "Solana", id: "solana" });
      }
      if (window.btc) {
        detectedProviders.push({ name: "Bitcoin", id: "bitcoin" });
      }
      setProviders(detectedProviders);
      setIsLoading(false);
    }
  }, []);

  const handleSelect = (providerId) => {
    onSelect(providerId); // Pass the selected provider ID back to the parent
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
          Select a Blockchain
        </h3>
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : providers.length === 0 ? (
          <p className="text-center text-red-500">No wallet providers detected.</p>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSelect(provider.id)}
                className="w-full bg-primary px-4 py-2 text-white rounded-lg hover:bg-opacity-90 transition-opacity"
              >
                {provider.name}
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChainSelectionModal;