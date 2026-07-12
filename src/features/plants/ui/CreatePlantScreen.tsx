import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { stageIcon } from "@/features/knowledge/stage-icons";
import { getPreviewPlantKnowledge } from "@/features/knowledge/preview-knowledge";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { Plant } from "../models/plant";

type PlantDraft = Omit<Plant, "id" | "createdAt">;
type Props = {
  onBack?: () => void;
  onSave: (draft: PlantDraft) => Promise<void>;
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function CreatePlantScreen({ onBack, onSave }: Props) {
  const knowledge = getPreviewPlantKnowledge();
  const defaultStage = knowledge.stages[0];
  if (!defaultStage) throw new Error("Preview knowledge does not contain a stage");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [plantedAt, setPlantedAt] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [stageId, setStageId] = useState(defaultStage.id);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) {
      setNameError("Hãy đặt tên cho cây");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        speciesId: knowledge.species.id,
        stageId,
        location: location.trim() || null,
        plantedAt,
      });
    } catch {
      setSaveError("Chưa thể lưu cây. Dữ liệu đã nhập vẫn được giữ lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="">
      {onBack ? (
        <TopBar
          backAccessibilityLabel="Quay lại Cây trồng"
          onBack={onBack}
          title={`Thiết lập: ${knowledge.species.title}`}
        />
      ) : (
        <Typography variant="headlineLarge">{`Thiết lập: ${knowledge.species.title}`}</Typography>
      )}

      <FormField error={nameError} label="Tên gọi riêng">
        <TextInput
          accessibilityLabel="Tên gọi riêng"
          autoCapitalize="sentences"
          onChangeText={(value) => {
            setName(value);
            if (nameError) setNameError(null);
          }}
          placeholder="Ví dụ: Nho sân thượng"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={name}
        />
      </FormField>

      <FormField label="Vị trí">
        <TextInput
          accessibilityLabel="Vị trí"
          autoCapitalize="sentences"
          onChangeText={setLocation}
          placeholder="Ví dụ: Ban công hướng Đông"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={location}
        />
      </FormField>

      <FormField label="Ngày bắt đầu trồng">
        <Pressable
          accessibilityLabel="Chọn ngày bắt đầu trồng"
          accessibilityRole="button"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          <Typography color={plantedAt ? "text" : "textSecondary"} variant="bodyLarge">
            {plantedAt ? formatDate(plantedAt) : "Chưa chọn (tùy chọn)"}
          </Typography>
          <Ionicons color={colors.textSecondary} name="calendar-outline" size={20} />
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            locale="vi-VN"
            maximumDate={new Date()}
            mode="date"
            onChange={(_, date) => {
              if (Platform.OS !== "ios") setShowDatePicker(false);
              if (date) setPlantedAt(date.toISOString().split("T")[0] ?? null);
            }}
            value={plantedAt ? new Date(plantedAt) : new Date()}
          />
        )}
        {showDatePicker && Platform.OS === "ios" && (
          <Pressable
            accessibilityLabel="Xong"
            accessibilityRole="button"
            onPress={() => setShowDatePicker(false)}
            style={styles.dateDone}
          >
            <Typography color="primary" variant="bodyLarge">Xong</Typography>
          </Pressable>
        )}
      </FormField>

      <FormField label="Giai đoạn hiện tại">
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
                <Ionicons
                  color={selected ? colors.surface : colors.primary}
                  name={stageIcon(stage.id)}
                  size={18}
                />
                <Typography color={selected ? "surface" : "text"} variant="bodyMedium">
                  {stage.title}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </FormField>

      {saveError ? <Typography accessibilityRole="alert" color="error" variant="bodyMedium">{saveError}</Typography> : null}

      <PrimaryButton label="Lưu cây" loading={saving} onPress={submit} />

      <Typography color="textSecondary" variant="bodyMedium" style={styles.reassurance}>
        Bạn có thể thay đổi các thông tin này bất kỳ lúc nào trong phần cài đặt cây trồng.
      </Typography>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    flexBasis: "48%",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipPressed: { opacity: 0.82 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateButton: {
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
  dateDone: { alignItems: "flex-end", paddingVertical: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  reassurance: { textAlign: "center" },
});
