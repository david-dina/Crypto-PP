import React, { useState,useRef,useEffect } from 'react';

const TransactionDetails = ({ data }) => {
    const [filters, setFilters] = useState({
        type: "Types",
        status: "Status",
        asset: "Assets",
        date: "Date",
      });
      
      const [dropdowns, setDropdowns] = useState({
        type: false,
        status: false,
        asset: false,
        date: false,
      });

      const dropdownRefs = {
        type: useRef(),
        status: useRef(),
        asset: useRef(),
        date: useRef(),
    };
      
      const toggleDropdown = (dropdown) => {
        setDropdowns((prev) => ({
          ...prev,
          [dropdown]: !prev[dropdown],
        }));
      };
      
      const handleFilterChange = (filter, value) => {
        setFilters((prev) => ({
            ...prev,
            [filter]: value,
        }));
        setDropdowns((prev) => ({
            ...prev,
            [filter]: false,
        })); // Close dropdown after selection
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdowns).forEach((key) => {
                if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
                    setDropdowns((prev) => ({ ...prev, [key]: false }));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
      
      const resetFilters = () => {
        setFilters({
          type: "Types",
          status: "Status",
          asset: "Assets",
          date: "Date",
        });
      };
      

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <h4 className="text-lg font-bold text-dark dark:text-white mb-4">Transactions</h4>

      <div className="flex flex-wrap gap-4 mb-4">
  {/* Reset Filters */}
  <button
    onClick={resetFilters}
    className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-dark-3 hover:bg-gray-100 dark:hover:bg-dark-2 transition"
  >
    Reset Filters
  </button>

  {/* Type Dropdown */}
  <div className="relative">
    <button
      onClick={() => toggleDropdown('type')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-dark-3 hover:bg-gray-100 dark:hover:bg-dark-2 transition"
    >
      {filters.type || "Type"}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>

    </button>
    {dropdowns.type && (
      <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-dark-3 rounded-lg shadow-lg">
        <ul className="py-2 text-sm text-dark dark:text-white">
          <li onClick={() => handleFilterChange('type', 'Types')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">All Types</li>
          <li onClick={() => handleFilterChange('type', 'Sent')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Sent</li>
          <li onClick={() => handleFilterChange('type', 'Received')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Received</li>
        </ul>
      </div>
    )}
  </div>

  {/* Status Dropdown */}
  <div className="relative">
    <button
      onClick={() => toggleDropdown('status')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-dark-3 hover:bg-gray-100 dark:hover:bg-dark-2 transition"
    >
      {filters.status || "Status"}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
    </button>
    {dropdowns.status && (
      <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-dark-3 rounded-lg shadow-lg">
        <ul className="py-2 text-sm text-dark dark:text-white">
          <li onClick={() => handleFilterChange('status', 'All')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">All Status</li>
          <li onClick={() => handleFilterChange('status', 'Completed')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Completed</li>
          <li onClick={() => handleFilterChange('status', 'Pending')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Pending</li>
          <li onClick={() => handleFilterChange('status', 'Failed')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Failed</li>
        </ul>
      </div>
    )}
  </div>

  {/* Asset Dropdown */}
  <div className="relative">
    <button
      onClick={() => toggleDropdown('asset')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-dark-3 hover:bg-gray-100 dark:hover:bg-dark-2 transition"
    >
      {filters.asset || "Asset"}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
    </button>
    {dropdowns.asset && (
      <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-dark-3 rounded-lg shadow-lg">
        <ul className="py-2 text-sm text-dark dark:text-white">
          <li onClick={() => handleFilterChange('asset', 'All')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">All Assets</li>
          <li onClick={() => handleFilterChange('asset', 'BTC')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">BTC</li>
          <li onClick={() => handleFilterChange('asset', 'ETH')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">ETH</li>
          <li onClick={() => handleFilterChange('asset', 'SOL')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">SOL</li>
        </ul>
      </div>
    )}
  </div>

  {/* Date Dropdown */}
  <div className="relative">
    <button
      onClick={() => toggleDropdown('date')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border dark:border-dark-3 hover:bg-gray-100 dark:hover:bg-dark-2 transition"
    >
      {filters.date || "Date"}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
    </button>
    {dropdowns.date && (
      <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-dark-3 rounded-lg shadow-lg">
        <ul className="py-2 text-sm text-dark dark:text-white">
          <li onClick={() => handleFilterChange('date', 'All Time')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">All Time</li>
          <li onClick={() => handleFilterChange('date', 'Past 6 months')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Past 6 months</li>
          <li onClick={() => handleFilterChange('date', 'Year to date')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Year to date</li>
          <li onClick={() => handleFilterChange('date', '2023')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">2023</li>
          <li onClick={() => handleFilterChange('date', 'Custom Range')} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-2 cursor-pointer">Custom Range</li>
        </ul>
      </div>
    )}
  </div>
</div>

      {/* Transaction Table */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Details
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Amount
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Date
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
              <tr
                key={index}
                className={`border-[#eee] dark:border-dark-3 ${
                  index === data.length - 1 ? 'border-b-0' : 'border-b'
                }`}
              >
                <td className="px-4 py-4">
                  <h5 className="text-dark dark:text-white">{item.name}</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p
                    className={`font-medium ${
                      item.price < 0 ? 'text-gray-500' : 'text-green-500'
                    }`}
                  >
                    {item.price < 0 ? `-$${Math.abs(item.price)}` : `$${item.price}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.asset} {item.crypto}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-dark dark:text-white">{item.invoiceDate}</p>
                </td>
                <td className="px-4 py-4">
                  <p
                    className={`inline-flex rounded-full px-3.5 py-1 text-sm font-medium ${
                      item.status === 'Completed'
                        ? "bg-[#219653]/[0.08] text-[#219653]"
                        : item.status === 'Pending'
                        ? "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                        : "bg-[#D34053]/[0.08] text-[#D34053]"
                    }`}
                  >
                    {item.status}
                  </p>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-left justify-end space-x-3.5">
                    <button className="hover:text-primary">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionDetails;
