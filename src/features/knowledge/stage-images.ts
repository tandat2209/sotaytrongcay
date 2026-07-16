import type { ImageSourcePropType } from "react-native";

const stageImages: Readonly<Record<string, ImageSourcePropType>> = {
  "image.grape.stage.bud-break": require("../../../knowledge/assets/images/grape/stages/bud-break.webp"),
  "image.grape.stage.canopy-formation": require("../../../knowledge/assets/images/grape/stages/canopy-formation.webp"),
  "image.grape.stage.flowering": require("../../../knowledge/assets/images/grape/stages/flowering.webp"),
  "image.grape.stage.fruit-development": require("../../../knowledge/assets/images/grape/stages/fruit-development.webp"),
  "image.grape.stage.fruit-set": require("../../../knowledge/assets/images/grape/stages/fruit-set.webp"),
  "image.grape.stage.harvest": require("../../../knowledge/assets/images/grape/stages/harvest.webp"),
  "image.grape.stage.pruning": require("../../../knowledge/assets/images/grape/stages/pruning.webp"),
  "image.grape.stage.recovery": require("../../../knowledge/assets/images/grape/stages/recovery.webp"),
  "image.grape.stage.ripening": require("../../../knowledge/assets/images/grape/stages/ripening.webp"),
  "image.grape.stage.seedling": require("../../../knowledge/assets/images/grape/stages/seedling.webp"),
  "image.grape.stage.trellis-training": require("../../../knowledge/assets/images/grape/stages/trellis-training.webp"),
  "image.grape.stage.trunk-development": require("../../../knowledge/assets/images/grape/stages/trunk-development.webp"),
};

export function getStageImage(
  imageId: string | null,
): ImageSourcePropType | null {
  if (!imageId) return null;
  return stageImages[imageId] ?? null;
}
