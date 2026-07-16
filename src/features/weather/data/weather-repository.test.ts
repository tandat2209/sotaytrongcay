import {
  weatherLocationFromRow,
  weatherSnapshotFromRow,
} from "./weather-repository";

describe("weather repository mapping", () => {
  it("maps normalized SQLite rows into a weather snapshot", () => {
    expect(
      weatherSnapshotFromRow({
        condition: "showers",
        fetched_at: "2026-07-16T09:00:00.000Z",
        humidity_percent: 80,
        location_label: "Quận 7, Thành phố Hồ Chí Minh",
        latitude: 10.74,
        longitude: 106.72,
        observed_at: "2026-07-16T08:45:00.000Z",
        rain_chance_percent: 75,
        source: "Open-Meteo",
        temperature_celsius: 29.4,
        updated_at: "2026-07-15T09:00:00.000Z",
        wind_speed_kph: 12.1,
      }),
    ).toMatchObject({
      condition: "showers",
      location: {
        label: "Quận 7, Thành phố Hồ Chí Minh",
        latitude: 10.74,
        longitude: 106.72,
      },
      metrics: { windSpeedKph: 12.1 },
    });
  });

  it("maps a saved growing location", () => {
    expect(
      weatherLocationFromRow({
        label: "Đà Lạt",
        latitude: 11.94,
        longitude: 108.46,
        updated_at: "2026-07-16T09:00:00.000Z",
      }),
    ).toEqual({
      label: "Đà Lạt",
      latitude: 11.94,
      longitude: 108.46,
      updatedAt: "2026-07-16T09:00:00.000Z",
    });
  });
});
