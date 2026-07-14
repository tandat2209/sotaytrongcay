import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import { getLatestPlantPhotoUrisByPlant, listPlantUpdates } from "@/features/journal";
import { listPlants } from "@/features/plants/data/plant-repository";
import { PlantsScreen } from "@/features/plants/ui/PlantsScreen";

export default function PlantsRoute() {
  const plantsQuery = useQuery({ queryKey: ["plants"], queryFn: listPlants });
  const photosQuery = useQuery({ queryKey: ["plant-photos"], queryFn: () => listPlantUpdates() });

  if (plantsQuery.isPending) return <Text>Đang tải…</Text>;
  if (plantsQuery.isError) return <Text>Chưa thể tải cây trồng. Hãy thử lại.</Text>;

  return (
    <PlantsScreen
      onOpenPlant={(id) => router.push({ pathname: "/plants/[id]", params: { id } })}
      photoUris={photosQuery.data ? getLatestPlantPhotoUrisByPlant(photosQuery.data) : {}}
      plants={plantsQuery.data}
    />
  );
}
