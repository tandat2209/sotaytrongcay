import type { SQLiteDatabase } from "expo-sqlite";
import { DATABASE_VERSION, runDatabaseWrite } from "@/shared/lib/db/database";

const SMOKE_PLANT_ID = "00000000-0000-4000-8000-000000000001";
const UPDATED_PLANT_NAME = "Database smoke updated";
const EXPECTED_TABLES = [
  "care_activities",
  "fertilizer_applications",
  "plant_care_plan_notification_states",
  "plant_care_plan_schedule_snapshots",
  "plant_stage_history",
  "plant_update_photos",
  "plant_updates",
  "plants",
  "stage_care_plan_schedule_snapshots",
  "user_fertilizers",
  "weather_cache",
  "weather_locations",
] as const;

type DatabaseSmokeCounts = Readonly<{
  careActivities: number;
  photos: number;
  plantUpdates: number;
  plants: number;
}>;

export type DatabaseSmokeSnapshot = Readonly<{
  afterDelete: DatabaseSmokeCounts;
  beforeDelete: DatabaseSmokeCounts;
  foreignKeys: number;
  foreignKeyViolations: number;
  integrityCheck: string;
  journalMode: string;
  tables: readonly string[];
  updatedPlantName: string | null;
  userVersion: number;
}>;

export type DatabaseSmokeResult = Readonly<{
  foreignKeys: true;
  integrity: true;
  journalMode: "wal";
  schema: true;
  userVersion: number;
}>;

export async function runAndroidDatabaseSmokeCheck(): Promise<DatabaseSmokeResult> {
  return await runDatabaseWrite(async (db) => {
    const versionRow = await db.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version;",
    );
    const journalRow = await db.getFirstAsync<{ journal_mode: string }>(
      "PRAGMA journal_mode;",
    );
    const foreignKeyRow = await db.getFirstAsync<{ foreign_keys: number }>(
      "PRAGMA foreign_keys;",
    );
    const integrityRow = await db.getFirstAsync<{ quick_check: string }>(
      "PRAGMA quick_check;",
    );
    const foreignKeyViolations = await db.getAllAsync<{
      fkid: number;
      parent: string;
      rowid: number;
      table: string;
    }>("PRAGMA foreign_key_check;");
    const tableRows = await db.getAllAsync<{ name: string }>(
      `SELECT name
         FROM sqlite_master
        WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name`,
    );
    let lifecycleSnapshot:
      | Pick<
          DatabaseSmokeSnapshot,
          "afterDelete" | "beforeDelete" | "updatedPlantName"
        >
      | undefined;

    await db.withExclusiveTransactionAsync(async (transaction) => {
      await insertSmokeRecords(transaction);
      await transaction.runAsync("UPDATE plants SET name = ? WHERE id = ?", [
        UPDATED_PLANT_NAME,
        SMOKE_PLANT_ID,
      ]);
      const updatedPlant = await transaction.getFirstAsync<{ name: string }>(
        "SELECT name FROM plants WHERE id = ?",
        [SMOKE_PLANT_ID],
      );
      const beforeDelete = await readSmokeCounts(transaction);
      await transaction.runAsync("DELETE FROM plants WHERE id = ?", [
        SMOKE_PLANT_ID,
      ]);
      lifecycleSnapshot = {
        afterDelete: await readSmokeCounts(transaction),
        beforeDelete,
        updatedPlantName: updatedPlant?.name ?? null,
      };
    });

    if (!lifecycleSnapshot) {
      throw new Error("Database smoke transaction did not complete.");
    }
    return validateDatabaseSmokeSnapshot({
      ...lifecycleSnapshot,
      foreignKeys: foreignKeyRow?.foreign_keys ?? 0,
      foreignKeyViolations: foreignKeyViolations.length,
      integrityCheck: integrityRow?.quick_check ?? "",
      journalMode: journalRow?.journal_mode ?? "",
      tables: tableRows.map((row) => row.name),
      userVersion: versionRow?.user_version ?? 0,
    });
  });
}

