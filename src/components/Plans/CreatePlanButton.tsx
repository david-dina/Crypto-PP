"use client";

import { useState} from "react";
import PlansCreate from "./PlansCreate";
import { Plan } from "@/types/Plan";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PlanStatus } from '@prisma/client';
import { Token } from '@/types/Token'; // Assuming Token type is defined in this file

interface CreatePlanButtonProps {
  onPlanCreated?: () => void;
  availableCoins?: Token[];
}

export default function CreatePlanButton({ onPlanCreated, availableCoins }: CreatePlanButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const defaultEmptyPlan: Plan = {
    id: '',
    companyId: '',
    name: '',
    description: '',
    price: 0,
    billingCycles: [],
    features: {},
    acceptedCoins: [],
    status: PlanStatus.PRIVATE  // Default to PRIVATE
  };

  const handleCreatePlan = async (plan: Plan) => {

    // Sanitize plan data
    const sanitizedPlan = {
      name: plan.name,
      description: plan.description,
      acceptedCoins: plan.acceptedCoins,
      features: plan.features,
      billingCycles: plan.billingCycles,
      status: plan.status || PlanStatus.PRIVATE  // Ensure status is always included
    };

    try {
      const response = await fetch("/api/business/plans/createplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedPlan),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to create plan");
      }

      const data = await response.json();
      
      // Refresh the page or call the onPlanCreated callback
      router.refresh();
      setShowModal(false);
      toast.success(`Plan created successfully! Plan ID: ${data.id}`);
      
      // Call the onPlanCreated callback if provided
      if (onPlanCreated) {
        onPlanCreated();
      }
    } catch (error) {
      console.error("Error creating plan:", error);
      
      // Use the error message, or fall back to a generic error
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create plan. Please try again.";
      
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
      >
        <svg 
          className="fill-current" 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M17.8125 16.6656H2.1875C1.96984 16.6656 1.76344 16.7513 1.61084 16.9039C1.45825 17.0565 1.375 17.263 1.375 17.4806C1.375 17.6983 1.46075 17.9047 1.61084 18.0573C1.76094 18.2099 1.96734 18.2956 2.1875 18.2956H17.8125C18.0302 18.2956 18.2366 18.2099 18.3892 18.0573C18.5418 17.9047 18.625 17.6981 18.625 17.4806C18.625 17.263 18.5393 17.0565 18.3892 16.9039C18.2391 16.7513 18.0327 16.6656 17.8125 16.6656ZM2.1875 14.0456H17.8125C18.0302 14.0456 18.2366 13.9598 18.3892 13.8073C18.5418 13.6547 18.625 13.4481 18.625 13.2306V2.56056C18.625 2.343 18.5393 2.13661 18.3892 1.98402C18.2391 1.83142 18.0327 1.74556 17.8125 1.74556H2.1875C1.96984 1.74556 1.76344 1.83142 1.61084 1.98402C1.45825 2.13661 1.375 2.34301 1.375 2.56056V13.2306C1.375 13.4481 1.46075 13.6547 1.61084 13.8073C1.76094 13.9598 1.96734 14.0456 2.1875 14.0456ZM16.625 3.37556V12.4156H3.375V3.37556H16.625Z" 
            fill=""
          />
        </svg>
        Create Plan
      </button>

      {showModal && (
        <PlansCreate 
          onClose={() => setShowModal(false)}
          onSave={async (plan) => {
            const result = await handleCreatePlan(plan);
            if (result) {
              setShowModal(false);
              onPlanCreated && onPlanCreated();
            }
          }}
          availableCoins={availableCoins}
        />
      )}
    </>
  );
}
