import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

// Import Dashboards
import UserDashboard from "./dashboard/user/page";
import BusinessDashboard from "./dashboard/business/page";

// Hooks
import useLocalStorage from "@/hooks/useLocalStorage";

export const metadata: Metadata = {
  title: "Crypto Payments Dashboard",
  description: "Dashboard for managing subscriptions, payments, and analytics.",
};

export default function DashboardPage() {
  // Retrieve user role ('USER' or 'BUSINESS') - default to 'USER'
  //const [role] = useLocalStorage("userRole", "USER");

  return (
    <DefaultLayout>
      <UserDashboard></UserDashboard>
    </DefaultLayout>
  );
}
