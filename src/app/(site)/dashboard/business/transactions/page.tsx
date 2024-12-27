"use server"
import BizTransactionTable from "@/components/DataTables/BizTransactionsTable";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";




export default async function BusinessTransactionsPage() {

  return (
    <DefaultLayout>
        <BizTransactionTable/>
    </DefaultLayout>
  );
}