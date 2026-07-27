import { AlertTriangle, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import type { WarningSign } from "@/features/knowledge";
import { t } from "@/shared/i18n";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

export function StageWarningSignSection({
  onOpenSign,
  signs,
}: {
  onOpenSign?: (id: string) => void;
  signs: readonly WarningSign[];
}) {
  if (signs.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <AlertTriangle color={colors.secondary} size={20} />
        <Typography variant="headlineSmall">
          {t("plants.guide.warningSigns")}
        </Typography>
      </View>
      {signs.map((sign) => (
        <SurfaceCard key={sign.id} style={styles.card}>
          <Typography variant="cardTitle">{sign.title}</Typography>
          <Typography color="textSecondary" variant="bodyMedium">
            {sign.summary}
          </Typography>
          {onOpenSign ? (
            <Pressable
              accessibilityLabel={t("warningSigns.openAccessibility", {
                title: sign.title,
              })}
              accessibilityRole="link"
              onPress={() => onOpenSign(sign.id)}
              style={({ pressed }) => [styles.link, pressed && styles.pressed]}
            >
              <Typography color="primary" variant="label">
                {t("plants.guide.warningSignAction")}
              </Typography>
              <ChevronRight color={colors.primary} size={18} />
            </Pressable>
          ) : null}
        </SurfaceCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  link: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    minHeight: 44,
  },
  pressed: { opacity: 0.72 },
  section: { gap: spacing.base },
});
