import * as SQLite from "expo-sqlite";

export const DB_NAME = "sotaytrongcay.db";
export const DATABASE_VERSION = 15;

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

const V7_ADD_CARE_PLAN_REMINDER_PREFERENCES = `
CREATE TABLE care_plan_reminder_preferences (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  plant_id TEXT NOT NULL,
  care_plan_id TEXT NOT NULL,
  care_plan_version TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('watering', 'fertilizing', 'spraying')),
  recommended_interval_days INTEGER NOT NULL CHECK (recommended_interval_days > 0),
  custom_interval_days INTEGER CHECK (custom_interval_days IS NULL OR custom_interval_days > 0),
  notification_time TEXT,
  notification_enabled INTEGER NOT NULL DEFAULT 0 CHECK (notification_enabled IN (0, 1)),
  paused_at TEXT,
  is_applicable INTEGER NOT NULL DEFAULT 1 CHECK (is_applicable IN (0, 1)),
  main_notification_id TEXT,
  follow_up_notification_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (plant_id, care_plan_id),
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE INDEX idx_care_plan_reminder_preferences_plant
  ON care_plan_reminder_preferences(plant_id, is_applicable);
`;

const V8_REPLACE_REMINDER_PREFERENCES = `
DROP TABLE IF EXISTS care_plan_reminder_preferences;

CREATE TABLE stage_care_plan_schedule_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  stage_id TEXT NOT NULL,
  care_plan_id TEXT NOT NULL,
  frequency_override_days INTEGER CHECK (frequency_override_days IS NULL OR frequency_override_days > 0),
  notification_enabled INTEGER NOT NULL DEFAULT 0 CHECK (notification_enabled IN (0, 1)),
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
  notification_enabled INTEGER NOT NULL DEFAULT 0 CHECK (notification_enabled IN (0, 1)),
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

CREATE INDEX idx_plant_schedule_snapshots_plant_active
  ON plant_care_plan_schedule_snapshots(plant_id, is_active);
`;

const V9_SPLIT_STAGE_FREQUENCY_BY_GROWING_METHOD = `
ALTER TABLE stage_care_plan_schedule_snapshots RENAME TO stage_care_plan_schedule_snapshots_v8;

CREATE TABLE stage_care_plan_schedule_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  stage_id TEXT NOT NULL,
  care_plan_id TEXT NOT NULL,
  ground_frequency_override_days INTEGER CHECK (ground_frequency_override_days IS NULL OR ground_frequency_override_days > 0),
  container_frequency_override_days INTEGER CHECK (container_frequency_override_days IS NULL OR container_frequency_override_days > 0),
  notification_enabled INTEGER NOT NULL DEFAULT 0 CHECK (notification_enabled IN (0, 1)),
  notification_time TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (stage_id, care_plan_id)
);

INSERT INTO stage_care_plan_schedule_snapshots (
  id, mutation_id, stage_id, care_plan_id,
  ground_frequency_override_days, container_frequency_override_days,
  notification_enabled, notification_time, created_at, updated_at
)
SELECT
  id, mutation_id, stage_id, care_plan_id,
  frequency_override_days, frequency_override_days,
  notification_enabled, notification_time, created_at, updated_at
FROM stage_care_plan_schedule_snapshots_v8;

DROP TABLE stage_care_plan_schedule_snapshots_v8;
`;

const V10_ADD_WATERING_INTENSITY = `
ALTER TABLE care_activities ADD COLUMN watering_intensity TEXT
  CHECK (watering_intensity IS NULL OR watering_intensity IN ('light', 'moderate', 'deep', 'rain'));
`;

const V11_ADD_USER_FERTILIZERS = `
CREATE TABLE user_fertilizers (
  id TEXT PRIMARY KEY NOT NULL,
  mutation_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  fertilizer_group TEXT CHECK (
    fertilizer_group IS NULL OR
    fertilizer_group IN ('organic', 'npk', 'single', 'supplement', 'other')
  ),
  npk TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_user_fertilizers_name
  ON user_fertilizers(name COLLATE NOCASE);
`;

