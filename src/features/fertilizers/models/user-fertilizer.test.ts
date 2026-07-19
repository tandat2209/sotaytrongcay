import {
  NewUserFertilizerSchema,
  UserFertilizerSchema,
} from "./user-fertilizer";

const fertilizer = {
  id: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
  mutationId: "f564cc87-e37b-46b2-a22c-071fa186e42e",
  name: "Phân trùn quế",
  group: "organic",
  knowledgeId: null,
  createdAt: "2026-07-16T08:30:00.000Z",
  updatedAt: "2026-07-16T08:30:00.000Z",
} as const;

describe("UserFertilizerSchema", () => {
  it("accepts a reusable private fertilizer", () => {
    expect(UserFertilizerSchema.parse(fertilizer)).toEqual(fertilizer);
  });

  it("trims the required user label", () => {
    expect(
      NewUserFertilizerSchema.parse({ ...fertilizer, name: "  NPK 13-13-21  " })
        .name,
    ).toBe("NPK 13-13-21");
  });

  it("preserves the stable ID of a knowledge-backed suggestion", () => {
    expect(
      UserFertilizerSchema.parse({
        ...fertilizer,
        knowledgeId: "fertilizer.compost",
      }).knowledgeId,
    ).toBe("fertilizer.compost");
  });

  it("rejects an empty label", () => {
    expect(() =>
      NewUserFertilizerSchema.parse({ ...fertilizer, name: "   " }),
    ).toThrow();
  });

  it("rejects unsupported fertilizer groups", () => {
    expect(() =>
      UserFertilizerSchema.parse({ ...fertilizer, group: "chemical" }),
    ).toThrow();
  });

  it("accepts the unified fertilizer taxonomy", () => {
    const groups = [
      "organic",
      "nitrogen-rich",
      "npk-balanced",
      "phosphorus-rich",
      "potassium-rich",
      "support",
      "other",
    ] as const;

    for (const group of groups) {
      expect(UserFertilizerSchema.parse({ ...fertilizer, group }).group).toBe(
        group,
      );
    }
  });

  it("rejects superseded fertilizer groups", () => {
    for (const group of ["npk", "single", "supplement"]) {
      expect(() =>
        UserFertilizerSchema.parse({ ...fertilizer, group }),
      ).toThrow();
    }
  });
});
