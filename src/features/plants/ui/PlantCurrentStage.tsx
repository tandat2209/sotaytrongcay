import { BookOpen, ChevronRight, Target } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailProjection } from "../models/plant-detail-projection";

type Props = Readonly<{
  onOpenPlaybook?: () => void;
  projection: PlantDetailProjection;
}>;

export function PlantCurrentStage({ onOpenPlaybook, projection }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <View accessibilityElementsHidden style={styles.icon}>
          <Target color={colors.primary} size={20} />
        </View>
        <Typography color="primary" variant="label">
          {t("plants.guide.objective")}
        </Typography>
      </View>
      <Typography variant="body">
        {projection.stagePlaybook?.primaryObjective ||
          t("plants.guide.missing")}
      </Typography>
      {onOpenPlaybook && projection.stagePlaybook ? (
        <Pressable
          accessibilityLabel={t("plants.screen.guideAccessibility", {
            stage: projection.stageTitle,
          })}
          accessibilityRole="button"
          onPress={onOpenPlaybook}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <BookOpen color={colors.primary} size={20} />
          <Typography color="primary" style={styles.flex} variant="bodyStrong">
            {t("plants.screen.viewGuide")}
          </Typography>
          <ChevronRight color={colors.primary} size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.medium,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  flex: { flex: 1 },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  icon: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.small,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  pressed: { opacity: 0.7 },
  section: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.card,
    gap: spacing.md,
    padding: spacing.screen,
  },
});
