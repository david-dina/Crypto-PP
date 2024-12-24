import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ComposePicker from "@/components/Dashboard/Songs/Detail/ComposePicker";
import Stats from "@/components/Dashboard/Songs/Detail/Stats";

export const metadata: Metadata = {
  title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Compose" />
        <ComposePicker />
      </div>
    </DefaultLayout>
  );
};

export default Settings;
