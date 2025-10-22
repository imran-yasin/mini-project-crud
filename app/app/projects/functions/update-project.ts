"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import type { ActionResult } from "@/app/types";
import { projectFormSchema, type ProjectFormInput } from "@/app/schemas";
import { ZodError } from "zod";

/**
 * Server action to update an existing project.
 *
 * Validates ownership, updates project data, and revalidates cache.
 * Requires user authentication.
 *
 * @param id - Project ID to update
 * @param formData - Updated project form data
 * @returns ActionResult with success/error status
 */
export async function updateProject(
  id: string,
  formData: ProjectFormInput
): Promise<ActionResult> {
  try {
    const email = await requireAuth();

    const validatedData = projectFormSchema.parse(formData);

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return { success: false, error: "Project not found" };
    }

    if (existingProject.ownerEmail !== email) {
      return { success: false, error: "Unauthorized" };
    }

    const wasPublic = existingProject.isPublic;
    const isNowPublic = formData.isPublic;

    await prisma.project.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        status: validatedData.status,
        isPublic: validatedData.isPublic,
      },
    });

    revalidateTag(`project:${id}`);

    revalidateTag(`projects:user:${email}`);

    if (wasPublic !== isNowPublic || isNowPublic) {
      revalidateTag("projects:public");
    }

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError.message };
    }
    console.error("Update project error:", error);
    return { success: false, error: "Failed to update project" };
  }
}
