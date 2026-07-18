import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { z } from "zod";
import {
  CareEntryScreen,
  createFertilizerApplicationRecords,
  getLatestPlantPhotoUri,
  getCareActivity,
  listFertilizerApplications,
  saveCareActivityWithApplications,
  updateCareActivityWithApplications,
  type CareActivity,
  type FertilizerApplication,
  type CareActivityType,
} from "@/features/journal";
import { t } from "@/shared/i18n";
import {
  getStagePlaybook,
  listCarePlans,
  listSprayTargets,
} from "@/features/knowledge";
import { getPlant, resolvePlantIdentity, type Plant } from "@/features/plants";
import { reconcilePlantCarePlanReminders } from "@/features/reminders";
import { createId } from "@/shared/lib/identifiers";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";

const CareRouteSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["watering", "fertilizing", "spraying"]),
  origin: z.enum(["today", "reminder", "manual"]).optional(),
  activityId: z.string().uuid().optional(),
});

export default function CareEntryRoute() {
  const {
    id,
    origin = "manual",
    activityId,
    type,
  } = CareRouteSchema.parse(useLocalSearchParams());
  const plantQuery = useQuery({
    queryKey: ["plant", id],
    queryFn: () => getPlant(id),
  });
  const photosQuery = useQuery({
    queryKey: ["plant-photos", id],
    queryFn: () => getLatestPlantPhotoUri(id),
  });
  const activityQuery = useQuery({
    enabled: Boolean(activityId),
    queryKey: ["activity", activityId],
    queryFn: async () => {
      if (!activityId) return null;
      const activity = await getCareActivity(activityId);
      if (!activity) return null;
      return {
        activity,
        applications: await listFertilizerApplications(activity.id),
      };
    },
  });
  if (plantQuery.isPending || activityQuery.isPending) return <LoadingScreen />;
  if (activityId && !activityQuery.data)
    return <Text>{t("journal.error.activityGone")}</Text>;
  if (plantQuery.isError)
    return (
      <>
        <Text>{t("plants.error.load")}</Text>
        <PrimaryButton
          label={t("common.actions.retry")}
          onPress={() => void plantQuery.refetch()}
        />
      </>
    );
  if (!plantQuery.data)
    return (
      <>
        <Text>{t("plants.error.notFound")}</Text>
        <PrimaryButton
          label={t("common.actions.backToPlants")}
          onPress={() => router.replace("/plants")}
        />
      </>
    );
  return (
    <CareEntry
      imageUri={photosQuery.data ?? null}
      {...(activityQuery.data
        ? {
            editingActivity: activityQuery.data.activity,
            existingApplications: activityQuery.data.applications,
          }
        : {})}
      origin={origin}
      plant={plantQuery.data}
      type={type}
    />
  );
}

function CareEntry({
  imageUri,
  editingActivity,
  existingApplications = [],
  origin,
  plant,
  type,
}: Readonly<{
  imageUri: string | null;
  editingActivity?: CareActivity;
  existingApplications?: readonly FertilizerApplication[];
  origin: "today" | "reminder" | "manual";
  plant: Plant;
  type: CareActivityType;
}>) {
  const queryClient = useQueryClient();
  const identity = resolvePlantIdentity(plant);
  const plan = listCarePlans({
    speciesId: plant.speciesId,
    stageId: plant.stageId,
  }).find((candidate) => candidate.activityType === type);
  const reason = getStagePlaybook(plant.stageId)?.primaryObjective;
  const suggestion = plan?.recommendedInputs
    ?.flatMap((input) => input.suggestions)
    .map(({ name }) => name)
    .join(" · ");
  return (
    <CareEntryScreen
      {...(plan?.fertilizerSuggestions
        ? { fertilizerSuggestions: plan.fertilizerSuggestions }
        : {})}
      {...(reason ? { reason } : {})}
      {...(suggestion && type !== "fertilizing" ? { suggestion } : {})}
      onDismiss={() => router.back()}
      onSave={async (details) => {
        const now = new Date().toISOString();
        const activityId = editingActivity?.id ?? createId();
        const command = {
          activity: {
            id: activityId,
            mutationId: editingActivity?.mutationId ?? createId(),
            plantId: plant.id,
            type,
            occurredAt: details.occurredAt,
            origin: editingActivity?.origin ?? origin,
            intensity: details.intensity,
            estimatedAmountLiters: details.estimatedAmountLiters,
            sprayTargetId: details.sprayTargetId,
            sprayTargetNameSnapshot: details.sprayTargetNameSnapshot,
            notes: details.notes,
            createdAt: editingActivity?.createdAt ?? now,
          },
          applications: createFertilizerApplicationRecords(
            activityId,
            details.fertilizerApplications,
            createId,
          ),
        };
        if (editingActivity) {
          await updateCareActivityWithApplications(command);
        } else {
          await saveCareActivityWithApplications(command);
        }
        await reconcilePlantCarePlanReminders(plant);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["plant-detail", plant.id],
          }),
          queryClient.invalidateQueries({ queryKey: ["today"] }),
          queryClient.invalidateQueries({ queryKey: ["reminders"] }),
          queryClient.invalidateQueries({ queryKey: ["journal"] }),
          queryClient.invalidateQueries({ queryKey: ["activity", activityId] }),
        ]);
        router.back();
      }}
      imageUri={imageUri}
      {...(editingActivity
        ? {
            initialDetails: {
              estimatedAmountLiters: editingActivity.estimatedAmountLiters,
              fertilizerApplications: existingApplications.map(
                (application) => ({
                  userFertilizerId: application.userFertilizerId,
                  nameSnapshot: application.nameSnapshot,
                  groupSnapshot: application.groupSnapshot,
                  knowledgeIdSnapshot: application.knowledgeIdSnapshot,
                  amountValue: application.amountValue,
                  amountUnit: application.amountUnit,
                  applicationMethod: application.applicationMethod,
                  notes: application.notes,
                }),
              ),
              intensity: editingActivity.intensity,
              notes: editingActivity.notes,
              occurredAt: editingActivity.occurredAt,
              sprayTargetId: editingActivity.sprayTargetId ?? null,
              sprayTargetNameSnapshot:
                editingActivity.sprayTargetNameSnapshot ?? null,
            },
          }
        : {})}
      plantName={plant.name}
      speciesTitle={identity.speciesTitle}
      sprayTargets={listSprayTargets(plant.speciesId)}
      stageId={plant.stageId}
      stageTitle={identity.stageTitle}
      type={type}
      visible
    />
  );
}
