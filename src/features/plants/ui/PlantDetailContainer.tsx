import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import { z } from "zod";
import type { CareActivityType, CareEntryDetails } from "@/features/journal";
import { listCareActivities } from "@/features/journal";
import { productionWeather } from "@/shared/weather/weather-state";
import { getPlant } from "../data/plant-repository";
import { createPlantDetailProjection } from "../models/plant-detail-projection";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { PlantDetailScreen } from "./PlantDetailScreen";

type Props = Readonly<{
  onBack: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlaybook: () => void;
  onRecordCare: (type: CareActivityType, details: CareEntryDetails) => Promise<void>;
  plantId: string;
}>;

export function PlantDetailContainer({ onBack, onOpenActivity, onOpenPlaybook, onRecordCare, plantId }: Props) {
  const query = useQuery({ queryKey: ["plant-detail", plantId], queryFn: async () => {
    const [plant, activities] = await Promise.all([getPlant(plantId), listCareActivities(plantId)]);
    return plant ? createPlantDetailProjection({ activities, evaluatedAt: new Date(), plant }) : null;
  } });
  if (query.isPending) return <Text>Đang tải dữ liệu trên thiết bị…</Text>;
  if (query.isError) return <><Text>{query.error instanceof z.ZodError ? "Dữ liệu trên thiết bị chưa hợp lệ." : "Chưa thể tải cây."}</Text><PrimaryButton label="Thử lại" onPress={() => void query.refetch()} /></>;
  if (!query.data) return <><Text>Không tìm thấy cây trồng.</Text><PrimaryButton label="Quay lại Cây trồng" onPress={onBack} /></>;
  return <PlantDetailScreen onBack={onBack} onOpenActivity={onOpenActivity} onOpenPlaybook={onOpenPlaybook} onRecordCare={onRecordCare} projection={query.data} weather={productionWeather} />;
}
