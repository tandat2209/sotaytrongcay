import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import { colors, control, radius } from "./theme";


type IconButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: LucideIcon;
  onPress: () => void;
};

export function IconButton({ accessibilityLabel, disabled = false, icon: Icon, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
    >
      <Icon color={colors.text} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.round,
    height: control.iconTarget,
    justifyContent: "center",
    width: control.iconTarget,
  },
  disabled: { opacity: 0.45 },
  pressed: { backgroundColor: colors.surfaceSubtle },
});
