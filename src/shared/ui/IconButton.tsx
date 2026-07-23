import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, control, radius } from "./theme";

type IconButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: LucideIcon;
  onPress: () => void;
  selected?: boolean;
};

export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon: Icon,
  onPress,
  selected,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{
        disabled,
        ...(selected === undefined ? {} : { selected }),
      }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.selected,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Icon color={selected ? colors.primary : colors.text} size={22} />
      {selected ? <View style={styles.activeDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activeDot: {
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: radius.round,
    borderWidth: 2,
    height: 9,
    position: "absolute",
    right: 7,
    top: 7,
    width: 9,
  },
  button: {
    alignItems: "center",
    borderRadius: radius.round,
    height: control.iconTarget,
    justifyContent: "center",
    width: control.iconTarget,
  },
  disabled: { opacity: 0.45 },
  pressed: { backgroundColor: colors.surfaceMuted },
  selected: { backgroundColor: colors.primarySoft },
});
