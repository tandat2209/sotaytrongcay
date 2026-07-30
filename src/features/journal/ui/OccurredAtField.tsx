import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import {
  getOccurrencePeriod,
  isOccurrencePeriodAvailable,
  OCCURRENCE_PERIODS,
  resolveOccurrenceAt,
  type OccurrencePeriod,
} from "@/features/journal/models/occurred-at";
import { datePickerLocale, formatDate, t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { getOccurrencePeriodLabel } from "./care-activity-copy";

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
  const [showDatePicker, setShowDatePicker] = useState(false);

  function selectDate(selectedDate: Date) {
    const now = new Date();
    const currentPeriod = getOccurrencePeriod(value);
    const period = isOccurrencePeriodAvailable(selectedDate, currentPeriod, now)
      ? currentPeriod
      : getOccurrencePeriod(now);
    onChange(resolveOccurrenceAt(selectedDate, period, now));
  }

  function openPicker() {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        maximumDate: new Date(),
        mode: "date",
        onValueChange: (_, selectedDate) => {
          selectDate(selectedDate);
        },
        value,
      });
      return;
    }
    setShowDatePicker(true);
  }

  function selectPeriod(period: OccurrencePeriod) {
    onChange(resolveOccurrenceAt(value, period, new Date()));
  }

  return (
    <FormField {...(error !== undefined ? { error } : {})} label={label}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={openPicker}
        style={styles.control}
      >
        <Typography variant="bodyLarge">{formatDate(value)}</Typography>
        <CalendarDays color={colors.textSecondary} size={20} />
      </Pressable>
      {Platform.OS !== "android" && showDatePicker ? (
        <DateTimePicker
          locale={datePickerLocale}
          maximumDate={new Date()}
          mode="date"
          onValueChange={(_, selected) => selectDate(selected)}
          value={value}
        />
      ) : null}
      {Platform.OS === "ios" && showDatePicker ? (
        <Pressable
          accessibilityLabel={t("common.actions.done")}
          accessibilityRole="button"
          onPress={() => setShowDatePicker(false)}
          style={styles.done}
        >
          <Typography color="primary" variant="bodyLarge">
            {t("common.actions.done")}
          </Typography>
        </Pressable>
      ) : null}
      <View style={styles.periodField}>
        <Typography variant="label">
          {t("journal.careEntry.period.title")}
        </Typography>
        <View accessibilityRole="radiogroup" style={styles.periods}>
          {OCCURRENCE_PERIODS.map((period) => {
            const now = new Date();
            const selected = getOccurrencePeriod(value) === period;
            const available = isOccurrencePeriodAvailable(value, period, now);
            const periodLabel = getOccurrencePeriodLabel(period);
            return (
              <Pressable
                accessibilityLabel={t("journal.careEntry.period.select", {
                  period: periodLabel,
                })}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected, disabled: !available }}
                disabled={!available}
                key={period}
                onPress={() => selectPeriod(period)}
                style={({ pressed }) => [
                  styles.period,
                  selected && styles.selectedPeriod,
                  !available && styles.unavailablePeriod,
                  pressed && styles.pressedPeriod,
                ]}
              >
                <Typography
                  color={selected ? "primary" : "textSecondary"}
                  variant={selected ? "bodyStrong" : "body"}
                >
                  {periodLabel}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.divider,
    borderRadius: radius.small,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: spacing.base,
  },
  done: { alignSelf: "flex-end", padding: spacing.sm },
  period: {
    alignItems: "center",
    borderColor: colors.divider,
    borderRadius: radius.small,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
  },
  periodField: { gap: spacing.sm },
  periods: { flexDirection: "row", gap: spacing.sm },
  pressedPeriod: { opacity: 0.78 },
  selectedPeriod: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  unavailablePeriod: { opacity: 0.4 },
});
