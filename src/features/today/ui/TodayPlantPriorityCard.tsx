import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { PlantIdentity } from "@/features/plants";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { colors, control, spacing } from "@/shared/ui/theme";
import type { TodayCareGroup } from "../models/today-care-groups";
import type { TodayCareCard } from "../models/today-projection";
import { TodayActivityPriorityRow } from "./TodayActivityPriorityRow";

type Props = Readonly<{
  expandedIds: readonly string[];
  group: TodayCareGroup;
  onOpenPlant: (id: string) => void;
  onRecordCare: (card: TodayCareCard) => void;
  onToggle: (id: string) => void;
}>;

export function TodayPlantPriorityCard({
  expandedIds,
  group,
  onOpenPlant,
  onRecordCare,
  onToggle,
}: Props) {
  return (
    <SurfaceCard style={styles.card}>
      <Pressable
        accessibilityLabel={t("plants.list.openAccessibility", {
          plant: group.plantName,
        })}
        accessibilityRole="button"
        onPress={() => onOpenPlant(group.plantId)}
        style={({ pressed }) => [
          styles.identityButton,
          pressed && styles.pressed,
        ]}
      >
        <PlantIdentity
          imageUri={group.imageUri}
          name={group.plantName}
          size="list"
          speciesTitle={group.speciesTitle}
          stageId={group.stageId}
          stageTitle={group.stageTitle}
        />
        <ChevronRight color={colors.textSecondary} size={20} />
      </Pressable>
      <View style={styles.activities}>
        {group.cards.map((card) => (
          <TodayActivityPriorityRow
            card={card}
            expanded={expandedIds.includes(card.id)}
            key={card.id}
            onRecordCare={onRecordCare}
            onToggle={onToggle}
          />
        ))}
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  activities: { gap: 0 },
  card: { gap: spacing.base, padding: spacing.screen },
  identityButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: control.iconTarget,
  },
  pressed: { opacity: 0.7 },
});
