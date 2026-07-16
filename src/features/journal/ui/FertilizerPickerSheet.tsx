import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  CirclePlus,
  FlaskConical,
  Grid3X3,
  Leaf,
  Package,
  type LucideIcon,
} from "lucide-react-native";
import type { FertilizerGroup, UserFertilizer } from "@/features/fertilizers";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { FormField } from "@/shared/ui/FormField";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { SelectableChip } from "@/shared/ui/SelectableChip";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  fertilizers: readonly UserFertilizer[];
  failed: boolean;
  loading: boolean;
  onCreate: (fields: CreateFertilizerFields) => Promise<void>;
  onDismiss: () => void;
  onRetry: () => void;
  onSelect: (fertilizer: UserFertilizer) => void;
  startInCreateMode: boolean;
  visible: boolean;
}>;

export type CreateFertilizerFields = Readonly<{
  group: FertilizerGroup;
  name: string;
}>;

const GROUPS: readonly FertilizerGroup[] = [
  "organic",
  "npk",
  "single",
  "supplement",
  "other",
];

const GROUP_ICONS: Readonly<Record<FertilizerGroup, LucideIcon>> = {
  organic: Leaf,
  npk: Grid3X3,
  single: FlaskConical,
  supplement: CirclePlus,
  other: Package,
};

export function FertilizerPickerSheet({
  fertilizers,
  failed,
  loading,
  onCreate,
  onDismiss,
  onRetry,
  onSelect,
  startInCreateMode,
  visible,
}: Props) {
  const [adding, setAdding] = useState(startInCreateMode);
  const [group, setGroup] = useState<FertilizerGroup | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!name.trim()) {
      setError(t("fertilizers.validation.name"));
      return;
    }
    if (!group) {
      setError(t("fertilizers.validation.group"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onCreate({ group, name: name.trim() });
      setName("");
      setGroup(null);
      setAdding(false);
    } catch {
      setError(t("fertilizers.error.save"));
    } finally {
      setSaving(false);
    }
  }
  return (
    <BottomSheet
      footer={
        adding ? (
          <PrimaryButton
            label={t("fertilizers.editor.save")}
            loading={saving}
            onPress={() => void create()}
          />
        ) : (
          <PrimaryButton
            label={t("fertilizers.management.add")}
            onPress={() => setAdding(true)}
          />
        )
      }
      onDismiss={onDismiss}
      title={t("journal.fertilizing.selectTitle")}
      visible={visible}
    >
      {adding ? (
        <View style={styles.form}>
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
          <FormField
            error={error === t("fertilizers.validation.group") ? error : null}
            label={t("fertilizers.editor.groupRequired")}
          >
            <View style={styles.groups}>
              {GROUPS.map((value) => {
                const selected = group === value;
                const GroupIcon = GROUP_ICONS[value];
                return (
                  <SelectableChip
                    accessibilityLabel={`${t(`fertilizers.group.${value}`)}, ${selected ? "đã chọn" : "chưa chọn"}`}
                    icon={GroupIcon}
                    label={t(`fertilizers.group.${value}`)}
                    key={value}
                    onPress={() => setGroup(value)}
                    role="radio"
                    selected={selected}
                  />
                );
              })}
            </View>
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
        </View>
      ) : loading ? (
        <Typography color="textSecondary" variant="bodyLarge">
          {t("common.state.loadingDeviceData")}
        </Typography>
      ) : failed ? (
        <View style={styles.form}>
          <Typography
            accessibilityRole="alert"
            color="error"
            variant="bodyLarge"
          >
            {t("fertilizers.error.load")}
          </Typography>
          <PrimaryButton label={t("common.actions.retry")} onPress={onRetry} />
        </View>
      ) : fertilizers.length === 0 ? (
        <Typography color="textSecondary" variant="bodyLarge">
          {t("fertilizers.management.empty")}
        </Typography>
      ) : (
        <View style={styles.list}>
          {fertilizers.map((fertilizer) => (
            <Pressable
              accessibilityRole="button"
              key={fertilizer.id}
              onPress={() => onSelect(fertilizer)}
            >
              <SurfaceCard style={styles.item}>
                <Typography variant="bodyLarge">{fertilizer.name}</Typography>
                {fertilizer.npk ? (
                  <Typography color="textSecondary" variant="bodyMedium">
                    {fertilizer.npk}
                  </Typography>
                ) : null}
              </SurfaceCard>
            </Pressable>
          ))}
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  groups: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  input: {
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  item: { gap: spacing.xs, minHeight: 56 },
  list: { gap: spacing.sm },
});
