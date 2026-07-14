import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";

import { ReminderDetailRouteScreen } from "@/features/reminders";

export default function ReminderDetailRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  return <ReminderDetailRouteScreen id={id} onBack={() => router.back()} />;
}
