import { getPreviewPlantKnowledge } from "@/features/knowledge";
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
    speciesTitle: knowledge?.species.title ?? "Chưa xác định",
    stageTitle:
      knowledge?.stages.find((stage) => stage.id === plant.stageId)?.title ??
      "Chưa xác định",
  };
}
