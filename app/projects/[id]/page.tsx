import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import prisma from "@/app/lib/prisma";
import { getSession } from "@/app/lib/auth";
import Link from "next/link";
import { getStatusColor, formatDate } from "@/app/utils";

type Props = {
  params: Promise<{ id: string }>;
};

async function getProject(id: string) {
  const cachedProject = unstable_cache(
    async () => {
      return await prisma.project.findUnique({
        where: { id },
      });
    },
    [`project-${id}`],
    {
      tags: [`project:${id}`],
      revalidate: 60,
    }
  );

  return cachedProject();
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  const session = await getSession();

  if (!project) {
    notFound();
  }

  if (!project.isPublic && project.ownerEmail !== session) {
    notFound();
  }

  const isOwner = session === project.ownerEmail;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/projects"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to Projects
            </Link>
            {isOwner && (
              <Link
                href="/app/projects"
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Edit in Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex-1 w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {project.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                  {project.isPublic && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      Public
                    </span>
                  )}
                  {isOwner && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                      Your Project
                    </span>
                  )}
                </div>
              </div>
            </div>

            {project.description && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </h2>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 mt-4 sm:mt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <dt className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Created By
                  </dt>
                  <dd className="text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {project.ownerEmail}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </dt>
                  <dd className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {project.status}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Created
                  </dt>
                  <dd className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {formatDate(project.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    Last Updated
                  </dt>
                  <dd className="text-sm sm:text-base text-gray-900 dark:text-white">
                    {formatDate(project.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
