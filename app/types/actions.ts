import type { ProjectFormInput } from "@/app/schemas";

export type ProjectFormData = ProjectFormInput;

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
