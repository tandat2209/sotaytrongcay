import type { LucideIcon } from "lucide-react-native";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type SectionProps = PropsWithChildren<Readonly<{ title: string }>>;

export function JournalDetailSection({ children, title }: SectionProps) {
  return (
    <View style={styles.section}>
      <Typography variant="headlineSmall">{title}</Typography>
      <View style={styles.details}>{children}</View>
    </View>
  );
}

export function JournalDetailRow({
  icon: Icon,
  label,
  last = false,
  value,
}: Readonly<{
  icon: LucideIcon;
  label: string;
  last?: boolean;
  value: string;
}>) {
  return (
    <View style={[styles.detail, last ? styles.lastDetail : null]}>
      <View accessibilityElementsHidden style={styles.detailIcon}>
        <Icon color={colors.primary} size={20} />
      </View>
      <Typography color="textSecondary" style={styles.label} variant="body">
        {label}
      </Typography>
      <Typography style={styles.value} variant="bodyStrong">
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  detail: {
    alignItems: "flex-start",
    borderBottomColor: colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 68,
    paddingVertical: spacing.base,
  },
  detailIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.small,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  label: { flex: 1 },
  lastDetail: { borderBottomWidth: 0 },
  details: { paddingHorizontal: spacing.xs },
  section: { gap: spacing.md },
  value: { flex: 1.4, textAlign: "right" },
});
