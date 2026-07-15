import { StyleSheet, View } from "react-native";
import {
  getCareActivityLabel,
  getCareActivityOriginLabel,
  getCareActivityUnitLabel,
  getWateringIntensityLabel,
} from "@/features/journal";
import { formatDateTime, formatNumber, t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import { PlantIdentity } from "@/features/plants/ui/PlantIdentity";
import { type CareActivity } from "../models/care-activity";

type Props = {
  activity: CareActivity;
  imageUri?: string | null;
  onBack?: () => void;
  plantName: string;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
};

export function ActivityDetailScreen({
  activity,
  imageUri,
  onBack,
  plantName,
  speciesTitle,
  stageId,
  stageTitle,
}: Props) {
  const title = t("journal.activityDetail.title", {
    activity: getCareActivityLabel(activity.type).toLowerCase(),
  });
  const visual = CARE_ACTIVITY_VISUALS[activity.type];
  const ActivityIcon = visual.icon;
  return (
    <Screen title="">
      {onBack ? (
        <TopBar
          backAccessibilityLabel={t("common.actions.backToJournal")}
          onBack={onBack}
          title={title}
          titleIcon={visual.icon}
        />
      ) : (
        <Typography variant="headlineLarge">{title}</Typography>
      )}
      <PlantIdentity
        imageUri={imageUri ?? null}
        name={plantName}
        size="list"
        speciesTitle={speciesTitle}
        stageId={stageId}
        stageTitle={stageTitle}
      />
      <SurfaceCard style={styles.summary}>
        <View
          style={[styles.icon, { backgroundColor: visual.backgroundColor }]}
        >
          <ActivityIcon color={visual.color} size={22} />
        </View>
        <View style={styles.copy}>
          <Typography variant="headlineSmall">
            {getCareActivityLabel(activity.type)}
          </Typography>
          <Typography color="textSecondary" variant="bodyMedium">
            {formatDateTime(new Date(activity.occurredAt))}
          </Typography>
        </View>
      </SurfaceCard>
      <SurfaceCard style={styles.card}>
        <Detail
          label={t("journal.activityDetail.origin")}
          value={getCareActivityOriginLabel(activity.origin)}
        />
        {activity.type === "watering" ? (
          <>
            <Detail
              label={t("journal.activityDetail.intensity")}
              value={
                activity.intensity
                  ? getWateringIntensityLabel(activity.intensity)
                  : t("journal.activityDetail.legacyIntensity")
              }
            />
            {activity.estimatedAmountLiters !== null ? (
              <Detail
                label={t("journal.activityDetail.amount")}
                value={`${formatNumber(activity.estimatedAmountLiters)} ${getCareActivityUnitLabel("liter")}`}
              />
            ) : null}
          </>
        ) : null}
        {activity.notes ? (
          <Detail
            label={t("journal.activityDetail.notes")}
            value={activity.notes}
          />
        ) : null}
      </SurfaceCard>
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Typography color="textSecondary" variant="label">
        {label}
      </Typography>
      <Typography variant="bodyLarge">{value}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  row: { gap: spacing.xs },
  summary: { alignItems: "center", flexDirection: "row", gap: spacing.md },
});
