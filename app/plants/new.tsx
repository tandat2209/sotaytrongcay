import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { savePlantUpdateWithPhotos } from "@/features/journal";
import { createId } from "@/shared/lib/identifiers";
import { reconcilePlantCarePlanReminders } from "@/features/reminders";
import {
  deletePlant,
  savePlant,
} from "@/features/plants/data/plant-repository";
import { createInitialPlantPhotoCommand } from "@/features/plants/models/initial-plant-photo";
import { CreatePlantScreen } from "@/features/plants/ui/CreatePlantScreen";

export default function NewPlantRoute() {
  const queryClient = useQueryClient();

  return (
    <CreatePlantScreen
      onBack={() => router.back()}
      onSave={async (draft) => {
        const id = createId();
        const createdAt = new Date().toISOString();
        const { initialPhoto, ...plantDraft } = draft;
        const plant = { ...plantDraft, id, createdAt };
        await savePlant(plant);
        if (initialPhoto) {
          try {
            await savePlantUpdateWithPhotos(
              createInitialPlantPhotoCommand({
                createdAt,
                fileName: initialPhoto.fileName,
                mutationId: createId(),
                photoId: createId(),
                plantId: id,
                sourceUri: initialPhoto.uri,
                stageHistoryId: createId(),
                stageId: plant.stageId,
                updateId: createId(),
              }),
            );
          } catch (error) {
            await deletePlant(id);
            throw error;
          }
        }
        await reconcilePlantCarePlanReminders(plant);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["plants"] }),
          queryClient.invalidateQueries({ queryKey: ["plant-photos"] }),
          queryClient.invalidateQueries({ queryKey: ["today"] }),
          queryClient.invalidateQueries({ queryKey: ["journal"] }),
        ]);
        router.replace({ pathname: "/plants/[id]", params: { id } });
      }}
    />
  );
}
