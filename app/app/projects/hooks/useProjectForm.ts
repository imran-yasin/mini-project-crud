"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { projectFormSchema } from "@/app/schemas";
import { useFormValidation } from "@/app/hooks";
import type { Project, ActionResult } from "@/app/types";
import { ProjectStatus } from "@/app/types";
import { createProject } from "../functions/create-project";
import { updateProject } from "../functions/update-project";

/**
 * Custom hook for managing project form state and submission.

 * Handles both CREATE and UPDATE operations:
 * - CREATE: When project parameter is undefined
 * - UPDATE: When project parameter is provided
 *
 * Features:
 * - Form state management
 * - Client-side validation with Zod
 * - Server action calls (create/update)
 * - Toast notifications
 * - Loading states
 * - Optimistic UI updates with router.refresh()
 *
 * @param project - Optional project data for edit mode. If undefined, form is in create mode
 * @returns Project form utilities: formData, updateField, isSubmitting, validationErrors, handleSubmit
 *
 */

export function useProjectForm(project?: Project) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || ProjectStatus.PLANNED,
    isPublic: project?.isPublic || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errors: validationErrors, validate } =
    useFormValidation(projectFormSchema);

  const handleSubmit = async (onSuccess?: () => void) => {
    if (!validate(formData)) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      let result: ActionResult<{ id: string }> | ActionResult<void>;

      if (project) {
        const updatePromise = updateProject(project.id, formData);
        toast.promise(updatePromise, {
          loading: "Updating project...",
          success: "Project updated successfully!",
          error: (err) => err?.error || "Failed to update project",
        });
        result = await updatePromise;
      } else {
        const createPromise = createProject(formData);
        toast.promise(createPromise, {
          loading: "Creating project...",
          success: "Project created successfully!",
          error: (err) => err?.error || "Failed to create project",
        });
        result = await createPromise;
      }

      if (result.success) {
        onSuccess?.();
        router.refresh();
      } else {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    updateField,
    isSubmitting,
    validationErrors,
    handleSubmit,
  };
}
