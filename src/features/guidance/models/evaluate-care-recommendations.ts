import {
  findLatestCareActivity,
  type CareActivity,
  type CareActivityType,
} from "@/features/journal";
import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import type { CareEvaluation } from "./care-evaluation";

type EvaluationInput = Readonly<{
  activities: readonly CareActivity[];
  evaluatedAt: Date;
  plant: Plant;
  plans: readonly CarePlan[];
}>;

export function evaluateCarePlans({
  activities,
  evaluatedAt,
  plant,
  plans,
}: EvaluationInput): readonly CareEvaluation[] {
  return plans.map((plan) =>
    evaluateCarePlan({ activities, evaluatedAt, plant, plan }),
  );
}

function evaluateCarePlan(
  input: Readonly<{
    activities: readonly CareActivity[];
    evaluatedAt: Date;
    plant: Plant;
    plan: CarePlan;
  }>,
): CareEvaluation {
  const { activities, evaluatedAt, plant, plan } = input;
  const latestActivity = findLatestCareActivity(
    activities,
    plant.id,
    plan.activityType,
  );
  const identity = `${plant.id}:${localDateKey(evaluatedAt)}:${plan.id}:${plan.version}`;

  if (latestActivity === null) {
    if (plan.onMissingHistory === "suggest") {
      return {
        activityType: plan.activityType,
        daysSinceLastActivity: null,
        definitionId: plan.id,
        definitionVersion: plan.version,
        explanation: plan.goal,
        id: identity,
        plantId: plant.id,
        status: "recommended",
        title: plan.title,
      };
    }

    return unavailableEvaluation(
      plant.id,
      plan.activityType,
      identity,
      plan.title,
      "Chưa có đủ lịch sử chăm sóc để đưa ra gợi ý.",
    );
  }

  const occurredAt = new Date(latestActivity.occurredAt);
  if (Number.isNaN(occurredAt.getTime()) || occurredAt > evaluatedAt) {
    return unavailableEvaluation(
      plant.id,
      plan.activityType,
      identity,
      plan.title,
      "Dữ liệu lịch sử chăm sóc chưa hợp lệ.",
    );
  }

  const daysSinceLastActivity = localCalendarDayDifference(
    occurredAt,
    evaluatedAt,
  );
  const thresholdDays =
    plan.frequency?.[plant.growingMethod]?.intervalDays ??
    plan.eligibility.suggestAfterDays;
  if (daysSinceLastActivity >= thresholdDays) {
    return {
      activityType: plan.activityType,
      daysSinceLastActivity,
      definitionId: plan.id,
      definitionVersion: plan.version,
      explanation: `${plan.goal} Lần ghi gần nhất cách đây ${daysSinceLastActivity} ngày.`,
      id: identity,
      plantId: plant.id,
      status: "recommended",
      title: plan.title,
    };
  }

  return {
    activityType: plan.activityType,
    daysSinceLastActivity,
    definitionId: plan.id,
    definitionVersion: plan.version,
    explanation: `Chưa cần ${activityLabel(plan.activityType).toLowerCase()} — lần ghi gần nhất cách đây ${daysSinceLastActivity} ngày.`,
    id: identity,
    plantId: plant.id,
    status: "not_recommended",
    title: plan.title,
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

function localCalendarDayDifference(start: Date, end: Date): number {
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  ).getTime();
  const endDay = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
  ).getTime();
  return Math.round((endDay - startDay) / 86_400_000);
}

function localDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function activityLabel(type: CareActivityType): string {
  return {
    fertilizing: "Bón phân",
    spraying: "Phun thuốc",
    watering: "Tưới nước",
  }[type];
}
