"use client";

const PlansDelete = ({ tier, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="text-lg font-bold mb-4 text-dark dark:text-white">
          Delete Tier
        </h3>
        <p className="mb-6 text-dark dark:text-white">
          Are you sure you want to delete the tier{" "}
          <span className="font-bold">{tier.name}</span>? All associated plans and billing cycles will be deleted.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-dark hover:bg-gray-300 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-4"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlansDelete;

  