import type { WeatherLocation, WeatherSnapshot } from "../models/weather";
import { loadWeather, WeatherNetworkError } from "./load-weather";

const location: WeatherLocation = {
  label: "Quận 7, Thành phố Hồ Chí Minh",
  latitude: 10.74,
  longitude: 106.72,
  updatedAt: "2026-07-16T08:00:00.000Z",
};

const snapshot: WeatherSnapshot = {
  condition: "cloudy",
  fetchedAt: "2026-07-16T08:45:00.000Z",
  location,
  metrics: {
    humidityPercent: 78,
    rainChancePercent: 45,
    temperatureCelsius: 30,
    windSpeedKph: 9,
  },
  observedAt: "2026-07-16T08:30:00.000Z",
  source: "Open-Meteo",
};

function createDependencies({
  cachedWeather = snapshot,
  fetchError,
  savedLocation = location,
}: {
  cachedWeather?: WeatherSnapshot | null;
  fetchError?: Error;
  savedLocation?: WeatherLocation | null;
} = {}) {
  return {
    fetchCurrentWeather: jest.fn(async () => {
      if (fetchError) throw fetchError;
      return {
        condition: "clear" as const,
        metrics: snapshot.metrics,
        observedAt: "2026-07-16T09:00:00.000Z",
        source: "Open-Meteo",
      };
    }),
    getCachedWeather: jest.fn(async () => cachedWeather),
    getGrowingLocation: jest.fn(async () => savedLocation),
    now: () => new Date("2026-07-16T09:00:00.000Z"),
    saveWeather: jest.fn(async () => undefined),
  };
}

describe("loadWeather", () => {
  it("returns an explicit setup state before a growing location is saved", async () => {
    const dependencies = createDependencies({
      cachedWeather: null,
      savedLocation: null,
    });

    await expect(loadWeather(dependencies)).resolves.toEqual({
      reason: "not-configured",
      status: "unavailable",
    });
    expect(dependencies.fetchCurrentWeather).not.toHaveBeenCalled();
  });

  it("uses a fresh cached observation without a network request", async () => {
    const dependencies = createDependencies();

    await expect(loadWeather(dependencies)).resolves.toMatchObject({
      status: "available",
      condition: "cloudy",
    });
    expect(dependencies.fetchCurrentWeather).not.toHaveBeenCalled();
  });

  it("keeps a stale cached observation when refresh is offline", async () => {
    const dependencies = createDependencies({
      cachedWeather: {
        ...snapshot,
        fetchedAt: "2026-07-16T06:00:00.000Z",
      },
      fetchError: new WeatherNetworkError(),
    });

    await expect(loadWeather(dependencies)).resolves.toMatchObject({
      status: "stale",
      condition: "cloudy",
    });
  });

  it("reports offline when no cached observation exists", async () => {
    const dependencies = createDependencies({
      cachedWeather: null,
      fetchError: new WeatherNetworkError(),
    });

    await expect(loadWeather(dependencies)).resolves.toEqual({
      status: "offline",
    });
  });
});
