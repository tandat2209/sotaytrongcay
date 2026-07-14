import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { getCareActivity } from "@/features/journal/data/care-activity-repository";
import { listPlantUpdates } from "@/features/journal/data/plant-update-repository";
import { getLatestPlantPhoto } from "@/features/journal/models/plant-update";
import { ActivityDetailScreen } from "@/features/journal/ui/ActivityDetailScreen";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { getPlant } from "@/features/plants/data/plant-repository";

export default function ActivityDetailRoute() {
  const { id } = z.object({ id: z.string().uuid() }).parse(useLocalSearchParams());
  const query = useQuery({ queryKey: ["activity", id], queryFn: async () => {
    const activity = await getCareActivity(id);
    if (!activity) return { activity, imageUri: null, plant: null };
    const [plant, updates] = await Promise.all([getPlant(activity.plantId), listPlantUpdates(activity.plantId)]);
    return { activity, imageUri: getLatestPlantPhoto(updates)?.localUri ?? null, plant };
  }});
  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError) return <Text>Chưa thể tải hoạt động. Hãy thử lại.</Text>;
  if (!query.data.activity) return <Text>Hoạt động này không còn tồn tại.</Text>;
  const identity = query.data.plant ? resolvePlantIdentity(query.data.plant) : { speciesTitle: "Chưa xác định", stageTitle: "Chưa xác định" };
  return <ActivityDetailScreen activity={query.data.activity} imageUri={query.data.imageUri} onBack={() => router.back()} plantName={query.data.plant?.name ?? "Cây trồng"} speciesTitle={identity.speciesTitle} stageId={query.data.plant?.stageId ?? ""} stageTitle={identity.stageTitle} />;
}
