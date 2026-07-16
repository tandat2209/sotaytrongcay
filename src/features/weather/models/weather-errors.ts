export class WeatherNetworkError extends Error {
  constructor() {
    super("Weather network request failed");
    this.name = "WeatherNetworkError";
  }
}

export class WeatherPermissionDeniedError extends Error {
  constructor() {
    super("Location permission was denied");
    this.name = "WeatherPermissionDeniedError";
  }
}
