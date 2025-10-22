import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useRef, useCallback } from "react";

/**
 * Custom hook for managing project filters (search and status).
 *
 * Handles URL synchronization, debounced search input, and filter state management.
 * Automatically syncs filter state with URL query parameters.
 *
 * @returns Filter utilities: search, status, handlers, and loading states
 */
export function useProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const isInitialMount = useRef(true);

  /**
   * Updates URL with current filter values
   */
  const updateURL = useCallback(
    (searchValue: string, statusValue: string) => {
      const params = new URLSearchParams();

      if (searchValue) {
        params.set("search", searchValue);
      }

      if (statusValue && statusValue !== "all") {
        params.set("status", statusValue);
      }

      const queryString = params.toString();
      startTransition(() => {
        router.push(`/app/projects${queryString ? `?${queryString}` : ""}`);
      });
    },
    [router]
  );

  /**
   * Handles status filter change with immediate URL update
   */
  const handleStatusChange = useCallback(
    (newStatus: string) => {
      setStatus(newStatus);
      updateURL(search, newStatus);
    },
    [search, updateURL]
  );

  /**
   * Handles search input change
   * URL update is debounced via useEffect
   */
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
  }, []);

  /**
   * Debounced URL update for search input
   * Waits 500ms after user stops typing before updating URL
   */
  useEffect(() => {
    // Skip the initial mount to prevent unnecessary navigation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      updateURL(search, status);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, updateURL]);

  /**
   * Clears all filters and resets to default view
   */
  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    startTransition(() => {
      router.push("/app/projects");
    });
  }, [router]);

  /**
   * Checks if any filters are currently active
   */
  const hasActiveFilters = search || status !== "all";

  return {
    search,
    status,
    isPending,
    hasActiveFilters,
    handleSearchChange,
    handleStatusChange,
    clearFilters,
  };
}
