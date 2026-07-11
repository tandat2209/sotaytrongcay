import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";
import { colors, control, radius } from "./theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

type IconButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: IconName;
  onPress: () => void;
};

export function IconButton({ accessibilityLabel, disabled = false, icon, onPress }: IconButtonProps) {
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
      <Ionicons color={colors.text} name={icon} size={22} />
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
