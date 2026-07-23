import { z } from "zod";

const PlantIdSchema = z.string().uuid();

const BatchCarePlantIdsSchema = z
  .array(PlantIdSchema)
  .min(2)
  .superRefine((plantIds, context) => {
    const seen = new Set<string>();
    plantIds.forEach((plantId, index) => {
      if (seen.has(plantId)) {
        context.addIssue({
          code: "custom",
          message: "Each Plant may be selected only once.",
          path: [index],
        });
      }
      seen.add(plantId);
    });
  });

export function toggleBatchCarePlant(
  selectedPlantIds: readonly string[],
  plantId: string,
): readonly string[] {
  const parsedId = PlantIdSchema.parse(plantId);
  return selectedPlantIds.includes(parsedId)
    ? selectedPlantIds.filter((selectedId) => selectedId !== parsedId)
    : [...selectedPlantIds, parsedId];
}

export function parseBatchCarePlantIds(value: string): readonly string[] {
  return BatchCarePlantIdsSchema.parse(value.split(","));
}

export function serializeBatchCarePlantIds(
  plantIds: readonly string[],
): string {
  return BatchCarePlantIdsSchema.parse(plantIds).join(",");
}
