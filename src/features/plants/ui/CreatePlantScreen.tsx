import { Sprout } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import {
  JournalPhotoField,
  type SelectedJournalPhoto,
} from "@/features/journal";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { Plant } from "../models/plant";
import { GrowingMethodField } from "./GrowingMethodField";
import { PlantStageSelectField } from "./PlantStageSelectField";
import { PlantedAtField } from "./PlantedAtField";

export type CreatePlantDraft = Omit<Plant, "id" | "createdAt"> &
  Readonly<{ initialPhoto: SelectedJournalPhoto | null }>;

type Props = Readonly<{
  onBack?: () => void;
  onSave: (draft: CreatePlantDraft) => Promise<void>;
}>;

export function CreatePlantScreen({ onBack, onSave }: Props) {
  const knowledge = getPreviewPlantKnowledge();
  const defaultStage = knowledge.stages[0];
  if (!defaultStage)
    throw new Error("Preview knowledge does not contain a stage");

  const [name, setName] = useState("");
  const [growingMethod, setGrowingMethod] =
    useState<Plant["growingMethod"]>("container");
  const [initialPhotos, setInitialPhotos] = useState<
    readonly SelectedJournalPhoto[]
  >([]);
  const [plantedAt, setPlantedAt] = useState<string | null>(null);
  const [stageId, setStageId] = useState(defaultStage.id);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) {
      setNameError(t("plants.validation.name"));
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      await onSave({
        growingMethod,
        initialPhoto: initialPhotos[0] ?? null,
        location: null,
        name: name.trim(),
        plantedAt,
        speciesId: knowledge.species.id,
        stageId,
        stageStartedAt: null,
      });
    } catch {
      setSaveError(t("plants.error.save"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="">
      {onBack ? (
        <TopBar
          backAccessibilityLabel={t("common.actions.backToPlants")}
          onBack={onBack}
          title={t("plants.create.title", { species: knowledge.species.title })}
          titleIcon={Sprout}
        />
      ) : (
        <Typography variant="headlineLarge">
          {t("plants.create.title", { species: knowledge.species.title })}
        </Typography>
      )}

      <FormField label={t("plants.create.photo")}>
        <JournalPhotoField
          description={t("plants.create.photoHint")}
          maximumPhotos={1}
          onChange={setInitialPhotos}
          photos={initialPhotos}
        />
      </FormField>

      <FormField error={nameError} label={t("plants.create.name")}>
        <TextInput
          accessibilityLabel={t("plants.create.name")}
          autoCapitalize="sentences"
          onChangeText={(value) => {
            setName(value);
            if (nameError) setNameError(null);
          }}
          placeholder={t("plants.create.namePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={name}
        />
      </FormField>

      <GrowingMethodField onChange={setGrowingMethod} value={growingMethod} />
      <PlantedAtField onChange={setPlantedAt} value={plantedAt} />
      <PlantStageSelectField
        onChange={setStageId}
        stages={knowledge.stages}
        value={stageId}
      />

      {saveError ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {saveError}
        </Typography>
      ) : null}

      <PrimaryButton
        label={t("plants.create.save")}
        loading={saving}
        onPress={() => void submit()}
      />
      <Typography
        color="textSecondary"
        style={styles.reassurance}
        variant="bodyMedium"
      >
        {t("plants.create.reassurance")}
      </Typography>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
    paddingHorizontal: spacing.base,
  },
  reassurance: { textAlign: "center" },
});
