import type { ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { CareActivityType } from "./care-activity";

export type CareActivityIconName = ComponentProps<typeof Ionicons>["name"];

export const CARE_ACTIVITY_ICONS: Record<CareActivityType, CareActivityIconName> = {
  fertilizing: "leaf-outline",
  spraying: "flask-outline",
  watering: "water-outline",
};
