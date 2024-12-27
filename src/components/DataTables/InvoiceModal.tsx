"use client";

import React from "react";

const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark max-w-lg w-full">
        <h3 className="text-lg font-bold mb-4 text-dark dark:text-white">
          Invoice Details
        </h3>
        <ul className="mb-4 space-y-2 text-dark dark:text-white">
          <li><strong>ID:</strong> {invoice.id}</li>
          <li><strong>Date:</strong> {invoice.date}</li>
          <li><strong>Customer:</strong> {invoice.customer}</li>
          <li><strong>Amount:</strong> {invoice.amount}</li>
          <li><strong>Due Date:</strong> {invoice.dueDate}</li>
          <li><strong>Status:</strong> {invoice.status}</li>
          <li><strong>Payment Method:</strong> {invoice.paymentMethod}</li>
          <li><strong>Notes:</strong> {invoice.notes}</li>
        </ul>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => console.log("Downloading PDF...")}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
          >
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-dark hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
