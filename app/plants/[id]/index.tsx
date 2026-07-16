import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";

import {
  createFertilizerApplicationRecords,
  saveCareActivityWithApplications,
} from "@/features/journal";
import { getPlant, PlantDetailContainer } from "@/features/plants";
import { reconcilePlantCarePlanReminders } from "@/features/reminders";
import { createId } from "@/shared/lib/identifiers";

export default function PlantDetailRoute() {
  const queryClient = useQueryClient();
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  return (
    <PlantDetailContainer
      onAddJournal={() =>
        router.push({ pathname: "/journal/new", params: { plantId: id } })
      }
      onBack={() => router.replace("/plants")}
      onOpenActivity={(activityId) => router.push(`/entries/${activityId}`)}
      onOpenPlaybook={() =>
        router.push({ pathname: "/plants/[id]/guide", params: { id } })
      }
      onOpenSchedule={() =>
        router.push({ pathname: "/settings/plants/[id]", params: { id } })
      }
      onOpenUpdate={(updateId) => router.push(`/updates/${updateId}`)}
      onRecordCare={async (type, details) => {
        const createdAt = new Date().toISOString();
        const activityId = createId();
        await saveCareActivityWithApplications({
          activity: {
            id: activityId,
            mutationId: createId(),
            plantId: id,
            type,
            occurredAt: details.occurredAt,
            origin: "manual",
            intensity: details.intensity,
            estimatedAmountLiters: details.estimatedAmountLiters,
            notes: details.notes,
            createdAt,
          },
          applications: createFertilizerApplicationRecords(
            activityId,
            details.fertilizerApplications,
            createId,
          ),
        });
        const plant = await getPlant(id);
        if (plant) await reconcilePlantCarePlanReminders(plant);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["plant-detail", id] }),
          queryClient.invalidateQueries({ queryKey: ["today"] }),
          queryClient.invalidateQueries({ queryKey: ["reminders"] }),
          queryClient.invalidateQueries({ queryKey: ["journal"] }),
        ]);
      }}
      plantId={id}
    />
  );
}
