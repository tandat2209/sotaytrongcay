import { z } from "zod";

const NotificationTimeSchema = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

export const CarePlanReminderPreferenceSchema = z.object({
  id: z.string().uuid(),
  mutationId: z.string().uuid(),
  plantId: z.string().uuid(),
  carePlanId: z.string().min(1),
  carePlanVersion: z.string().min(1),
  activityType: z.enum(["watering", "fertilizing", "spraying"]),
  recommendedIntervalDays: z.number().int().positive(),
  customIntervalDays: z.number().int().positive().nullable(),
  notificationTime: NotificationTimeSchema.nullable(),
  notificationEnabled: z.boolean(),
  pausedAt: z.string().datetime().nullable(),
  isApplicable: z.boolean(),
  mainNotificationId: z.string().nullable(),
  followUpNotificationId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CarePlanReminderPreference = z.infer<
  typeof CarePlanReminderPreferenceSchema
>;

export type DueReminder = Readonly<{
  dueOn: string;
  status: "due" | "overdue" | "upcoming";
}>;

export function getEffectiveIntervalDays(
  preference: CarePlanReminderPreference,
): number {
  return preference.customIntervalDays ?? preference.recommendedIntervalDays;
}

export function deriveDueReminder(input: Readonly<{
  evaluatedAt: Date;
  latestActivityAt: string | null;
  onMissingHistory: "suggest" | "withhold";
  preference: CarePlanReminderPreference;
}>): DueReminder | null {
  const { evaluatedAt, latestActivityAt, onMissingHistory, preference } = input;
  if (!preference.isApplicable || preference.pausedAt !== null) return null;

  const today = localDateKey(evaluatedAt);
  if (latestActivityAt === null) {
    return onMissingHistory === "suggest" ? { dueOn: today, status: "due" } : null;
  }

  const latestActivity = new Date(latestActivityAt);
  if (Number.isNaN(latestActivity.getTime()) || latestActivity > evaluatedAt) {
    return null;
  }
  const due = new Date(
    latestActivity.getFullYear(),
    latestActivity.getMonth(),
    latestActivity.getDate() + getEffectiveIntervalDays(preference),
  );
  const dueOn = localDateKey(due);
  return {
    dueOn,
    status: dueOn < today ? "overdue" : dueOn === today ? "due" : "upcoming",
  };
}

export function deriveNotificationPair(
  dueOn: string,
  notificationTime: string,
): Readonly<{ main: Date; followUp: Date }> {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dueOn);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(notificationTime);
  if (!dateMatch || !timeMatch) throw new Error("Invalid reminder date or time.");
  const [, year, month, day] = dateMatch;
  const [, hour, minute] = timeMatch;
  const main = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  const followUp = new Date(
    Number(year),
    Number(month) - 1,
    Number(day) + 1,
    Number(hour),
    Number(minute),
  );
  return { followUp, main };
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
