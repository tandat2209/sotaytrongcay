import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text } from "react-native";
import { t } from "@/shared/i18n";
import { listCareActivities } from "../data/care-activity-repository";
import { listPlantUpdates } from "../data/plant-update-repository";
import { listFertilizerApplications } from "../data/fertilizer-application-repository";
import { getLatestPlantPhotoUrisByPlant } from "../models/plant-update";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { listPlants } from "@/features/plants/data/plant-repository";
import { JournalScreen } from "./JournalScreen";

export function JournalRouteScreen() {
  const query = useQuery({
    queryKey: ["journal"],
    queryFn: async () => {
      const [activities, fertilizerApplications, updates, plants] =
        await Promise.all([
          listCareActivities(),
          listFertilizerApplications(),
          listPlantUpdates(),
          listPlants(),
        ]);
      return { activities, fertilizerApplications, updates, plants };
    },
  });
  if (query.isPending) return <Text>{t("common.state.loading")}</Text>;
  if (query.isError) return <Text>{t("journal.error.loadJournal")}</Text>;
  const photoUris = getLatestPlantPhotoUrisByPlant(query.data.updates);
  const plants = Object.fromEntries(
    query.data.plants.map((plant) => [
      plant.id,
      {
        ...resolvePlantIdentity(plant),
        imageUri: photoUris[plant.id] ?? null,
        name: plant.name,
        speciesId: plant.speciesId,
        stageId: plant.stageId,
      },
    ]),
  );
  const fertilizerNamesByActivity = query.data.fertilizerApplications.reduce<
    Record<string, string[]>
  >(
    (namesByActivity, application) => ({
      ...namesByActivity,
      [application.careActivityId]: [
        ...(namesByActivity[application.careActivityId] ?? []),
        application.nameSnapshot,
      ],
    }),
    {},
  );
  return (
    <JournalScreen
      activities={query.data.activities}
      fertilizerNamesByActivity={fertilizerNamesByActivity}
      onOpenActivity={(id) => router.push(`/entries/${id}`)}
      onOpenUpdate={(id) => router.push(`/updates/${id}`)}
      plants={plants}
      updates={query.data.updates}
    />
  );
}
