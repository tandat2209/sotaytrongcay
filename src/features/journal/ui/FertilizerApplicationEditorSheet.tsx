import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type {
  FertilizerAmountUnit,
  FertilizerApplicationMethod,
} from "../models/fertilizer-application";
import type { FertilizerApplicationDetails } from "./FertilizingApplicationsSection";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

const METHODS: readonly FertilizerApplicationMethod[] = [
  "root",
  "drench",
  "foliar",
  "topdress",
];
const UNITS: readonly FertilizerAmountUnit[] = [
  "handful",
  "spoon",
  "cap",
  "gram",
  "milliliter",
  "other",
];

type Props = Readonly<{
  application: FertilizerApplicationDetails | null;
  onDismiss: () => void;
  onRemove: () => void;
  onSave: (application: FertilizerApplicationDetails) => void;
}>;

export function FertilizerApplicationEditorSheet({
  application,
  onDismiss,
  onRemove,
  onSave,
}: Props) {
  const [amount, setAmount] = useState(
    application?.amountValue?.toString() ?? "",
  );
  const [unit, setUnit] = useState<FertilizerAmountUnit | null>(
    application?.amountUnit ?? null,
  );
  const [method, setMethod] = useState<FertilizerApplicationMethod | null>(
    application?.applicationMethod ?? null,
  );
  const [notes, setNotes] = useState(application?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  if (!application) return null;
  const current: FertilizerApplicationDetails = application;
  function submit() {
    const value = amount.trim() ? Number(amount.replace(",", ".")) : null;
    if (value !== null && (!Number.isFinite(value) || value <= 0 || !unit)) {
      setError(t("journal.validation.fertilizerAmount"));
      return;
    }
    onSave({
      ...current,
      amountValue: value,
      amountUnit: value === null ? null : unit,
      applicationMethod: method,
      notes: notes.trim() || null,
    });
  }
  return (
    <BottomSheet
      footer={
        <PrimaryButton label={t("common.actions.done")} onPress={submit} />
      }
      onDismiss={onDismiss}
      title={current.nameSnapshot}
      visible
    >
      <FormField label={t("journal.fertilizing.method")}>
        <View style={styles.chips}>
          {METHODS.map((value) => (
            <Chip
              key={value}
              label={t(`journal.fertilizing.method.${value}`)}
              onPress={() => setMethod(method === value ? null : value)}
              selected={method === value}
            />
          ))}
        </View>
      </FormField>
      <FormField error={error} label={t("journal.fertilizing.amount")}>
        <TextInput
          accessibilityLabel={t("journal.fertilizing.amount")}
          inputMode="decimal"
          onChangeText={setAmount}
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={amount}
        />
        <View style={styles.chips}>
          {UNITS.map((value) => (
            <Chip
              key={value}
              label={t(`journal.fertilizing.unit.${value}`)}
              onPress={() => setUnit(unit === value ? null : value)}
              selected={unit === value}
            />
          ))}
        </View>
      </FormField>
      <FormField label={t("journal.fertilizing.itemNotes")}>
        <TextInput
          accessibilityLabel={t("journal.fertilizing.itemNotes")}
          multiline
          onChangeText={setNotes}
          placeholder={t("journal.careEntry.notesPlaceholder")}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, styles.notes]}
          value={notes}
        />
      </FormField>
      <Pressable
        accessibilityRole="button"
        onPress={onRemove}
        style={styles.remove}
      >
        <Typography color="error" variant="bodyLarge">
          {t("journal.fertilizing.remove")}
        </Typography>
      </Pressable>
    </BottomSheet>
  );
}

function Chip({
  label,
  onPress,
  selected,
}: Readonly<{ label: string; onPress: () => void; selected: boolean }>) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.selected : null]}
    >
      <Typography color={selected ? "primary" : "text"} variant="bodyMedium">
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderColor: colors.border,
    borderRadius: radius.round,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  input: {
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  notes: { minHeight: 96, paddingTop: spacing.md, textAlignVertical: "top" },
  remove: { alignItems: "center", minHeight: 48, padding: spacing.md },
  selected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
});
