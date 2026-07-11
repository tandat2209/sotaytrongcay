import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "./IconButton";
import { Typography } from "./Typography";
import { spacing } from "./theme";

type TopBarProps = {
  action?: ReactNode;
  backAccessibilityLabel?: string;
  onBack: () => void;
  title: string;
};

export function TopBar({ action, backAccessibilityLabel = "Quay lại", onBack, title }: TopBarProps) {
  return (
    <View style={styles.bar}>
      <IconButton accessibilityLabel={backAccessibilityLabel} icon="chevron-back" onPress={onBack} />
      <Typography style={styles.title} variant="headlineSmall">{title}</Typography>
      <View style={styles.action}>{action}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: { alignItems: "flex-end", minWidth: 44 },
  bar: { alignItems: "center", flexDirection: "row", gap: spacing.sm, minHeight: 52 },
  title: { flex: 1 },
});
