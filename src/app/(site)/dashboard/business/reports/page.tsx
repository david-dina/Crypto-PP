"use server"
import BusinessReports from "@/components/DataTables/BusinessReports";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";




export default async function WalletsPage() {

  return (
    <DefaultLayout>
        <BusinessReports/>
    </DefaultLayout>
  );
}