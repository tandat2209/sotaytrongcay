import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays, Sprout } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { StageIcon } from "@/features/knowledge/stage-icons";
import { datePickerLocale, formatDate, t } from "@/shared/i18n";
import { getPreviewPlantKnowledge } from "@/features/knowledge/preview-knowledge";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { Plant } from "../models/plant";

type PlantDraft = Omit<Plant, "id" | "createdAt">;
type Props = {
  onBack?: () => void;
  onSave: (draft: PlantDraft) => Promise<void>;
};

export function CreatePlantScreen({ onBack, onSave }: Props) {
  const knowledge = getPreviewPlantKnowledge();
  const defaultStage = knowledge.stages[0];
  if (!defaultStage)
    throw new Error("Preview knowledge does not contain a stage");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [growingMethod, setGrowingMethod] =
    useState<Plant["growingMethod"]>("container");
  const [plantedAt, setPlantedAt] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [stageId, setStageId] = useState(defaultStage.id);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) {
      setNameError(t("plants.validation.name"));
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        speciesId: knowledge.species.id,
        stageId,
        growingMethod,
        location: location.trim() || null,
        plantedAt,
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

      <FormField label={t("plants.create.location")}>
        <TextInput
          accessibilityLabel={t("plants.create.location")}
          autoCapitalize="sentences"
          onChangeText={setLocation}
          placeholder={t("plants.create.locationPlaceholder")}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={location}
        />
      </FormField>

      <FormField label={t("plants.create.growingMethod")}>
        <View accessibilityRole="radiogroup" style={styles.chips}>
          {[
            { value: "container", label: t("plants.method.container") },
            { value: "ground", label: t("plants.method.ground") },
          ].map((method) => {
            const selected = method.value === growingMethod;
            return (
              <Pressable
                accessibilityLabel={t(
                  "plants.create.growingMethodAccessibility",
                  { method: method.label },
                )}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={method.value}
                onPress={() =>
                  setGrowingMethod(method.value as Plant["growingMethod"])
                }
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
              >
                <Typography
                  color={selected ? "surface" : "text"}
                  variant="bodyMedium"
                >
                  {method.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </FormField>

      <FormField label={t("plants.create.dateLabel")}>
        <Pressable
          accessibilityLabel={t("plants.create.dateAccessibility")}
          accessibilityRole="button"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          <Typography
            color={plantedAt ? "text" : "textSecondary"}
            variant="bodyLarge"
          >
            {plantedAt
              ? formatDate(new Date(`${plantedAt}T00:00:00`))
              : t("plants.create.dateEmpty")}
          </Typography>
          <CalendarDays color={colors.textSecondary} size={20} />
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            locale={datePickerLocale}
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
            accessibilityLabel={t("common.actions.done")}
            accessibilityRole="button"
            onPress={() => setShowDatePicker(false)}
            style={styles.dateDone}
          >
            <Typography color="primary" variant="bodyLarge">
              {t("common.actions.done")}
            </Typography>
          </Pressable>
        )}
      </FormField>

      <FormField label={t("plants.create.stage")}>
        <View accessibilityRole="radiogroup" style={styles.chips}>
          {knowledge.stages.map((stage) => {
            const selected = stage.id === stageId;
            return (
              <Pressable
                accessibilityLabel={t(
                  "journal.stagePicker.selectAccessibility",
                  { stage: stage.title },
                )}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={stage.id}
                onPress={() => setStageId(stage.id)}
                style={({ pressed }) => [
                  styles.chip,
                  selected && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
              >
                <StageIcon
                  color={selected ? colors.surface : colors.primary}
                  size={18}
                  stageId={stage.id}
                />
                <Typography
                  color={selected ? "surface" : "text"}
                  variant="bodyMedium"
                >
                  {stage.title}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </FormField>

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
        onPress={submit}
      />

      <Typography
        color="textSecondary"
        variant="bodyMedium"
        style={styles.reassurance}
      >
        {t("plants.create.reassurance")}
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
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
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
