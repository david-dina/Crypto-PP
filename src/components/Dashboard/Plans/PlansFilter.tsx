"use client";

import { useState } from 'react';
import { Cycle, PlanStatus } from '@prisma/client';

interface PlansFilterProps {
  onFilterChange: (filter: { cycles?: Cycle[]; status?: PlanStatus }) => void;
  onSearch: (query: string) => void;
}

const PlansFilter = ({ onFilterChange, onSearch }: PlansFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<{
    cycles?: Cycle[];
    status?: PlanStatus;
  }>({});

  const handleCycleFilterClick = (cycle: Cycle) => {
    const newCycles = activeFilter.cycles 
      ? activeFilter.cycles.includes(cycle)
        ? activeFilter.cycles.filter(c => c !== cycle)
        : [...activeFilter.cycles, cycle]
      : [cycle];

    const newFilter = { 
      ...activeFilter, 
      cycles: newCycles.length > 0 ? newCycles : undefined 
    };
    
    setActiveFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleStatusFilterChange = (status?: PlanStatus) => {
    const newFilter = { ...activeFilter, status };
    setActiveFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Billing Cycle:</span>
          {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as Cycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => handleCycleFilterClick(cycle)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activeFilter.cycles?.includes(cycle)
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white'
              }`}
            >
              {cycle.charAt(0) + cycle.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
          <select
            onChange={(e) => handleStatusFilterChange(e.target.value as PlanStatus)}
            value={activeFilter.status || ''}
            className="px-3 py-1 text-sm rounded border border-gray-200 dark:border-[#1C1C24] bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
          >
            <option value="">All</option>
            {(['ACTIVE', 'PRIVATE', 'ARCHIVED', 'DISABLED'] as PlanStatus[]).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search plans..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-transparent border border-gray-200 dark:border-[#1C1C24] rounded-full text-gray-900 dark:text-white focus:outline-none focus:border-primary"
        />
        <svg
          className="absolute right-4 top-2.5 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default PlansFilter;