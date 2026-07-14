import { z } from "zod";
import { getDb } from "@/shared/lib/db/database";
import { PlantUpdateSchema, type PlantUpdate } from "../models/plant-update";
import { createPlantStageHistory } from "../models/plant-stage-history";

export type PlantUpdateRow = {
  id: string;
  mutation_id: string;
  plant_id: string;
  occurred_at: string;
  notes: string | null;
  stage_id: string;
  created_at: string;
};

export type PlantUpdatePhotoRow = {
  id: string;
  plant_update_id: string;
  local_uri: string;
  position: number;
  created_at: string;
};

export function plantUpdateToInsertParams(update: PlantUpdate): (string | null)[] {
  return [update.id, update.mutationId, update.plantId, update.occurredAt, update.notes, update.stageId, update.createdAt];
}

export function plantUpdateFromRows(row: PlantUpdateRow, photos: readonly PlantUpdatePhotoRow[]): PlantUpdate {
  return PlantUpdateSchema.parse({
    id: row.id,
    mutationId: row.mutation_id,
    plantId: row.plant_id,
    occurredAt: row.occurred_at,
    notes: row.notes,
    stageId: row.stage_id,
    photos: photos.slice().sort((left, right) => left.position - right.position).map((photo) => ({
      id: photo.id,
      localUri: photo.local_uri,
      position: photo.position,
      createdAt: photo.created_at,
    })),
    createdAt: row.created_at,
  });
}

export async function savePlantUpdate(input: PlantUpdate, stageHistoryIdInput: string): Promise<void> {
  const update = PlantUpdateSchema.parse(input);
  const stageHistoryId = z.string().uuid().parse(stageHistoryIdInput);
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    const plant = await db.getFirstAsync<{ stage_id: string }>("SELECT stage_id FROM plants WHERE id = ?", [update.plantId]);
    if (!plant) throw new Error("Plant not found while saving journal update.");

    const result = await db.runAsync(
      `INSERT OR IGNORE INTO plant_updates
        (id, mutation_id, plant_id, occurred_at, notes, stage_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      plantUpdateToInsertParams(update),
    );
    if (result.changes === 0) return;

    for (const photo of update.photos) {
      await db.runAsync(
        `INSERT INTO plant_update_photos
          (id, plant_update_id, local_uri, position, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [photo.id, update.id, photo.localUri, photo.position, photo.createdAt],
      );
    }

    const stageHistory = createPlantStageHistory({ id: stageHistoryId, plantId: update.plantId, fromStageId: plant.stage_id, toStageId: update.stageId, journalEntryId: update.id, changedAt: update.occurredAt, createdAt: update.createdAt });
    if (stageHistory) {
      await db.runAsync("UPDATE plants SET stage_id = ?, stage_started_at = ? WHERE id = ?", [stageHistory.toStageId, stageHistory.changedAt, stageHistory.plantId]);
      await db.runAsync(
        `INSERT INTO plant_stage_history
          (id, plant_id, from_stage_id, to_stage_id, journal_entry_id, changed_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [stageHistory.id, stageHistory.plantId, stageHistory.fromStageId, stageHistory.toStageId, stageHistory.journalEntryId, stageHistory.changedAt, stageHistory.createdAt],
      );
    }
  });
}

export async function listPlantUpdates(plantId?: string): Promise<PlantUpdate[]> {
  const db = await getDb();
  const updates = plantId
    ? await db.getAllAsync<PlantUpdateRow>("SELECT * FROM plant_updates WHERE plant_id = ? ORDER BY occurred_at DESC, created_at DESC", [plantId])
    : await db.getAllAsync<PlantUpdateRow>("SELECT * FROM plant_updates ORDER BY occurred_at DESC, created_at DESC");
  if (updates.length === 0) return [];

  const photos = plantId
    ? await db.getAllAsync<PlantUpdatePhotoRow>(
      `SELECT photo.* FROM plant_update_photos photo
       JOIN plant_updates entry ON entry.id = photo.plant_update_id
       WHERE entry.plant_id = ?
       ORDER BY entry.occurred_at DESC, photo.position`,
      [plantId],
    )
    : await db.getAllAsync<PlantUpdatePhotoRow>("SELECT * FROM plant_update_photos ORDER BY plant_update_id, position");
  const photosByUpdate = new Map<string, PlantUpdatePhotoRow[]>();
  for (const photo of photos) {
    const updatePhotos = photosByUpdate.get(photo.plant_update_id) ?? [];
    updatePhotos.push(photo);
    photosByUpdate.set(photo.plant_update_id, updatePhotos);
  }

  return updates.map((update) => plantUpdateFromRows(update, photosByUpdate.get(update.id) ?? []));
}

export async function getPlantUpdate(id: string): Promise<PlantUpdate | null> {
  const db = await getDb();
  const update = await db.getFirstAsync<PlantUpdateRow>("SELECT * FROM plant_updates WHERE id = ?", [id]);
  if (!update) return null;
  const photos = await db.getAllAsync<PlantUpdatePhotoRow>("SELECT * FROM plant_update_photos WHERE plant_update_id = ? ORDER BY position", [id]);
  return plantUpdateFromRows(update, photos);
}
