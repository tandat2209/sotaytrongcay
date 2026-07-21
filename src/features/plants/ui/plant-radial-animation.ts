import { Animated } from "react-native";

export type RadialActionPosition =
  "fertilizing" | "journal" | "spraying" | "watering";

const ORIGINS: Readonly<
  Record<RadialActionPosition, Readonly<{ x: number; y: number }>>
> = {
  fertilizing: { x: -50, y: 128 },
  journal: { x: -120, y: 68 },
  spraying: { x: 120, y: 68 },
  watering: { x: 50, y: 128 },
};

export function getRadialActionAnimation(
  position: RadialActionPosition,
  progress: Animated.Value,
  reduceMotion: boolean,
) {
  if (reduceMotion) return undefined;
  const origin = ORIGINS[position];
  return {
    opacity: progress,
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [origin.x, 0],
        }),
      },
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [origin.y, 0],
        }),
      },
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.35, 1],
        }),
      },
    ],
  };
}
