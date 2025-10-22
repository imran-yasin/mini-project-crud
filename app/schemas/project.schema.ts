import { z } from "zod";
import { ProjectStatus } from "@/app/types";

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  status: z.nativeEnum(ProjectStatus),
  isPublic: z.boolean(),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const projectIdSchema = z.object({
  id: z.string().min(1, "Project ID is required"),
});

export type ProjectIdInput = z.infer<typeof projectIdSchema>;
