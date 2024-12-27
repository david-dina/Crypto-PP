import React from "react";

const ReportModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="text-xl font-bold text-dark dark:text-white mb-4">
          Transaction Details
        </h3>
        <p>ID: {transaction.id}</p>
        <p>Date: {transaction.date}</p>
        <p>Customer: {transaction.customer}</p>
        <p>Status: {transaction.status}</p>
        {transaction.refundDetails && <p>Refund: {transaction.refundDetails}</p>}
        {transaction.fees && <p>Fees: {transaction.fees}</p>}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
