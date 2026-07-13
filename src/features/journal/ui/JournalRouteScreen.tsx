import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import { listCareActivities } from "../data/care-activity-repository";
import { listPlantUpdates } from "../data/plant-update-repository";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { listPlants } from "@/features/plants/data/plant-repository";
import { JournalScreen } from "./JournalScreen";

export function JournalRouteScreen() {
  const query = useQuery({ queryKey: ["journal"], queryFn: async () => {
    const [activities, updates, plants] = await Promise.all([listCareActivities(), listPlantUpdates(), listPlants()]);
    return { activities, updates, plants };
  } });
  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError) return <Text>Chưa thể tải nhật ký. Hãy thử lại.</Text>;
  const plants = Object.fromEntries(query.data.plants.map((plant) => [plant.id, { ...resolvePlantIdentity(plant), name: plant.name, speciesId: plant.speciesId, stageId: plant.stageId }]));
  return <JournalScreen activities={query.data.activities} onOpenActivity={(id) => router.push(`/entries/${id}`)} onOpenUpdate={(id) => router.push(`/updates/${id}`)} plants={plants} updates={query.data.updates} />;
}
