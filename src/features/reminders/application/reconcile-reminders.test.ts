import type { CarePlan } from "@/features/knowledge";
import { diffCarePlanApplicability } from "./reconcile-reminders";

function carePlan(id: string, title: string): CarePlan {
  return {
    id,
    title,
    goal: "",
    bodyMarkdown: "",
    priority: 1,
    activityType: "watering",
    eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: 1 },
    onMissingHistory: "suggest",
    frequency: {
      ground: { display: "Mỗi ngày", intervalDays: 1 },
      container: { display: "Mỗi ngày", intervalDays: 1 },
    },
    version: "1.0.0",
  };
}

const watering = carePlan("care-plan.watering", "Tưới nước");
const fertilizing = carePlan("care-plan.fertilizing", "Bón phân");
const spraying = carePlan("care-plan.spraying", "Phun phòng");

describe("diffCarePlanApplicability", () => {
  it("returns Care Plan titles activated and deactivated by a stage change", () => {
    expect(
      diffCarePlanApplicability(
        [watering, fertilizing],
        [fertilizing, spraying],
      ),
    ).toEqual({ activated: ["Phun phòng"], deactivated: ["Tưới nước"] });
  });

  it("reports newly applicable authored plans without plant snapshots", () => {
    expect(diffCarePlanApplicability([], [watering, fertilizing])).toEqual({
      activated: ["Tưới nước", "Bón phân"],
      deactivated: [],
    });
  });

  it("returns no changes when applicability is unchanged", () => {
    expect(diffCarePlanApplicability([watering], [watering])).toEqual({
      activated: [],
      deactivated: [],
    });
  });
});
