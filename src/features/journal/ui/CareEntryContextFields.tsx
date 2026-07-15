import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CalendarDays,
  CircleHelp,
  Lightbulb,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { datePickerLocale, formatDateTime, t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  dateError?: string | null;
  occurredAt: Date;
  onOccurredAtChange: (value: Date) => void;
  reason?: string;
  suggestion?: string;
}>;

export function CareEntryContextFields({
  dateError,
  occurredAt,
  onOccurredAtChange,
  reason,
  suggestion,
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <>
      {suggestion ? (
        <ContextRow
          icon={Lightbulb}
          label={t("journal.careEntry.suggestionLabel")}
          text={suggestion}
        />
      ) : null}
      {reason ? (
        <ContextRow
          icon={CircleHelp}
          label={t("journal.careEntry.reasonLabel")}
          text={reason}
        />
      ) : null}
      <FormField
        {...(dateError !== undefined ? { error: dateError } : {})}
        label={t("journal.careEntry.dateLabel")}
      >
        <Pressable
          accessibilityLabel={t("journal.careEntry.dateAccessibility")}
          accessibilityRole="button"
          onPress={() => setShowPicker(true)}
          style={styles.timeButton}
        >
          <Typography variant="bodyLarge">
            {formatDateTime(occurredAt)}
          </Typography>
          <CalendarDays color={colors.textSecondary} size={20} />
        </Pressable>
        {showPicker ? (
          <DateTimePicker
            locale={datePickerLocale}
            maximumDate={new Date()}
            mode="datetime"
            onChange={(_, date) => {
              if (Platform.OS !== "ios") setShowPicker(false);
              if (date) onOccurredAtChange(date);
            }}
            value={occurredAt}
          />
        ) : null}
        {showPicker && Platform.OS === "ios" ? (
          <Pressable
            accessibilityLabel={t("common.actions.done")}
            accessibilityRole="button"
            onPress={() => setShowPicker(false)}
            style={styles.done}
          >
            <Typography color="primary" variant="bodyLarge">
              {t("common.actions.done")}
            </Typography>
          </Pressable>
        ) : null}
      </FormField>
    </>
  );
}

function ContextRow({
  icon: Icon,
  label,
  text,
}: Readonly<{ icon: LucideIcon; label: string; text: string }>) {
  return (
    <View style={styles.context}>
      <View style={styles.contextTitle}>
        <Icon color={colors.textSecondary} size={18} />
        <Typography variant="bodyLarge">{label}</Typography>
      </View>
      <Typography color="textSecondary" variant="bodyMedium">
        {text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  context: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.control,
    gap: spacing.xs,
    padding: spacing.md,
  },
  contextTitle: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  done: { alignSelf: "flex-end", padding: spacing.sm },
  timeButton: {
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
});
