import { CalendarDays, Moon, Sun, Sunset } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { formatTodayDate, t } from "@/shared/i18n";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type Props = { date?: Date };

export function TodayWeatherContext({ date = new Date() }: Props) {
  const hour = date.getHours();
  const greeting =
    hour < 12
      ? t("today.greeting.morning")
      : hour < 18
        ? t("today.greeting.afternoon")
        : t("today.greeting.evening");
  const GreetingIcon = hour < 12 ? Sun : hour < 18 ? Sunset : Moon;

  return (
    <View style={styles.context}>
      <View style={styles.dateGroup}>
        <CalendarDays color={colors.primary} size={18} />
        <Typography
          color="textSecondary"
          style={styles.date}
          variant="bodyMedium"
        >
          {formatTodayDate(date)}
        </Typography>
      </View>
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
  context: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.base,
    justifyContent: "space-between",
  },
  date: { flexShrink: 1, fontWeight: "500" },
  dateGroup: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  greeting: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  greetingText: { color: colors.primary, fontWeight: "600" },
});
