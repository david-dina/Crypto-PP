"use client";

import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PlanTable from "@/components/Dashboard/Plans/PlanTable";
import CreatePlanButton from "@/components/Plans/CreatePlanButton";
import { Plan } from "@/types/Plan";
import { Token } from "@/libs/tokenConfig";
import toast from "react-hot-toast";
import { getTokensByChainKey, getChainTokenConfigByKey } from "@/libs/tokenConfig";
import { initOnboard, getConnectedWalletAddresses } from "@/libs/onboardConfig";
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
      // First, get connected wallet addresses
      const onboard = initOnboard();
      const walletAddresses = await getConnectedWalletAddresses(onboard);

      const [plansResponse, walletsResponse] = await Promise.all([
        fetch("/api/business/plans/getplans", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/wallets/getWallets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallets: walletAddresses }),
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

      // Determine unique coins from wallets and legacy accepted coins
      const uniqueTokens = new Map<string, Token>();

      // First add tokens from connected wallets
      const wallets = walletsData.data || [];
      wallets.forEach((wallet: any) => {
        const chainConfig = getChainTokenConfigByKey(wallet.blockchain.toLowerCase());
        if (chainConfig) {
          chainConfig.tokens.forEach(token => {
            if (!uniqueTokens.has(token.symbol)) {
              uniqueTokens.set(token.symbol, token);
            }
          });
        }
      });

      // Then add legacy accepted coins from plans
      plansData.forEach((plan: Plan) => {
        const acceptedCoins = plan.acceptedCoins || [];
        acceptedCoins.forEach(symbol => {
          if (!uniqueTokens.has(symbol)) {
            // Try to find token config from any chain
            const chains = ['ethereum', 'sepolia']; // Add more chains as needed
            for (const chain of chains) {
              const chainConfig = getChainTokenConfigByKey(chain);
              if (chainConfig) {
                const token = chainConfig.tokens.find(t => t.symbol === symbol);
                if (token) {
                  uniqueTokens.set(symbol, token);
                  break;
                }
              }
            }
          }
        });
      });

      const availableCoins = Array.from(uniqueTokens.values());

      // Update plans data with active/inactive coin status
      const updatedPlans = plansData.map((plan: Plan) => ({
        ...plan,
        tokens: (plan.tokens || []).map(token => ({
          ...token,
          isActive: availableCoins.some(availableToken => availableToken.symbol === token.symbol),
          activeWallets: wallets
            .filter(wallet => {
              const chainConfig = getChainTokenConfigByKey(wallet.blockchain.toLowerCase());
              return chainConfig && chainConfig.tokens.some(t => t.symbol === token.symbol);
            })
            .map(wallet => ({
              address: wallet.address,
              blockchain: wallet.blockchain,
            }))
        })),
        // Also include legacy acceptedCoins in the token list
        legacyTokens: (plan.acceptedCoins || []).map(symbol => {
          const token = availableCoins.find(t => t.symbol === symbol);
          return {
            symbol,
            isActive: !!token,
            activeWallets: token ? wallets
              .filter(wallet => {
                const chainConfig = getChainTokenConfigByKey(wallet.blockchain.toLowerCase());
                return chainConfig && chainConfig.tokens.some(t => t.symbol === symbol);
              })
              .map(wallet => ({
                address: wallet.address,
                blockchain: wallet.blockchain,
              })) : []
          };
        })
      }));

      console.log('Fetched data:', { updatedPlans, walletsData, availableCoins });

      setPlans(updatedPlans);
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
