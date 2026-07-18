type InitialPlantPhotoInput = Readonly<{
  createdAt: string;
  fileName: string | null;
  mutationId: string;
  photoId: string;
  plantId: string;
  sourceUri: string;
  stageHistoryId: string;
  stageId: string;
  updateId: string;
}>;

export function createInitialPlantPhotoCommand(input: InitialPlantPhotoInput) {
  return {
    createdAt: input.createdAt,
    id: input.updateId,
    mutationId: input.mutationId,
    notes: null,
    occurredAt: input.createdAt,
    photos: [
      {
        createdAt: input.createdAt,
        fileName: input.fileName,
        id: input.photoId,
        position: 0,
        sourceUri: input.sourceUri,
      },
    ],
    plantId: input.plantId,
    stageHistoryId: input.stageHistoryId,
    stageId: input.stageId,
  };
}
