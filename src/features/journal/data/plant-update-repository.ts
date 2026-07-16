import { z } from "zod";
import { getDb, withDatabaseWriteTransaction } from "@/shared/lib/db/database";
import { resolveIdempotentInsertOutcome } from "@/shared/lib/db/idempotent-insert";
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

export type LatestPlantPhotoRow = Readonly<{
  local_uri: string;
  plant_id: string;
}>;

const DEFAULT_PLANT_UPDATE_LIMIT = 50;

export function plantUpdateToInsertParams(
  update: PlantUpdate,
): (string | null)[] {
  return [
    update.id,
    update.mutationId,
    update.plantId,
    update.occurredAt,
    update.notes,
    update.stageId,
    update.createdAt,
  ];
}

export function plantUpdateFromRows(
  row: PlantUpdateRow,
  photos: readonly PlantUpdatePhotoRow[],
): PlantUpdate {
  return PlantUpdateSchema.parse({
    id: row.id,
    mutationId: row.mutation_id,
    plantId: row.plant_id,
    occurredAt: row.occurred_at,
    notes: row.notes,
    stageId: row.stage_id,
    photos: photos
      .slice()
      .sort((left, right) => left.position - right.position)
      .map((photo) => ({
        id: photo.id,
        localUri: photo.local_uri,
        position: photo.position,
        createdAt: photo.created_at,
      })),
    createdAt: row.created_at,
  });
}

export async function savePlantUpdate(
  input: PlantUpdate,
  stageHistoryIdInput: string,
): Promise<void> {
  const update = PlantUpdateSchema.parse(input);
  const stageHistoryId = z.string().uuid().parse(stageHistoryIdInput);
  await withDatabaseWriteTransaction(async (transaction) => {
    const plant = await transaction.getFirstAsync<{ stage_id: string }>(
      "SELECT stage_id FROM plants WHERE id = ?",
      [update.plantId],
    );
    if (!plant) throw new Error("Plant not found while saving journal update.");

    const result = await transaction.runAsync(
      `INSERT INTO plant_updates
        (id, mutation_id, plant_id, occurred_at, notes, stage_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(mutation_id) DO NOTHING`,
      plantUpdateToInsertParams(update),
    );
    const saved =
      result.changes === 0
        ? await transaction.getFirstAsync<{ id: string }>(
            "SELECT id FROM plant_updates WHERE mutation_id = ?",
            [update.mutationId],
          )
        : null;
    const outcome = resolveIdempotentInsertOutcome({
      changes: result.changes,
      expectedId: update.id,
      savedId: saved?.id ?? null,
    });
    if (outcome === "duplicate") return;

    for (const photo of update.photos) {
      await transaction.runAsync(
        `INSERT INTO plant_update_photos
          (id, plant_update_id, local_uri, position, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [photo.id, update.id, photo.localUri, photo.position, photo.createdAt],
      );
    }

    const stageHistory = createPlantStageHistory({
      id: stageHistoryId,
      plantId: update.plantId,
      fromStageId: plant.stage_id,
      toStageId: update.stageId,
      journalEntryId: update.id,
      changedAt: update.occurredAt,
      createdAt: update.createdAt,
    });
    if (stageHistory) {
      await transaction.runAsync(
        "UPDATE plants SET stage_id = ?, stage_started_at = ? WHERE id = ?",
        [stageHistory.toStageId, stageHistory.changedAt, stageHistory.plantId],
      );
      await transaction.runAsync(
        `INSERT INTO plant_stage_history
          (id, plant_id, from_stage_id, to_stage_id, journal_entry_id, changed_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          stageHistory.id,
          stageHistory.plantId,
          stageHistory.fromStageId,
          stageHistory.toStageId,
          stageHistory.journalEntryId,
          stageHistory.changedAt,
          stageHistory.createdAt,
        ],
      );
    }
  });
}

async function listPlantUpdates(
  plantId: string,
  limit: number,
): Promise<PlantUpdate[]> {
  const db = await getDb();
  const boundedLimit = normalizeLimit(limit);
  const updates = await db.getAllAsync<PlantUpdateRow>(
    "SELECT * FROM plant_updates WHERE plant_id = ? ORDER BY occurred_at DESC, created_at DESC, id DESC LIMIT ?",
    [plantId, boundedLimit],
  );
  if (updates.length === 0) return [];

  const updateIds = updates.map((update) => update.id);
  const photos = await db.getAllAsync<PlantUpdatePhotoRow>(
    `SELECT * FROM plant_update_photos
      WHERE plant_update_id IN (${updateIds.map(() => "?").join(", ")})
      ORDER BY plant_update_id, position`,
    updateIds,
  );
  const photosByUpdate = new Map<string, PlantUpdatePhotoRow[]>();
  for (const photo of photos) {
    const updatePhotos = photosByUpdate.get(photo.plant_update_id) ?? [];
    updatePhotos.push(photo);
    photosByUpdate.set(photo.plant_update_id, updatePhotos);
  }

  return updates.map((update) =>
    plantUpdateFromRows(update, photosByUpdate.get(update.id) ?? []),
  );
}

export async function listRecentPlantUpdates(
  plantId: string,
  limit: number,
): Promise<PlantUpdate[]> {
  return await listPlantUpdates(plantId, limit);
}

export function latestPlantPhotoUrisFromRows(
  rows: readonly LatestPlantPhotoRow[],
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    rows.map((row) => [row.plant_id, row.local_uri] as const),
  );
}

export async function listLatestPlantPhotoUris(): Promise<
  Readonly<Record<string, string>>
> {
  const db = await getDb();
  const rows = await db.getAllAsync<LatestPlantPhotoRow>(
    `WITH ranked_photos AS (
       SELECT entry.plant_id,
              photo.local_uri,
              ROW_NUMBER() OVER (
                PARTITION BY entry.plant_id
                ORDER BY entry.occurred_at DESC, entry.created_at DESC,
                         entry.id DESC, photo.position ASC
              ) AS photo_rank
         FROM plant_updates AS entry
         JOIN plant_update_photos AS photo
           ON photo.plant_update_id = entry.id
     )
     SELECT plant_id, local_uri
       FROM ranked_photos
      WHERE photo_rank = 1`,
  );
  return latestPlantPhotoUrisFromRows(rows);
}

export async function getLatestPlantPhotoUri(
  plantId: string,
): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ local_uri: string }>(
    `SELECT photo.local_uri
       FROM plant_updates AS entry
       JOIN plant_update_photos AS photo
         ON photo.plant_update_id = entry.id
      WHERE entry.plant_id = ?
      ORDER BY entry.occurred_at DESC, entry.created_at DESC, entry.id DESC,
               photo.position ASC
      LIMIT 1`,
    [plantId],
  );
  return row?.local_uri ?? null;
}

function normalizeLimit(limit: number): number {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Plant update limit must be a positive integer.");
  }
  return Math.min(limit, DEFAULT_PLANT_UPDATE_LIMIT);
}

export async function getPlantUpdate(id: string): Promise<PlantUpdate | null> {
  const db = await getDb();
  const update = await db.getFirstAsync<PlantUpdateRow>(
    "SELECT * FROM plant_updates WHERE id = ?",
    [id],
  );
  if (!update) return null;
  const photos = await db.getAllAsync<PlantUpdatePhotoRow>(
    "SELECT * FROM plant_update_photos WHERE plant_update_id = ? ORDER BY position",
    [id],
  );
  return plantUpdateFromRows(update, photos);
}
