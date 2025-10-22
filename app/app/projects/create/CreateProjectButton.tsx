"use client";

import { useProjectModal } from "@/app/hooks";
import ProjectModal from "../edit/ProjectModal";

export default function CreateProjectButton() {
  const { isOpen, openCreate, close } = useProjectModal();

  return (
    <>
      <button
        onClick={openCreate}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl whitespace-nowrap"
      >
        + New Project
      </button>

      {isOpen && <ProjectModal onClose={close} />}
    </>
  );
}
