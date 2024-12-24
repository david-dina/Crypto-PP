import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SongsTable from "@/components/Dashboard/Songs/SongsTable";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="My Songs" />
      <div className="flex flex-col gap-10">
        <SongsTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
