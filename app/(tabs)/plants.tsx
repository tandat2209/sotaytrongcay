import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import { listLatestPlantPhotoUris } from "@/features/journal";
import { t } from "@/shared/i18n";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { listPlants } from "@/features/plants/data/plant-repository";
import { serializeBatchCarePlantIds, PlantsScreen } from "@/features/plants";

export default function PlantsRoute() {
  const plantsQuery = useQuery({ queryKey: ["plants"], queryFn: listPlants });
  const photosQuery = useQuery({
    queryKey: ["plant-photos"],
    queryFn: listLatestPlantPhotoUris,
  });

  if (plantsQuery.isPending) return <LoadingScreen />;
  if (plantsQuery.isError) return <Text>{t("plants.error.loadList")}</Text>;

  return (
    <PlantsScreen
      onOpenPlant={(id) =>
        router.push({ pathname: "/plants/[id]", params: { id } })
      }
      onStartBatchCare={(plantIds) =>
        router.push({
          pathname: "/plants/batch-care",
          params: { plantIds: serializeBatchCarePlantIds(plantIds) },
        })
      }
      photoUris={photosQuery.data ?? {}}
      plants={plantsQuery.data}
    />
  );
}
