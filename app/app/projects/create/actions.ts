"use server";

import { revalidateTag } from "next/cache";
import prisma from "@/app/lib/prisma";
import { requireAuth } from "@/app/lib/auth";
import type { ActionResult } from "@/app/types";
import { projectFormSchema, type ProjectFormInput } from "@/app/schemas";
import { ZodError } from "zod";

/**
 * Server action to create a new project.
 *
 * Validates form data, creates project in database, and revalidates cache.
 * Requires user authentication.
 *
 * @param formData - Project form data (name, description, status, isPublic)
 * @returns ActionResult with new project ID on success, error message on failure
 */
export async function createProject(
  formData: ProjectFormInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const email = await requireAuth();

    const validatedData = projectFormSchema.parse(formData);

    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        status: validatedData.status,
        isPublic: validatedData.isPublic,
        ownerEmail: email,
      },
    });

    revalidateTag(`projects:user:${email}`);

    if (formData.isPublic) {
      revalidateTag("projects:public");
    }

    return { success: true, data: { id: project.id } };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError.message };
    }
    console.error("Create project error:", error);
    return { success: false, error: "Failed to create project" };
  }
}
