import { Camera, NotebookPen } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { formatTime, t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { CARE_ACTIVITY_VISUALS } from "../models/care-activity-icon";
import { getOccurrencePeriod } from "../models/occurred-at";
import type { JournalItem } from "../models/journal-item";
import {
  getCareActivityLabel,
  getCareActivityOriginLabel,
  getOccurrencePeriodLabel,
  getWateringIntensityLabel,
} from "./care-activity-copy";

export type JournalPlantSummary = Readonly<{
  name: string;
  speciesId: string;
  stageTitle: string;
}>;

type Props = Readonly<{
  fertilizerNames: readonly string[];
  item: JournalItem;
  onOpenActivity: (id: string) => void;
  onOpenUpdate: (id: string) => void;
  plant?: JournalPlantSummary;
  plantName?: string;
}>;

export function JournalEntryRow({
  fertilizerNames,
  item,
  onOpenActivity,
  onOpenUpdate,
  plant,
  plantName,
}: Props) {
  const name = plant?.name ?? plantName ?? t("common.fallback.plant");
  if (item.kind === "care") {
    const { record } = item;
    const visual = CARE_ACTIVITY_VISUALS[record.type];
    const ActivityIcon = visual.icon;
    const detail = getCareDetail(item, fertilizerNames);

    return (
      <Pressable
        accessibilityLabel={`${getCareActivityLabel(record.type)} · ${name}`}
        accessibilityRole="button"
        onPress={() => onOpenActivity(item.id)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View
          accessibilityElementsHidden
          style={[styles.icon, { backgroundColor: visual.backgroundColor }]}
        >
          <ActivityIcon color={visual.color} size={22} />
        </View>
        <View style={styles.content}>
          <View style={styles.heading}>
            <Typography style={styles.title} variant="cardTitle">
              {getCareActivityLabel(record.type)}
            </Typography>
            <Typography color="textMuted" variant="secondary">
              {getOccurrencePeriodLabel(
                getOccurrencePeriod(new Date(item.occurredAt)),
              )}
            </Typography>
          </View>
          <JournalPlantContext name={name} stageTitle={plant?.stageTitle} />
          {detail ? (
            <Typography color="textSecondary" numberOfLines={2} variant="body">
              {detail}
            </Typography>
          ) : null}
          {record.notes ? (
            <Typography
              color="textSecondary"
              numberOfLines={2}
              variant="secondary"
            >
              {record.notes}
            </Typography>
          ) : null}
          <Typography color="textMuted" variant="label">
            {getCareActivityOriginLabel(record.origin)}
          </Typography>
        </View>
      </Pressable>
    );
  }

  const { record } = item;
  const photoUri = record.photos
    .slice()
    .sort((left, right) => left.position - right.position)[0]?.localUri;
  const stageTitle = plant
    ? (getPreviewPlantKnowledge(plant.speciesId)?.stages.find(
        (stage) => stage.id === record.stageId,
      )?.title ?? t("common.fallback.unknown"))
    : undefined;
  const summary =
    record.notes ??
    t("journal.list.photoSummary", { count: record.photos.length });
  const time = formatTime(new Date(item.occurredAt));

  return (
    <Pressable
      accessibilityLabel={`${t("journal.filter.update")} · ${name}`}
      accessibilityRole="button"
      onPress={() => onOpenUpdate(item.id)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View
        accessibilityElementsHidden
        style={[styles.icon, styles.updateIcon]}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.iconPhoto} />
        ) : (
          <NotebookPen color={colors.activityObservation} size={22} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Typography style={styles.title} variant="cardTitle">
            {t("journal.update.recordTitle")}
          </Typography>
          <Typography color="textMuted" variant="secondary">
            {time}
          </Typography>
        </View>
        <JournalPlantContext name={name} stageTitle={stageTitle} />
        <Typography color="textSecondary" numberOfLines={3} variant="body">
          {summary}
        </Typography>
        {photoUri ? (
          <View style={styles.photoMeta}>
            <Camera color={colors.activityObservation} size={15} />
            <Typography color="activityObservation" variant="label">
              {t("journal.update.photoCount", { count: record.photos.length })}
            </Typography>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function JournalPlantContext({
  name,
  stageTitle,
}: Readonly<{ name: string; stageTitle: string | undefined }>) {
  return (
    <View style={styles.plantContext}>
      <Typography color="primary" variant="bodyStrong">
        {name}
      </Typography>
      {stageTitle ? (
        <View style={styles.stagePill}>
          <Typography color="textSecondary" variant="label">
            {stageTitle}
          </Typography>
        </View>
      ) : null}
    </View>
  );
}

function getCareDetail(
  item: Extract<JournalItem, { kind: "care" }>,
  names: readonly string[],
) {
  const { record } = item;
  if (record.type === "watering" && record.intensity)
    return getWateringIntensityLabel(record.intensity);
  if (record.type === "fertilizing" && names.length > 0)
    return names.join(" · ");
  if (record.type === "spraying") return record.sprayTargetNameSnapshot;
  return null;
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: spacing.xs, minWidth: 0 },
  heading: { alignItems: "flex-start", flexDirection: "row", gap: spacing.sm },
  icon: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 48,
    justifyContent: "center",
    overflow: "hidden",
    width: 48,
  },
  iconPhoto: { height: "100%", width: "100%" },
  photoMeta: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  plantContext: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  pressed: { opacity: 0.65 },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 88,
    paddingVertical: spacing.base,
  },
  stagePill: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  title: { flex: 1 },
  updateIcon: { backgroundColor: colors.activityObservationSoft },
});
