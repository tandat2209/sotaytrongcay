import * as Location from "expo-location";
import { captureGrowingLocation } from "../application/capture-growing-location";
import type { WeatherLocation } from "../models/weather";

export async function captureDeviceGrowingLocation(): Promise<WeatherLocation> {
  return await captureGrowingLocation({
    getCurrentPosition: async () => {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    },
    now: () => new Date(),
    requestPermission: async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      return permission.status === Location.PermissionStatus.GRANTED;
    },
    reverseGeocode: async (coordinates) => {
      try {
        const [address] = await Location.reverseGeocodeAsync(coordinates);
        return {
          city: address?.city ?? address?.region ?? null,
          district: address?.district ?? address?.subregion ?? null,
        };
      } catch {
        return { city: null, district: null };
      }
    },
  });
}
