"use client";

import React, { useState, useEffect } from "react";
import { Plan } from "@/types/Plan";
import PlansFilter from "./PlansFilter";
import PlanEditModal from "./PlanEditModal";
import DeletePlanModal from "./DeletePlanModal";
import { PAGINATION_CONFIG } from "@/config/constants";
import { Cycle, PlanStatus } from "@prisma/client";
import toast from 'react-hot-toast';
import { Token } from 'tokenconfigs'
import { initOnboard, getConnectedWalletAddresses } from "@/libs/onboardConfig";
import { WalletData } from "@/types/Wallet";
import { getTokensByChainKey } from "@/libs/tokenConfig";

interface PlanTableProps {
  data: Plan[];
  onPlanUpdate: () => void;
}

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ITEMS_PER_PAGE;

const PlanTable = ({ 
  data, 
  onPlanUpdate
}: PlanTableProps) => {
  const [currentFilter, setCurrentFilter] = useState<{
    cycles?: Cycle[];
    status?: PlanStatus;
  }>({});
  const [availableCoins, setAvailableCoins] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  
  // New state for wallet data
  const [connectedWallets, setConnectedWallets] = useState<WalletData[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);

  // Fetch connected wallets on component mount
  useEffect(() => {
    const fetchConnectedWallets = async () => {
      try {
        setWalletLoading(true);
        const onboard = initOnboard();
        const walletAddresses = await getConnectedWalletAddresses(onboard);
        
        if (walletAddresses.length > 0) {
          const response = await fetch("/api/wallets/getWallets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wallets: walletAddresses }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch wallet data');
          }

          const { data: walletData } = await response.json();
          setConnectedWallets(walletData);
        }
      } catch (error) {
        console.error('Error fetching connected wallets:', error);
        toast.error('Failed to retrieve wallet data');
      } finally {
        setWalletLoading(false);
      }
    };

    fetchConnectedWallets();
  }, []);

  // Effect to set available coins based on connected wallets
  useEffect(() => {
    // Determine unique coins from wallets using getTokensByChainKey
    const uniqueTokens = new Set<Token>();

    // Safely handle wallet data
    const wallets = connectedWallets || [];
    wallets.forEach((wallet: any) => {
      const chainTokens = getTokensByChainKey(wallet.blockchain.toLowerCase());
      chainTokens.forEach(token => uniqueTokens.add(token));
    });

    setAvailableCoins(Array.from(uniqueTokens));
  }, [connectedWallets]);

  // Filtering logic
  const filteredPlans = data.filter(plan => {
    // Status filter
    if (currentFilter.status && plan.status !== currentFilter.status) {
      return false;
    }

    // Cycle filter
    if (currentFilter.cycles && currentFilter.cycles.length > 0) {
      const matchesCycle = currentFilter.cycles.every(filterCycle => 
        plan.billingCycles.includes(filterCycle)
      );
      if (!matchesCycle) {
        return false;
      }
    }

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      if (!plan.name.toLowerCase().includes(lowerQuery)) {
        return false;
      }
    }

    return true;
  });

  // Pagination
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleDeletePlan = (plan: Plan) => {
    setPlanToDelete(plan);
  };

  const handleConfirmDelete = async () => {
    try {
      // Close the delete modal
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error in delete handling:', error);
      toast.error('Failed to delete plan');
    }
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setPlanToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDownloadPlan = (plan: Plan) => {
    // Convert plan to CSV
    const convertToCSV = (obj: any) => {
      const flattenObject = (ob: any) => {
        let toReturn: any = {};
        
        for (let i in ob) {
          if (!ob.hasOwnProperty(i)) continue;
          
          if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            let flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
              if (!flatObject.hasOwnProperty(x)) continue;
              
              toReturn[`${i}_${x}`] = flatObject[x];
            }
          } else {
            toReturn[i] = ob[i];
          }
        }
        return toReturn;
      };

      const flattened = flattenObject(obj);
      const headers = Object.keys(flattened);
      const values = headers.map(header => 
        `"${String(flattened[header]).replace(/"/g, '""')}"`
      );

      return [headers.join(','), values.join(',')].join('\n');
    };

    const csvData = convertToCSV(plan);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan_${plan.name}_${plan.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded plan: ${plan.name}`);
  };

  return (
    <div>
      <PlansFilter 
        onFilterChange={(filter) => {
          setCurrentFilter(filter);
          setCurrentPage(1);
        }}
        onSearch={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
      />
      
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-[#1C1C24]">
              <th className="py-4 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-1/4">Plan ID</th>
              <th className="py-4 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-1/4">Name</th>
              <th className="py-4 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-1/4">Billing Cycles</th>
              <th className="py-4 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-1/4">Status</th>
              <th className="py-4 px-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlans.map((plan) => (
              <tr key={plan.id} className="border-t border-[#1C1C24]">
                <td className="py-4 px-4 w-1/4">
                  <span 
                    className="text-sm text-gray-900 dark:text-white"
                    title={plan.id}
                  >
                    {plan.id.slice(0, 4)}...{plan.id.slice(-4)}
                  </span>
                </td>
                <td className="py-4 px-4 w-1/4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {plan.name}
                  </span>
                </td>
                <td className="py-4 px-4 w-1/4">
                  <div className="flex flex-wrap gap-2">
                    {plan.billingCycles.map((cycle, index) => (
                      <span 
                        key={index}
                        className="text-sm text-gray-900 dark:text-white"
                      >
                        {cycle}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 w-1/4">
                  <span 
                    className={`text-sm ${
                      plan.status === 'ACTIVE' ? 'text-green-700 dark:text-green-400' :
                      plan.status === 'PRIVATE' ? 'text-gray-700 dark:text-gray-300' :
                      plan.status === 'ARCHIVED' ? 'text-yellow-700 dark:text-yellow-400' :
                      'text-red-700 dark:text-red-400'
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>
                <td className="py-4 px-4 w-1/4">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleEditPlan(plan)}
                      className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-5 h-5"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" 
                        />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan)}
                      className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDownloadPlan(plan)}
                      className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-full text-sm ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Edit Modal */}
      {selectedPlan && (
        <PlanEditModal
          plan={{
            ...selectedPlan,
            billingCycles: selectedPlan.billingCycles,
            billingCyclesPrices: selectedPlan.billingCyclesPrices ?? {
              DAILY: 0,
              WEEKLY: 0,
              MONTHLY: 0,
              YEARLY: 0
            }
          }}
          availableCoins={availableCoins}
          onClose={handleCloseModal}
          onPlanUpdated={onPlanUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {planToDelete && (
        <DeletePlanModal
          planId={planToDelete.id}
          planName={planToDelete.name}
          onClose={handleCloseModal}
          onDeleteSuccess={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default PlanTable;
