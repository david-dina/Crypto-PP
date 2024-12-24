"use client";

import React from "react";
import Card from "@/components/cards";
import Chart from "@/components/Charts";
import Table from "@/components/DataTables";
import Modal from "@/components/Modals";

const BusinessDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Business Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Revenue" value="$12,540" />
        <Card title="Active Subscribers" value="150" />
        <Card title="Churn Rate" value="5%" />
      </div>

      {/* Revenue Chart */}
      <Chart title="Revenue Trends" data={[500, 800, 1200, 900]} />

      {/* Create Plan Modal */}
      <Modal title="Create New Plan">
        <form>
          <input type="text" placeholder="Plan Name" />
          <input type="number" placeholder="Price" />
          <button>Create Plan</button>
        </form>
      </Modal>

      {/* Invoice Table */}
      <Table
        title="Invoices"
        data={[
          { plan: "Pro Plan", subscribers: 10, revenue: "$500" },
          { plan: "Basic Plan", subscribers: 20, revenue: "$400" },
        ]}
        columns={["Plan", "Subscribers", "Revenue"]}
      />
    </div>
  );
};

export default BusinessDashboard;
