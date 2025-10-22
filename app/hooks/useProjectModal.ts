import { useState } from "react";
import type { Project } from "@/app/types";

export function useProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const openCreate = () => {
    setEditingProject(null);
    setIsOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEditingProject(null);
  };

  return {
    isOpen,
    editingProject,
    openCreate,
    openEdit,
    close,
  };
}
