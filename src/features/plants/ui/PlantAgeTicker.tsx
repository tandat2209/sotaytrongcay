import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, StyleSheet, View } from "react-native";
import { Typography } from "@/shared/ui/Typography";
import { colors, radius, spacing } from "@/shared/ui/theme";

type Props = Readonly<{
  appearance: "fallback" | "hero";
  hiddenFromAccessibility?: boolean;
  labels: readonly string[];
}>;

const ROTATION_INTERVAL_MS = 10_000;

export function PlantAgeTicker({
  appearance,
  hiddenFromAccessibility = false,
  labels,
}: Props) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateY] = useState(() => new Animated.Value(0));

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (reduceMotion || labels.length < 2) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }

    const rotate = () => {
      Animated.parallel([
        Animated.timing(opacity, {
          duration: 220,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          duration: 220,
          toValue: -8,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        setIndex((current) => (current + 1) % labels.length);
        translateY.setValue(8);
        Animated.parallel([
          Animated.timing(opacity, {
            duration: 280,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            duration: 280,
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };
    const interval = setInterval(rotate, ROTATION_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      opacity.stopAnimation();
      translateY.stopAnimation();
    };
  }, [labels.length, opacity, reduceMotion, translateY]);

  if (labels.length === 0) return null;
  const currentLabel = labels[index] ?? labels[0];
  const accessibilityProps = hiddenFromAccessibility
    ? {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants" as const,
      }
    : { accessibilityLabel: labels.join(". "), accessible: true };

  return (
    <View
      {...accessibilityProps}
      style={[
        styles.chip,
        appearance === "hero" ? styles.heroChip : styles.fallbackChip,
      ]}
    >
      {reduceMotion && labels.length > 1 ? (
        <Typography style={styles.label} variant="label">
          {labels.join(" · ")}
        </Typography>
      ) : (
        <Animated.View style={{ opacity, transform: [{ translateY }] }}>
          <Typography style={styles.label} variant="label">
            {currentLabel}
          </Typography>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    justifyContent: "center",
    maxWidth: "100%",
    minHeight: 28,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: 196,
  },
  fallbackChip: { backgroundColor: colors.primarySoft },
  heroChip: { backgroundColor: "rgba(255, 255, 255, 0.86)" },
  label: { color: colors.primaryStrong },
});
