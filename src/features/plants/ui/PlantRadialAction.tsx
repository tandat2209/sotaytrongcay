import type { LucideIcon } from "lucide-react-native";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";
import {
  getRadialActionAnimation,
  type RadialActionPosition,
} from "./plant-radial-animation";

export function RadialAction({
  backgroundColor,
  color,
  icon: Icon,
  label,
  onPress,
  position,
  progress,
  reduceMotion,
}: Readonly<{
  backgroundColor: string;
  color: string;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  position: RadialActionPosition;
  progress: Animated.Value;
  reduceMotion: boolean;
}>) {
  const animatedStyle = getRadialActionAnimation(
    position,
    progress,
    reduceMotion,
  );
  const labelAbove = position === "watering" || position === "fertilizing";
  return (
    <Animated.View style={[styles.action, styles[position], animatedStyle]}>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          labelAbove && styles.labelAbove,
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.icon, { backgroundColor }]}>
          <Icon color={color} size={27} />
        </View>
        <View style={styles.label}>
          <Typography numberOfLines={1} variant="label">
            {label}
          </Typography>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function MainActionButton({
  accessibilityLabel,
  expanded,
  icon: Icon,
  onPress,
  rotated = false,
}: Readonly<{
  accessibilityLabel: string;
  expanded: boolean;
  icon: LucideIcon;
  onPress: () => void;
  rotated?: boolean;
}>) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.mainAction,
        pressed && styles.mainPressed,
      ]}
    >
      <View style={rotated ? styles.rotated : undefined}>
        <Icon color={colors.surface} size={30} />
      </View>
    </Pressable>
  );
}

export function CyclingMainActionButton({
  accessibilityLabel,
  backgroundColor,
  icon: Icon,
  onPress,
  scale,
  slideX,
}: Readonly<{
  accessibilityLabel: string;
  backgroundColor: string;
  icon: LucideIcon;
  onPress: () => void;
  scale: Animated.Value;
  slideX: Animated.Value;
}>) {
  const iconStyle = {
    opacity: slideX.interpolate({
      inputRange: [-28, 0, 28],
      outputRange: [0, 1, 0],
    }),
    transform: [{ translateX: slideX }],
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ expanded: false }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.mainAction,
          { backgroundColor },
          pressed && styles.mainPressed,
        ]}
      >
        <Animated.View style={iconStyle}>
          <Icon color={colors.surface} size={30} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  action: { alignItems: "center", position: "absolute", width: 120 },
  fertilizing: { bottom: 134, left: "50%", marginLeft: -10 },
  icon: {
    alignItems: "center",
    borderRadius: radius.pill,
    elevation: 4,
    height: 60,
    justifyContent: "center",
    shadowColor: colors.text,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    width: 60,
  },
  label: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  labelAbove: { flexDirection: "column-reverse" },
  journal: { bottom: 40, left: "50%", marginLeft: 60 },
  mainAction: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 4,
    elevation: 6,
    height: 72,
    justifyContent: "center",
    shadowColor: colors.text,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    width: 72,
  },
  mainPressed: { opacity: 0.86, transform: [{ scale: 0.96 }] },
  pressable: { alignItems: "center", gap: spacing.sm, width: 120 },
  pressed: { opacity: 0.78 },
  rotated: { transform: [{ rotate: "45deg" }] },
  spraying: { bottom: 40, left: "50%", marginLeft: -180 },
  watering: { bottom: 134, left: "50%", marginLeft: -110 },
});
