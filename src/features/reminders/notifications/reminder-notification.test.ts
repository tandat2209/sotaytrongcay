import * as Notifications from "expo-notifications";

import { configureReminderNotifications } from "./reminder-notification";

jest.mock("expo-notifications", () => ({
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: "date" },
  cancelScheduledNotificationAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

describe("configureReminderNotifications", () => {
  it("presents a notification received while the app is open", async () => {
    await configureReminderNotifications();

    expect(Notifications.setNotificationHandler).toHaveBeenCalledTimes(1);
  });
});
