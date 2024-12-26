"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

// Invoice Interface
interface Invoice {
  id: string;
  date: string;
  customer: string;
  amount: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  notes: string;
}

// Updated Invoices Data
const recentInvoices: Invoice[] = [
  {
    id: "inv_001",
    date: "2024-01-05",
    customer: "John Doe",
    amount: "$120.00",
    dueDate: "2024-01-20",
    status: "Paid",
    paymentMethod: "Credit Card",
    notes: "Monthly subscription",
  },
  {
    id: "inv_002",
    date: "2024-01-06",
    customer: "Jane Smith",
    amount: "$50.00",
    dueDate: "2024-01-22",
    status: "Pending",
    paymentMethod: "Crypto",
    notes: "Awaiting payment confirmation",
  },
  {
    id: "inv_003",
    date: "2024-01-07",
    customer: "Mark Johnson",
    amount: "$1,200.00",
    dueDate: "2024-01-25",
    status: "Overdue",
    paymentMethod: "Bank Transfer",
    notes: "Late fee applied",
  },
];

const BizInvoiceTable = () => {
  const data = useMemo(() => recentInvoices, []);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // For modal data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const openModifyModal = () => {
    setIsModifyOpen(true);
  };

  const closeModal = () => {
    setIsModifyOpen(false);
    setIsModalOpen(false); // Close invoice modal
  };

  // Memoize Download Function
  const downloadInvoice = useCallback((invoice: Invoice) => {
    const data = JSON.stringify(invoice, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${invoice.id}.json`; // File name based on invoice ID
    link.click();
  }, []);

  // Memoize Open Modal Function
  const openInvoiceModal = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice); // Pass invoice to modal
    setIsModalOpen(true);
  }, []);

  // Columns Configuration
  const columns = useMemo(
    () => [
      {
        Header: "Invoice ID",
        accessor: "id",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Customer",
        accessor: "customer",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Due Date",
        accessor: "dueDate",
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              value === "Paid"
                ? "bg-green-100 text-green-700"
                : value === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Notes",
        accessor: "notes",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            {/* View Button */}
            <button
              onClick={() => openInvoiceModal(row.original)} // Open modal with data
              className="hover:text-primary"
            >
              View
            </button>
            {/* Download Button */}
            <button
              onClick={() => downloadInvoice(row.original)} // Download invoice
              className="hover:text-primary"
            >
              Download
            </button>
          </div>
        ),
      },
    ],
    [openInvoiceModal, downloadInvoice] // Memoized dependencies
  );

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter, // Place this first
    useSortBy, // Place this after useGlobalFilter
    usePagination // Pagination goes last
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    gotoPage,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Search & Controls */}
      <div className="flex justify-between px-7.5 py-4.5">
        <div className="relative w-full max-w-[414px]">
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-[7px] border px-5 py-2.5 dark:border-dark-3 dark:bg-dark-2"
            placeholder="Search invoices..."
          />
        </div>

        <div className="flex items-center">
          <p className="pl-2 text-dark dark:text-white">Per Page:</p>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-transparent pl-2.5"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <table
        {...getTableProps()}
        className="w-full table-auto overflow-hidden break-words"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-4 text-dark dark:text-white"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b dark:border-dark-3">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="px-4 py-4">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default BizInvoiceTable;
