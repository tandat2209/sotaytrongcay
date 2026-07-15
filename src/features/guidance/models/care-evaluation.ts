import type { CareActivityType } from "@/features/journal";

export type CareEvaluationStatus =
  "recommended" | "not_recommended" | "unavailable";

export type CareEvaluationReason =
  | Readonly<{ kind: "authored_goal"; goal: string }>
  | Readonly<{
      activityType: CareActivityType;
      daysSinceLastActivity: number;
      goal: string;
      kind: "elapsed_history";
    }>
  | Readonly<{
      activityType: CareActivityType;
      daysSinceLastActivity: number;
      kind: "recent_history";
    }>
  | Readonly<{ kind: "missing_history" }>
  | Readonly<{ kind: "invalid_history" }>;

export type CareEvaluation = Readonly<{
  activityType: CareActivityType;
  daysSinceLastActivity: number | null;
  definitionId: string | null;
  definitionVersion: string | null;
  id: string;
  plantId: string;
  reason: CareEvaluationReason;
  status: CareEvaluationStatus;
  title: string;
}>;
