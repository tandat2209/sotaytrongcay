import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { PlantUpdateRouteScreen } from "@/features/journal";

export default function NewJournalEntryRoute() {
  const { plantId } = z
    .object({ plantId: z.string().uuid() })
    .parse(useLocalSearchParams());
  return (
    <PlantUpdateRouteScreen
      onBack={() => router.back()}
      onReviewReminders={() =>
        router.replace({
          pathname: "/settings/plants/[id]",
          params: { id: plantId },
        })
      }
      onSaved={() => router.back()}
      plantId={plantId}
    />
  );
}
