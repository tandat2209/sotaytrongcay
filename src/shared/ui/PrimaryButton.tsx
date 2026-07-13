import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "./theme";

type PrimaryButtonProps = {
  backgroundColor?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  loading?: boolean;
};

export function PrimaryButton({ backgroundColor = colors.primary, disabled = false, label, loading = false, onPress }: PrimaryButtonProps) {
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: unavailable }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor }, unavailable && styles.disabled, pressed && !unavailable && styles.pressed]}
    >
      {loading ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.control,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  label: { color: colors.surface, fontSize: 16, fontWeight: "600" },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.82 },
});
