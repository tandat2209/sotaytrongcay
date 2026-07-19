import { Droplets, FileText, Gauge, Target } from "lucide-react-native";
import { formatNumber, t } from "@/shared/i18n";
import type { CareActivity } from "../models/care-activity";
import { getCareActivityUnitLabel } from "./care-activity-copy";
import { JournalDetailRow, JournalDetailSection } from "./JournalDetailSection";

type Props = Readonly<{
  activity: CareActivity;
  intensity: string | null;
}>;

export function ActivityDetailInformation({ activity, intensity }: Props) {
  return (
    <JournalDetailSection title={t("journal.activityDetail.details")}>
      {activity.type === "watering" ? (
        <>
          <JournalDetailRow
            icon={Gauge}
            label={t("journal.activityDetail.intensity")}
            value={intensity ?? ""}
          />
          {activity.estimatedAmountLiters !== null ? (
            <JournalDetailRow
              icon={Droplets}
              label={t("journal.activityDetail.amount")}
              value={`${formatNumber(activity.estimatedAmountLiters)} ${getCareActivityUnitLabel("liter")}`}
            />
          ) : null}
        </>
      ) : null}
      {activity.type === "spraying" && activity.sprayTargetNameSnapshot ? (
        <JournalDetailRow
          icon={Target}
          label={t("journal.activityDetail.sprayTarget")}
          value={activity.sprayTargetNameSnapshot}
        />
      ) : null}
      <JournalDetailRow
        icon={FileText}
        last
        label={t("journal.activityDetail.notes")}
        value={activity.notes ?? t("journal.activityDetail.noNotes")}
      />
    </JournalDetailSection>
  );
}
