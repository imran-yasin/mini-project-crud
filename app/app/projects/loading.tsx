import { SpinnerIcon } from "@/app/components/icons";

export default function ProjectsDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            </div>
            <div className="flex gap-2 sm:gap-3 animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 animate-pulse">
          <div className="flex-1 max-w-2xl flex gap-3">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-10 w-full sm:w-auto bg-blue-200 dark:bg-blue-900/30 rounded-lg"></div>
        </div>

        {/* Projects Loading State */}
        <div className="flex flex-col items-center justify-center py-20">
          <SpinnerIcon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading Projects...
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we fetch your data
          </p>
        </div>
      </main>
    </div>
  );
}
