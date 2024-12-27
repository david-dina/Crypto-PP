"use server"
import WalletOverview from "@/components/Wallet/walletOverview";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";




export default async function BusinessWalletsPage() {

  return (
    <DefaultLayout>
        <WalletOverview/>
    </DefaultLayout>
  );
}