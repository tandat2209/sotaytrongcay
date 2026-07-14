import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { z } from "zod";

import type { CarePlanReminderPreference } from "../models/care-plan-reminder-preference";
import { deriveNotificationPair } from "../models/care-plan-reminder-preference";

export const ReminderNotificationPayloadSchema = z.object({
  reminderId: z.string().uuid(),
  plantId: z.string().uuid(),
  activityType: z.enum(["watering", "fertilizing", "spraying"]),
});

export type ReminderNotificationPayload = z.infer<
  typeof ReminderNotificationPayloadSchema
>;

export async function ensureReminderNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  return (await Notifications.requestPermissionsAsync()).granted;
}

export async function configureReminderNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("care-reminders", {
    importance: Notifications.AndroidImportance.DEFAULT,
    name: "Lời nhắc chăm sóc",
  });
}

export async function cancelReminderNotificationPair(
  preference: CarePlanReminderPreference,
): Promise<void> {
  const ids = [
    preference.mainNotificationId,
    preference.followUpNotificationId,
  ].filter((id): id is string => id !== null);
  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

export async function scheduleReminderNotificationPair(input: Readonly<{
  body: string;
  dueOn: string;
  now: Date;
  payload: ReminderNotificationPayload;
  preference: CarePlanReminderPreference;
  title: string;
}>): Promise<Readonly<{
  mainNotificationId: string | null;
  followUpNotificationId: string | null;
}>> {
  const { preference } = input;
  if (
    !preference.isApplicable ||
    preference.pausedAt !== null ||
    !preference.notificationEnabled ||
    preference.notificationTime === null
  ) {
    return { followUpNotificationId: null, mainNotificationId: null };
  }
  const pair = deriveNotificationPair(input.dueOn, preference.notificationTime);
  const schedule = async (date: Date, followUp: boolean) =>
    date > input.now
      ? await Notifications.scheduleNotificationAsync({
          content: {
            body: input.body,
            data: ReminderNotificationPayloadSchema.parse(input.payload),
            title: followUp ? `Nhắc lại: ${input.title}` : input.title,
          },
          trigger: {
            channelId: "care-reminders",
            date,
            type: Notifications.SchedulableTriggerInputTypes.DATE,
          },
        })
      : null;

  return {
    mainNotificationId: await schedule(pair.main, false),
    followUpNotificationId: await schedule(pair.followUp, true),
  };
}
