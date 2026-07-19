import type { LucideIcon } from "lucide-react-native";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type SectionProps = PropsWithChildren<Readonly<{ title: string }>>;

export function JournalDetailSection({ children, title }: SectionProps) {
  return (
    <View style={styles.section}>
      <Typography variant="headlineSmall">{title}</Typography>
      <SurfaceCard style={styles.card}>{children}</SurfaceCard>
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
      <Typography
        color="textSecondary"
        style={styles.label}
        variant="bodyLarge"
      >
        {label}
      </Typography>
      <Typography style={styles.value} variant="bodyLarge">
        {value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 0 },
  detail: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 72,
    paddingVertical: spacing.md,
  },
  detailIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.control,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  label: { flex: 1 },
  lastDetail: { borderBottomWidth: 0 },
  section: { gap: spacing.sm },
  value: { flex: 1.4, textAlign: "right" },
});
