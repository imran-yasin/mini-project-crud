import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { requireAuth, clearSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProjectsList from "./components/project-list";
import CreateProjectButton from "./components/create-project-button";
import FiltersBar from "./components/filter-bar";
import type { Prisma } from "@/app/types";
import { ProjectStatus } from "@/app/types";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function getProjects(
  email: string,
  statusFilter?: string,
  searchQuery?: string
) {
  const whereClause: Prisma.projectWhereInput = {
    ownerEmail: email,
  };

  if (statusFilter && statusFilter !== "all") {
    whereClause.status = statusFilter.toUpperCase() as ProjectStatus;
  }

  if (searchQuery) {
    whereClause.name = {
      contains: searchQuery,
      mode: "insensitive",
    };
  }

  const cacheKey = `projects-user-${email}-${statusFilter || "all"}-${
    searchQuery || ""
  }`;

  const cachedProjects = unstable_cache(
    async () => {
      return await prisma.project.findMany({
        where: whereClause,
        orderBy: { updatedAt: "desc" },
      });
    },
    [cacheKey],
    {
      tags: [`projects:user:${email}`],
      revalidate: 60,
    }
  );

  return cachedProjects();
}

async function handleLogout() {
  "use server";
  await clearSession();
  redirect("/login");
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const email = await requireAuth();
  const params = await searchParams;
  const statusFilter = (params.status as string) || "all";
  const searchQuery = (params.search as string) || "";

  const projects = await getProjects(email, statusFilter, searchQuery);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                My Projects
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate max-w-[200px] sm:max-w-none">
                Logged in as: {email}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/projects"
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
              >
                Public Projects
              </Link>
              <form action={handleLogout} className="flex-1 sm:flex-none">
                <button
                  type="submit"
                  className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <FiltersBar />
          <CreateProjectButton />
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <ProjectsList projects={projects} />
        </Suspense>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-pulse"
        >
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
