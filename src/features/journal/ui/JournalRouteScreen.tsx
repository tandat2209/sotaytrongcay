import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import { listCareActivities } from "../data/care-activity-repository";
import { listPlants } from "@/features/plants/data/plant-repository";
import { JournalScreen } from "./JournalScreen";

export function JournalRouteScreen() {
  const query = useQuery({ queryKey: ["journal"], queryFn: async () => ({ activities: await listCareActivities(), plants: await listPlants() }) });
  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError) return <Text>Chưa thể tải nhật ký. Hãy thử lại.</Text>;
  const names = Object.fromEntries(query.data.plants.map((plant) => [plant.id, plant.name]));
  return <JournalScreen activities={query.data.activities} onOpenActivity={(id) => router.push(`/entries/${id}`)} plantNames={names} />;
}
