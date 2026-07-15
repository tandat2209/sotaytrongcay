import { ChevronDown, ChevronUp, CircleHelp, Leaf } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  CARE_ACTIVITY_VISUALS,
  getCareActivityLabel,
} from "@/features/journal";
import { PlantIdentity } from "@/features/plants";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, control, radius, spacing } from "@/shared/ui/theme";
import type { TodayCareCard } from "../models/today-projection";

type Props = Readonly<{
  cards: readonly TodayCareCard[];
  onRecordCare: (card: TodayCareCard) => void;
}>;

export function TodayPriorityList({ cards, onRecordCare }: Props) {
  const [expandedIds, setExpandedIds] = useState<readonly string[]>([]);
  if (cards.length === 0)
    return (
      <SurfaceCard style={styles.emptyCard}>
        <View accessibilityElementsHidden style={styles.plantIcon}>
          <Leaf color={colors.primary} size={22} />
        </View>
        <Typography
          color="textSecondary"
          style={styles.fill}
          variant="bodyMedium"
        >
          {t("today.priority.empty")}
        </Typography>
      </SurfaceCard>
    );

  return cards.map((card) => {
    const expanded = expandedIds.includes(card.id);
    const visual = CARE_ACTIVITY_VISUALS[card.activityType];
    const ActivityIcon = visual.icon;
    return (
      <SurfaceCard key={card.id} style={styles.card}>
        <PlantIdentity
          imageUri={card.imageUri}
          name={card.plantName}
          size="list"
          speciesTitle={card.speciesTitle}
          stageId={card.stageId}
          stageTitle={card.stageTitle}
        />
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
          onPress={() =>
            setExpandedIds((ids) =>
              ids.includes(card.id)
                ? ids.filter((id) => id !== card.id)
                : [...ids, card.id],
            )
          }
          style={styles.actionRow}
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
          <View style={styles.expandedContent}>
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
          style={[
            styles.careAction,
            { backgroundColor: visual.backgroundColor },
          ]}
        >
          <ActivityIcon color={visual.color} size={20} />
          <Typography
            style={[styles.careActionLabel, { color: visual.color }]}
            variant="bodyMedium"
          >
            {getCareActivityLabel(card.activityType)}
          </Typography>
        </Pressable>
      </SurfaceCard>
    );
  });
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: control.iconTarget,
    paddingTop: spacing.sm,
  },
  bold: { fontWeight: "600" },
  card: { gap: spacing.sm },
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
  emptyCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 72,
  },
  expandedContent: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.chip,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.sm,
  },
  fill: { flex: 1 },
  plantIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.control,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
});
