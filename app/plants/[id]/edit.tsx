import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import {
  EditPlantScreen,
  getActivePlant,
  updatePlantProfile,
} from "@/features/plants";
import { reconcilePlantCarePlanReminders } from "@/features/reminders";
import { t } from "@/shared/i18n";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";

export default function EditPlantRoute() {
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["plant", id],
    queryFn: () => getActivePlant(id),
  });

  if (query.isPending) return <LoadingScreen />;
  if (query.isError) return <Text>{t("plants.error.load")}</Text>;
  if (!query.data) return <Text>{t("plants.error.notFound")}</Text>;
  const plant = query.data;

  return (
    <EditPlantScreen
      onBack={() => router.back()}
      onSave={async (fields) => {
        await updatePlantProfile(id, fields);
        const updatedPlant = { ...plant, ...fields };
        await reconcilePlantCarePlanReminders(updatedPlant, plant);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["plant", id] }),
          queryClient.invalidateQueries({ queryKey: ["plant-detail", id] }),
          queryClient.invalidateQueries({ queryKey: ["plants"] }),
          queryClient.invalidateQueries({ queryKey: ["plant-photos"] }),
          queryClient.invalidateQueries({ queryKey: ["today"] }),
          queryClient.invalidateQueries({ queryKey: ["journal"] }),
          queryClient.invalidateQueries({ queryKey: ["reminders"] }),
        ]);
        router.back();
      }}
      plant={plant}
    />
  );
}
