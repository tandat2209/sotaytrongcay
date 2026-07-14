import { router } from "expo-router";

import { ReminderListRouteScreen } from "@/features/reminders";

export default function RemindersRoute() {
  return (
    <ReminderListRouteScreen
      onBack={() => router.back()}
      onOpen={(id) => router.push(`/reminders/${id}`)}
    />
  );
}
