import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'sotaytrongcay.db';

export async function getDb() {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export async function initializeDatabase() {
  const db = await getDb();
  
  // Enable foreign keys
  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  // Basic initialization with raw SQL for MVP
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plants (
      id TEXT PRIMARY KEY NOT NULL,
      species_id TEXT NOT NULL,
      stage_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY NOT NULL,
      plant_id TEXT NOT NULL,
      activity_type TEXT NOT NULL,
      status TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY NOT NULL,
      plant_id TEXT NOT NULL,
      observation_type TEXT NOT NULL,
      value_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_activities_plant_id ON activities(plant_id);
    CREATE INDEX IF NOT EXISTS idx_observations_plant_id ON observations(plant_id);
  `);
}
