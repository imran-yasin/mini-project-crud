"use client";

import {
  SpinnerIcon,
  CloseIcon,
  FilterIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@/app/components/icons";
import { PROJECT_STATUS_OPTIONS } from "@/app/constants";
import { useProjectFilters } from "../hooks";

export default function FiltersBar() {
  const {
    search,
    status,
    isPending,
    hasActiveFilters,
    handleSearchChange,
    handleStatusChange,
    clearFilters,
  } = useProjectFilters();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 max-w-2xl">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          placeholder="Search projects..."
          value={search}
          disabled={isPending}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-10 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <SpinnerIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex gap-2 sm:gap-3">
        <div className="relative flex-1 sm:flex-none min-w-[140px] sm:min-w-[160px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <FilterIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <select
            name="status"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 sm:px-6 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm sm:text-base font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <CloseIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
