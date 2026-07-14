import { getLatestPlantPhoto, getLatestPlantPhotoUrisByPlant, PlantUpdateSchema, type PlantUpdate } from "./plant-update";

const photo = {
  id: "7174d8e3-df23-4f13-9e06-245ebfc9877b",
  localUri: "file:///plants/a775a7ec/update/photo.jpg",
  position: 0,
  createdAt: "2026-07-13T15:00:00.000Z",
};

const update: PlantUpdate = {
  id: "86ee7489-6147-42b9-b73f-5650ea7fd214",
  mutationId: "c353342e-9fe0-43a3-9d84-1b0ed436011d",
  plantId: "a775a7ec-fb44-4660-88ed-0f3b1933e7f1",
  occurredAt: "2026-07-13T15:00:00.000Z",
  notes: null,
  stageId: "grape.stage.bud-break",
  photos: [photo],
  createdAt: "2026-07-13T15:00:00.000Z",
};

describe("PlantUpdateSchema", () => {
  it("accepts a photo update with an explicit stage snapshot", () => {
    expect(PlantUpdateSchema.parse(update)).toEqual(update);
  });

  it("accepts a note-only update", () => {
    expect(PlantUpdateSchema.parse({ ...update, notes: "Đã buộc lại chồi.", photos: [] }).notes).toBe("Đã buộc lại chồi.");
  });

  it("rejects an update without a photo or note", () => {
    expect(() => PlantUpdateSchema.parse({ ...update, photos: [] })).toThrow("Thêm ảnh hoặc ghi chú trước khi lưu.");
  });

  it("rejects duplicate photo positions", () => {
    expect(() => PlantUpdateSchema.parse({ ...update, photos: [photo, { ...photo, id: "8a41defa-4dab-4983-a83b-326c730dd907" }] })).toThrow("Vị trí ảnh không được trùng nhau.");
  });

  it("selects the first photo from the newest photo-bearing update", () => {
    const older = { ...update, occurredAt: "2026-07-12T15:00:00.000Z" };
    const newer = {
      ...update,
      id: "8a41defa-4dab-4983-a83b-326c730dd907",
      mutationId: "e5ba0d31-9de3-433b-b475-4d8bec3b6a48",
      occurredAt: "2026-07-13T15:00:00.000Z",
      photos: [
        { ...photo, id: "397a9ba6-509f-4d65-a9ba-60f925c24729", localUri: "file:///second.jpg", position: 1 },
        { ...photo, id: "1a59ddf4-dbb2-4587-9834-bb890c003e05", localUri: "file:///first.jpg", position: 0 },
      ],
    };

    expect(getLatestPlantPhoto([older, newer])?.localUri).toBe("file:///first.jpg");
  });

  it("ignores a newer note-only update when selecting the latest photo", () => {
    const noteOnly = { ...update, id: "8a41defa-4dab-4983-a83b-326c730dd907", mutationId: "e5ba0d31-9de3-433b-b475-4d8bec3b6a48", notes: "Chồi phát triển tốt.", photos: [] };
    const photoUpdate = { ...update, occurredAt: "2026-07-12T15:00:00.000Z" };

    expect(getLatestPlantPhoto([noteOnly, photoUpdate])?.localUri).toBe(photo.localUri);
  });

  it("resolves the latest persisted photo independently for each plant", () => {
    const secondPlantId = "f775a7ec-fb44-4660-88ed-0f3b1933e7f1";
    const olderPhoto = { ...update, occurredAt: "2026-07-12T15:00:00.000Z" };
    const newerPhoto = {
      ...update,
      id: "8a41defa-4dab-4983-a83b-326c730dd907",
      mutationId: "e5ba0d31-9de3-433b-b475-4d8bec3b6a48",
      occurredAt: "2026-07-14T15:00:00.000Z",
      photos: [{ ...photo, id: "397a9ba6-509f-4d65-a9ba-60f925c24729", localUri: "file:///latest.jpg" }],
    };
    const secondPlantPhoto = {
      ...update,
      id: "1a59ddf4-dbb2-4587-9834-bb890c003e05",
      mutationId: "eac6d08c-623f-42d6-a5ec-743f50e7acb0",
      plantId: secondPlantId,
      photos: [{ ...photo, id: "ccdf5e42-8510-4dd7-a82a-82f0ff4aa581", localUri: "file:///second-plant.jpg" }],
    };

    expect(getLatestPlantPhotoUrisByPlant([olderPhoto, secondPlantPhoto, newerPhoto])).toEqual({
      [update.plantId]: "file:///latest.jpg",
      [secondPlantId]: "file:///second-plant.jpg",
    });
  });
});
