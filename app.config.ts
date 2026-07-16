import type { ExpoConfig } from "expo/config";
import { configT } from "./src/shared/i18n/config-copy";

const config: ExpoConfig = {
  name: configT("app.name"),
  slug: "so-tay-trong-cay",
  description:
    "A mobile-first plant-care companion for Vietnamese home growers to track care quickly and receive safe, stage-aware guidance.",
  version: "0.1.0",
  orientation: "portrait",
  scheme: "sotaytrongcay",
  userInterfaceStyle: "light",
  icon: "./assets/branding/logo.png",
  splash: {
    backgroundColor: "#FCF9F8",
    image: "./assets/branding/logo.png",
    resizeMode: "contain",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "vn.sotaytrongcay.app",
  },
  android: {
    package: "vn.sotaytrongcay.app",
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
  },
  plugins: [
    "expo-router",
    "expo-notifications",
    "expo-secure-store",
    "expo-sqlite",
    [
      "expo-location",
      {
        locationWhenInUsePermission: configT("app.permissions.location"),
      },
    ],
    "@react-native-community/datetimepicker",
    [
      "expo-image-picker",
      {
        cameraPermission: configT("app.permissions.camera"),
        microphonePermission: false,
        photosPermission: configT("app.permissions.photos"),
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "f5cde76d-787a-4e7e-be98-c6b7048967a4",
    },
  },
};

export default config;
