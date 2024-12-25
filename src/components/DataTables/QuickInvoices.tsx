"use client"
import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  Column,
} from "react-table";
import { FilterProps } from "react-table";
import ColumnFilter from "./ColumnFilter";

// Invoice Interface
interface Invoice {
    id: string;
    date: string;
    customer: string;
    amount: string;
    dueDate: string;
    status: string;
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
    },
    {
      id: "inv_002",
      date: "2024-01-06",
      customer: "Jane Smith",
      amount: "$50.00",
      dueDate: "2024-01-22",
      status: "Pending",
    },
    {
      id: "inv_003",
      date: "2024-01-07",
      customer: "Mark Johnson",
      amount: "$1,200.00",
      dueDate: "2024-01-25",
      status: "Overdue",
    },
    {
      id: "inv_004",
      date: "2024-01-08",
      customer: "Alice Brown",
      amount: "$500.00",
      dueDate: "2024-01-15",
      status: "Paid",
    },
    {
      id: "inv_005",
      date: "2024-01-09",
      customer: "Chris Evans",
      amount: "$15.00",
      dueDate: "2024-01-30",
      status: "Pending",
    },
  ];
  


// Columns Configuration
const columns: Column<Invoice>[] = [
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
      Header: "Status",
      accessor: "status",
    },
  ];
  


const QuickInvoices= () => {
  const data = useMemo(() => recentInvoices, []);
  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter as React.FC<FilterProps<Invoice>>,
    };
  }, []);

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
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
    <section className="data-table-common rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between px-7.5 py-4.5">
        <div className="relative z-20 w-full max-w-[414px]">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-[7px] border border-stroke bg-transparent px-5 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
            placeholder="Search here..."
          />

          <button className="absolute right-0 top-0 flex h-11.5 w-11.5 items-center justify-center rounded-r-md bg-primary text-white">
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.958 11.957C12.2508 11.6641 12.7257 11.6641 13.0186 11.957L16.2811 15.2195C16.574 15.5124 16.574 15.9872 16.2811 16.2801C15.9882 16.573 15.5133 16.573 15.2205 16.2801L11.958 13.0176C11.6651 12.7247 11.6651 12.2499 11.958 11.957Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center font-medium">
          <p className="pl-2 font-medium text-dark dark:text-white">
            Per Page:
          </p>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-transparent pl-2.5"
          >
            {[5, 10, 20, 50].map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table
        {...getTableProps()}
        className="datatable-table datatable-one w-full table-auto !border-collapse overflow-hidden break-words px-4 md:table-fixed md:overflow-auto md:px-8"
      >
        <thead className="border-separate px-4">
          {headerGroups.map((headerGroup, key) => (
            <tr
              className="border-t border-stroke dark:border-dark-3"
              {...headerGroup.getHeaderGroupProps()}
              key={key}
            >
              {headerGroup.headers.map((column, key) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={key}
                >
                  <div className="flex items-center">
                    <span> {column.render("Header")}</span>

                    <div className="ml-2 inline-flex flex-col space-y-[2px]">
                      <span className="inline-block">
                        <svg
                          className="fill-current"
                          width="10"
                          height="5"
                          viewBox="0 0 10 5"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 0L0 5H10L5 0Z" fill="" />
                        </svg>
                      </span>
                      <span className="inline-block">
                        <svg
                          className="fill-current"
                          width="10"
                          height="5"
                          viewBox="0 0 10 5"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z"
                            fill=""
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {column.canFilter ? column.render("Filter") : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <tr
                className="border-t border-stroke dark:border-dark-3"
                {...row.getRowProps()}
                key={key}
              >
                {row.cells.map((cell, key) => {
                  return (
                    <td {...cell.getCellProps()} key={key}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between px-7.5 py-7">
        <div className="flex items-center">
          <button
            className="flex cursor-pointer items-center justify-center rounded-[3px] p-[7px] px-[7px] hover:bg-primary hover:text-white"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1777 16.1158C12.009 16.1158 11.8402 16.0596 11.7277 15.9189L5.37148 9.45019C5.11836 9.19707 5.11836 8.80332 5.37148 8.5502L11.7277 2.08145C11.9809 1.82832 12.3746 1.82832 12.6277 2.08145C12.8809 2.33457 12.8809 2.72832 12.6277 2.98145L6.72148 9.0002L12.6559 15.0189C12.909 15.2721 12.909 15.6658 12.6559 15.9189C12.4871 16.0314 12.3465 16.1158 12.1777 16.1158Z"
                fill=""
              />
            </svg>
          </button>

          {pageOptions.map((_page, index) => (
            <button
              key={index}
              onClick={() => {
                gotoPage(index);
              }}
              className={`${
                pageIndex === index && "bg-primary text-white"
              } mx-1 flex cursor-pointer items-center justify-center rounded-[3px] p-1.5 px-[15px] font-medium hover:bg-primary hover:text-white`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="flex cursor-pointer items-center justify-center rounded-[3px] p-[7px] px-[7px] hover:bg-primary hover:text-white"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.82148 16.1158C5.65273 16.1158 5.51211 16.0596 5.37148 15.9471C5.11836 15.6939 5.11836 15.3002 5.37148 15.0471L11.2777 9.0002L5.37148 2.98145C5.11836 2.72832 5.11836 2.33457 5.37148 2.08145C5.62461 1.82832 6.01836 1.82832 6.27148 2.08145L12.6277 8.5502C12.8809 8.80332 12.8809 9.19707 12.6277 9.45019L6.27148 15.9189C6.15898 16.0314 5.99023 16.1158 5.82148 16.1158Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        <p className="font-medium">
          Showing {pageIndex + 1} 0f {pageOptions.length} pages
        </p>
      </div>
    </section>
  );
};

export default QuickInvoices;
