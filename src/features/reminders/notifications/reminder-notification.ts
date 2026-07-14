import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { z } from "zod";

import { deriveNotificationPair } from "../models/schedule-snapshot";

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
  input: Readonly<{
    followUpNotificationId: string | null;
    mainNotificationId: string | null;
  }>,
): Promise<void> {
  await Promise.all(
    [input.mainNotificationId, input.followUpNotificationId]
      .filter((id): id is string => id !== null)
      .map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

export async function scheduleReminderNotificationPair(
  input: Readonly<{
    body: string;
    dueOn: string;
    notificationEnabled: boolean;
    notificationTime: string | null;
    now: Date;
    payload: ReminderNotificationPayload;
    title: string;
  }>,
): Promise<
  Readonly<{
    mainNotificationId: string | null;
    followUpNotificationId: string | null;
  }>
> {
  if (!input.notificationEnabled || input.notificationTime === null) {
    return { followUpNotificationId: null, mainNotificationId: null };
  }
  const pair = deriveNotificationPair(input.dueOn, input.notificationTime);
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
