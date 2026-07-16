import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { z } from "zod";

import {
  CareEntryScreen,
  createFertilizerApplicationRecords,
  listCareActivities,
  listPlantUpdates,
  saveCareActivityWithApplications,
} from "@/features/journal";
import { listCarePlans } from "@/features/knowledge";
import { listPlants, resolvePlantIdentity } from "@/features/plants";
import {
  listPlantScheduleSnapshots,
  listStageScheduleSnapshots,
  reconcilePlantCarePlanReminders,
} from "@/features/reminders";
import { t } from "@/shared/i18n";
import { createId } from "@/shared/lib/identifiers";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { Typography } from "@/shared/ui/Typography";
import {
  createTodayProjection,
  type TodayCareCard,
} from "../models/today-projection";
import { TodayHeader } from "./TodayHeader";
import { TodayOverview } from "./TodayOverview";

export function TodayScreen() {
  const queryClient = useQueryClient();
  const [entry, setEntry] = useState<TodayCareCard | null>(null);
  const query = useQuery({
    queryKey: ["today"],
    queryFn: async () => {
      const plants = await listPlants();
      await Promise.all(
        plants.map((plant) => reconcilePlantCarePlanReminders(plant)),
      );
      const [activities, plantSnapshots, stageSnapshots, updates] =
        await Promise.all([
          listCareActivities(),
          listPlantScheduleSnapshots(),
          listStageScheduleSnapshots(),
          listPlantUpdates(),
        ]);
      const evaluatedAt = new Date();
      return createTodayProjection({
        activities,
        evaluatedAt,
        plansByPlant: new Map(
          plants.map((plant) => [
            plant.id,
            listCarePlans({
              speciesId: plant.speciesId,
              stageId: plant.stageId,
            }),
          ]),
        ),
        plantSnapshots,
        plants,
        stageSnapshots,
        updates,
      });
    },
  });
  const plant = entry
    ? query.data?.plants.find((item) => item.id === entry.plantId)
    : null;
  const identity = plant ? resolvePlantIdentity(plant) : null;
  const errorMessage =
    query.error instanceof z.ZodError
      ? t("common.state.invalidDeviceData")
      : t("today.error.load");

  return (
    <>
      <Screen introduction={<TodayHeader />} title={t("navigation.tabs.today")}>
        {query.isPending ? (
          <Typography color="textSecondary" variant="bodyLarge">
            {t("common.state.loadingDeviceData")}
          </Typography>
        ) : null}
        {query.isError ? (
          <>
            <Typography color="textSecondary" variant="bodyLarge">
              {errorMessage}
            </Typography>
            <PrimaryButton
              label={t("common.actions.retry")}
              onPress={() => void query.refetch()}
            />
          </>
        ) : null}
        {query.data ? (
          <TodayOverview
            onAddPlant={() => router.push("/plants/new")}
            onOpenActivity={(id) => router.push(`/entries/${id}`)}
            onOpenJournal={() => router.push("/journal")}
            onOpenPlant={(id) => router.push(`/plants/${id}`)}
            onRecordCare={setEntry}
            projection={query.data}
          />
        ) : null}
      </Screen>
      {entry && plant && identity ? (
        <CareEntryScreen
          fertilizerSuggestions={entry.fertilizerSuggestions}
          reason={entry.explanation}
          {...(entry.suggestion && entry.activityType !== "fertilizing"
            ? { suggestion: entry.suggestion }
            : {})}
          onDismiss={() => setEntry(null)}
          onSave={async (details) => {
            const createdAt = new Date().toISOString();
            const activityId = createId();
            await saveCareActivityWithApplications({
              activity: {
                id: activityId,
                mutationId: createId(),
                plantId: entry.plantId,
                type: entry.activityType,
                occurredAt: details.occurredAt,
                origin: "today",
                intensity: details.intensity,
                estimatedAmountLiters: details.estimatedAmountLiters,
                notes: details.notes,
                createdAt,
              },
              applications: createFertilizerApplicationRecords(
                activityId,
                details.fertilizerApplications,
                createId,
              ),
            });
            await reconcilePlantCarePlanReminders(plant);
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: ["plant-detail", entry.plantId],
              }),
              queryClient.invalidateQueries({ queryKey: ["today"] }),
              queryClient.invalidateQueries({ queryKey: ["reminders"] }),
              queryClient.invalidateQueries({ queryKey: ["journal"] }),
            ]);
            setEntry(null);
          }}
          imageUri={entry.imageUri}
          plantName={entry.plantName}
          speciesTitle={entry.speciesTitle}
          stageId={entry.stageId}
          stageTitle={entry.stageTitle}
          type={entry.activityType}
          visible
        />
      ) : null}
    </>
  );
}
