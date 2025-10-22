"use client";

import { useCallback } from "react";
import type { Project } from "@/app/types";
import { ProjectStatus } from "@/app/types";
import { useProjectForm } from "@/app/hooks";
import {
  CloseIcon,
  FilterIcon,
  FolderIcon,
  ClipboardIcon,
  GlobeIcon,
} from "@/app/components/icons";

type Props = {
  project?: Project;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  const {
    formData,
    updateField,
    isSubmitting,
    validationErrors,
    handleSubmit,
  } = useProjectForm(project);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(onClose);
    },
    [handleSubmit, onClose]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {project ? "Edit Project" : "Create New Project"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Project Name *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FolderIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    validationErrors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent`}
                  placeholder="Enter project name"
                />
              </div>
              {validationErrors.name ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {validationErrors.name}
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 3 characters
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 pointer-events-none">
                  <ClipboardIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    validationErrors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent`}
                  placeholder="Enter project description"
                />
              </div>
              {validationErrors.description && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Status *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FilterIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="status"
                  required
                  value={formData.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as ProjectStatus)
                  }
                  className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value={ProjectStatus.PLANNED}>Planned</option>
                  <option value={ProjectStatus.ACTIVE}>Active</option>
                  <option value={ProjectStatus.DONE}>Done</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => updateField("isPublic", e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <GlobeIcon className="h-5 w-5 text-gray-400" />
              <label
                htmlFor="isPublic"
                className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Make this project public
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : project ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
