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
  onCreatePlanClick?: () => void;
}

export default function CreatePlanButton({ 
  onPlanCreated, 
  availableCoins,
  onCreatePlanClick 
}: CreatePlanButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    if (onCreatePlanClick) {
      onCreatePlanClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-opacity-90"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 4.5v15m7.5-7.5h-15" 
          />
        </svg>
        Create Plan
      </button>

      {showModal && (
        <PlansCreate
          onClose={() => setShowModal(false)}
          onPlanCreated={onPlanCreated}
          availableCoins={availableCoins}
        />
      )}
    </>
  );
}
