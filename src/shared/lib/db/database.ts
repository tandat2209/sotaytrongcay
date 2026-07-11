import * as SQLite from "expo-sqlite";

export const DB_NAME = "sotaytrongcay.db";
export const DATABASE_VERSION = 2;

const INITIAL_MIGRATION = `
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

export function getMigrationStatements(currentVersion: number): string[] {
  return currentVersion < DATABASE_VERSION ? [INITIAL_MIGRATION] : [];
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
