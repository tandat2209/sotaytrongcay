import { getPersistentPhotoName } from "./journal-photo-storage";

describe("getPersistentPhotoName", () => {
  const photoId = "7174d8e3-df23-4f13-9e06-245ebfc9877b";

  it("keeps a supported image extension", () => {
    expect(
      getPersistentPhotoName(photoId, "IMG_1234.HEIC", "file:///cache/image"),
    ).toBe(`${photoId}.heic`);
  });

  it("falls back to jpg for an unsupported extension", () => {
    expect(
      getPersistentPhotoName(photoId, "../../plant.exe", "file:///cache/image"),
    ).toBe(`${photoId}.jpg`);
  });

  it("uses the source URI extension when the picker has no filename", () => {
    expect(
      getPersistentPhotoName(photoId, null, "file:///cache/image.png?edited=1"),
    ).toBe(`${photoId}.png`);
  });
});
