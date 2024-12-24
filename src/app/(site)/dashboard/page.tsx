import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

// Import dashboards
import UserDashboard from "./user/page";
import BusinessDashboard from "./business/page";

// Hooks
import useLocalStorage from "@/hooks/useLocalStorage";

export const metadata: Metadata = {
  title: "Dashboard - Crypto Payments Platform",
  description: "Dashboard for managing subscriptions, payments, and analytics.",
};

export default function DashboardPage() {
  // Role-based rendering
  //const [role] = useLocalStorage("userRole", "USER");
  

  return (
    <DefaultLayout>
      <UserDashboard></UserDashboard>
    </DefaultLayout>
  );
}
