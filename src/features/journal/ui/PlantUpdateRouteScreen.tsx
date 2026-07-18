import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import type { Plant, PlantIdentityData } from "@/features/plants";
import type { ReminderReconciliation } from "@/features/reminders";
import { t } from "@/shared/i18n";
import { createId } from "@/shared/lib/identifiers";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { LoadingScreen } from "@/shared/ui/LoadingScreen";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { getLatestPlantPhotoUri } from "../data/plant-update-repository";
import { savePlantUpdateWithPhotos } from "../application/save-plant-update";
import { PlantUpdateScreen, type PlantUpdateDraft } from "./PlantUpdateScreen";
import type { PlantIdentityComponent } from "./plant-identity-types";

type Props = Readonly<{
  getPlant: (plantId: string) => Promise<Plant | null>;
  onBack: () => void;
  onReviewReminders: () => void;
  onSaved: () => void;
  plantIdentityComponent: PlantIdentityComponent;
  plantId: string;
  reconcilePlantCarePlanReminders: (
    plant: Plant,
    previousPlant?: Plant,
  ) => Promise<ReminderReconciliation>;
  resolvePlantIdentity: (plant: Plant) => PlantIdentityData;
}>;

export function PlantUpdateRouteScreen({
  getPlant,
  onBack,
  onReviewReminders,
  onSaved,
  plantIdentityComponent,
  plantId,
  reconcilePlantCarePlanReminders,
  resolvePlantIdentity,
}: Props) {
  const queryClient = useQueryClient();
  const [reconciliation, setReconciliation] =
    useState<ReminderReconciliation | null>(null);
  const query = useQuery({
    queryKey: ["plant", plantId],
    queryFn: () => getPlant(plantId),
  });
  const photosQuery = useQuery({
    queryKey: ["plant-photos", plantId],
    queryFn: () => getLatestPlantPhotoUri(plantId),
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

  const plant = query.data;
  const identity = resolvePlantIdentity(plant);
  const knowledge = getPreviewPlantKnowledge(plant.speciesId);
  const stages = knowledge?.stages ?? [
    { id: plant.stageId, title: identity.stageTitle },
  ];

  async function save(draft: PlantUpdateDraft) {
    const createdAt = new Date().toISOString();
    await savePlantUpdateWithPhotos({
      id: createId(),
      mutationId: createId(),
      plantId,
      occurredAt: draft.occurredAt,
      notes: draft.notes,
      stageId: draft.stageId,
      createdAt,
      stageHistoryId: createId(),
      photos: draft.photos.map((photo, position) => ({
        id: createId(),
        sourceUri: photo.uri,
        fileName: photo.fileName,
        position,
        createdAt,
      })),
    });
    const stageChanged = draft.stageId !== plant.stageId;
    const updatedPlant = stageChanged
      ? { ...plant, stageId: draft.stageId, stageStartedAt: draft.occurredAt }
      : plant;
    const reminderUpdate = stageChanged
      ? await reconcilePlantCarePlanReminders(updatedPlant, plant)
      : null;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["plant", plantId] }),
      queryClient.invalidateQueries({ queryKey: ["plant-detail", plantId] }),
      queryClient.invalidateQueries({ queryKey: ["plants"] }),
      queryClient.invalidateQueries({ queryKey: ["plant-photos"] }),
      queryClient.invalidateQueries({ queryKey: ["today"] }),
      queryClient.invalidateQueries({ queryKey: ["journal"] }),
      queryClient.invalidateQueries({ queryKey: ["reminders"] }),
    ]);
    if (
      reminderUpdate &&
      (reminderUpdate.activated.length > 0 ||
        reminderUpdate.deactivated.length > 0)
    ) {
      setReconciliation(reminderUpdate);
    } else {
      onSaved();
    }
  }

  return (
    <>
      <PlantUpdateScreen
        imageUri={photosQuery.data ?? null}
        initialStageId={plant.stageId}
        onBack={onBack}
        onSave={save}
        plantIdentityComponent={plantIdentityComponent}
        plantName={plant.name}
        speciesTitle={identity.speciesTitle}
        stages={stages}
      />
      <BottomSheet
        footer={
          <View style={styles.sheetActions}>
            <PrimaryButton
              backgroundColor={colors.surfaceSubtle}
              label={t("journal.update.close")}
              onPress={() => {
                setReconciliation(null);
                onSaved();
              }}
              textColor={colors.text}
            />
            <PrimaryButton
              label={t("journal.update.viewCarePlan")}
              onPress={() => {
                setReconciliation(null);
                onReviewReminders();
              }}
            />
          </View>
        }
        onDismiss={() => {
          setReconciliation(null);
          onSaved();
        }}
        title={t("journal.update.planChangedTitle")}
        visible={reconciliation !== null}
      >
        <Typography color="textSecondary" variant="bodyMedium">
          {reconciliation ? formatScheduleChanges(reconciliation) : ""}
        </Typography>
      </BottomSheet>
    </>
  );
}

function formatScheduleChanges(reconciliation: ReminderReconciliation): string {
  const activated = reconciliation.activated.slice(0, 3).join(" · ");
  const deactivated = reconciliation.deactivated.slice(0, 3).join(" · ");
  return [
    activated && t("journal.update.appliedPlan", { plan: activated }),
    deactivated && t("journal.update.deactivatedPlan", { plan: deactivated }),
  ]
    .filter(Boolean)
    .join("\n");
}

const styles = StyleSheet.create({
  sheetActions: { gap: spacing.sm },
});
