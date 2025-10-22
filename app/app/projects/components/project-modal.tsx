"use client";

import { useCallback } from "react";
import type { Project } from "@/app/types";
import { ProjectStatus } from "@/app/types";
import { useProjectForm } from "../hooks";
import {
  CloseIcon,
  FilterIcon,
  FolderIcon,
  ClipboardIcon,
  GlobeIcon,
} from "@/app/components/icons";
import { InputField, TextareaField, SelectField } from "@/app/components/ui";
import { PROJECT_STATUS_OPTIONS } from "@/app/constants";

function ModalOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
      >
        <CloseIcon className="w-6 h-6" />
      </button>
    </div>
  );
}

function ProjectPublicCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
      <input
        type="checkbox"
        id="isPublic"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
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
  );
}

function ModalActions({
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}

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
    <ModalOverlay>
      <ModalHeader
        title={project ? "Edit Project" : "Create New Project"}
        onClose={onClose}
      />

      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          id="name"
          label="Project Name"
          value={formData.name}
          onChange={(value) => updateField("name", value)}
          icon={<FolderIcon className="h-5 w-5 text-gray-400" />}
          error={validationErrors.name}
          placeholder="Enter project name"
          required
          helpText="Minimum 3 characters"
        />

        <TextareaField
          id="description"
          label="Description"
          value={formData.description}
          onChange={(value) => updateField("description", value)}
          icon={<ClipboardIcon className="h-5 w-5 text-gray-400" />}
          error={validationErrors.description}
          placeholder="Enter project description"
          rows={3}
        />

        <SelectField
          id="status"
          label="Status"
          value={formData.status}
          onChange={(value) => updateField("status", value as ProjectStatus)}
          options={PROJECT_STATUS_OPTIONS}
          icon={<FilterIcon className="h-5 w-5 text-gray-400" />}
          required
        />

        <ProjectPublicCheckbox
          checked={formData.isPublic}
          onChange={(checked) => updateField("isPublic", checked)}
        />

        <ModalActions
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitLabel={project ? "Update" : "Create"}
        />
      </form>
    </ModalOverlay>
  );
}
