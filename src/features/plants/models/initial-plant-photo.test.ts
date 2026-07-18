import { createInitialPlantPhotoCommand } from "./initial-plant-photo";

describe("initial plant photo", () => {
  it("creates a photo-only update at the plant's confirmed stage", () => {
    const createdAt = "2026-07-18T08:00:00.000Z";

    expect(
      createInitialPlantPhotoCommand({
        createdAt,
        fileName: "nho.jpg",
        mutationId: "e61d3ee8-10bb-4d73-b99c-ac2c2ba2dc68",
        photoId: "3297ff24-da96-4d82-84ed-b590141f1891",
        plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
        sourceUri: "file:///cache/nho.jpg",
        stageHistoryId: "d33c2369-9bab-4b64-ac3e-263a49a19a63",
        stageId: "grape.stage.trunk-development",
        updateId: "91e942d3-bd12-4ec9-aa32-093dc68caf60",
      }),
    ).toEqual({
      createdAt,
      id: "91e942d3-bd12-4ec9-aa32-093dc68caf60",
      mutationId: "e61d3ee8-10bb-4d73-b99c-ac2c2ba2dc68",
      notes: null,
      occurredAt: createdAt,
      photos: [
        {
          createdAt,
          fileName: "nho.jpg",
          id: "3297ff24-da96-4d82-84ed-b590141f1891",
          position: 0,
          sourceUri: "file:///cache/nho.jpg",
        },
      ],
      plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
      stageHistoryId: "d33c2369-9bab-4b64-ac3e-263a49a19a63",
      stageId: "grape.stage.trunk-development",
    });
  });
});
