import {
  Droplets,
  SprayCan,
  Wheat,
  type LucideIcon,
} from "lucide-react-native";
import { colors } from "@/shared/ui/theme";
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
  fertilizing: {
    backgroundColor: colors.activityFertilizingSoft,
    color: colors.activityFertilizing,
    icon: Wheat,
  },
  spraying: {
    backgroundColor: colors.activitySprayingSoft,
    color: colors.activitySpraying,
    icon: SprayCan,
  },
  watering: {
    backgroundColor: colors.activityWaterSoft,
    color: colors.activityWater,
    icon: Droplets,
  },
};

export const CARE_ACTIVITY_ICONS: Record<CareActivityType, CareActivityIcon> = {
  fertilizing: CARE_ACTIVITY_VISUALS.fertilizing.icon,
  spraying: CARE_ACTIVITY_VISUALS.spraying.icon,
  watering: CARE_ACTIVITY_VISUALS.watering.icon,
};
