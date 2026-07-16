import {
  createJournalHeaderQuery,
  journalCursorFromRow,
  matchesJournalSearch,
  type JournalHeaderRow,
} from "./journal-page-repository";

const row: JournalHeaderRow = {
  activity_type: "watering",
  created_at: "2026-07-16T08:00:00.000Z",
  id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  kind: "care",
  notes: "Đã tưới dưới giàn nho",
  occurred_at: "2026-07-16T07:00:00.000Z",
  plant_id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
};

describe("journal page repository query", () => {
  it("builds a bounded stable cursor query with database filters", () => {
    const cursor = journalCursorFromRow(row);
    const query = createJournalHeaderQuery({
      criteria: {
        dateRange: "week",
        plantId: row.plant_id,
        query: "nho",
        recordFilter: "watering",
      },
      cursor,
      dateFrom: "2026-07-10T00:00:00.000Z",
      limit: 61,
    });

    expect(query.sql).toContain("plant_id = ?");
    expect(query.sql).toContain("activity_type = ?");
    expect(query.sql).toContain("occurred_at >= ?");
    expect(query.sql).toContain("occurred_at < ?");
    expect(query.sql).toContain(
      "ORDER BY occurred_at DESC, created_at DESC, kind DESC, id DESC",
    );
    expect(query.sql).toContain("LIMIT ?");
    expect(query.params).toEqual([
      row.plant_id,
      "watering",
      "2026-07-10T00:00:00.000Z",
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
      61,
    ]);
  });

  it("matches Vietnamese note search using the app locale", () => {
    expect(matchesJournalSearch(row, "đã TƯỚI")).toBe(true);
    expect(matchesJournalSearch(row, "sâu bệnh")).toBe(false);
  });
});
