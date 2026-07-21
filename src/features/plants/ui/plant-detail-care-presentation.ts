import type { CareEvaluationStatus } from "@/features/guidance/models/care-evaluation";
import type { CareActivityVisual } from "@/features/journal";
import { CheckCircle, CircleHelp } from "lucide-react-native";

import { t } from "@/shared/i18n";
import { colors } from "@/shared/ui/theme";

export function getCareStatusVisual(
  status: CareEvaluationStatus | undefined,
  visual: CareActivityVisual,
) {
  if (status === "recommended")
    return {
      backgroundColor: visual.backgroundColor,
      color: visual.color,
      icon: visual.icon,
      label: t("plants.care.status.recommended"),
    };
  if (status === "not_recommended")
    return {
      backgroundColor: colors.primarySoft,
      color: colors.primary,
      icon: CheckCircle,
      label: t("plants.care.status.notRecommended"),
    };
  return {
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    icon: CircleHelp,
    label: t("plants.care.status.none"),
  };
}

export function formatRelativeActivity(occurredAt: string): string {
  const elapsedDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(occurredAt).getTime()) / 86_400_000),
  );
  if (elapsedDays === 0) return t("plants.care.today");
  return t("plants.care.relativeDays", { days: elapsedDays });
}
