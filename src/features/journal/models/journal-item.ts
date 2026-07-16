import type { CareActivity } from "./care-activity";
import type { PlantUpdate } from "./plant-update";

export type JournalItem =
  | Readonly<{
      id: string;
      kind: "care";
      occurredAt: string;
      record: CareActivity;
    }>
  | Readonly<{
      id: string;
      kind: "update";
      occurredAt: string;
      record: PlantUpdate;
    }>;

export function createJournalItems(
  activities: readonly CareActivity[],
  updates: readonly PlantUpdate[],
): JournalItem[] {
  return [
    ...activities.map((record): JournalItem => ({
      id: record.id,
      kind: "care",
      occurredAt: record.occurredAt,
      record,
    })),
    ...updates.map((record): JournalItem => ({
      id: record.id,
      kind: "update",
      occurredAt: record.occurredAt,
      record,
    })),
  ].sort(
    (left, right) =>
      right.occurredAt.localeCompare(left.occurredAt) ||
      right.record.createdAt.localeCompare(left.record.createdAt) ||
      right.kind.localeCompare(left.kind) ||
      right.id.localeCompare(left.id),
  );
}
