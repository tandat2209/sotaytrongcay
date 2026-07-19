import { filterUserFertilizers } from "./filter-user-fertilizers";

const fertilizers = [
  {
    id: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
    mutationId: "4ad47724-12dc-4d89-83da-54c0ef1cb770",
    name: "Phân trùn quế",
    group: "organic",
    knowledgeId: null,
    createdAt: "2026-07-16T08:00:00.000Z",
    updatedAt: "2026-07-16T08:00:00.000Z",
  },
  {
    id: "6ad47724-12dc-4d89-83da-54c0ef1cb770",
    mutationId: "7ad47724-12dc-4d89-83da-54c0ef1cb770",
    name: "NPK 20-20-15",
    group: "npk-balanced",
    knowledgeId: null,
    createdAt: "2026-07-16T08:00:00.000Z",
    updatedAt: "2026-07-16T08:00:00.000Z",
  },
] as const;

describe("filterUserFertilizers", () => {
  it("keeps only fertilizers from the selected group while matching search", () => {
    expect(filterUserFertilizers(fertilizers, "phân", "organic")).toEqual([
      fertilizers[0],
    ]);
  });

  it("keeps every fertilizer when no group filter is selected", () => {
    expect(filterUserFertilizers(fertilizers, "", null)).toEqual(fertilizers);
  });
});
