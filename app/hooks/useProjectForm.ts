import { useState } from "react";
import toast from "react-hot-toast";
import { createProject, updateProject } from "@/app/lib/actions";
import { projectFormSchema } from "@/app/schemas";
import { useFormValidation } from "./useFormValidation";
import type { Project, ProjectStatus, ActionResult } from "@/app/types";

export function useProjectForm(project?: Project) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: (project?.status || "PLANNED") as ProjectStatus,
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