const V12_ADD_FERTILIZER_APPLICATIONS = `
CREATE TABLE fertilizer_applications (
  id TEXT PRIMARY KEY NOT NULL,
  care_activity_id TEXT NOT NULL,
  user_fertilizer_id TEXT,
  position INTEGER NOT NULL CHECK (position >= 0),
  name_snapshot TEXT NOT NULL,
  group_snapshot TEXT CHECK (
    group_snapshot IS NULL OR
    group_snapshot IN ('organic', 'npk', 'single', 'supplement', 'other')
  ),
  npk_snapshot TEXT,
  amount_value REAL CHECK (amount_value IS NULL OR amount_value > 0),
  amount_unit TEXT CHECK (
    amount_unit IS NULL OR
    amount_unit IN ('handful', 'spoon', 'cap', 'gram', 'milliliter', 'other')
  ),
  application_method TEXT CHECK (
    application_method IS NULL OR
    application_method IN ('root', 'drench', 'foliar', 'topdress')
  ),
  notes TEXT,
  UNIQUE (care_activity_id, position),
  FOREIGN KEY (care_activity_id) REFERENCES care_activities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_fertilizer_id) REFERENCES user_fertilizers(id) ON DELETE SET NULL,
  CHECK ((amount_value IS NULL) = (amount_unit IS NULL))
);

CREATE INDEX idx_fertilizer_applications_activity
  ON fertilizer_applications(care_activity_id, position);
`;

const V13_REMOVE_NPK_RATIO_FIELDS = `
ALTER TABLE user_fertilizers DROP COLUMN npk;
ALTER TABLE fertilizer_applications DROP COLUMN npk_snapshot;
`;

const V14_LINK_SUGGESTED_FERTILIZERS = `
ALTER TABLE user_fertilizers ADD COLUMN knowledge_id TEXT;
CREATE UNIQUE INDEX idx_user_fertilizers_knowledge_id
  ON user_fertilizers(knowledge_id)
  WHERE knowledge_id IS NOT NULL;

ALTER TABLE fertilizer_applications ADD COLUMN knowledge_id_snapshot TEXT;
CREATE INDEX idx_fertilizer_applications_knowledge_time
  ON fertilizer_applications(knowledge_id_snapshot, care_activity_id);
`;

const V15_ADD_SPRAY_TARGET_SNAPSHOT = `
ALTER TABLE care_activities ADD COLUMN spray_target_id TEXT
  CHECK (
    spray_target_id IS NULL OR
    spray_target_id GLOB 'pest.*' OR
    spray_target_id GLOB 'disease.*'
  );

ALTER TABLE care_activities ADD COLUMN spray_target_name_snapshot TEXT
  CHECK (
    (spray_target_id IS NULL) = (spray_target_name_snapshot IS NULL)
  );
`;

export function getMigrationStatements(currentVersion: number): string[] {
  const migrations: string[] = [];
  if (currentVersion < 2) migrations.push(V2_INITIAL_MIGRATION);
  if (currentVersion < 3) migrations.push(V3_ADD_LOCATION);
  if (currentVersion < 4) migrations.push(V4_ADD_GROWING_METHOD);
  if (currentVersion < 5) migrations.push(V5_ADD_PLANT_UPDATES);
  if (currentVersion < 6) migrations.push(V6_ADD_STAGE_STARTED_AT);
  if (currentVersion < 7)
    migrations.push(V7_ADD_CARE_PLAN_REMINDER_PREFERENCES);
  if (currentVersion < 8) migrations.push(V8_REPLACE_REMINDER_PREFERENCES);
  if (currentVersion < 9)
    migrations.push(V9_SPLIT_STAGE_FREQUENCY_BY_GROWING_METHOD);
  if (currentVersion < 10) migrations.push(V10_ADD_WATERING_INTENSITY);
  if (currentVersion < 11) migrations.push(V11_ADD_USER_FERTILIZERS);
  if (currentVersion < 12) migrations.push(V12_ADD_FERTILIZER_APPLICATIONS);
  if (currentVersion < 13) migrations.push(V13_REMOVE_NPK_RATIO_FIELDS);
  if (currentVersion < 14) migrations.push(V14_LINK_SUGGESTED_FERTILIZERS);
  if (currentVersion < 15) migrations.push(V15_ADD_SPRAY_TARGET_SNAPSHOT);
  return migrations;
}

export async function getDb() {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync("PRAGMA foreign_keys = ON;");
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
  );
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
  await initializeDatabase();
}
