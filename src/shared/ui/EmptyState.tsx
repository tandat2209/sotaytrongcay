import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "./theme";

type EmptyStateProps = {
  description: string;
  title: string;
};

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <View accessibilityRole="summary" style={styles.container}>
      <View accessibilityElementsHidden style={styles.leaf}>
        <Text style={styles.leafText}>⌁</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  leaf: {
    alignItems: "center",
    backgroundColor: "#E7F0E4",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  leafText: { color: colors.primary, fontSize: 30, fontWeight: "600" },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "center",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
