import type { ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { CareActivityType } from "./care-activity";

export type CareActivityIconName = ComponentProps<typeof Ionicons>["name"];

export type CareActivityVisual = Readonly<{
  backgroundColor: string;
  color: string;
  icon: CareActivityIconName;
}>;

export const CARE_ACTIVITY_VISUALS: Record<CareActivityType, CareActivityVisual> = {
  fertilizing: { backgroundColor: "#FFF3E0", color: "#8A4B00", icon: "nutrition-outline" },
  spraying: { backgroundColor: "#E9DDFF", color: "#65558F", icon: "flask-outline" },
  watering: { backgroundColor: "#DBEAFE", color: "#1D4ED8", icon: "water-outline" },
};

export const CARE_ACTIVITY_ICONS: Record<CareActivityType, CareActivityIconName> = {
  fertilizing: CARE_ACTIVITY_VISUALS.fertilizing.icon,
  spraying: CARE_ACTIVITY_VISUALS.spraying.icon,
  watering: CARE_ACTIVITY_VISUALS.watering.icon,
};
