import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CalendarDays,
  CircleHelp,
  Lightbulb,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import type { CareActivityType } from "@/features/journal/models/care-activity";
import { CARE_ACTIVITY_VISUALS } from "@/features/journal/models/care-activity-icon";
import { PlantIdentity } from "@/features/plants/ui/PlantIdentity";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

export type CareEntryDetails = Readonly<{
  amount: { value: number; unit: "liter" } | null;
  notes: string | null;
  occurredAt: string;
}>;

type Props = Readonly<{
  imageUri?: string | null;
  onDismiss: () => void;
  onSave: (details: CareEntryDetails) => Promise<void>;
  reason?: string;
  plantName: string;
  speciesTitle: string;
  suggestion?: string;
  stageId: string;
  stageTitle: string;
  type: CareActivityType;
  visible: boolean;
}>;

const ENTRY_TITLES: Record<CareActivityType, string> = {
  fertilizing: "Bón phân",
  spraying: "Phun thuốc",
  watering: "Tưới nước",
};

export function CareEntryScreen({
  imageUri,
  onDismiss,
  onSave,
  plantName,
  reason,
  speciesTitle,
  stageId,
  stageTitle,
  suggestion,
  type,
  visible,
}: Props) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const visual = CARE_ACTIVITY_VISUALS[type];
  const ActivityIcon = visual.icon;

  async function submit() {
    const parsedAmount =
      type === "watering" && amount.trim()
        ? Number(amount.replace(",", "."))
        : null;
    if (
      parsedAmount !== null &&
      (!Number.isFinite(parsedAmount) || parsedAmount <= 0)
    ) {
      setError("Lượng nước phải lớn hơn 0");
      return;
    }
    if (occurredAt.getTime() > Date.now()) {
      setError("Thời gian thực hiện không thể ở tương lai.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({
        amount:
          parsedAmount === null ? null : { value: parsedAmount, unit: "liter" },
        notes: notes.trim() || null,
        occurredAt: occurredAt.toISOString(),
      });
    } catch {
      setError("Chưa thể lưu hoạt động. Dữ liệu đã nhập vẫn được giữ lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet
      footer={
        <PrimaryButton
          backgroundColor={visual.backgroundColor}
          label="Lưu hoạt động"
          loading={saving}
          onPress={submit}
          textColor={visual.color}
        />
      }
      onDismiss={onDismiss}
      title={
        <View style={styles.title}>
          <ActivityIcon color={visual.color} size={22} />
          <Typography variant="headlineSmall">{ENTRY_TITLES[type]}</Typography>
        </View>
      }
      visible={visible}
    >
      <PlantIdentity
        imageUri={imageUri ?? null}
        name={plantName}
        size="list"
        speciesTitle={speciesTitle}
        stageId={stageId}
        stageTitle={stageTitle}
      />
      {suggestion ? (
        <ContextRow icon={Lightbulb} label="Gợi ý:" text={suggestion} />
      ) : null}
      {reason ? (
        <ContextRow icon={CircleHelp} label="Lý do:" text={reason} />
      ) : null}
      <FormField
        error={error?.startsWith("Thời gian") ? error : null}
        label="Thời gian thực hiện"
      >
        <Pressable
          accessibilityLabel="Chọn thời gian thực hiện"
          accessibilityRole="button"
          onPress={() => setShowPicker(true)}
          style={styles.timeButton}
        >
          <Typography variant="bodyLarge">
            {occurredAt.toLocaleString("vi-VN")}
          </Typography>
          <CalendarDays color={colors.textSecondary} size={20} />
        </Pressable>
        {showPicker ? (
          <DateTimePicker
            locale="vi-VN"
            maximumDate={new Date()}
            mode="datetime"
            onChange={(_, date) => {
              if (Platform.OS !== "ios") setShowPicker(false);
              if (date) setOccurredAt(date);
            }}
            value={occurredAt}
          />
        ) : null}
        {showPicker && Platform.OS === "ios" ? (
          <Pressable
            accessibilityLabel="Xong"
            accessibilityRole="button"
            onPress={() => setShowPicker(false)}
            style={styles.done}
          >
            <Typography color="primary" variant="bodyLarge">
              Xong
            </Typography>
          </Pressable>
        ) : null}
      </FormField>
      {type === "watering" ? (
        <FormField
          error={error?.startsWith("Lượng") ? error : null}
          label="Lượng nước (không bắt buộc)"
        >
          <View style={styles.amountRow}>
            <TextInput
              accessibilityLabel="Lượng nước"
              inputMode="decimal"
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              value={amount}
            />
            <Typography style={styles.unit} variant="bodyLarge">
              lít
            </Typography>
          </View>
        </FormField>
      ) : null}
      <FormField
        error={error?.startsWith("Chưa thể") ? error : null}
        label="Ghi chú (không bắt buộc)"
      >
        <TextInput
          accessibilityLabel="Ghi chú"
          multiline
          onChangeText={setNotes}
          placeholder="Thêm điều bạn muốn nhớ"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, styles.notes]}
          value={notes}
        />
      </FormField>
    </BottomSheet>
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
  title: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  amountRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  context: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.control,
    gap: spacing.xs,
    padding: spacing.md,
  },
  contextTitle: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  done: { alignSelf: "flex-end", padding: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  notes: { minHeight: 112, paddingTop: spacing.md, textAlignVertical: "top" },
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
  unit: { minWidth: 32 },
});
