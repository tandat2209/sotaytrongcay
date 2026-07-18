import type { UserFertilizer } from "@/features/fertilizers";
import {
  selectRecentUserFertilizers,
  toggleUserFertilizerApplication,
} from "./fertilizer-selection";

const organicFertilizer: UserFertilizer = {
  id: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
  mutationId: "4ad47724-12dc-4d89-83da-54c0ef1cb770",
  name: "Phân trùn quế",
  group: "organic",
  knowledgeId: null,
  createdAt: "2026-07-16T08:00:00.000Z",
  updatedAt: "2026-07-16T08:00:00.000Z",
};
const npkFertilizer: UserFertilizer = {
  id: "6ad47724-12dc-4d89-83da-54c0ef1cb770",
  mutationId: "7ad47724-12dc-4d89-83da-54c0ef1cb770",
  name: "NPK 20-20-15",
  group: "npk",
  knowledgeId: null,
  createdAt: "2026-07-16T08:00:00.000Z",
  updatedAt: "2026-07-16T08:00:00.000Z",
};
const fertilizers = [organicFertilizer, npkFertilizer] as const;

describe("fertilizer selection", () => {
  it("orders only previously used fertilizers by their latest use", () => {
    expect(
      selectRecentUserFertilizers(fertilizers, {
        [organicFertilizer.id]: {
          fertilizerId: organicFertilizer.id,
          occurredAt: "2026-07-12T08:00:00.000Z",
          plantName: "Nho 1",
        },
        [npkFertilizer.id]: {
          fertilizerId: npkFertilizer.id,
          occurredAt: "2026-07-15T08:00:00.000Z",
          plantName: "Nho 2",
        },
      }),
    ).toEqual([npkFertilizer, organicFertilizer]);
  });

  it("adds and removes a catalog fertilizer without application details", () => {
    const selected = toggleUserFertilizerApplication([], organicFertilizer);

    expect(selected).toEqual([
      {
        userFertilizerId: organicFertilizer.id,
        nameSnapshot: "Phân trùn quế",
        groupSnapshot: "organic",
        knowledgeIdSnapshot: null,
        amountValue: null,
        amountUnit: null,
        applicationMethod: null,
        notes: null,
      },
    ]);
    expect(
      toggleUserFertilizerApplication(selected, organicFertilizer),
    ).toEqual([]);
  });
});
