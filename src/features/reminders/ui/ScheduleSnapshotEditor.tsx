import { useState } from "react";
import { Pressable, StyleSheet, Switch, TextInput, View } from "react-native";

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
        intervalDays,
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
      <FormField
        label="Tần suất"
        supportingText={
          allowInheritedFrequency
            ? inheritedIntervalDays === undefined ||
              inheritedIntervalDays === null
              ? "Để trống để dùng tần suất đã duyệt theo cách trồng."
              : `Mặc định: ${inheritedIntervalDays} ngày. Để trống để dùng giá trị này.`
            : undefined
        }
      >
        <TextInput
          accessibilityLabel="Số ngày giữa các lần chăm sóc"
          keyboardType="number-pad"
          onChangeText={setInterval}
          placeholder={
            allowInheritedFrequency ? "Theo kế hoạch chăm sóc" : "Ví dụ: 3"
          }
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={interval}
        />
      </FormField>
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
        <Typography color="error" variant="bodyMedium">
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
            Dùng tất cả cài đặt theo giai đoạn
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
