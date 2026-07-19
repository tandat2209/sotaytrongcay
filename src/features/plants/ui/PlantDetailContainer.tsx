import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import { z } from "zod";
import type { CareActivityType, CareEntryDetails } from "@/features/journal";
import {
  getLatestPlantPhotoUri,
  listCareActivities,
  listRecentPlantUpdates,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import { useWeather } from "@/features/weather";
import { getActivePlant } from "../data/plant-repository";
import { createPlantDetailProjection } from "../models/plant-detail-projection";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { PlantDetailScreen } from "./PlantDetailScreen";

type Props = Readonly<{
  onAddJournal: () => void;
  onArchive: () => void;
  onBack: () => void;
  onEdit: () => void;
  onOpenActivity: (id: string) => void;
  onOpenPlaybook: () => void;
  onOpenUpdate: (id: string) => void;
  onRecordCare: (
    type: CareActivityType,
    details: CareEntryDetails,
  ) => Promise<void>;
  plantId: string;
}>;

export function PlantDetailContainer({
  onAddJournal,
  onArchive,
  onBack,
  onEdit,
  onOpenActivity,
  onOpenPlaybook,
  onOpenUpdate,
  onRecordCare,
  plantId,
}: Props) {
  const weather = useWeather();
  const query = useQuery({
    queryKey: ["plant-detail", plantId],
    queryFn: async () => {
      const [plant, activities, latestPhotoUri, updates] = await Promise.all([
        getActivePlant(plantId),
        listCareActivities(plantId),
        getLatestPlantPhotoUri(plantId),
        listRecentPlantUpdates(plantId, 3),
      ]);
      return plant
        ? createPlantDetailProjection({
            activities,
            evaluatedAt: new Date(),
            latestPhotoUri,
            plant,
            updates,
          })
        : null;
    },
  });
  if (query.isPending) return <LoadingScreen />;
  if (query.isError)
    return (
      <>
        <Text>
          {query.error instanceof z.ZodError
            ? t("common.state.invalidDeviceData")
            : t("plants.error.load")}
        </Text>
        <PrimaryButton
          label={t("common.actions.retry")}
          onPress={() => void query.refetch()}
        />
      </>
    );
  if (!query.data)
    return (
      <>
        <Text>{t("plants.error.notFound")}</Text>
        <PrimaryButton
          label={t("common.actions.backToPlants")}
          onPress={onBack}
        />
      </>
    );
  return (
    <PlantDetailScreen
      onAddJournal={onAddJournal}
      onArchive={onArchive}
      onBack={onBack}
      onEdit={onEdit}
      onOpenActivity={onOpenActivity}
      onOpenPlaybook={onOpenPlaybook}
      onOpenUpdate={onOpenUpdate}
      onRecordCare={onRecordCare}
      projection={query.data}
      weather={weather.weather}
      weatherUpdating={weather.isUpdating}
      onRefreshWeather={weather.refresh}
      onUseWeatherLocation={weather.updateLocation}
    />
  );
}
