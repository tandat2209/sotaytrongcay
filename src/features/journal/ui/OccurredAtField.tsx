import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { mergeLocalDateAndTime } from "@/features/journal/models/occurred-at";
import { datePickerLocale, formatDateTime, t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  accessibilityLabel: string;
  error?: string | null;
  label: string;
  onChange: (value: Date) => void;
  value: Date;
}>;

export function OccurredAtField({
  accessibilityLabel,
  error,
  label,
  onChange,
  value,
}: Props) {
  const [showCombinedPicker, setShowCombinedPicker] = useState(false);

  function openAndroidTimePicker(selectedDate: Date) {
    DateTimePickerAndroid.open({
      mode: "time",
      onValueChange: (_, selectedTime) => {
        onChange(mergeLocalDateAndTime(selectedDate, selectedTime));
      },
      value: selectedDate,
    });
  }

  function openPicker() {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        maximumDate: new Date(),
        mode: "date",
        onValueChange: (_, selectedDate) => {
          openAndroidTimePicker(mergeLocalDateAndTime(selectedDate, value));
        },
        value,
      });
      return;
    }
    setShowCombinedPicker(true);
  }

  return (
    <FormField {...(error !== undefined ? { error } : {})} label={label}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={openPicker}
        style={styles.control}
      >
        <Typography variant="bodyLarge">{formatDateTime(value)}</Typography>
        <CalendarDays color={colors.textSecondary} size={20} />
      </Pressable>
      {Platform.OS !== "android" && showCombinedPicker ? (
        <DateTimePicker
          locale={datePickerLocale}
          maximumDate={new Date()}
          mode="datetime"
          onValueChange={(_, selected) => onChange(selected)}
          value={value}
        />
      ) : null}
      {Platform.OS === "ios" && showCombinedPicker ? (
        <Pressable
          accessibilityLabel={t("common.actions.done")}
          accessibilityRole="button"
          onPress={() => setShowCombinedPicker(false)}
          style={styles.done}
        >
          <Typography color="primary" variant="bodyLarge">
            {t("common.actions.done")}
          </Typography>
        </Pressable>
      ) : null}
    </FormField>
  );
}

const styles = StyleSheet.create({
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
  done: { alignSelf: "flex-end", padding: spacing.sm },
});
