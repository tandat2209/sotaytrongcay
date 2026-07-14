import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { z } from "zod";

import { evaluateCarePlans } from "@/features/guidance";
import { CareEntryScreen, listCareActivities, listPlantUpdates, saveCareActivity, type CareActivityType } from "@/features/journal";
import { createId } from "@/shared/lib/identifiers";
import { getStagePlaybook, listCarePlans } from "@/features/knowledge";
import { listPlants, resolvePlantIdentity } from "@/features/plants";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Screen } from "@/shared/ui/Screen";
import { Typography } from "@/shared/ui/Typography";
import { createTodayProjection } from "../models/today-projection";
import { TodayHeader } from "./TodayHeader";
import { TodayOverview } from "./TodayOverview";

export function TodayScreen() {
  const queryClient = useQueryClient();
  const [entry, setEntry] = useState<Readonly<{ plantId: string; type: CareActivityType }> | null>(null);
  const query = useQuery({
    queryKey: ["today"],
    queryFn: async () => {
      const [activities, plants, updates] = await Promise.all([listCareActivities(), listPlants(), listPlantUpdates()]);
      const evaluations = plants.flatMap((plant) => evaluateCarePlans({
        activities,
        evaluatedAt: new Date(),
        plant,
        plans: listCarePlans({
          speciesId: plant.speciesId,
          stageId: plant.stageId,
        }),
      }));
      return createTodayProjection({ activities, evaluations, plants, updates });
    },
  });
  const errorMessage = query.error instanceof z.ZodError ? "Dữ liệu trên thiết bị chưa hợp lệ." : "Chưa thể tải trang Hôm nay.";

  const plant = entry ? query.data?.plants.find((item) => item.id === entry.plantId) : null;
  const identity = plant ? resolvePlantIdentity(plant) : null;
  const plan = plant && entry ? listCarePlans({ speciesId: plant.speciesId, stageId: plant.stageId }).find((item) => item.activityType === entry.type) : null;
  const evaluation = query.data?.evaluations.find((item) => item.plantId === entry?.plantId && item.activityType === entry.type);
  const stageObjective = plant ? getStagePlaybook(plant.stageId)?.primaryObjective : undefined;
  const entryReason = evaluation?.explanation || stageObjective;
  const entrySuggestion = plan?.recommendedInputs?.map((input) => input.examples).join(" · ");
  return <>
    <Screen introduction={<TodayHeader />} title="Hôm nay">
      {query.isPending ? <Typography color="textSecondary" variant="bodyLarge">Đang tải dữ liệu trên thiết bị…</Typography> : null}
      {query.isError ? <><Typography color="textSecondary" variant="bodyLarge">{errorMessage}</Typography><PrimaryButton label="Thử lại" onPress={() => void query.refetch()} /></> : null}
      {query.data ? <TodayOverview onAddPlant={() => router.push("/plants/new")} onOpenActivity={(id) => router.push(`/entries/${id}`)} onOpenJournal={() => router.push("/journal")} onOpenPlant={(id) => router.push(`/plants/${id}`)} onRecordCare={(plantId, type) => setEntry({ plantId, type })} projection={query.data} /> : null}
    </Screen>
    {entry && plant && identity ? <CareEntryScreen {...(entryReason ? { reason: entryReason } : {})} {...(entrySuggestion ? { suggestion: entrySuggestion } : {})} onDismiss={() => setEntry(null)} onSave={async (details) => {
      const createdAt = new Date().toISOString();
      await saveCareActivity({ id: createId(), mutationId: createId(), plantId: entry.plantId, type: entry.type, occurredAt: details.occurredAt, origin: "today", amount: details.amount, notes: details.notes, createdAt });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["plant-detail", entry.plantId] }), queryClient.invalidateQueries({ queryKey: ["today"] }), queryClient.invalidateQueries({ queryKey: ["journal"] })]);
      setEntry(null);
    }} imageUri={query.data?.plantPhotoUris[plant.id] ?? null} plantName={plant.name} speciesTitle={identity.speciesTitle} stageId={plant.stageId} stageTitle={identity.stageTitle} type={entry.type} visible /> : null}
  </>;
}
