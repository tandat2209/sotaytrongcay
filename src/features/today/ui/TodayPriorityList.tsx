import { Leaf } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { groupTodayCareCards } from "../models/today-care-groups";
import type { TodayCareCard } from "../models/today-projection";
import { TodayPlantPriorityCard } from "./TodayPlantPriorityCard";

type Props = Readonly<{
  cards: readonly TodayCareCard[];
  onOpenPlant: (id: string) => void;
  onRecordCare: (card: TodayCareCard) => void;
}>;

export function TodayPriorityList({ cards, onOpenPlant, onRecordCare }: Props) {
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

  const groups = groupTodayCareCards(cards);
  const toggleExpanded = (id: string) =>
    setExpandedIds((ids) =>
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
    );

  return groups.map((group) => (
    <TodayPlantPriorityCard
      expandedIds={expandedIds}
      group={group}
      key={group.plantId}
      onOpenPlant={onOpenPlant}
      onRecordCare={onRecordCare}
      onToggle={toggleExpanded}
    />
  ));
}

const styles = StyleSheet.create({
  emptyCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 72,
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
