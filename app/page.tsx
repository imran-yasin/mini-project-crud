import Link from "next/link";
import { getSession } from "./lib/auth";
import { ClipboardIcon, EyeIcon, FilterIcon } from "./components/icons";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <header className="text-center mb-8 sm:mb-12 lg:mb-16 pt-6 sm:pt-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            Projects{" "}
            <span className="text-blue-600 dark:text-blue-400">CRUD</span>
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Manage your projects efficiently with our modern project management
            system. Create, organize, and share your work with the community.
          </p>

          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
            {session ? (
              <>
                <Link
                  href="/app/projects"
                  className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base lg:text-lg"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm sm:text-base lg:text-lg"
                >
                  Browse Public Projects
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base lg:text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/projects"
                  className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm sm:text-base lg:text-lg"
                >
                  Browse Public Projects
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto mb-8 sm:mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <ClipboardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manage Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Create, edit, and organize your projects with an intuitive
              interface. Track status and updates in real-time.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <EyeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Share Publicly
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Make your projects public to share with the community. Showcase
              your work and inspire others.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <FilterIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Filter & Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Quickly find projects by name or filter by status. Stay organized
              with powerful search capabilities.
            </p>
          </div>
        </div>

        {session && (
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Welcome back, <span className="font-semibold">{session}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
