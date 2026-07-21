import { CalendarDays, type LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { formatDateTime } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  accentColor: string;
  badge: string;
  backgroundColor: string;
  icon: LucideIcon;
  occurredAt: string;
  title: string;
}>;

export function JournalDetailHero({
  accentColor,
  badge,
  backgroundColor,
  icon: RecordIcon,
  occurredAt,
  title,
}: Props) {
  return (
    <View style={[styles.hero, { backgroundColor }]}>
      <View accessibilityElementsHidden style={styles.icon}>
        <RecordIcon color={accentColor} size={34} />
      </View>
      <View style={styles.copy}>
        <View style={styles.badge}>
          <Typography
            style={[styles.badgeLabel, { color: accentColor }]}
            variant="label"
          >
            {badge}
          </Typography>
        </View>
        <Typography variant="screenTitle">{title}</Typography>
        <View style={styles.occurredAt}>
          <CalendarDays color={accentColor} size={18} />
          <Typography color="textSecondary" variant="body">
            {formatDateTime(new Date(occurredAt))}
          </Typography>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.68)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeLabel: { textTransform: "uppercase" },
  copy: { flex: 1, gap: spacing.sm, minWidth: 0 },
  hero: {
    alignItems: "center",
    borderRadius: radius.large,
    flexDirection: "row",
    gap: spacing.base,
    padding: spacing.lg,
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.medium,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  occurredAt: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
