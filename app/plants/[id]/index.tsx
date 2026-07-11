import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { listCareActivities } from "@/features/journal/data/care-activity-repository";
import { getPlant } from "@/features/plants/data/plant-repository";
import { PlantDetailScreen } from "@/features/plants/ui/PlantDetailScreen";

export default function PlantDetailRoute() {
  const { id } = z.object({ id: z.string().uuid() }).parse(useLocalSearchParams());
  const query = useQuery({ queryKey: ["plant-detail", id], queryFn: async () => ({ plant: await getPlant(id), activities: await listCareActivities(id) }) });
  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError) return <Text>Chưa thể tải cây. Hãy thử lại.</Text>;
  if (!query.data.plant) return <Text>Không tìm thấy cây trồng.</Text>;
  return <PlantDetailScreen activities={query.data.activities} onBack={() => router.replace("/plants")} onOpenActivity={(activityId) => router.push(`/entries/${activityId}`)} onWater={() => router.push(`/plants/${id}/water`)} plant={query.data.plant} />;
}
