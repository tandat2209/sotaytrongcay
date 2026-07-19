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
    <View style={styles.hero}>
      <View
        accessibilityElementsHidden
        style={[styles.icon, { backgroundColor }]}
      >
        <RecordIcon color={accentColor} size={34} />
      </View>
      <View style={styles.copy}>
        <View style={[styles.badge, { backgroundColor }]}>
          <Typography
            style={[styles.badgeLabel, { color: accentColor }]}
            variant="label"
          >
            {badge}
          </Typography>
        </View>
        <Typography variant="headlineLarge">{title}</Typography>
        <View style={styles.occurredAt}>
          <CalendarDays color={accentColor} size={18} />
          <Typography color="textSecondary" variant="bodyLarge">
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
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeLabel: { textTransform: "uppercase" },
  copy: { flex: 1, gap: spacing.sm, minWidth: 0 },
  hero: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: {
    alignItems: "center",
    borderRadius: radius.round,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  occurredAt: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
