import {
  findLatestCareActivity,
  type CareActivity,
  type CareActivityType,
} from "@/features/journal";
import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import {
  deriveDueReminder,
  getEffectiveIntervalDays,
  type CarePlanReminderPreference,
} from "./care-plan-reminder-preference";

export type CarePlanReminderItem = Readonly<{
  activityType: CareActivityType;
  carePlanId: string;
  carePlanTitle: string;
  customIntervalDays: number | null;
  dueOn: string | null;
  dueStatus: "due" | "overdue" | "upcoming" | null;
  effectiveIntervalDays: number;
  id: string;
  notificationEnabled: boolean;
  notificationTime: string | null;
  paused: boolean;
  plantId: string;
  plantName: string;
  recommendedIntervalDays: number;
}>;

export function createReminderItems(
  input: Readonly<{
    activities: readonly CareActivity[];
    evaluatedAt: Date;
    plansByPlant: ReadonlyMap<string, readonly CarePlan[]>;
    plants: readonly Plant[];
    preferences: readonly CarePlanReminderPreference[];
  }>,
): readonly CarePlanReminderItem[] {
  return input.preferences.flatMap((preference) => {
    if (!preference.isApplicable) return [];
    const plant = input.plants.find((item) => item.id === preference.plantId);
    const plan = input.plansByPlant
      .get(preference.plantId)
      ?.find((item) => item.id === preference.carePlanId);
    if (!plant || !plan) return [];
    const latestActivity = findLatestCareActivity(
      input.activities,
      plant.id,
      preference.activityType,
    );
    const due = deriveDueReminder({
      evaluatedAt: input.evaluatedAt,
      latestActivityAt: latestActivity?.occurredAt ?? null,
      onMissingHistory: plan.onMissingHistory,
      preference,
    });
    return [
      {
        activityType: preference.activityType,
        carePlanId: preference.carePlanId,
        carePlanTitle: plan.title,
        customIntervalDays: preference.customIntervalDays,
        dueOn: due?.dueOn ?? null,
        dueStatus: due?.status ?? null,
        effectiveIntervalDays: getEffectiveIntervalDays(preference),
        id: preference.id,
        notificationEnabled: preference.notificationEnabled,
        notificationTime: preference.notificationTime,
        paused: preference.pausedAt !== null,
        plantId: plant.id,
        plantName: plant.name,
        recommendedIntervalDays: preference.recommendedIntervalDays,
      },
    ];
  });
}
