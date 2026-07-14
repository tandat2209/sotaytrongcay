import { z } from "zod";

import type { CarePlan } from "@/features/knowledge";
import type { Plant } from "@/features/plants";

const NotificationTimeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

const SnapshotFieldsSchema = z.object({
  notificationEnabled: z.boolean(),
  notificationTime: NotificationTimeSchema.nullable(),
});

export const StageCarePlanScheduleSnapshotSchema = SnapshotFieldsSchema.extend({
  id: z.string().uuid(),
  mutationId: z.string().uuid(),
  stageId: z.string().min(1),
  carePlanId: z.string().min(1),
  groundFrequencyOverrideDays: z.number().int().positive().nullable(),
  containerFrequencyOverrideDays: z.number().int().positive().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PlantCarePlanScheduleSnapshotSchema = SnapshotFieldsSchema.extend({
  id: z.string().uuid(),
  mutationId: z.string().uuid(),
  plantId: z.string().uuid(),
  carePlanId: z.string().min(1),
  intervalDays: z.number().int().positive(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type StageCarePlanScheduleSnapshot = z.infer<
  typeof StageCarePlanScheduleSnapshotSchema
>;
export type PlantCarePlanScheduleSnapshot = z.infer<
  typeof PlantCarePlanScheduleSnapshotSchema
>;

export type ResolvedCarePlanSchedule = Readonly<{
  dueOn: string;
  intervalDays: number;
  notificationEnabled: boolean;
  notificationTime: string | null;
  source: "care-plan" | "plant" | "stage";
  status: "due" | "overdue" | "upcoming";
}>;

export function resolveCarePlanSchedule(
  input: Readonly<{
    evaluatedAt: Date;
    latestActivityAt: string | null;
    plan: CarePlan;
    plant: Plant;
    plantSnapshot: PlantCarePlanScheduleSnapshot | null;
    stageSnapshot: StageCarePlanScheduleSnapshot | null;
  }>,
): ResolvedCarePlanSchedule | null {
  const authoredIntervalDays =
    input.plan.frequency?.[input.plant.growingMethod]?.intervalDays;
  if (authoredIntervalDays === undefined) return null;
  const stageIntervalDays = input.stageSnapshot
    ? input.plant.growingMethod === "ground"
      ? input.stageSnapshot.groundFrequencyOverrideDays
      : input.stageSnapshot.containerFrequencyOverrideDays
    : null;
  const source = input.plantSnapshot
    ? "plant"
    : input.stageSnapshot
      ? "stage"
      : "care-plan";
  const intervalDays =
    input.plantSnapshot?.intervalDays ??
    stageIntervalDays ??
    authoredIntervalDays;
  const notificationEnabled =
    input.plantSnapshot?.notificationEnabled ??
    input.stageSnapshot?.notificationEnabled ??
    false;
  const notificationTime =
    input.plantSnapshot?.notificationTime ??
    input.stageSnapshot?.notificationTime ??
    null;
  const today = localDateKey(input.evaluatedAt);

  if (input.latestActivityAt === null) {
    if (input.plan.onMissingHistory === "withhold") return null;
    return {
      dueOn: today,
      intervalDays,
      notificationEnabled,
      notificationTime,
      source,
      status: "due",
    };
  }
  const latest = new Date(input.latestActivityAt);
  if (Number.isNaN(latest.getTime()) || latest > input.evaluatedAt) return null;
  const due = new Date(
    latest.getFullYear(),
    latest.getMonth(),
    latest.getDate() + intervalDays,
  );
  const dueOn = localDateKey(due);
  return {
    dueOn,
    intervalDays,
    notificationEnabled,
    notificationTime,
    source,
    status: dueOn < today ? "overdue" : dueOn === today ? "due" : "upcoming",
  };
}

export function deriveNotificationPair(
  dueOn: string,
  notificationTime: string,
): Readonly<{ main: Date; followUp: Date }> {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dueOn);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(notificationTime);
  if (!dateMatch || !timeMatch)
    throw new Error("Invalid reminder date or time.");
  const [, year, month, day] = dateMatch;
  const [, hour, minute] = timeMatch;
  const main = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  return {
    main,
    followUp: new Date(
      Number(year),
      Number(month) - 1,
      Number(day) + 1,
      Number(hour),
      Number(minute),
    ),
  };
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
