//import Analytics from "@/components/Dashboard/Analytics/Analytics";
import PlanTable from "@/components/Dashboard/Plans/PlanTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Analytics Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description:
    "This is Next.js Analytics Dashboard page for NextAdmin Dashboard Kit",
};

const PlansPage = () => {
    const planData = [
        {
          id: "plan-001",
          name: "Basic Plan",
          description: "A basic plan for small businesses.",
          billingCycles: [
            { cycle: "Monthly" },
            { cycle: "Yearly" },
          ],
          coins: ["USDT", "BTC"], // Coins supported
          price: 50, // Price shared across all coins
          status: "Active",
        },
        {
          id: "plan-002",
          name: "Pro Plan",
          description: "A pro plan with advanced features.",
          billingCycles: [
            { cycle: "Weekly" },
            { cycle: "Monthly" },
          ],
          coins: ["ETH", "DAI"], // Coins supported
          price: 100, // Price shared across all coins
          status: "Inactive",
        },
        {
          id: "plan-003",
          name: "Enterprise Plan",
          description: "An enterprise-level plan for larger companies.",
          billingCycles: [
            { cycle: "Daily" },
            { cycle: "Monthly" },
            { cycle: "Yearly" },
          ],
          coins: ["SOL", "USDT", "BTC"], // Coins supported
          price: 500, // Price shared across all coins
          status: "Active",
        },
      ];
      
      
      
    
      
      
  return (
    <DefaultLayout>
     <PlanTable data={planData} />
    </DefaultLayout>
  );
};

export default PlansPage;
