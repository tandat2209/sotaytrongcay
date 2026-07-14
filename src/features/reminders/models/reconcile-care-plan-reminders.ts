import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";
import type { CarePlanReminderPreference } from "./care-plan-reminder-preference";

export type ReminderReconciliation = Readonly<{
  activated: readonly string[];
  deactivated: readonly string[];
  preferences: readonly CarePlanReminderPreference[];
}>;

export function reconcileCarePlanReminders(input: Readonly<{
  createId: () => string;
  existing: readonly CarePlanReminderPreference[];
  now: string;
  plant: Plant;
  plans: readonly CarePlan[];
}>): ReminderReconciliation {
  const applicablePlans = input.plans.filter(
    (plan) => plan.frequency?.[input.plant.growingMethod] !== undefined,
  );
  const applicableIds = new Set(applicablePlans.map((plan) => plan.id));
  const existingByPlanId = new Map(
    input.existing.map((preference) => [preference.carePlanId, preference]),
  );
  const activated: string[] = [];
  const deactivated: string[] = [];

  const active = applicablePlans.map((plan) => {
    const current = existingByPlanId.get(plan.id);
    const recommendedIntervalDays =
      plan.frequency?.[input.plant.growingMethod].intervalDays;
    if (recommendedIntervalDays === undefined) {
      throw new Error(`Care Plan ${plan.id} has no applicable frequency.`);
    }
    if (!current || !current.isApplicable) activated.push(plan.id);
    existingByPlanId.delete(plan.id);
    if (current) {
      return {
        ...current,
        carePlanVersion: plan.version,
        activityType: plan.activityType,
        recommendedIntervalDays,
        isApplicable: true,
        updatedAt: input.now,
      };
    }
    return {
      id: input.createId(),
      mutationId: input.createId(),
      plantId: input.plant.id,
      carePlanId: plan.id,
      carePlanVersion: plan.version,
      activityType: plan.activityType,
      recommendedIntervalDays,
      customIntervalDays: null,
      notificationTime: null,
      notificationEnabled: false,
      pausedAt: null,
      isApplicable: true,
      mainNotificationId: null,
      followUpNotificationId: null,
      createdAt: input.now,
      updatedAt: input.now,
    } satisfies CarePlanReminderPreference;
  });

  const inactive = input.existing
    .filter((preference) => !applicableIds.has(preference.carePlanId))
    .map((preference) => {
      if (preference.isApplicable) deactivated.push(preference.carePlanId);
      return {
        ...preference,
        isApplicable: false,
        mainNotificationId: null,
        followUpNotificationId: null,
        updatedAt: input.now,
      };
    });

  return { activated, deactivated, preferences: [...active, ...inactive] };
}
