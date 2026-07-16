import { captureGrowingLocation } from "./capture-growing-location";

describe("captureGrowingLocation", () => {
  it("stores only coarse coordinates and a city-level label", async () => {
    await expect(
      captureGrowingLocation({
        getCurrentPosition: async () => ({
          latitude: 10.776_889,
          longitude: 106.700_806,
        }),
        now: () => new Date("2026-07-16T09:00:00.000Z"),
        requestPermission: async () => true,
        reverseGeocode: async () => ({
          city: "Thành phố Hồ Chí Minh",
          district: "Quận 1",
        }),
      }),
    ).resolves.toEqual({
      label: "Quận 1, Thành phố Hồ Chí Minh",
      latitude: 10.78,
      longitude: 106.7,
      updatedAt: "2026-07-16T09:00:00.000Z",
    });
  });
});
