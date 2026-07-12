import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { PlantDetailContainer } from "@/features/plants";

export default function PlantDetailRoute() {
  const { id } = z.object({ id: z.string().uuid() }).parse(useLocalSearchParams());
  return <PlantDetailContainer onBack={() => router.replace("/plants")} onOpenActivity={(activityId) => router.push(`/entries/${activityId}`)} onRecordCare={(type) => router.push({ pathname: "/plants/[id]/care", params: { id, type } })} plantId={id} />;
}
