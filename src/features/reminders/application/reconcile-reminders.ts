import { findLatestCareActivity, listCareActivities } from "@/features/journal";
import { listCarePlans } from "@/features/knowledge";
import { listPlants, type Plant } from "@/features/plants";
import { createId } from "@/shared/lib/identifiers";
import {
  listCarePlanReminderPreferences,
  saveCarePlanReminderPreference,
} from "../data/care-plan-reminder-repository";
import {
  cancelReminderNotificationPair,
  scheduleReminderNotificationPair,
} from "../notifications/reminder-notification";
import {
  deriveDueReminder,
  type CarePlanReminderPreference,
} from "../models/care-plan-reminder-preference";
import {
  reconcileCarePlanReminders,
  type ReminderReconciliation,
} from "../models/reconcile-care-plan-reminders";

export async function reconcileAllCarePlanReminders(): Promise<void> {
  const plants = await listPlants();
  await Promise.all(
    plants.map((plant) => reconcilePlantCarePlanReminders(plant)),
  );
}

export async function reconcilePlantCarePlanReminders(
  plant: Plant,
): Promise<ReminderReconciliation> {
  const [allPreferences, activities] = await Promise.all([
    listCarePlanReminderPreferences(),
    listCareActivities(plant.id),
  ]);
  const existing = allPreferences.filter(
    (preference) => preference.plantId === plant.id,
  );
  const plans = listCarePlans({
    speciesId: plant.speciesId,
    stageId: plant.stageId,
  });
  const now = new Date();
  const result = reconcileCarePlanReminders({
    createId,
    existing,
    now: now.toISOString(),
    plant,
    plans,
  });

  for (const preference of result.preferences) {
    const previous = existing.find((item) => item.id === preference.id);
    if (previous) await cancelReminderNotificationPair(previous);
    const plan = plans.find((item) => item.id === preference.carePlanId);
    const latestActivity = findLatestCareActivity(
      activities,
      plant.id,
      preference.activityType,
    );
    const due = plan
      ? deriveDueReminder({
          evaluatedAt: now,
          latestActivityAt: latestActivity?.occurredAt ?? null,
          onMissingHistory: plan.onMissingHistory,
          preference,
        })
      : null;
    const notificationIds =
      due && preference.notificationEnabled
        ? await scheduleReminderNotificationPair({
            body: plant.name,
            dueOn: due.dueOn,
            now,
            payload: {
              activityType: preference.activityType,
              plantId: plant.id,
              reminderId: preference.id,
            },
            preference,
            title: plan?.title ?? "Chăm sóc cây",
          })
        : { followUpNotificationId: null, mainNotificationId: null };
    await saveCarePlanReminderPreference({
      ...preference,
      ...notificationIds,
    });
  }
  return result;
}

export async function updateCarePlanReminderPreference(
  preference: CarePlanReminderPreference,
): Promise<void> {
  await saveCarePlanReminderPreference(preference);
  const plants = await listPlants();
  const plant = plants.find((item) => item.id === preference.plantId);
  if (plant) await reconcilePlantCarePlanReminders(plant);
}
