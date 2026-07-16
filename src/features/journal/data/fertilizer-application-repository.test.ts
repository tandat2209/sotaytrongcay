import {
  fertilizerApplicationFromRow,
  fertilizerApplicationToParams,
} from "./fertilizer-application-repository";

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

describe("fertilizer application repository mapping", () => {
  it("stores catalog identity and immutable display snapshot", () => {
    expect(fertilizerApplicationToParams(application)).toEqual([
      application.id,
      application.careActivityId,
      application.userFertilizerId,
      0,
      application.nameSnapshot,
      "organic",
      null,
      2,
      "handful",
      "topdress",
      null,
    ]);
  });

  it("maps a row back to the application", () => {
    expect(
      fertilizerApplicationFromRow({
        id: application.id,
        care_activity_id: application.careActivityId,
        user_fertilizer_id: application.userFertilizerId,
        position: 0,
        name_snapshot: application.nameSnapshot,
        group_snapshot: "organic",
        npk_snapshot: null,
        amount_value: 2,
        amount_unit: "handful",
        application_method: "topdress",
        notes: null,
      }),
    ).toEqual(application);
  });
});