export function validateDatabaseSmokeSnapshot(
  snapshot: DatabaseSmokeSnapshot,
): DatabaseSmokeResult {
  if (snapshot.userVersion !== DATABASE_VERSION) {
    throw new Error(
      `Expected database V${DATABASE_VERSION}, received V${snapshot.userVersion}.`,
    );
  }
  if (snapshot.journalMode.toLocaleLowerCase() !== "wal") {
    throw new Error(
      `Expected WAL journal mode, received ${snapshot.journalMode}.`,
    );
  }
  if (snapshot.foreignKeys !== 1) {
    throw new Error("SQLite foreign keys are not enabled.");
  }
  if (
    snapshot.integrityCheck.toLocaleLowerCase() !== "ok" ||
    snapshot.foreignKeyViolations !== 0
  ) {
    throw new Error("SQLite integrity or foreign-key verification failed.");
  }
  const missingTables = EXPECTED_TABLES.filter(
    (table) => !snapshot.tables.includes(table),
  );
  if (missingTables.length > 0) {
    throw new Error(
      `SQLite schema is incomplete; missing ${missingTables.join(", ")}.`,
    );
  }
  if (
    snapshot.updatedPlantName !== UPDATED_PLANT_NAME ||
    !allCountsEqual(snapshot.beforeDelete, 1)
  ) {
    throw new Error(
      "SQLite create, read, or update smoke verification failed.",
    );
  }
  if (!allCountsEqual(snapshot.afterDelete, 0)) {
    throw new Error("SQLite foreign-key cascade smoke verification failed.");
  }
  return {
    foreignKeys: true,
    integrity: true,
    journalMode: "wal",
    schema: true,
    userVersion: snapshot.userVersion,
  };
}

async function insertSmokeRecords(db: SQLiteDatabase): Promise<void> {
  await db.runAsync(
    `INSERT INTO plants
      (id, name, species_id, stage_id, growing_method, location, planted_at,
       stage_started_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      SMOKE_PLANT_ID,
      "Database smoke",
      "plant.smoke",
      "stage.smoke",
      "container",
      null,
      null,
      null,
      "2026-07-16T00:00:00.000Z",
    ],
  );
  await db.runAsync(
    `INSERT INTO care_activities
      (id, mutation_id, plant_id, activity_type, occurred_at, origin,
       watering_intensity, amount_value, amount_unit, spray_target_id,
       spray_target_name_snapshot, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "00000000-0000-4000-8000-000000000002",
      "00000000-0000-4000-8000-000000000003",
      SMOKE_PLANT_ID,
      "watering",
      "2026-07-16T00:01:00.000Z",
      "manual",
      "moderate",
      null,
      null,
      null,
      null,
      "Database smoke care",
      "2026-07-16T00:01:00.000Z",
    ],
  );
  await db.runAsync(
    `INSERT INTO plant_updates
      (id, mutation_id, plant_id, occurred_at, notes, stage_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      "00000000-0000-4000-8000-000000000004",
      "00000000-0000-4000-8000-000000000005",
      SMOKE_PLANT_ID,
      "2026-07-16T00:02:00.000Z",
      "Database smoke update",
      "stage.smoke",
      "2026-07-16T00:02:00.000Z",
    ],
  );
  await db.runAsync(
    `INSERT INTO plant_update_photos
      (id, plant_update_id, local_uri, position, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      "00000000-0000-4000-8000-000000000006",
      "00000000-0000-4000-8000-000000000004",
      "file:///database-smoke.jpg",
      0,
      "2026-07-16T00:02:00.000Z",
    ],
  );
}

async function readSmokeCounts(
  db: SQLiteDatabase,
): Promise<DatabaseSmokeCounts> {
  const plants = await readCount(
    db,
    "SELECT COUNT(*) AS count FROM plants WHERE id = ?",
    [SMOKE_PLANT_ID],
  );
  const careActivities = await readCount(
    db,
    "SELECT COUNT(*) AS count FROM care_activities WHERE plant_id = ?",
    [SMOKE_PLANT_ID],
  );
  const plantUpdates = await readCount(
    db,
    "SELECT COUNT(*) AS count FROM plant_updates WHERE plant_id = ?",
    [SMOKE_PLANT_ID],
  );
  const photos = await readCount(
    db,
    `SELECT COUNT(*) AS count
         FROM plant_update_photos AS photo
         JOIN plant_updates AS entry ON entry.id = photo.plant_update_id
        WHERE entry.plant_id = ?`,
    [SMOKE_PLANT_ID],
  );
  return { careActivities, photos, plantUpdates, plants };
}

async function readCount(
  db: SQLiteDatabase,
  sql: string,
  params: string[],
): Promise<number> {
  const row = await db.getFirstAsync<{ count: number }>(sql, params);
  return row?.count ?? 0;
}

function allCountsEqual(counts: DatabaseSmokeCounts, expected: number) {
  return Object.values(counts).every((count) => count === expected);
}
