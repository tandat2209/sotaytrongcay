import { DATABASE_VERSION, getMigrationStatements } from "./database";

describe("database migrations", () => {
  it("creates plants and care activities with stable watering units", () => {
    const sql = getMigrationStatements(0).join("\n");

    expect(DATABASE_VERSION).toBe(2);
    expect(sql).toContain("CREATE TABLE plants");
    expect(sql).toContain("name TEXT NOT NULL");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS care_activities");
    expect(sql).toContain("amount_unit TEXT CHECK (amount_unit IN ('liter'))");
    expect(sql).toContain("mutation_id TEXT NOT NULL UNIQUE");
  });

  it("resets the prototype tables before establishing the clean baseline", () => {
    const sql = getMigrationStatements(0).join("\n");

    expect(sql).toContain("DROP TABLE IF EXISTS activities");
    expect(sql).toContain("DROP TABLE IF EXISTS observations");
    expect(sql).toContain("DROP TABLE IF EXISTS plants");
  });

  it("resets version-one prototype databases before using the current schema", () => {
    const sql = getMigrationStatements(1).join("\n");

    expect(sql).toContain("DROP TABLE IF EXISTS activities");
    expect(sql).toContain("CREATE TABLE plants");
  });

  it("does not return applied migrations", () => {
    expect(getMigrationStatements(DATABASE_VERSION)).toEqual([]);
  });
});
