import { Check, ChevronDown, X } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  FERTILIZER_GROUP_ICONS,
  FERTILIZER_GROUPS,
  useUserFertilizerForm,
  type UserFertilizerFields,
} from "@/features/fertilizers";
import { t } from "@/shared/i18n";
import { IconButton } from "@/shared/ui/IconButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  onCancel: () => void;
  onCreate: (fields: UserFertilizerFields) => Promise<void>;
  onCreated: () => void;
}>;

export function CompactFertilizerCreator({
  onCancel,
  onCreate,
  onCreated,
}: Props) {
  const form = useUserFertilizerForm(onCreate);
  const [groupsVisible, setGroupsVisible] = useState(false);
  const GroupIcon = form.group ? FERTILIZER_GROUP_ICONS[form.group] : null;
  const groupLabel = form.group
    ? t(`fertilizers.group.${form.group}`)
    : t("journal.fertilizing.groupPlaceholder");

  async function submit() {
    if (!form.group) return;
    if (await form.submit()) onCreated();
  }

  return (
    <View style={styles.creator}>
      <View style={styles.heading}>
        <Typography variant="headlineSmall">
          {t("fertilizers.editor.addTitle")}
        </Typography>
        <IconButton
          accessibilityLabel={t("common.actions.cancel")}
          icon={X}
          onPress={onCancel}
        />
      </View>
      <View style={styles.entryRow}>
        <TextInput
          accessibilityLabel={t("fertilizers.editor.name")}
          autoFocus
          onChangeText={form.setName}
          onFocus={() => setGroupsVisible(false)}
          onSubmitEditing={() => void submit()}
          placeholder={t("fertilizers.editor.namePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          returnKeyType="done"
          style={styles.input}
          value={form.name}
        />
        <Pressable
          accessibilityLabel={t("journal.fertilizing.chooseGroup")}
          accessibilityRole="combobox"
          accessibilityState={{ expanded: groupsVisible }}
          accessibilityValue={{ text: groupLabel }}
          onPress={() => {
            Keyboard.dismiss();
            setGroupsVisible((visible) => !visible);
          }}
          style={styles.groupControl}
        >
          {GroupIcon ? <GroupIcon color={colors.primary} size={16} /> : null}
          <Typography
            color={form.group ? "primary" : "textSecondary"}
            variant="label"
          >
            {groupLabel}
          </Typography>
          <ChevronDown color={colors.textSecondary} size={16} />
        </Pressable>
        <IconButton
          accessibilityLabel={t("fertilizers.editor.save")}
          disabled={!form.name.trim() || !form.group || form.saving}
          icon={Check}
          onPress={() => void submit()}
        />
      </View>
      {groupsVisible ? (
        <View accessibilityRole="radiogroup" style={styles.groupOptions}>
          {FERTILIZER_GROUPS.map((group, index) => {
            const Icon = FERTILIZER_GROUP_ICONS[group];
            const selected = form.group === group;
            return (
              <Pressable
                accessibilityLabel={t(`fertilizers.group.${group}`)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={group}
                onPress={() => {
                  form.setGroup(group);
                  setGroupsVisible(false);
                }}
                style={({ pressed }) => [
                  styles.groupOption,
                  index < FERTILIZER_GROUPS.length - 1 &&
                    styles.groupOptionBorder,
                  selected && styles.groupOptionSelected,
                  pressed && styles.groupOptionPressed,
                ]}
              >
                <View style={styles.groupOptionLabel}>
                  <Icon color={colors.primary} size={18} />
                  <Typography variant="bodyMedium">
                    {t(`fertilizers.group.${group}`)}
                  </Typography>
                </View>
                {selected ? <Check color={colors.primary} size={18} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
      {form.error ? (
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
  creator: { gap: spacing.sm },
  entryRow: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    paddingRight: spacing.xs,
  },
  groupControl: {
    alignItems: "center",
    borderLeftColor: colors.border,
    borderLeftWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  groupOption: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  groupOptionBorder: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  groupOptionLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  groupOptionPressed: { backgroundColor: colors.surfaceSubtle },
  groupOptionSelected: { backgroundColor: colors.primarySoft },
  groupOptions: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    overflow: "hidden",
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
});
