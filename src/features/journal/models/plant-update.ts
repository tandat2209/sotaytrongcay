import { z } from "zod";
import { t } from "@/shared/i18n";

export const PlantUpdatePhotoSchema = z.object({
  id: z.string().uuid(),
  localUri: z.string().min(1),
  position: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
});

export const PlantUpdateFieldsSchema = z.object({
  id: z.string().uuid(),
  mutationId: z.string().uuid(),
  plantId: z.string().uuid(),
  occurredAt: z.string().datetime(),
  notes: z.string().trim().min(1).nullable(),
  stageId: z.string().min(1),
  createdAt: z.string().datetime(),
});

export const PlantUpdateSchema = PlantUpdateFieldsSchema.extend({
  photos: z.array(PlantUpdatePhotoSchema),
}).superRefine((update, context) => {
  if (update.notes === null && update.photos.length === 0) {
    context.addIssue({
      code: "custom",
      message: t("journal.update.validationContent"),
    });
  }

  const positions = new Set(update.photos.map((photo) => photo.position));
  if (positions.size !== update.photos.length) {
    context.addIssue({
      code: "custom",
      message: "Vị trí ảnh không được trùng nhau.",
      path: ["photos"],
    });
  }
});

export type PlantUpdate = z.infer<typeof PlantUpdateSchema>;
export type PlantUpdatePhoto = z.infer<typeof PlantUpdatePhotoSchema>;

export function getLatestPlantPhoto(
  updates: readonly PlantUpdate[],
): PlantUpdatePhoto | null {
  const latestUpdate = updates
    .filter((update) => update.photos.length > 0)
    .slice()
    .sort(
      (left, right) =>
        right.occurredAt.localeCompare(left.occurredAt) ||
        right.createdAt.localeCompare(left.createdAt),
    )[0];

  return (
    latestUpdate?.photos
      .slice()
      .sort((left, right) => left.position - right.position)[0] ?? null
  );
}

export function getLatestPlantPhotoUrisByPlant(
  updates: readonly PlantUpdate[],
): Readonly<Record<string, string>> {
  const updatesByPlant = new Map<string, PlantUpdate[]>();

  for (const update of updates) {
    const plantUpdates = updatesByPlant.get(update.plantId) ?? [];
    plantUpdates.push(update);
    updatesByPlant.set(update.plantId, plantUpdates);
  }

  return Object.fromEntries(
    Array.from(
      updatesByPlant,
      ([plantId, plantUpdates]) =>
        [plantId, getLatestPlantPhoto(plantUpdates)?.localUri] as const,
    ).filter(
      (entry): entry is readonly [string, string] => entry[1] !== undefined,
    ),
  );
}
