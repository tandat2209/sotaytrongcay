import {
  CircleDot,
  Fence,
  Flower2,
  Grape,
  Leaf,
  RefreshCw,
  Scissors,
  ShoppingBasket,
  Sparkles,
  Sprout,
  Sun,
  TreeDeciduous,
  Trees,
  type LucideIcon,
} from "lucide-react-native";

/**
 * Maps each species-defined stage ID to the closest Lucide icon component.
 * Icons are chosen to reflect the visual meaning of the stage, based on
 * the Material Symbols set used in the design mockups.
 *
 * Fallback: Leaf — a neutral plant icon for unknown stage IDs.
 */
const STAGE_ICON_MAP: Record<string, LucideIcon> = {
  // Grape — development lifecycle
  "grape.stage.seedling": Sprout, // spa → young leaf
  "grape.stage.trunk-development": TreeDeciduous, // eco → branching trunk
  "grape.stage.trellis-training": Fence, // account_tree → trellis grid
  "grape.stage.canopy-formation": Trees, // spreading canopy
  // Grape — production lifecycle
  "grape.stage.pruning": Scissors, // cut back
  "grape.stage.bud-break": Sparkles, // new buds emerging
  "grape.stage.flowering": Flower2, // filter_vintage → flower
  "grape.stage.fruit-set": CircleDot, // nutrition → small fruit
  "grape.stage.fruit-development": Grape, // growing fruit
  "grape.stage.ripening": Sun, // sun-exposed ripening
  "grape.stage.harvest": ShoppingBasket, // harvest basket
  "grape.stage.recovery": RefreshCw, // post-harvest recovery
};

const FALLBACK_STAGE_ICON: LucideIcon = Leaf;

type StageIconProps = Readonly<{
  color: string;
  size: number;
  stageId: string;
}>;

export function StageIcon({ color, size, stageId }: StageIconProps) {
  const Icon = STAGE_ICON_MAP[stageId] ?? FALLBACK_STAGE_ICON;
  return <Icon color={color} size={size} />;
}
