import { useState } from "react";
import ModifyModal from "./ModifyModal";
import CancelModal from "./CancelModal";

const SubscriptionsOverview = ({ data }) => {
  // States for managing modals
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Handle opening modals
  const openModifyModal = (item) => {
    setSelectedSubscription(item); // Pass the selected subscription data
    setIsModifyOpen(true);
  };

  const openCancelModal = (item) => {
    setSelectedSubscription(item);
    setIsCancelOpen(true);
  };

  // Handle closing modals
  const closeModal = () => {
    setIsModifyOpen(false);
    setIsCancelOpen(false);
    setSelectedSubscription(null);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <h4 className="text-lg font-bold text-dark dark:text-white mb-4">
        Subscriptions Overview
      </h4>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[180px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Start Date
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Renewal Date
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Coin
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {/* Name */}
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5">
                  <h5 className="text-dark dark:text-white">{item.name}</h5>
                  <p className="mt-[3px] text-body-sm font-medium text-gray-500 dark:text-gray-400">
                    ${item.price}
                  </p>
                </td>

                {/* Start Date */}
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  <p className="text-dark dark:text-white">
                    {item.startDate}
                  </p>
                </td>

                {/* Renewal Date */}
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  <p className="text-dark dark:text-white">
                    {item.renewalDate}
                  </p>
                </td>

                {/* Coin */}
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  <p className="text-dark dark:text-white">
                    {item.coinType} ({item.coinAmount})
                  </p>
                </td>

                {/* Status */}
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                  <p
                    className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                      item.status === "Active"
                        ? "bg-[#219653]/[0.08] text-[#219653]"
                        : item.status === "Expired"
                        ? "bg-[#D34053]/[0.08] text-[#D34053]"
                        : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                    }`}
                  >
                    {item.status}
                  </p>
                </td>

                {/* Actions */}
                <td className="border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                  <div className="flex items-center justify-end space-x-3.5">
                    {/* Modify Button */}
                    <button
                      className="hover:text-primary"
                      onClick={() => openModifyModal(item)}
                    >
                      Modify
                    </button>
                    {/* Cancel Button */}
                    <button
                      className="hover:text-primary"
                      onClick={() => openCancelModal(item)}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isModifyOpen && selectedSubscription && (
        <ModifyModal
          subscription={{
            plan: selectedSubscription.plan,
            coinType: selectedSubscription.coinType,
            billingCycle: selectedSubscription.billingCycle,
          }}
          onClose={closeModal}
          onSave={(changes) => {
            console.log("Changes saved:", {
              ...selectedSubscription,
              ...changes,
            });
            closeModal();
          }}
        />
      )}

      {isCancelOpen && selectedSubscription && (
        <CancelModal
          subscription={{
            name: selectedSubscription.name,
          }}
          onClose={closeModal}
          onConfirm={() => {
            console.log("Subscription cancelled:", selectedSubscription.name);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionsOverview;
