import { FertilizerApplicationSchema } from "./fertilizer-application";
import { toggleSuggestedFertilizerApplication } from "./suggested-fertilizer-application";

const application = {
  id: "bb88afb9-82cc-4d55-9635-fd645f7f51be",
  careActivityId: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  userFertilizerId: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
  position: 0,
  nameSnapshot: "Phân trùn quế",
  groupSnapshot: "organic",
  npkSnapshot: null,
  amountValue: 2,
  amountUnit: "handful",
  applicationMethod: "topdress",
  notes: null,
} as const;

describe("FertilizerApplicationSchema", () => {
  it("accepts an ordered immutable application snapshot", () => {
    expect(FertilizerApplicationSchema.parse(application)).toEqual(application);
  });

  it("allows history to outlive its reusable fertilizer", () => {
    expect(
      FertilizerApplicationSchema.parse({
        ...application,
        userFertilizerId: null,
      }).nameSnapshot,
    ).toBe(application.nameSnapshot);
  });

  it("requires amount and unit together", () => {
    expect(() =>
      FertilizerApplicationSchema.parse({
        ...application,
        amountUnit: null,
      }),
    ).toThrow();
  });

  it("rejects unsupported application methods", () => {
    expect(() =>
      FertilizerApplicationSchema.parse({
        ...application,
        applicationMethod: "inject",
      }),
    ).toThrow();
  });
});

describe("toggleSuggestedFertilizerApplication", () => {
  const suggestion = {
    id: "fertilizer.potassium-sulfate",
    name: "Kali sunfat",
    group: "single" as const,
  };

  it("adds a knowledge suggestion to the unsaved application draft", () => {
    expect(toggleSuggestedFertilizerApplication([], suggestion)).toEqual([
      {
        userFertilizerId: null,
        nameSnapshot: "Kali sunfat",
        groupSnapshot: "single",
        npkSnapshot: null,
        amountValue: null,
        amountUnit: null,
        applicationMethod: null,
        notes: null,
      },
    ]);
  });

  it("removes an already selected suggestion without changing other applications", () => {
    expect(
      toggleSuggestedFertilizerApplication(
        [
          application,
          {
            ...application,
            userFertilizerId: null,
            nameSnapshot: "Kali sunfat",
            groupSnapshot: "single",
          },
        ],
        suggestion,
      ),
    ).toEqual([application]);
  });
});
