"use client"
import WalletOverview from "@/components/Wallet/walletOverview";
import TableFour from "@/components/Tables/TableFour";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";




export default function WalletsPage() {

  return (
    <DefaultLayout>
        <WalletOverview/>
    </DefaultLayout>
  );
}