import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, control, radius, spacing, typography } from "./theme";

type PrimaryButtonProps = {
  backgroundColor?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  loading?: boolean;
  textColor?: string;
};

export function PrimaryButton({
  backgroundColor = colors.primary,
  disabled = false,
  label,
  loading = false,
  onPress,
  textColor = colors.surface,
}: PrimaryButtonProps) {
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: unavailable }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        unavailable && styles.disabled,
        pressed && !unavailable && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.medium,
    justifyContent: "center",
    minHeight: control.primaryHeight,
    paddingHorizontal: spacing.base,
  },
  label: { ...typography.bodyStrong, color: colors.surface },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.82 },
});
