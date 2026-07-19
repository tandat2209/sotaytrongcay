import { Sprout } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { PlantProfileFields } from "../data/plant-repository";
import type { Plant } from "../models/plant";
import { GrowingMethodField } from "./GrowingMethodField";
import { PlantedAtField } from "./PlantedAtField";

type Props = Readonly<{
  onBack: () => void;
  onSave: (fields: PlantProfileFields) => Promise<void>;
  plant: Plant;
}>;

export function EditPlantScreen({ onBack, onSave, plant }: Props) {
  const [name, setName] = useState(plant.name);
  const [growingMethod, setGrowingMethod] = useState(plant.growingMethod);
  const [plantedAt, setPlantedAt] = useState(plant.plantedAt);
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
      await onSave({ growingMethod, name: name.trim(), plantedAt });
    } catch {
      setSaveError(t("plants.error.save"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen title="">
      <TopBar
        backAccessibilityLabel={t("common.actions.backToPlantDetail")}
        onBack={onBack}
        title={t("plants.edit.title")}
        titleIcon={Sprout}
      />
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
      <Typography color="textSecondary" variant="bodyMedium">
        {t("plants.edit.stageHint")}
      </Typography>
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
        label={t("common.actions.saveChanges")}
        loading={saving}
        onPress={() => void submit()}
      />
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
    paddingHorizontal: spacing.md,
  },
});
