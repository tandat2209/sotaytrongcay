import { BookOpen, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantDetailProjection } from "../models/plant-detail-projection";

type Props = Readonly<{
  onOpenPlaybook?: () => void;
  projection: PlantDetailProjection;
}>;

export function PlantCurrentStage({ onOpenPlaybook, projection }: Props) {
  return (
    <SurfaceCard style={styles.card}>
      <Typography color="secondary" variant="label">
        {t("plants.guide.objective")}
      </Typography>
      <Typography color="textSecondary" variant="bodyLarge">
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
          style={({ pressed }) => [
            styles.action,
            pressed && styles.actionPressed,
          ]}
        >
          <BookOpen color={colors.primary} size={20} />
          <Typography color="primary" style={styles.flex} variant="bodyLarge">
            {t("plants.screen.viewGuide")}
          </Typography>
          <ChevronRight color={colors.primary} size={18} />
        </Pressable>
      ) : null}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderRadius: radius.control,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  actionPressed: { backgroundColor: colors.primarySoft },
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderLeftColor: colors.primary,
    borderLeftWidth: 3,
    gap: spacing.sm,
    padding: spacing.md,
  },
  flex: { flex: 1 },
});
