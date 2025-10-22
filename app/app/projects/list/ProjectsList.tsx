"use client";

import type { Project } from "@/app/types";
import { getStatusColor, formatDateTime } from "@/app/utils";
import { useProjectModal, useProjectDelete } from "@/app/hooks";
import ProjectModal from "../edit/ProjectModal";
import ConfirmModal from "@/app/components/ConfirmModal";
import { FolderIcon, SpinnerIcon } from "@/app/components/icons";

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const { isOpen, editingProject, openEdit, close } = useProjectModal();
  const {
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting,
    showConfirmModal,
  } = useProjectDelete();

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
          No projects
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new project.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words">
                    {project.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                  {project.isPublic && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 whitespace-nowrap">
                      Public
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 break-words">
                    {project.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Updated: {formatDateTime(project.updatedAt)}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                <button
                  onClick={() => openEdit(project)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => requestDelete(project.id)}
                  disabled={isDeleting(project.id)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting(project.id) ? (
                    <>
                      <SpinnerIcon className="h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && editingProject && (
        <ProjectModal project={editingProject} onClose={close} />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
