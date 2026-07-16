import * as SQLite from "expo-sqlite";

export const DB_NAME = "sotaytrongcay.db";
export const DATABASE_VERSION = 1;

// The app has not been released, so V1 is the complete fresh-install schema.
// Future schema changes must use forward-only migrations from this baseline.
const V1_INITIAL_SCHEMA = `
CREATE TABLE plants (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  species_id TEXT NOT NULL,
  stage_id TEXT NOT NULL,
  growing_method TEXT NOT NULL DEFAULT 'container'
    CHECK (growing_method IN ('ground', 'container')),
  location TEXT,
  planted_at TEXT,
  stage_started_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE care_activities (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  plant_id TEXT NOT NULL,
  activity_type TEXT NOT NULL
    CHECK (activity_type IN ('watering', 'fertilizing', 'spraying')),
  occurred_at TEXT NOT NULL,
  origin TEXT NOT NULL CHECK (origin IN ('today', 'reminder', 'manual')),
  watering_intensity TEXT
    CHECK (
      watering_intensity IS NULL OR
      watering_intensity IN ('light', 'moderate', 'deep', 'rain')
    ),
  amount_value REAL CHECK (amount_value IS NULL OR amount_value > 0),
  amount_unit TEXT CHECK (amount_unit IS NULL OR amount_unit = 'liter'),
  spray_target_id TEXT
    CHECK (
      spray_target_id IS NULL OR
      spray_target_id GLOB 'pest.*' OR
      spray_target_id GLOB 'disease.*'
    ),
  spray_target_name_snapshot TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  CHECK (
    (spray_target_id IS NULL) = (spray_target_name_snapshot IS NULL)
  )
);

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

CREATE TABLE stage_care_plan_schedule_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  stage_id TEXT NOT NULL,
  care_plan_id TEXT NOT NULL,
  ground_frequency_override_days INTEGER
    CHECK (
      ground_frequency_override_days IS NULL OR
      ground_frequency_override_days > 0
    ),
  container_frequency_override_days INTEGER
    CHECK (
      container_frequency_override_days IS NULL OR
      container_frequency_override_days > 0
    ),
  notification_enabled INTEGER NOT NULL DEFAULT 0
    CHECK (notification_enabled IN (0, 1)),
  notification_time TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (stage_id, care_plan_id)
);

CREATE TABLE plant_care_plan_schedule_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  plant_id TEXT NOT NULL,
  care_plan_id TEXT NOT NULL,
  interval_days INTEGER NOT NULL CHECK (interval_days > 0),
  notification_enabled INTEGER NOT NULL DEFAULT 0
    CHECK (notification_enabled IN (0, 1)),
  notification_time TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (plant_id, care_plan_id),
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE plant_care_plan_notification_states (
  plant_id TEXT NOT NULL,
  care_plan_id TEXT NOT NULL,
  main_notification_id TEXT,
  follow_up_notification_id TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (plant_id, care_plan_id),
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE user_fertilizers (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  fertilizer_group TEXT
    CHECK (
      fertilizer_group IS NULL OR
      fertilizer_group IN ('organic', 'npk', 'single', 'supplement', 'other')
    ),
  knowledge_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE fertilizer_applications (
  id TEXT PRIMARY KEY NOT NULL,
  care_activity_id TEXT NOT NULL,
  user_fertilizer_id TEXT,
  position INTEGER NOT NULL CHECK (position >= 0),
  name_snapshot TEXT NOT NULL,
  group_snapshot TEXT
    CHECK (
      group_snapshot IS NULL OR
      group_snapshot IN ('organic', 'npk', 'single', 'supplement', 'other')
    ),
  knowledge_id_snapshot TEXT,
  amount_value REAL CHECK (amount_value IS NULL OR amount_value > 0),
  amount_unit TEXT
    CHECK (
      amount_unit IS NULL OR
      amount_unit IN ('handful', 'spoon', 'cap', 'gram', 'milliliter', 'other')
    ),
  application_method TEXT
    CHECK (
      application_method IS NULL OR
      application_method IN ('root', 'drench', 'foliar', 'topdress')
    ),
  notes TEXT,
  UNIQUE (care_activity_id, position),
  FOREIGN KEY (care_activity_id) REFERENCES care_activities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_fertilizer_id) REFERENCES user_fertilizers(id) ON DELETE SET NULL,
  CHECK ((amount_value IS NULL) = (amount_unit IS NULL))
);

CREATE INDEX idx_care_activities_plant_time
  ON care_activities(plant_id, occurred_at DESC);
CREATE INDEX idx_plant_updates_plant_time
  ON plant_updates(plant_id, occurred_at DESC, created_at DESC);
CREATE INDEX idx_plant_update_photos_entry_position
  ON plant_update_photos(plant_update_id, position);
CREATE INDEX idx_plant_stage_history_plant_time
  ON plant_stage_history(plant_id, changed_at DESC);
CREATE INDEX idx_plant_schedule_snapshots_plant_active
  ON plant_care_plan_schedule_snapshots(plant_id, is_active);
CREATE INDEX idx_user_fertilizers_name
  ON user_fertilizers(name COLLATE NOCASE);
CREATE UNIQUE INDEX idx_user_fertilizers_knowledge_id
  ON user_fertilizers(knowledge_id)
  WHERE knowledge_id IS NOT NULL;
CREATE INDEX idx_fertilizer_applications_activity
  ON fertilizer_applications(care_activity_id, position);
CREATE INDEX idx_fertilizer_applications_knowledge_time
  ON fertilizer_applications(knowledge_id_snapshot, care_activity_id);
`;

export function getMigrationStatements(currentVersion: number): string[] {
  return currentVersion < DATABASE_VERSION ? [V1_INITIAL_SCHEMA] : [];
}

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync("PRAGMA journal_mode = WAL;");
  await db.execAsync("PRAGMA foreign_keys = ON;");

  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
  );
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion > DATABASE_VERSION) {
    throw new Error(
      `Database version ${currentVersion} is newer than supported version ${DATABASE_VERSION}.`,
    );
  }

  const [migration] = getMigrationStatements(currentVersion);
  if (!migration) return;

  await db.withExclusiveTransactionAsync(async (transaction) => {
    await transaction.execAsync(migration);
    await transaction.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
  });
}

export async function resetDatabase(): Promise<void> {
  const db = await getDb();
  await db.withExclusiveTransactionAsync(async (transaction) => {
    await transaction.execAsync(`
      DROP TABLE IF EXISTS fertilizer_applications;
      DROP TABLE IF EXISTS user_fertilizers;
      DROP TABLE IF EXISTS plant_care_plan_notification_states;
      DROP TABLE IF EXISTS plant_care_plan_schedule_snapshots;
      DROP TABLE IF EXISTS stage_care_plan_schedule_snapshots;
      DROP TABLE IF EXISTS care_plan_reminder_preferences;
      DROP TABLE IF EXISTS plant_stage_history;
      DROP TABLE IF EXISTS plant_update_photos;
      DROP TABLE IF EXISTS plant_updates;
      DROP TABLE IF EXISTS care_activities;
      DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS observations;
      DROP TABLE IF EXISTS plants;
      PRAGMA user_version = 0;
    `);
  });
  await initializeDatabase();
}
