import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { spacing } from "./theme";

type FormFieldProps = PropsWithChildren<{
  error?: string | null;
  label: string;
  supportingText?: ReactNode;
}>;

export function FormField({
  children,
  error,
  label,
  supportingText,
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Typography variant="label">{label}</Typography>
      {children}
      {supportingText ? (
        <Typography color="textSecondary" variant="bodyMedium">
          {supportingText}
        </Typography>
      ) : null}
      {error ? (
        <Typography
          accessibilityRole="alert"
          color="error"
          variant="bodyMedium"
        >
          {error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
});
