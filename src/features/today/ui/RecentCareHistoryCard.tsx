import { ChevronRight, History } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_VISUALS } from "@/features/journal";
import { formatDateTime, t } from "@/shared/i18n";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import type { TodayActivity } from "../models/today-projection";

type Props = {
  activities: readonly TodayActivity[];
  onOpenActivity: (id: string) => void;
  onOpenJournal: () => void;
};

export function RecentCareHistoryCard({
  activities,
  onOpenActivity,
  onOpenJournal,
}: Props) {
  const action = (
    <Pressable
      accessibilityLabel={t("today.history.viewAll")}
      accessibilityRole="button"
      onPress={onOpenJournal}
      style={({ pressed }) => [styles.journalAction, pressed && styles.pressed]}
    >
      <Typography color="primary" variant="label">
        {t("today.history.viewAll")}
      </Typography>
      <ChevronRight color={colors.primary} size={18} />
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <SectionHeader
        action={action}
        icon={History}
        title={t("today.history.title")}
      />
      {activities.length === 0 ? (
        <View style={styles.empty}>
          <Typography color="textSecondary" variant="secondary">
            {t("today.history.empty")}
          </Typography>
        </View>
      ) : (
        <View style={styles.list}>
          {activities.map((activity, index) => (
            <View key={activity.id}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <HistoryRow
                activity={activity}
                onPress={() => onOpenActivity(activity.id)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function HistoryRow({
  activity,
  onPress,
}: {
  activity: TodayActivity;
  onPress: () => void;
}) {
  const visual = CARE_ACTIVITY_VISUALS[activity.type];
  const ActivityIcon = visual.icon;
  return (
    <Pressable
      accessibilityLabel={t("today.history.openAccessibility", {
        activity: activityLabel(activity),
        time: formatOccurredAt(activity.occurredAt),
      })}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View
        accessibilityElementsHidden
        style={[
          styles.activityIcon,
          { backgroundColor: visual.backgroundColor },
        ]}
      >
        <ActivityIcon color={visual.color} size={21} />
      </View>
      <View style={styles.copy}>
        <Typography variant="bodyStrong">{activityLabel(activity)}</Typography>
        <Typography color="textSecondary" variant="secondary">
          {formatOccurredAt(activity.occurredAt)}
        </Typography>
      </View>
      <ChevronRight color={colors.textMuted} size={18} />
    </Pressable>
  );
}

function activityLabel(activity: TodayActivity): string {
  const verb =
    activity.type === "watering"
      ? t("today.history.watered")
      : activity.type === "fertilizing"
        ? t("today.history.fertilized")
        : t("today.history.sprayed");
  const target =
    activity.type === "spraying" && activity.sprayTargetNameSnapshot
      ? ` · ${activity.sprayTargetNameSnapshot}`
      : "";
  return `${verb} ${activity.plantName}${target}`;
}

function formatOccurredAt(occurredAt: string): string {
  return formatDateTime(new Date(occurredAt));
}

const styles = StyleSheet.create({
  activityIcon: {
    alignItems: "center",
    borderRadius: radius.small,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  copy: { flex: 1, gap: spacing.xs },
  divider: {
    backgroundColor: colors.divider,
    height: StyleSheet.hairlineWidth,
    marginLeft: 44 + spacing.base,
  },
  empty: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.card,
    padding: spacing.base,
  },
  journalAction: {
    alignItems: "center",
    borderRadius: radius.small,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: control.iconTarget,
    paddingHorizontal: spacing.sm,
  },
  list: {
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    paddingHorizontal: spacing.base,
  },
  pressed: { opacity: 0.7 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.base,
    minHeight: 76,
    paddingVertical: spacing.sm,
  },
  rowPressed: { opacity: 0.68 },
  section: { gap: spacing.base },
});
