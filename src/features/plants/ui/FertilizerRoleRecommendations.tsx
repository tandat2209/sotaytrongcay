import { StyleSheet, View } from "react-native";
import type { RecommendedInput } from "@/features/knowledge/preview-knowledge";
import { t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { spacing } from "@/shared/ui/theme";

export function FertilizerRoleRecommendations({
  recommendations,
}: Readonly<{ recommendations: readonly RecommendedInput[] }>) {
  return (
    <View style={styles.list}>
      {recommendations.map((recommendation) => (
        <View key={recommendation.catalogId} style={styles.item}>
          <Typography variant="bodyLarge">
            {t(`plants.guide.fertilizerPriority.${recommendation.priority}`)}:{" "}
            {recommendation.name}
          </Typography>
          <Typography color="textSecondary" variant="bodyMedium">
            {t(`fertilizers.group.${recommendation.group}`)}
          </Typography>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { gap: spacing.xs },
  list: { gap: spacing.sm },
});
