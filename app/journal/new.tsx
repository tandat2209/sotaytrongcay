import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { PlantUpdateRouteScreen } from "@/features/journal";
import {
  getPlant,
  PlantIdentity,
  resolvePlantIdentity,
} from "@/features/plants";
import { reconcilePlantCarePlanReminders } from "@/features/reminders";

export default function NewJournalEntryRoute() {
  const { plantId } = z
    .object({ plantId: z.string().uuid() })
    .parse(useLocalSearchParams());
  return (
    <PlantUpdateRouteScreen
      getPlant={getPlant}
      onBack={() => router.back()}
      onReviewReminders={() =>
        router.replace({
          pathname: "/settings/plants/[id]",
          params: { id: plantId },
        })
      }
      onSaved={() => router.back()}
      plantIdentityComponent={PlantIdentity}
      plantId={plantId}
      reconcilePlantCarePlanReminders={reconcilePlantCarePlanReminders}
      resolvePlantIdentity={resolvePlantIdentity}
    />
  );
}
