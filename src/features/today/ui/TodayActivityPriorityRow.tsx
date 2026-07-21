import { ChevronDown, ChevronUp, CircleHelp } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import {
  CARE_ACTIVITY_VISUALS,
  getCareActivityLabel,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import type { TodayCareCard } from "../models/today-projection";

type Props = Readonly<{
  card: TodayCareCard;
  expanded: boolean;
  onRecordCare: (card: TodayCareCard) => void;
  onToggle: (id: string) => void;
}>;

export function TodayActivityPriorityRow({
  card,
  expanded,
  onRecordCare,
  onToggle,
}: Props) {
  const visual = CARE_ACTIVITY_VISUALS[card.activityType];
  const ActivityIcon = visual.icon;

  return (
    <View style={styles.container}>
      {card.dueStatus ? (
        <View style={styles.metaRow}>
          <View
            style={[
              styles.statusPill,
              card.dueStatus === "overdue"
                ? styles.overduePill
                : styles.duePill,
            ]}
          >
            <Typography
              color={card.dueStatus === "overdue" ? "danger" : "primary"}
              variant="label"
            >
              {card.dueStatus === "overdue"
                ? t("today.priority.overdue")
                : t("today.priority.due")}
            </Typography>
          </View>
          <Typography color="textMuted" variant="secondary">
            {t("today.priority.plan")}
          </Typography>
        </View>
      ) : null}
      <Pressable
        accessibilityLabel={t("today.priority.explanationAccessibility", {
          action: expanded
            ? t("today.priority.collapse")
            : t("today.priority.expand"),
          plant: card.plantName,
          title: card.title,
        })}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => onToggle(card.id)}
        style={({ pressed }) => [styles.titleRow, pressed && styles.pressed]}
      >
        <View
          accessibilityElementsHidden
          style={[
            styles.activityIcon,
            { backgroundColor: visual.backgroundColor },
          ]}
        >
          <ActivityIcon color={visual.color} size={20} />
        </View>
        <Typography style={styles.fill} variant="bodyStrong">
          {card.title}
        </Typography>
        {expanded ? (
          <ChevronUp color={colors.textSecondary} size={20} />
        ) : (
          <ChevronDown color={colors.textSecondary} size={20} />
        )}
      </Pressable>
      {expanded ? (
        <View style={styles.explanation}>
          <CircleHelp color={colors.primary} size={18} />
          <View style={styles.explanationCopy}>
            <Typography color="primary" variant="label">
              {t("today.priority.why")}
            </Typography>
            <Typography color="textSecondary" variant="secondary">
              {card.explanation}
            </Typography>
          </View>
        </View>
      ) : null}
      <Pressable
        accessibilityLabel={t("today.priority.recordAccessibility", {
          action: getCareActivityLabel(card.activityType),
          plant: card.plantName,
        })}
        accessibilityRole="button"
        onPress={() => onRecordCare(card)}
        style={({ pressed }) => [
          styles.careAction,
          { backgroundColor: visual.backgroundColor },
          pressed && styles.pressed,
        ]}
      >
        <ActivityIcon color={visual.color} size={20} />
        <Typography
          style={[styles.careActionLabel, { color: visual.color }]}
          variant="bodyStrong"
        >
          {getCareActivityLabel(card.activityType)}
        </Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  activityIcon: {
    alignItems: "center",
    borderRadius: radius.small,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  careAction: {
    alignItems: "center",
    borderRadius: radius.medium,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: control.primaryHeight,
    paddingHorizontal: spacing.base,
  },
  careActionLabel: { flexShrink: 1 },
  container: {
    borderTopColor: colors.divider,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    paddingTop: spacing.base,
  },
  duePill: { backgroundColor: colors.primarySoft },
  explanation: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.small,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  explanationCopy: { flex: 1, gap: spacing.xs },
  fill: { flex: 1 },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  overduePill: { backgroundColor: colors.dangerSoft },
  pressed: { opacity: 0.72 },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: control.iconTarget,
  },
});
