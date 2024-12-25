import React from "react";
import CardsItemOne from "@/components/Cards/CardsItemOne";
import ChartSix from "@/components/Charts/ChartSix";
import QuickInvoices from "@/components/DataTables/QuickInvoices";
import QuickTransactionsTable from "@/components/DataTables/QuickTransactions";

const BusinessDashboardOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {/* Quick Stats */}
      <CardsItemOne
        title="Total Revenue"
        amount="$25,430"
        percentage="+8.4%"
      />
      <CardsItemOne
        title="Active Subscriptions"
        amount="1,250"
        percentage="+4.2%"
      />
      <CardsItemOne
        title="Pending Invoices"
        amount="32"
        percentage="-2.1%"
      />
      <CardsItemOne
        title="New Customers"
        amount="104"
        percentage="+6.5%"
      />

      {/* Charts Section */}
      <div className="col-span-12 xl:col-span-7">
        <ChartSix />
      </div>

      {/* Recent Activity */}
      <div className="col-span-12 xl:col-span-7">
        <h4 className="mb-4 text-lg font-bold text-dark dark:text-white">
          Recent Transactions
        </h4>
        <QuickTransactionsTable />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <h4 className="mb-4 text-lg font-bold text-dark dark:text-white">
          Recent Invoices
        </h4>
        <QuickInvoices/>
      </div>
    </div>
  );
};

export default BusinessDashboardOverview;
