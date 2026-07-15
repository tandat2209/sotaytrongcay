import { useState } from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

import { formatNumber, t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  allowInheritedFrequency: boolean;
  inheritedIntervalDays?: number | null;
  initial: Readonly<{
    intervalDays: number | null;
    notificationEnabled: boolean;
    notificationTime: string | null;
  }>;
  onReset?: () => Promise<void>;
  onSave: (
    value: Readonly<{
      intervalDays: number | null;
      notificationEnabled: boolean;
      notificationTime: string | null;
    }>,
  ) => Promise<void>;
}>;

export function ScheduleSnapshotEditor({
  allowInheritedFrequency,
  inheritedIntervalDays,
  initial,
  onReset,
  onSave,
}: Props) {
  const [interval, setInterval] = useState(
    initial.intervalDays === null
      ? inheritedIntervalDays === undefined || inheritedIntervalDays === null
        ? ""
        : String(inheritedIntervalDays)
      : String(initial.intervalDays),
  );
  const [notificationEnabled, setNotificationEnabled] = useState(
    initial.notificationEnabled,
  );
  const [notificationTime, setNotificationTime] = useState(
    initial.notificationTime ?? "08:00",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    const intervalDays = interval === "" ? null : Number(interval);
    if (
      (!allowInheritedFrequency && intervalDays === null) ||
      (intervalDays !== null &&
        (!Number.isInteger(intervalDays) || intervalDays < 1))
    ) {
      setError(t("reminders.validation.frequency"));
      return;
    }
    if (
      notificationEnabled &&
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(notificationTime)
    ) {
      setError(t("reminders.validation.time"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        intervalDays,
        notificationEnabled,
        notificationTime: notificationEnabled
          ? notificationTime
          : initial.notificationTime,
      });
    } catch {
      setError(t("reminders.validation.save"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.content}>
      <FormField
        label={t("reminders.schedule.frequency")}
        supportingText={
          allowInheritedFrequency
            ? inheritedIntervalDays === undefined ||
              inheritedIntervalDays === null
              ? t("reminders.schedule.frequencySupporting")
              : t("reminders.schedule.defaultFrequency", {
                  days: formatNumber(inheritedIntervalDays),
                })
            : undefined
        }
      >
        <TextInput
          accessibilityLabel={t("reminders.schedule.frequencyAccessibility")}
          keyboardType="number-pad"
          onChangeText={setInterval}
          placeholder={
            allowInheritedFrequency
              ? t("reminders.schedule.frequencyInherited")
              : t("reminders.schedule.frequencyExample")
          }
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={interval}
        />
      </FormField>
      <View style={styles.toggleRow}>
        <Typography variant="bodyLarge">
          {t("reminders.schedule.notification")}
        </Typography>
        <Switch
          accessibilityLabel={t("reminders.schedule.notification")}
          onValueChange={setNotificationEnabled}
          value={notificationEnabled}
        />
      </View>
      {notificationEnabled ? (
        <FormField label={t("reminders.schedule.notificationTime")}>
          <TextInput
            accessibilityLabel={t("reminders.schedule.notificationTime")}
            onChangeText={setNotificationTime}
            placeholder="08:00"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={notificationTime}
          />
        </FormField>
      ) : null}
      {error ? (
        <Typography color="error" variant="bodyMedium">
          {error}
        </Typography>
      ) : null}
      <PrimaryButton
        disabled={saving}
        label={
          saving ? t("common.actions.saving") : t("common.actions.saveChanges")
        }
        onPress={() => void save()}
      />
      {onReset ? (
        <Pressable accessibilityRole="button" onPress={() => void onReset()}>
          <Typography color="primary" variant="bodyMedium">
            {t("reminders.schedule.resetPlant")}
          </Typography>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  input: {
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    minHeight: 48,
    padding: spacing.sm,
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
  },
});
