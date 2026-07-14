import * as SQLite from "expo-sqlite";

export const DB_NAME = "sotaytrongcay.db";
export const DATABASE_VERSION = 6;

// Version 2 — initial schema (no location column).
// Drops prototype tables and creates the current baseline.
const V2_INITIAL_MIGRATION = `
DROP TABLE IF EXISTS care_activities;
	DROP TABLE IF EXISTS activities;
	DROP TABLE IF EXISTS observations;
	DROP TABLE IF EXISTS plants;

	CREATE TABLE plants (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  species_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  planted_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS care_activities (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  plant_id TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('watering', 'fertilizing', 'spraying')),
  occurred_at TEXT NOT NULL,
  origin TEXT NOT NULL CHECK (origin IN ('today', 'reminder', 'manual')),
  amount_value REAL CHECK (amount_value IS NULL OR amount_value > 0),
  amount_unit TEXT CHECK (amount_unit IN ('liter')),
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_care_activities_plant_time
  ON care_activities(plant_id, occurred_at DESC);
`;

// Version 3 — adds the location column to plants.
// Devices upgrading from v2 run only this ALTER TABLE.
// Fresh installs (v0 → v2 → v3) run both, which is safe because
// ALTER TABLE adds a nullable column to an existing table.
const V3_ADD_LOCATION = `ALTER TABLE plants ADD COLUMN location TEXT;`;

// Version 4 — records whether each plant grows in ground or a container.
const V4_ADD_GROWING_METHOD = `ALTER TABLE plants ADD COLUMN growing_method TEXT NOT NULL DEFAULT 'container' CHECK (growing_method IN ('ground', 'container'));`;

const V5_ADD_PLANT_UPDATES = `
CREATE TABLE plant_updates (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  plant_id TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  notes TEXT,
  stage_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE plant_update_photos (
  id TEXT PRIMARY KEY NOT NULL,
  plant_update_id TEXT NOT NULL,
  local_uri TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  created_at TEXT NOT NULL,
  UNIQUE (plant_update_id, position),
  FOREIGN KEY (plant_update_id) REFERENCES plant_updates(id) ON DELETE CASCADE
);

CREATE TABLE plant_stage_history (
  id TEXT PRIMARY KEY NOT NULL,
  plant_id TEXT NOT NULL,
  from_stage_id TEXT NOT NULL,
  to_stage_id TEXT NOT NULL,
  journal_entry_id TEXT NOT NULL UNIQUE,
  changed_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (journal_entry_id) REFERENCES plant_updates(id) ON DELETE CASCADE
);

CREATE INDEX idx_plant_updates_plant_time
  ON plant_updates(plant_id, occurred_at DESC, created_at DESC);

CREATE INDEX idx_plant_update_photos_entry_position
  ON plant_update_photos(plant_update_id, position);

CREATE INDEX idx_plant_stage_history_plant_time
  ON plant_stage_history(plant_id, changed_at DESC);
`;

const V6_ADD_STAGE_STARTED_AT = `
ALTER TABLE plants ADD COLUMN stage_started_at TEXT;

UPDATE plants
SET stage_started_at = (
  SELECT history.changed_at
  FROM plant_stage_history AS history
  WHERE history.plant_id = plants.id
    AND history.to_stage_id = plants.stage_id
  ORDER BY history.changed_at DESC
  LIMIT 1
);
`;

export function getMigrationStatements(currentVersion: number): string[] {
  const migrations: string[] = [];
  if (currentVersion < 2) migrations.push(V2_INITIAL_MIGRATION);
  if (currentVersion < 3) migrations.push(V3_ADD_LOCATION);
  if (currentVersion < 4) migrations.push(V4_ADD_GROWING_METHOD);
  if (currentVersion < 5) migrations.push(V5_ADD_PLANT_UPDATES);
  if (currentVersion < 6) migrations.push(V6_ADD_STAGE_STARTED_AT);
  return migrations;
}

export async function getDb() {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync("PRAGMA foreign_keys = ON;");
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version;");
  const currentVersion = row?.user_version ?? 0;

  for (const migration of getMigrationStatements(currentVersion)) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration);
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
    });
  }
}

export async function resetDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    DROP TABLE IF EXISTS plant_stage_history;
    DROP TABLE IF EXISTS plant_update_photos;
    DROP TABLE IF EXISTS plant_updates;
    DROP TABLE IF EXISTS care_activities;
    DROP TABLE IF EXISTS activities;
    DROP TABLE IF EXISTS observations;
    DROP TABLE IF EXISTS plants;
    PRAGMA user_version = 0;
  `);
  await initializeDatabase();
}
