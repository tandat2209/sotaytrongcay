import { useEffect } from "react";
import type { PropsWithChildren } from "react";

import {
  configureReminderNotificationChannel,
  reconcileAllCarePlanReminders,
} from "@/features/reminders";

export function ReminderBootstrap({ children }: PropsWithChildren) {
  useEffect(() => {
    void configureReminderNotificationChannel()
      .then(reconcileAllCarePlanReminders)
      .catch(() => console.warn("Reminder reconciliation failed."));
  }, []);
  return children;
}
