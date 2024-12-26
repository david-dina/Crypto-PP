"use client";

import React, { useState } from "react";
import PlansModify from "@/components/Plans/PlansModify";
import PlansCancel from "@/components/Plans/PlansCancel";

const PlanTable = ({ data }) => {
  // ----------------------------
  // State Management
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ----------------------------
  // Modal Handlers
  const openModifyModal = (plan) => {
    setSelectedPlan(plan);
    setIsModifyOpen(true);
  };

  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const openAddModal = () => {
    setSelectedPlan(null);
    setIsAddOpen(true);
  };

  const closeModal = () => {
    setIsModifyOpen(false);
    setIsDeleteOpen(false);
    setIsAddOpen(false);
    setSelectedPlan(null);
  };

  const handleSave = (updatedPlan) => {
    console.log("Saved Plan:", updatedPlan);
    closeModal();
  };

  const handleDelete = (planId) => {
    console.log("Deleted Plan ID:", planId);
    closeModal();
  };

  // ----------------------------
  // Render Table
  return (
    <div className="rounded-[10px] border bg-white p-4 shadow-md dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <h4 className="text-lg font-bold text-dark dark:text-white mb-4">
        Plans Management
      </h4>

      {/* Add Plan Button */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
        >
          + Add Plan
        </button>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] dark:bg-dark-2 text-left">
              <th className="px-4 py-4 text-dark dark:text-white">Plan Name</th>
              <th className="px-4 py-4 text-dark dark:text-white">Cycles</th>
              <th className="px-4 py-4 text-dark dark:text-white">Coins</th>
              <th className="px-4 py-4 text-dark dark:text-white">Price</th>
              <th className="px-4 py-4 text-dark dark:text-white">Status</th>
              <th className="px-4 py-4 text-right text-dark dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((plan) => (
              <tr key={plan.id} className="border-[#eee] dark:border-dark-3 border-b">
                <td className="px-4 py-4">{plan.name}</td>
                <td className="px-4 py-4">{plan.billingCycles.map((c) => c.cycle).join(", ")}</td>
                <td className="px-4 py-4">{plan.coins.join(", ")}</td>
                <td className="px-4 py-4">${plan.price}</td>
                <td className="px-4 py-4">{plan.status}</td>
                <td className="px-4 py-4 text-right">
                  <button 
                    onClick={() => openModifyModal(plan)} 
                    className="hover:text-primary mr-4"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => openDeleteModal(plan)} 
                    className="hover:text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {(isModifyOpen || isAddOpen) && (
        <PlansModify plan={selectedPlan || {}} onClose={closeModal} onSave={handleSave} />
      )}
      {isDeleteOpen && (
        <PlansCancel plan={selectedPlan} onClose={closeModal} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default PlanTable;
