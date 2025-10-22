"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { deleteProject } from "@/app/lib/actions";

export function useProjectDelete() {
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
