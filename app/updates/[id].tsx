import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { getLatestPlantPhotoUri, getPlantUpdate } from "@/features/journal";
import { t } from "@/shared/i18n";
import { PlantUpdateDetailScreen } from "@/features/journal/ui/PlantUpdateDetailScreen";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { getPlant, resolvePlantIdentity } from "@/features/plants";

export default function PlantUpdateDetailRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  const query = useQuery({
    queryKey: ["plant-update", id],
    queryFn: async () => {
      const update = await getPlantUpdate(id);
      if (!update) return { imageUri: null, plant: null, update };
      const [imageUri, plant] = await Promise.all([
        getLatestPlantPhotoUri(update.plantId),
        getPlant(update.plantId),
      ]);
      return {
        imageUri,
        plant,
        update,
      };
    },
  });
  if (query.isPending) return <Text>{t("common.state.loading")}</Text>;
  if (query.isError) return <Text>{t("journal.error.loadUpdate")}</Text>;
  if (!query.data.update) return <Text>{t("journal.error.updateGone")}</Text>;
  const update = query.data.update;
  const plant = query.data.plant;
  const identity = plant
    ? resolvePlantIdentity(plant)
    : {
        speciesTitle: t("common.fallback.unknown"),
        stageTitle: t("common.fallback.unknown"),
      };
  const stageTitle = plant
    ? (getPreviewPlantKnowledge(plant.speciesId)?.stages.find(
        (stage) => stage.id === update.stageId,
      )?.title ?? t("common.fallback.unknown"))
    : t("common.fallback.unknown");
  return (
    <PlantUpdateDetailScreen
      imageUri={query.data.imageUri}
      onBack={() => router.back()}
      plantName={plant?.name ?? t("common.fallback.plant")}
      speciesTitle={identity.speciesTitle}
      stageTitle={stageTitle}
      update={update}
    />
  );
}
