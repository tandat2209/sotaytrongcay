import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from "react-native";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type WateringDetails = { amount: { value: number; unit: "liter" } | null; notes: string | null };
type Props = {
  onBack?: () => void;
  onSave: (details: WateringDetails) => Promise<void>;
  plantName: string;
};

export function WateringEntryScreen({ onBack, onSave, plantName }: Props) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const parsedAmount = amount.trim() ? Number(amount.replace(",", ".")) : null;
    if (parsedAmount !== null && (!Number.isFinite(parsedAmount) || parsedAmount <= 0)) {
      setError("Lượng nước phải lớn hơn 0");
      return;
    }

    setSaving(true);
    try {
      await onSave({ amount: parsedAmount === null ? null : { value: parsedAmount, unit: "liter" }, notes: notes.trim() || null });
    } catch {
      setError("Chưa thể lưu hoạt động. Dữ liệu đã nhập vẫn được giữ lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <Screen title="">
        {onBack ? <TopBar backAccessibilityLabel="Quay lại cây trồng" onBack={onBack} title="Ghi tưới nước" /> : <Typography variant="headlineLarge">Ghi tưới nước</Typography>}
        <Typography color="textSecondary" variant="bodyLarge">Cây trồng: {plantName}</Typography>
        <Typography color="textSecondary" variant="bodyMedium">Chỉ lưu sau khi bạn xác nhận hoạt động đã được thực hiện.</Typography>
        <FormField label="Lượng nước (không bắt buộc)">
          <View style={styles.amountRow}>
            <TextInput accessibilityLabel="Lượng nước" inputMode="decimal" onChangeText={setAmount} placeholder="0" placeholderTextColor={colors.textSecondary} style={styles.input} value={amount} />
            <Typography style={styles.unit} variant="bodyLarge">lít</Typography>
          </View>
        </FormField>
        <FormField error={error} label="Ghi chú (không bắt buộc)">
          <TextInput accessibilityLabel="Ghi chú" multiline onChangeText={setNotes} placeholder="Thêm điều bạn muốn nhớ" placeholderTextColor={colors.textSecondary} style={[styles.input, styles.notes]} value={notes} />
        </FormField>
        <PrimaryButton label="Lưu hoạt động" loading={saving} onPress={submit} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  amountRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, color: colors.text, flex: 1, fontSize: 16, lineHeight: 24, minHeight: 48, paddingHorizontal: spacing.md },
  notes: { minHeight: 112, paddingTop: spacing.md, textAlignVertical: "top" },
  unit: { minWidth: 32 },
});
