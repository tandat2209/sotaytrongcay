import type { CareActivity } from "@/features/journal";
import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import { evaluateCarePlans } from "./evaluate-care-recommendations";

const plant: Plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  growingMethod: "container" as const,
  location: null,
  plantedAt: null,
  stageStartedAt: null,
  createdAt: "2026-07-11T08:00:00.000Z",
};

const plan: CarePlan = {
  id: "grape.plan.check-soil-before-watering",
  title: "Kiểm tra đất trước khi tưới",
  goal: "Kiểm tra đất trước khi tưới giúp tránh tưới thừa.",
  bodyMarkdown: "",
  priority: 50,
  activityType: "watering",
  eligibility: { kind: "elapsed_days_since_activity", suggestAfterDays: 3 },
  onMissingHistory: "suggest",
  frequency: {
    ground: { display: "Mỗi 3 ngày", intervalDays: 3 },
    container: { display: "Mỗi 2 ngày", intervalDays: 2 },
  },
  version: "1.0.0",
};

function activity(occurredAt: string): CareActivity {
  return {
    id: "b775a7ec-fb44-4660-88ed-0f3b1933e7f1",
    mutationId: "c775a7ec-fb44-4660-88ed-0f3b1933e7f1",
    plantId: plant.id,
    type: "watering",
    occurredAt,
    origin: "manual",
    amount: null,
    notes: null,
    createdAt: occurredAt,
  };
}

describe("evaluateCarePlans", () => {
  const evaluatedAt = new Date("2026-07-12T10:00:00.000Z");

  it("uses the interval for the plant growing method", () => {
    const result = evaluateCarePlans({
      activities: [activity("2026-07-10T08:00:00.000Z")],
      evaluatedAt,
      plant,
      plans: [plan],
    });

    expect(result[0]).toMatchObject({
      status: "recommended",
      daysSinceLastActivity: 2,
    });
  });

  it("uses the ground interval for ground plants", () => {
    const result = evaluateCarePlans({
      activities: [activity("2026-07-10T08:00:00.000Z")],
      evaluatedAt,
      plant: { ...plant, growingMethod: "ground" },
      plans: [plan],
    });

    expect(result[0]).toMatchObject({
      status: "not_recommended",
      daysSinceLastActivity: 2,
    });
  });

  it("preserves a negative evaluation with the recent-care reason", () => {
    const result = evaluateCarePlans({
      activities: [activity("2026-07-11T08:00:00.000Z")],
      evaluatedAt,
      plant,
      plans: [plan],
    });

    expect(result[0]).toMatchObject({
      status: "not_recommended",
      daysSinceLastActivity: 1,
    });
    expect(result[0]?.explanation).toContain("cách đây 1 ngày");
  });

  it("uses the reviewed missing-history behavior", () => {
    const result = evaluateCarePlans({
      activities: [],
      evaluatedAt,
      plant,
      plans: [plan],
    });

    expect(result[0]).toMatchObject({
      status: "recommended",
      daysSinceLastActivity: null,
    });
  });

  it("returns unavailable for future activity history", () => {
    const result = evaluateCarePlans({
      activities: [activity("2026-07-13T08:00:00.000Z")],
      evaluatedAt,
      plant,
      plans: [plan],
    });

    expect(result[0]).toMatchObject({ status: "unavailable" });
  });
});
