import { Check, ListFilter } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { t } from "@/shared/i18n";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import type { FertilizerGroup } from "../models/user-fertilizer";
import {
  FERTILIZER_GROUP_ICONS,
  FERTILIZER_GROUPS,
} from "./fertilizer-group-visual";

type Props = Readonly<{
  onChange: (group: FertilizerGroup | null) => void;
  onDismiss: () => void;
  value: FertilizerGroup | null;
  visible: boolean;
}>;

export function FertilizerGroupFilterSheet({
  onChange,
  onDismiss,
  value,
  visible,
}: Props) {
  const select = (group: FertilizerGroup | null) => {
    onChange(group);
    onDismiss();
  };

  return (
    <BottomSheet
      onDismiss={onDismiss}
      title={
        <View style={styles.title}>
          <ListFilter color={colors.primary} size={20} />
          <Typography variant="headlineSmall">
            {t("fertilizers.management.filterTitle")}
          </Typography>
        </View>
      }
      visible={visible}
    >
      <View accessibilityRole="radiogroup" style={styles.options}>
        <FilterOption
          icon={ListFilter}
          label={t("fertilizers.management.filterAll")}
          onPress={() => select(null)}
          selected={value === null}
        />
        {FERTILIZER_GROUPS.map((group) => (
          <FilterOption
            icon={FERTILIZER_GROUP_ICONS[group]}
            key={group}
            label={t(`fertilizers.group.${group}`)}
            onPress={() => select(group)}
            selected={value === group}
          />
        ))}
      </View>
    </BottomSheet>
  );
}

function FilterOption({
  icon: Icon,
  label,
  onPress,
  selected,
}: Readonly<{
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  selected: boolean;
}>) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.option, selected && styles.selected]}
    >
      <View style={styles.optionLabel}>
        <Icon
          color={selected ? colors.surface : colors.textSecondary}
          size={18}
        />
        <Typography color={selected ? "surface" : "text"} variant="bodyLarge">
          {label}
        </Typography>
      </View>
      {selected ? <Check color={colors.surface} size={20} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.control,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: spacing.base,
  },
  optionLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  options: { gap: spacing.sm },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  title: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
});
