import {
  CirclePlus,
  FlaskConical,
  Grid3X3,
  Leaf,
  Package,
  type LucideIcon,
} from "lucide-react-native";
import type { FertilizerGroup } from "../models/user-fertilizer";

export const FERTILIZER_GROUPS: readonly FertilizerGroup[] = [
  "organic",
  "npk",
  "single",
  "supplement",
  "other",
];

export const FERTILIZER_GROUP_ICONS: Readonly<
  Record<FertilizerGroup, LucideIcon>
> = {
  organic: Leaf,
  npk: Grid3X3,
  single: FlaskConical,
  supplement: CirclePlus,
  other: Package,
};
