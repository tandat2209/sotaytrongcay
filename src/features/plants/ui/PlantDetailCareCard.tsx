import { CalendarDays, ChevronRight, Info } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import {
  CARE_ACTIVITY_VISUALS,
  getCareActivityLabel,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailCareCard as CareCardModel } from "../models/plant-detail-projection";
import {
  formatRelativeActivity,
  getCareStatusVisual,
} from "./plant-detail-care-presentation";

type Props = Readonly<{
  card: CareCardModel;
  onOpenActivity: (id: string) => void;
  onOpenDetails: (card: CareCardModel) => void;
  onStartCare: () => void;
}>;

export function PlantDetailCareCard({
  card,
  onOpenActivity,
  onOpenDetails,
  onStartCare,
}: Props) {
  const label = getCareActivityLabel(card.activityType);
  const visual = CARE_ACTIVITY_VISUALS[card.activityType];
  const status = getCareStatusVisual(card.evaluation?.status, visual);
  const ActivityIcon = visual.icon;
  const StatusIcon = status.icon;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={t("plants.care.recordAccessibility", {
            activity: label.toLowerCase(),
          })}
          accessibilityRole="button"
          onPress={onStartCare}
          style={({ pressed }) => [
            styles.entryAction,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.title}>
            <View
              accessibilityElementsHidden
              style={[styles.icon, { backgroundColor: visual.backgroundColor }]}
            >
              <ActivityIcon color={visual.color} size={22} />
            </View>
            <View style={styles.titleCopy}>
              <Typography variant="cardTitle">{label}</Typography>
              {card.title !== label ? (
                <Typography color="textSecondary" variant="secondary">
                  {card.title}
                </Typography>
              ) : null}
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </View>
          <View style={styles.frequency}>
            <CalendarDays color={colors.textSecondary} size={17} />
            <Typography
              color="textSecondary"
              style={styles.flex}
              variant="secondary"
            >
              {card.frequencyDisplay ?? t("plants.care.frequencyMissing")}
            </Typography>
          </View>
        </Pressable>
        {card.details ? (
          <Pressable
            accessibilityLabel={t("plants.care.recommendationAccessibility", {
              activity: label.toLowerCase(),
            })}
            accessibilityRole="button"
            onPress={() => onOpenDetails(card)}
            style={({ pressed }) => [
              styles.infoAction,
              pressed && styles.pressed,
            ]}
          >
            <Info color={colors.primary} size={18} />
            <Typography color="primary" variant="label">
              {t("plants.care.viewGuide")}
            </Typography>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.information}>
        <Pressable
          accessibilityLabel={
            card.lastActivity
              ? t("plants.care.latestAccessibility", {
                  activity: label.toLowerCase(),
                })
              : undefined
          }
          accessibilityRole={card.lastActivity ? "button" : undefined}
          disabled={!card.lastActivity}
          onPress={() =>
            card.lastActivity && onOpenActivity(card.lastActivity.id)
          }
          style={({ pressed }) => [styles.latest, pressed && styles.pressed]}
        >
          <Typography
            color={card.lastActivity ? "text" : "textSecondary"}
            variant="bodyStrong"
          >
            {card.lastActivity
              ? formatRelativeActivity(card.lastActivity.occurredAt)
              : t("plants.care.noData")}
          </Typography>
        </Pressable>
        <View
          style={[styles.status, { backgroundColor: status.backgroundColor }]}
        >
          <StatusIcon color={status.color} size={16} />
          <Typography style={{ color: status.color }} variant="label">
            {status.label}
          </Typography>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    gap: spacing.base,
    padding: spacing.lg,
  },
  entryAction: { flex: 1, gap: spacing.md, minWidth: 200 },
  flex: { flex: 1 },
  frequency: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  icon: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  infoAction: {
    alignItems: "center",
    borderRadius: radius.small,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: control.iconTarget,
    paddingHorizontal: spacing.sm,
  },
  information: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.medium,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.md,
  },
  latest: {
    flexGrow: 1,
    minHeight: control.iconTarget,
    justifyContent: "center",
  },
  pressed: { opacity: 0.68 },
  status: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minWidth: 160,
  },
  titleCopy: { flex: 1, gap: spacing.xs, minWidth: 0 },
});
