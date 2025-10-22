"use server";

import { revalidateTag } from "next/cache";
import prisma from "./prisma";
import { requireAuth } from "./auth";
import type { ActionResult } from "@/app/types";
import { projectFormSchema, type ProjectFormInput } from "@/app/schemas";
import { ZodError } from "zod";

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
