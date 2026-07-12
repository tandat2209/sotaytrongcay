import type { CareActivity, CareActivityType } from "@/features/journal";
import type { CareRecommendation } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import type { CareEvaluation } from "./care-evaluation";

type EvaluationInput = Readonly<{
  activities: readonly CareActivity[];
  evaluatedAt: Date;
  plant: Plant;
  recommendations: readonly CareRecommendation[];
}>;

export function evaluateCareRecommendations({
  activities,
  evaluatedAt,
  plant,
  recommendations,
}: EvaluationInput): readonly CareEvaluation[] {
  return recommendations.map((recommendation) =>
    evaluateCareRecommendation({ activities, evaluatedAt, plant, recommendation }),
  );
}

function evaluateCareRecommendation(input: Readonly<{
  activities: readonly CareActivity[];
  evaluatedAt: Date;
  plant: Plant;
  recommendation: CareRecommendation;
}>): CareEvaluation {
  const { activities, evaluatedAt, plant, recommendation } = input;
  const latestActivity = latestActivityForType(activities, plant.id, recommendation.activityType);
  const identity = `${plant.id}:${localDateKey(evaluatedAt)}:${recommendation.id}:${recommendation.version}`;

  if (latestActivity === null) {
    if (recommendation.onMissingHistory === "suggest") {
      return {
        activityType: recommendation.activityType,
        daysSinceLastActivity: null,
        definitionId: recommendation.id,
        definitionVersion: recommendation.version,
        explanation: recommendation.goal,
        id: identity,
        plantId: plant.id,
        status: "recommended",
        title: recommendation.title,
      };
    }

    return unavailableEvaluation(plant.id, recommendation.activityType, identity, recommendation.title, "Chưa có đủ lịch sử chăm sóc để đưa ra gợi ý.");
  }

  const occurredAt = new Date(latestActivity.occurredAt);
  if (Number.isNaN(occurredAt.getTime()) || occurredAt > evaluatedAt) {
    return unavailableEvaluation(plant.id, recommendation.activityType, identity, recommendation.title, "Dữ liệu lịch sử chăm sóc chưa hợp lệ.");
  }

  const daysSinceLastActivity = localCalendarDayDifference(occurredAt, evaluatedAt);
  if (daysSinceLastActivity >= recommendation.eligibility.suggestAfterDays) {
    return {
      activityType: recommendation.activityType,
      daysSinceLastActivity,
      definitionId: recommendation.id,
      definitionVersion: recommendation.version,
      explanation: `${recommendation.goal} Lần ghi gần nhất cách đây ${daysSinceLastActivity} ngày.`,
      id: identity,
      plantId: plant.id,
      status: "recommended",
      title: recommendation.title,
    };
  }

  return {
    activityType: recommendation.activityType,
    daysSinceLastActivity,
    definitionId: recommendation.id,
    definitionVersion: recommendation.version,
    explanation: `Chưa cần ${activityLabel(recommendation.activityType).toLowerCase()} — lần ghi gần nhất cách đây ${daysSinceLastActivity} ngày.`,
    id: identity,
    plantId: plant.id,
    status: "not_recommended",
    title: recommendation.title,
  };
}

function unavailableEvaluation(
  plantId: string,
  activityType: CareActivityType,
  id: string,
  title: string,
  explanation: string,
): CareEvaluation {
  return {
    activityType,
    daysSinceLastActivity: null,
    definitionId: null,
    definitionVersion: null,
    explanation,
    id,
    plantId,
    status: "unavailable",
    title,
  };
}

function latestActivityForType(
  activities: readonly CareActivity[],
  plantId: string,
  activityType: CareActivityType,
): CareActivity | null {
  return activities
    .filter((activity) => activity.plantId === plantId && activity.type === activityType)
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))[0] ?? null;
}

function localCalendarDayDifference(start: Date, end: Date): number {
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return Math.round((endDay - startDay) / 86_400_000);
}

function localDateKey(date: Date): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function activityLabel(type: CareActivityType): string {
  return {
    fertilizing: "Bón phân",
    spraying: "Phun thuốc",
    watering: "Tưới nước",
  }[type];
}
