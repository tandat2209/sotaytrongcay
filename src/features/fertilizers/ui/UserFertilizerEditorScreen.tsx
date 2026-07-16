import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import type {
  FertilizerGroup,
  UserFertilizer,
} from "../models/user-fertilizer";
import { t } from "@/shared/i18n";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { TopBar } from "@/shared/ui/TopBar";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

const GROUPS: readonly FertilizerGroup[] = [
  "organic",
  "npk",
  "single",
  "supplement",
  "other",
];

export type UserFertilizerFields = Readonly<{
  group: FertilizerGroup | null;
  name: string;
  npk: string | null;
}>;

type Props = Readonly<{
  fertilizer?: UserFertilizer;
  onBack: () => void;
  onDelete?: () => Promise<void>;
  onSave: (fields: UserFertilizerFields) => Promise<void>;
}>;

export function UserFertilizerEditorScreen({
  fertilizer,
  onBack,
  onDelete,
  onSave,
}: Props) {
  const [name, setName] = useState(fertilizer?.name ?? "");
  const [group, setGroup] = useState<FertilizerGroup | null>(
    fertilizer?.group ?? null,
  );
  const [npk, setNpk] = useState(fertilizer?.npk ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) {
      setError(t("fertilizers.validation.name"));
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({ group, name: name.trim(), npk: npk.trim() || null });
    } catch {
      setError(t("fertilizers.error.save"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen
      footer={
        <PrimaryButton
          label={t("fertilizers.editor.save")}
          loading={saving}
          onPress={() => void submit()}
        />
      }
      title=""
    >
      <TopBar
        onBack={onBack}
        title={
          fertilizer
            ? t("fertilizers.editor.editTitle")
            : t("fertilizers.editor.addTitle")
        }
      />
      <FormField
        error={error === t("fertilizers.validation.name") ? error : null}
        label={t("fertilizers.editor.name")}
      >
        <TextInput
          accessibilityLabel={t("fertilizers.editor.name")}
          onChangeText={setName}
          placeholder={t("fertilizers.editor.namePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={name}
        />
      </FormField>
      <FormField label={t("fertilizers.editor.group")}>
        <View style={styles.groups}>
          {GROUPS.map((value) => {
            const selected = value === group;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                key={value}
                onPress={() => setGroup(selected ? null : value)}
                style={[styles.chip, selected ? styles.selectedChip : null]}
              >
                <Typography
                  color={selected ? "primary" : "text"}
                  variant="bodyMedium"
                >
                  {t(`fertilizers.group.${value}`)}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </FormField>
      <FormField label={t("fertilizers.editor.npk")}>
        <TextInput
          accessibilityLabel={t("fertilizers.editor.npk")}
          onChangeText={setNpk}
          placeholder={t("fertilizers.editor.npkPlaceholder")}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          value={npk}
        />
      </FormField>
      {error === t("fertilizers.error.save") ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {error}
        </Typography>
      ) : null}
      {onDelete ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => void onDelete()}
          style={styles.delete}
        >
          <Typography color="error" variant="bodyLarge">
            {t("fertilizers.editor.delete")}
          </Typography>
        </Pressable>
      ) : null}
    </Screen>
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
  delete: { alignItems: "center", minHeight: 48, padding: spacing.md },
  groups: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  selectedChip: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
});
