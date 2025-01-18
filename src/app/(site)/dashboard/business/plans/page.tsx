import PlanTable from "@/components/Dashboard/Plans/PlanTable";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plans Dashboard",
  description: "Manage your subscription plans",
};

async function getPlans() {
  try {
    const headersList = headers();
    const response = await fetch(`/api/business/plans/getplans`, {
      headers: headersList,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

const PlansPage = async () => {
    const plans = await getPlans();
    
    return (
        <DefaultLayout>
            <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-end px-4 pt-4 pb-1">
                    {plans?.data && plans.data.length > 0 && (
                        <Link
                            href="/dashboard/business/plans/create"
                            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-sm font-medium text-white hover:bg-opacity-90"
                        >
                            Create Plan
                        </Link>
                    )}
                </div>

                {plans?.data && plans.data.length > 0 ? (
                    <PlanTable data={plans.data} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <h2 className="text-lg text-gray-500 dark:text-gray-400 mb-3">
                            No plans created yet
                        </h2>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
                            Create your first subscription plan to get started
                        </p>
                        <Link
                            href="/dashboard/business/plans/create"
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2 px-8 text-sm font-medium text-white hover:bg-opacity-90"
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 4V20M4 12H20"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Create Your First Plan
                        </Link>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default PlansPage;
