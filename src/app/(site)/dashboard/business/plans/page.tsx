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

  const refreshPlans = async () => {
    setIsLoading(true);
    try {
      const plansResponse = await fetch("/api/business/plans/getplans", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!plansResponse.ok) {
        const errorText = await plansResponse.text();
        throw new Error(errorText || "Failed to fetch plans");
      }

      const plansData = await plansResponse.json();
      setPlans(plansData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error refreshing plans:", error);
      toast.error("Failed to refresh plans");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Subscription Plans
        </h1>
        {!isLoading && (
          <CreatePlanButton 
            onPlanCreated={refreshPlans}
            availableCoins={acceptedCoins}
          />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading-spinner text-primary">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <PlanTable 
          data={plans} 
          availableCoins={acceptedCoins}
          onPlanUpdate={refreshPlans}
        />
      )}
    </DefaultLayout>
  );
}
