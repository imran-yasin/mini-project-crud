"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import { SpinnerIcon, CloseIcon } from "@/app/components/icons";

export default function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const isInitialMount = useRef(true);

  const handleStatusChange = useCallback(
    (newStatus: string) => {
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
    },
    [search, router]
  );

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

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    startTransition(() => {
      router.push("/app/projects");
    });
  }, [router]);

  const hasActiveFilters = search || status !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 max-w-2xl">
      <div className="relative flex-1">
        <input
          type="text"
          name="search"
          placeholder="Search projects..."
          value={search}
          disabled={isPending}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <SpinnerIcon className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex gap-2 sm:gap-3">
        <select
          name="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
