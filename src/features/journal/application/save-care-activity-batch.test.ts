import {
  createCareActivityBatchCommands,
  parseCareActivityBatch,
} from "./save-care-activity-batch";

const plantIds = [
  "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  "b775a7ec-fb44-4660-88ed-0f3b1933e7f2",
] as const;

const generatedIds = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
  "66666666-6666-4666-8666-666666666666",
] as const;

const details = {
  estimatedAmountLiters: null,
  fertilizerApplications: [
    {
      userFertilizerId: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
      nameSnapshot: "Phân trùn quế",
      groupSnapshot: "organic",
      knowledgeIdSnapshot: null,
      amountValue: null,
      amountUnit: null,
      applicationMethod: null,
      notes: null,
    },
  ],
  intensity: null,
  notes: "Đã chăm cùng lúc",
  occurredAt: "2026-07-22T08:30:00.000Z",
  sprayTargetId: null,
  sprayTargetNameSnapshot: null,
} as const;

describe("care activity batch", () => {
  it("creates independent activities and fertilizer applications for every plant", () => {
    let index = 0;

    const commands = createCareActivityBatchCommands({
      createId: () => generatedIds[index++] ?? "",
      createdAt: "2026-07-22T08:31:00.000Z",
      details,
      plantIds,
      type: "fertilizing",
    });

    expect(commands).toHaveLength(2);
    expect(commands.map(({ activity }) => activity.plantId)).toEqual(plantIds);
    expect(commands.map(({ activity }) => activity.id)).toEqual([
      generatedIds[0],
      generatedIds[3],
    ]);
    expect(commands.map(({ activity }) => activity.mutationId)).toEqual([
      generatedIds[1],
      generatedIds[4],
    ]);
    expect(commands.map(({ applications }) => applications[0]?.id)).toEqual([
      generatedIds[2],
      generatedIds[5],
    ]);
    expect(
      commands.map(({ applications }) => applications[0]?.careActivityId),
    ).toEqual([generatedIds[0], generatedIds[3]]);
    expect(commands[0]?.applications[0]).not.toBe(commands[1]?.applications[0]);
  });

  it("rejects a batch with fewer than two plants", () => {
    expect(() =>
      createCareActivityBatchCommands({
        createId: () => generatedIds[0],
        createdAt: "2026-07-22T08:31:00.000Z",
        details,
        plantIds: [plantIds[0]],
        type: "fertilizing",
      }),
    ).toThrow();
  });

  it("rejects duplicate plants in one batch", () => {
    expect(() =>
      createCareActivityBatchCommands({
        createId: () => generatedIds[0],
        createdAt: "2026-07-22T08:31:00.000Z",
        details,
        plantIds: [plantIds[0], plantIds[0]],
        type: "fertilizing",
      }),
    ).toThrow();
  });

  it("rejects commands that do not share one activity type and time", () => {
    const commands = createCareActivityBatchCommands({
      createId: (() => {
        let index = 0;
        return () => generatedIds[index++] ?? "";
      })(),
      createdAt: "2026-07-22T08:31:00.000Z",
      details,
      plantIds,
      type: "fertilizing",
    });
    const [first, second] = commands;
    if (!first || !second) throw new Error("Expected two batch commands.");

    expect(() =>
      parseCareActivityBatch([
        first,
        {
          ...second,
          activity: {
            ...second.activity,
            occurredAt: "2026-07-22T09:30:00.000Z",
          },
        },
      ]),
    ).toThrow();
  });

  it("rejects commands whose shared care details differ", () => {
    const commands = createCareActivityBatchCommands({
      createId: (() => {
        let index = 0;
        return () => generatedIds[index++] ?? "";
      })(),
      createdAt: "2026-07-22T08:31:00.000Z",
      details,
      plantIds,
      type: "fertilizing",
    });
    const [first, second] = commands;
    if (!first || !second) throw new Error("Expected two batch commands.");

    expect(() =>
      parseCareActivityBatch([
        first,
        {
          ...second,
          activity: { ...second.activity, notes: "Khác" },
        },
      ]),
    ).toThrow();
  });
});
