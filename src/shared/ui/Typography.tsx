import type { PropsWithChildren } from "react";
import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from "react-native";
import { colors, typography } from "./theme";

type TypographyVariant = keyof typeof typography;

type TypographyProps = PropsWithChildren<{
  color?: keyof typeof colors;
  style?: StyleProp<TextStyle>;
  variant: TypographyVariant;
}> & Pick<TextProps, "accessibilityRole" | "numberOfLines">;

export function Typography({ accessibilityRole, children, color = "text", numberOfLines, style, variant }: TypographyProps) {
  return <Text accessibilityRole={accessibilityRole} numberOfLines={numberOfLines} style={[styles.base, typography[variant], { color: colors[color] }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
