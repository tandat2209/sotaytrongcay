import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { datePickerLocale, formatDate, t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  onChange: (value: string | null) => void;
  value: string | null;
}>;

export function PlantedAtField({ onChange, value }: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <FormField label={t("plants.create.dateLabel")}>
      <Pressable
        accessibilityLabel={t("plants.create.dateAccessibility")}
        accessibilityRole="button"
        onPress={() => setPickerVisible(true)}
        style={styles.control}
      >
        <Typography
          color={value ? "text" : "textSecondary"}
          variant="bodyLarge"
        >
          {value
            ? formatDate(new Date(`${value}T00:00:00`))
            : t("plants.create.dateEmpty")}
        </Typography>
        <CalendarDays color={colors.textSecondary} size={20} />
      </Pressable>
      {pickerVisible ? (
        <DateTimePicker
          locale={datePickerLocale}
          maximumDate={new Date()}
          mode="date"
          onDismiss={() => setPickerVisible(false)}
          onValueChange={(_, date) => {
            if (Platform.OS !== "ios") setPickerVisible(false);
            onChange(date.toISOString().split("T")[0] ?? null);
          }}
          value={value ? new Date(value) : new Date()}
        />
      ) : null}
      {pickerVisible && Platform.OS === "ios" ? (
        <Pressable
          accessibilityLabel={t("common.actions.done")}
          accessibilityRole="button"
          onPress={() => setPickerVisible(false)}
          style={styles.done}
        >
          <Typography color="primary" variant="bodyLarge">
            {t("common.actions.done")}
          </Typography>
        </Pressable>
      ) : null}
      {value ? (
        <Pressable
          accessibilityLabel={t("plants.create.dateClear")}
          accessibilityRole="button"
          onPress={() => onChange(null)}
          style={styles.clear}
        >
          <Typography color="error" variant="bodyMedium">
            {t("plants.create.dateClear")}
          </Typography>
        </Pressable>
      ) : null}
    </FormField>
  );
}

const styles = StyleSheet.create({
  clear: { alignItems: "flex-end", minHeight: 44, paddingVertical: spacing.sm },
  control: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  done: { alignItems: "flex-end", paddingVertical: spacing.xs },
});
