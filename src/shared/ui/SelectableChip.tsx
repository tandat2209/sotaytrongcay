import { Pressable, StyleSheet, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { Typography } from "./Typography";
import { colors, radius, spacing } from "./theme";

type Props = Readonly<{
  accessibilityLabel: string;
  accent?: boolean;
  icon?: LucideIcon;
  label: string;
  onPress: () => void;
  role?: "button" | "radio";
  selected: boolean;
  selectedPrefix?: string;
  selectedTone?: "soft" | "solid";
  unselectedPrefix?: string;
}>;

export function SelectableChip({
  accessibilityLabel,
  accent = false,
  icon: Icon,
  label,
  onPress,
  role = "button",
  selected,
  selectedPrefix = "",
  selectedTone = "soft",
  unselectedPrefix = "",
}: Props) {
  const solidSelected = selected && selectedTone === "solid";
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={role}
      accessibilityState={{ selected }}
      hitSlop={4}
      onPress={onPress}
      style={[
        styles.chip,
        accent && !selected && styles.accentChip,
        selected &&
          (solidSelected ? styles.solidSelectedChip : styles.selectedChip),
      ]}
    >
      <View style={styles.content}>
        {Icon ? (
          <Icon
            color={
              solidSelected
                ? colors.surface
                : selected || accent
                  ? colors.primary
                  : colors.textSecondary
            }
            size={16}
          />
        ) : null}
        <Typography
          color={
            solidSelected ? "surface" : selected || accent ? "primary" : "text"
          }
          variant="bodyMedium"
        >
          {selected ? selectedPrefix : unselectedPrefix}
          {label}
        </Typography>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.round,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: spacing.xs,
  },
  accentChip: { borderColor: colors.primary },
  content: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  selectedChip: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  solidSelectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
