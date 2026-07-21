import { Pencil } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import {
  getCareActivityLabel,
  getCareActivityOriginLabel,
  getWateringIntensityLabel,
} from "./care-activity-copy";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import { type CareActivity } from "../models/care-activity";
import type { FertilizerApplication } from "../models/fertilizer-application";
import { FertilizerApplicationDetailsList } from "./FertilizerApplicationDetailsList";
import { ActivityDetailMenu } from "./ActivityDetailMenu";
import { ActivityDetailInformation } from "./ActivityDetailInformation";
import { JournalDetailHero } from "./JournalDetailHero";
import { JournalDetailPlantCard } from "./JournalDetailPlantCard";

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
        <Typography variant="screenTitle">
          {t("journal.activityDetail.pageTitle")}
        </Typography>
      )}
      <JournalDetailHero
        accentColor={visual.color}
        backgroundColor={visual.backgroundColor}
        badge={getCareActivityOriginLabel(activity.origin)}
        icon={visual.icon}
        occurredAt={activity.occurredAt}
        title={getCareActivityLabel(activity.type)}
      />
      <JournalDetailPlantCard
        imageUri={imageUri ?? null}
        name={plantName}
        speciesTitle={speciesTitle}
        stageId={stageId}
        stageTitle={stageTitle}
        testID="activity-detail-plant-identity"
      />
      <FertilizerApplicationDetailsList applications={fertilizerApplications} />
      <ActivityDetailInformation activity={activity} intensity={intensity} />
      <Pressable
        accessibilityLabel={t("common.actions.edit")}
        accessibilityRole="button"
        onPress={onEdit}
        style={({ pressed }) => [
          styles.editButton,
          pressed ? styles.editButtonPressed : null,
        ]}
      >
        <Pencil color={colors.primary} size={20} />
        <Typography color="primary" variant="bodyStrong">
          {t("common.actions.edit")}
        </Typography>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  editButton: {
    alignItems: "center",
    borderColor: colors.primary,
    borderRadius: radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.base,
  },
  editButtonPressed: { backgroundColor: colors.primarySoft },
});
