import Analytics from "@/components/Dashboard/Analytics/Analytics";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Analytics Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description:
    "This is Next.js Analytics Dashboard page for NextAdmin Dashboard Kit",
};

const InvoicesPage = () => {
  return (
    <DefaultLayout>
      <Analytics />
    </DefaultLayout>
  );
};

export default InvoicesPage;
