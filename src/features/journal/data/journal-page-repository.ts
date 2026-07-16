import { appLocale } from "@/shared/i18n";
import { getDb } from "@/shared/lib/db/database";
import type { SQLiteDatabase } from "expo-sqlite";
import type { CareActivity } from "../models/care-activity";
import type { FertilizerApplication } from "../models/fertilizer-application";
import type { JournalCriteria, JournalCursor } from "../models/journal-query";
import type { PlantUpdate } from "../models/plant-update";
import {
  careActivityFromRow,
  type CareActivityRow,
} from "./care-activity-repository";
import {
  fertilizerApplicationFromRow,
  type FertilizerApplicationRow,
} from "./fertilizer-application-repository";
import {
  plantUpdateFromRows,
  type PlantUpdatePhotoRow,
  type PlantUpdateRow,
} from "./plant-update-repository";

export const JOURNAL_PAGE_SIZE = 20;
const JOURNAL_SCAN_BATCH_SIZE = 60;

export type JournalHeaderRow = Readonly<{
  activity_type: string | null;
  created_at: string;
  id: string;
  kind: "care" | "update";
  notes: string | null;
  occurred_at: string;
  plant_id: string;
}>;

export type JournalPage = Readonly<{
  activities: readonly CareActivity[];
  fertilizerApplications: readonly FertilizerApplication[];
  nextCursor: JournalCursor | null;
  updates: readonly PlantUpdate[];
}>;

type HeaderQueryInput = Readonly<{
  criteria: JournalCriteria;
  cursor: JournalCursor | null;
  dateFrom: string | null;
  limit: number;
}>;

export function createJournalHeaderQuery({
  criteria,
  cursor,
  dateFrom,
  limit,
}: HeaderQueryInput): Readonly<{
  params: (number | string)[];
  sql: string;
}> {
  const predicates: string[] = [];
  const params: (number | string)[] = [];

  if (criteria.plantId) {
    predicates.push("plant_id = ?");
    params.push(criteria.plantId);
  }
  if (criteria.recordFilter === "care") {
    predicates.push("kind = 'care'");
  } else if (criteria.recordFilter === "update") {
    predicates.push("kind = 'update'");
  } else if (criteria.recordFilter !== "all") {
    predicates.push("kind = 'care' AND activity_type = ?");
    params.push(criteria.recordFilter);
  }
  if (dateFrom) {
    predicates.push("occurred_at >= ?");
    params.push(dateFrom);
  }
  if (cursor) {
    predicates.push(`(
      occurred_at < ? OR
      (occurred_at = ? AND created_at < ?) OR
      (occurred_at = ? AND created_at = ? AND kind < ?) OR
      (occurred_at = ? AND created_at = ? AND kind = ? AND id < ?)
    )`);
    params.push(
      cursor.occurredAt,
      cursor.occurredAt,
      cursor.createdAt,
      cursor.occurredAt,
      cursor.createdAt,
      cursor.kind,
      cursor.occurredAt,
      cursor.createdAt,
      cursor.kind,
      cursor.id,
    );
  }
  params.push(limit);

  return {
    params,
    sql: `WITH journal_entries AS (
      SELECT id, 'care' AS kind, activity_type, plant_id, occurred_at,
             created_at, notes
        FROM care_activities
      UNION ALL
      SELECT id, 'update' AS kind, NULL AS activity_type, plant_id, occurred_at,
             created_at, notes
        FROM plant_updates
    )
    SELECT id, kind, activity_type, plant_id, occurred_at, created_at, notes
      FROM journal_entries
     ${predicates.length > 0 ? `WHERE ${predicates.join(" AND ")}` : ""}
     ORDER BY occurred_at DESC, created_at DESC, kind DESC, id DESC
     LIMIT ?`,
  };
}

export function journalCursorFromRow(row: JournalHeaderRow): JournalCursor {
  return {
    createdAt: row.created_at,
    id: row.id,
    kind: row.kind,
    occurredAt: row.occurred_at,
  };
}

export function matchesJournalSearch(
  row: JournalHeaderRow,
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase(appLocale);
  return (row.notes ?? "")
    .toLocaleLowerCase(appLocale)
    .includes(normalizedQuery);
}

