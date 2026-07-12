import * as SQLite from "expo-sqlite";

export const DB_NAME = "sotaytrongcay.db";
export const DATABASE_VERSION = 3;

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

export function getMigrationStatements(currentVersion: number): string[] {
  const migrations: string[] = [];
  if (currentVersion < 2) migrations.push(V2_INITIAL_MIGRATION);
  if (currentVersion < 3) migrations.push(V3_ADD_LOCATION);
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
    DROP TABLE IF EXISTS care_activities;
    DROP TABLE IF EXISTS activities;
    DROP TABLE IF EXISTS observations;
    DROP TABLE IF EXISTS plants;
    PRAGMA user_version = 0;
  `);
  await initializeDatabase();
}
