import { useState } from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

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
      setError("Tần suất phải từ 1 ngày trở lên.");
      return;
    }
    if (
      notificationEnabled &&
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(notificationTime)
    ) {
      setError("Giờ thông báo phải theo dạng 08:00.");
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
      setError("Chưa thể lưu tùy chỉnh. Dữ liệu đã nhập vẫn được giữ lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.content}>
      <IntervalField
        label="Trồng đất"
        onChangeText={setGroundInterval}
        value={groundInterval}
      />
      <IntervalField
        label="Trồng chậu"
        onChangeText={setContainerInterval}
        value={containerInterval}
      />
      <View style={styles.toggleRow}>
        <Typography variant="bodyLarge">Gửi thông báo</Typography>
        <Switch
          accessibilityLabel="Gửi thông báo"
          onValueChange={setNotificationEnabled}
          value={notificationEnabled}
        />
      </View>
      {notificationEnabled ? (
        <FormField label="Giờ thông báo">
          <TextInput
            accessibilityLabel="Giờ thông báo"
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
        label={saving ? "Đang lưu…" : "Lưu thay đổi"}
        onPress={() => void save()}
      />
      {onReset ? (
        <Pressable accessibilityRole="button" onPress={() => void onReset()}>
          <Typography color="primary" variant="bodyMedium">
            Dùng tất cả cài đặt mặc định
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
    <FormField label={label} supportingText="Số ngày giữa các lần chăm sóc">
      <TextInput
        accessibilityLabel={`Tần suất ${label.toLocaleLowerCase("vi")}`}
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
