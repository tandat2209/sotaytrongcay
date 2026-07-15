import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { getPreviewPlantKnowledge } from "@/features/knowledge";
import { getPlant, resolvePlantIdentity } from "@/features/plants";
import {
  reconcilePlantCarePlanReminders,
  type ReminderReconciliation,
} from "@/features/reminders";
import { createId } from "@/shared/lib/identifiers";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { Typography } from "@/shared/ui/Typography";
import { colors, spacing } from "@/shared/ui/theme";
import { listPlantUpdates } from "../data/plant-update-repository";
import { getLatestPlantPhoto } from "../models/plant-update";
import { savePlantUpdateWithPhotos } from "../application/save-plant-update";
import { PlantUpdateScreen, type PlantUpdateDraft } from "./PlantUpdateScreen";

type Props = Readonly<{
  onBack: () => void;
  onReviewReminders: () => void;
  onSaved: () => void;
  plantId: string;
}>;

export function PlantUpdateRouteScreen({
  onBack,
  onReviewReminders,
  onSaved,
  plantId,
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
    queryFn: () => listPlantUpdates(plantId),
  });
  if (query.isPending) return <Text>Đang tải dữ liệu trên thiết bị…</Text>;
  if (query.isError)
    return (
      <>
        <Text>
          {query.error instanceof z.ZodError
            ? "Dữ liệu trên thiết bị chưa hợp lệ."
            : "Chưa thể tải cây."}
        </Text>
        <PrimaryButton label="Thử lại" onPress={() => void query.refetch()} />
      </>
    );
  if (!query.data)
    return (
      <>
        <Text>Không tìm thấy cây trồng.</Text>
        <PrimaryButton label="Quay lại Cây trồng" onPress={onBack} />
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
        imageUri={getLatestPlantPhoto(photosQuery.data ?? [])?.localUri ?? null}
        initialStageId={plant.stageId}
        onBack={onBack}
        onSave={save}
        plantName={plant.name}
        speciesTitle={identity.speciesTitle}
        stages={stages}
      />
      <BottomSheet
        footer={
          <View style={styles.sheetActions}>
            <PrimaryButton
              backgroundColor={colors.surfaceSubtle}
              label="Đóng"
              onPress={() => {
                setReconciliation(null);
                onSaved();
              }}
              textColor={colors.text}
            />
            <PrimaryButton
              label="Xem kế hoạch chăm sóc"
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
        title="Kế hoạch chăm sóc đã được cập nhật"
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
    activated && `Đã áp dụng: ${activated}`,
    deactivated && `Đã tắt: ${deactivated}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const styles = StyleSheet.create({
  sheetActions: { gap: spacing.sm },
});
