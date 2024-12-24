"use client";

import React from 'react';
import SubscriptionsOverview from '@/components/Subscriptions/SubscriptionOverview';
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const Subscription = () => {
  const subscriptionsOverviewData = [
    {
        id: 1,
        name: "Premium Plan",
        price: 50,
        startDate: "2024-01-01",
        renewalDate: "2025-01-01",
        coinType: "ETH",
        coinAmount: "0.02",
        billingCycle: "annual",
        plan: "premium",
        status: "Active",
      },
      {
        id: 2,
        name: "Basic Plan",
        price: 20,
        startDate: "2024-02-15",
        renewalDate: "2024-03-15",
        coinType: "BTC",
        coinAmount: "0.001",
        billingCycle: "monthly",
        plan: "basic",
        status: "Active",
      },
      {
        id: 3,
        name: "Pro Plan",
        price: 100,
        startDate: "2023-12-01",
        renewalDate: "2024-12-01",
        coinType: "USDC",
        coinAmount: "100",
        billingCycle: "annual",
        plan: "pro",
        status: "Expired",
      },
      {
        id: 4,
        name: "Standard Plan",
        price: 35,
        startDate: "2024-03-01",
        renewalDate: "2024-04-01",
        coinType: "ETH",
        coinAmount: "0.015",
        billingCycle: "monthly",
        plan: "standard",
        status: "Active",
      },
  ];
  return (
    <div className="p-6 space-y-6">
        <DefaultLayout>
        <SubscriptionsOverview data= {subscriptionsOverviewData}></SubscriptionsOverview>
        </DefaultLayout>
    </div>
  );
};

export default Subscription