import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { colors, radius, spacing } from "@/shared/ui/theme";

type WateringDetails = { amount: { value: number; unit: "liter" } | null; notes: string | null };
type Props = { onSave: (details: WateringDetails) => Promise<void>; plantName: string };

export function WateringEntryScreen({ onSave, plantName }: Props) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    const parsedAmount = amount.trim() ? Number(amount.replace(",", ".")) : null;
    if (parsedAmount !== null && (!Number.isFinite(parsedAmount) || parsedAmount <= 0)) { setError("Lượng nước phải lớn hơn 0"); return; }
    setSaving(true);
    try {
      await onSave({ amount: parsedAmount === null ? null : { value: parsedAmount, unit: "liter" }, notes: notes.trim() || null });
    } catch { setError("Chưa thể lưu hoạt động. Dữ liệu đã nhập vẫn được giữ lại."); }
    finally { setSaving(false); }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <Screen introduction={`Cây trồng: ${plantName}`} title="Ghi tưới nước">
        <Text style={styles.context}>Chỉ lưu sau khi bạn xác nhận hoạt động đã được thực hiện.</Text>
        <View style={styles.field}><Text style={styles.label}>Lượng nước (không bắt buộc)</Text><View style={styles.amountRow}><TextInput accessibilityLabel="Lượng nước" inputMode="decimal" onChangeText={setAmount} style={styles.input} value={amount} /><Text style={styles.unit}>lít</Text></View></View>
        <View style={styles.field}><Text style={styles.label}>Ghi chú (không bắt buộc)</Text><TextInput accessibilityLabel="Ghi chú" multiline onChangeText={setNotes} style={[styles.input, styles.notes]} value={notes} /></View>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={saving ? "Đang lưu…" : "Lưu hoạt động"} loading={saving} onPress={submit} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, context: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 }, field: { gap: spacing.sm }, label: { color: colors.text, fontSize: 14, fontWeight: "600" },
  amountRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, color: colors.text, flex: 1, fontSize: 16, minHeight: 48, paddingHorizontal: spacing.md }, unit: { color: colors.text, fontSize: 16, minWidth: 32 }, notes: { minHeight: 88, paddingTop: spacing.md, textAlignVertical: "top" }, error: { color: colors.error, fontSize: 14 },
});
