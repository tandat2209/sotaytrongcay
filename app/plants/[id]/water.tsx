import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { saveCareActivity } from "@/features/journal/data/care-activity-repository";
import { WateringEntryScreen } from "@/features/journal/ui/WateringEntryScreen";
import { createId } from "@/shared/lib/identifiers";

export default function WateringRoute() {
  const { id, name = "Cây trồng" } = z.object({ id: z.string().uuid(), name: z.string().optional() }).parse(useLocalSearchParams());
  const queryClient = useQueryClient();
  return <WateringEntryScreen plantName={name} onSave={async (details) => {
    const now = new Date().toISOString();
    await saveCareActivity({ id: createId(), mutationId: createId(), plantId: id, type: "watering", occurredAt: now, origin: "manual", ...details, createdAt: now });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["plant-detail", id] }),
      queryClient.invalidateQueries({ queryKey: ["journal"] }),
    ]);
    router.back();
  }} />;
}
