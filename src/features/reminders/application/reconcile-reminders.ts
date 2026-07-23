import { findLatestCareActivity, listCareActivities } from "@/features/journal";
import { listCarePlans, type CarePlan } from "@/features/knowledge";
import { listPlants, type Plant } from "@/features/plants";
import { createId } from "@/shared/lib/identifiers";
import {
  getNotificationState,
  listNotificationStates,
  listPlantScheduleSnapshots,
  listStageScheduleSnapshots,
  saveNotificationState,
  savePlantScheduleSnapshot,
} from "../data/schedule-snapshot-repository";
import {
  cancelReminderNotificationPair,
  scheduleReminderNotificationPair,
} from "../notifications/reminder-notification";
import {
  resolveCarePlanSchedule,
  type PlantCarePlanScheduleSnapshot,
  type StageCarePlanScheduleSnapshot,
} from "../models/schedule-snapshot";

export type ScheduleReconciliation = Readonly<{
  activated: readonly string[];
  deactivated: readonly string[];
}>;

export async function reconcileAllCarePlanReminders(): Promise<void> {
  const plants = await listPlants();
  await Promise.all(
    plants.map((plant) => reconcilePlantCarePlanReminders(plant)),
  );
}

export async function cancelPlantCarePlanReminders(
  plantId: string,
): Promise<void> {
  const states = await listNotificationStates(plantId);
  const updatedAt = new Date().toISOString();
  for (const state of states) {
    await cancelReminderNotificationPair(state);
    await saveNotificationState({
      ...state,
      followUpNotificationId: null,
      mainNotificationId: null,
      updatedAt,
    });
  }
}

export async function reconcilePlantsForStage(stageId: string): Promise<void> {
  const plants = await listPlants();
  await Promise.all(
    plants
      .filter((plant) => plant.stageId === stageId)
      .map((plant) => reconcilePlantCarePlanReminders(plant)),
  );
}

export async function reconcilePlantCarePlanReminders(
  plant: Plant,
  previousPlant?: Plant,
): Promise<ScheduleReconciliation> {
  const [activities, allPlantSnapshots, stageSnapshots] = await Promise.all([
    listCareActivities(plant.id),
    listPlantScheduleSnapshots(plant.id),
    listStageScheduleSnapshots(),
  ]);
  const plans = listApplicableCarePlans(plant);
  const previousPlans = previousPlant
    ? listApplicableCarePlans(previousPlant)
    : plans;
  const changes = diffCarePlanApplicability(previousPlans, plans);
  const currentPlanIds = new Set(plans.map((plan) => plan.id));
  const departedPlanIds = new Set([
    ...previousPlans
      .filter((plan) => !currentPlanIds.has(plan.id))
      .map((plan) => plan.id),
    ...allPlantSnapshots
      .filter(
        (snapshot) =>
          snapshot.isActive && !currentPlanIds.has(snapshot.carePlanId),
      )
      .map((snapshot) => snapshot.carePlanId),
  ]);
  const now = new Date();

  for (const snapshot of allPlantSnapshots) {
    const shouldBeActive = currentPlanIds.has(snapshot.carePlanId);
    if (snapshot.isActive === shouldBeActive) continue;
    await savePlantScheduleSnapshot({
      ...snapshot,
      isActive: shouldBeActive,
      updatedAt: now.toISOString(),
    });
  }

  for (const carePlanId of departedPlanIds) {
    const previous = await getNotificationState(plant.id, carePlanId);
    if (previous) await cancelReminderNotificationPair(previous);
    await saveNotificationState({
      plantId: plant.id,
      carePlanId,
      mainNotificationId: null,
      followUpNotificationId: null,
      updatedAt: now.toISOString(),
    });
  }

  for (const plan of plans) {
    const existingSnapshot = allPlantSnapshots.find(
      (item) => item.carePlanId === plan.id,
    );
    const plantSnapshot = existingSnapshot
      ? { ...existingSnapshot, isActive: true }
      : null;
    const schedule = resolveCarePlanSchedule({
      evaluatedAt: now,
      latestActivityAt:
        findLatestCareActivity(activities, plant.id, plan.activityType)
          ?.occurredAt ?? null,
      plan,
      plant,
      plantSnapshot: plantSnapshot ?? null,
      stageSnapshot: findStageSnapshot(stageSnapshots, plant, plan.id),
    });
    const previous = await getNotificationState(plant.id, plan.id);
    if (previous) await cancelReminderNotificationPair(previous);
    const notificationIds = schedule
      ? await scheduleReminderNotificationPair({
          body: plant.name,
          dueOn: schedule.dueOn,
          notificationEnabled: schedule.notificationEnabled,
          notificationTime: schedule.notificationTime,
          now,
          payload: {
            activityType: plan.activityType,
            plantId: plant.id,
            reminderId: plantSnapshot?.id ?? plant.id,
          },
          title: plan.title,
        })
      : { followUpNotificationId: null, mainNotificationId: null };
    await saveNotificationState({
      carePlanId: plan.id,
      plantId: plant.id,
      updatedAt: now.toISOString(),
      ...notificationIds,
    });
  }
  return changes;
}

export function diffCarePlanApplicability(
  previousPlans: readonly CarePlan[],
  currentPlans: readonly CarePlan[],
): ScheduleReconciliation {
  const previousPlanIds = new Set(previousPlans.map((plan) => plan.id));
  const currentPlanIds = new Set(currentPlans.map((plan) => plan.id));
  return {
    activated: currentPlans
      .filter((plan) => !previousPlanIds.has(plan.id))
      .map((plan) => plan.title),
    deactivated: previousPlans
      .filter((plan) => !currentPlanIds.has(plan.id))
      .map((plan) => plan.title),
  };
}

function listApplicableCarePlans(plant: Plant): readonly CarePlan[] {
  return listCarePlans({
    speciesId: plant.speciesId,
    stageId: plant.stageId,
  }).filter((plan) => plan.frequency?.[plant.growingMethod] !== undefined);
}

export function findStageSnapshot(
  snapshots: readonly StageCarePlanScheduleSnapshot[],
  plant: Plant,
  carePlanId: string,
): StageCarePlanScheduleSnapshot | null {
  return (
    snapshots.find(
      (snapshot) =>
        snapshot.stageId === plant.stageId &&
        snapshot.carePlanId === carePlanId,
    ) ?? null
  );
}

export function createPlantScheduleSnapshot(
  input: Readonly<{
    carePlanId: string;
    resolved: NonNullable<ReturnType<typeof resolveCarePlanSchedule>>;
    plantId: string;
    now: string;
  }>,
): PlantCarePlanScheduleSnapshot {
  return {
    id: createId(),
    mutationId: createId(),
    plantId: input.plantId,
    carePlanId: input.carePlanId,
    intervalDays: input.resolved.intervalDays,
    notificationEnabled: input.resolved.notificationEnabled,
    notificationTime: input.resolved.notificationTime,
    isActive: true,
    createdAt: input.now,
    updatedAt: input.now,
  };
}
