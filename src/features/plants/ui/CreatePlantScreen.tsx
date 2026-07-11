import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { getPreviewPlantKnowledge } from "@/features/knowledge/preview-knowledge";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { Plant } from "../models/plant";

type PlantDraft = Omit<Plant, "id" | "createdAt">;
type Props = {
  onBack?: () => void;
  onSave: (draft: PlantDraft) => Promise<void>;
};

export function CreatePlantScreen({ onBack, onSave }: Props) {
  const knowledge = getPreviewPlantKnowledge();
  const defaultStage = knowledge.stages[0];
  if (!defaultStage) throw new Error("Preview knowledge does not contain a stage");
  const [name, setName] = useState("");
  const [stageId, setStageId] = useState(defaultStage.id);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) {
      setError("Hãy đặt tên cho cây");
      return;
    }

    setSaving(true);
    try {
      await onSave({ name: name.trim(), speciesId: knowledge.species.id, stageId, plantedAt: null });
    } catch {
      setError("Chưa thể lưu cây. Dữ liệu đã nhập vẫn được giữ lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="">
      {onBack ? <TopBar backAccessibilityLabel="Quay lại Cây trồng" onBack={onBack} title="Tạo cây trồng" /> : <Typography variant="headlineLarge">Tạo cây trồng</Typography>}
      <Typography color="textSecondary" variant="bodyLarge">Thêm thông tin cần thiết để bắt đầu ghi lịch sử chăm sóc.</Typography>
      <FormField error={error} label="Tên cây">
        <TextInput
          accessibilityLabel="Tên cây"
          autoCapitalize="sentences"
          onChangeText={(value) => {
            setName(value);
            if (error) setError(null);
          }}
          placeholder="Ví dụ: Nho sân thượng"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={name}
        />
      </FormField>
      <FormField label="Loài">
        <SurfaceCard style={styles.readOnly}><Typography variant="bodyLarge">{knowledge.species.title}</Typography></SurfaceCard>
      </FormField>
      <FormField label="Giai đoạn sinh trưởng">
        <View accessibilityRole="radiogroup" style={styles.chips}>
          {knowledge.stages.map((stage) => {
            const selected = stage.id === stageId;
            return (
              <Pressable
                accessibilityLabel={`Chọn giai đoạn ${stage.title}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={stage.id}
                onPress={() => setStageId(stage.id)}
                style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.chipPressed]}
              >
                <Typography color={selected ? "surface" : "text"} variant="bodyMedium">{stage.title}</Typography>
              </Pressable>
            );
          })}
        </View>
      </FormField>
      <PrimaryButton label="Lưu cây" loading={saving} onPress={submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chip: { borderColor: colors.border, borderRadius: radius.chip, borderWidth: 1, justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipPressed: { opacity: 0.82 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, color: colors.text, fontSize: 16, lineHeight: 24, minHeight: 48, paddingHorizontal: spacing.md },
  readOnly: { backgroundColor: colors.surfaceSubtle, paddingVertical: spacing.sm },
});
