import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { getPreviewPlantKnowledge } from "@/features/knowledge/preview-knowledge";
import { Screen } from "@/shared/ui/Screen";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { Plant } from "../models/plant";

type PlantDraft = Omit<Plant, "id" | "createdAt">;
type Props = { onSave: (draft: PlantDraft) => Promise<void> };

export function CreatePlantScreen({ onSave }: Props) {
  const knowledge = getPreviewPlantKnowledge();
  const defaultStage = knowledge.stages[0];
  if (!defaultStage) throw new Error("Preview knowledge does not contain a stage");
  const [name, setName] = useState("");
  const [stageId, setStageId] = useState(defaultStage.id);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) { setError("Hãy đặt tên cho cây"); return; }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), speciesId: knowledge.species.id, stageId, plantedAt: null });
    } catch {
      setError("Chưa thể lưu cây. Dữ liệu đã nhập vẫn được giữ lại.");
    } finally { setSaving(false); }
  }

  return (
    <Screen introduction="Thêm thông tin cần thiết để bắt đầu ghi lịch sử chăm sóc." title="Tạo cây trồng">
      <View style={styles.field}>
        <Text style={styles.label}>Tên cây</Text>
        <TextInput accessibilityLabel="Tên cây" onChangeText={setName} style={styles.input} value={name} />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Loài</Text><Text style={styles.value}>{knowledge.species.title}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Giai đoạn sinh trưởng</Text>
        <View style={styles.chips}>{knowledge.stages.map((stage) => (
          <Pressable accessibilityRole="radio" accessibilityState={{ checked: stage.id === stageId }} key={stage.id} onPress={() => setStageId(stage.id)} style={[styles.chip, stage.id === stageId && styles.chipSelected]}>
            <Text style={stage.id === stageId ? styles.chipTextSelected : styles.chipText}>{stage.title}</Text>
          </Pressable>
        ))}</View>
      </View>
      <PrimaryButton label={saving ? "Đang lưu…" : "Lưu cây"} loading={saving} onPress={submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm }, label: { color: colors.text, fontSize: 14, fontWeight: "600" },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, color: colors.text, fontSize: 16, minHeight: 48, paddingHorizontal: spacing.md },
  value: { color: colors.text, fontSize: 16 }, error: { color: colors.error, fontSize: 14 }, chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { borderColor: colors.border, borderRadius: 20, borderWidth: 1, minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.md }, chipSelected: { backgroundColor: colors.primary },
  chipText: { color: colors.text }, chipTextSelected: { color: colors.surface },
});
