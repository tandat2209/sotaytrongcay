import { Sprout } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import type { FertilizerGroupGuidance } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export function FertilizerGroupGuidanceList({
  guidance,
  toneColor,
}: Readonly<{
  guidance: readonly FertilizerGroupGuidance[];
  toneColor: string;
}>) {
  return guidance.map((item) => (
    <View key={item.group} style={styles.guidanceRow}>
      <Sprout color={toneColor} size={18} />
      <View style={styles.guidanceCopy}>
        <Typography variant="bodyLarge">
          {t(`fertilizers.group.${item.group}`)}
        </Typography>
        <Typography color="textSecondary" variant="bodyMedium">
          {item.description}
        </Typography>
      </View>
    </View>
  ));
}

const styles = StyleSheet.create({
  guidanceCopy: { flex: 1, gap: spacing.xs },
  guidanceRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
