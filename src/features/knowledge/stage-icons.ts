import type { ComponentProps } from "react";
import type Ionicons from "@expo/vector-icons/Ionicons";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Maps each species-defined stage ID to the closest Ionicons icon name.
 * Icons are chosen to reflect the visual meaning of the stage, based on
 * the Material Symbols set used in the design mockups.
 *
 * Fallback: "leaf-outline" — a neutral plant icon for unknown stage IDs.
 */
const STAGE_ICON_MAP: Record<string, IoniconName> = {
  // Grape — development lifecycle
  "grape.stage.seedling": "leaf-outline",           // spa → young leaf
  "grape.stage.trunk-development": "git-branch-outline", // eco → branching trunk
  "grape.stage.trellis-training": "grid-outline",   // account_tree → trellis grid
  "grape.stage.canopy-formation": "umbrella-outline", // spreading canopy
  // Grape — production lifecycle
  "grape.stage.pruning": "cut-outline",             // cut back
  "grape.stage.bud-break": "sparkles-outline",      // new buds emerging
  "grape.stage.flowering": "flower-outline",         // filter_vintage → flower
  "grape.stage.fruit-set": "ellipse-outline",        // nutrition → small fruit
  "grape.stage.fruit-development": "nutrition-outline", // growing fruit
  "grape.stage.ripening": "sunny-outline",           // sun-exposed ripening
  "grape.stage.harvest": "basket-outline",           // harvest basket
  "grape.stage.recovery": "refresh-outline",         // post-harvest recovery
};

const FALLBACK_STAGE_ICON: IoniconName = "leaf-outline";

/** Returns the Ionicons icon name for a given species-defined stage ID. */
export function stageIcon(stageId: string): IoniconName {
  return STAGE_ICON_MAP[stageId] ?? FALLBACK_STAGE_ICON;
}
