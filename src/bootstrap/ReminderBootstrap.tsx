import { useEffect } from "react";
import type { PropsWithChildren } from "react";

import {
  configureReminderNotifications,
  reconcileAllCarePlanReminders,
} from "@/features/reminders";

export function ReminderBootstrap({ children }: PropsWithChildren) {
  useEffect(() => {
    void configureReminderNotifications()
      .then(reconcileAllCarePlanReminders)
      .catch(() => console.warn("Reminder reconciliation failed."));
  }, []);
  return children;
}
