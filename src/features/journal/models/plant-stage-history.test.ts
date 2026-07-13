import { createPlantStageHistory } from "./plant-stage-history";

const input = {
  id: "7174d8e3-df23-4f13-9e06-245ebfc9877b",
  plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  fromStageId: "grape.stage.trunk-development",
  toStageId: "grape.stage.bud-break",
  journalEntryId: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  changedAt: "2026-07-13T15:00:00.000Z",
  createdAt: "2026-07-13T15:00:00.000Z",
} as const;

describe("createPlantStageHistory", () => {
  it("creates one journal-linked stage transition when the stage changes", () => {
    expect(createPlantStageHistory(input)).toEqual(input);
  });

  it("returns null when the confirmed stage is unchanged", () => {
    expect(createPlantStageHistory({ ...input, toStageId: input.fromStageId })).toBeNull();
  });
});
