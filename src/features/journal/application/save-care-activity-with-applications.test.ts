import {
  createFertilizerApplicationRecords,
  parseCareActivityWithApplications,
} from "./save-care-activity-with-applications";

const activity = {
  id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
  plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  type: "fertilizing",
  occurredAt: "2026-07-16T08:30:00.000Z",
  origin: "manual",
  intensity: null,
  estimatedAmountLiters: null,
  notes: null,
  createdAt: "2026-07-16T08:30:00.000Z",
} as const;

const application = {
  id: "bb88afb9-82cc-4d55-9635-fd645f7f51be",
  careActivityId: activity.id,
  userFertilizerId: "5ad47724-12dc-4d89-83da-54c0ef1cb770",
  position: 0,
  nameSnapshot: "Phân trùn quế",
  groupSnapshot: "organic",
  npkSnapshot: null,
  amountValue: null,
  amountUnit: null,
  applicationMethod: null,
  notes: null,
} as const;

describe("parseCareActivityWithApplications", () => {
  it("materializes ordered records from Care Entry details", () => {
    expect(
      createFertilizerApplicationRecords(
        activity.id,
        [
          {
            userFertilizerId: application.userFertilizerId,
            nameSnapshot: application.nameSnapshot,
            groupSnapshot: application.groupSnapshot,
            npkSnapshot: null,
            amountValue: null,
            amountUnit: null,
            applicationMethod: null,
            notes: null,
          },
        ],
        () => application.id,
      ),
    ).toEqual([
      {
        ...application,
        amountValue: null,
        amountUnit: null,
        applicationMethod: null,
      },
    ]);
  });

  it("accepts ordered applications belonging to one fertilizing activity", () => {
    expect(
      parseCareActivityWithApplications({
        activity,
        applications: [application],
      }),
    ).toEqual({ activity, applications: [application] });
  });

  it("rejects applications attached to another activity", () => {
    expect(() =>
      parseCareActivityWithApplications({
        activity,
        applications: [
          {
            ...application,
            careActivityId: "7174d8e3-df23-4f13-9e06-245ebfc9877b",
          },
        ],
      }),
    ).toThrow();
  });

  it("rejects fertilizer applications for another care type", () => {
    expect(() =>
      parseCareActivityWithApplications({
        activity: { ...activity, type: "spraying" },
        applications: [application],
      }),
    ).toThrow();
  });

  it("requires contiguous application positions", () => {
    expect(() =>
      parseCareActivityWithApplications({
        activity,
        applications: [{ ...application, position: 1 }],
      }),
    ).toThrow();
  });
});
