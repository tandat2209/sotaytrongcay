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
      onSaved={() => router.back()}
      plantId={plantId}
    />
  );
}
