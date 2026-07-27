import type { ImageSourcePropType } from "react-native";

const warningSignImages: Readonly<Record<string, ImageSourcePropType>> = {
  "image.grape.warning-sign.flower-young-fruit-damage": require("../../../knowledge/assets/images/grape/warning-signs/flower-young-fruit-damage.webp"),
  "image.grape.warning-sign.fruit-cracking-soft-rot": require("../../../knowledge/assets/images/grape/warning-signs/fruit-cracking-soft-rot.webp"),
  "image.grape.warning-sign.sticky-residue-or-aphids": require("../../../knowledge/assets/images/grape/warning-signs/sticky-residue-or-aphids.webp"),
  "image.grape.warning-sign.white-powder": require("../../../knowledge/assets/images/grape/warning-signs/white-powder.webp"),
};

export function getWarningSignImage(
  imageId: string | null,
): ImageSourcePropType | null {
  if (!imageId) return null;
  return warningSignImages[imageId] ?? null;
}
