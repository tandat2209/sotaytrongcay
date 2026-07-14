import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { z } from "zod";

import {
  CareEntryScreen,
  listCareActivities,
  listPlantUpdates,
  saveCareActivity,
} from "@/features/journal";
import { listCarePlans } from "@/features/knowledge";
import { listPlants, resolvePlantIdentity } from "@/features/plants";
import {
  listPlantScheduleSnapshots,
  listStageScheduleSnapshots,
  reconcilePlantCarePlanReminders,
} from "@/features/reminders";
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
      await Promise.all(plants.map(reconcilePlantCarePlanReminders));
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
      ? "Dữ liệu trên thiết bị chưa hợp lệ."
      : "Chưa thể tải trang Hôm nay.";

  return (
    <>
      <Screen introduction={<TodayHeader />} title="Hôm nay">
        {query.isPending ? (
          <Typography color="textSecondary" variant="bodyLarge">
            Đang tải dữ liệu trên thiết bị…
          </Typography>
        ) : null}
        {query.isError ? (
          <>
            <Typography color="textSecondary" variant="bodyLarge">
              {errorMessage}
            </Typography>
            <PrimaryButton
              label="Thử lại"
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
          reason={entry.explanation}
          {...(entry.suggestion ? { suggestion: entry.suggestion } : {})}
          onDismiss={() => setEntry(null)}
          onSave={async (details) => {
            const createdAt = new Date().toISOString();
            await saveCareActivity({
              id: createId(),
              mutationId: createId(),
              plantId: entry.plantId,
              type: entry.activityType,
              occurredAt: details.occurredAt,
              origin: "today",
              amount: details.amount,
              notes: details.notes,
              createdAt,
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
