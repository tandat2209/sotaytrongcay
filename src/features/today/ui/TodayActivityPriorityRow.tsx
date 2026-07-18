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
        <Typography color="textSecondary" variant="bodyMedium">
          {card.dueStatus === "overdue"
            ? t("today.priority.overdue")
            : t("today.priority.due")}{" "}
          · {t("today.priority.plan")}
        </Typography>
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
        style={styles.titleRow}
      >
        <ActivityIcon color={visual.color} size={18} />
        <Typography style={styles.fill} variant="bodyMedium">
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
          <CircleHelp color={colors.textSecondary} size={16} />
          <Typography style={styles.fill} variant="bodyMedium">
            <Typography style={styles.bold} variant="bodyMedium">
              {t("today.priority.why")}
            </Typography>
            {card.explanation}
          </Typography>
        </View>
      ) : null}
      <Pressable
        accessibilityLabel={t("today.priority.explanationAccessibility", {
          action: getCareActivityLabel(card.activityType),
          plant: card.plantName,
          title: card.title,
        })}
        accessibilityRole="button"
        onPress={() => onRecordCare(card)}
        style={[styles.careAction, { backgroundColor: visual.backgroundColor }]}
      >
        <ActivityIcon color={visual.color} size={20} />
        <Typography
          style={[styles.careActionLabel, { color: visual.color }]}
          variant="bodyMedium"
        >
          {getCareActivityLabel(card.activityType)}
        </Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: "600" },
  careAction: {
    alignItems: "center",
    borderRadius: radius.control,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: control.primaryHeight,
    paddingHorizontal: spacing.md,
  },
  careActionLabel: { fontWeight: "600" },
  container: {
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  explanation: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.chip,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.sm,
  },
  fill: { flex: 1 },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: control.iconTarget,
  },
});
