export type JournalRecordFilter =
  "all" | "care" | "fertilizing" | "spraying" | "update" | "watering";

export type JournalDateRange = "all" | "today" | "week";

export type JournalCriteria = Readonly<{
  dateRange: JournalDateRange;
  plantId: string | null;
  query: string;
  recordFilter: JournalRecordFilter;
}>;

export const emptyJournalCriteria: JournalCriteria = {
  dateRange: "all",
  plantId: null,
  query: "",
  recordFilter: "all",
};

export type JournalCursor = Readonly<{
  createdAt: string;
  id: string;
  kind: "care" | "update";
  occurredAt: string;
}>;
