import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import { listPlants } from "@/features/plants/data/plant-repository";
import { PlantsScreen } from "@/features/plants/ui/PlantsScreen";

export default function PlantsRoute() {
  const query = useQuery({ queryKey: ["plants"], queryFn: listPlants });

  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError) return <Text>Chưa thể tải cây trồng. Hãy thử lại.</Text>;

  return (
    <PlantsScreen
      onOpenPlant={(id) => router.push({ pathname: "/plants/[id]", params: { id } })}
      plants={query.data}
    />
  );
}
