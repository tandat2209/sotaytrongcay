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
import type { FertilizerApplication } from "../models/fertilizer-application";
import { FertilizerApplicationDetailsList } from "./FertilizerApplicationDetailsList";
import { ActivityDetailMenu } from "./ActivityDetailMenu";

type Props = {
  activity: CareActivity;
  fertilizerApplications?: readonly FertilizerApplication[];
  imageUri?: string | null;
  onBack?: () => void;
  onDelete: () => void;
  onEdit: () => void;
  plantName: string;
  speciesTitle: string;
  stageId: string;
  stageTitle: string;
};

export function ActivityDetailScreen({
  activity,
  fertilizerApplications = [],
  imageUri,
  onBack,
  onDelete,
  onEdit,
  plantName,
  speciesTitle,
  stageId,
  stageTitle,
}: Props) {
  const visual = CARE_ACTIVITY_VISUALS[activity.type];
  const ActivityIcon = visual.icon;
  const intensity =
    activity.type === "watering"
      ? activity.intensity
        ? getWateringIntensityLabel(activity.intensity)
        : t("journal.activityDetail.legacyIntensity")
      : null;
  return (
    <Screen title="">
      {onBack ? (
        <TopBar
          action={<ActivityDetailMenu onDelete={onDelete} onEdit={onEdit} />}
          backAccessibilityLabel={t("common.actions.backToJournal")}
          onBack={onBack}
          title={t("journal.activityDetail.pageTitle")}
        />
      ) : (
        <Typography variant="headlineLarge">
          {t("journal.activityDetail.pageTitle")}
        </Typography>
      )}
      <PlantIdentity
        imageUri={imageUri ?? null}
        name={plantName}
        size="list"
        speciesTitle={speciesTitle}
        stageId={stageId}
        stageTitle={stageTitle}
        style={styles.plantIdentity}
        testID="activity-detail-plant-identity"
      />
      <View style={styles.summary}>
        <View
          style={[styles.icon, { backgroundColor: visual.backgroundColor }]}
        >
          <ActivityIcon color={visual.color} size={32} />
        </View>
        <View style={styles.summaryCopy}>
          <Typography variant="headlineMedium">
            {getCareActivityLabel(activity.type)}
          </Typography>
          {intensity ? (
            <Typography color="textSecondary" variant="bodyLarge">
              {`${intensity} · ${getCareActivityOriginLabel(activity.origin)}`}
            </Typography>
          ) : (
            <Typography color="textSecondary" variant="bodyLarge">
              {getCareActivityOriginLabel(activity.origin)}
            </Typography>
          )}
          <Typography color="textSecondary" variant="bodyMedium">
            {formatDateTime(new Date(activity.occurredAt))}
          </Typography>
        </View>
      </View>
      <FertilizerApplicationDetailsList applications={fertilizerApplications} />
      <SurfaceCard style={styles.card}>
        <Typography variant="headlineSmall">
          {t("journal.activityDetail.details")}
        </Typography>
        <Detail
          label={t("journal.activityDetail.origin")}
          value={getCareActivityOriginLabel(activity.origin)}
        />
        {activity.type === "watering" ? (
          <>
            <Detail
              label={t("journal.activityDetail.intensity")}
              value={intensity ?? ""}
            />
            {activity.estimatedAmountLiters !== null ? (
              <Detail
                label={t("journal.activityDetail.amount")}
                value={`${formatNumber(activity.estimatedAmountLiters)} ${getCareActivityUnitLabel("liter")}`}
              />
            ) : null}
          </>
        ) : null}
        {activity.type === "spraying" && activity.sprayTargetNameSnapshot ? (
          <Detail
            label={t("journal.activityDetail.sprayTarget")}
            value={activity.sprayTargetNameSnapshot}
          />
        ) : null}
      </SurfaceCard>
      <SurfaceCard style={styles.card}>
        <Typography variant="headlineSmall">
          {t("journal.activityDetail.notes")}
        </Typography>
        <Typography
          color={activity.notes ? "text" : "textSecondary"}
          variant="bodyLarge"
        >
          {activity.notes ?? t("journal.activityDetail.noNotes")}
        </Typography>
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
      <Typography style={styles.value} variant="bodyLarge">
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  plantIdentity: { flex: 0 },
  row: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md },
  summary: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  summaryCopy: { flex: 1, gap: spacing.xs },
  value: { flex: 1, textAlign: "right" },
});
