import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { t } from "@/shared/i18n";
import type { Plant } from "./plant";

export type PlantIdentity = Readonly<{
  speciesTitle: string;
  stageTitle: string;
}>;

export function resolvePlantIdentity(
  plant: Pick<Plant, "speciesId" | "stageId">,
): PlantIdentity {
  const knowledge = getPreviewPlantKnowledge(plant.speciesId);
  return {
    speciesTitle: knowledge?.species.title ?? t("common.fallback.unknown"),
    stageTitle:
      knowledge?.stages.find((stage) => stage.id === plant.stageId)?.title ??
      t("common.fallback.unknown"),
  };
}
