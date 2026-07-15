import {
  findLatestCareActivity,
  type CareActivity,
  type CareActivityType,
} from "@/features/journal";
import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import type { CareEvaluation, CareEvaluationReason } from "./care-evaluation";

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
        reason: { goal: plan.goal, kind: "authored_goal" },
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
      { kind: "missing_history" },
    );
  }

  const occurredAt = new Date(latestActivity.occurredAt);
  if (Number.isNaN(occurredAt.getTime()) || occurredAt > evaluatedAt) {
    return unavailableEvaluation(
      plant.id,
      plan.activityType,
      identity,
      plan.title,
      { kind: "invalid_history" },
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
      reason: {
        activityType: plan.activityType,
        daysSinceLastActivity,
        goal: plan.goal,
        kind: "elapsed_history",
      },
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
    reason: {
      activityType: plan.activityType,
      daysSinceLastActivity,
      kind: "recent_history",
    },
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
  reason: CareEvaluationReason,
): CareEvaluation {
  return {
    activityType,
    daysSinceLastActivity: null,
    definitionId: null,
    definitionVersion: null,
    id,
    plantId,
    reason,
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
