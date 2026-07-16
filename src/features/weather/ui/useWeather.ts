import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { captureDeviceGrowingLocation } from "../data/device-location";
import { fetchOpenMeteoWeather } from "../data/open-meteo-provider";
import {
  getCachedWeather,
  getGrowingLocation,
  saveGrowingLocation,
  saveWeather,
} from "../data/weather-repository";
import { loadWeather } from "../application/load-weather";
import { WeatherPermissionDeniedError } from "../models/weather-errors";
import type { WeatherState } from "../models/weather";

const weatherQueryKey = ["weather"] as const;

export function useWeather(): Readonly<{
  isUpdating: boolean;
  refresh: () => void;
  updateLocation: () => void;
  weather: WeatherState;
}> {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: () => loadCurrentWeather(),
    queryKey: weatherQueryKey,
    staleTime: 15 * 60 * 1_000,
  });
  const refreshMutation = useMutation({
    mutationFn: () => loadCurrentWeather(true),
    onSuccess: (weather) => queryClient.setQueryData(weatherQueryKey, weather),
  });
  const locationMutation = useMutation({
    mutationFn: async (): Promise<WeatherState> => {
      try {
        const location = await captureDeviceGrowingLocation();
        await saveGrowingLocation(location);
        return await loadCurrentWeather(true);
      } catch (error) {
        return (
          query.data ??
          (error instanceof WeatherPermissionDeniedError
            ? { reason: "permission-denied", status: "unavailable" }
            : { status: "error" })
        );
      }
    },
    onSuccess: (weather) => queryClient.setQueryData(weatherQueryKey, weather),
  });
  const isUpdating = refreshMutation.isPending || locationMutation.isPending;
  const weather =
    isUpdating && !query.data
      ? { status: "loading" as const }
      : (query.data ??
        (query.isError ? { status: "error" } : { status: "loading" }));

  return {
    isUpdating,
    refresh: () => refreshMutation.mutate(),
    updateLocation: () => locationMutation.mutate(),
    weather,
  };
}

async function loadCurrentWeather(forceRefresh = false): Promise<WeatherState> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    return await loadWeather(
      {
        fetchCurrentWeather: (location) =>
          fetchOpenMeteoWeather(location, controller.signal),
        getCachedWeather,
        getGrowingLocation,
        now: () => new Date(),
        saveWeather,
      },
      { forceRefresh },
    );
  } finally {
    clearTimeout(timeout);
  }
}
