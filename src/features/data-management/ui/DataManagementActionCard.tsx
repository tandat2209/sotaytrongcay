import type { LucideIcon } from "lucide-react-native";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = PropsWithChildren<{
  description: string;
  icon: LucideIcon;
  title: string;
}>;

export function DataManagementActionCard({
  children,
  description,
  icon: Icon,
  title,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.icon}>
          <Icon color={colors.primary} size={22} />
        </View>
        <Typography style={styles.fill} variant="cardTitle">
          {title}
        </Typography>
      </View>
      <Typography color="textSecondary" variant="bodyMedium">
        {description}
      </Typography>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    gap: spacing.base,
    padding: spacing.base,
  },
  fill: { flex: 1 },
  heading: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  icon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.small,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
});
