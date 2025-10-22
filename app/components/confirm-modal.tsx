"use client";

import { AlertTriangleIcon, InfoCircleIcon } from "@/app/components/icons";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
};

/**
 * Reusable confirmation modal dialog component.
 *
 * Displays a modal with customizable title, message, and action buttons.
 * Supports three variants: danger (red), warning (yellow), info (blue).
 * Includes backdrop click to cancel and responsive design.
 *
 * @param isOpen - Controls modal visibility
 * @param title - Modal title text
 * @param message - Modal description/message
 * @param confirmLabel - Text for confirm button (default: "Confirm")
 * @param cancelLabel - Text for cancel button (default: "Cancel")
 * @param onConfirm - Callback when confirm button is clicked
 * @param onCancel - Callback when cancel button or backdrop is clicked
 * @param variant - Visual style variant (default: "danger")
 */
const VARIANT_STYLES = {
  danger: {
    icon: "text-red-600 dark:text-red-400",
    confirmBtn: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  },
  warning: {
    icon: "text-yellow-600 dark:text-yellow-400",
    confirmBtn:
      "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
  },
  info: {
    icon: "text-blue-600 dark:text-blue-400",
    confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
  },
} as const;

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: Props) {
  if (!isOpen) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-2 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                variant === "danger"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : variant === "warning"
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-blue-100 dark:bg-blue-900/30"
              } flex items-center justify-center`}
            >
              {variant === "danger" || variant === "warning" ? (
                <AlertTriangleIcon className={`w-6 h-6 ${styles.icon}`} />
              ) : (
                <InfoCircleIcon className={`w-6 h-6 ${styles.icon}`} />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${styles.confirmBtn}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
