import { normalizeOpenMeteoResponse } from "./open-meteo-provider";

const response = {
  latitude: 10.82,
  longitude: 106.63,
  generationtime_ms: 0.12,
  utc_offset_seconds: 25_200,
  timezone: "Asia/Ho_Chi_Minh",
  timezone_abbreviation: "+07",
  elevation: 10,
  current_units: {
    time: "unixtime",
    interval: "seconds",
    temperature_2m: "°C",
    relative_humidity_2m: "%",
    precipitation: "mm",
    weather_code: "wmo code",
    wind_speed_10m: "km/h",
  },
  current: {
    time: 1_768_435_200,
    interval: 900,
    temperature_2m: 31.26,
    relative_humidity_2m: 73,
    precipitation: 0,
    weather_code: 61,
    wind_speed_10m: 13.84,
  },
  daily_units: {
    time: "unixtime",
    precipitation_probability_max: "%",
  },
  daily: {
    time: [1_768_406_400],
    precipitation_probability_max: [68],
  },
};

describe("Open-Meteo provider normalization", () => {
  it("normalizes current conditions into the app weather contract", () => {
    expect(normalizeOpenMeteoResponse(response)).toEqual({
      condition: "rain",
      metrics: {
        humidityPercent: 73,
        rainChancePercent: 68,
        temperatureCelsius: 31.3,
        windSpeedKph: 13.8,
      },
      observedAt: "2026-01-15T00:00:00.000Z",
      source: "Open-Meteo",
    });
  });

  it("rejects an incomplete provider response", () => {
    expect(() =>
      normalizeOpenMeteoResponse({ ...response, current: undefined }),
    ).toThrow();
  });
});
