import { Moon, Sun, Sunset } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { formatTodayDate, t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type Props = { date?: Date };

export function TodayHeader({ date = new Date() }: Props) {
  const hour = date.getHours();
  const greeting =
    hour < 12
      ? t("today.greeting.morning")
      : hour < 18
        ? t("today.greeting.afternoon")
        : t("today.greeting.evening");
  const GreetingIcon = hour < 12 ? Sun : hour < 18 ? Sunset : Moon;
  const dateLabel = formatTodayDate(date);

  return (
    <View style={styles.header}>
      <Typography
        color="textSecondary"
        style={styles.date}
        variant="bodyMedium"
      >
        {dateLabel}
      </Typography>
      <View style={styles.greeting}>
        <GreetingIcon color={colors.primary} size={18} />
        <Typography style={styles.greetingText} variant="bodyMedium">
          {greeting}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  date: { flexShrink: 1, fontWeight: "500" },
  greeting: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  greetingText: { color: colors.primary, fontWeight: "600" },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
});
