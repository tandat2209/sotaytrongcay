import DateTimePicker from "@react-native-community/datetimepicker";
import { Bell, RotateCcw } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

import { CARE_ACTIVITY_LABELS } from "@/features/journal";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { CarePlanReminderPreference } from "../models/care-plan-reminder-preference";

type Props = Readonly<{
  onBack: () => void;
  onSave: (preference: CarePlanReminderPreference) => Promise<void>;
  plantName: string;
  preference: CarePlanReminderPreference;
}>;

export function ReminderDetailScreen({ onBack, onSave, plantName, preference }: Props) {
  const [interval, setInterval] = useState(
    String(preference.customIntervalDays ?? preference.recommendedIntervalDays),
  );
  const [time, setTime] = useState(() => parseTime(preference.notificationTime));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(
    preference.notificationEnabled,
  );
  const [paused, setPaused] = useState(preference.pausedAt !== null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(restore = false) {
    const intervalDays = Number(interval);
    if (!restore && (!Number.isInteger(intervalDays) || intervalDays < 1)) {
      setError("Tần suất phải từ 1 ngày trở lên.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...preference,
        customIntervalDays: restore
          ? null
          : intervalDays === preference.recommendedIntervalDays
            ? null
            : intervalDays,
        notificationEnabled,
        notificationTime: formatTime(time),
        pausedAt: paused ? (preference.pausedAt ?? new Date().toISOString()) : null,
        updatedAt: new Date().toISOString(),
      });
      onBack();
    } catch {
      setError("Chưa thể lưu tùy chỉnh. Hãy thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="">
      <TopBar onBack={onBack} title="Chi tiết lời nhắc" titleIcon={Bell} />
      <Typography variant="headlineSmall">
        {CARE_ACTIVITY_LABELS[preference.activityType]} — {plantName}
      </Typography>
      <FormField
        label="Tần suất"
        supportingText={`Đề xuất: mỗi ${preference.recommendedIntervalDays} ngày`}
      >
        <TextInput
          accessibilityLabel="Số ngày giữa các lời nhắc"
          keyboardType="number-pad"
          onChangeText={setInterval}
          style={styles.input}
          value={interval}
        />
      </FormField>
      {preference.customIntervalDays !== null ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => void save(true)}
          style={styles.restore}
        >
          <RotateCcw color={colors.primary} size={18} />
          <Typography color="primary" variant="bodyMedium">
            Khôi phục đề xuất
          </Typography>
        </Pressable>
      ) : null}
      <FormField label="Giờ thông báo">
        <Pressable
          accessibilityLabel="Chọn giờ thông báo"
          accessibilityRole="button"
          onPress={() => setShowTimePicker(true)}
          style={styles.input}
        >
          <Typography variant="bodyLarge">{formatTime(time)}</Typography>
        </Pressable>
        {showTimePicker ? (
          <DateTimePicker
            mode="time"
            onChange={(_, value) => {
              if (Platform.OS !== "ios") setShowTimePicker(false);
              if (value) setTime(value);
            }}
            value={time}
          />
        ) : null}
      </FormField>
      <ToggleRow
        label="Gửi thông báo"
        onValueChange={setNotificationEnabled}
        value={notificationEnabled}
      />
      <ToggleRow label="Tạm dừng" onValueChange={setPaused} value={paused} />
      {error ? <Typography color="error" variant="bodyMedium">{error}</Typography> : null}
      <PrimaryButton
        disabled={saving}
        label={saving ? "Đang lưu…" : "Lưu thay đổi"}
        onPress={() => void save()}
      />
    </Screen>
  );
}

function ToggleRow(props: Readonly<{ label: string; onValueChange: (value: boolean) => void; value: boolean }>) {
  return (
    <View style={styles.toggleRow}>
      <Typography variant="bodyLarge">{props.label}</Typography>
      <Switch accessibilityLabel={props.label} {...props} />
    </View>
  );
}

function parseTime(value: string | null): Date {
  const date = new Date();
  const [hour = "08", minute = "00"] = (value ?? "08:00").split(":");
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date;
}

function formatTime(value: Date): string {
  return `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  input: { borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, minHeight: 48, padding: spacing.sm },
  restore: { alignItems: "center", flexDirection: "row", gap: spacing.sm, minHeight: 44 },
  toggleRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 52 },
});
