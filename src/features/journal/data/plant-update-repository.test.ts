import { plantUpdateFromRows, plantUpdateToInsertParams, type PlantUpdatePhotoRow, type PlantUpdateRow } from "./plant-update-repository";
import type { PlantUpdate } from "../models/plant-update";

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
  notes: "Đã chụp ảnh chồi mới.",
  stageId: "grape.stage.bud-break",
  photos: [photo],
  createdAt: "2026-07-13T15:00:00.000Z",
};

const row: PlantUpdateRow = {
  id: update.id,
  mutation_id: update.mutationId,
  plant_id: update.plantId,
  occurred_at: update.occurredAt,
  notes: update.notes,
  stage_id: update.stageId,
  created_at: update.createdAt,
};

const photoRow: PlantUpdatePhotoRow = {
  id: photo.id,
  plant_update_id: update.id,
  local_uri: photo.localUri,
  position: 0,
  created_at: photo.createdAt,
};

describe("plant update repository mapping", () => {
  it("maps update fields to SQLite parameters", () => {
    expect(plantUpdateToInsertParams(update)).toEqual([
      update.id,
      update.mutationId,
      update.plantId,
      update.occurredAt,
      update.notes,
      update.stageId,
      update.createdAt,
    ]);
  });

  it("rebuilds an update with photos ordered by position", () => {
    const secondPhoto: PlantUpdatePhotoRow = { ...photoRow, id: "397a9ba6-509f-4d65-a9ba-60f925c24729", local_uri: "file:///second.jpg", position: 1 };

    expect(plantUpdateFromRows(row, [secondPhoto, photoRow])).toEqual({ ...update, photos: [photo, {
      id: secondPhoto.id,
      localUri: secondPhoto.local_uri,
      position: secondPhoto.position,
      createdAt: secondPhoto.created_at,
    }] });
  });
});
