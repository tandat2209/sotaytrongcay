import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays, NotebookPen } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import type { PlantKnowledgeStage } from "@/features/knowledge";
import { datePickerLocale, formatDateTime, t } from "@/shared/i18n";
import { StageIcon } from "@/features/knowledge/stage-icons";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import {
  JournalPhotoField,
  type SelectedJournalPhoto,
} from "./JournalPhotoField";
import { PlantStagePickerSheet } from "./PlantStagePickerSheet";
import type { PlantIdentityComponent } from "./plant-identity-types";

export type PlantUpdateDraft = Readonly<{
  notes: string | null;
  occurredAt: string;
  photos: readonly SelectedJournalPhoto[];
  stageId: string;
}>;

type Props = Readonly<{
  imageUri?: string | null;
  initialStageId: string;
  onBack: () => void;
  onSave: (draft: PlantUpdateDraft) => Promise<void>;
  plantIdentityComponent: PlantIdentityComponent;
  plantName: string;
  speciesTitle: string;
  stages: readonly PlantKnowledgeStage[];
}>;

export function PlantUpdateScreen({
  imageUri,
  initialStageId,
  onBack,
  onSave,
  plantIdentityComponent: PlantIdentityComponent,
  plantName,
  speciesTitle,
  stages,
}: Props) {
  const [notes, setNotes] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => new Date());
  const [photos, setPhotos] = useState<readonly SelectedJournalPhoto[]>([]);
  const [stageId, setStageId] = useState(initialStageId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStagePicker, setShowStagePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const stage = stages.find((candidate) => candidate.id === stageId);
  const dirty =
    notes.trim().length > 0 || photos.length > 0 || stageId !== initialStageId;

  function requestBack() {
    if (!dirty) {
      onBack();
      return;
    }
    Alert.alert(
      t("journal.update.discardTitle"),
      t("journal.update.discardBody"),
      [
        { style: "cancel", text: t("journal.update.keepEditing") },
        {
          onPress: onBack,
          style: "destructive",
          text: t("journal.update.discardAction"),
        },
      ],
    );
  }

  async function submit() {
    if (!notes.trim() && photos.length === 0) {
      setError(t("journal.update.validationContent"));
      return;
    }
    if (occurredAt.getTime() > Date.now()) {
      setError(t("journal.validation.futureUpdate"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({
        notes: notes.trim() || null,
        occurredAt: occurredAt.toISOString(),
        photos,
        stageId,
      });
    } catch {
      setError(t("journal.error.saveUpdate"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Screen
        footer={
          <PrimaryButton
            label={t("journal.update.save")}
            loading={saving}
            onPress={() => void submit()}
          />
        }
        title=""
      >
        <TopBar
          backAccessibilityLabel={t("common.actions.backToPlantDetail")}
          onBack={requestBack}
          title={t("journal.update.title")}
          titleIcon={NotebookPen}
        />
        <PlantIdentityComponent
          imageUri={imageUri ?? null}
          name={plantName}
          size="list"
          speciesTitle={speciesTitle}
          stageId={stageId}
          stageTitle={stage?.title ?? t("common.fallback.unknown")}
        />
        <FormField label={t("journal.update.images")}>
          <JournalPhotoField
            onChange={(value) => {
              setPhotos(value);
              setError(null);
            }}
            photos={photos}
          />
        </FormField>
        <FormField label={t("journal.update.dateLabel")}>
          <Pressable
            accessibilityLabel={t("journal.update.dateAccessibility")}
            accessibilityRole="button"
            onPress={() => setShowDatePicker(true)}
            style={styles.control}
          >
            <Typography variant="bodyLarge">
              {formatDateTime(occurredAt)}
            </Typography>
            <CalendarDays color={colors.textSecondary} size={20} />
          </Pressable>
          {showDatePicker ? (
            <DateTimePicker
              locale={datePickerLocale}
              maximumDate={new Date()}
              mode="datetime"
              onChange={(_, date) => {
                if (Platform.OS !== "ios") setShowDatePicker(false);
                if (date) setOccurredAt(date);
              }}
              value={occurredAt}
            />
          ) : null}
          {showDatePicker && Platform.OS === "ios" ? (
            <Pressable
              accessibilityLabel={t("common.actions.done")}
              accessibilityRole="button"
              onPress={() => setShowDatePicker(false)}
              style={styles.done}
            >
              <Typography color="primary" variant="bodyLarge">
                {t("common.actions.done")}
              </Typography>
            </Pressable>
          ) : null}
        </FormField>
        <FormField label={t("journal.careEntry.notesLabel")}>
          <TextInput
            accessibilityLabel={t("journal.update.notesAccessibility")}
            multiline
            onChangeText={(value) => {
              setNotes(value);
              setError(null);
            }}
            placeholder={t("journal.update.notesPlaceholder")}
            placeholderTextColor={colors.textSecondary}
            style={styles.notes}
            value={notes}
          />
        </FormField>
        <FormField label={t("journal.update.currentStage")}>
          <Pressable
            accessibilityLabel={t("journal.update.changeStageAccessibility")}
            accessibilityRole="button"
            onPress={() => setShowStagePicker(true)}
            style={styles.control}
          >
            <View style={styles.stage}>
              <StageIcon color={colors.primary} size={20} stageId={stageId} />
              <Typography variant="bodyLarge">
                {stage?.title ?? t("common.fallback.unknown")}
              </Typography>
            </View>
            <Typography color="primary" variant="label">
              {t("journal.update.changeStage")}
            </Typography>
          </Pressable>
        </FormField>
        {error ? (
          <Typography
            accessibilityRole="alert"
            color="error"
            variant="bodyMedium"
          >
            {error}
          </Typography>
        ) : null}
      </Screen>
      <PlantStagePickerSheet
        onDismiss={() => setShowStagePicker(false)}
        onSelect={(value) => {
          setStageId(value);
          setShowStagePicker(false);
        }}
        selectedStageId={stageId}
        stages={stages}
        visible={showStagePicker}
      />
    </>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  done: { alignSelf: "flex-end", padding: spacing.sm },
  notes: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    padding: spacing.md,
    textAlignVertical: "top",
  },
  stage: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
