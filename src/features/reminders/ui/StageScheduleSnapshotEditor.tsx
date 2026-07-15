import { useState } from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

import { appLocale, t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  initial: Readonly<{
    containerIntervalDays: number;
    groundIntervalDays: number;
    notificationEnabled: boolean;
    notificationTime: string | null;
  }>;
  onReset?: () => Promise<void>;
  onSave: (
    value: Readonly<{
      containerIntervalDays: number;
      groundIntervalDays: number;
      notificationEnabled: boolean;
      notificationTime: string | null;
    }>,
  ) => Promise<void>;
}>;

export function StageScheduleSnapshotEditor({
  initial,
  onReset,
  onSave,
}: Props) {
  const [groundInterval, setGroundInterval] = useState(
    String(initial.groundIntervalDays),
  );
  const [containerInterval, setContainerInterval] = useState(
    String(initial.containerIntervalDays),
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
    const groundIntervalDays = Number(groundInterval);
    const containerIntervalDays = Number(containerInterval);
    if (![groundIntervalDays, containerIntervalDays].every(isValidInterval)) {
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
        containerIntervalDays,
        groundIntervalDays,
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
      <IntervalField
        label={t("plants.guide.ground")}
        onChangeText={setGroundInterval}
        value={groundInterval}
      />
      <IntervalField
        label={t("plants.guide.container")}
        onChangeText={setContainerInterval}
        value={containerInterval}
      />
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
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
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
            {t("reminders.schedule.resetStage")}
          </Typography>
        </Pressable>
      ) : null}
    </View>
  );
}

function IntervalField({
  label,
  onChangeText,
  value,
}: Readonly<{
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}>) {
  return (
    <FormField
      label={label}
      supportingText={t("reminders.schedule.frequencyAccessibility")}
    >
      <TextInput
        accessibilityLabel={t(
          "reminders.schedule.frequencyByMethodAccessibility",
          { method: label.toLocaleLowerCase(appLocale) },
        )}
        keyboardType="number-pad"
        onChangeText={onChangeText}
        style={styles.input}
        value={value}
      />
    </FormField>
  );
}

function isValidInterval(value: number): boolean {
  return Number.isInteger(value) && value >= 1;
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
