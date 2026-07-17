import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import {
  getFertilizerUsageElapsedDays,
  type FertilizerUsage,
} from "../models/fertilizer-usage";

export function FertilizerUsageLabel({
  usage,
}: Readonly<{ usage: FertilizerUsage }>) {
  const days = getFertilizerUsageElapsedDays(usage.occurredAt);
  return (
    <Typography color="textSecondary" variant="label">
      {days === 0
        ? t("journal.fertilizing.suggestion.usedToday", {
            plant: usage.plantName,
          })
        : t("journal.fertilizing.suggestion.usedDaysAgo", {
            days,
            plant: usage.plantName,
          })}
    </Typography>
  );
}
