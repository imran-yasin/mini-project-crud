"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteProject } from "../app/projects/functions/delete-project";

/**
 * Custom hook for managing project deletion with confirmation flow.
 *
 * Provides a two-step deletion process with confirmation modal:
 * 1. User initiates delete (requestDelete)
 * 2. Confirmation modal appears (showConfirmModal)
 * 3. User confirms (confirmDelete) or cancels (cancelDelete)
 * 4. Shows loading state during deletion (isDeleting)
 * 5. Displays toast notifications for success/error
 * 6. Refreshes data on success
 *
 * @returns Project deletion utilities: requestDelete, confirmDelete, cancelDelete, isDeleting, showConfirmModal
 *
 */

export function useProjectDelete() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    setShowConfirmModal(false);
    setDeletingId(pendingDeleteId);

    const deletePromise = deleteProject(pendingDeleteId);

    toast.promise(deletePromise, {
      loading: "Deleting project...",
      success: "Project deleted successfully!",
      error: (err) => err?.error || "Failed to delete project",
    });

    const result = await deletePromise;

    if (result.success) {
      router.refresh();
      setDeletingId(null);
    } else {
      setDeletingId(null);
    }

    setPendingDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setPendingDeleteId(null);
  };

  const isDeleting = (id: string) => deletingId === id;

  return {
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting,
    showConfirmModal,
  };
}
