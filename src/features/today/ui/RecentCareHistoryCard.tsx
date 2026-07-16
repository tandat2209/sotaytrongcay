import { Pressable, StyleSheet, View } from "react-native";

import { CARE_ACTIVITY_VISUALS } from "@/features/journal";
import { formatDateTime, t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, spacing } from "@/shared/ui/theme";
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
  return (
    <SurfaceCard style={styles.card}>
      <Typography variant="headlineSmall">
        {t("today.history.title")}
      </Typography>
      {activities.length === 0 ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("today.history.empty")}
        </Typography>
      ) : (
        <View>
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
      <Pressable
        accessibilityLabel={t("today.history.viewAll")}
        accessibilityRole="button"
        onPress={onOpenJournal}
        style={styles.journalAction}
      >
        <Typography color="primary" variant="bodyMedium">
          {t("today.history.viewAll")}
        </Typography>
      </Pressable>
    </SurfaceCard>
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
      style={styles.row}
    >
      <ActivityIcon color={visual.color} size={22} />
      <View style={styles.copy}>
        <Typography variant="bodyLarge">{activityLabel(activity)}</Typography>
        <Typography color="textSecondary" variant="bodyMedium">
          {formatOccurredAt(activity.occurredAt)}
        </Typography>
      </View>
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
  card: { gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  divider: { backgroundColor: colors.border, height: StyleSheet.hairlineWidth },
  journalAction: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    minHeight: control.iconTarget,
    paddingTop: spacing.sm,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 64,
    paddingVertical: spacing.sm,
  },
});
