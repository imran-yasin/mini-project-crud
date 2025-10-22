import { ProjectStatus } from "@/app/types";

/**
 * Returns Tailwind CSS classes for project status badges.
 *
 * Maps project status to appropriate color scheme for UI display.
 *
 * @param status - Project status (PLANNED, ACTIVE, DONE)
 * @returns Tailwind CSS classes for background and text colors
 */
export function getStatusColor(status: string | ProjectStatus): string {
  switch (status) {
    case ProjectStatus.PLANNED:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case ProjectStatus.ACTIVE:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case ProjectStatus.DONE:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
  }
}

const DATE_LOCALE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

const DATE_SHORT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
} as const;

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
} as const;

/**
 * Formats a date in a user-friendly long format.
 *
 * Converts Date object or ISO string to readable format (e.g., "January 15, 2024").
 *
 * @param date - Date object or ISO date string
 * @returns Formatted date string in long format
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", DATE_LOCALE_OPTIONS);
}

/**
 * Formats a date with time in a consistent format.
 *
 * Converts Date object or ISO string to readable format with time (e.g., "01/15/2024 14:30:00").
 * Prevents hydration errors by using consistent locale formatting.
 *
 * @param date - Date object or ISO date string
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString("en-US", DATE_SHORT_OPTIONS);
  const timeStr = d.toLocaleTimeString("en-US", TIME_OPTIONS);
  return `${dateStr} ${timeStr}`;
}
