import type { CareActivity } from "./care-activity";
import type { PlantUpdate } from "./plant-update";
import { createJournalItems } from "./journal-item";

const care: CareActivity = {
  id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
  plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  type: "watering",
  occurredAt: "2026-07-12T08:00:00.000Z",
  origin: "manual",
  amount: null,
  notes: null,
  createdAt: "2026-07-12T08:00:00.000Z",
};

const update: PlantUpdate = {
  id: "8a41defa-4dab-4983-a83b-326c730dd907",
  mutationId: "e5ba0d31-9de3-433b-b475-4d8bec3b6a48",
  plantId: care.plantId,
  occurredAt: "2026-07-13T08:00:00.000Z",
  notes: "Chồi mới.",
  stageId: "grape.stage.bud-break",
  photos: [],
  createdAt: "2026-07-13T08:00:00.000Z",
};

describe("createJournalItems", () => {
  it("interleaves care and plant updates by occurrence time", () => {
    expect(
      createJournalItems([care], [update]).map(
        (item) => `${item.kind}:${item.id}`,
      ),
    ).toEqual([`update:${update.id}`, `care:${care.id}`]);
  });

  it("does not mutate source arrays", () => {
    const activities = [care];
    const updates = [update];
    createJournalItems(activities, updates);
    expect(activities).toEqual([care]);
    expect(updates).toEqual([update]);
  });
});
