import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import type { PlantKnowledgeStage } from "@/features/knowledge";
import { stageIcon } from "@/features/knowledge/stage-icons";
import { PlantIdentity } from "@/features/plants";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import { JournalPhotoField, type SelectedJournalPhoto } from "./JournalPhotoField";
import { PlantStagePickerSheet } from "./PlantStagePickerSheet";

export type PlantUpdateDraft = Readonly<{
  notes: string | null;
  occurredAt: string;
  photos: readonly SelectedJournalPhoto[];
  stageId: string;
}>;

type Props = Readonly<{
  initialStageId: string;
  onBack: () => void;
  onSave: (draft: PlantUpdateDraft) => Promise<void>;
  plantName: string;
  speciesTitle: string;
  stages: readonly PlantKnowledgeStage[];
}>;

export function PlantUpdateScreen({ initialStageId, onBack, onSave, plantName, speciesTitle, stages }: Props) {
  const [notes, setNotes] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => new Date());
  const [photos, setPhotos] = useState<readonly SelectedJournalPhoto[]>([]);
  const [stageId, setStageId] = useState(initialStageId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStagePicker, setShowStagePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const stage = stages.find((candidate) => candidate.id === stageId);
  const dirty = notes.trim().length > 0 || photos.length > 0 || stageId !== initialStageId;

  function requestBack() {
    if (!dirty) {
      onBack();
      return;
    }
    Alert.alert("Bỏ thay đổi?", "Ảnh và ghi chú chưa lưu sẽ bị mất.", [
      { style: "cancel", text: "Tiếp tục chỉnh sửa" },
      { onPress: onBack, style: "destructive", text: "Bỏ thay đổi" },
    ]);
  }

  async function submit() {
    if (!notes.trim() && photos.length === 0) {
      setError("Thêm ảnh hoặc ghi chú trước khi lưu.");
      return;
    }
    if (occurredAt.getTime() > Date.now()) {
      setError("Thời gian cập nhật không thể ở tương lai.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({ notes: notes.trim() || null, occurredAt: occurredAt.toISOString(), photos, stageId });
    } catch {
      setError("Chưa thể lưu nhật ký. Ảnh và ghi chú vẫn được giữ lại.");
    } finally {
      setSaving(false);
    }
  }

  return <>
    <Screen footer={<PrimaryButton label="Lưu nhật ký" loading={saving} onPress={() => void submit()} />} title="">
      <TopBar backAccessibilityLabel="Quay lại Chi tiết cây" onBack={requestBack} title="Thêm nhật ký" />
      <PlantIdentity name={plantName} size="list" speciesTitle={speciesTitle} stageId={stageId} stageTitle={stage?.title ?? "Chưa xác định"} />
      <FormField label="Ảnh">
        <JournalPhotoField onChange={(value) => { setPhotos(value); setError(null); }} photos={photos} />
      </FormField>
      <FormField label="Thời gian cập nhật">
        <Pressable accessibilityLabel="Chọn thời gian cập nhật" accessibilityRole="button" onPress={() => setShowDatePicker(true)} style={styles.control}>
          <Typography variant="bodyLarge">{occurredAt.toLocaleString("vi-VN")}</Typography>
          <Ionicons color={colors.textSecondary} name="calendar-outline" size={20} />
        </Pressable>
        {showDatePicker ? <DateTimePicker locale="vi-VN" maximumDate={new Date()} mode="datetime" onChange={(_, date) => {
          if (Platform.OS !== "ios") setShowDatePicker(false);
          if (date) setOccurredAt(date);
        }} value={occurredAt} /> : null}
        {showDatePicker && Platform.OS === "ios" ? <Pressable accessibilityLabel="Xong" accessibilityRole="button" onPress={() => setShowDatePicker(false)} style={styles.done}><Typography color="primary" variant="bodyLarge">Xong</Typography></Pressable> : null}
      </FormField>
      <FormField label="Ghi chú (không bắt buộc)">
        <TextInput accessibilityLabel="Ghi chú nhật ký" multiline onChangeText={(value) => { setNotes(value); setError(null); }} placeholder="Ghi lại thay đổi, quan sát hoặc việc đã làm" placeholderTextColor={colors.textSecondary} style={styles.notes} value={notes} />
      </FormField>
      <FormField label="Giai đoạn hiện tại">
        <Pressable accessibilityLabel="Thay đổi giai đoạn hiện tại" accessibilityRole="button" onPress={() => setShowStagePicker(true)} style={styles.control}>
          <View style={styles.stage}><Ionicons color={colors.primary} name={stageIcon(stageId)} size={20} /><Typography variant="bodyLarge">{stage?.title ?? "Chưa xác định"}</Typography></View>
          <Typography color="primary" variant="label">Thay đổi</Typography>
        </Pressable>
      </FormField>
      {error ? <Typography accessibilityRole="alert" color="error" variant="bodyMedium">{error}</Typography> : null}
    </Screen>
    <PlantStagePickerSheet onDismiss={() => setShowStagePicker(false)} onSelect={(value) => { setStageId(value); setShowStagePicker(false); }} selectedStageId={stageId} stages={stages} visible={showStagePicker} />
  </>;
}

const styles = StyleSheet.create({
  control: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", minHeight: 52, paddingHorizontal: spacing.md },
  done: { alignSelf: "flex-end", padding: spacing.sm }, notes: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, color: colors.text, fontSize: 16, lineHeight: 24, minHeight: 120, padding: spacing.md, textAlignVertical: "top" },
  stage: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
