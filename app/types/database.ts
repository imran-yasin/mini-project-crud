import type { project, Prisma } from "@/app/generated/prisma";
import { ProjectStatus } from "@/app/generated/prisma";

export type Project = project;
export type { Prisma };

export { ProjectStatus };

export type ProjectWithDates = {
  id: string;
  ownerEmail: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};
