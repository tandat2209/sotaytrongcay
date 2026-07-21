import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import type {
  FertilizerGroup,
  UserFertilizer,
} from "../models/user-fertilizer";
import { t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { SelectableChip } from "@/shared/ui/SelectableChip";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import {
  FERTILIZER_GROUP_ICONS,
  FERTILIZER_GROUPS,
} from "./fertilizer-group-visual";

export type UserFertilizerFields = Readonly<{
  group: FertilizerGroup | null;
  name: string;
}>;

type FormState = Readonly<{
  error: string | null;
  group: FertilizerGroup | null;
  name: string;
  reset: () => void;
  saving: boolean;
  setGroup: (group: FertilizerGroup | null) => void;
  setName: (name: string) => void;
  submit: () => Promise<boolean>;
}>;

export function useUserFertilizerForm(
  onSave: (fields: UserFertilizerFields) => Promise<void>,
  fertilizer?: UserFertilizer,
): FormState {
  const [name, setName] = useState(fertilizer?.name ?? "");
  const [group, setGroup] = useState<FertilizerGroup | null>(
    fertilizer?.group ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) {
      setError(t("fertilizers.validation.name"));
      return false;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({ group, name: name.trim() });
      return true;
    } catch {
      setError(t("fertilizers.error.save"));
      return false;
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setName("");
    setGroup(null);
    setError(null);
  }

  return { error, group, name, reset, saving, setGroup, setName, submit };
}

export function UserFertilizerForm({ form }: Readonly<{ form: FormState }>) {
  return (
    <View style={styles.form}>
      <FormField
        error={
          form.error === t("fertilizers.validation.name") ? form.error : null
        }
        label={t("fertilizers.editor.name")}
      >
        <TextInput
          accessibilityLabel={t("fertilizers.editor.name")}
          onChangeText={form.setName}
          placeholder={t("fertilizers.editor.namePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={form.name}
        />
      </FormField>
      <FormField label={t("fertilizers.editor.group")}>
        <View style={styles.groups}>
          {FERTILIZER_GROUPS.map((group) => (
            <SelectableChip
              accessibilityLabel={t(`fertilizers.group.${group}`)}
              icon={FERTILIZER_GROUP_ICONS[group]}
              key={group}
              label={t(`fertilizers.group.${group}`)}
              onPress={() => form.setGroup(form.group === group ? null : group)}
              role="radio"
              selected={form.group === group}
            />
          ))}
        </View>
      </FormField>
      {form.error === t("fertilizers.error.save") ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {form.error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.base },
  groups: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.base,
  },
});
