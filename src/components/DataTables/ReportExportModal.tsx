import React from "react";

const ReportExportModal = ({ isOpen, onClose, onExport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        <h3 className="text-xl font-bold text-dark dark:text-white mb-4">
          Export Reports
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Download your transaction data as a CSV file.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-dark hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onExport}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportExportModal;
