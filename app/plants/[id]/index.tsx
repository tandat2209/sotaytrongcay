import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { saveCareActivity } from "@/features/journal";
import { PlantDetailContainer } from "@/features/plants";
import { createId } from "@/shared/lib/identifiers";

export default function PlantDetailRoute() {
  const queryClient = useQueryClient();
  const { id } = z.object({ id: z.string().uuid() }).parse(useLocalSearchParams());
  return <PlantDetailContainer
    onBack={() => router.replace("/plants")}
    onOpenActivity={(activityId) => router.push(`/entries/${activityId}`)}
    onOpenPlaybook={() => router.push({ pathname: "/plants/[id]/guide", params: { id } })}
    onRecordCare={async (type, details) => {
      const createdAt = new Date().toISOString();
      await saveCareActivity({ id: createId(), mutationId: createId(), plantId: id, type, occurredAt: details.occurredAt, origin: "manual", amount: details.amount, notes: details.notes, createdAt });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["plant-detail", id] }), queryClient.invalidateQueries({ queryKey: ["today"] }), queryClient.invalidateQueries({ queryKey: ["journal"] })]);
    }}
    plantId={id}
  />;
}
