import { Check } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

import { appLocale, t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";

type ScheduleValues = Readonly<{
  containerIntervalDays: number;
  groundIntervalDays: number;
  notificationEnabled: boolean;
  notificationOverridden: boolean;
  notificationTime: string | null;
}>;

type Props = Readonly<{
  initial: ScheduleValues;
  notificationControlEnabled: boolean;
  onReset?: () => Promise<void>;
  onSave: (value: ScheduleValues) => Promise<void>;
  resetValues: ScheduleValues;
}>;

export function StageScheduleSnapshotEditor({
  initial,
  notificationControlEnabled,
  onReset,
  onSave,
  resetValues,
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
  const [notificationOverridden, setNotificationOverridden] = useState(
    initial.notificationOverridden,
  );
  const [notificationTime, setNotificationTime] = useState(
    initial.notificationTime ?? "08:00",
  );
  const [disabledNotificationTime, setDisabledNotificationTime] = useState(
    initial.notificationTime,
  );
  const [lastSaved, setLastSaved] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const savingRef = useRef(false);

  const draft = getDraft({
    containerInterval,
    groundInterval,
    notificationEnabled,
    notificationOverridden,
    notificationTime,
    disabledNotificationTime,
  });
  const isDirty = !sameSchedule(draft, lastSaved);

  async function save() {
    if (savingRef.current || !isDirty) return;
    if (
      ![draft.groundIntervalDays, draft.containerIntervalDays].every(
        isValidInterval,
      )
    ) {
      setError(t("reminders.validation.frequency"));
      return;
    }
    if (
      draft.notificationEnabled &&
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(draft.notificationTime ?? "")
    ) {
      setError(t("reminders.validation.time"));
      return;
    }
    savingRef.current = true;
    setSaveState("saving");
    setError(null);
    try {
      await onSave(draft);
      setLastSaved(draft);
      setSaveState("saved");
    } catch {
      setError(t("reminders.validation.save"));
      setSaveState("idle");
    } finally {
      savingRef.current = false;
    }
  }

  async function reset() {
    if (!onReset || savingRef.current) return;
    savingRef.current = true;
    setSaveState("saving");
    setError(null);
    try {
      await onReset();
      setGroundInterval(String(resetValues.groundIntervalDays));
      setContainerInterval(String(resetValues.containerIntervalDays));
      setNotificationEnabled(resetValues.notificationEnabled);
      setNotificationOverridden(resetValues.notificationOverridden);
      setNotificationTime(resetValues.notificationTime ?? "08:00");
      setDisabledNotificationTime(resetValues.notificationTime);
      setLastSaved(resetValues);
      setSaveState("saved");
    } catch {
      setError(t("reminders.validation.save"));
      setSaveState("idle");
    } finally {
      savingRef.current = false;
    }
  }

  return (
    <View style={styles.content}>
      <View style={styles.heading}>
        <Typography color="primary" variant="label">
          {t("settings.carePlans.personalSchedule")}
        </Typography>
        <IconButton
          accessibilityLabel={t("settings.carePlans.saveAccessibility")}
          disabled={!isDirty || saveState === "saving"}
          icon={Check}
          onPress={() => void save()}
        />
      </View>
      <IntervalRow
        label={t("plants.guide.ground")}
        onChangeText={(value) => {
          setGroundInterval(value);
          setError(null);
          setSaveState("idle");
        }}
        onSubmitEditing={() => void save()}
        value={groundInterval}
      />
      <IntervalRow
        label={t("plants.guide.container")}
        onChangeText={(value) => {
          setContainerInterval(value);
          setError(null);
          setSaveState("idle");
        }}
        onSubmitEditing={() => void save()}
        value={containerInterval}
      />
      <NotificationPreferenceControl
        controlEnabled={notificationControlEnabled}
        enabled={notificationEnabled}
        onEnabledChange={(value) => {
          if (!value) setDisabledNotificationTime(notificationTime);
          setNotificationEnabled(value);
          setNotificationOverridden(true);
          setError(null);
          setSaveState("idle");
        }}
        onSubmit={() => void save()}
        onTimeChange={(value) => {
          setNotificationTime(value);
          setError(null);
          setSaveState("idle");
        }}
        time={notificationTime}
      />
      <SaveFeedback
        error={error}
        onRetry={() => void save()}
        state={saveState}
      />
      {onReset ? (
        <Pressable accessibilityRole="button" onPress={() => void reset()}>
          <Typography color="primary" variant="bodyMedium">
            {t("reminders.schedule.resetStage")}
          </Typography>
        </Pressable>
      ) : null}
    </View>
  );
}

function SaveFeedback({
  error,
  onRetry,
  state,
}: Readonly<{
  error: string | null;
  onRetry: () => void;
  state: "idle" | "saving" | "saved";
}>) {
  if (state === "saving")
    return (
      <Typography color="textSecondary" variant="bodyMedium">
        {t("common.actions.saving")}
      </Typography>
    );
  if (state === "saved")
    return (
      <Typography color="primary" variant="bodyMedium">
        {t("settings.carePlans.scheduleSaved")}
      </Typography>
    );
  if (!error) return null;
  return (
    <View style={styles.error}>
      <Typography accessibilityRole="alert" color="error" variant="bodyMedium">
        {error}
      </Typography>
      <Pressable accessibilityRole="button" onPress={onRetry}>
        <Typography color="primary" variant="bodyMedium">
          {t("common.actions.retry")}
        </Typography>
      </Pressable>
    </View>
  );
}

function IntervalRow({
  label,
  onChangeText,
  onSubmitEditing,
  value,
}: Readonly<{
  label: string;
  onChangeText: (value: string) => void;
  onSubmitEditing: () => void;
  value: string;
}>) {
  return (
    <View style={styles.intervalRow}>
      <Typography style={styles.method} variant="bodyLarge">
        {label}
      </Typography>
      <View style={styles.intervalInputRow}>
        <Typography color="textSecondary" variant="bodyMedium">
          {t("settings.carePlans.every")}
        </Typography>
        <TextInput
          accessibilityLabel={t(
            "reminders.schedule.frequencyByMethodAccessibility",
            { method: label.toLocaleLowerCase(appLocale) },
          )}
          keyboardType="number-pad"
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="done"
          style={styles.intervalInput}
          value={value}
        />
        <Typography color="textSecondary" variant="bodyMedium">
          {t("settings.carePlans.days")}
        </Typography>
      </View>
    </View>
  );
}

function NotificationPreferenceControl({
  controlEnabled,
  enabled,
  onEnabledChange,
  onSubmit,
  onTimeChange,
  time,
}: Readonly<{
  controlEnabled: boolean;
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  onSubmit: () => void;
  onTimeChange: (value: string) => void;
  time: string;
}>) {
  return (
    <>
      <View style={styles.toggleRow}>
        <Typography variant="bodyLarge">
          {t("reminders.schedule.notification")}
        </Typography>
        <Switch
          accessibilityLabel={t("reminders.schedule.notification")}
          disabled={!controlEnabled}
          onValueChange={onEnabledChange}
          value={enabled}
        />
      </View>
      {!controlEnabled ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {t("reminders.schedule.globalDisabled")}
        </Typography>
      ) : null}
      {enabled ? (
        <TextInput
          accessibilityLabel={t("reminders.schedule.notificationTime")}
          editable={controlEnabled}
          onChangeText={onTimeChange}
          onSubmitEditing={onSubmit}
          placeholder="08:00"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="done"
          style={styles.timeInput}
          value={time}
        />
      ) : null}
    </>
  );
}

function getDraft(input: {
  containerInterval: string;
  groundInterval: string;
  notificationEnabled: boolean;
  notificationOverridden: boolean;
  notificationTime: string;
  disabledNotificationTime: string | null;
}): ScheduleValues {
  return {
    containerIntervalDays: Number(input.containerInterval),
    groundIntervalDays: Number(input.groundInterval),
    notificationEnabled: input.notificationEnabled,
    notificationOverridden: input.notificationOverridden,
    notificationTime: input.notificationEnabled
      ? input.notificationTime
      : input.disabledNotificationTime,
  };
}

function sameSchedule(left: ScheduleValues, right: ScheduleValues): boolean {
  return (
    left.containerIntervalDays === right.containerIntervalDays &&
    left.groundIntervalDays === right.groundIntervalDays &&
    left.notificationEnabled === right.notificationEnabled &&
    left.notificationOverridden === right.notificationOverridden &&
    left.notificationTime === right.notificationTime
  );
}

function isValidInterval(value: number): boolean {
  return Number.isInteger(value) && value >= 1;
}

const styles = StyleSheet.create({
  content: { gap: spacing.base },
  error: { gap: spacing.xs },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  intervalInput: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    minHeight: 36,
    minWidth: 36,
    paddingHorizontal: spacing.xs,
    textAlign: "center",
  },
  intervalInputRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  intervalRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
  },
  method: { flexShrink: 1 },
  timeInput: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    minHeight: 40,
    paddingHorizontal: spacing.xs,
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
  },
});
