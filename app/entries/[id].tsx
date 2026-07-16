import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Text } from "react-native";
import { z } from "zod";
import { t } from "@/shared/i18n";
import {
  deleteCareActivity,
  getCareActivity,
} from "@/features/journal/data/care-activity-repository";
import { listFertilizerApplications } from "@/features/journal/data/fertilizer-application-repository";
import { getLatestPlantPhotoUri } from "@/features/journal/data/plant-update-repository";
import { ActivityDetailScreen } from "@/features/journal/ui/ActivityDetailScreen";
import { resolvePlantIdentity } from "@/features/plants/models/plant-identity";
import { getPlant } from "@/features/plants/data/plant-repository";
import { getCareActivityLabel } from "@/features/journal";

export default function ActivityDetailRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  const query = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const activity = await getCareActivity(id);
      if (!activity) return { activity, imageUri: null, plant: null };
      const [fertilizerApplications, imageUri, plant] = await Promise.all([
        listFertilizerApplications(activity.id),
        getLatestPlantPhotoUri(activity.plantId),
        getPlant(activity.plantId),
      ]);
      return {
        activity,
        fertilizerApplications,
        imageUri,
        plant,
      };
    },
  });
  const queryClient = useQueryClient();
  if (query.isPending) return <Text>{t("common.state.loading")}</Text>;
  if (query.isError) return <Text>{t("journal.error.loadActivity")}</Text>;
  if (!query.data.activity)
    return <Text>{t("journal.error.activityGone")}</Text>;
  const activity = query.data.activity;
  const identity = query.data.plant
    ? resolvePlantIdentity(query.data.plant)
    : {
        speciesTitle: t("common.fallback.unknown"),
        stageTitle: t("common.fallback.unknown"),
      };
  return (
    <ActivityDetailScreen
      activity={activity}
      fertilizerApplications={query.data.fertilizerApplications}
      imageUri={query.data.imageUri}
      onBack={() => router.back()}
      onDelete={() => {
        Alert.alert(
          t("journal.activityDetail.delete"),
          t("journal.activityDetail.deleteConfirmation", {
            activity: getCareActivityLabel(activity.type).toLowerCase(),
            plant: query.data.plant?.name ?? t("common.fallback.plant"),
          }),
          [
            { style: "cancel", text: t("common.actions.cancel") },
            {
              style: "destructive",
              text: t("journal.activityDetail.delete"),
              onPress: () => {
                void deleteCareActivity(activity.id)
                  .then(async () => {
                    await Promise.all([
                      queryClient.invalidateQueries({ queryKey: ["journal"] }),
                      queryClient.invalidateQueries({
                        queryKey: ["plant-detail", activity.plantId],
                      }),
                      queryClient.invalidateQueries({ queryKey: ["today"] }),
                    ]);
                    router.back();
                  })
                  .catch(() => Alert.alert(t("journal.error.deleteActivity")));
              },
            },
          ],
        );
      }}
      onEdit={() =>
        router.push({
          pathname: "/plants/[id]/care",
          params: {
            activityId: activity.id,
            id: activity.plantId,
            origin: activity.origin,
            type: activity.type,
          },
        })
      }
      plantName={query.data.plant?.name ?? t("common.fallback.plant")}
      speciesTitle={identity.speciesTitle}
      stageId={query.data.plant?.stageId ?? ""}
      stageTitle={identity.stageTitle}
    />
  );
}
