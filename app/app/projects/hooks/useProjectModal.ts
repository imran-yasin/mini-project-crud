import { useState, useCallback } from "react";
import type { Project } from "@/app/types";

/**
 * Custom hook for managing project modal state (create/edit).
 *
 * Handles both creation and editing modes:
 * - CREATE mode: editingProject is null
 * - EDIT mode: editingProject contains the project data
 *
 * @returns Project modal utilities: isOpen, editingProject, openCreate, openEdit, close
 *
 */

export function useProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const openCreate = useCallback(() => {
    setEditingProject(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setEditingProject(null);
  }, []);

  return {
    isOpen,
    editingProject,
    openCreate,
    openEdit,
    close,
  };
}
