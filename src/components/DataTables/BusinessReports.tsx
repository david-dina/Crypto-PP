"use client";
import React, { useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  Column,
} from "react-table";
import ReportModal from "./ReportModal";
import ReportExportModal from "./ReportExportModal";

interface Transaction {
  id: string;
  date: string;
  customer: string;
  plan: string;
  amount: string;
  currency: string;
  status: string;
  type: string;
  refundDetails?: string;
  fees?: string;
}

// Example data
const transactionData: Transaction[] = [
  {
    id: "txn_001",
    date: "2024-01-05",
    customer: "John Doe",
    plan: "Pro Plan",
    amount: "$120.00",
    currency: "USD",
    status: "Completed",
    type: "Payment",
  },
  {
    id: "txn_002",
    date: "2024-01-06",
    customer: "Jane Smith",
    plan: "Basic Plan",
    amount: "$50.00",
    currency: "USD",
    status: "Pending",
    type: "Recurring",
  },
  {
    id: "txn_003",
    date: "2024-01-07",
    customer: "Mark Johnson",
    plan: "Enterprise Plan",
    amount: "$1,200.00",
    currency: "USD",
    status: "Refunded",
    type: "Refund",
    refundDetails: "Refund processed on 2024-01-08.",
    fees: "$10.00 platform fee applied.",
  },
];

const columns: Column<Transaction>[] = [
  {
    Header: "Transaction ID",
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
    Header: "Plan",
    accessor: "plan",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Currency",
    accessor: "currency",
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ row }) => (
      <span
        className={
          row.original.status === "Completed"
            ? "text-green-500"
            : row.original.status === "Pending"
            ? "text-yellow-500"
            : "text-red-500"
        }
      >
        {row.original.status}
      </span>
    ),
  },
  {
    Header: "Type",
    accessor: "type",
  },
];

const BusinessReports = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const data = useMemo(() => transactionData, []);
  const tableInstance = useTable(
    { columns, data },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
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
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ["Transaction ID", "Date", "Customer", "Plan", "Amount", "Currency", "Status", "Type"],
      ...transactionData.map((t) => [
        t.id,
        t.date,
        t.customer,
        t.plan,
        t.amount,
        t.currency,
        t.status,
        t.type,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions_report.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setExportModalOpen(false);
  };

  return (
    <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex justify-between px-7.5 py-5">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full max-w-[414px] rounded-[7px] border border-stroke px-5 py-2.5 focus:border-primary dark:border-dark-3 dark:focus:border-primary"
          placeholder="Search here..."
        />

        <button
          onClick={() => setExportModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
        >
          Export Reports
        </button>
      </div>

      {/* Table */}
      <table
        {...getTableProps()}
        className="w-full table-auto border-collapse text-left"
      >
        <thead className="border-b border-gray-300 dark:border-gray-600">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-sm">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-4 px-6 font-medium text-gray-600 dark:text-gray-300"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="divide-y divide-gray-300">
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => openModal(row.original)}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between px-7.5 py-7">
        <button
          onClick={previousPage}
          disabled={!canPreviousPage}
          className="rounded-lg px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className="rounded-lg px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {isModalOpen && selectedTransaction && (
        <ReportModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
      {isExportModalOpen && (
        <ReportExportModal
          isOpen={isExportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onExport={handleExport}
        />
      )}
    </section>
  );
};

export default BusinessReports;
