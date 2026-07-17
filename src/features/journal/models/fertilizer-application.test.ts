import { FertilizerApplicationSchema } from "./fertilizer-application";
import {
  selectLatestUserFertilizerUsages,
  selectLatestFertilizerSuggestionUsages,
  toggleSuggestedFertilizerApplication,
} from "./suggested-fertilizer-application";

const application = {
  id: "bb88afb9-82cc-4d55-9635-fd645f7f51be",
  careActivityId: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  userFertilizerId: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
  position: 0,
  nameSnapshot: "Phân trùn quế",
  groupSnapshot: "organic",
  knowledgeIdSnapshot: null,
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
  const userFertilizerId = "ba88afb9-82cc-4d55-9635-fd645f7f51be";
  const suggestion = {
    id: "fertilizer.potassium-sulfate",
    name: "Kali sunfat",
    group: "single" as const,
  };

  it("adds a knowledge suggestion to the unsaved application draft", () => {
    expect(
      toggleSuggestedFertilizerApplication([], suggestion, userFertilizerId),
    ).toEqual([
      {
        userFertilizerId,
        nameSnapshot: "Kali sunfat",
        groupSnapshot: "single",
        knowledgeIdSnapshot: suggestion.id,
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
            knowledgeIdSnapshot: suggestion.id,
          },
        ],
        suggestion,
        userFertilizerId,
      ),
    ).toEqual([application]);
  });
});

describe("selectLatestFertilizerSuggestionUsages", () => {
  it("keeps the newest saved use for each stable knowledge ID", () => {
    const usages = selectLatestFertilizerSuggestionUsages([
      {
        knowledgeId: "fertilizer.compost",
        occurredAt: "2026-07-12T08:00:00.000Z",
        plantName: "Cây Nho Cũ",
      },
      {
        knowledgeId: "fertilizer.compost",
        occurredAt: "2026-07-14T08:00:00.000Z",
        plantName: "Cây Nho",
      },
    ]);

    expect(usages["fertilizer.compost"]).toEqual({
      knowledgeId: "fertilizer.compost",
      occurredAt: "2026-07-14T08:00:00.000Z",
      plantName: "Cây Nho",
    });
  });
});

describe("selectLatestUserFertilizerUsages", () => {
  it("keeps the newest saved use for each private fertilizer", () => {
    const usages = selectLatestUserFertilizerUsages([
      {
        fertilizerId: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
        occurredAt: "2026-07-12T08:00:00.000Z",
        plantName: "Cây Nho Cũ",
      },
      {
        fertilizerId: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
        occurredAt: "2026-07-14T08:00:00.000Z",
        plantName: "Cây Nho",
      },
    ]);

    expect(usages["5ad47724-12dc-4d89-83da-54c0ef1cb770"]).toEqual({
      fertilizerId: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
      occurredAt: "2026-07-14T08:00:00.000Z",
      plantName: "Cây Nho",
    });
  });
});
