"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PlanTable from "@/components/Dashboard/Plans/PlanTable";
import CreatePlanButton from "@/components/Plans/CreatePlanButton";
import { Plan } from "@/types/Plan";
import { Token } from "@/libs/tokenConfig";
import toast from "react-hot-toast";
import { getTokensByChainKey, getChainTokenConfigByKey } from "@/libs/tokenConfig";

//export const metadata = {
 // title: "Plans Dashboard",
 // description: "View and manage your subscription plans",
//};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptedCoins, setAcceptedCoins] = useState<Token[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [plansResponse, walletsResponse] = await Promise.all([
        fetch("/api/business/plans/getplans", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/wallets/getWallets", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      ]);

      if (!plansResponse.ok) {
        const errorText = await plansResponse.text();
        throw new Error(errorText || "Failed to fetch plans");
      }

      if (!walletsResponse.ok) {
        const errorText = await walletsResponse.text();
        throw new Error(errorText || "Failed to fetch wallets");
      }

      const plansData = await plansResponse.json();
      const walletsData = await walletsResponse.json();

      // Determine unique coins from wallets
      const uniqueTokens = new Map<string, Token>();

      walletsData.data.forEach((wallet: any) => {
        const chainConfig = getChainTokenConfigByKey(wallet.blockchain.toLowerCase());
        if (chainConfig) {
          chainConfig.tokens.forEach(token => {
            // Use symbol as key to avoid duplicates across chains
            if (!uniqueTokens.has(token.symbol)) {
              uniqueTokens.set(token.symbol, token);
            }
          });
        }
      });

      const availableCoins = Array.from(uniqueTokens.values());
      console.log(plansData,walletsData,availableCoins)

      setPlans(plansData || []);
      setAcceptedCoins(availableCoins);
    } catch (err) {
      console.error("Error fetching data:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePlan = async (updatedPlan: Plan) => {
    try {
      // Validate input
      if (!updatedPlan.name || updatedPlan.name.trim() === '') {
        toast.error("Plan name is required");
        return;
      }

      // Ensure billing cycles are present
      if (!updatedPlan.billingCycles || updatedPlan.billingCycles.length === 0) {
        toast.error("At least one billing cycle is required");
        return;
      }

      // Ensure accepted coins are present
      const coinsToUse = updatedPlan.acceptedCoins?.length 
        ? updatedPlan.acceptedCoins 
        : acceptedCoins.map(coin => coin.symbol);

      if (!coinsToUse || coinsToUse.length === 0) {
        toast.error("At least one accepted coin is required");
        return;
      }

      // Prepare payload
      const payload = {
        id: updatedPlan.id,
        name: updatedPlan.name,
        description: updatedPlan.description,
        features: updatedPlan.features,
        billingCycles: Object.keys(updatedPlan.billingCyclesPrices),
        billingCyclesPrices: updatedPlan.billingCyclesPrices,
        acceptedCoins: coinsToUse,
        status: updatedPlan.status
      };

      // Network request with timeout and error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      try {
        const response = await fetch("/api/business/plans/updateplan", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Update plan error response:', errorText);
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        // Reload plans instead of updating a single plan
        const plansResponse = await fetch("/api/business/plans/getplans");
        if (!plansResponse.ok) {
          throw new Error("Failed to fetch updated plans");
        }
        const updatedPlans = await plansResponse.json();
        
        setPlans(updatedPlans);

        toast.success("Plan updated successfully");
        return updatedPlans;
      } catch (err) {
        console.error("Detailed error updating plan:", err, {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
        
        // Specific error handling
        if (err.name === 'AbortError') {
          toast.error("Request timed out. Please try again.");
        } else if (err instanceof TypeError) {
          toast.error(`Network Error: ${err.message}. Please check your internet connection.`);
        } else if (err instanceof Error) {
          toast.error(`Update Failed: ${err.message}`);
        } else {
          toast.error("An unexpected error occurred while updating the plan.");
        }
        throw err;
      }
    } catch (err) {
      console.error("Error updating plan:", err);
      
      // Specific error handling
      if (err instanceof TypeError) {
        toast.error(`Network Error: ${err.message}. Please check your internet connection.`);
      } else if (err instanceof Error) {
        toast.error(`Update Failed: ${err.message}`);
      } else {
        toast.error("An unexpected error occurred while updating the plan.");
      }
      throw err;
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Plans</h2>
          {plans && plans.length > 0 && (
            <CreatePlanButton 
              onPlanCreated={fetchData} 
              availableCoins={acceptedCoins} 
            />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <span className="text-gray-400">Loading plans...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="rounded-sm">
            <PlanTable 
              data={plans} 
              onPlanUpdate={updatePlan}
              availableCoins={acceptedCoins}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-lg text-gray-400 mb-3">
              No plans created yet
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Create your first subscription plan to get started
            </p>
            <CreatePlanButton 
              onPlanCreated={fetchData} 
              availableCoins={acceptedCoins} 
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
