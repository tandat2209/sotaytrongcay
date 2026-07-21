import { Camera, Plus, type LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated } from "react-native";

import { CARE_ACTIVITY_VISUALS } from "@/features/journal";
import { colors } from "@/shared/ui/theme";

const ACTIONS: readonly Readonly<{
  backgroundColor: string;
  icon: LucideIcon;
}>[] = [
  {
    backgroundColor: CARE_ACTIVITY_VISUALS.watering.color,
    icon: CARE_ACTIVITY_VISUALS.watering.icon,
  },
  {
    backgroundColor: CARE_ACTIVITY_VISUALS.fertilizing.color,
    icon: CARE_ACTIVITY_VISUALS.fertilizing.icon,
  },
  {
    backgroundColor: CARE_ACTIVITY_VISUALS.spraying.color,
    icon: CARE_ACTIVITY_VISUALS.spraying.icon,
  },
  { backgroundColor: colors.primary, icon: Camera },
];

export function usePlantActionCycle(open: boolean, reduceMotion: boolean) {
  const [index, setIndex] = useState(0);
  const [slideX] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reduceMotion || open) {
      slideX.setValue(0);
      scale.setValue(1);
      return;
    }
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(slideX, {
          duration: 240,
          toValue: 28,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          duration: 240,
          toValue: 0.94,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        setIndex((current) => (current + 1) % ACTIONS.length);
        slideX.setValue(-28);
        Animated.parallel([
          Animated.spring(slideX, {
            damping: 18,
            stiffness: 180,
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            damping: 12,
            stiffness: 230,
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);
    return () => {
      clearInterval(interval);
      slideX.stopAnimation();
      scale.stopAnimation();
    };
  }, [open, reduceMotion, scale, slideX]);

  const action = ACTIONS[index] ?? {
    backgroundColor: colors.primary,
    icon: Plus,
  };
  return { ...action, scale, slideX };
}
