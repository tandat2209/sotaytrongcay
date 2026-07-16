import {
  userFertilizerFromRow,
  userFertilizerToParams,
} from "./user-fertilizer-repository";

const fertilizer = {
  id: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
  mutationId: "f564cc87-e37b-46b2-a22c-071fa186e42e",
  name: "Phân trùn quế",
  group: "organic",
  knowledgeId: null,
  createdAt: "2026-07-16T08:30:00.000Z",
  updatedAt: "2026-07-16T08:30:00.000Z",
} as const;

describe("user fertilizer repository mapping", () => {
  it("maps a fertilizer to stable SQLite parameters", () => {
    expect(userFertilizerToParams(fertilizer)).toEqual([
      fertilizer.id,
      fertilizer.mutationId,
      fertilizer.name,
      "organic",
      null,
      fertilizer.createdAt,
      fertilizer.updatedAt,
    ]);
  });

  it("maps a SQLite row to the domain model", () => {
    expect(
      userFertilizerFromRow({
        id: fertilizer.id,
        mutation_id: fertilizer.mutationId,
        name: fertilizer.name,
        fertilizer_group: "organic",
        knowledge_id: null,
        created_at: fertilizer.createdAt,
        updated_at: fertilizer.updatedAt,
      }),
    ).toEqual(fertilizer);
  });
});
