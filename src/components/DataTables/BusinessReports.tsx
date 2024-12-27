"use client";
import React, { useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
  Column,
} from "react-table";
import ReportExportModal from "./ReportExportModal";

// Interfaces
interface Transaction {
  id: string;
  date: string;
  customer: string;
  plan?: string;
  amount: string;
  currency: string;
  status: string;
  type: string;
}

interface TaxRecord {
  id: string;
  date: string;
  customer: string;
  jurisdiction: string;
  amount: string;
  taxRate: string;
  taxAmount: string;
  total: string;
  status: string;
}

// Sample Data
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
];

const taxData: TaxRecord[] = [
  {
    id: "txn_001",
    date: "2024-01-05",
    customer: "John Doe",
    jurisdiction: "California, US",
    amount: "$120.00",
    taxRate: "7.5%",
    taxAmount: "$9.00",
    total: "$129.00",
    status: "Completed",
  },
  {
    id: "txn_002",
    date: "2024-01-06",
    customer: "Jane Smith",
    jurisdiction: "New York, US",
    amount: "$50.00",
    taxRate: "8.875%",
    taxAmount: "$4.44",
    total: "$54.44",
    status: "Pending",
  },
];

// Columns
const transactionColumns: Column<Transaction>[] = [
  { Header: "Transaction ID", accessor: "id" },
  { Header: "Date", accessor: "date" },
  { Header: "Customer", accessor: "customer" },
  { Header: "Plan", accessor: "plan" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Currency", accessor: "currency" },
  { Header: "Status", accessor: "status" },
  { Header: "Type", accessor: "type" },
];

const taxColumns: Column<TaxRecord>[] = [
  { Header: "Transaction ID", accessor: "id" },
  { Header: "Date", accessor: "date" },
  { Header: "Customer", accessor: "customer" },
  { Header: "Jurisdiction", accessor: "jurisdiction" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Tax Rate", accessor: "taxRate" },
  { Header: "Tax Amount", accessor: "taxAmount" },
  { Header: "Total", accessor: "total" },
  { Header: "Status", accessor: "status" },
];

const BusinessReports = () => {
  const [activeTab, setActiveTab] = useState<"transactions" | "taxes">(
    "transactions"
  );
  const [isExportModalOpen, setExportModalOpen] = useState(false);

  const data = useMemo(
    () => (activeTab === "transactions" ? transactionData : taxData),
    [activeTab]
  );

  const columns = useMemo(
    () => (activeTab === "transactions" ? transactionColumns : taxColumns),
    [activeTab]
  );

  const tableInstance = useTable(
    { columns, data },
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

  const handleExport = () => {
    // Export data as CSV
    const csvContent = [
      columns.map((col) => col.Header),
      ...data.map((row) =>
        columns.map((col) => row[col.accessor as keyof typeof row])
      ),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeTab === "transactions" ? "transactions.csv" : "taxes.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    setExportModalOpen(false);
  };

  return (
    <section className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Tabs */}
      <div className="flex border-b border-stroke px-7.5 py-4">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`mr-4 py-2 ${
            activeTab === "transactions" ? "border-b-2 border-primary" : ""
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab("taxes")}
          className={`py-2 ${
            activeTab === "taxes" ? "border-b-2 border-primary" : ""
          }`}
        >
          Taxes
        </button>
      </div>

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
          Export Report
        </button>
      </div>

      {/* Table */}
      <table {...getTableProps()} className="w-full table-auto text-sm">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300"
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
              <tr {...row.getRowProps()} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Export Modal */}
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
