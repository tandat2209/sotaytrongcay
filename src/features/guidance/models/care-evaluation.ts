import type { CareActivityType } from "@/features/journal";

export type CareEvaluationStatus = "recommended" | "not_recommended" | "unavailable";

export type CareEvaluation = Readonly<{
  activityType: CareActivityType;
  daysSinceLastActivity: number | null;
  definitionId: string | null;
  definitionVersion: string | null;
  explanation: string;
  id: string;
  plantId: string;
  status: CareEvaluationStatus;
  title: string;
}>;
