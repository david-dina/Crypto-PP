"use client";

import React from 'react';
import TransactionDetails from '@/components/Transactions/transactionsDetail';
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const Transaction = () => {
  const subscriptionsOverviewData = [
    {
      name: "Premium Plan",
      price: 49.99,
      crypto: "-0.0002482",
      asset:"BTC",
      invoiceDate: "Dec 15, 2023",
      status: "Completed",
    },
    {
      name: "Business Plan",
      price: -99.99,
      crypto: "-0.0002482",
      asset:"BTC",
      invoiceDate: "Nov 20, 2023",
      status: "Pending",
    },
    {
      name: "Pro Plan",
      price: 29.99,
      crypto: "-0.0002482",
      asset:"BTC",
      invoiceDate: "Jan 1, 2024",
      status: "Failed",
    },
    {
        name: "Awesome Plan",
        price: 29.99,
        crypto:"-0.0002482",
      asset:"BTC",
        invoiceDate: "Jan 1, 2024",
        status: "Pending",
      },
  ];
  return (
    <div className="p-6 space-y-6">
        <DefaultLayout>
        <TransactionDetails data= {subscriptionsOverviewData}></TransactionDetails>
        </DefaultLayout>
    </div>
  );
};

export default Transaction