export async function listJournalPage(
  input: Readonly<{
    criteria: JournalCriteria;
    cursor: JournalCursor | null;
    evaluatedAt?: Date;
    pageSize?: number;
  }>,
): Promise<JournalPage> {
  const db = await getDb();
  const pageSize = normalizePageSize(input.pageSize ?? JOURNAL_PAGE_SIZE);
  const dateFrom = resolveDateFrom(
    input.criteria.dateRange,
    input.evaluatedAt ?? new Date(),
  );
  const selected: JournalHeaderRow[] = [];
  let scanCursor = input.cursor;
  let nextCursor: JournalCursor | null = null;

  while (selected.length < pageSize) {
    const query = createJournalHeaderQuery({
      criteria: input.criteria,
      cursor: scanCursor,
      dateFrom,
      limit: JOURNAL_SCAN_BATCH_SIZE + 1,
    });
    const rows = await db.getAllAsync<JournalHeaderRow>(
      query.sql,
      query.params,
    );
    const batch = rows.slice(0, JOURNAL_SCAN_BATCH_SIZE);
    const databaseHasMore = rows.length > JOURNAL_SCAN_BATCH_SIZE;

    for (const [index, row] of batch.entries()) {
      if (!matchesJournalSearch(row, input.criteria.query)) continue;
      selected.push(row);
      if (selected.length === pageSize) {
        nextCursor =
          index < batch.length - 1 || databaseHasMore
            ? journalCursorFromRow(row)
            : null;
        break;
      }
    }

    if (selected.length === pageSize || !databaseHasMore) break;
    const lastRow = batch.at(-1);
    if (!lastRow) break;
    scanCursor = journalCursorFromRow(lastRow);
  }

  const careIds = selected
    .filter((row) => row.kind === "care")
    .map((row) => row.id);
  const updateIds = selected
    .filter((row) => row.kind === "update")
    .map((row) => row.id);
  const [activities, fertilizerApplications, updates] = await Promise.all([
    loadCareActivities(db, careIds),
    loadFertilizerApplications(db, careIds),
    loadPlantUpdates(db, updateIds),
  ]);

  return { activities, fertilizerApplications, nextCursor, updates };
}

export async function hasAnyJournalEntries(): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ entry_exists: number }>(
    `SELECT EXISTS(
       SELECT id FROM care_activities
       UNION ALL
       SELECT id FROM plant_updates
     ) AS entry_exists`,
  );
  return row?.entry_exists === 1;
}

async function loadCareActivities(
  db: SQLiteDatabase,
  ids: readonly string[],
): Promise<CareActivity[]> {
  if (ids.length === 0) return [];
  const rows = await db.getAllAsync<CareActivityRow>(
    `SELECT * FROM care_activities WHERE id IN (${placeholders(ids)})`,
    [...ids],
  );
  return rows.map(careActivityFromRow);
}

async function loadFertilizerApplications(
  db: SQLiteDatabase,
  careIds: readonly string[],
): Promise<FertilizerApplication[]> {
  if (careIds.length === 0) return [];
  const rows = await db.getAllAsync<FertilizerApplicationRow>(
    `SELECT * FROM fertilizer_applications
      WHERE care_activity_id IN (${placeholders(careIds)})
      ORDER BY care_activity_id, position`,
    [...careIds],
  );
  return rows.map(fertilizerApplicationFromRow);
}

async function loadPlantUpdates(
  db: SQLiteDatabase,
  ids: readonly string[],
): Promise<PlantUpdate[]> {
  if (ids.length === 0) return [];
  const [rows, photos] = await Promise.all([
    db.getAllAsync<PlantUpdateRow>(
      `SELECT * FROM plant_updates WHERE id IN (${placeholders(ids)})`,
      [...ids],
    ),
    db.getAllAsync<PlantUpdatePhotoRow>(
      `SELECT * FROM plant_update_photos
        WHERE plant_update_id IN (${placeholders(ids)})
        ORDER BY plant_update_id, position`,
      [...ids],
    ),
  ]);
  const photosByUpdate = groupPhotosByUpdate(photos);
  return rows.map((row) =>
    plantUpdateFromRows(row, photosByUpdate.get(row.id) ?? []),
  );
}

function groupPhotosByUpdate(
  photos: readonly PlantUpdatePhotoRow[],
): ReadonlyMap<string, readonly PlantUpdatePhotoRow[]> {
  const result = new Map<string, PlantUpdatePhotoRow[]>();
  for (const photo of photos) {
    const updatePhotos = result.get(photo.plant_update_id) ?? [];
    updatePhotos.push(photo);
    result.set(photo.plant_update_id, updatePhotos);
  }
  return result;
}

function placeholders(values: readonly string[]): string {
  return values.map(() => "?").join(", ");
}

function normalizePageSize(value: number): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error("Journal page size must be a positive integer.");
  }
  return Math.min(value, JOURNAL_SCAN_BATCH_SIZE);
}

function resolveDateFrom(
  range: JournalCriteria["dateRange"],
  evaluatedAt: Date,
): string | null {
  if (range === "all") return null;
  const start = new Date(
    evaluatedAt.getFullYear(),
    evaluatedAt.getMonth(),
    evaluatedAt.getDate(),
  );
  if (range === "week") start.setDate(start.getDate() - 6);
  return start.toISOString();
}
