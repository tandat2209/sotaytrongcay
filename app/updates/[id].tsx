import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { getPlantUpdate } from "@/features/journal";
import { PlantUpdateDetailScreen } from "@/features/journal/ui/PlantUpdateDetailScreen";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { getPlant, resolvePlantIdentity } from "@/features/plants";

export default function PlantUpdateDetailRoute() {
  const { id } = z.object({ id: z.string().uuid() }).parse(useLocalSearchParams());
  const query = useQuery({ queryKey: ["plant-update", id], queryFn: async () => {
    const update = await getPlantUpdate(id);
    return { update, plant: update ? await getPlant(update.plantId) : null };
  } });
  if (query.isPending) return <Text>Đang tải…</Text>;
  if (query.isError) return <Text>Chưa thể tải cập nhật. Hãy thử lại.</Text>;
  if (!query.data.update) return <Text>Cập nhật này không còn tồn tại.</Text>;
  const update = query.data.update;
  const plant = query.data.plant;
  const identity = plant ? resolvePlantIdentity(plant) : { speciesTitle: "Chưa xác định", stageTitle: "Chưa xác định" };
  const stageTitle = plant ? getPreviewPlantKnowledge(plant.speciesId)?.stages.find((stage) => stage.id === update.stageId)?.title ?? "Chưa xác định" : "Chưa xác định";
  return <PlantUpdateDetailScreen onBack={() => router.back()} plantName={plant?.name ?? "Cây trồng"} speciesTitle={identity.speciesTitle} stageTitle={stageTitle} update={update} />;
}
