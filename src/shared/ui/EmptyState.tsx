import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { colors, radius, spacing } from "./theme";

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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.section,
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  title: { textAlign: "center" },
  description: { textAlign: "center" },
});
