import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { SurfaceCard } from "./SurfaceCard";
import { Typography } from "./Typography";
import { colors, spacing } from "./theme";

type EmptyStateProps = {
  description: string;
  icon: LucideIcon;
  title: string;
};

export function EmptyState({
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <SurfaceCard style={styles.container}>
      <View accessibilityElementsHidden style={styles.icon}>
        <Icon color={colors.primary} size={24} />
      </View>
      <Typography style={styles.title} variant="headlineSmall">
        {title}
      </Typography>
      <Typography
        color="textSecondary"
        style={styles.description}
        variant="bodyMedium"
      >
        {description}
      </Typography>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  icon: {
    alignItems: "center",
    backgroundColor: "#E7F0E4",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  title: { textAlign: "center" },
  description: { textAlign: "center" },
});
