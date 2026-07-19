import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";
import { z } from "zod";

import {
  createFertilizerApplicationRecords,
  saveCareActivityWithApplications,
} from "@/features/journal";
import {
  archivePlant,
  getActivePlant,
  PlantDetailContainer,
} from "@/features/plants";
import {
  cancelPlantCarePlanReminders,
  reconcilePlantCarePlanReminders,
} from "@/features/reminders";
import { t } from "@/shared/i18n";
import { createId } from "@/shared/lib/identifiers";

export default function PlantDetailRoute() {
  const queryClient = useQueryClient();
  const { id } = z
    .object({ id: z.string().uuid() })
    .parse(useLocalSearchParams());
  return (
    <PlantDetailContainer
      onAddJournal={() =>
        router.push({ pathname: "/journal/new", params: { plantId: id } })
      }
      onArchive={() => {
        Alert.alert(t("plants.archive.title"), t("plants.archive.body"), [
          { style: "cancel", text: t("common.actions.cancel") },
          {
            style: "destructive",
            text: t("plants.archive.confirm"),
            onPress: () => {
              void cancelPlantCarePlanReminders(id)
                .then(() => archivePlant(id, new Date().toISOString()))
                .then(async () => {
                  await Promise.all([
                    queryClient.invalidateQueries({
                      queryKey: ["plant", id],
                    }),
                    queryClient.invalidateQueries({
                      queryKey: ["plant-detail", id],
                    }),
                    queryClient.invalidateQueries({
                      queryKey: ["plant-schedules", id],
                    }),
                    queryClient.invalidateQueries({ queryKey: ["plants"] }),
                    queryClient.invalidateQueries({ queryKey: ["today"] }),
                    queryClient.invalidateQueries({ queryKey: ["reminders"] }),
                  ]);
                  router.replace("/plants");
                })
                .catch(() => Alert.alert(t("plants.error.archive")));
            },
          },
        ]);
      }}
      onBack={() => router.replace("/plants")}
      onEdit={() =>
        router.push({ pathname: "/plants/[id]/edit", params: { id } })
      }
      onOpenActivity={(activityId) => router.push(`/entries/${activityId}`)}
      onOpenPlaybook={() =>
        router.push({ pathname: "/plants/[id]/guide", params: { id } })
      }
      onOpenUpdate={(updateId) => router.push(`/updates/${updateId}`)}
      onRecordCare={async (type, details) => {
        const createdAt = new Date().toISOString();
        const activityId = createId();
        await saveCareActivityWithApplications({
          activity: {
            id: activityId,
            mutationId: createId(),
            plantId: id,
            type,
            occurredAt: details.occurredAt,
            origin: "manual",
            intensity: details.intensity,
            estimatedAmountLiters: details.estimatedAmountLiters,
            sprayTargetId: details.sprayTargetId,
            sprayTargetNameSnapshot: details.sprayTargetNameSnapshot,
            notes: details.notes,
            createdAt,
          },
          applications: createFertilizerApplicationRecords(
            activityId,
            details.fertilizerApplications,
            createId,
          ),
        });
        const plant = await getActivePlant(id);
        if (plant) await reconcilePlantCarePlanReminders(plant);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["plant-detail", id] }),
          queryClient.invalidateQueries({ queryKey: ["today"] }),
          queryClient.invalidateQueries({ queryKey: ["reminders"] }),
          queryClient.invalidateQueries({ queryKey: ["journal"] }),
        ]);
      }}
      plantId={id}
    />
  );
}
