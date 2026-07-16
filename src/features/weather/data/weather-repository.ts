import type { WeatherLocation, WeatherSnapshot } from "../models/weather";
import {
  WeatherLocationSchema,
  WeatherSnapshotSchema,
} from "../models/weather";
import { getDb, withDatabaseWriteTransaction } from "@/shared/lib/db/database";

export type WeatherLocationRow = Readonly<{
  label: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}>;

export type WeatherSnapshotRow = Readonly<{
  condition: string;
  fetched_at: string;
  humidity_percent: number;
  location_label: string;
  latitude: number;
  longitude: number;
  observed_at: string;
  rain_chance_percent: number;
  source: string;
  temperature_celsius: number;
  updated_at: string;
  wind_speed_kph: number;
}>;

export function weatherLocationFromRow(
  row: WeatherLocationRow,
): WeatherLocation {
  return WeatherLocationSchema.parse({
    label: row.label,
    latitude: row.latitude,
    longitude: row.longitude,
    updatedAt: row.updated_at,
  });
}

export function weatherSnapshotFromRow(
  row: WeatherSnapshotRow,
): WeatherSnapshot {
  return WeatherSnapshotSchema.parse({
    condition: row.condition,
    fetchedAt: row.fetched_at,
    location: weatherLocationFromRow({
      label: row.location_label,
      latitude: row.latitude,
      longitude: row.longitude,
      updated_at: row.updated_at,
    }),
    metrics: {
      humidityPercent: row.humidity_percent,
      rainChancePercent: row.rain_chance_percent,
      temperatureCelsius: row.temperature_celsius,
      windSpeedKph: row.wind_speed_kph,
    },
    observedAt: row.observed_at,
    source: row.source,
  });
}

export async function getGrowingLocation(): Promise<WeatherLocation | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<WeatherLocationRow>(
    "SELECT label, latitude, longitude, updated_at FROM weather_locations WHERE id = 'growing-location'",
  );
  return row ? weatherLocationFromRow(row) : null;
}

export async function getCachedWeather(): Promise<WeatherSnapshot | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<WeatherSnapshotRow>(
    `SELECT cache.condition, cache.fetched_at, cache.humidity_percent,
            location.label AS location_label, location.latitude, location.longitude,
            cache.observed_at, cache.rain_chance_percent, cache.source,
            cache.temperature_celsius, location.updated_at, cache.wind_speed_kph
       FROM weather_cache cache
       JOIN weather_locations location ON location.id = cache.location_id
      WHERE cache.location_id = 'growing-location'`,
  );
  return row ? weatherSnapshotFromRow(row) : null;
}

export async function saveGrowingLocation(
  location: WeatherLocation,
): Promise<void> {
  const parsed = WeatherLocationSchema.parse(location);
  await withDatabaseWriteTransaction(async (transaction) => {
    await transaction.runAsync("DELETE FROM weather_cache");
    await transaction.runAsync(
      `INSERT INTO weather_locations (id, label, latitude, longitude, updated_at)
       VALUES ('growing-location', ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET label = excluded.label,
         latitude = excluded.latitude, longitude = excluded.longitude,
         updated_at = excluded.updated_at`,
      [parsed.label, parsed.latitude, parsed.longitude, parsed.updatedAt],
    );
  });
}

export async function saveWeather(weather: WeatherSnapshot): Promise<void> {
  const parsed = WeatherSnapshotSchema.parse(weather);
  await withDatabaseWriteTransaction(async (transaction) => {
    await transaction.runAsync(
      `INSERT INTO weather_cache
         (location_id, condition, temperature_celsius, humidity_percent,
          rain_chance_percent, wind_speed_kph, observed_at, fetched_at, source)
       VALUES ('growing-location', ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(location_id) DO UPDATE SET condition = excluded.condition,
         temperature_celsius = excluded.temperature_celsius,
         humidity_percent = excluded.humidity_percent,
         rain_chance_percent = excluded.rain_chance_percent,
         wind_speed_kph = excluded.wind_speed_kph,
         observed_at = excluded.observed_at, fetched_at = excluded.fetched_at,
         source = excluded.source`,
      [
        parsed.condition,
        parsed.metrics.temperatureCelsius,
        parsed.metrics.humidityPercent,
        parsed.metrics.rainChancePercent,
        parsed.metrics.windSpeedKph,
        parsed.observedAt,
        parsed.fetchedAt,
        parsed.source,
      ],
    );
  });
}
