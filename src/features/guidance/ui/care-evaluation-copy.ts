import { getCareActivityLabel } from "@/features/journal";
import { t } from "@/shared/i18n";
import type { CareEvaluationReason } from "../models/care-evaluation";

export function formatCareEvaluationReason(
  reason: CareEvaluationReason,
): string {
  switch (reason.kind) {
    case "authored_goal":
      return reason.goal;
    case "elapsed_history":
      return t("guidance.reason.elapsedHistory", {
        days: reason.daysSinceLastActivity,
        goal: reason.goal,
      });
    case "invalid_history":
      return t("guidance.reason.invalidHistory");
    case "missing_history":
      return t("guidance.reason.missingHistory");
    case "recent_history":
      return t("guidance.reason.recentHistory", {
        activity: getCareActivityLabel(reason.activityType).toLocaleLowerCase(),
        days: reason.daysSinceLastActivity,
      });
  }
}
