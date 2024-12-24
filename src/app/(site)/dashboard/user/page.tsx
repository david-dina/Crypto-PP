"use client";

import React from 'react';
import ChartOne from '@/components/Charts/ChartOne';
import ChartTen from '@/components/Charts/ChartTen';
import ChartThree from '@/components/Charts/ChartThree';
import ChartTwo from '@/components/Charts/ChartTwo';
import TableFour from '@/components/Tables/TableFour';
import TableOne from '@/components/Tables/TableOne';
import TableSix from '@/components/Tables/TableSix';
import TableThree from '@/components/Tables/TableThree';
import TableTwo from '@/components/Tables/TableTwo';
import WalletTable from '@/components/Tables/WalletTable'
import NotificationsTable from '@/components/Tables/NotificationTable';
import UpcomingPayments from '@/components/Charts/UpcomingPayments';
import SubscriptionsOverview from '@/components/Charts/SubscriptionOverview';


const UserDashboard = () => {
  const upcomingPaymentsData = [
    {
      name: "Premium Plan",
      price: 49.99,
      invoiceDate: "Jan 15, 2024",
      status: "Pending",
    },
    {
      name: "Business Plan",
      price: 99.99,
      invoiceDate: "Jan 20, 2024",
      status: "Unpaid",
    },
    {
      name: "Pro Plan",
      price: 29.99,
      invoiceDate: "Feb 1, 2024",
      status: "Paid",
    },
  ];
  const subscriptionsOverviewData = [
    {
      name: "Premium Plan",
      price: 49.99,
      invoiceDate: "Dec 15, 2023",
      status: "Active",
    },
    {
      name: "Business Plan",
      price: 99.99,
      invoiceDate: "Nov 20, 2023",
      status: "Expired",
    },
    {
      name: "Pro Plan",
      price: 29.99,
      invoiceDate: "Jan 1, 2024",
      status: "Active",
    },
  ];
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Test Components</h1>
        <WalletTable/>
        <NotificationsTable></NotificationsTable>
        <SubscriptionsOverview data= {subscriptionsOverviewData}></SubscriptionsOverview>
        <UpcomingPayments data={upcomingPaymentsData}></UpcomingPayments>
        <ChartOne />
        
    </div>
  );
};

export default UserDashboard;
