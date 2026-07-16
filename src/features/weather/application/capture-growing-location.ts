import type { WeatherLocation } from "../models/weather";
import { WeatherPermissionDeniedError } from "../models/weather-errors";

type Dependencies = Readonly<{
  getCurrentPosition: () => Promise<{
    latitude: number;
    longitude: number;
  }>;
  now: () => Date;
  requestPermission: () => Promise<boolean>;
  reverseGeocode: (location: {
    latitude: number;
    longitude: number;
  }) => Promise<{ city: string | null; district: string | null }>;
}>;

export async function captureGrowingLocation(
  dependencies: Dependencies,
): Promise<WeatherLocation> {
  if (!(await dependencies.requestPermission()))
    throw new WeatherPermissionDeniedError();

  const position = await dependencies.getCurrentPosition();
  const coordinates = {
    latitude: roundCoordinate(position.latitude),
    longitude: roundCoordinate(position.longitude),
  };
  const address = await dependencies.reverseGeocode(coordinates);
  const label = [address.district, address.city]
    .filter((part): part is string => Boolean(part))
    .filter((part, index, values) => values.indexOf(part) === index)
    .join(", ");

  return {
    ...coordinates,
    label: label || "Vị trí trồng cây",
    updatedAt: dependencies.now().toISOString(),
  };
}

function roundCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}
