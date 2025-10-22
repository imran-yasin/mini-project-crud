import { SpinnerIcon } from "@/app/components/icons";

export default function AppDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <SpinnerIcon className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Loading Dashboard...
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please wait a moment
        </p>
      </div>
    </div>
  );
}
