"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";

export default function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const isInitialMount = useRef(true);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (newStatus && newStatus !== "all") {
      params.set("status", newStatus);
    }

    const queryString = params.toString();
    startTransition(() => {
      router.push(`/app/projects${queryString ? `?${queryString}` : ""}`);
    });
  };

  useEffect(() => {
    // Skip the initial mount to prevent unnecessary navigation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();

      if (search) {
        params.set("search", search);
      }

      if (status && status !== "all") {
        params.set("status", status);
      }

      const queryString = params.toString();
      startTransition(() => {
        router.push(`/app/projects${queryString ? `?${queryString}` : ""}`);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, router]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    startTransition(() => {
      router.push("/app/projects");
    });
  };

  const hasActiveFilters = search || status !== "all";

  return (
    <div className="flex gap-3 flex-1 max-w-2xl">
      <div className="relative flex-1">
        <input
          type="text"
          name="search"
          placeholder="Search projects..."
          value={search}
          disabled={isPending}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
      <select
        name="status"
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">All Status</option>
        <option value="planned">Planned</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="px-6 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
