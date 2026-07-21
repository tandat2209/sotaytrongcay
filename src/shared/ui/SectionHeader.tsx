import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Typography } from "./Typography";
import { colors, radius, spacing } from "./theme";

type Props = Readonly<{
  action?: ReactNode;
  icon?: LucideIcon;
  title: string;
}>;

export function SectionHeader({ action, icon: Icon, title }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.titleGroup}>
        {Icon ? (
          <View accessibilityElementsHidden style={styles.icon}>
            <Icon color={colors.primary} size={20} />
          </View>
        ) : null}
        <Typography style={styles.title} variant="sectionTitle">
          {title}
        </Typography>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.small,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  title: { flexShrink: 1 },
  titleGroup: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: spacing.md,
    minWidth: 0,
  },
});
