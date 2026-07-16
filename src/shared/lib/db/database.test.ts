import { DATABASE_VERSION, getMigrationStatements } from "./database";

describe("database migrations", () => {
  it("creates the complete unreleased schema from one V1 baseline", () => {
    const migrations = getMigrationStatements(0);

    expect(DATABASE_VERSION).toBe(1);
    expect(migrations).toHaveLength(1);

    const [sql] = migrations;
    expect(sql).toContain("CREATE TABLE plants");
    expect(sql).toContain("location TEXT");
    expect(sql).toContain("growing_method TEXT NOT NULL");
    expect(sql).toContain("stage_started_at TEXT");

    expect(sql).toContain("CREATE TABLE care_activities");
    expect(sql).toContain("watering_intensity TEXT");
    expect(sql).toContain("spray_target_id TEXT");
    expect(sql).toContain("spray_target_name_snapshot TEXT");
    expect(sql).toContain(
      "(spray_target_id IS NULL) = (spray_target_name_snapshot IS NULL)",
    );

    expect(sql).toContain("CREATE TABLE plant_updates");
    expect(sql).toContain("CREATE TABLE plant_update_photos");
    expect(sql).toContain("CREATE TABLE plant_stage_history");
    expect(sql).toContain("CREATE TABLE stage_care_plan_schedule_snapshots");
    expect(sql).toContain("ground_frequency_override_days INTEGER");
    expect(sql).toContain("container_frequency_override_days INTEGER");
    expect(sql).toContain("CREATE TABLE plant_care_plan_schedule_snapshots");
    expect(sql).toContain("CREATE TABLE plant_care_plan_notification_states");
    expect(sql).toContain("CREATE TABLE user_fertilizers");
    expect(sql).toContain("knowledge_id TEXT");
    expect(sql).toContain("CREATE TABLE fertilizer_applications");
    expect(sql).toContain("knowledge_id_snapshot TEXT");
    expect(sql).toContain("CREATE TABLE weather_locations");
    expect(sql).toContain("CREATE TABLE weather_cache");
    expect(sql).toContain("CREATE INDEX idx_care_activities_time");
    expect(sql).toContain("CREATE INDEX idx_plant_updates_time");

    expect(sql).not.toContain("ALTER TABLE");
    expect(sql).not.toContain("DROP TABLE");
    expect(sql).not.toContain("UPDATE plants");
    expect(sql).not.toContain("care_plan_reminder_preferences");
    expect(sql).not.toContain("npk_snapshot");
  });

  it("does not migrate an installed V1 database", () => {
    expect(getMigrationStatements(DATABASE_VERSION)).toEqual([]);
  });
});
