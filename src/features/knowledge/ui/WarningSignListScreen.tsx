import { AlertTriangle, ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import type { WarningSign } from "../preview-knowledge";

type Props = Readonly<{
  onBack: () => void;
  onOpenSign: (id: string) => void;
  signs: readonly WarningSign[];
}>;

export function WarningSignListScreen({ onBack, onOpenSign, signs }: Props) {
  return (
    <Screen introduction={null} title="">
      <TopBar
        onBack={onBack}
        title={t("warningSigns.library.title")}
        titleIcon={AlertTriangle}
      />
      <Typography color="textSecondary" variant="bodyLarge">
        {t("warningSigns.library.introduction")}
      </Typography>
      <View style={styles.list}>
        {signs.map((sign) => (
          <Pressable
            accessibilityLabel={t("warningSigns.openAccessibility", {
              title: sign.title,
            })}
            accessibilityRole="button"
            key={sign.id}
            onPress={() => onOpenSign(sign.id)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <SurfaceCard style={styles.card}>
              <View style={styles.copy}>
                <Typography variant="cardTitle">{sign.title}</Typography>
                <Typography color="textSecondary" variant="bodyMedium">
                  {sign.summary}
                </Typography>
              </View>
              <ChevronRight color={colors.textMuted} size={20} />
            </SurfaceCard>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.base,
    minHeight: 88,
  },
  copy: { flex: 1, gap: spacing.xs },
  list: { gap: spacing.md },
  pressed: { opacity: 0.72 },
});
