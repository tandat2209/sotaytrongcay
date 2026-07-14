import {
  Droplets,
  SprayCan,
  Wheat,
  type LucideIcon,
} from "lucide-react-native";
import type { CareActivityType } from "./care-activity";

export type CareActivityIcon = LucideIcon;

export type CareActivityVisual = Readonly<{
  backgroundColor: string;
  color: string;
  icon: CareActivityIcon;
}>;

export const CARE_ACTIVITY_VISUALS: Record<
  CareActivityType,
  CareActivityVisual
> = {
  fertilizing: { backgroundColor: "#FFF3E0", color: "#8A4B00", icon: Wheat },
  spraying: { backgroundColor: "#E9DDFF", color: "#65558F", icon: SprayCan },
  watering: { backgroundColor: "#DBEAFE", color: "#1D4ED8", icon: Droplets },
};

export const CARE_ACTIVITY_ICONS: Record<CareActivityType, CareActivityIcon> = {
  fertilizing: CARE_ACTIVITY_VISUALS.fertilizing.icon,
  spraying: CARE_ACTIVITY_VISUALS.spraying.icon,
  watering: CARE_ACTIVITY_VISUALS.watering.icon,
};
