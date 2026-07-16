import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { getFertilizerUsageElapsedDays } from "../models/suggested-fertilizer-application";

type Usage = Readonly<{
  occurredAt: string;
  plantName: string;
}>;

export function FertilizerUsageLabel({ usage }: Readonly<{ usage: Usage }>) {
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
