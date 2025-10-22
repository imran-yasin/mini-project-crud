"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import type { ActionResult } from "@/app/types";

/**
 * Server action to delete a project.
 *
 * Validates ownership, deletes project from database, and revalidates cache.
 * Requires user authentication.
 *
 * @param id - Project ID to delete
 * @returns ActionResult with success/error status
 */
export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    const email = await requireAuth();

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    if (project.ownerEmail !== email) {
      return { success: false, error: "Unauthorized" };
    }

    const wasPublic = project.isPublic;

    await prisma.project.delete({
      where: { id },
    });

    revalidateTag(`project:${id}`);

    revalidateTag(`projects:user:${email}`);

    if (wasPublic) {
      revalidateTag("projects:public");
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete project error:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
