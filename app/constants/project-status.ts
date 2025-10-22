import { ProjectStatus } from "@/app/types";

export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.PLANNED, label: "Planned" },
  { value: ProjectStatus.ACTIVE, label: "Active" },
  { value: ProjectStatus.DONE, label: "Done" },
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNED]: "Planned",
  [ProjectStatus.ACTIVE]: "Active",
  [ProjectStatus.DONE]: "Done",
};

export const PROJECT_STATUS_VALUES = [
  ProjectStatus.PLANNED,
  ProjectStatus.ACTIVE,
  ProjectStatus.DONE,
] as const;
