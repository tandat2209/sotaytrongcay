import { z } from "zod";
import { t } from "@/shared/i18n";
import { savePlantUpdate } from "../data/plant-update-repository";
import {
  PlantUpdateFieldsSchema,
  PlantUpdateSchema,
  type PlantUpdate,
} from "../models/plant-update";
import {
  deletePersistedJournalPhotos,
  persistJournalPhotos,
} from "./journal-photo-storage";

const SavePlantUpdateCommandSchema = PlantUpdateFieldsSchema.extend({
  photos: z.array(
    z.object({
      id: z.string().uuid(),
      sourceUri: z.string().min(1),
      fileName: z.string().nullable(),
      position: z.number().int().nonnegative(),
      createdAt: z.string().datetime(),
    }),
  ),
  stageHistoryId: z.string().uuid(),
}).superRefine((command, context) => {
  if (command.notes === null && command.photos.length === 0) {
    context.addIssue({
      code: "custom",
      message: t("journal.update.validationContent"),
    });
  }
});

export type SavePlantUpdateCommand = z.infer<
  typeof SavePlantUpdateCommandSchema
>;

export async function savePlantUpdateWithPhotos(
  input: SavePlantUpdateCommand,
): Promise<PlantUpdate> {
  const command = SavePlantUpdateCommandSchema.parse(input);
  try {
    const photos = await persistJournalPhotos(
      command.plantId,
      command.id,
      command.photos,
    );
    const update = PlantUpdateSchema.parse({
      id: command.id,
      mutationId: command.mutationId,
      plantId: command.plantId,
      occurredAt: command.occurredAt,
      notes: command.notes,
      stageId: command.stageId,
      photos,
      createdAt: command.createdAt,
    });
    await savePlantUpdate(update, command.stageHistoryId);
    return update;
  } catch (error) {
    deletePersistedJournalPhotos(command.plantId, command.id);
    throw error;
  }
}
