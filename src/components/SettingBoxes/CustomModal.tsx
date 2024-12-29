import React, { ReactNode } from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-medium text-dark dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-dark dark:text-white">
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="py-4">{children}</div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-dark hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
