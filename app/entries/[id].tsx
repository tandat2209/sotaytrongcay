import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import { t } from "@/shared/i18n";
import { getCareActivity } from "@/features/journal/data/care-activity-repository";
import { listPlantUpdates } from "@/features/journal/data/plant-update-repository";
import { getLatestPlantPhoto } from "@/features/journal/models/plant-update";
import { ActivityDetailScreen } from "@/features/journal/ui/ActivityDetailScreen";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { getPlant } from "@/features/plants/data/plant-repository";

export default function ActivityDetailRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  const query = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const activity = await getCareActivity(id);
      if (!activity) return { activity, imageUri: null, plant: null };
      const [plant, updates] = await Promise.all([
        getPlant(activity.plantId),
        listPlantUpdates(activity.plantId),
      ]);
      return {
        activity,
        imageUri: getLatestPlantPhoto(updates)?.localUri ?? null,
        plant,
      };
    },
  });
  if (query.isPending) return <Text>{t("common.state.loading")}</Text>;
  if (query.isError) return <Text>{t("journal.error.loadActivity")}</Text>;
  if (!query.data.activity)
    return <Text>{t("journal.error.activityGone")}</Text>;
  const identity = query.data.plant
    ? resolvePlantIdentity(query.data.plant)
    : {
        speciesTitle: t("common.fallback.unknown"),
        stageTitle: t("common.fallback.unknown"),
      };
  return (
    <ActivityDetailScreen
      activity={query.data.activity}
      imageUri={query.data.imageUri}
      onBack={() => router.back()}
      plantName={query.data.plant?.name ?? t("common.fallback.plant")}
      speciesTitle={identity.speciesTitle}
      stageId={query.data.plant?.stageId ?? ""}
      stageTitle={identity.stageTitle}
    />
  );
}
