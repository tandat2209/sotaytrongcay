import type { CareActivity } from "@/features/journal";
import type { CareRecommendation } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import { evaluateCareRecommendations } from "./evaluate-care-recommendations";

const plant: Plant = {
  id: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  name: "Nho sân thượng",
  speciesId: "plant.grape",
  stageId: "grape.stage.trunk-development",
  location: null,
  plantedAt: null,
  createdAt: "2026-07-11T08:00:00.000Z",
};

const recommendation: CareRecommendation = {
  id: "grape.recommendation.check-soil-before-watering",
  title: "Kiểm tra đất trước khi tưới",
  reason: "Kiểm tra đất trước khi tưới giúp tránh tưới thừa.",
  activityType: "watering",
  eligibility: { kind: "elapsed_days_since_activity", dueAfterDays: 3 },
  onMissingHistory: "suggest",
  version: "1.0.0",
  bodyMarkdown: "",
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

describe("evaluateCareRecommendations", () => {
  const evaluatedAt = new Date("2026-07-12T10:00:00.000Z");

  it("recommends care at the elapsed-day boundary", () => {
    const result = evaluateCareRecommendations({
      activities: [activity("2026-07-09T08:00:00.000Z")],
      evaluatedAt,
      plant,
      recommendations: [recommendation],
    });

    expect(result[0]).toMatchObject({ status: "recommended", daysSinceLastActivity: 3 });
  });

  it("preserves a negative evaluation with the recent-care reason", () => {
    const result = evaluateCareRecommendations({
      activities: [activity("2026-07-11T08:00:00.000Z")],
      evaluatedAt,
      plant,
      recommendations: [recommendation],
    });

    expect(result[0]).toMatchObject({ status: "not_recommended", daysSinceLastActivity: 1 });
    expect(result[0]?.explanation).toContain("cách đây 1 ngày");
  });

  it("uses the reviewed missing-history behavior", () => {
    const result = evaluateCareRecommendations({
      activities: [],
      evaluatedAt,
      plant,
      recommendations: [recommendation],
    });

    expect(result[0]).toMatchObject({ status: "recommended", daysSinceLastActivity: null });
  });

  it("returns unavailable for future activity history", () => {
    const result = evaluateCareRecommendations({
      activities: [activity("2026-07-13T08:00:00.000Z")],
      evaluatedAt,
      plant,
      recommendations: [recommendation],
    });

    expect(result[0]).toMatchObject({ status: "unavailable" });
  });
});
