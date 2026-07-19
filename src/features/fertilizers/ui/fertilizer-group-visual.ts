import {
  CirclePlus,
  FlaskConical,
  Grid3X3,
  Leaf,
  Package,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import type { FertilizerGroup } from "../models/user-fertilizer";

export const FERTILIZER_GROUPS: readonly FertilizerGroup[] = [
  "organic",
  "nitrogen-rich",
  "npk-balanced",
  "phosphorus-rich",
  "potassium-rich",
  "support",
  "other",
];

export const FERTILIZER_GROUP_ICONS: Readonly<
  Record<FertilizerGroup, LucideIcon>
> = {
  organic: Leaf,
  "nitrogen-rich": FlaskConical,
  "npk-balanced": Grid3X3,
  "phosphorus-rich": CirclePlus,
  "potassium-rich": Zap,
  support: Sparkles,
  other: Package,
};
