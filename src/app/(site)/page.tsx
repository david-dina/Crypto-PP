import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
// Hooks
import useLocalStorage from "@/hooks/useLocalStorage";

export const metadata: Metadata = {
  title: "Crypto Payments Dashboard",
  description: "Dashboard for managing subscriptions, payments, and analytics.",
};

export default function MainPage() {

  return (
    <DefaultLayout>
    </DefaultLayout>
  );
}
